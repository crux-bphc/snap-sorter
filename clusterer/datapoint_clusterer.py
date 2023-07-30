import torch
import pickle
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import numpy as np

class Datapoint:
    """
    Class that defines each datapoint for an individual face. 
    
    Attributes:
        Data/embedding: torch.Tensor of size(1, n)
        Label: integer
        Path: str - path to the containing image
    """
    def __init__(self, data: torch.Tensor, label:int=None, path:str=None):
        """
        Initializes the instance

        Args:
            Data/embedding (torch.Tensor) : of shape (1, n)
            Label (int) : identifier
            Path (str) : path to the containing image
        """
        self.data = data
        self.label = label
        self.path = path

class Cluster:
    """
    Class that defines each cluster of similar datapoints. 
    
    Attributes:
        id (int) : unique ID of the cluster as set by the clustering 
                      algorithm
        datapoints (list[Datapoint]) : datapoints present in the cluster
        paths (list[str]) : list of paths to images containing datapoints
        mean_encoding (list[float]) : mean encoding of the faces grouped under the cluster
        std_dev (list[float]): standard deviation of the individual encodings detected as 
                 similar
        size (int): number of datapoints grouped under the cluster

    Class methods:
    add_paths - adds new paths to the cluster's list of paths
    """
    def __init__(self, id: int):
        """
        Initializes the instance

        Args:
            id (int) : Label ID associated with the cluster
        """
        self.id = id
        self.datapoints = []
        self.paths = []
        self.mean_encoding = []
        self.std_dev = []
        self.size = len(self.paths)
        
    def add_paths(self, _paths: list[str]):
        """
        Adds new paths to the cluster's list of paths, and computes the new 
        size of the cluster

        Args:
            paths (list[str]) : list of paths 

        Returns:
            None
        """
        self.paths.extend(_paths)
        self.size = len(self.paths)


def create_clusters(_datapoints: list[Datapoint], _epsilon:float, _min_samples:int=10):
    """
    Returns a list of clusters

    Args: 
        datapoints (list[Datapoint]) : a list of datapoint objects from which 
                                      data and path are extracted
        _epsilon (float) : the value of epsilon used by the DBSCAN clusterer, max 
                         distance for a point to be considered a neighbour
        min_samples (int) : minimum number of neighbours for a point to be 
                           considered a core point

    Returns:
        list[Cluster] : a list of clusters found
    """
    points = np.array([point.data for point in _datapoints]) 
    scaler = StandardScaler()
    scaler.fit(points)
    points = scaler.transform(points)
    clusterer = DBSCAN(eps=_epsilon, min_samples=_min_samples).fit(points)
    labels = clusterer.labels_ 
    labelIDs = np.unique(labels)
    new_clusters = []
    for labelid in labelIDs: 
        id_cluster: Cluster = Cluster(labelid) 
        paths = []
        encodings = []
        pertinent_idxs = np.where(labels == labelid)[0] 
        for idx in pertinent_idxs:
            point: Datapoint = _datapoints[idx] 
            point.label= labelid 
            paths.append(point.path) 
            encodings.append(point.data.numpy()) 
            id_cluster.datapoints.append(point)
        id_cluster.add_paths(paths) 
        id_cluster.mean_encoding = np.mean(np.asarray(encodings), axis=0) 
        id_cluster.std_dev = np.std(encodings, axis=0)
        new_clusters.append(id_cluster) 
    return new_clusters 

def write_clusters(clusters: list[Cluster], _filename: str):
    """
    Writes clusters to a .pkl file with specified path

    Args:
        clusters (list[Cluster]) : list of clusters to be written to a file
        _filename (str) : name of the file clusters are to be written to

    Returns:
        None
    """
    filename = _filename
    with open(filename, 'wb') as f:
        pickle.dump(clusters, f, protocol=pickle.HIGHEST_PROTOCOL)
    print("Written succesfully!")
    return None

def read_datapoints(_filename: str):
    """
    Reads datapoints from a specified .pkl file

    Args:
        _filename (str) : name of the file data is to be read from

    Returns:
        list[Datapoint]
    """
    datapoints = None
    filename = _filename
    with open(filename, 'rb') as f:
        try:
            datapoints = pickle.load(file=f)
            print("Read!!")
        except Exception as e:
            print(f"Read failed: {e}")
            pass
    return datapoints

def read_clusters(_filename: str):
    """
    Reads clusters from a specified .pkl file

    Args:
        _filename (str) : name of the file clusters are to be read from

    Returns:
        list[Cluster]
    """
    clusters = None
    filename = _filename
    with open(filename, 'rb') as f:
        try:
            clusters = pickle.load(file=f)
            print("Read!!")
        except Exception as e:
            print(f"Read failed: {e}")
            pass
    return clusters
