"""Validate the delivery timeline, captions, media streams and decode integrity."""
import argparse
import json
from pathlib import Path
import re
import subprocess


def main():
    p = argparse.ArgumentParser()
    p.add_argument('output', type=Path)
    p.add_argument('--decode', action='store_true')
    args = p.parse_args()
    out = args.output.resolve()
    movie = out / 'LA01_concept_led.mp4'
    plan = json.loads((out / 'plan.json').read_text())
    info = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-show_chapters','-of','json',str(movie)]))
    d = float(info['format']['duration'])
    expected = sum(s['duration'] for s in plan)
    assert 3600 <= d <= 5400, d
    assert abs(d-expected)<.1, (d,expected)
    video = next(s for s in info['streams'] if s['codec_type']=='video')
    audio = next(s for s in info['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'])==(1920,1080)
    assert video['avg_frame_rate']=='30/1'
    assert int(video['nb_frames'])==round(expected*30), video['nb_frames']
    chapters = json.loads((out/'chapters.json').read_text())
    assert len(chapters)==len(info['chapters'])==12
    for actual,wanted in zip(info['chapters'],chapters):
        assert actual['tags']['title']==wanted['title']
        assert abs(float(actual['start_time'])-wanted['start'])<.002
    blocks=(out/'LA01_captions.en.srt').read_text().strip().split('\n\n')
    words=[];last_end=0
    def seconds(s):
        h,m,rest=s.split(':');sec,ms=rest.split(',')
        return int(h)*3600+int(m)*60+int(sec)+int(ms)/1000
    for i,b in enumerate(blocks,1):
        lines=b.splitlines()
        assert int(lines[0])==i
        start,end=[seconds(x) for x in lines[1].split(' --> ')]
        assert start>=last_end-.002 and end>start and end<=d
        words.append(' '.join(lines[2:]));last_end=end
    normalized=lambda text:re.sub(r'\s+',' ',text).strip()
    assert normalized(' '.join(words))==normalized(' '.join(s['text'] for s in plan))
    if args.decode:
        log=out/'decode-check.log'
        with log.open('w') as f:
            subprocess.run(['ffmpeg','-v','error','-threads','4','-i',str(movie),'-map','0:v:0','-map','0:a:0','-f','null','-'],check=True,stderr=f,stdout=subprocess.DEVNULL)
        assert not log.read_text().strip(), log.read_text()[:2000]
    report=dict(duration_seconds=d,duration_minutes=round(d/60,2),chapters=len(chapters),caption_blocks=len(blocks),caption_text='all spoken words matched',frame_count=int(video['nb_frames']),resolution='1920x1080',frame_rate=30,audio_sample_rate=audio['sample_rate'],decode_integrity='passed' if args.decode else 'not run',review='sampled frames and timeline checks; not continuous human playback')
    (out/'quality-report.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report,indent=2))


if __name__=='__main__':
    main()
