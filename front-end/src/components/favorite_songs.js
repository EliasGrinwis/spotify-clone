import {useRecoilValue} from "recoil";
import Avatar from "./avatar";
import {favoriteSongsState, userProfileState} from "../store";
import {Icon} from "@iconify/react";

export default function FavoriteSongs() {
  const userProfile = useRecoilValue(userProfileState);
  const favoriteSongs = useRecoilValue(favoriteSongsState);

  console.log(userProfile);

  return (
    <div className="p-8 bg-background">
      <div className="flex justify-between">
        <div className="flex gap-5 items-end">
          <img
            className="w-56 h-56 rounded-sm"
            src="https://misc.scdn.co/liked-songs/liked-songs-640.png"
            alt="liked songs"
          />
          <div>
            <p className="text-text text-sm">Playlist</p>
            <h1 className="text-4xl text-text font-bold">
              Nummers die je leuk vindt
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <img
                className="rounded-full w-6 h-6"
                src={userProfile.photoURL}
                alt={userProfile.displayName}
              />
              <div className="flex text-sm items-center">
                <p className="text-text">{userProfile.displayName}</p>
                <Icon className="w-6 h-6 text-text" icon="mdi:dot" />
                <p className="text-text">{favoriteSongs.length} nummers</p>
              </div>
            </div>
          </div>
        </div>

        {userProfile.length !== 0 && <Avatar />}
      </div>
    </div>
  );
}
