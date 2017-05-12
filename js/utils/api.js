const api_base_url = 'https://bzaar-api.herokuapp.com/bzaar/api';

let ApiUtils = {
  checkStatus: function(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let message = JSON.parse(response._bodyText).error;
      throw new Error(message);
    }
  }
}

export let UserService = {
	userLogin: function(email, password) {
		return fetch(`${api_base_url}/signin`, {
		  method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    })
		.then(ApiUtils.checkStatus)
		.then((response) => response.json())
		.then((responseJson) => {
			return responseJson;
		})
		.catch((error) => {
			throw error;
		})
	}
}
