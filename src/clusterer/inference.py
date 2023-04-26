from PIL import Image
from facenet_pytorch import MTCNN, InceptionResnetV1

class EmbeddingPipeline:
    '''
        pipeline class for detecting faces from a single image and converting to embedding vectors
    '''
    def __init__(self, detector = None, resnet = None, device = 'cpu', pretrained = 'vggface2', resize=None):
        
        DETECTOR = MTCNN(keep_all=True, device=device).eval()
        RESNET = InceptionResnetV1(pretrained=pretrained, device=device).eval()
        
        self.detector = DETECTOR if detector is None else detector
        self.resize = resize
        self.resnet = RESNET if resnet is None else resnet
        
        
    def __call__(self, filepath: str):
        '''
            reads the image, processes it, optionally resizes it and detects faces
            
            Args:
                filepath {str} -- path of the image file
            
            Returns:
                embeddings {list} -- list of embedding vectors
        '''
        
        img = Image.open(filepath)
        
        if self.resize is not None:
            img = img.resize([int(d*self.resize) for d in img.size])
        
        detected_faces = self.detector(img)
        
        embeddings = self._create_embeddings(detected_faces)
        
        return embeddings  
    
    def _create_embeddings(self, faces: list):
        '''
            converts array of faces to embedding vectors
            
            Args:
                faces {list} -- list of tensors of detected faces 
            
            Returns:
                list of embedding vectors of size {torch.Size([1, 512])}

        '''
        embeddings = [self.resnet(f[None,:]) for f in faces]
        return embeddings