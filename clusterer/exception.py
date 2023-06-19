class FaceNotFoundError(Exception):
    """Exception raised when no face is detected

    Args:
        path (str): Path of image for which no face was detected
        message (str): explanation of error
    """
    
    def __init__(self, path: str):
        self.path = path
        super().__init__("Face not found in path: " + path)