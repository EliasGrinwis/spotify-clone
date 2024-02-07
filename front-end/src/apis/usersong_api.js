import axios from "axios";
import configData from "../config/config.json";

let userSongBaseUrl;

if (process.env.NODE_ENV === "development") {
  userSongBaseUrl = configData.baseUrl + "/api/UserSongs";
} else {
  userSongBaseUrl = configData.baseUrlProduction + "/api/UserSongs";
}

export default class UserSongApi {
  static getUserSongs() {
    return axios.get(userSongBaseUrl);
  }

  static createUserSong(userSong) {
    return axios.post(userSongBaseUrl, userSong);
  }

  static deleteUserSong(userId, songId) {
    return axios.delete(userSongBaseUrl + "/" + userId + "/" + songId);
  }
}
