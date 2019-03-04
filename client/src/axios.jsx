import Axios from "axios";

const axios = Axios.create({
  baseURL: "/api",
  validateStatus: s => 200 <= s && s < 600
});

axios.interceptors.response.use(function(r) {
  if (401 === r.status) {
    location.pathname = "/auth";
  } else {
    return Promise.resolve(r);
  }
});

axios.AuthStorageKey = "token";

Object.defineProperty(axios, "token", {
  get() {
    return localStorage.getItem(axios.AuthStorageKey);
  },
  set(value) {
    localStorage.setItem(axios.AuthStorageKey, value);
  }
});

if (axios.token) {
  axios.defaults.headers.authorization = "Bearer " + axios.token;
}

export default axios;
