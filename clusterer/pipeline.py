from inference import EmbeddingPipeline
import datapoint_clusterer as clusterer
import numpy as np
import os
import torch
import pickle
from exception import FaceNotFoundError

def cluster_from_file(source_path: str, dest_path: str, epsilon: float, min_samples: int=5):
    '''
    creates clusters from datapoints stored in source_path and writes them to dest_path

    Args:
        source_path (str): path of .pkl file which stores datapoints
        dest_path (str): path of .pkl to which clusters are written
        epsilon (float): epsilon parameter of DBSCAN algorithm
    
    Returns: 
        None
    '''
    points = clusterer.read_datapoints(source_path)
    clusters = clusterer.create_clusters(points, epsilon, min_samples)
    clusterer.write_clusters(clusters, dest_path)
    return None
        
def write_datapoints(source_path: str, dest_path: str):
    '''
    reads images from folder, creates datapoints and writes them into .pkl file
    
    Args:
        source_path (str): path of file or folder containing images
        dest_path (str): path of .pkl file to write datapoints into
    
    Returns:
        None
    '''
    points = []
    pipeline = EmbeddingPipeline()
    for root, _, filenames in os.walk(source_path):
        for filename in filenames:
            imgpath = os.path.join(root, filename)
            embeddings = pipeline(imgpath)
            if embeddings is not None:
                for embedding in embeddings:
                    embedding = torch.from_numpy(embedding)
                    point = clusterer.Datapoint(embedding, None, imgpath)
                    points.append(point)
            else:
                print(FaceNotFoundError(imgpath))
                
    with open(dest_path, 'wb') as f:
        pickle.dump(points, f, protocol=pickle.HIGHEST_PROTOCOL)
    print("Written succesfully!")
    return None

def get_cluster_ids(clusters: list[clusterer.Cluster], image_path: str):
    '''
        returns cluster IDs of all faces detected in a particular image
        
        Args:
            clusters (list[clusterer.Cluster]): list of clusters to classify faces into
            image_path (str): path of image
            
        Returns:
            cluster_ids (np.ndarray): IDs of all faces detected in image
    '''
    pipeline = EmbeddingPipeline()
    embeddings = pipeline(image_path)
    lookup = {idx : cluster.id for idx, cluster in enumerate(clusters)}
    if embeddings is not None:
        num_faces = embeddings.shape[0]
        cluster_ids = np.ones(shape = num_faces, dtype=int) * -1
        for i in range(num_faces):
            distances = [np.linalg.norm(embeddings[i] - cluster.mean_encoding) for cluster in clusters]
            min_dist_idx = np.argmin(distances)
            cluster_ids[i] = lookup[min_dist_idx]
            
        return cluster_ids
    
    else:
        raise FaceNotFoundError(image_path)

