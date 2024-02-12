import axios from "axios";
import configData from "../config/config.json";

let playlistBaseUrl;

if (process.env.NODE_ENV === "development") {
  playlistBaseUrl = configData.baseUrlDevelopment + "/api/playlists";
} else {
  playlistBaseUrl = configData.baseUrlProduction + "/api/playlists";
}

export default class PlaylistApi {
  static getPLaylists() {
    return axios.get(playlistBaseUrl);
  }

  static createPlaylist(playlist) {
    return axios.post(playlistBaseUrl, playlist);
  }

  static deletePlaylist(playlist) {
    return axios.delete(playlistBaseUrl + "/" + playlist.id);
  }
}
