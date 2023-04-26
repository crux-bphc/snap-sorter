---
title: datapoint_clusterer
---


# datapoint_clusterer.py


### class datapoint_clusterer.Datapoint(data: torch.Tensor, label: int = None, path:str=None)

Class that defines each datapoint for an individual face. 

#### Parameters

**data**: torch.Tensor - of size(1, n)
**label**: int - label associated with the face
**path**: str - path to the containing image

#### Attributes

**data**: torch.Tensor - of size(1, n)
**label**: int - label associated with the face
**path**: str - path to the containing image



### class datapoint_clusterer.Cluster(id: int)

Class that defines each cluster of similar datapoints. 

#### Parameters 

**id**: int - label ID of the cluster

#### Attributes

**id**: int - label ID of the cluster
**paths**: list[str] - list of paths to containing images of the datapoints under the cluster
**mean_encoding**: numpy array - mean of the encodings of the datapoints under the cluster
**std_dev**: numpy array - standard deviation of the encodings of the datapoints under the cluster
**size**: int - number of datapoints in the cluster

#### Methods

**add_paths(list[str])** - Adds new paths to the cluster's list of paths, and computes the new size of the cluster



### function datapoint_clusterer.create_clusters(_datapoints: list[Datapoint], _epsilon:float, _min_samples:int=10)

Returns a list of clusters, labels datapoints belonging to the same cluster

#### Parameters

**datapoints**: list[Datapoint] - a list of datapoint objects to be clustered, from which data and path are extracted and labels are assigned
**epsilon**: float - the value of epsilon used by the DBSCAN clusterer, max distance for a point to be considered a neighbour
**min_samples**: int - minimum number of neighbours for a point to be considered a core point

#### returns

**clusters**: list[Cluster] - a list of clusters found



### function datapoint_clusterer.write_clusters(clusters: list[Cluster], _filename: str)

Writes clusters to a .pkl file with specified path

#### Parameters

**clusters**: list[Cluster] - list of clusters to be written to a file
**_filename**: str - name of the file clusters are to be written to

#### Returns

**None**



### function datapoint_clusterer.read_datapoints(_filename: str)

Reads datapoints from a specified .pkl file

#### Parameters

**_filename**: str - name of the file data is to be read from

#### Returns

**datapoints**: list[Datapoint] - the datapoints extracted from the file



