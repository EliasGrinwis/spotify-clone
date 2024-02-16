import {useRecoilValue} from "recoil";
import {
  extraUserInformationState,
  selectedPlaylist,
  userProfileState,
} from "../store";
import Avatar from "./Avatar";
import {Icon} from "@iconify/react";

export default function Playlist() {
  const playlist = useRecoilValue(selectedPlaylist);
  const userInformationState = useRecoilValue(extraUserInformationState);
  const userProfile = useRecoilValue(userProfileState);

  return (
    <div className="p-8 gradiant-playlist rounded-md overflow-y-auto">
      <div className="flex justify-between ">
        <div className="flex gap-5 items-end ">
          <div className="w-56 h-56 bg-lightgray flex items-center justify-center rounded-md">
            <Icon className=" text-customgray w-24 h-24" icon="mynaui:music" />
          </div>
          <div>
            <p className="text-text text-sm">Playlist</p>
            <h1 className="text-6xl text-text font-bold">
              Mijn {playlist.name} {playlist.id}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <img
                className="rounded-full w-6 h-6"
                src={userInformationState.photoURL}
                alt={userProfile.displayName}
              />
              <div className="flex text-sm items-center">
                <p className="text-text">{userProfile.displayName}</p>
              </div>
            </div>
          </div>
        </div>

        {userProfile.length !== 0 && <Avatar />}
      </div>
    </div>
  );
}
