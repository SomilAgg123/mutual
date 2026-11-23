from app import db
from sqlalchemy.sql import func

class Profile(db.Model):
    __tablename__ = "user_profile"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(80), unique=True, nullable=False)
    phoneNum = db.Column(db.String(24))
    firstName = db.Column(db.String(24))
    lastName = db.Column(db.String(24))
    birthday = db.Column(db.DateTime(timezone=False), server_default=func.now())
    gender = db.Column(db.Integer)
    sexuality = db.Column(db.Integer)
    datePref = db.Column(db.String(32))
    currentLocation = db.Column(db.String(32))
    word1 = db.Column(db.String(24))
    word2 = db.Column(db.String(24))
    word3 = db.Column(db.String(24))
    quality1 = db.Column(db.String(24))
    quality2 = db.Column(db.String(24))
    answer1 = db.Column(db.String(100))
    answer2 = db.Column(db.String(100))
    ethnicity = db.Column(db.Integer)
    hometown = db.Column(db.String(24))
    work = db.Column(db.String(24))
    jobTitle = db.Column(db.String(24))
    school = db.Column(db.String(32))
    dateOutOfRace = db.Column(db.Integer)
    onlyMatchmake = db.Column(db.Integer)
    politicalAffiliation = db.Column(db.Integer)
    politicalImportance = db.Column(db.Integer)
    politicalFriendImportance = db.Column(db.Integer)
    timeOfDay = db.Column(db.Integer)
    drink = db.Column(db.Integer)
    smoke = db.Column(db.Integer)
    drugs = db.Column(db.Integer)
    religion = db.Column(db.Integer)
    religionImportance = db.Column(db.Integer)
    pdaPreference = db.Column(db.Integer)
    mb = db.Column(db.Integer)
    personalityType = db.Column(db.Integer)
    decisive = db.Column(db.Integer)
    opinionated = db.Column(db.Integer)
    zodiac = db.Column(db.Integer)
    giveLoveLanguage = db.Column(db.Integer)
    receiveLoveLanguage = db.Column(db.Integer)
    # # FOREIGN KEYS
    # id = db.Column(db.Integer, primary_key=True)
    # user_account_id = db.Column(db.Integer)
    # prompt_id = db.Column(db.Integer)
    # photo_id = db.Column(db.Integer)
    # gender_id = db.Column(db.Integer)
    # interested_in_gender = db.Column(db.Integer)

    # # USER PROFILE FEATURES
    # birthday = db.Column(db.DateTime(timezone=False), server_default=func.now())
    # profile_link = db.Column(db.String(80), default="default_link.mutual.com")
    # popularity = db.Column(db.Float, default=100, nullable=False)
    # active = db.Column(db.Boolean, default=1, nullable=False)

    def as_dict(self):
       return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    # def __repr__(self):
    #     return f'Profile with profile id: {self.id}'