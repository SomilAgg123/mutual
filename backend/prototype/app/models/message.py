from app import db
from sqlalchemy.sql import func

class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.Text, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False, server_default=func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('user_account.id'))
    conversation_id = db.Column(db.String(256), db.ForeignKey('conversations.id'))

    user = db.relationship('User')
    conversation = db.relationship('Conversation')

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}
