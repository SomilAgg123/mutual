from app import db
from sqlalchemy.sql import func

class User(db.Model):
    __tablename__ = "user_account"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    session_id = db.Column(db.String(512), unique=True, nullable=False)
    email = db.Column(db.String(80), unique=True, nullable=False)
    phone_num = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return f'Student {self.first_name}'