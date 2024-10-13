import torch
import torch.nn as nn

# neural net definition
class NeuralNet(nn.Module):
    def __init__(self, in_channels=3, num_classes=1000):
        super(NeuralNet, self).__init__()
        
        # reduced number of filters/layers
        self.conv1 = ConvBlock(in_channels, 32, kernel_size=7, stride=2, padding=3)
        self.conv2 = ConvBlock(32, 64, kernel_size=3, stride=1, padding=1)
        
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=2, padding=1)
        self.avgpool = nn.AvgPool2d(kernel_size=7, stride=1)
        
        self.dropout = nn.Dropout(0.4)
        self.linear = nn.Linear(224, num_classes)
        
        # no auxiliary classifiers on this model
        self.inception3a = InceptionBlock(64, 32, 32, 64, 16, 16, 16)
        self.inception4a = InceptionBlock(128, 32, 32, 64, 16, 16, 16)

        self.inception5a = InceptionBlock(128, 64, 64, 128, 16, 16, 16)

    def forward(self, x):
        x = self.conv1(x)
        x = self.maxpool(x)
        x = self.conv2(x)
        x = self.maxpool(x)
        
        x = self.inception3a(x)
        x = self.maxpool(x)

        x = self.inception4a(x)
        x = self.maxpool(x)

        x = self.inception5a(x)
        x = self.avgpool(x)
        
        x = x.reshape(x.shape[0], -1)
        x = self.dropout(x)
        
        x = self.linear(x)
        
        return x

# convolutional block    
class ConvBlock(nn.Module):
    def __init__(self, in_channels, out_channels, kernel_size, **kwargs):
        super(ConvBlock, self).__init__()
        
        self.conv = nn.Conv2d(in_channels, out_channels, kernel_size, **kwargs)
        self.bn = nn.BatchNorm2d(out_channels)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        return self.relu(self.bn(self.conv(x)))
    
# inception module
class InceptionBlock(nn.Module):
    def __init__(self, in_channels, num_1x1, num_3x3_red, num_3x3, num_5x5_red, num_5x5, num_pool_proj):
        super(InceptionBlock, self).__init__()
        
        self.one_by_one = ConvBlock(in_channels, num_1x1, kernel_size=1)
        
        # Reduced complexity in 3x3 and 5x5 branches
        self.three_by_three_red = ConvBlock(in_channels, num_3x3_red, kernel_size=1)
        self.three_by_three = ConvBlock(num_3x3_red, num_3x3, kernel_size=3, padding=1)
        
        self.five_by_five_red = ConvBlock(in_channels, num_5x5_red, kernel_size=1)
        self.five_by_five = ConvBlock(num_5x5_red, num_5x5, kernel_size=5, padding=2)
        
        self.maxpool = nn.MaxPool2d(kernel_size=3, stride=1, padding=1)
        self.pool_proj = ConvBlock(in_channels, num_pool_proj, kernel_size=1)
        
    def forward(self, x):
        x1 = self.one_by_one(x)
        
        x2 = self.three_by_three_red(x)
        x2 = self.three_by_three(x2)
        
        x3 = self.five_by_five_red(x)
        x3 = self.five_by_five(x3)
        
        x4 = self.maxpool(x)
        x4 = self.pool_proj(x4)
        
        x = torch.cat([x1, x2, x3, x4], 1)
        return x
