"""Reproducible concept-led LA01 edit, local Kokoro + Manim + FFmpeg.

The original render is an illustration library, not the timeline. Compile writes
the complete spoken script and frame-accurate shot list before any rendering.
All generated media lives outside the repository; see README.md.
"""
from __future__ import annotations

import argparse
import ast
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess
import sys
import textwrap

from editorial import CHAPTERS, EDIT, FRESH, OVERRIDES

HERE = Path(__file__).resolve().parent
DEFAULT_REFERENCE = Path('/private/tmp/claude-501/-Users-sumilkhosla-workspace-groundup-lab/4526ee22-2d62-4a4d-9628-05bc10648cd0/scratchpad/la01video')
CLASSES = ['S00Intro', 'S01Views', 'S02Axioms', 'S03Operations', 'S04Span', 'S05Independence', 'S06Exchange', 'S07Subspaces', 'S08Basis', 'S09Sums', 'S10Matrices', 'S11InnerProduct', 'S12Affine', 'S13Numerics', 'S14Outro']


def run(args, **kwargs):
    return subprocess.run([str(x) for x in args], check=True, **kwargs)


def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(path)]))


def duration(path):
    return float(probe(path)['format']['duration'])


def key(text):
    return hashlib.sha1(f'af_heart|1.0|{text}'.encode()).hexdigest()[:16]


def stamp(sec, srt=False):
    ms = round(sec * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}' if srt else (f'{h}:{m:02}:{s:02}' if h else f'{m}:{s:02}')


def compile_plan(ref, out):
    out.mkdir(parents=True, exist_ok=True)
    (out / 'audio').mkdir(exist_ok=True)
    chapter_names = dict(CHAPTERS)
    plan, inputs = [], {}
    for item in EDIT:
        chapter, kind, name, *bounds = item
        if kind == 'fresh':
            for text, action, pause in FRESH[name]:
                plan.append(dict(chapter=chapter, title=chapter_names[chapter], kind='fresh', text=text, action=action, pause=pause, source=f'editorial.py:FRESH[{name!r}]'))
            continue
        src = ref / f'{name}.py'
        tree = ast.parse(src.read_text())
        beats = next(ast.literal_eval(n.value) for n in ast.walk(tree) if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'BEATS' for t in n.targets))
        number = int(name[1:3])
        cues_path = ref / 'cues' / f'{CLASSES[number]}.json'
        cues = json.loads(cues_path.read_text())
        movie = next((ref / 'out' / 'sections').glob(f'{number:02}_*.mp4'))
        inputs[str(movie)] = dict(size=movie.stat().st_size, duration=duration(movie), script_sha256=hashlib.sha256(src.read_bytes()).hexdigest(), cues_sha256=hashlib.sha256(cues_path.read_bytes()).hexdigest())
        assert len(beats) == len(cues), name
        for i in range(bounds[0], bounds[1] + 1):
            cue = cues[i]
            assert cue['text'] == beats[i], (name, i)
            text = OVERRIDES.get((name, i), beats[i])
            end = cues[i + 1]['start'] if i + 1 < len(cues) else inputs[str(movie)]['duration']
            plan.append(dict(chapter=chapter, title=chapter_names[chapter], kind='source', text=text, original_text=beats[i], source=f'{name}:{i}', movie=str(movie), start=cue['start'], end=end, pause=0, replaced=text != beats[i]))
    for i, shot in enumerate(plan):
        shot['id'] = f'{i:03}'
        cached = ref / 'audio' / f'{key(shot["text"])}.wav'
        shot['audio'] = str(cached if cached.exists() else out / 'audio' / cached.name)
    (out / 'plan.json').write_text(json.dumps(plan, indent=2) + '\n')
    (out / 'source-inputs.json').write_text(json.dumps(inputs, indent=2) + '\n')
    write_script(plan, out)
    print(f'Compiled {len(plan)} shots, {sum(len(s["text"].split()) for s in plan):,} spoken words; {sum(s["kind"] == "fresh" for s in plan)} newly animated shots', flush=True)
    return plan


def write_script(plan, out):
    lines = ['# LA01 — concept-led production script and storyboard', '', 'One lesson, one video. Target: 60–90 minutes. Voice: Kokoro af_heart at its original speed.', '', 'Reuses selected existing mathematical animations; new passages and replacement narration are explicit. No exercise-bank or lab-contract tour.', '']
    last = None
    for shot in plan:
        if shot['chapter'] != last:
            lines += [f'## {shot["title"]}', '']
            last = shot['chapter']
        visual = shot.get('action', f'{shot["source"]}, {shot.get("start",0):.2f}–{shot.get("end",0):.2f}s')
        lines += [f'### Shot {shot["id"]}', '', f'Visual: {visual}.', '', shot['text'], '']
        if shot['pause']:
            lines += [f'Thinking pause: {shot["pause"]} seconds.', '']
    (out / 'LA01_SCRIPT_AND_STORYBOARD.md').write_text('\n'.join(lines))


def synthesize(plan, ref, out):
    sys.path.insert(0, str(ref))
    import espeakng_loader
    import numpy as np
    import soundfile as sf
    from kokoro_onnx import EspeakConfig, Kokoro
    missing = {s['audio']: s['text'] for s in plan if not Path(s['audio']).exists()}
    if missing:
        k = Kokoro(str(ref / 'models/kokoro-v1.0.onnx'), str(ref / 'models/voices-v1.0.bin'), espeak_config=EspeakConfig(lib_path=espeakng_loader.get_library_path(), data_path=str(ref / 'esd')))
        for i, (filename, text) in enumerate(missing.items(), 1):
            samples, sr = k.create(text, voice='af_heart', speed=1.0, lang='en-us')
            a = np.asarray(samples)
            nz = np.where(np.abs(a) > .01)[0]
            if len(nz):
                a = a[max(0, nz[0] - int(.03*sr)):min(len(a), nz[-1] + int(.12*sr))]
            tmp = Path(filename).with_suffix('.tmp.wav')
            sf.write(tmp, a, sr)
            os.replace(tmp, filename)
            print(f'Voice {i}/{len(missing)}', flush=True)
    t = 0
    for shot in plan:
        shot['voice_duration'] = sf.info(shot['audio']).duration
        shot['duration'] = math.ceil((shot['voice_duration'] + .4 + shot['pause']) * 30) / 30
        shot['timeline_start'] = t
        t += shot['duration']
    (out / 'plan.json').write_text(json.dumps(plan, indent=2) + '\n')
    print(f'Final planned duration: {stamp(t)} ({t/60:.1f} minutes)', flush=True)
    if not 3600 <= t <= 5400:
        raise ValueError(f'Editorial duration {t/60:.1f}min falls outside 60–90 minute target; revise selection, never pad or speed up narration.')


def render_fresh(plan, ref, out, preview=False):
    env = os.environ.copy()
    env['LA01_OUTPUT'] = str(out)
    env['LA01_PREVIEW'] = '1' if preview else '0'
    env['PYTHONPATH'] = str(HERE)
    logfile = out / ('fresh-preview.log' if preview else 'fresh.log')
    with logfile.open('w') as log:
        run([sys.executable, '-m', 'manim', '--resolution', '1920,1080', '--frame_rate', '30', '--disable_caching', '--progress_bar', 'none', '-v', 'WARNING', '--media_dir', out / 'manim', HERE / 'new_scenes.py', 'FreshReel'], env=env, stdout=log, stderr=subprocess.STDOUT)


def encode_shot(shot, out):
    target = out / 'shots' / f'{shot["id"]}.mp4'
    local = {k:v for k,v in shot.items() if k != 'timeline_start'}
    signature = hashlib.sha256(json.dumps({'pipeline':'software-v2-header96','shot':local}, sort_keys=True).encode()).hexdigest()
    sigfile = target.with_suffix('.sha256')
    if target.exists() and sigfile.exists() and sigfile.read_text() == signature:
        return target
    if shot['kind'] == 'fresh':
        cues = json.loads((out / 'fresh-cues.json').read_text())
        cue = cues[shot['id']]
        movie = out / 'manim/videos/new_scenes/1080p30/FreshReel.mp4'
        start, available = cue['start'], cue['end'] - cue['start']
    else:
        movie, start, available = Path(shot['movie']), shot['start'], shot['end'] - shot['start']
    d = shot['duration']
    # The video is retimed to the spoken beat; speech always stays at native speed.
    # This preserves the illustration's entire action instead of truncating it.
    ratio = d / available
    (out / 'headers').mkdir(exist_ok=True)
    header = out / 'headers' / f'{shot["id"]}.png'
    font = '/System/Library/Fonts/HelveticaNeue.ttc'
    from PIL import Image, ImageDraw, ImageFont
    banner = Image.new('RGB', (1920, 96), '#0e1116')
    ImageDraw.Draw(banner).text((45, 22), shot['title'], fill='#8A93A3', font=ImageFont.truetype(font, 27))
    banner.save(header)
    vf = f'setpts={ratio:.9f}*(PTS-STARTPTS),scale=1920:1080,fps=30,setsar=1'
    # Fade only at discontinuous illustration changes, never between adjacent beats.
    if shot.get('transition'):
        vf += ',fade=t=in:st=0:d=0.15'
    codec = ['-c:v','libx264','-preset','ultrafast','-crf','18','-threads','4']
    cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{start:.6f}', '-t', f'{available:.6f}', '-i', movie, '-i', shot['audio'], '-i', header, '-filter_complex', f'[0:v]{vf},tpad=stop_mode=clone:stop_duration=1[body];[body][2:v]overlay=0:0:eof_action=repeat[v];[1:a]apad[a]', '-map', '[v]', '-map', '[a]', '-t', f'{d:.6f}', *codec, '-pix_fmt', 'yuv420p', '-threads', '2', '-c:a', 'aac', '-ar', '48000', '-ac', '2', '-b:a', '160k', '-video_track_timescale', '15360', target]
    run(cmd, stdout=subprocess.DEVNULL)
    sigfile.write_text(signature)
    return target


def captions_and_metadata(plan, out):
    chapters, captions, t = [], [], 0
    for shot in plan:
        if not chapters or chapters[-1]['id'] != shot['chapter']:
            chapters.append(dict(id=shot['chapter'], title=shot['title'], start=t))
        # Caption timing is proportional within each speech beat, not forced-aligned.
        chunks = []
        for sentence in re.split(r'(?<=[.!?])\s+', shot['text']):
            chunks.extend(textwrap.wrap(sentence, width=78, break_long_words=False, break_on_hyphens=False))
        weights = sum(len(x) for x in chunks)
        pos = t
        for chunk in chunks:
            end = pos + shot['voice_duration'] * len(chunk) / weights
            captions.append(f'{len(captions)+1}\n{stamp(pos, True)} --> {stamp(end, True)}\n' + '\n'.join(textwrap.wrap(chunk, width=42, break_long_words=False, break_on_hyphens=False)) + '\n')
            pos = end
        t += shot['duration']
    (out / 'LA01_captions.en.srt').write_text('\n'.join(captions))
    (out / 'chapters.json').write_text(json.dumps(chapters, indent=2))
    metadata = [';FFMETADATA1', 'title=Vectors, Span and Bases — See What Linear Algebra Is Doing | LA01', 'artist=GroundUp Lab']
    for i, c in enumerate(chapters):
        end = chapters[i+1]['start'] if i+1 < len(chapters) else t
        metadata += ['[CHAPTER]', 'TIMEBASE=1/1000', f'START={round(c["start"]*1000)}', f'END={round(end*1000)}', f'title={c["title"]}']
    (out / 'chapters.ffmeta').write_text('\n'.join(metadata)+'\n')
    title = 'Vectors, Span and Bases: See What Linear Algebra Is Doing | LA01'
    description = 'Why can two movement controls reach a whole plane—or leave you trapped on a line?\n\nBuild an intuitive picture of vectors, span, independence, bases, dimension, subspaces, affine sets, matrices, inner products, and numerical sensitivity. Animated explanations connect each idea to the next, with selected examples and machine-learning applications.\n\nRead the lesson and explore the exercises: https://lab.groundup.workers.dev\n\nChapters\n' + '\n'.join(f'{stamp(c["start"])} {c["title"]}' for c in chapters) + '\n\nNarration uses a locally generated neural voice. Captions included.\n\n#LinearAlgebra #MachineLearning #GroundUpLab\n'
    (out / 'youtube_title.txt').write_text(title+'\n')
    (out / 'youtube_description.txt').write_text(description)
    session = json.loads((out/'studio-session.json').read_text()) if (out/'studio-session.json').exists() else {}
    (out / 'youtube_upload.json').write_text(json.dumps(dict(channel_handle='@grounduplab-ai', channel_id='UCmBIPSDEB4ZhvBBPJ2wDSwQ', playlist_title='Linear Algebra', playlist_id=session.get('playlist_id'), title=title, description=description, privacyStatus='public', selfDeclaredMadeForKids=False, categoryId='27', defaultLanguage='en', tags=['linear algebra', 'vectors', 'span', 'linear independence', 'basis', 'machine learning', 'GroundUp Lab']), indent=2))


def assemble(plan, out, jobs, encode_only=False):
    (out / 'shots').mkdir(exist_ok=True)
    previous = None
    for shot in plan:
        shot['transition'] = shot['kind'] == 'source' and (previous is None or shot['chapter'] != previous['chapter'] or (previous['kind'] == 'source' and (shot['movie'] != previous['movie'] or abs(shot['start'] - previous['end']) > .05)))
        previous = shot
    with ThreadPoolExecutor(max_workers=jobs) as pool:
        selected = [s for s in plan if not encode_only or s['kind'] == 'source']
        futures = {pool.submit(encode_shot, s, out): s for s in selected}
        for i, f in enumerate(as_completed(futures), 1):
            f.result()
            if i % 10 == 0 or i == len(selected):
                print(f'Encoded {i}/{len(selected)} shots', flush=True)
    if encode_only:
        return
    listing = out / 'concat.txt'
    # ffconcat has its own quoting rules.
    listing.write_text(''.join("file '"+str(out / 'shots' / f'{s["id"]}.mp4').replace("'", "'\\''")+"'\n" for s in plan))
    captions_and_metadata(plan, out)
    final = out / 'LA01_concept_led.mp4'
    # Every shot now uses identical software codec settings and a complete header
    # mask. Copy video packets during assembly; only normalise the audio track.
    run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', listing, '-f', 'ffmetadata', '-i', out / 'chapters.ffmeta', '-map', '0:v:0', '-map', '0:a:0', '-map_metadata', '1', '-map_chapters', '1', '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart', final])
    info = probe(final)
    seconds = float(info['format']['duration'])
    assert 3600 <= seconds <= 5400, seconds
    assert any(s['codec_type']=='audio' for s in info['streams'])
    assert any(s['codec_type']=='video' and s['width']==1920 for s in info['streams'])
    (out / 'validation.json').write_text(json.dumps(dict(duration_seconds=seconds, planned_seconds=sum(s['duration'] for s in plan), shots=len(plan), resolution='1920x1080', frame_rate=30, captions='beat-proportional; not word-aligned', youtube_upload='pending channel authentication', source='selected original animated illustrations, fresh connecting scenes, and replacement narration'), indent=2))
    print(f'Completed {final} — {stamp(seconds)}', flush=True)


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('stage', choices=['compile', 'voice', 'fresh', 'source-shots', 'assemble', 'all'])
    p.add_argument('--reference', type=Path, default=DEFAULT_REFERENCE)
    p.add_argument('--output', type=Path, required=True)
    p.add_argument('--jobs', type=int, default=3)
    args = p.parse_args()
    ref, out = args.reference.resolve(), args.output.resolve()
    if args.stage in ('compile', 'all'):
        plan = compile_plan(ref, out)
    else:
        plan = json.loads((out / 'plan.json').read_text())
    if args.stage in ('voice', 'all'):
        synthesize(plan, ref, out)
    if args.stage in ('fresh', 'all'):
        render_fresh(plan, ref, out)
    if args.stage in ('assemble', 'all'):
        assemble(plan, out, args.jobs)
    if args.stage == 'source-shots':
        assemble(plan, out, args.jobs, encode_only=True)


if __name__ == '__main__':
    main()
