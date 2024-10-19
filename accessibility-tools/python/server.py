import http.server
import socketserver
import os
import json
import threading
import importlib
from pathlib import Path
from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer
from utils import set_cors_headers
from reload import ignore_files, reload_all_modules

HOST = "localhost"
main_dir = os.path.dirname(os.path.abspath(__file__))

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self):
        set_cors_headers(self)

    def load_api_module(self, endpoint):
        """Dynamically loads the module from the api folder based on the endpoint"""
        api_dir = os.path.join(main_dir, "api")
        module_name = endpoint.strip('/')
        module_path = os.path.join(api_dir, f"{module_name}.py")

        # get endpoint from route and load packages
        if os.path.exists(module_path):
            spec = importlib.util.spec_from_file_location(module_name, module_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            return module
        else:
            return None

    def handle_request(self, method):
        """Handles the HTTP request by calling the appropriate function in the module"""
        module = self.load_api_module(self.path)
        
        if module:
            # determine the method (get, post, put, delete)
            method_func = getattr(module, method.lower(), None)
            if method_func:
                # for POST/PUT parse the incoming data
                if method.lower() in ['post', 'put']:
                    content_length = int(self.headers['Content-Length'])
                    post_data = self.rfile.read(content_length)
                    data = json.loads(post_data)
                    method_func(self, data)
                else:
                    method_func(self)
            else:
                self.send_error(405, f'Method {method.upper()} not allowed for {self.path}')
        else:
            self.send_error(404, 'Endpoint Not Found')

    # OPTIONS
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()
        self.end_headers()

    # GET
    def do_GET(self):
        self.handle_request('GET')

    # POST
    def do_POST(self):
        self.handle_request('POST')

    # PUT
    def do_PUT(self):
        self.handle_request('PUT')

    # DELETE
    def do_DELETE(self):
        self.handle_request('DELETE')

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