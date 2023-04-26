from PIL import Image
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1
import numpy as np

class EmbeddingPipeline:
    """
        Pipeline class for detecting faces from a single image and converting to embedding vectors
        
        Attributes:
            detector (MTCNN): MTCNN detector object. Defaults to MTCNN(keep_all=True, device=device).eval().
            resnet (InceptionResnetV1): InceptionResnetV1 object. Defaults to InceptionResnetV1(pretrained=pretrained, device=device).eval().
            device (str): device to run the model on. Defaults to 'cpu'.
            pretrained (str): pretrained model to use. Defaults to 'vggface2'.
            resize (float): resize factor for the image. Defaults to None.
            
    """
    def __init__(self, detector: MTCNN = None, resnet: InceptionResnetV1 = None, device: str = 'cpu', pretrained: str = 'vggface2', resize: float = None):
        
        """
        Constructor for EmbeddingPipeline class
        
        Args:
            detector (MTCNN): MTCNN detector object. Defaults to MTCNN(keep_all=True, device=device).eval().
            detector (MTCNN): MTCNN detector object. Defaults to MTCNN(keep_all=True, device=device).eval().
            resnet (InceptionResnetV1): InceptionResnetV1 object. Defaults to InceptionResnetV1(pretrained=pretrained, device=device).eval().
            device (str): device to run the model on. Defaults to 'cpu'.
            pretrained (str): pretrained model to use. Defaults to 'vggface2'.
            resize (float): resize factor for the image. Defaults to None.
            
        """
        
        DETECTOR = MTCNN(keep_all=True, device=device).eval()
        RESNET = InceptionResnetV1(pretrained=pretrained, device=device).eval()
        
        self.detector = DETECTOR if detector is None else detector
        self.resize = resize
        self.resnet = RESNET if resnet is None else resnet
        
        
    def __call__(self, filepath: str):
        """
            Reads the image, processes it, optionally resizes it and detects faces
            
            Args:
                filepath (str): path to the image file
            
            Returns:
                numpy array of embedding vectors of size {torch.Size([1, 512])}

        """
        
        img = Image.open(filepath)
        
        if self.resize is not None:
            img = img.resize([int(d*self.resize) for d in img.size])
        
        detected_faces = self.detector(img)
        
        embeddings = self._create_embeddings(detected_faces)
        
        return embeddings  
    
    def _create_embeddings(self, faces: list[torch.tensor]):
        """
            Converts array of faces to embedding vectors
            
            Args:
                faces (list[torch.tensor]): list of tensors of detected faces 
            
            Returns:
                numpy array of embedding vectors of size {torch.Size([1, 512])}

        """
        embeddings = np.array([self.resnet(torch.unsqueeze(face, 0)).detach().numpy() for face in faces])
        return embeddings