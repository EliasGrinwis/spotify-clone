import {Icon} from "@iconify/react";
import {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {favoriteSongsState} from "../store";

export default function Sidebar() {
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const favoriteSongs = useRecoilValue(favoriteSongsState);

  function handleToggle() {
    setToggle(!toggle);
  }

  const Dropdown = () => {
    return (
      <div className="absolute bottom-[-45px] w-10/12 bg-lightgray p-1 rounded-sm">
        <div className="flex items-center gap-3 cursor-pointer p-1 hover:bg-customgray rounded-sm">
          <Icon className="w-7 h-7 text-text" icon="ph:playlist" />
          <p className="text-text  text-sm">Een nieuwe playlist maken</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-96 bg-black p-2">
      <div className="bg-background p-3 rounded-md">
        <Link to="/">
          <div
            className={
              location.pathname === "/"
                ? "bg-lightgray flex items-center gap-3 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center gap-3 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:home"
            />
            <p className="text-customgray font-bold">Home</p>
          </div>
        </Link>

        <Link to="/search">
          <div
            className={
              location.pathname === "/search"
                ? "bg-lightgray flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:search"
            />
            <p className="text-customgray font-bold">Zoeken</p>
          </div>
        </Link>

        <Link to="/dashboard">
          <div
            className={
              location.pathname === "/dashboard"
                ? "bg-lightgray flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:dashboard"
            />
            <p className="text-customgray font-bold">Dashboard</p>
          </div>
        </Link>
      </div>

      <div className="bg-background p-3 mt-2 rounded-md">
        <div className="flex items-center justify-between p-2 rounded-lg relative">
          <div className="flex items-center gap-3 cursor-pointer">
            <Icon
              className="w-7 h-7 text-customgray"
              icon="fluent:library-32-filled"
            />
            <p className="text-customgray font-bold">Bibliotheek</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="cursor-pointer hover:bg-black rounded-full p-1">
              <Icon
                onClick={handleToggle}
                className="w-7 h-7 text-customgray hover:text-text"
                icon="material-symbols:add"
              />
            </div>
            {toggle && <Dropdown />}

            <div className="cursor-pointer hover:bg-black rounded-full p-1">
              <Icon
                className="w-7 h-7 text-customgray hover:text-text"
                icon="formkit:arrowright"
              />
            </div>
          </div>
        </div>
        <Link to="/collection/tracks">
          <div
            className={
              location.pathname === "/collection/tracks"
                ? "bg-lightgray flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <img
              className="w-12 h-12 rounded-sm"
              src="https://misc.scdn.co/liked-songs/liked-songs-640.png"
              alt="liked songs"
            />
            <div>
              <p className="text-green-500">Nummers die je leuk vindt</p>
              <div className="flex items-center gap-2">
                <Icon
                  className="w-4 h-4 text-green-500"
                  icon="iconoir:pin-solid"
                />
                <p className="text-customgray">
                  Playlist ({favoriteSongs.length} nummers)
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
