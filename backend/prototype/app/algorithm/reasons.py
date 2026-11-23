from app.algorithm.enums.similarity.time_of_day import TimeOfDay
from app.algorithm.enums.similarity.political_importance import PoliticalImportance
from app.algorithm.enums.similarity.drink import Drink
from app.algorithm.enums.similarity.smoke import Smoke
from app.algorithm.enums.similarity.drugs import Drugs
from app.algorithm.enums.similarity.religion_importance import ReligionImportance
from app.algorithm.enums.similarity.pda_preference import PDAPreference

import json

class Reason:
    def __init__(self):
        pass

    def generate_response(u1, u2, reason_type):
        '''
        Returns the appropriate text to be shown according to the reason type provided. Returns empty string if invalid case.
        '''
        print("u1", u1)
        n1 = u1["firstName"]
        n2 = u2["firstName"]

        if reason_type == "wordsAndQualities":
            return n1 + " and " + n2 + " have qualities the other strongly likes!"
        elif reason_type == "hometown":
            return n1 + " and " + n2 + " both have the same hometown! Small world!"
        elif reason_type == "work":
            return n1 + " and " + n2 + " both work at the same company! Woah!"
        elif reason_type == "jobTitle":
            return n1 + " and " + n2 + " both have the same type of job! Now you can suffer together!"
        elif reason_type == "school":
            return n1 + " and " + n2 + " both went to the same school!"
        elif reason_type == "politicalAffiliation":
            return n1 + " and " + n2 + " both have similar beliefs in politics!"
        elif reason_type == "political_importance":
            if u1["politicalImportance"] == PoliticalImportance.HIGH.value:
                return n1 + " and " + n2 + " both consider politics to be important!"
            elif u1["politicalImportance"] == PoliticalImportance.MEDIUM.value:
                return n1 + " and " + n2 + " both consider politics to be somewhat important!"
            else:
                return n1 + " and " + n2 + " both don't care about politics, yay!"
        elif reason_type == "political_friend_importance":
            return n1 + " and " + n2 + " both place politics at a similar importance level with your friends!"
        elif reason_type == "time_of_day":
            if u1["timeOfDay"] == TimeOfDay.EARLY.value or u1["timeOfDay"] == TimeOfDay.VERY_EARLY.value:
                return n1 + " and " + n2 + " are both early birds!"
            elif u1["timeOfDay"] == TimeOfDay.LATE.value or u1["timeOfDay"] == TimeOfDay.VERY_LATE.value:
                return n1 + " and " + n2 + " are both night owls!"
            else:
                return n1 + " and " + n2 + " have similar sleeping schedules!"
        elif reason_type == "drink":
            if u1["drink"] == Drink.HIGH.value:
                return n1 + " and " + n2 + " both love to drink!"
            elif u1["drink"] == Drink.MEDIUM.value:
                return n1 + " and " + n2 + " both love to drink from time to time!"
            elif u1["drink"] == Drink.LOW.value:
                return n1 + " and " + n2 + " both only drink occassionally!"
            else:
                return n1 + " and " + n2 + " both don't drink!"
        elif reason_type == "smoke":
            if u1["smoke"] == Smoke.HIGH.value:
                return n1 + " and " + n2 + " both love to smoke!"
            elif u1["smoke"] == Smoke.MEDIUM.value:
                return n1 + " and " + n2 + " both love to smoke from time to time!"
            elif u1["smoke"] == Smoke.LOW.value:
                return n1 + " and " + n2 + " both only smoke occassionally!"
            else:
                return n1 + " and " + n2 + " both don't smoke!"
        elif reason_type == "drugs":
            if u1["drugs"] == Drugs.HIGH.value:
                return n1 + " and " + n2 + " both love to do drugs!"
            elif u1["drugs"] == Drugs.MEDIUM.value:
                return n1 + " and " + n2 + " both love to do drugs from time to time!"
            elif u1["drugs"] == Drugs.LOW.value:
                return n1 + " and " + n2 + " both only do drugs occassionally!"
            else:
                return n1 + " and " + n2 + " both don't do drugs!"
        elif reason_type == "religion":
            return n1 + " and " + n2 + " have similar religious beliefs!"
        elif reason_type == "religionImportance":
            if u1["religionImportance"] == ReligionImportance.HIGH.value:
                return n1 + " and " + n2 + " both consider religion to be important in life!"
            elif u1["religionImportance"] == ReligionImportance.MEDIUM.value:
                return n1 + " and " + n2 + " both consider religion to be somewhat important in life!"
            else:
                return n1 + " and " + n2 + " both don't consider religion to be too important!"
        elif reason_type == "pdaPreference":
            if u1["pdaPreference"] == PDAPreference.HIGH.value:
                return n1 + " and " + n2 + " both love PDA!"
            elif u1["pdaPreference"] == PDAPreference.MEDIUM.value:
                return n1 + " and " + n2 + " both prefer a similar level of PDA"
            else:
                return n1 + " and " + n2 + " both similarly do not love PDA!"
        elif reason_type == "mb":
            return n1 + " and " + n2 + " have compatibile Myers-Briggs personalities! So cool!"
        elif reason_type == "decisive":
            return n1 + " and " + n2 + " both complement each other's decisiveness!"
        elif reason_type == "opinionated":
            return n1 + " and " + n2 + " both complement each other's opinionatedness!"
        elif reason_type == "zodiac":
            return n1 + " and " + n2 + " have compatibible Zodiac signs!"
        elif reason_type == "loveLanguage":
            return n1 + " and " + n2 + " both have compatible love languages! How neat!"

        return ""

    # u1 = json.load(f)
    # u2 = u1
    # print(generate_response(u1, u2, "religionImportance"))