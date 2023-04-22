# import cv2

from PIL import Image
import torch
from facenet_pytorch import MTCNN, InceptionResnetV1

device = 'cuda:0' if torch.cuda.is_available() else 'cpu'

# Face detector
DETECTOR = MTCNN(keep_all=True, device='cpu').eval()

# Facial recognition model
RESNET = InceptionResnetV1(pretrained='vggface2', device=device).eval()


class EmbeddingPipeline:
    '''
        pipeline class for detecting faces from a single image and converting to embedding vectors
    '''
    def __init__(self, detector=MTCNN, resnet=RESNET, resize=None):
        self.detector = detector
        self.resize = resize
        self.resnet = resnet
        
        
    def __call__(self, filepath: str):
        '''
            reads the image, processes it, optionally resizes it and detects faces
            
            Args:
                filepath {str} -- path of the image file
        '''
        
        img = Image.open(filepath)
        
        # img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # img = self._equalize(img)
        
        if self.resize is not None:
            img = img.resize([int(d*self.resize) for d in img.size])
        
        detected_faces = []
        
        # img = Image.fromarray(img)
        
        detected_faces.extend(self.detector(img))
        
        embeddings = self.create_embeddings(detected_faces)
        
        return embeddings  
    
    def _equalize(self, img):
        '''
            Applies adaptive histogram equalization (enhances contrast)
        '''
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l1 = clahe.apply(l)
        processed = cv2.merge((l1, a, b))
        return cv2.cvtColor(processed, cv2.COLOR_LAB2RGB)
    
    def create_embeddings(self, faces: list):
        '''
            converts array of faces to embedding vectors
            
            Args:
                faces {list} -- list of tensors of detected faces 
            
            Returns:
                list of embedding vectors of size {torch.Size([1, 512])}

        '''
        embeddings = [self.resnet(f[None,:]) for f in faces]
        return embeddings



