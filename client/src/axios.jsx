import Axios from "axios";

const axios = Axios.create({
  baseURL: "/api",
  validateStatus: s => 200 <= s && s < 500
});

axios.AuthStorageKey = "token";

const token = localStorage.getItem(axios.AuthStorageKey);
if (token) {
  axios.defaults.headers.authorization = "Bearer " + token;
}

export default axios;
