from facenet_pytorch import InceptionResnetV1
import torch

class FaceNet:
    def __init__(self, embedding_size=512):
        self.model = InceptionResnetV1(pretrained='vggface2').eval()
        self.model.classify = False
        
        self.embedding_size = embedding_size
        self.fc = torch.nn.Linear(512, embedding_size)
    
    def forward(self, x):
        x = self.model(x)
        x = self.fc(x)
        return x
    
    def embed(self, images: torch.Tensor):
        images = self.preprocess(images)
        embeddings = self.forward(images)
        return embeddings.detach().numpy()
    
    def save_model(self, filepath: str):
        torch.save(self.model.state_dict(), filepath)
