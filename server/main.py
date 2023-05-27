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
