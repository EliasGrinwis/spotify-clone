import axios from "axios";
import configData from "../config/config.json";

let songBaseUrl;

if (process.env.NODE_ENV === "development") {
  songBaseUrl = configData.baseUrlDevelopment + "/api/songs";
} else {
  songBaseUrl = configData.baseUrlProduction + "/api/songs";
}

export default class SongApi {
  static getSongs() {
    return axios.get(songBaseUrl);
  }

  static getFavoriteSongs(userId) {
    return axios.get(songBaseUrl + "/GetSongsByUserId/" + userId);
  }

  static createSong(song) {
    return axios.post(songBaseUrl, song);
  }
}
