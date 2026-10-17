"""Serve only the three authorised delivery files to the signed-in Studio page.

Loopback only; exact-origin CORS; random capability path; no directory browsing,
credentials, browser-policy changes, or access to other local files. The browser
still enforces its ordinary CSP and local-network permissions.
"""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import mimetypes
import secrets
import shutil
import sys

ROOT = Path(sys.argv[1]).resolve()
STATE = Path(sys.argv[2]).resolve()
TOKEN = secrets.token_urlsafe(24)
FILES = {name: ROOT/name for name in ('LA01_concept_led.mp4','youtube_thumbnail.png','LA01_captions.en.srt')}
ORIGIN = 'https://studio.youtube.com'


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def cors(self):
        self.send_header('Access-Control-Allow-Origin', ORIGIN)
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Range')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        self.send_header('Vary', 'Origin')
        self.send_header('Cache-Control', 'no-store')

    def do_OPTIONS(self):
        if self.headers.get('Origin') != ORIGIN:
            self.send_error(403); return
        self.send_response(204); self.cors(); self.end_headers()

    def do_GET(self):
        if self.headers.get('Origin') != ORIGIN:
            self.send_error(403); return
        prefix = '/'+TOKEN+'/'
        if not self.path.startswith(prefix):
            self.send_error(404); return
        name = self.path[len(prefix):]
        if name not in FILES:
            self.send_error(404); return
        path = FILES[name]
        self.send_response(200); self.cors()
        self.send_header('Content-Type', mimetypes.guess_type(name)[0] or 'application/octet-stream')
        self.send_header('Content-Length', str(path.stat().st_size)); self.end_headers()
        try:
            with path.open('rb') as src:
                shutil.copyfileobj(src,self.wfile,length=1024*1024)
        except (BrokenPipeError,ConnectionResetError):
            pass


server = ThreadingHTTPServer(('127.0.0.1',0),Handler)
STATE.write_text(json.dumps({'base':f'http://127.0.0.1:{server.server_port}/{TOKEN}/','files':list(FILES)}))
STATE.chmod(0o600)
print('Local delivery bridge ready (Studio origin only).',flush=True)
try:
    server.serve_forever()
finally:
    server.server_close()
    STATE.unlink(missing_ok=True)
