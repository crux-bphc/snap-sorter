---
title: inference
---

# inference.py

## inference.EmbeddingPipeline
### class inference.EmbeddingPipeline(detector = None, resnet = None, device = 'cpu', pretrained = 'vggface2', resize = None)

pipeline class for detecting faces from a single image and converting to embedding vectors (https://github.com/timesler/facenet-pytorch  - MTCNN and InceptoinResnetV1)

#### Parameters

**detector**: model for detection of faces in image, takes facenet_pytorch.MTCNN if `None`  
**resnet**: model for embedding of features, takes facenet_pytorch.InceptionResnetV1 if `None`  
**device**: device used to run models, default = 'cpu'  
**pretrained**: pretrained model for `resnet`, default = 'vggface2'  
**resize**: resizes image input if not `None`  

### Call

#### Parameters

**filepath** : str, path of image from which faces are detected

#### Returns

List of embeddinig vectors for all faces in the image

### EmbeddingPipeline._create_embeddings

#### Parameters

**faces**: list of tensors of detected faces

#### Returns

list of embedding vectors of size {torch.Size([1, 512])}

### EmbeddingPipeline._equalize

#### Parameters

img: PIL Image

### Returns

equalized image (contrast enhanced)









