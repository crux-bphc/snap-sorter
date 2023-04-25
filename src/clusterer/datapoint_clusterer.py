import torch
import pickle
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
import numpy as np

class Datapoint:
    '''
    Class that defines each datapoint for an individual face. 
    Each datapoint is associated with:

    Data/embedding: torch.Tensor of size(1, n)
    Label: integer
    Path: str - path to the containing image
    '''
    def __init__(self, data: torch.Tensor, label:int=None, path:str=None):
        self.data = data
        self.label = label
        self.path = path

class Cluster:
    '''
    Class that defines each cluster of similar datapoints. 
    Each cluster is associated with its own:

    id: integer - unique ID of the cluster as set by the clustering algorithm
    paths: list[str] - list of paths to images containing datapoints
    mean_encoding: mean encoding of the faces grouped under the cluster
    std_dev: standard deviation of the individual encodings detected as similar
    size: number of datapoints grouped under the cluster

    Class methods:
    add_paths - adds new paths to the cluster's list of paths
    '''
    def __init__(self, id: int):
        self.id = id
        self.paths = []
        self.mean_encoding = []
        self.std_dev = []
        self.size = len(self.paths)
        
    def add_paths(self, _paths: list[str]):
        '''
        Adds new paths to the cluster's list of paths,
        and computes the new size of the cluster

        input args:
        paths: list[str] - list of paths 

        returns:
        None
        '''
        self.paths.extend(_paths)
        self.size = len(self.paths)


def create_clusters(_datapoints: list[Datapoint], _epsilon:float, _min_samples:int=10):
    '''
    Returns a list of clusters

    input args: 
    datapoints: list[Datapoint] - a list of datapoint objects from which data and path are extracted
    epsilon: float - the value of epsilon used by the DBSCAN clusterer, max distance for a point to be considered a neighbour
    min_samples: int - minimum number of neighbours for a point to be considered a core point

    returns:
    clusters: list[Cluster] - a list of clusters found
    '''
    points = np.array([point.data[0].numpy() for point in _datapoints]) #converts data tensors of each datapoint to numpy arrays
    scaler = StandardScaler()
    scaler.fit(points)
    points = scaler.transform(points)
    clusterer = DBSCAN(eps=_epsilon, min_samples=_min_samples).fit(points)
    labels = clusterer.labels_ 
    labelIDs = np.unique(labels)
    new_clusters = []
    for labelid in labelIDs: #iterates through unique labels as given by the clusterer
        id_cluster: Cluster = Cluster(labelid) #creates new cluster associated with current label
        paths = []
        encodings = []
        pertinent_idxs = np.where(labels == labelid)[0] #selects indices where the labels correspond to the currently chosen unique label
        for idx in pertinent_idxs:
            point: Datapoint = _datapoints[idx] #selecting the datapoint
            point.label= labelid #assigning label to the point
            paths.append(point.path) #adding the path of the datapoint to the list of paths
            encodings.append(point.data.numpy()) #adding the data of the datapoint to the list of encodings
        id_cluster.add_paths(paths) #adds above paths to the cluster
        id_cluster.mean_encoding = np.mean(np.asarray(encodings), axis=0) #calc mean enc and std dev for the cluster
        id_cluster.std_dev = np.std(encodings, axis=0)
        new_clusters.append(id_cluster) #append the new cluster to the list of clusters
    return new_clusters #return new clusters created

def write_clusters(clusters: list[Cluster], _filename: str):
    '''
    Writes clusters to a .pkl file with specified path

    Input args:
    clusters: list[Cluster] - list of clusters to be written to a file
    _filename: str - name of the file clusters are to be written to

    returns:
    None
    '''
    filename = _filename
    with open(filename, 'wb') as f:
        pickle.dump(clusters, f, protocol=pickle.HIGHEST_PROTOCOL)
    print("Written succesfully!")
    return None

def read_datapoints(_filename: str):
    '''
    Reads datapoints from a specified .pkl file

    input args:
    _filename: str - name of the file data is to be read from

    returns:
    datapoints: list[Datapoint]
    '''
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
