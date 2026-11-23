from enum import Enum

class TimeOfDay(Enum):
    VERY_LATE = 2
    LATE = 1
    NEUTRAL = 0
    EARLY = -1
    VERY_EARLY = -2