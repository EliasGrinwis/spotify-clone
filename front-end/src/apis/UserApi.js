import axios from "axios";
import configData from "../config/config.json";

let userBaseUrl;

if (process.env.NODE_ENV === "development") {
  userBaseUrl = configData.baseUrlDevelopment + "/api/users";
} else {
  userBaseUrl = configData.baseUrlProduction + "/api/users";
}

export default class UserApi {
  static getUsers() {
    return axios.get(userBaseUrl);
  }

  static getUser(userId) {
    return axios.get(userBaseUrl + "/" + userId);
  }

  static createUser(user) {
    return axios.post(userBaseUrl, user);
  }

  static updateUser(user) {
    return axios.put(userBaseUrl + "/" + user.id, user);
  }
}
