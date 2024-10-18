import json
import translate

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

def translate_text(raw_text):
    """Translate the provided text using the translate module"""
    return translate.parse_request(raw_text)