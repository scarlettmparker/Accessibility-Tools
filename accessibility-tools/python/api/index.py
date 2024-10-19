def get(self):
    """Handle GET request for index /"""
    self.send_response(200)
    self.send_header('Content-type', 'text/html')
    self.end_headers()
        
    # simple http response, will be a dashboard at some point i think
    self.wfile.write(b'<h1>Accessibility Tools API</h1>')
