import os
import numpy as np 
import torch
import torch.optim as optim
import torch.nn as nn
import torchvision.transforms as transforms

from sklearn.model_selection import train_test_split, KFold
from torchvision import datasets
from torch.utils.data import DataLoader, Subset
from model import NeuralNet
from tqdm import tqdm

# hyper parameters
BATCH_SIZE = 32
IMAGE_SIZE = 224
EPOCHS = 150
LEARNING_RATE = 0.001

k_folds = 2

# transformations
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
])

current_directory = os.getcwd()
dataset_path = os.path.join(current_directory, "datasets/imagenet1k/")

# load the train and test data using data loader and image folders
full_dataset = datasets.ImageFolder(root=dataset_path, transform=transform)

# get indices and labels for train-test split
dataset_size = len(full_dataset)

labels = []
with tqdm(total=dataset_size, desc='Loading Dataset', unit='image') as pbar:
    for i in range(dataset_size):
        labels.append(full_dataset[i][1])
        pbar.update(1)
        
indices = list(range(dataset_size))
labels = [full_dataset[i][1] for i in range(dataset_size)]

train_indices, test_indices = train_test_split(indices, test_size=0.2, stratify=labels)

# create subsets for test and train data
train_data = Subset(full_dataset, train_indices)
test_data = Subset(full_dataset, test_indices)

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# k-fold cross validation
kf = KFold(n_splits=k_folds, shuffle=True, random_state=42)
fold_accuracies = []


# evaluate function
def evaluate(model, data_loader, criterion):
    model.eval()
    total = 0
    correct = 0
    val_loss = 0
    
    with torch.no_grad():
        for (image, label) in data_loader:
            image = image.to(device)
            label = label.to(device)
            
            # forward pass and compute loss
            outputs = model(image)
            loss = criterion(outputs, label)
            val_loss += loss.item()

            # get the predicted class
            _, predicted = torch.max(outputs.data, 1)
            total += label.size(0)
            correct += (predicted == label).sum().item()
    
    # calculate accuracy as the reatio of correct predictions to total samples
    accuracy = correct / total
    return val_loss / len(data_loader), accuracy


# kf training loop
for fold, (train_idx, val_idx) in enumerate(kf.split(train_indices)):
    print(f'Fold {fold + 1}/{k_folds}')
    
    # create data loaders for the current fold
    train_subset = Subset(train_data, train_idx)
    val_subset = Subset(train_data, val_idx)
    
    train_loader = DataLoader(train_subset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4, pin_memory=True, persistent_workers=True)
    val_loader = DataLoader(val_subset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4, pin_memory=True)
    
    model = NeuralNet().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE, weight_decay=1e-5)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', factor=0.5, patience=12, verbose=True)
    
    best_val_loss = float('inf')
    
    # mixed precision to speed up training
    scaler = torch.cuda.amp.GradScaler()
    
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        
        # create a progress bar for the training loop
        with tqdm(total=len(train_loader), desc=f'Epoch {epoch + 1}/{EPOCHS}', unit='batch') as pbar:
            for (image, label) in train_loader:
                image = image.to(device)
                label = label.to(device)

                # forward pass for larger model
                # outputs, aux1, aux2 = model(image)
                
                outputs = model(image)
                loss = criterion(outputs, label)
                
                # calculate loss for larger model
                """
                if aux1 is not None:
                    aux_loss = criterion(aux1, label)
                    loss += aux_loss
                """

                # backward pass and optimization
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()

                # update running loss and progress bar
                running_loss += loss.item()
                pbar.set_postfix(loss=running_loss / (pbar.n + 1))
                pbar.update(1)

        val_loss, val_accuracy = evaluate(model, val_loader, criterion)
        print(f'Epoch {epoch + 1}/{EPOCHS}, Validation loss: {val_loss:.4f}, Validation accuracy: {val_accuracy:.4f}')
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            
            # save best model state for the current fold
            torch.save(model.state_dict(), f'saves/best_model_fold_{fold + 1}_val_accuracy_{val_accuracy:.4f}.pth')
    
    fold_accuracies.append(val_accuracy)

print(f'Mean Accuracy across all folds: {np.mean(fold_accuracies):.4f}')