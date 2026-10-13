"""Narration for Manim lesson videos, using the macOS `say` voice (free, offline).

A NarratedScene speaks one line per `narrate(key)` call. Each line is synthesised
before rendering, so the scene knows how long it lasts: `narrate` waits for the
previous line to finish before starting the next, and the animations that follow
play while the line is spoken. The cue times are written next to the clips, and
`mux` lays the clips on one track and adds it to the rendered video.

Build a narrated video (renders, then muxes):
    python scripts/videos/narration.py scripts/videos/nn01_perceptron_line.py PerceptronLine

Environment: NARRATOR_VOICE (default Samantha; "Ava (Premium)" etc. if downloaded
in System Settings → Accessibility → Spoken Content), NARRATOR_RATE (words/min, default 175).
"""
import json
import os
import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

VOICE = os.environ.get("NARRATOR_VOICE", "Samantha")
RATE = os.environ.get("NARRATOR_RATE", "175")
SAMPLE_RATE = 24000
GAP = 0.35  # silence after each line before the next may start, seconds


def synth(lines, out_dir):
    """Speak each line to out_dir/<key>.wav (cached on text, voice and rate); return durations."""
    out_dir.mkdir(parents=True, exist_ok=True)
    durations = {}
    for key, text in lines.items():
        wav, stamp = out_dir / f"{key}.wav", out_dir / f"{key}.txt"
        tag = f"{VOICE}|{RATE}|{text}"
        if not (wav.exists() and stamp.exists() and stamp.read_text() == tag):
            subprocess.run(["say", "-v", VOICE, "-r", RATE, "--file-format=WAVE",
                            f"--data-format=LEI16@{SAMPLE_RATE}", "-o", str(wav), text], check=True)
            stamp.write_text(tag)
        with wave.open(str(wav)) as w:
            durations[key] = w.getnframes() / w.getframerate()
    return durations


def audio_dir(scene_name):
    return Path(os.environ.get("NARRATION_DIR", "media/narration")) / scene_name


try:
    from manim import Scene

    class NarratedScene(Scene):
        """Subclasses set NARRATION = {key: text} and call self.narrate(key) in construct."""
        NARRATION = {}

        def setup(self):
            self._dir = audio_dir(type(self).__name__)
            self._dur = synth(self.NARRATION, self._dir)
            self._cues, self._busy_until = [], 0.0

        def narrate(self, key):
            self.sync()
            self._cues.append((self.time, key))
            self._busy_until = self.time + self._dur[key] + GAP

        def sync(self):
            """Wait until the current line has been spoken."""
            if self.time < self._busy_until - 1e-3:
                self.wait(self._busy_until - self.time)

        def tear_down(self):
            (self._dir / "cues.json").write_text(json.dumps(self._cues))
except ImportError:  # muxing alone does not need Manim
    pass


def mux(video, scene_name, out):
    """Lay the spoken clips at their cue times and add them to the video as an AAC track."""
    import av

    d = audio_dir(scene_name)
    cues = json.loads((d / "cues.json").read_text())
    with av.open(str(video)) as src:
        length = float(src.duration) / av.time_base
    track = np.zeros(int(length * SAMPLE_RATE) + SAMPLE_RATE, dtype=np.float32)
    for t, key in cues:
        with wave.open(str(d / f"{key}.wav")) as w:
            clip = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32) / 32768
        i = int(t * SAMPLE_RATE)
        clip = clip[: max(0, len(track) - i)]
        track[i:i + len(clip)] += clip
    track = track[: int(length * SAMPLE_RATE)]

    with av.open(str(video)) as src, av.open(str(out), "w") as dst:
        vin = src.streams.video[0]
        vout = dst.add_stream_from_template(vin)
        aout = dst.add_stream("aac", rate=SAMPLE_RATE, layout="mono")
        for packet in src.demux(vin):
            if packet.dts is None:
                continue
            packet.stream = vout
            dst.mux(packet)
        step = 1024
        for i in range(0, len(track), step):
            frame = av.AudioFrame.from_ndarray(track[None, i:i + step], format="fltp", layout="mono")
            frame.sample_rate, frame.pts = SAMPLE_RATE, i
            for p in aout.encode(frame):
                dst.mux(p)
        for p in aout.encode(None):
            dst.mux(p)


if __name__ == "__main__":
    scene_file, scene_name, *extra = sys.argv[1:]
    media = Path(os.environ.get("MEDIA_DIR", "media"))
    os.environ.setdefault("NARRATION_DIR", str(media / "narration"))
    manim = Path(sys.executable).with_name("manim")
    subprocess.run([str(manim), "-qh", "--fps", "30", "--media_dir", str(media), scene_file, scene_name, *extra], check=True)
    silent = media / "videos" / Path(scene_file).stem / "1080p30" / f"{scene_name}.mp4"
    out = silent.with_name(f"{scene_name}-narrated.mp4")
    mux(silent, scene_name, out)
    print(f"Narrated video: {out}")
