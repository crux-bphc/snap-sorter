from facenet_pytorch import InceptionResnetV1
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, Dataset
import torch.optim as optim

class FaceNet:
    """
    Class that defines a model to generate embeddings

    Attributes:
    model (InceptionResnetV1) : model used to generate embeddings
    embedding_size (int) : desired size of output embedding
    fc - output layer that connects the model output layer to desired embedding size
    """
    def __init__(self, embedding_size: int=256):
        """
        Initializes the instance

        Args:
            embedding_size (int) : desired embedding size, defaults to 256
        """
        self.embedding_size: int = embedding_size
        self.model = InceptionResnetV1(pretrained='vggface2').eval()
        self.n_features = self.model.last_linear.in_features
        self.model.last_linear = nn.Linear(self.n_features, self.embedding_size)
        self.n_bn_features = self.model.last_bn.num_features
        self.model.last_bn = nn.BatchNorm1d(embedding_size)
        self.model.classify = False
        #self.fc = torch.nn.Linear(512, embedding_size)
    
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
        images = self.preprocess(images)
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
    
    def train(self, train_data: Dataset, batch_size : int, n_epochs : int, learning_rate : float):
        """
        Trains a model on given data

        Args: 
            train_data () : Data to train the model on (anchor, positive, negative)
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

        for epoch in range(n_epochs):
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
            print(f"Epoch [{epoch+1}/{n_epochs}], Loss: {epoch_loss}")

        self.model.eval()
