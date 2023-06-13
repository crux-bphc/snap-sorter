from torch.utils.data import Dataset
from torchvision import transforms
from PIL import Image

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
    mean = [0.5, 0.5, 0.5] if _mean is None else _mean
    std = [0.5, 0.5, 0.5] if _std is None else _std
    transform = transforms.Compose([
    transforms.Resize((img_height, img_width)),
    transforms.ToTensor(),
    transforms.Normalize(mean=mean, std=std)
    ])
    return transform