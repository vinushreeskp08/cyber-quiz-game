import http.server
import socketserver
import webbrowser

PORT = 7777  # Fixed port — change if needed

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        return  # Disable terminal logging

print(f"✅ Starting local server at http://localhost:{PORT}")
try:
    with socketserver.TCPServer(("", PORT), QuietHandler) as httpd:
        webbrowser.open(f"http://localhost:{PORT}")
        httpd.serve_forever()
except OSError:
    print(f"❌ Port {PORT} is in use. Try changing the port in server.py.")
