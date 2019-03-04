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

// LocalStorage is not safe way to store security tokens but for simplicity I use it
Object.defineProperty(axios, "token", {
  get() {
    return localStorage.getItem(axios.AuthStorageKey);
  },
  set(value) {
    if (value) {
      localStorage.setItem(axios.AuthStorageKey, value);
    } else {
      localStorage.removeItem(axios.AuthStorageKey);
    }
  }
});

if (axios.token) {
  axios.defaults.headers.authorization = "Bearer " + axios.token;
}

export default axios;
