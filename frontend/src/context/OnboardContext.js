import createDataContext from './createDataContext';

const onboardReducer = (state, action) => {
    switch (action.type) {
        case 'makeProfile':
            return {
                ...state,
                result: action.payload.result,
                onboard_token: action.payload.onboard_token
            }
        case 'setBirthday':
            return {
                ...state,
                birthday: action.payload.birthday
            }
        case 'setEmail':
            return {
                ...state,
                email: action.payload.email
            }
        case 'setPhoneNum':
            return {
                ...state,
                phoneNum: action.payload.phoneNum,
            }
        case 'setFirstName':
            return {
                ...state,
                firstName: action.payload.firstName,
            }
        case 'setLastName':
            return {
                ...state,
                lastName: action.payload.lastName
            }
        case 'setCurrentLocation':
            return {
                ...state,
                currentLocation: action.payload.currentLocation
            }
        case 'setGender':
            return {
                ...state,
                gender: action.payload.gender
            }
        case 'setSexuality':
            return {
                ...state,
                sexuality: action.payload.sexuality
            }
        case 'setDateOutOfRace':
            return {
                ...state,
                dateOutOfRace: action.payload.dateOutOfRace
            }
        case 'setHometown':
            return {
                ...state,
                hometown: action.payload.hometown
            }
        case 'setWork':
            return {
                ...state,
                work: action.payload.work
            }
        case 'setJobTitle':
            return {
                ...state,
                jobTitle: action.payload.jobTitle
            }
        case 'setSchool':
            return {
                ...state,
                school: action.payload.school
            }
        case 'setWord1':
            return {
                ...state,
                word1: action.payload.word1
            }
        case 'setWord2':
            return {
                ...state,
                word2: action.payload.word2
            }
        case 'setWord3':
            return {
                ...state,
                word3: action.payload.word3
            }
        case 'setQuality1':
            return {
                ...state,
                quality1: action.payload.quality1
            }
        case 'setQuality2':
            return {
                ...state,
                quality2: action.payload.quality2
            }
        case 'setMen':
            return {
                ...state,
                men: action.payload.men
            }
        case 'setWomen':
            return {
                ...state,
                women: action.payload.women
            }
        case 'setNonbinary':
            return {
                ...state,
                nonbinary: action.payload.nonbinary
            }
        case 'setOther':
            return {
                ...state,
                other: action.payload.other
            }
        case 'setEthnicity':
            return {
                ...state,
                ethnicity: action.payload.ethnicity
            }
        case 'setMB':
            return {
                ...state,
                mb: action.payload.mb
            }
        case 'setOnlyMatchmake':
            return {
                ...state,
                onlyMatchmake: action.payload.onlyMatchmake
            }
        case 'setPoliticalAffiliation':
            return {
                ...state,
                politicalAffiliation: action.payload.politicalAffiliation
            }
        case 'setPoliticalImportance':
            return {
                ...state,
                politicalImportance: action.payload.politicalImportance
        }
        case 'setPoliticalFriendImportance':
            return {
                ...state,
                politicalFriendImportance: action.payload.politicalFriendImportance
            }
        case 'setTimeOfDay':
            return {
                ...state,
                timeOfDay: action.payload.timeOfDay
            }
        case 'setDrink':
            return {
                ...state,
                drink: action.payload.drink
            }
        case 'setSmoke':
            return {
                ...state,
                smoke: action.payload.smoke
            }
        case 'setDrugs':
            return {
                ...state,
                drugs: action.payload.drugs
            }
        case 'setReligion':
            return {
                ...state,
                religion: action.payload.religion
            }
        case 'setReligionImportance':
            return {
                ...state,
                religionImportance: action.payload.religionImportance
            }
        case 'setPDAPreference':
            return {
                ...state,
                pdaPreference: action.payload.pdaPreference
            }
        case 'setPersonalityType':
            return {
                ...state,
                personalityType: action.payload.personalityType
            }
        case 'setDecisive':
            return {
                ...state,
                decisive: action.payload.decisive
            }
        case 'setOpinionated':
            return {
                ...state,
                opinionated: action.payload.opinionated
            }
        case 'setZodiac':
            return {
                ...state,
                zodiac: action.payload.zodiac
            }
        case 'setGiveLoveLanguage':
            return {
                ...state,
                giveLoveLanguage: action.payload.giveLoveLanguage
            }
        case 'setReceiveLoveLanguage':
            return {
                ...state,
                receiveLoveLanguage: action.payload.receiveLoveLanguage
            }
        case 'setAnswer1':
            return {
                ...state,
                answer1: action.payload.answer1
            }
        case 'setAnswer2':
            return {
                ...state,
                answer2: action.payload.answer2
            }
        default:
            return state;
    }
};

const setBirthday = dispatch => {
    return async ( birthday ) => {
        dispatch({
            type: 'setBirthday',
            payload: {
                birthday: birthday,
            }
        })
    }
}

const setEmail = dispatch => {
    return async ( email ) => {
        dispatch({
            type: 'setEmail',
            payload: {
                email: email,
            }
        })
    }
}

const setPhoneNum = dispatch => {
    return async ( phoneNum ) => {
        dispatch({
            type: 'setPhoneNum',
            payload: {
                phoneNum: phoneNum,
            }
        })
    }
}

const setFirstName = dispatch => {
    return async ( firstName ) => {
        dispatch({
            type: 'setFirstName',
            payload: {
                firstName: firstName,
            }
        })
    }
}

const setLastName = dispatch => {
    return async ( lastName ) => {
        dispatch({
            type: 'setLastName',
            payload: {
                lastName: lastName
            }
        })
    }
}

const setCurrentLocation = dispatch => {
    return async ( currentLocation ) => {
        dispatch({
            type: 'setCurrentLocation',
            payload: {
                currentLocation: currentLocation
            }
        })
    }
}

const setGender = dispatch => {
    return async ( gender ) => {
        dispatch({
            type: 'setGender',
            payload: {
                gender: gender
            }
        })
    }
}

const setSexuality = dispatch => {
    return async ( sexuality ) => {
        dispatch({
            type: 'setSexuality',
            payload: {
                sexuality: sexuality
            }
        })
    }
}

const setDateOutOfRace = dispatch => {
    return async ( dateOutOfRace ) => {
        dispatch({
            type: 'setDateOutOfRace',
            payload: {
                dateOutOfRace: dateOutOfRace
            }
        })
    }
}

const setHometown = dispatch => {
    return async ( hometown ) => {
        dispatch({
            type: 'setHometown',
            payload: {
                hometown: hometown
            }
        })
    }
}

const setWork = dispatch => {
    return async ( work ) => {
        dispatch({
            type: 'setWork',
            payload: {
                work: work
            }
        })
    }
}

const setJobTitle = dispatch => {
    return async ( jobTitle ) => {
        dispatch({
            type: 'setJobTitle',
            payload: {
                jobTitle: jobTitle
            }
        })
    }
}

const setSchool = dispatch => {
    return async ( school ) => {
        dispatch({
            type: 'setSchool',
            payload: {
                school: school
            }
        })
    }
}

const setWord1 = dispatch => {
    return async ( word1 ) => {
        dispatch({
            type: 'setWord1',
            payload: {
                word1: word1
            }
        })
    }
}

const setWord2 = dispatch => {
    return async ( word2 ) => {
        dispatch({
            type: 'setWord2',
            payload: {
                word2: word2
            }
        })
    }
}

const setWord3 = dispatch => {
    return async ( word3 ) => {
        dispatch({
            type: 'setWord3',
            payload: {
                word3: word3
            }
        })
    }
}

const setQuality1 = dispatch => {
    return async ( quality1 ) => {
        dispatch({
            type: 'setQuality1',
            payload: {
                quality1: quality1
            }
        })
    }
}

const setQuality2 = dispatch => {
    return async ( quality2 ) => {
        dispatch({
            type: 'setQuality2',
            payload: {
                quality2: quality2
            }
        })
    }
}

const setEthnicity = dispatch => {
    return async ( ethnicity ) => {
        dispatch({
            type: 'setEthnicity',
            payload: {
                ethnicity: ethnicity
            }
        })
    }
}

const setMen = dispatch => {
    return async ( men ) => {
        dispatch({
            type: 'setMen',
            payload: {
                men: men
            }
        })
    }
}

const setWomen = dispatch => {
    return async ( women ) => {
        dispatch({
            type: 'setWomen',
            payload: {
                women: women
            }
        })
    }
}

const setNonbinary = dispatch => {
    return async ( nonbinary ) => {
        dispatch({
            type: 'setNonbinary',
            payload: {
                nonbinary: nonbinary
            }
        })
    }
}

const setOther = dispatch => {
    return async ( other ) => {
        dispatch({
            type: 'setOther',
            payload: {
                other: other
            }
        })
    }
}

const setMB = dispatch => {
    return async ( mb ) => {
        mb = mb.toLowerCase();
        mb_num = 0;
        switch (mb) {
            case "infp":
                mb_num = 0;
            case "enfp":
                mb_num = 1;
            case "infj":
                mb_num = 2;
            case "enfj":
                mb_num = 3;
            case "intj":
                mb_num = 4;
            case "entj":
                mb_num = 5;
            case "intp":
                mb_num = 6;
            case "entp":
                mb_num = 7;
            case "isfp":
                mb_num = 8;
            case "esfp":
                mb_num = 9;
            case "istp":
                mb_num = 10;
            case "estp":
                mb_num = 11;
            case "isfj":
                mb_num = 12;
            case "esfj":
                mb_num = 13;
            case "istj":
                mb_num = 14;
            case "estj":
                mb_num = 15;
            default:
                mb_num = 0;
        };

        dispatch({
            type: 'setMB',
            payload: {
                mb: mb_num
            }
        })
    }
}

const setOnlyMatchmake = dispatch => {
    return async ( onlyMatchmake ) => {
        dispatch({
            type: 'setOnlyMatchmake',
            payload: {
                onlyMatchmake: onlyMatchmake
            }
        })
    }
}

const setPoliticalAffiliation = dispatch => {
    return async ( politicalAffiliation ) => {
        dispatch({
            type: 'setPoliticalAffiliation',
            payload: {
                politicalAffiliation: politicalAffiliation
            }
        })
    }
}

const setPoliticalImportance = dispatch => {
    return async ( politicalImportance ) => {
        dispatch({
            type: 'setPoliticalImportance',
            payload: {
                politicalImportance: politicalImportance
            }
        })
    }
}

const setPoliticalFriendImportance = dispatch => {
    return async ( politicalFriendImportance ) => {
        dispatch({
            type: 'setPoliticalFriendImportance',
            payload: {
                politicalFriendImportance: politicalFriendImportance
            }
        })
    }
}

const setTimeOfDay = dispatch => {
    return async ( timeOfDay ) => {
        dispatch({
            type: 'setTimeOfDay',
            payload: {
                timeOfDay: timeOfDay
            }
        })
    }
}

const setDrink = dispatch => {
    return async ( drink ) => {
        dispatch({
            type: 'setDrink',
            payload: {
                drink: drink
            }
        })
    }
}

const setSmoke = dispatch => {
    return async ( smoke ) => {
        dispatch({
            type: 'setSmoke',
            payload: {
                smoke: smoke
            }
        })
    }
}

const setDrugs = dispatch => {
    return async ( drugs ) => {
        dispatch({
            type: 'setDrugs',
            payload: {
                drugs: drugs
            }
        })
    }
}

const setReligion = dispatch => {
    return async ( religion ) => {
        dispatch({
            type: 'setReligion',
            payload: {
                religion: religion
            }
        })
    }
}

const setReligionImportance = dispatch => {
    return async ( religionImportance ) => {
        dispatch({
            type: 'setReligionImportance',
            payload: {
                religionImportance: religionImportance
            }
        })
    }
}

const setPDAPreference = dispatch => {
    return async ( pdaPreference ) => {
        dispatch({
            type: 'setPDAPreference',
            payload: {
                pdaPreference: pdaPreference
            }
        })
    }
}

const setPersonalityType = dispatch => {
    return async ( personalityType ) => {
        dispatch({
            type: 'setPersonalityType',
            payload: {
                personalityType: personalityType
            }
        })
    }
}

const setDecisive = dispatch => {
    return async ( decisive ) => {
        dispatch({
            type: 'setDecisive',
            payload: {
                decisive: decisive
            }
        })
    }
}

const setOpinionated = dispatch => {
    return async ( opinionated ) => {
        dispatch({
            type: 'setOpinionated',
            payload: {
                opinionated: opinionated
            }
        })
    }
}

const setZodiac = dispatch => {
    return async ( zodiac ) => {
        dispatch({
            type: 'setZodiac',
            payload: {
                zodiac: zodiac
            }
        })
    }
}

const setGiveLoveLanguage = dispatch => {
    return async ( giveLoveLanguage ) => {
        dispatch({
            type: 'setGiveLoveLanguage',
            payload: {
                giveLoveLanguage: giveLoveLanguage
            }
        })
    }
}

const setReceiveLoveLanguage = dispatch => {
    return async ( receiveLoveLanguage ) => {
        dispatch({
            type: 'setReceiveLoveLanguage',
            payload: {
                receiveLoveLanguage: receiveLoveLanguage
            }
        })
    }
}

const setAnswer1 = dispatch => {
    return async ( answer1 ) => {
        dispatch({
            type: 'setAnswer1',
            payload: {
                answer1: answer1
            }
        })
    }
}

const setAnswer2 = dispatch => {
    return async ( answer2 ) => {
        dispatch({
            type: 'setAnswer2',
            payload: {
                answer2: answer2
            }
        })
    }
}

const makeProfile = dispatch => {
    return async ( json ) => {
        async function makeProfileCall( val ) {
            return fetch('http://127.0.0.1:5000/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(val)

            })
        }

        const result = await makeProfileCall(json);

        async function createOnboardToken() {
            return fetch('http://127.0.0.1:5000/api/onboard', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
            })
        }

        const onboard_token = await createOnboardToken();

        dispatch({
            type: 'makeProfile',
            payload: {
                result: result,
                onboard_token: onboard_token
            }
        })
    }
}

export const { Provider: OnboardProvider, Context: OnboardContext } = createDataContext(
    onboardReducer,
    {
        makeProfile,
        setBirthday,
        setEmail,
        setPhoneNum,
        setFirstName,
        setLastName,
        setCurrentLocation,
        setGender,
        setSexuality,
        setDateOutOfRace,
        setHometown,
        setWork,
        setJobTitle,
        setSchool,
        setWord1,
        setWord2,
        setWord3,
        setQuality1,
        setQuality2,
        setEthnicity,
        setMen,
        setWomen,
        setNonbinary,
        setOther,
        setMB,
        setOnlyMatchmake,
        setPoliticalAffiliation,
        setPoliticalImportance,
        setPoliticalFriendImportance,
        setTimeOfDay,
        setDrink,
        setSmoke,
        setDrugs,
        setReligion,
        setReligionImportance,
        setPDAPreference,
        setPersonalityType,
        setDecisive,
        setOpinionated,
        setZodiac,
        setGiveLoveLanguage,
        setReceiveLoveLanguage,
        setAnswer1,
        setAnswer2
    },
    {
        result: null,
        email: null,
        onboard_token: null,
        birthday: null,
        phoneNum: null,
        firstName: null,
        lastName: null,
        currentLocation: null,
        gender: null,
        sexuality: null,
        dateOutOfRace: null,
        hometown: null,
        work: null,
        jobTitle: null,
        school: null,
        word1: null,
        word2: null,
        word3: null,
        quality1: null,
        quality2: null,
        ethnicity: null,
        men: null,
        women: null,
        nonbinary: null,
        other: null,
        mb: null,
        onlyMatchmake: null,
        politicalAffiliation: null,
        politicalImportance: null,
        politicalFriendImportance: null,
        timeOfDay: null,
        drink: null,
        smoke: null,
        drugs: null,
        religion: null,
        religionImportance: null,
        pdaPreference: null,
        personalityType: null,
        decisive: null,
        opinionated: null,
        zodiac: null,
        giveLoveLanguage: null,
        receiveLoveLanguage: null,
        answer1: null,
        answer2: null
    }
);