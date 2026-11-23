import os
import json

# import flask utilities
from flask import current_app as app
from flask import request
from flask import jsonify
from flask import send_file
from flask_cors import CORS, cross_origin

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy import and_, or_, not_, func
from sqlalchemy.sql.expression import exists

import boto3
from werkzeug.utils import secure_filename
from sqlalchemy.exc import SQLAlchemyError
import logging
log = logging.getLogger("werkzeug")
log.setLevel(logging.ERROR)
logging.getLogger("botocore").setLevel(logging.CRITICAL)
logging.getLogger("boto3").setLevel(logging.CRITICAL)
logging.getLogger("urllib3").setLevel(logging.CRITICAL)
# imports for token management
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required, JWTManager

# from algorithm.algorithm import calculate_similarity_score
# from algorithm.algorithm import calculate_complementarity_score
from app.algorithm.algorithm import Algorithm
from app.algorithm.reasons import Reason

s3 = boto3.client('s3')

# set app configurations to connect to the database, TODO: FIX THIS
app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["CORS_ALLOW_HEADERS"] = ['Content-Type', 'Authorization']
app.config["CORS_HEADERS"] = ['Content-Type']

from .processors import *

# Historical cloud connection removed.
# factory = sessionmaker(bind=engine)
# session = factory()
# for instance in session.query(Lead).filter_by(FirstName="Bob"):
# 	print("Industry: ", instance.Industry)
# 	print("Revenue: ", instance.Revenue)
# 	print("---------")

# setting up engines, necessary for proper DB interactivity
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], pool_pre_ping=True)
Session = sessionmaker(bind=engine)
session = Session()

# import the SQLAlchemy database instance
from app import db
from .models import User, Profile, Friend, Arrangement, Interaction, Conversation, Message
from app.aws_controller import DynamoDB

jwt = JWTManager(app)

def top_two(j):
    j_sorted= sorted(j.items(), key=lambda x:x[1], reverse=True)
    s1 = int(j[j_sorted[0][0]])
    s2 = int(j[j_sorted[1][0]])
    return {j_sorted[0][0]: s1, j_sorted[1][0] : s2}

def format_json(j):
    k = list(j.keys())
    result = {}
    for i in range(len(k)):
        result[i] = {k[i] : j[k[i]]}

    return result

@app.route("/")
def basic(methods=["GET"]):
    return "basic"

####### TOKENS #######
@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/api/token', methods=["POST"])
@cross_origin()
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # auth_info = authorize_user(email, password)
    auth_info = True, "temp_uid" # do not uncomment unless you want everyone to be valid lol
    is_authorized = 0
    uid = 1

    if not auth_info[is_authorized]:
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"token": access_token}
    return response

@app.route('/api/onboard', methods=["POST"])
def create_onboard_token():
    return {"onboard_token": True}

######## USER CREDENTIALS ########
@app.route("/api/user/credentials", methods=["POST"])
def makeUser():
    """
    Sends the user's id, username, email, phone number, and
    password to the database, hashing the password en-route.

    # TODO choose a hashing function
    """
    first_name = request.json.get("first_name", None)
    last_name = request.json.get("last_name")
    session_id = request.json.get("session_id")
    email = request.json.get("email", None)
    phone_num = request.json.get("phone_num", None)
    password = request.json.get("password", None)

    result = make_new_user(first_name, last_name, session_id, email, phone_num, password)

    # # hash the password and send it along to the database
    # user = User(first_name=first_name,
    #             last_name=last_name,
    #             email=email,
    #             phone_num=phone_num,
    #             password=password
    #             )
    # session.add(user)
    # session.commit() # this line having issues

    # notify that the request has completed
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/api/user/credentials/<id>", methods=["POST"])
def deleteUser(id):
    """
    This is a helper function to delete users from the database.

    A user should only be deleted if their password matches the one given
    in the database. If their password does not match, this function should
    fail with a 422: Invalid Password argument.

    More on why 422 here:
    https://www.bennadel.com/blog/2434-http-status-codes-for-invalid-data-400-vs-422.htm
    """
    # user = session.query(User).get(id)
    # session.delete(user)
    # session.commit()
    # session.close()
    try:
        user = session.query(User).get(id)
        session.delete(user)
        session.commit()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/user/credentials/<id>", methods=["GET"])
def getCredentials(id):
    """

    """
    try:
        user = session.query(User).get(id).as_dict()
        return user
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/user/credentials/<id>/<field>", methods=["GET"])
def getCredentialInfo(id, field):
    """
    Return the value of `field` for a user `id`. This function is valid on all
    fields except a user's password.
    """
    try:
        ans = ""
        user = session.query(User).get(id)
        if field == "first_name":
            ans = user.first_name
        elif field == "last_name":
            ans = user.last_name
        elif field == "email":
            ans = user.email
        elif field == "phone_num":
            ans = user.phone_num
        elif field == "password":
            ans = user.password
        elif field == "created_at":
            ans = str(user.created_at)
        return jsonify(ans)
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/user/verify/email/<email>", methods=["GET"])
def verifyEmail(email):
    """
    Verify that email is not already being used.
    """
    try:
        user = session.query(User).filter_by(email=email).all()
        if user != None:
            return True
        else:
            return False
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/user/verify/<email>/<password>", methods=["GET"])
def verifyPassword(email, password):
    """
    Verify that the password for the given email is correct.
    """
    try:
        user = session.query(User).filter_by(email=email).all()
        if user == None:
            return False
        elif user.password != password:
            return False
        else:
            return True
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/user/credentials/<id>/<field>", methods=["PUT"])
def updateCredentialInfo(id, field):
    """
    Update `id`'s credentials with the specified body of the request.
    """
    try:
        user = session.query(User).get(id)
        new_val = request.json.get("new_val", None)

        if field == "first_name":
            user.first_name = new_val
        elif field == "last_name":
            user.last_name = new_val
        elif field == "email":
            user.email = new_val
        elif field == "phone_num":
            user.phone_num = new_val
        elif field == "password":
            user.password = new_val
        elif field == "created_at":
            user.created_at = new_val

        session.commit()
        return user.as_dict()
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

######## USER PROFILES ########
@app.route("/api/profile", methods=["POST"])
def makeProfile():
    """
    Create a user's profile and store it into the database.

    Note that we don't store photos here, as we are going to create a separate
    entity for photos which will enable users to link multiple photos to their
    profile.
    """
    # USER PROFILE FEATURES
    # id = "2"
    try:
        email = request.json.get("email", None)
        phoneNum = request.json.get("phoneNum", None)
        firstName = request.json.get("firstName", None)
        lastName = request.json.get("lastName", None)
        temp = request.json.get("birthday", None)
        birthday = datetime.strptime(temp, '%m/%d/%Y')
        gender = request.json.get("gender", None)
        sexuality = request.json.get("sexuality", None)

        men = request.json.get("men", None)
        women = request.json.get("women", None)
        nonbinary = request.json.get("nonbinary", None)
        other = request.json.get("other", None)
        if men != None:
            datePref = "men"
        if women != None:
            datePref = "women"
        if nonbinary != None:
            datePref = "nonbinary"
        if other != None:
            datePref = "other"

        # datePref = request.json.get("datePref", None)

        currentLocation = request.json.get("currentLocation", None)
        word1 = request.json.get("word1", None)
        word2 = request.json.get("word2", None)
        word3 = request.json.get("word3", None)
        quality1 = request.json.get("quality1", None)
        quality2 = request.json.get("quality2", None)
        answer1 = request.json.get("answer1", None)
        answer2 = request.json.get("answer2", None)
        ethnicity = request.json.get("ethnicity", None)
        hometown = request.json.get("hometown", None)
        work = request.json.get("work", None)
        jobTitle = request.json.get("jobTitle", None)
        school = request.json.get("school", None)
        dateOutOfRace = request.json.get("dateOutOfRace", None)
        onlyMatchmake = request.json.get("onlyMatchmake", None)
        politicalAffiliation = request.json.get("politicalAffiliation", None)
        politicalImportance = request.json.get("politicalImportance", None)
        politicalFriendImportance = request.json.get("politicalFriendImportance", None)
        timeOfDay = request.json.get("timeOfDay", None)
        drink = request.json.get("drink", None)
        smoke = request.json.get("smoke", None)
        drugs = request.json.get("drugs", None)
        religion = request.json.get("religion", None)
        religionImportance = request.json.get("religionImportance", None)
        pdaPreference = request.json.get("pdaPreference", None)
        mb = request.json.get("mb", None)
        personalityType = request.json.get("personalityType", None)
        decisive = request.json.get("decisive", None)
        opinionated = request.json.get("opinionated", None)
        zodiac = request.json.get("zodiac", None)
        giveLoveLanguage = request.json.get("giveLoveLanguage", None)
        receiveLoveLanguage = request.json.get("receiveLoveLanguage", None)

        #TODO: CHANGE TO INCLUDE PROPER ID
        # photo_urls = request.json.get("photos")
        # addPhotos(4, photo_urls)

        user_profile = Profile(
            # id=id,
            email=email,
            phoneNum=phoneNum,
            firstName=firstName,
            lastName=lastName,
            birthday=birthday,
            gender=gender,
            sexuality=sexuality,
            datePref=datePref,
            currentLocation=currentLocation,
            word1=word1,
            word2=word2,
            word3=word3,
            quality1=quality1,
            quality2=quality2,
            answer1=answer1,
            answer2=answer2,
            ethnicity=ethnicity,
            hometown=hometown,
            work=work,
            jobTitle=jobTitle,
            school=school,
            dateOutOfRace=dateOutOfRace,
            onlyMatchmake=onlyMatchmake,
            politicalAffiliation=politicalAffiliation,
            politicalImportance=politicalImportance,
            politicalFriendImportance=politicalFriendImportance,
            timeOfDay=timeOfDay,
            drink=drink,
            smoke=smoke,
            drugs=drugs,
            religion=religion,
            religionImportance=religionImportance,
            pdaPreference=pdaPreference,
            mb=mb,
            personalityType=personalityType,
            decisive=decisive,
            opinionated=opinionated,
            zodiac=zodiac,
            giveLoveLanguage=giveLoveLanguage,
            receiveLoveLanguage=receiveLoveLanguage
        )
        prof = user_profile.as_dict()
        session.add(user_profile)
        session.commit()

        return json.dumps(prof, default=str)
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/profile/<profile_id>", methods=["GET"])
def getProfile(profile_id):
    """
    Return `profile_id`'s profile.
    """
    try:
        user_profile = session.query(Profile).get(profile_id)

        return user_profile.as_dict()
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/profile", methods=["GET"])
def getAllProfiles():
    """
    Return all profiles in the database.
    """
    try:
        all_profiles = session.query(Profile).all()
        json_result = [profile.as_dict() for profile in all_profiles]
        # return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
        return json_result
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

    # all_profiles = session.query(Profile).all()
    # json_result = [profile.as_dict() for profile in all_profiles]

    # session.close()
    # return json_result

@app.route("/api/profile/<profile_id>/<field>", methods=["GET"])
def getProfileInfo(profile_id, field):
    """
    Return the value of a field from Mutual gathered information associated
    with `profile_id`'s profile.
    """
    user_profile = getProfile(profile_id)
    return str(user_profile[field])

@app.route("/api/profile/<profile_id>/<field>", methods=["PUT"])
def updateProfileInfo(profile_id, field):
    """
    Update `id`'s profile information with the specified body of the request.
    """
    try:
        user_profile = session.query(Profile).get(profile_id)
        new_val = request.json.get("new_val", None)
        setattr(user_profile, field, new_val)

        session.commit()
        return user_profile.as_dict()
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/profile/email/<email>", methods=["GET"])
def getProfileFromEmail(email):
    """
    Return `email`'s profile.
    """
    try:
        user_profile = session.query(Profile).filter_by(email=email).first()
        if user_profile:
            return user_profile.as_dict()
        else:
            return jsonify([])

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify([])

######## CARD STACK ########
@app.route("/api/card/<profile_id>", methods=["GET"])
def getCard(profile_id):
    profile = getProfile(profile_id)
    result = {}
    result["id"] = profile_id
    result["first_name"] = profile["firstName"]
    result["last_name"] = profile["lastName"]
    result["birthday"] = profile["birthday"]
    result["answer1"] = profile["answer1"]
    result["answer2"] = profile["answer2"]
    result["current_location"] = profile["currentLocation"]
    try:
        result["profile_photo_url"] = getProfilePhoto(profile_id)[0]["PhotoURL"]
    except:
        result["profile_photo_url"] = ''

    return result

@app.route("/api/card/stack/<profile_id>", methods=["GET"])
def getCardStack(profile_id):
    # friends = getFriendsList(profile_id)
    friends = getAllProfiles()
    stack = {}
    count = 0
    for f in friends:
        id = f["id"]
        interaction = getInteraction(profile_id, id)
        if interaction == {}:
            stack[count] = getCard(id)
            count += 1
    return stack

######## INTERACTION ########
@app.route("/api/interaction/<profile_id1>/<profile_id2>", methods=["GET"])
def getInteraction(profile_id1, profile_id2):
    try:
        interaction = session.query(Interaction).filter_by(user1_id=profile_id1, user2_id=profile_id2).all()
        result = {}
        count = 0
        for i in interaction:
            i_json = i.as_dict()
            del i_json["id"]
            result[count] = i_json
            count += 1

        return result

    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()




@app.route("/api/interaction/list/<profile_id>", methods=["GET"])
def getInteractionList(profile_id):
    try:
        interaction1 = session.query(Interaction).filter_by(user1_id=profile_id).all()
        interaction2 = session.query(Interaction).filter_by(user2_id=profile_id).all()
        result = {}
        count = 0

        for i in interaction1:
            i_json = i.as_dict()
            del i_json["id"]
            del i_json["user1_id"]
            i_json["id"] = i_json["user2_id"]
            del i_json["user2_id"]
            result[count] = i_json
            count += 1

        for i in interaction2:
            i_json = i.as_dict()
            del i_json["id"]
            del i_json["user2_id"]
            i_json["id"] = i_json["user1_id"]
            del i_json["user1_id"]
            result[count] = i_json
            count += 1

        return result
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/interaction/<profile_id1>/<profile_id2>/<rejected>", methods=["POST"])
def recordInteraction(profile_id1, profile_id2, rejected):
    """

    """
    try:
        interaction = Interaction(
            user1_id = profile_id1,
            user2_id = profile_id2,
            rejected = rejected
        )

        session.add(interaction)
        session.commit()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


def adjustScore(score):
    adj = score * 2 + 20
    if adj > 100:
        adj = 100

    return adj

######## SCORES & REASONS ########
@app.route("/api/scores/<profile_id1>/<profile_id2>", methods=["GET"])
def getScores(profile_id1, profile_id2):
    """
    Return the similarity and complementarity score between two profiles with the `profile_id1` and `profile_id2` ids.
    """

    u1 = getProfile(profile_id1)
    u2 = getProfile(profile_id2)

    similarity_score, _ = Algorithm.calculate_similarity_score(u1, u2)
    similarity_score = int(similarity_score)
    complementarity_score, _ = Algorithm.calculate_complementarity_score(u1, u2)
    complementarity_score = int(complementarity_score)
    j = {
        "similarity_score" : adjustScore(similarity_score),
        "complementarity_score" : adjustScore(complementarity_score)
    }
    return j

@app.route("/api/scores/reasons/<profile_id1>/<profile_id2>", methods=["GET"])
def getReasons(profile_id1, profile_id2):
    """

    """
    u1 = getProfile(profile_id1)
    u2 = getProfile(profile_id2)

    _, reasons1 = Algorithm.calculate_similarity_score(u1, u2)
    _, reasons2 = Algorithm.calculate_complementarity_score(u1, u2)

    reasons1.update(reasons2)
    reasons = format_json(top_two(reasons1))
    # reasons = top_two(reasons1)
    return reasons

@app.route("/api/scores/reasons/prompt/<profile_id1>/<profile_id2>/<reason>", methods=["GET"])
def getReasonsPrompt(profile_id1, profile_id2, reason):
    """

    """
    u1 = getProfile(profile_id1)
    u2 = getProfile(profile_id2)
    print("INSIDE REASONS PROMPT")
    print(u1)
    print(u2)
    reason_text = Reason.generate_response(u1, u2, reason)
    return jsonify(reason_text)

######## ARRANGE ########
@app.route("/api/arrange/<matchmaker_id>", methods=["GET"])
def getArrangementsByMatchmaker(matchmaker_id):
    """
    Return the arrangements for the user with `matchmaker_id`.
    """
    try:
        arrangements = session.query(Arrangement).filter_by(matchmaker_id = matchmaker_id).all()
        result = []
        count = 0
        for a in arrangements:
            a_json = a.as_dict()
            info1 = getProfile(a_json["user1_id"])
            info2 = getProfile(a_json["user2_id"])
            photo1 = getProfilePhoto(a_json["user1_id"])
            photo2 = getProfilePhoto(a_json["user2_id"])
            u1 = {}
            u1["first_name"] = info1["firstName"]
            u1["last_name"] = info1["lastName"]
            u1["url"] = photo1
            u2 = {}
            u2["first_name"] = info2["firstName"]
            u2["last_name"] = info2["lastName"]
            u2["url"] = photo2
            a_json["user_one"] = u1
            a_json["user_two"] = u2
            # result[count] = a_json
            result.append(a_json)
            # count += 1
        return jsonify(result)
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/arrange", methods=["POST"])
def createArrangement():
    """
    Create an arrangement and store into database.
    """
    try:
        prompt = request.json.get("prompt", None)
        matchmaker_id = request.json.get("matchmaker_id")
        user1_id = request.json.get("user1_id", None)
        user2_id = request.json.get("user2_id", None)

        arrangement = Arrangement(
            prompt=prompt,
            matchmaker_id=matchmaker_id,
            user1_id=user1_id,
            user2_id=user2_id
        )

        session.add(arrangement)
        session.commit()

        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/arrange/info/<profile_id1>/<profile_id2>", methods=["GET"])
def getPotentialArrangeInfo(profile_id1, profile_id2):
    """
    Return all the relevant information for `profile_id2` for a potential arrangement with `profile_id1`.
    """
    print("PROFILE ID 2", profile_id2)
    profile = getProfile(profile_id2)
    scores = getScores(profile_id1, profile_id2)
    reasons = getReasons(profile_id1, profile_id2)
    result = {}
    result["id"] = profile["id"]
    result["first_name"] = profile["firstName"]
    result["similarity_score"] = scores["similarity_score"]
    result["complementarity_score"] = scores["complementarity_score"]
    result["reasons"] = reasons

    return result

@app.route("/api/arrange/recommendations/<profile_id>", methods=['GET'])
def getPotentialArrangeRecommendations(profile_id):
    """

    """
    print("INSIDE POTENTIAL ARRANGE RECOMMENDATIONS")
    print("profile_id", profile_id)
    cardStack = getCardStack(profile_id)
    print("card stack", cardStack)
    scores = {}
    result = {}
    for c in cardStack:
        card = cardStack[c]
        id = card["id"]
        score = getScores(profile_id, id)
        total = score["similarity_score"] + score["complementarity_score"]
        scores[id] = total

    scores_sorted= sorted(scores.items(), key=lambda x:x[1], reverse=True)
    for i in range(len(scores_sorted)):
        result[i] = getPotentialArrangeInfo(profile_id, scores_sorted[i][0])
        # result[i] = getPotentialArrangeInfo(profile_id, scores_sorted[i][0])
        # result[i] = getPotentialArrangeInfo(profile_id, scores_sorted[i][0])
        # result[i] = getPotentialArrangeInfo(profile_id, scores_sorted[i][0])
    return result

@app.route("/api/arrange/list/<profile_id>", methods=["GET"])
def getArrangementList(profile_id):
    """

    """
    try:
        arrangements1 = session.query(Arrangement).filter_by(user1_id = profile_id).all()
        arrangements2 = session.query(Arrangement).filter_by(user2_id = profile_id).all()

        result = {}
        count = 0

        for a in arrangements1:
            a_json = a.as_dict()
            id = a_json["user2_id"]
            info = getPotentialArrangeInfo(profile_id, id)
            result[count] = info
            count += 1

        for a in arrangements2:
            a_json = a.as_dict()
            id = a_json["user1_id"]
            info = getPotentialArrangeInfo(profile_id, id)
            result[count] = info
            count += 1

        return result
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()

@app.route("/api/arrange/prompt/<conversation_id>", methods=["GET"])
def getPrompt(conversation_id):
    """
    Return the prompt the matchmaker chose for an arrangement with conversation
        id `conversation_id`.
    """
    try:
        result = session.query(Arrangement).filter(
            Arrangement.conversation_id == conversation_id
        ).first()
        return jsonify(result.prompt)
    except Exception as e:
        session.rollback()
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response
    finally:
        session.close()

@app.route("/api/arrangements/reasons/<arrangement_id>", methods=["GET"])
def getArrangementReasons(arrangement_id):
    try:
        result = session.query(Arrangement).filter(
            Arrangement.id == arrangement_id
        ).first()
        return jsonify([result.reason1, result.reason2])

    except Exception as e:
        session.rollback()
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response
    finally:
        session.close()

######## PHOTOS ########
@app.route("/api/photo/<profile_id>", methods=["POST"])
def addPhotos(profile_id, j=None):
    """

    """
    if j:
        urls = j
    else:
        urls = request.json.get("photos")

    for photo_id in urls:
        url = urls[photo_id]["photo_url"]
        priority = urls[photo_id]["priority"]
        # DynamoDB.put_items(profile_id, url, priority)

    return json.dumps({'success':True}), 200, {'ContentType':'application/json'}

@app.route("/api/photo/profile/<profile_id>", methods=["GET"])
def getProfilePhoto(profile_id):
    """
    Returns the URL of the profile picture for `profile_id`.
    """
    k = str(profile_id) + "_1.jpg"

    obj = s3.get_object(Bucket='mutual-photos', Key=k)
    # print(obj)
    return send_file(obj['Body'], mimetype=obj['ContentType'])
    # return obj["url"]
    # result = DynamoDB.get_items(profile_id, 1)
    # return result
    # return ''

@app.route("/api/photo/<profile_id>", methods=["GET"])
def getPhotos(profile_id):
    """
    Returns a JSON for the urls of the photos associated with `profile_id`.
    """
    result = DynamoDB.get_items(profile_id)
    return result

@app.route('/api/upload/<profile_id>', methods=['POST'])
def upload(profile_id):
    file = request.files['photo']
    filename = secure_filename(file.filename)
    s3.upload_fileobj(file, 'mutual-photos', filename)
    return f"https://s3.amazonaws.com/mutual-photos/{profile_id}/{filename}"

######## FRIENDS ########
@app.route("/api/friend/<profile_id1>/<profile_id2>", methods=["POST"])
def makeFriends(profile_id1, profile_id2):
    """
    Create a friend relationship between user with `profile_id1` and `profile_id2`.
    """
    try:
        friends = Friend(
            user1_id = profile_id1,
            user2_id = profile_id2
        )

        session.add(friends)
        session.commit()
        return json.dumps({'success':True}), 200, {'ContentType':'application/json'}
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()



@app.route("/api/friend/list/<profile_id>", methods=["GET"])
def getFriendsList(profile_id):
    """
    Returns the list of friends for `profile_id` with first name, last name, and URL.
    """
    try:
        friends1 = session.query(Friend).filter_by(user1_id = profile_id).all()
        friends2 = session.query(Friend).filter_by(user2_id = profile_id).all()
        result = {}
        count = 0
        for f in friends1:
            f_json = f.as_dict()
            info = getProfile(f_json["user2_id"])
            photo = getProfilePhoto(f_json["user2_id"])
            f_json["first_name"] = info["firstName"]
            f_json["last_name"] = info["lastName"]
            f_json["url"] = photo[0]["PhotoURL"]
            f_json["current_location"] = info["currentLocation"]
            f_json["work"] = info["work"]

            del f_json["id"]
            del f_json["user1_id"]
            f_json["id"] = f_json["user2_id"]
            del f_json["user2_id"]
            result[count] = f_json
            count += 1

        for f in friends2:
            f_json = f.as_dict()
            info = getProfile(f_json["user1_id"])
            photo = getProfilePhoto(f_json["user1_id"])
            f_json["first_name"] = info["firstName"]
            f_json["last_name"] = info["lastName"]
            f_json["url"] = photo[0]["PhotoURL"]
            f_json["current_location"] = info["currentLocation"]
            f_json["work"] = info["work"]

            del f_json["id"]
            del f_json["user2_id"]
            f_json["id"] = f_json["user1_id"]
            del f_json["user1_id"]
            result[count] = f_json
            count += 1
        return result
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


##### MESSAGES #####
@app.route("/api/messages/<room_id>/<uid_from>/<uid_to>", methods=["POST"])
def saveMessage(room_id, uid_from, uid_to):
    """
    Save a message sent from a `uid_from` to the room `room_id`.
    """
    msg = request.json.get("msg")
    conversation_id = room_id

    return add_message_to_convo(conversation_id, uid_from, uid_to, msg)

@app.route("/api/message/<room_id>", methods=["GET"])
def getRoomMessages(room_id):
    """
    Return all the messages from a specified chat.
    """
    try:
        result = session.query(Conversation).where(
                Conversation.id == room_id
        ).first()

        # if there exists a conversation, return all messages associated with
        # that conversation id
        if result:
            # query messages to get all messages associated with that convo
            messages = session.query(Message).filter_by(
                conversation_id=room_id
            ).order_by(Message.updated_at.desc()).all()

            # return the messages in a json format
            messages_unraveled = list(map(lambda message: message.as_dict(), messages))
            return jsonify(messages_unraveled)
        else:
            return jsonify([])

    except SQLAlchemyError as e:
            app.logger.debug(e)
            session.rollback()
            return jsonify([])

##### CONVERSATIONS #####
@app.route("/api/conversations/unanswered/<uid>")
def getUnansweredChats(uid):
    """
    Retrieve all conversations which `uid` has not yet responded to.
    """

    # get all conversations `uid` is a part of
    try:
        unrequited_love_messages = session.query(Conversation).filter(
        and_(
            or_(Conversation.participant_one == uid, Conversation.participant_two == uid),
            ~exists().where(and_(
                Message.conversation_id == Conversation.id,
                Message.user_id == uid
            ))
        )
        ).all()
        return jsonify([conversation.as_dict() for conversation in unrequited_love_messages])
    except Exception as e:
        session.rollback()
        return json.dumps({'success':False, "error":str(e)}), 500, {'ContentType':'application/json'}
    finally:
        session.close()


@app.route("/api/conversations/answered/<uid>", methods=["GET"])
def getAnsweredChats(uid):
    """
    Retrieve the most recent message of every conversation `uid` is in. Note
        that this should only return one message per Conversation `uid` is a
        part of.
    """
    try:
        conversations = session.query(
        Conversation.id,
        Conversation.participant_one,
        Conversation.participant_two,
        Conversation.read,
        func.max(Message.updated_at).label('last_message_created_at'),
        Message.content.label('last_message_text'),
        Message.user_id.label('last_message_sender_id')
        ).join(
            Message, Message.conversation_id == Conversation.id
        ).filter(
            or_(
                Conversation.participant_one == uid,
                Conversation.participant_two == uid
            ),
            Message.user_id == uid
        ).group_by(
            Conversation.id,
            Conversation.participant_one,
            Conversation.participant_two,
            Conversation.read,
            Message.content,
            Message.user_id
        ).order_by(
            Conversation.updated_at.desc()
        ).all()

        # get all relevant last message information sent
        chat_rooms = {}
        for conversation in conversations:
            last_msg_sent = session.query(Message).filter_by(conversation_id=conversation.id).order_by(
                Message.updated_at.desc()
            ).first()
            if last_msg_sent:
                # insert the read property
                msg = last_msg_sent.as_dict()
                msg["read"] = conversation.read
                chat_rooms[conversation.id] = msg

        return chat_rooms

    except SQLAlchemyError as e:
        session.rollback()
        # return a default
        response = jsonify({"message": str(e)})
        response.status_code = 500
        return response

@app.route("/api/conversations/<conversation_id>", methods=["POST"])
def markConversationRead(conversation_id):
    """
    Mark `conversation_id` read.
    """
    try:
        conversation = session.query(Conversation).filter(Conversation.id == conversation_id).first()
        conversation.read = True
        session.commit()

        return jsonify(True)

    except SQLAlchemyError as e:
        session.rollback()
        response = jsonify({"error": str(e)})
        response.status_code = 500
        return response

    finally:
        session.close()

@app.route("/api/conversations/<conversation_id>/<current_uid>", methods=["GET"])
def getOtherUser(conversation_id, current_uid):
    """
    Retrieve the uid for the participant of `conversation_id` who is not the
        `current_uid`.
    """
    try:
        conversation = session.query(Conversation).filter(Conversation.id == conversation_id).first().as_dict()
        other = conversation["participant_two"] if (current_uid == conversation["participant_one"]) else conversation["participant_two"]
        return jsonify(other)

    except SQLAlchemyError as e:
        session.rollback()
        return jsonify([])