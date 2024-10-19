import json

def set_cors_headers(handler):
    """Set CORS headers for the HTTP response"""
    handler.send_header('Access-Control-Allow-Origin', '*')
    handler.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    handler.send_header('Access-Control-Allow-Headers', 'Content-Type')

def handle_post_request(handler, response_data):
    """Handle HTTP POST request responses"""
    handler.send_response(200)
    handler.send_header('Content-Type', 'application/json')
    set_cors_headers(handler)
    handler.end_headers()
    handler.wfile.write(json.dumps(response_data).encode('utf-8'))