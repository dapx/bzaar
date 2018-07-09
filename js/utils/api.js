import { Toast } from 'native-base';

const API_BASE_URL = 'https://bzaar-api.herokuapp.com/bzaar';

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
    // eslint-disable-next-line no-underscore-dangle
    const message = JSON.parse(response._bodyText).error;
    throw new Error(message);
  },

  getValue(response) {
    if (response.status >= 204 && response.status <= 205) return null;
    return response.json();
  },

  request(endpoint, jwt, search = '') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}${search && `?search=${search}`}`, {
      method: 'GET',
      headers: this.secureheader(jwt),
    }).then(this.checkStatus)
      .then(response => response.json());
  },

  create(endpoint, jwt, data, method = 'POST') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}`, {
      headers: this.secureheader(jwt),
      method,
      body: JSON.stringify(data),
    }).then(this.checkStatus)
      .then(this.getValue);
  },

  delete(endpoint, jwt, id, method = 'DELETE') {
    return fetch(`${API_BASE_URL}/secured/${endpoint}/${id}`, {
      headers: this.secureheader(jwt),
      method,
    }).then(this.checkStatus)
      .then(this.getValue);
  },

  upload(url, file, mimetype, method = 'PUT') {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-undef
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.setRequestHeader('Content-Type', mimetype);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
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
    }).then(ApiUtils.checkStatus)
      .then(response => response.json());
  },

  register(email, name, surname, password) {
    return fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: ApiUtils.header(),
      body: JSON.stringify({
        user: {
          email,
          name,
          surname,
          password,
        },
      }),
    }).then(ApiUtils.checkStatus)
      .then(response => response.json());
  },

  loginFacebook(accessToken) {
    return fetch(`${API_BASE_URL}/auth/facebook`, {
      method: 'POST',
      headers: ApiUtils.header(),
      body: JSON.stringify({
        access_token: accessToken,
      }),
    }).then(ApiUtils.checkStatus)
      .then(response => response.json());
  },

  getCep(cep) {
    return fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      method: 'GET',
      headers: ApiUtils.header(),
    }).then(ApiUtils.checkStatus)
      .then(response => response.json());
  },
};
