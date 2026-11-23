import createDataContext from './createDataContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'set_user_id':
      return {
        ...state,
        user_id: action.payload.user_id
      }
    case 'set_age':
      return {
        ...state,
        age: action.payload.age
      }
    case 'signout':
      return {
        uid: null,
        token: null,
        email: ''
      };
    case 'signin':
    case 'signup':
      return {
        uid: action.payload.uid,
        token: action.payload.token,
        email: action.payload.email,
      };
    default:
      return state;
  }
};

const set_user_id = dispatch => {
  return async ( id ) => {
    dispatch({
      type: 'set_user_id',
      payload: {
        user_id: id
      }
    })
  }
}

const set_age = dispatch => {
  return async ( age ) => {
    dispatch({
      type: 'set_age',
      payload: {
        age: age
      }
    })
  }
}
const signup = dispatch => {
  return async ({email, password}) => {
    // TODO: CHANGE TO HIT THE CREATE USER ENDPOINT
    async function signupUser(credentials) {
      return fetch('http://127.0.0.1:5000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const data = result.json();
      return data;
    }

    const result = await signupUser({email, password});

    const token = result["token"];
    const uid = result["uid"];

    dispatch({
      type: 'signup',
      payload: {
        token: token,
        email: email,
        uid: uid
      }
    })
  };
};

const signin = dispatch => {
  return async ({email, password}) => {
    // console.log('Signin');
    async function loginUser(credentials) {
      return fetch('http://127.0.0.1:5000/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })
      const data = result.json();
      return data;
    }

    const result = await loginUser({email, password});

    const data = result["token"];

    const token = data["token"];
    const uid = data["uid"];

    dispatch({
      type: 'signin',
      payload: {
        token: token,
        email: email,
        uid: uid
      },
    });
  };
};

const signout = dispatch => {
  return () => {
    dispatch({type: 'signout'});
  };
};

export const {Provider: AuthProvider, Context: AuthContext} = createDataContext(
  authReducer,
  { signin, signout, signup, set_user_id, set_age },
  { token: null, email: 'demo@example.com', user_id: null, age: 0, uid: 1 },
);