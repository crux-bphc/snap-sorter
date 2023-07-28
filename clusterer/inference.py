import torchvision
from exception import FaceNotFoundError
from model import FaceNet
from facenet_pytorch import MTCNN
from PIL import Image
from triplet_dataset import create_transform
import torch


class EmbeddingPipeline:
    """
        Pipeline class for detecting faces from a single image and converting to embedding vectors
        
        Attributes:
            detector (MTCNN): MTCNN detector object. Defaults to MTCNN(keep_all=True, device=device).eval().
            resnet (InceptionResnetV1): InceptionResnetV1 object. Defaults to InceptionResnetV1(pretrained=pretrained, device=device).eval().
            
    """
    def __init__(self, detector: MTCNN = None, default_resnet: bool = True, embedding_size: int = 512):
        """
            Constructor for EmbeddingPipeline class
            
            Args:
                detector (MTCNN): MTCNN detector object. Defaults to MTCNN(keep_all=True, device=device).eval().
                default_resnet (bool): boolean. If True defaults resnet used to InceptionResnetV1(pretrained='vggface2').eval().
                embedding_size (int): size of embedding vector. Defaults to 512.
            
        """
        DETECTOR = MTCNN(keep_all=True).eval()
        RESNET = FaceNet(embedding_size=embedding_size, use_default=default_resnet)
        
        self.detector = DETECTOR if detector is None else detector
        self.resnet = RESNET
        
    def __call__(self, image_path: str):
        """
            Reads the image, processes it and detects faces
            
            Args:
                image_path (str): path to the image file
            
            Returns:
                numpy array of embedding vectors of size {torch.Size([1, 512])}

        """
        faces = self._detect_faces(image_path)
        embeddings = self._create_embeddings(faces)
        return embeddings

    def _detect_faces(self, path: str):
        """ detects faces from image in provided path

        Args:
            path (str): path to image

        Raises:
            FaceNotFoundError: in case of no face found in image

        Returns:
            list[PIL.Image.Image]: list of faces detected as PIL images 
        """
        
        images = []
        
        transform_to_image = torchvision.transforms.ToPILImage()
        image = Image.open(path)
        faces = self.detector(image)
        if faces is None:
            raise FaceNotFoundError(path)
        else:
            for face in faces:
                images.append(transform_to_image(face))
        return images

    def _create_embeddings(self, faces: list[Image.Image], transform_height: int = 128, transform_width: int = 128):
        """transforms and coverts faces into embedding vectors

        Args:
            faces (list[Image.Image]): list of PIL Images of faces
            transform_height (int, optional): height of transformed image. Defaults to 128.
            transform_width (int, optional): width of transformed image. Defaults to 128.

        Returns:
            torch.Tensor: tensor of embedding vectors of faces
        """
        
        transform = create_transform(transform_height, transform_width)
        
        transformed_faces = []
        
        for face in faces:
            converted = face.convert('RGB')
            transformed_face = transform(converted)
            transformed_faces.append(transformed_face)
        
        transformed_faces = torch.stack(transformed_faces)
        
        embeddings = self.resnet.embed(transformed_faces)
        
        return embeddings
    
    