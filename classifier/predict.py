import torch
import torchvision.transforms as transforms
from PIL import Image
from model import NeuralNet

# preprocess image for prediction
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])

    # load image and convert to rgb
    image = Image.open(image_path).convert('RGB')
    image = transform(image).unsqueeze(0)
    return image

# load model
def load_model(model_path):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = NeuralNet().to(device)
    model.load_state_dict(torch.load(model_path))
    model.eval()
    return model

# predict stuff
def predict_image(model, image_tensor):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    image_tensor = image_tensor.to(device)
    
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted_class = torch.max(outputs.data, 1)
    
    return predicted_class.item()

def predict_from_image(image_path, model_path):
    image_tensor = preprocess_image(image_path)
    model = load_model(model_path)
    predicted_class = predict_image(model, image_tensor)
    return predicted_class

# Example usage
image_path = "image.jpg"
model_path = "saves/best_model_fold_1_val_accuracy_0.7039.pth"
predicted_class = predict_from_image(image_path, model_path)
print(f'Predicted class: {predicted_class}')
