from facenet_pytorch import InceptionResnetV1
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
import torch.optim as optim
from triplet_dataset import TripletDataset
import time

class FaceNet:
    """
    Class that defines a model to generate embeddings

    Attributes:
    model (InceptionResnetV1) : model used to generate embeddings
    embedding_size (int) : desired size of output embedding
    self.n_features (int) : number of input features of the last linear layer
    self.n_bn_features (int) : number of input features of last batch normalization layer
    """
    def __init__(self, embedding_size: int=256, use_default: bool=False):
        """
        Initializes the instance

        Args:
            embedding_size (int) : desired embedding size, defaults to 256
            use_default (bool) : allows user to use unaltered model, defaults to False
        """
        self.embedding_size: int = embedding_size
        self.model: InceptionResnetV1 = InceptionResnetV1(pretrained='vggface2').eval()
        if not use_default:
            self.n_features = self.model.last_linear.in_features
            self.model.last_linear = nn.Linear(self.n_features, self.embedding_size)
            self.n_bn_features = self.model.last_bn.num_features
            self.model.last_bn = nn.BatchNorm1d(embedding_size)
        self.model.classify = False
        self.model.eval()
    
    def forward(self, x: torch.Tensor):
        """
        Initiates a forward pass of the inputs through the model and final output layer

        Args:
            x (torch.Tensor) : input tensor

        Returns:
            x (torch.Tensor) : output tensor (embedding)
        """
        x = self.model(x)
        #x = self.fc(x)
        return x
    
    def preprocess(self, images: torch.Tensor):
        """
        Normalizes and permutes the images to (batch size, channels, image width, image height)

        Args:
            images (torch.Tensor) : tensor of image tensors

        Returns:
            images (torch.Tensor) : tensor of normalized image tensors
        """
        images = (images - 127.5) / 128.0 
        #images = images.permute(0, 3, 1, 2) 
        return images
    
    def embed(self, images: torch.Tensor):
        """
        Generates embeddings for a given batch of images

        Args:
            images (torch.Tensor) : tensor of input image tensors

        Returns:
            embeddings (np.ndarray) : numpy array of embeddings
        """
        # images = self.preprocess(images)
        embeddings: torch.Tensor = self.forward(images)
        return embeddings.detach().numpy()
    
    def save_model(self, filepath: str):
        """
        Saves model state to specified file

        Args:
            filepath (str) : file to save model state to
        """
        torch.save(self.model.state_dict(), filepath)

    @classmethod
    def load_model(cls, filepath: str, embedding_size: int=256):
        """
        Loads a facenet model from specified file

        Args: 
            filepath (str) : file to load model state from
            embedding_size (int) : size of output embeddings
        
        Returns:
            facenet (Self@Facenet)
        """
        facenet = cls(embedding_size=embedding_size)
        facenet.model.load_state_dict(torch.load(filepath))
        facenet.model.eval()
        facenet.model.classify = False
        return facenet
    
    def train(self, train_data: TripletDataset, batch_size : int, n_epochs : int, learning_rate : float, frozen: int = 250):
        """
        Trains a model on given data

        Args: 
            train_data (Dataset) : Data to train the model on in the form of a triplet dataset
            batch_size (int)
            n_epochs (int)
            learning_rate (float)

        Returns:
            None

        """
        train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True)

        criterion = nn.TripletMarginLoss()
        optimizer = optim.Adam(self.model.parameters(), lr=learning_rate)

        self.model.train()

        counter = 0
        for param in self.model.parameters():
            if counter < frozen:
                param.requires_grad=False
            elif counter >= frozen:
                param.requires_grad=True
            counter+=1
        
        start = time.time()

        print(f"Training starts: {time.ctime(start)}\n")

        for epoch in range(n_epochs):
            epoch_start = time.time()
            running_loss = 0.0
            for batch in train_loader:
                optimizer.zero_grad()

                anchor_images, positive_images, negative_images = batch
                anchor_embeddings = self.model(anchor_images)
                positive_embeddings = self.model(positive_images)
                negative_embeddings = self.model(negative_images)

                loss = criterion(anchor_embeddings, positive_embeddings, negative_embeddings)

                loss.backward()
                optimizer.step()

                running_loss += loss.item()

            epoch_loss = running_loss / len(train_loader)
            print(f"Epoch [{epoch+1}/{n_epochs}], Loss: {epoch_loss} | " \
                  f"{(time.time()-epoch_start):.2f}s | {time.ctime(time.time())}")

        self.model.eval()

        print(f"Training ends: {time.ctime(time.time())}")
        print(f"Time taken: {(time.time()-start):.2f}s")