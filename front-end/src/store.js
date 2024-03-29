import {atom} from "recoil";

export const songState = atom({
  key: "songState",
  default: {
    name: "",
    image: "",
    url: "",
    duration: "",
    songWriter: "",
  },
});

export const playingState = atom({
  key: "playingState",
  default: false,
});

export const userProfileState = atom({
  key: "userProfileState",
  default: [],
});

export const extraUserInformationState = atom({
  key: "extraUserInformationState",
  default: [],
});

export const favoriteSongsState = atom({
  key: "favoriteSongsState",
  default: [],
});

export const selectedPlaylist = atom({
  key: "selectedPlaylist",
  default: null,
});
