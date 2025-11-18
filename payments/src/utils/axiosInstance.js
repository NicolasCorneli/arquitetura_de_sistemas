const axios = require("axios");

class AxiosSingleton {
  constructor() {
    if (!AxiosSingleton.instance) {
      AxiosSingleton.instance = axios.create({
        timeout: 10000, // 10s anti-cascata
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  getInstance() { return AxiosSingleton.instance; }
}

module.exports = new AxiosSingleton().getInstance();
