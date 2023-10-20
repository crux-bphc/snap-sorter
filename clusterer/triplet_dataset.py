from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image
import os
import random
from facenet_pytorch import MTCNN

class TripletDataset(Dataset):
    """
    Class that defines a dataset for the model to be trained on

    Attributes:
        anchors (list[Image]) : anchor images for each triplet
        positives (list[Image]) : positive images for each triplet
        negatives (list[Image]) : negative images for each triplet
        transforms (Compose) : composition of image transforms
    """
    def __init__(self, anchors: list[Image.Image], positives: list[Image.Image],
                 negatives: list[Image.Image], transform: transforms.Compose=None):
        """
        Initializes the instance

        Args:
            anchors (list[Image]) : anchor images for each triplet
            positives (list[Image]) : positive images for each triplet
            negatives (list[Image]) : negative images for each triplet
            transforms (Compose) : composition of image transforms, defaults to None
        """
        self.anchors = anchors
        self.positives = positives
        self.negatives = negatives
        self.transform = transform

    def __len__(self):
        return len(self.anchors)

    def __getitem__(self, index):
        anchor = self.anchors[index]
        positive = self.positives[index]
        negative = self.negatives[index]

        if self.transform is not None:
            anchor = self.transform(anchor)
            positive = self.transform(positive)
            negative = self.transform(negative)

        return anchor, positive, negative
    

def create_transform(img_height: int, img_width: int, _mean: list[float]=None, 
                     _std: list[float]=None):
    """
    Creates a composition of custom image transforms

    Args:
        img_height (int) : Desired new image height
        img_width (int) : Desired new image width
        _mean (list[float])
        _std (list[float])

    Returns:
        transform (Compose): Composition of image transforms
    """
    mean = [0.485, 0.456, 0.406] if _mean is None else _mean
    std = [0.229, 0.224, 0.225] if _std is None else _std
    transform = transforms.Compose([
    transforms.Resize((img_height, img_width)),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
    ])
    return transform

def extract_triplets_from_directory(root_dir, num_triplets_per_person=10):
    anchor_images = []
    positive_images = []
    negative_images = []

    detector = MTCNN(keep_all=False, image_size=224).eval()

    # List sub-folders (each representing a person)
    person_folders = [folder for folder in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, folder))]

    for person_folder in person_folders:
        person_path = os.path.join(root_dir, person_folder)
        person_images = [image for image in os.listdir(person_path) if image.endswith('.jpg') or image.endswith('.png')]

        for i in range(num_triplets_per_person):
            # Randomly select anchor and positive images from the same person's folder
            anchor_image_name = random.choice(person_images)
            positive_image_name = random.choice(person_images)

            # Randomly select a different person's folder for negative image
            negative_person_folder = random.choice([folder for folder in person_folders if folder != person_folder])
            negative_person_path = os.path.join(root_dir, negative_person_folder)
            negative_person_images = [image for image in os.listdir(negative_person_path) if image.endswith('.jpg') or image.endswith('.png')]
            negative_image_name = random.choice(negative_person_images)

            # Load images as PIL images
            anchor_image = Image.open(os.path.join(person_path, anchor_image_name)).convert('RGB')
            positive_image = Image.open(os.path.join(person_path, positive_image_name)).convert('RGB')
            negative_image = Image.open(os.path.join(negative_person_path, negative_image_name)).convert('RGB')

            try:
                anchor_image, positive_image, negative_image = detector([anchor_image, positive_image, negative_image])
            except Exception as e:
                print(e)
                i-=1


            anchor_images.append(anchor_image)
            positive_images.append(positive_image)
            negative_images.append(negative_image)

    return anchor_images, positive_images, negative_images
