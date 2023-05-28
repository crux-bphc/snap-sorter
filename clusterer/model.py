from facenet_pytorch import InceptionResnetV1
import torch

class FaceNet:
    def __init__(self, embedding_size: int=256):
        self.model = InceptionResnetV1(pretrained='vggface2').eval()
        self.model.classify = False
        
        self.embedding_size: int = embedding_size
        self.fc = torch.nn.Linear(512, embedding_size)
    
    def forward(self, x):
        x = self.model(x)
        x = self.fc(x)
        return x
    
    def preprocess(self, images: torch.Tensor):
        # normalize and resize images
        images = (images - 127.5) / 128.0 
        images = images.permute(0, 3, 1, 2)  # change image format to (batch_size, channels, height, width)
        return images
    
    def embed(self, images: torch.Tensor):
        images = self.preprocess(images)
        embeddings: torch.Tensor = self.forward(images)
        return embeddings.detach().numpy()
    
    def save_model(self, filepath: str):
        torch.save(self.model.state_dict(), filepath)

    @classmethod
    def load_model(cls, filepath: str, embedding_size: int=256):
        facenet = cls(embedding_size=embedding_size)
        facenet.model.load_state_dict(torch.load(filepath))
        facenet.model.eval()
        facenet.model.classify = False
        return facenet
