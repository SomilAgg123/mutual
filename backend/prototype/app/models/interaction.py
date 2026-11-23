from app import db
from sqlalchemy.sql import func

class Interaction(db.Model):
    __tablename__ = "interaction"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user1_id = db.Column(db.Integer)
    user2_id = db.Column(db.Integer)
    rejected = db.Column(db.Integer)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return f'User 1 {self.user1_id}, User 2 {self.user2_id}'