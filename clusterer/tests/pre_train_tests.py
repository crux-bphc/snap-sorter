def test_pipeline_embedding_size(pipeline, image):
    embedding = pipeline(image)
    assert embedding.size == pipeline.embedding_size, \
    "Output embedding size does not match Pipeline embedding size"