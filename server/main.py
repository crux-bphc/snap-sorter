from typing import Annotated
from fastapi import Body, Depends, FastAPI, HTTPException, Path, Query
from sqlalchemy.orm import Session
import re

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"Message": "Please go to /docs, to test the API"}


# User endpoints

# Create a user


@app.post("/users/", response_model=schemas.User)
def create_user(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[
        schemas.UserCreate,
        Body(
            ...,
            title="User definition",
            description="Object that gets converted to a user",
        ),
    ],
):
    db_user = crud.get_user_by_bits_id(db, bits_id=user.bits_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)


# Get a user by id (or) bits_id


@app.get("/users/")
def read_user(
    db: Annotated[Session, Depends(get_db)],
    user_id: Annotated[
        int | None,
        Query(alias="user-id", title="User ID", description="User ID"),
    ] = None,
    bits_id: Annotated[
        str | None,
        Query(
            alias="bits-id",
            title="BITS ID",
            description="Your BITS ID number",
        ),
    ] = None,
    using_bits_id: Annotated[
        bool,
        Query(
            title="Using BITS ID",
            description="Boolean to indicate whether to use BITS ID or User ID",
        ),
    ] = False,
):
    db_user = None
    if using_bits_id:
        # single degree ID match (eg: 2018A7PS0001H) or dual degree ID match (eg: 2018B4A70001H)
        check: bool = re.match("^\d{4}[A-Z][1-7][P|T]S\d{4}H$", bits_id) or re.match(
            "^\d{4}[A-B][1-7][A-B][1-7]\d{4}H$", bits_id
        )
        if not check:
            raise HTTPException(status_code=400, detail="Invalid BITS ID")
        db_user = crud.get_user_by_bits_id(db, bits_id=bits_id)
    else:
        db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Image endpoints

# Create an image


@app.post("/images/")
def create_image(
    db: Annotated[Session, Depends(get_db)],
    image: Annotated[
        schemas.ImageCreate,
        Body(
            ...,
            title="Image definition",
            description="Object that gets converted to an image",
        ),
    ],
):
    db_image = crud.get_image_by_filepath(db, filepath=image.filepath)
    if db_image:
        raise HTTPException(status_code=400, detail="Image already registered")
    return crud.create_image(db=db, image=image)


# Get an image by id


@app.get("/images/{image_id}")
def read_image(
    db: Annotated[Session, Depends(get_db)],
    image_id: Annotated[
        int,
        Path(
            ...,
            gt=0,
            title="Image ID",
            description="Image ID based on which the image is fetched",
        ),
    ],
):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image


# Tag an image


@app.post("/images/tag/")
def tag_image(
    db: Annotated[Session, Depends(get_db)],
    image_id: Annotated[
        int,
        Query(
            ..., gt=0, title="Image ID", description="Image's ID which is to be tagged"
        ),
    ],
    user_id: Annotated[
        int,
        Query(
            ...,
            gt=0,
            title="User ID",
            description="User's ID who is tagged in the image",
        ),
    ],
):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.tag_image(db, image_id, user_id)


# Get images where user is tagged


@app.get("/images/user/{user_id}")
def read_images_by_user(
    db: Annotated[Session, Depends(get_db)],
    user_id: Annotated[
        int,
        Path(
            ...,
            gt=0,
            title="User ID",
            description="User's ID whose images are to be fetched",
        ),
    ],
):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_images_with_tag(db, user_id=user_id)
