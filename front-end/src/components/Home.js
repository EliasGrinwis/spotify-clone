import Login from "./Login";
import Avatar from "./Avatar";
import React from "react";
import {useRecoilValue} from "recoil";
import {userProfileState} from "../store";

export default function Home() {
  const userProfile = useRecoilValue(userProfileState);

  return (
    <div className="p-8 bg-background">
      <div className="flex justify-between">
        <h1 className="text-3xl text-text font-bold mb-4">
          Welcome to Our Spotify Clone
        </h1>
        {userProfile.length !== 0 && <Avatar />}
      </div>

      <p className="text-customgray mb-8">
        Enjoy a seamless music experience, all for free, without any
        interruptions!
      </p>

      <Login />
    </div>
  );
}
