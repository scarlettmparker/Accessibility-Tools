from server import server

def serve(port: int = 8080):
    server(port=8080)
    
if __name__ == "__main__":
    serve()