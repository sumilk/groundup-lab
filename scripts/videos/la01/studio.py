"""Control only the explicitly authorised channel's existing Chrome Studio tab.

Uses the normal signed-in UI. Never reads credentials, cookies or access tokens.
JavaScript from Apple Events must be enabled by the user in Chrome.
"""
import json
from pathlib import Path
import subprocess
import sys

CHANNEL = 'UCmBIPSDEB4ZhvBBPJ2wDSwQ'
SESSION = Path(__file__).resolve().parents[3] / 'outputs/la01-concept-led/studio-session.json'


def evaluate(js):
    literal = json.dumps(js, ensure_ascii=False)
    tab_id = json.loads(SESSION.read_text()).get('tab_id') if SESSION.exists() else None
    condition = f'(id of t as text) is "{int(tab_id)}" and URL of t contains "studio.youtube.com/"' if tab_id else f'URL of t contains "studio.youtube.com/channel/{CHANNEL}"'
    script = f'''tell application "Google Chrome"
repeat with w in windows
repeat with t in tabs of w
if {condition} then
return execute t javascript {literal}
end if
end repeat
end repeat
error "The authorised channel's YouTube Studio tab is not open."
end tell'''
    r = subprocess.run(['osascript', '-e', script], capture_output=True, text=True, check=True)
    return r.stdout.strip()


def choose_file(path):
    """Select an authorised local artifact only when Chrome has an open sheet."""
    path = Path(path).resolve(strict=True)
    literal = json.dumps(str(path))
    script = f'''with timeout of 10 seconds
tell application "Google Chrome" to activate
tell application "System Events"
if not UI elements enabled then error "Accessibility must be enabled by the user."
tell process "Google Chrome"
if (count of sheets of front window) is 0 then error "No Chrome file chooser sheet is open."
keystroke "g" using {{command down, shift down}}
delay 0.5
keystroke {literal}
key code 36
delay 0.8
key code 36
end tell
end tell
end timeout'''
    return subprocess.run(['osascript','-e',script],check=True,capture_output=True,text=True).stdout.strip()


def focus():
    tab_id = int(json.loads(SESSION.read_text())['tab_id'])
    script = f'''tell application "Google Chrome"
repeat with w in windows
repeat with i from 1 to count of tabs of w
if (id of tab i of w as text) is "{tab_id}" then
set index of w to 1
set active tab index of w to i
activate
return "Focused the authorised Studio tab"
end if
end repeat
end repeat
error "The authorised Studio tab is closed."
end tell'''
    return subprocess.run(['osascript','-e',script],check=True,capture_output=True,text=True).stdout.strip()


if __name__ == '__main__':
    print(evaluate(Path(sys.argv[1]).read_text()))
