import http.server
import socketserver
import webbrowser
import os
import sys

# Set directory to 'web' if running from parent
if os.path.exists('web'):
    os.chdir('web')

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

# Allow reusing address to prevent "Address already in use" errors
socketserver.TCPServer.allow_reuse_address = True

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving VOID_OS at http://localhost:{PORT}")
        print("Press Ctrl+C to stop.")
        
        # Open browser automatically
        webbrowser.open(f"http://localhost:{PORT}")
        
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped.")
    sys.exit(0)
except OSError as e:
    print(f"Error: {e}")
    input("Press Enter to exit...")
