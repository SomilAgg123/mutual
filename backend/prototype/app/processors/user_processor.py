"""Contains all processors which manipulate a user object. """
# result parser once queries finish executing
import json

# hashing function for PW protection
import werkzeug.security as wz

# query tools
from sqlalchemy.sql import text
from psycopg2 import sql

# modules from internal codebase
from ..models import User
class UserProcessor:
    def __init__(self, db, engine, session):
        self.db = db
        self.engine = engine
        self.session = session

    def authorize_user(self, email, unhashed_pass):
        """
        Check if the user exists in the Users database and is valid, search by
        uid. If valid, return (True, uid).

        This should hash the password sent to the API as a payload from the
        frontend, compare against the entry in the Users database, and then
        verify that the hashes match.
        """
        # SECURITY
        # TODO: confirm SQLalchemy auto-escapes, prelim reading says it does
        with self.session as session:
            stmt = session.query(User).filter(User.email == email).all()

            # the first (and should be only) user in the database with matching email
            if stmt == []:
                return False, None
            else:
                user_selected = stmt[0]

            uid = user_selected.id
            hashed_pass = user_selected.password

            # check the unhashed and hashed passwords against each other
            is_valid = wz.check_password_hash(hashed_pass, unhashed_pass)
            return is_valid, uid

    def user_exists(self, phone_num):
        """
        Check if the user exists already.
        """
        with self.session as session:
            return session.query(User).filter(User.phone_num == phone_num).count() > 0

    def make_new_user(self, first_name, last_name, session_id, email, phone_num, unhashed_pass):
        """
        Makes a new user entry (unique key `uid`) in the `Users` table.

        A new user should be created iff there does not already exist the `uid`
        specified in the Users table.

        NOTE: THIS WILL NOT ALSO MAKE THE USER_TABLE.
        """
        if self.user_exists(phone_num):
            raise Exception("Did not add data. User already exists.")
        else:
            hashed_pass = wz.generate_password_hash(unhashed_pass)
            # create the new user ENTRY (add the details) into the Users db
            # hash the password and send it along to the database
            user = User(first_name=first_name,
                        last_name=last_name,
                        session_id=session_id,
                        email=email,
                        phone_num=phone_num,
                        password=hashed_pass
                        )
            with self.session as session:
                session.add(user)
                session.commit()
            return json.dumps(True)