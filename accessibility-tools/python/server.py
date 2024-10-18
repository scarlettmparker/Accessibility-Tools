import http.server
import socketserver
import os
import json
import threading
from pathlib import Path
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from utils import set_cors_headers, handle_post_request, translate_text
from reload import ignore_files, reload_all_modules

HOST = "localhost"
main_dir = os.path.dirname(os.path.abspath(__file__))

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self):
        set_cors_headers(self)


    # OPTIONS
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()
        self.end_headers()


    # GET
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self._set_headers()
            self.end_headers()
            
            # simple http response, will be a dashboard at some point i think
            self.wfile.write(b'<h1>Accessibility Tools API</h1>')
        else:
            self.send_error(404, 'Not Found')


    # POST
    def do_POST(self):
        if self.path == '/translate':
            # get content and parse data
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)
            raw_text = data.get('raw_text', '')
            
            # translate the text and send it back to the client
            translated_text = translate_text(raw_text)
            handle_post_request(self, {'translated_text': translated_text})
        else:
            self.send_error(404, 'Not Found')

class EventHandler(FileSystemEventHandler):
    def __init__(self):
        # lock the thread because we safe out here
        self.lock = threading.Lock()
        self.timer = None


    def on_any_event(self, event):
        # dont update temp files etc
        if event.is_directory or ignore_files(event.src_path):
            return

        if event.event_type in ["created", "modified"]:
            print(f"Detected change in file: {event.src_path}")
            with self.lock:
                if self.timer:
                    self.timer.cancel()
                self.timer = threading.Timer(1, self.reload_modules)
                self.timer.start()


    def reload_modules(self):
        reload_all_modules(os.getcwd())


def run_server(port: int = 8080):
    with socketserver.TCPServer(("", port), RequestHandler) as httpd:
        print(f"Serving on port {port}")
        httpd.serve_forever()


# start server and watch directory
def server(port: int = 8080):
    """Serve files in the watched directory"""
    watch_directory = Path(main_dir)

    # instance of event handler to observe file changes for updating
    event_handler = EventHandler()
    observer = Observer()
    observer.schedule(event_handler, watch_directory, recursive=True)
    observer.start()

    try:
        run_server(port=port)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()