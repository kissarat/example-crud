import Axios from "axios";

const axios = Axios.create({
  baseURL: "/api",
  validateStatus: s => 200 <= s && s < 600
});

axios.interceptors.response.use(function(r) {
  if (401 === r.status) {
    location.pathname = '/auth'
  }
  else {
    return Promise.resolve(r);
  }
})

axios.AuthStorageKey = "token";

const token = localStorage.getItem(axios.AuthStorageKey);
if (token) {
  axios.defaults.headers.authorization = "Bearer " + token;
}

export default axios;
