from typing import Any
from inference import EmbeddingPipeline
import datapoint_clusterer as cl
import os
import torch
import pickle

def cluster_from_file(src_path: str, dest_path: str, eps: float):
    '''
    creates clusters from datapoints stored in src_path and writes them to dest_path
    
    Args:
        src_path (str): path of .pkl file which stores datapoints
        dest_path (str): path of .pkl to which clusters are written
        eps (float): epsilon parameter of DBSCAN algorithm
    
    Returns: 
        None
    '''
    points = cl.read_datapoints(src_path)
    clusters = cl.create_clusters(points, eps)
    cl.write_clusters(clusters, dest_path)
    return None
        
def write_datapoints(src_path: str, dest_path: str):
    '''
    reads images from file or folder, creates datapoints and writes them into .pkl file
    
    Args:
        src_path (str): path of file or folder containing images
        dest_path (str): path of .pkl file to write datapoints into
    '''
    points = []
    ep = EmbeddingPipeline()
    if os.path.isfile(src_path):
        embs = ep(src_path)
        if embs is not None:
            for emb in embs:
                emb = torch.from_numpy(emb)
                pt = cl.Datapoint(emb, None, src_path)
                points.append(pt)
    else:
        for root, _, f_names in os.walk(src_path):
            for f in f_names:
                imgpath = os.path.join(root, f)
                embs = ep(imgpath)
                if embs is not None:
                    for emb in embs:
                        emb = torch.from_numpy(emb)
                        pt = cl.Datapoint(emb, None, imgpath)
                        points.append(pt)
    with open(dest_path, 'wb') as f:
        pickle.dump(points, f, protocol=pickle.HIGHEST_PROTOCOL)
    print("Written succesfully!")
    return None
        