from fastapi import Depends, FastAPI, HTTPException
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


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_bits_id(db, bits_id=user.bits_id)
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")
    return crud.create_user(db=db, user=user)


# Get a user by id


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Get a user by BITS ID
@app.get("/users/bits_id/{bits_id}", response_model=schemas.User)
def read_user_by_bits_id(bits_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_bits_id(db, bits_id=bits_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Get a user by email
@app.get("/users/email/{email}", response_model=schemas.User)
def read_user_by_email(email: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=email)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# Image endpoints

# Create an image


@app.post("/images/", response_model=schemas.Image)
def create_image(image: schemas.ImageCreate, db: Session = Depends(get_db)):
    db_image = crud.get_image_by_filepath(db, filepath=image.filepath)
    if db_image:
        raise HTTPException(status_code=400, detail="Image already registered")
    return crud.create_image(db=db, image=image)


# Get an image by id


@app.get("/images/{image_id}", response_model=schemas.Image)
def read_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image
