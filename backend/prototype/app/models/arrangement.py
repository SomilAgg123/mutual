from app import db
from sqlalchemy.sql import func

class Arrangement(db.Model):
    __tablename__ = "arrangements"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    prompt = db.Column(db.String(100), nullable=False)
    matchmaker_id = db.Column(db.Integer, nullable=False)
    user1_id = db.Column(db.Integer, nullable=False)
    user2_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=False), server_default=func.now())
    reason1 = db.Column(db.String(256))
    reason2 = db.Column(db.String(256))

    conversation_id = db.Column(db.String(256), db.ForeignKey('conversations.id'))

    conversation = db.relationship('Conversation')

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def __repr__(self):
        return f'{self.matchmaker_id}  {self.user1_id}  {self.user2_id}'