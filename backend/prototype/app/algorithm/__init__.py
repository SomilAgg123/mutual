from app.algorithm.algorithm import Algorithm
from app.algorithm.reasons import Reason

alg = Algorithm()
rsn = Reason()

def calculate_similarity_score(u1, u2):
    return alg.calculate_similarity_score(u1, u2)

def calculate_complementarity_score(u1, u2):
    return alg.calculate_complementarity_score(u1, u2)

def generate_reason(u1, u2, reason):
    return rsn.generate_response(u1, u2, reason)