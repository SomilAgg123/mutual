"""Contains all processors which manipulate a user object. """
# result parser once queries finish executing
import json

from flask import jsonify
# sqlalchemy imports
from sqlalchemy import and_, or_

# hashing function for PW protection
import werkzeug.security as wz

# uuid for id generation for new rooms
import uuid

# sqlalchemy error detection
from sqlalchemy.exc import SQLAlchemyError

# modules from internal codebase
from ..models import Conversation, Message
class MessageProcessor:
    def __init__(self, db, engine, session):
        self.db = db
        self.engine = engine
        self.session = session

    def make_new_convo(self, sender, recipient, room_id):
        """
        HELPER to make a new conversation between uid1 and uid2.

        Note: this will not add any messages between the two people.
        """
        try:
            # create the new conversation entry
            conversation = Conversation(
                id=room_id,
                participant_one=sender,
                participant_two=recipient
            )
            with self.session as session:
                session.add(conversation)
                session.commit()

            return conversation

        except SQLAlchemyError as e:
            self.session.rollback()
            return str(e)

    def add_message_to_convo(self, room_id, sender_uid, recipient_uid, message):
        """
        Add a message from a client with `sender_uid` sent in `room_id`.

        `room_id` is an id of a conversation, and `sender_uid` is a
            user's uid. `message` is the message text itself.
        """
        # first get the room and the `uid`s of the two people
        with self.session as session:
            try:
                room = session.query(Conversation).where(Conversation.id == room_id).first()

                if room:
                    # if a conversation exists, then add the message to it
                    message = Message(
                        content=message,
                        user_id=sender_uid,
                        conversation_id=room.id
                    )
                    session.add(message)
                    session.commit()
                    return jsonify("message successfully added!")

                else:
                    # otherwise, create a new conversation and add the message to it
                    sender = sender_uid
                    recipient = recipient_uid
                    conversation_id = room_id

                    try:
                        with self.session as session:
                            # create the new conversation entry
                            conversation = Conversation(
                                id=room_id,
                                participant_one=sender,
                                participant_two=recipient
                            )
                            session.add(conversation)
                            session.commit()

                            message = Message(
                                content=message,
                                user_id=sender,
                                conversation_id=conversation_id
                            )
                            session.add(message)
                            session.commit()

                            return jsonify(True)

                    except SQLAlchemyError as e:
                        session.rollback()
                        return str(e)

            except SQLAlchemyError as e:
                session.rollback()
                return str(e)

    def get_all_messages(self, conversation_id):
        """Get all messages from `conversation_id`.
        """
        with self.session as session:
            # find any conversation which exists between sender and recipient
            result = session.query(Conversation).where(
                Conversation.id == conversation_id
            ).first()

            # if there exists a conversation, return all messages associated with
            # that conversation id
            if result:
                # query messages to get all messages associated with that convo
                messages = session.query(Message).filter_by(
                    conversation_id=conversation_id
                ).order_by(Message.updated_at.desc()).all()

                # return the messages in a json format
                messages_unraveled = list(map(lambda message: message.as_dict(), messages))
                return jsonify(messages_unraveled)
            else:
                return jsonify([])
