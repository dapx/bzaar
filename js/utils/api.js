import { Toast } from 'native-base';

const API_BASE_URL = 'https://bzaar-api.herokuapp.com/bzaar';

export const ApiUtils = {

  headers(jwt) {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt}`,
      'Content-type': 'application/json',
    };
  },

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const message = JSON.parse(response.bodyText).error;
    throw new Error(message);
  },

  request(endpoint, jwt, method = 'GET') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}`, {
      headers: this.headers(jwt),
      method,
    })
    .then(this.checkStatus)
    .then(response => response.json())
    .catch((error) => { throw error; });
  },

  error(message) {
    Toast.show({
      type: 'danger',
      text: message,
      duration: 3000,
      position: 'bottom',
      buttonText: 'Okay',
    });
  },
};

export const UserService = {
  login(email, password) {
    return fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch((error) => { throw error; });
  },

  register(email, name, password) {
    return fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ user: {
        email,
        name,
        surname: 'teste',
        password,
      },
      }),
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json())
    .catch((error) => { throw error; });
  },
};
