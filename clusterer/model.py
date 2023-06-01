from facenet_pytorch import InceptionResnetV1
import torch

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
        self.model = InceptionResnetV1(pretrained='vggface2').eval()
        self.model.classify = False
        
        self.embedding_size: int = embedding_size
        self.fc = torch.nn.Linear(512, embedding_size)
    
    def forward(self, x: torch.Tensor):
        """
        Initiates a forward pass of the inputs through the model and final output layer

        Args:
            x (torch.Tensor) : input tensor

        Returns:
            x (torch.Tensor) : output tensor (embedding)
        """
        x = self.model(x)
        x = self.fc(x)
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
