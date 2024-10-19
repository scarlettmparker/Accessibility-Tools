import concurrent.futures
from googletrans import Translator
from utils import handle_post_request


def post(self, data):
    """Handle POST request for /translate"""
    raw_texts = data.get('data', [])
    language = data.get('language', '')
    
    # initialise google translator
    translator = Translator()
    translated_text = translate(raw_texts, language, translator)
    handle_post_request(self, {'translated_text': translated_text})


def translate(translate_data, language, translator):
    # preprocess data to avoid long texts
    texts = [item["text"] for item in translate_data]
    labels = {item["text"]: item["label"] for item in translate_data}
    translated_data = []

    def translate_chunks(text):
        chunks = chunk_text(text, 4999) if len(text) > 4999 else [text]
        return [{"label": labels[text], "text": translator.translate(chunk, dest=language).text} for chunk in chunks]

    with concurrent.futures.ThreadPoolExecutor() as executor:
        # map translate chunks to all texts
        results = list(executor.map(translate_chunks, texts))

    # flatten the list of results and combine them
    translated_data = [item for sublist in results for item in sublist]
    
    return translated_data


def chunk_text(text, max_length):
    """Split text into chunks without cutting off sentences or words"""
    words = text.split()
    chunks = []
    current_chunk = []
    current_length = 0

    for word in words:
        word_length = len(word)
        # ensure adding new words doesn't exceed max length
        if current_length + len(current_chunk) + word_length <= max_length:
            current_chunk.append(word)
            current_length += word_length + 1
        else:
            chunks.append(' '.join(current_chunk))
            current_chunk = [word]
            current_length = word_length + 1

    if current_chunk:
        chunks.append(' '.join(current_chunk))

    return chunks