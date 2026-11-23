from app import db
from sqlalchemy.sql import func

class Conversation(db.Model):
    __tablename__ = "conversations"

    id = db.Column(db.String(256), primary_key=True)
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())
    participant_one = db.Column(db.Integer, db.ForeignKey('user_account.id'))
    participant_two = db.Column(db.Integer, db.ForeignKey('user_account.id'))
    read = db.Column(db.Boolean)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}