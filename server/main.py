from typing import Annotated
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session

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
    return {"Snap Sorter": "In Development"}


# User endpoints

# Create a user


@app.post("/users/")
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_bits_id(db, bits_id=user.bits_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)


# Get a user by id


@app.get("/users/")
def read_user(
    user_id: Annotated[int | None, Query()] = None,
    bits_id: Annotated[str | None, Query()] = None,
    using_bits_id: bool = False,
    db: Session = Depends(get_db),
):
    db_user = None
    if using_bits_id:
        db_user = crud.get_user_by_bits_id(db, bits_id=bits_id)
    else:
        db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Get a user by email
# @app.get("/users/email/{email}")
# def read_user_by_email(email: str, db: Session = Depends(get_db)):
#     db_user = crud.get_user_by_email(db, email=email)
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return db_user


# Image endpoints

# Create an image


@app.post("/images/")
def create_image(image: schemas.ImageCreate, db: Session = Depends(get_db)):
    db_image = crud.get_image_by_filepath(db, filepath=image.filepath)
    if db_image:
        raise HTTPException(status_code=400, detail="Image already registered")
    return crud.create_image(db=db, image=image)


# Get an image by id


@app.get("/images/{image_id}")
def read_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image


# Tag an image


@app.post("/images/tag")
def tag_image(
    image_id: Annotated[int, Query(...)],
    user_id: Annotated[int, Query(...)],
    db: Session = Depends(get_db),
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
def read_images_by_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_images_with_tag(db, user_id=user_id)
