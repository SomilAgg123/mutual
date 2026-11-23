import numpy as np
import json
import csv

class Algorithm:
    def __init__(self):
        pass

    def calculate_similarity_score(u1, u2):
        '''
        Returns the similarity score between two users.
        '''

        temp = open('app/algorithm/algorithm_weights.json')
        weights = json.load(temp)

        def top_two(j):
            j_sorted= sorted(j.items(), key=lambda x:x[1], reverse=True)
            s1 = int(j[j_sorted[0][0]])
            s2 = int(j[j_sorted[1][0]])
            return {j_sorted[0][0]: s1, j_sorted[1][0] : s2}

        def calculate_word_similarity(u1, u2):
            '''
            Returns the similarity score between two users based on the words given as qualities the users' possess and qualities the users' want.
            '''

            u1_words = np.array([u1["word1"], u1["word2"], u1["word3"]])
            u1_qualities = np.array([u1["quality1"], u1["quality2"]])

            u2_words = np.array([u2["word1"], u2["word2"], u2["word3"]])
            u2_qualities = np.array([u2["quality1"], u2["quality2"]])

            in_common = (len(np.intersect1d(u1_words, u2_qualities)) + len(np.intersect1d(u2_words, u1_qualities))) * weights["wordsAndQualities"]

            return in_common

        def calculate_profile_similarity(u1, u2):
            '''
            Returns the similarity score between two users based on similarities in their profile data.
            '''

            temp = open('app/algorithm/algorithm_weights.json')
            weights = json.load(temp)

            profile_total = 0
            scores = {}
            print("SCORES")
            print(scores)
            print("U1")
            print(u1)
            print("U2")
            print(u2)
            print("WEIGHTS")
            print(weights)
            scores["hometown"] = (u1["hometown"] == u2["hometown"]) * weights["hometown"]
            profile_total += scores["hometown"]

            scores["work"] = (u1["work"] == u2["work"]) * weights["work"]
            profile_total += scores["work"]

            scores["jobTitle"] = (u1["jobTitle"] == u2["jobTitle"]) * weights["jobTitle"]
            profile_total += scores["jobTitle"]

            scores["school"] = (u1["school"] == u2["school"]) * weights["school"]
            profile_total += scores["school"]

            scores["words"] = calculate_word_similarity(u1, u2)
            profile_total += scores["words"]

            reasons = top_two(scores)
            return profile_total, reasons

        def calculate_similarity_similarity(u1, u2):
            '''
            Returns the similarity score between two users based on their answers to the similarity questions.
            '''

            temp = open('app/algorithm/algorithm_weights.json')
            weights = json.load(temp)

            score = 0
            scores = {}
            cats = [
                "politicalAffiliation",
                "politicalImportance",
                "politicalFriendImportance",
                "timeOfDay",
                "drink",
                "smoke",
                "drugs",
                "religion",
                "religionImportance",
                "pdaPreference"
            ]

            for category in cats:
                scores[category] = np.absolute(u1[category] + u2[category]) * weights[category]
                score += scores[category]

            reasons = top_two(scores)
            return score, reasons

        s1, r1 = calculate_profile_similarity(u1, u2)
        s2, r2 = calculate_similarity_similarity(u1, u2)
        r1.update(r2)
        reasons = top_two(r1)
        return s1+s2, reasons

    def calculate_complementarity_score(u1, u2):
        '''
        Returns the complementarity score between two users.
        '''

        temp = open('app/algorithm/algorithm_weights.json')
        weights = json.load(temp)

        def top_two(j):
            j_sorted= sorted(j.items(), key=lambda x:x[1], reverse=True)
            s1 = int(j[j_sorted[0][0]])
            s2 = int(j[j_sorted[1][0]])
            return {j_sorted[0][0]: s1, j_sorted[1][0] : s2}

        def calculate_mb(u1, u2):
            '''
            Returns the complementarity score between two users based on the complementarity of their myers-briggs' personalities.
            '''

            #row and columns are transposed according to mb.py enum
            mb_grid = [[4,4,4,5,4,5,4,4,1,1,1,1,1,1,1,1],
            [4,4,5,4,5,4,4,4,1,1,1,1,1,1,1,1],
            [4,5,4,4,4,4,4,5,1,1,1,1,1,1,1,1],
            [5,4,4,4,4,4,4,4,5,1,1,1,1,1,1,1],
            [4,5,4,4,4,4,4,5,3,3,3,3,2,2,2,2],
            [5,4,4,4,4,4,5,4,3,3,3,3,3,3,3,3],
            [4,4,4,4,4,5,4,4,3,3,3,3,2,2,2,5],
            [4,4,5,4,5,4,4,4,3,3,3,3,2,2,2,2],
            [1,1,1,5,3,3,3,3,2,2,2,2,3,5,3,5],
            [1,1,1,1,3,3,3,3,2,2,2,2,5,3,5,3],
            [1,1,1,1,3,3,3,3,2,2,2,2,3,5,3,5],
            [1,1,1,1,3,3,3,3,2,2,2,2,5,3,5,3],
            [1,1,1,1,2,3,2,2,3,5,3,5,4,4,4,4],
            [1,1,1,1,2,3,2,2,5,3,5,3,4,4,4,4],
            [1,1,1,1,2,3,2,2,3,5,3,5,4,4,4,4],
            [1,1,1,1,2,3,5,2,5,3,5,3,4,4,4,4]]

            return mb_grid[u1["mb"]][u2["mb"]] * weights["mb"]

        def calculate_complementarity_complementarity(u1, u2):
            '''
            Returns the complementarity score between two users based on their answers to the complementarity questions.
            '''

            score = 0
            scores = {}

            scores["personalityType"] = (u1["personalityType"] != u2["personalityType"]) * weights["personalityType"]
            score += scores["personalityType"]

            scores["decisive"] = (u1["decisive"] != u2["decisive"]) * weights["decisive"]
            score += scores["decisive"]

            scores["opinionated"] = (u1["opinionated"] != u2["opinionated"]) * weights["opinionated"]
            score += scores["opinionated"]

            reasons = top_two(scores)
            return score, reasons

        def calculate_zodiac(u1, u2):
            '''
            Returns the complementarity score between two users based on the complementarity of their zodaic signs.
            '''

            #row and columns are transposed according to zodiac.py enum
            zodiac_grid = [[3,3,3,1,2,1,3,3,3,1,1,2],
            [3,3,3,2,1,1,3,3,2,2,2,2],
            [3,3,3,1,1,1,3,3,3,2,2,2],
            [1,2,1,3,3,3,1,2,1,3,3,3],
            [1,2,1,3,3,3,1,1,2,3,3,2],
            [1,2,1,3,3,3,1,2,1,3,3,3],
            [3,3,2,1,2,2,3,3,3,1,1,1],
            [2,3,3,2,1,1,3,3,3,1,1,2],
            [3,3,3,1,1,1,3,3,3,1,2,2],
            [1,2,2,3,3,3,1,1,1,3,3,3],
            [2,2,1,3,3,3,1,1,1,3,3,3],
            [2,2,2,3,2,3,1,1,1,3,3,3]]

            return zodiac_grid[u1["zodiac"]][u2["zodiac"]] * weights["zodiac"]

        def calculate_love_languages(u1, u2):
            '''
            Returns the complementarity score between two users based on the complementarity of their love languages.
            '''

            temp = 0
            temp += u1["giveLoveLanguage"] == u2["receiveLoveLanguage"]
            temp += u1["receiveLoveLanguage"] == u2["giveLoveLanguage"]
            temp *= weights["loveLanguage"]

            return temp

        scores = {}
        scores["mb"] = calculate_mb(u1,u2)
        scores["zodiac"] = calculate_zodiac(u1, u2)
        scores["loveLanguage"] = calculate_love_languages(u1, u2)
        score, reason = calculate_complementarity_complementarity(u1, u2)
        scores.update(reason)
        # print(scores)
        reasons = top_two(scores)
        # print(reasons)
        return score + scores["mb"] + scores["loveLanguage"] + scores["zodiac"], reasons

# u1 = json.load(f)
# u2 = u1
# print(calculate_similarity_score(u1, u2))
