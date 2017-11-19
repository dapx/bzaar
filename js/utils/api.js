import { Toast } from 'native-base';

const API_BASE_URL = 'http://localhost:4000/bzaar';

export const ApiUtils = {

  secureheader(jwt) {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${jwt}`,
      'Content-type': 'application/json',
    };
  },

  header() {
    return {
      Accept: 'application/json',
      'Content-type': 'application/json',
    };
  },

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const message = JSON.parse(response._bodyText).error;
    throw new Error(message);
  },

  request(endpoint, jwt) {
    return fetch(`${API_BASE_URL}/secured/${endpoint}`, {
      method: 'GET',
      headers: this.secureheader(jwt),
    })
    .then(this.checkStatus)
    .then(response => response.json());
  },

  create(endpoint, jwt, data, method = 'POST') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}`, {
      headers: this.secureheader(jwt),
      method,
      body: JSON.stringify(data),
    })
    .then(this.checkStatus)
    .then(response => response.json());
  },

  delete(endpoint, jwt, id, method = 'DELETE') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}/${id}`, {
      headers: this.secureheader(jwt),
      method,
    })
    .then(this.checkStatus)
    .then(response => response.json());
  },

  upload(url, file, mimetype, method = 'PUT') {
    return new Promise(function (resolve, reject) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', mimetype);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if(xhr.status === 200) {
            resolve(xhr.response);
          } else {
            reject(xhr.response);
          }
        }
      };
      const data = { uri: file };
      xhr.send(data);
    });
  },

  error(message) {
    Toast.show({
      type: 'danger',
      text: message.toString(),
      duration: 5000,
      position: 'bottom',
      buttonText: 'Okay',
    });
  },

  success(message) {
    Toast.show({
      text: message.toString(),
      duration: 5000,
      position: 'bottom',
      buttonText: 'Okay',
    });
  },
};

export const UserService = {
  login(email, password) {
    return fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: ApiUtils.header(),
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json());
  },

  register(email, name, surname, password) {
    return fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: ApiUtils.header(),
      body: JSON.stringify({ user: {
        email,
        name,
        surname,
        password,
      },
      }),
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json());
  },

  loginFacebook(access_token) {
    return fetch(`${API_BASE_URL}/auth/facebook`, {
      method: 'POST',
      headers: ApiUtils.header(),
      body: JSON.stringify({
        access_token,
      }),
    })
    .then(ApiUtils.checkStatus)
    .then(response => response.json());
  },
};
