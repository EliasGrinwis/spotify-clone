import {Icon} from "@iconify/react";
import {useEffect, useState, useRef} from "react";
import {Link, useLocation} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {favoriteSongsState, userProfileState} from "../store";
import PlaylistApi from "../apis/PlaylistApi";
import SongApi from "../apis/SongApi";

export default function Sidebar() {
  const location = useLocation();
  const [toggle, setToggle] = useState(false);
  const [favoriteSongs, setFavoriteSongs] = useRecoilState(favoriteSongsState);
  const [playlists, setPLaylists] = useState([]);
  const [isShowPlaylistOptions, setIsShowPlaylistOptions] = useState(null);
  const userProfile = useRecoilValue(userProfileState);
  const playlistOptionsRef = useRef(null);
  const dropDownRef = useRef(null);

  function handleToggle() {
    setToggle(!toggle);
  }

  const createPlaylist = async () => {
    try {
      const defaultPlaylist = {
        name: "playlist",
      };
      const result = await PlaylistApi.createPlaylist(defaultPlaylist);

      setToggle(false);
      setPLaylists([...playlists, result.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const editPlaylist = async (playlist) => {
    console.log(playlist);
  };

  const deletePlaylist = async (playlist) => {
    try {
      await PlaylistApi.deletePlaylist(playlist);

      const updatedPlaylists = playlists.filter(
        (item) => item.id !== playlist.id
      );
      setPLaylists(updatedPlaylists);
    } catch (e) {
      console.log(e);
    }
  };

  const handlePlaylist = (e, id) => {
    e.preventDefault(); // Prevent default behavior for context menu
    if (e.type === "click") {
      setIsShowPlaylistOptions(0);
    } else if (e.type === "contextmenu") {
      setIsShowPlaylistOptions(id);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        playlistOptionsRef.current &&
        !playlistOptionsRef.current.contains(event.target)
      ) {
        setIsShowPlaylistOptions(null);
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchPLaylists = async () => {
      try {
        const resultFavoriteSongs = await SongApi.getFavoriteSongs(
          userProfile.uid
        );
        const result = await PlaylistApi.getPLaylists();

        setPLaylists(result.data);
        setFavoriteSongs(resultFavoriteSongs.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchPLaylists();
  }, [setFavoriteSongs, userProfile.uid]);

  const PlaylistOptions = ({playlist}) => {
    return (
      <div
        ref={playlistOptionsRef}
        className="absolute bottom-[-50px] left-6 z-50 w-10/12 bg-lightgray p-1 rounded-sm outline outline-1 outline-customgray">
        <div
          className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-searchColor rounded-sm"
          onClick={() => editPlaylist(playlist)}>
          <Icon className="w-5 h-5 text-text" icon="lucide:pen" />
          <p className="text-text  text-sm">Gegevens bewerken</p>
        </div>
        <div
          className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-searchColor rounded-sm"
          onClick={() => deletePlaylist(playlist)}>
          <Icon className="w-5 h-5 text-text" icon="gg:remove" />
          <p className="text-text  text-sm">Verwijderen</p>
        </div>
      </div>
    );
  };

  const Dropdown = () => {
    return (
      <div
        ref={dropDownRef}
        className="absolute bottom-[-80px] left-0 w-10/12 bg-lightgray p-1 rounded-sm z-50 outline outline-1 outline-customgray">
        <div
          className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-searchColor rounded-sm"
          onClick={createPlaylist}>
          <Icon className="w-6 h-6 text-text" icon="ph:playlist" />
          <p className="text-text  text-sm">Een nieuwe playlist maken</p>
        </div>
        <div className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-searchColor rounded-sm">
          <Icon
            className="w-6 h-6 text-text"
            icon="material-symbols:folder-outline"
          />
          <p className="text-text  text-sm">Een map met playlists maken</p>
        </div>
      </div>
    );
  };

  return (
    <div className="w-24 lg:w-96 bg-black p-2 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden h-full">
      <div className="bg-background p-3 rounded-md">
        <Link to="/">
          <div
            className={
              location.pathname === "/"
                ? "bg-lightgray bg-opacity-75 flex items-center justify-center lg:justify-normal gap-3 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center justify-center lg:justify-normal gap-3 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:home"
            />
            <p className="hidden lg:block text-customgray font-bold">Home</p>
          </div>
        </Link>

        <Link to="/search">
          <div
            className={
              location.pathname === "/search"
                ? "bg-lightgray bg-opacity-75 flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:search"
            />
            <p className="hidden lg:block text-customgray font-bold">Zoeken</p>
          </div>
        </Link>

        <Link to="/dashboard">
          <div
            className={
              location.pathname === "/dashboard"
                ? "bg-lightgray bg-opacity-75 flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                : "flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
            }>
            <Icon
              className="w-7 h-7 text-customgray"
              icon="material-symbols:dashboard"
            />
            <p className="hidden lg:block text-customgray font-bold">
              Dashboard
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-background p-3 mt-2 rounded-md">
        <div className="flex items-center justify-center lg:justify-between p-2 rounded-lg relative">
          <div className="flex items-center gap-3 cursor-pointer">
            <Icon
              className="w-7 h-7 text-customgray"
              icon="fluent:library-32-filled"
            />
            <p className="hidden lg:block text-customgray font-bold">
              Bibliotheek
            </p>
          </div>
          <div className="items-center gap-3 hidden lg:flex">
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
        <div>
          <Link to="/collection/tracks">
            <div
              className={
                location.pathname === "/collection/tracks"
                  ? "bg-lightgray bg-opacity-75 flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                  : "flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
              }>
              <Icon
                className="w-7 h-7 text-customgray lg:hidden"
                icon="mdi:heart"
              />

              <img
                className="w-12 h-12 rounded-sm hidden lg:block"
                src="https://misc.scdn.co/liked-songs/liked-songs-640.png"
                alt="liked songs"
              />
              <div className="hidden lg:block">
                <p className="text-green-500">Nummers die je leuk vindt</p>
                <div className="flex items-center gap-2">
                  <Icon
                    className="w-4 h-4 text-green-500"
                    icon="iconoir:pin-solid"
                  />
                  <div className="text-customgray flex items-center">
                    <p>Playlist</p>
                    <Icon className="w-6 h-6 text-customgray" icon="mdi:dot" />
                    {favoriteSongs.length === 1 ? (
                      <p>{favoriteSongs.length} nummer</p>
                    ) : (
                      <p>{favoriteSongs.length} nummers</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Link>

          <div>
            {playlists.map((playlist, index) => (
              <div
                className="relative"
                key={index}
                onClick={(e) => handlePlaylist(e, playlist.id)}
                onContextMenu={(e) => handlePlaylist(e, playlist.id)}>
                <Link to={playlist.name}>
                  <div
                    className={
                      location.pathname === playlist.name
                        ? "bg-lightgray bg-opacity-75 flex items-center justify-center lg:justify-normal gap-3 mt-4 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                        : "flex items-center justify-center lg:justify-normal gap-3 cursor-pointer hover:bg-lightgray p-2 rounded-lg"
                    }>
                    <Icon className="w-7 h-7 text-text " icon="mynaui:music" />
                    <div className="hidden lg:block">
                      <p className="text-text font-semibold">
                        Mijn {playlist.name} {playlist.id}
                      </p>

                      <p className="text-customgray text-sm">
                        Playlist * {userProfile.displayName}
                      </p>
                    </div>
                  </div>
                  {isShowPlaylistOptions === playlist.id && (
                    <PlaylistOptions playlist={playlist} />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
