// orders/src/utils/axiosInstance.js
const axios = require("axios");

const instance = axios.create({
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// opcional: retry simples (pode ajustar)
instance.interceptors.response.use(null, async (error) => {
  // se for timeout ou network error, você pode tentar novo request (simples)
  return Promise.reject(error);
});

module.exports = instance;
