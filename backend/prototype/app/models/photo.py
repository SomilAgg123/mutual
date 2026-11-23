from sqlalchemy.orm import declarative_base
from sqlalchemy.schema import Column
from sqlalchemy.types import *

base = declarative_base()

class Photo(base):
    __tablename__ = "photo"
    # id = Column(Integer, primary_key=True, autoincrement=True)
    UserID = Column(Integer)
    PhotoURL = Column(String)
    Priority = Column(Integer)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return f'Photo with URL: {self.PhotoURL}'