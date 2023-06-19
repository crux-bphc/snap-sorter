from inference import EmbeddingPipeline
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import datapoint_clusterer as clusterer
import os
import torch
import pickle

def cluster_from_file(source_path: str, dest_path: str, epsilon: float):
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
    clusters = clusterer.create_clusters(points, epsilon)
    clusterer.write_clusters(clusters, dest_path)
    return None
        
def write_datapoints(source_path: str, dest_path: str):
    '''
    reads images from file or folder, creates datapoints and writes them into .pkl file
    
    Args:
        source_path (str): path of file or folder containing images
        dest_path (str): path of .pkl file to write datapoints into
    
    Returns:
        None
    '''
    points = []
    pipeline = EmbeddingPipeline()
    if os.path.isfile(source_path):
        embeddings = pipeline(source_path)
        if embeddings is not None:
            for embedding in embeddings:
                embedding = torch.from_numpy(embedding)
                point = clusterer.Datapoint(embedding, None, source_path)
                points.append(point)
    else:
        for root, _, filenames in os.walk(source_path):
            for filename in filenames:
                imgpath = os.path.join(root, filename)
                embeddings = pipeline(imgpath)
                if embeddings is not None:
                    for embedding in embeddings:
                        embedding = torch.from_numpy(embedding)
                        point = clusterer.Datapoint(embedding, None, imgpath)
                        points.append(point)
    with open(dest_path, 'wb') as f:
        pickle.dump(points, f, protocol=pickle.HIGHEST_PROTOCOL)
    print("Written succesfully!")
    return None
        
    
        
            
            