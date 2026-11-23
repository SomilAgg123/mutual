"""
This file turns the `processors` folder into a module, allowing other folders
to import from this folder.
"""
from app import db
from sqlalchemy.orm import sessionmaker

from .user_processor import UserProcessor
from .message_processor import MessageProcessor

# engine is synonymous with connection in psycopg2
engine = db.get_engine()
# the session is synonymous with the cursor in psycopg2
Session = sessionmaker(bind=engine)
session=Session()

user_proc = UserProcessor(db, engine, session)
message_proc = MessageProcessor(db, engine, session)

def authorize_user(email, password):
    """Determines if the user is "valid" i.e. exists in the Users table,
            and if they have the correct password/user combination, returning
            (True, <uid>) if authorized, and (False, None) if not.

    Args:
        :param email: The user phone number.
        :type email: A string.
        :param password: The client password, UNHASHED.
        :type password: A string.
    """
    return user_proc.authorize_user(email, password)

def make_new_user(first_name, last_name, session_id, email, phone_num, unhashed_pass):
    """Creates a new user in the Users table, returning True if the user does
            not already eixst and raising an exception otherwise.
    """
    return user_proc.make_new_user(first_name, last_name, session_id, email, phone_num, unhashed_pass)

def add_message_to_convo(room_id, sender_uid, recipient_uid, message):
    """Creates a new message in the messages table and associates the message
            with any existing conversation ID between the two users. If the
            two users do not already have an ongoing conversation, then one is
            created."""
    return message_proc.add_message_to_convo(room_id, sender_uid, recipient_uid, message)

def get_all_messages(conversation_id):
    """Returns all messages from a room in a descending order of created time.
            If there are no messages, this returns an empty list."""
    return message_proc.get_all_messages(conversation_id)