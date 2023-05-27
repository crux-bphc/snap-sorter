from pydantic import BaseModel


class UserBase(BaseModel):
    bits_id: str
    email: str
    name: str


class ImageBase(BaseModel):
    filepath: str
    event: str
    date: str
    # location: str
    # photographer: str


class UserCreate(UserBase):
    pass


class ImageCreate(ImageBase):
    pass


class User(UserBase):
    id: int
    images: list[ImageBase] = []

    class Config:
        orm_mode = True


class Image(ImageBase):
    id: int
    users: list[UserBase] = []

    class Config:
        orm_mode = True
