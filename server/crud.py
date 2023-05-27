from sqlalchemy.orm import Session

import models, schemas


# User CRUD


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(bits_id=user.bits_id, email=user.email, name=user.name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_bits_id(db: Session, bits_id: str):
    return db.query(models.User).filter(models.User.bits_id == bits_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


# Image CRUD


def create_image(db: Session, image: schemas.ImageCreate):
    db_image = models.Image(filepath=image.filepath, event=image.event, date=image.date)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def get_image(db: Session, image_id: int):
    return db.query(models.Image).filter(models.Image.id == image_id).first()


def get_image_by_filepath(db: Session, filepath: str):
    return db.query(models.Image).filter(models.Image.filepath == filepath).first()


def get_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Image).offset(skip).limit(limit).all()


# Tagging


def tag_image(db: Session, image_id: int, user_id: int):
    db_image = db.query(models.Image).filter(models.Image.id == image_id).first()
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    db_image.users.append(db_user)
    db.commit()
    db.refresh(db_image)
    return {
        "image_id": db_image.id,
        "user_id": db_user.id,
    }


def get_images_with_tag(db: Session, user_id: int) -> list[schemas.Image]:
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    return db_user.images
