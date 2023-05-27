from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql.sqltypes import DateTime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    bits_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, index=True)

    images = relationship(
        "Image", secondary="association_table", back_populates="users"
    )

    def __repr__(self):
        return f"<User {self.id}, >"


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    filepath = Column(String, unique=True, index=True)
    event = Column(String, index=True)
    date = Column(DateTime, index=True)
    # location = Column(String, index=True)
    # photographer = Column(String, index=True)
    users = relationship("User", secondary="association_table", back_populates="images")

    def __repr__(self):
        return f"<Image {self.filename}>"


association_table = Table(
    "association_table",
    Base.metadata,
    Column("user_id", ForeignKey("users.id")),
    Column("image_id", ForeignKey("images.id")),
)
