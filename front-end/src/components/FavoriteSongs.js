import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import SongApi from "../apis/SongApi";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  userProfileState,
  extraUserInformationState,
  songState,
  playingState,
  favoriteSongsState,
} from "../store";
import Loading from "./Loading";
import Avatar from "./Avatar";
import UserSongApi from "../apis/UserSongApi";

export default function FavoriteSongs() {
  const userProfile = useRecoilValue(userProfileState);
  const [favoriteSongs, setFavoriteSongs] = useRecoilState(favoriteSongsState);

  const userInformationState = useRecoilValue(extraUserInformationState);

  const [isLoading, setIsLoading] = useState(false);
  const [song, setSong] = useRecoilState(songState);
  const [hoveredRows, setHoveredRows] = useState(
    new Array(favoriteSongs.length).fill(false)
  );
  const [isPlaying, setIsPlaying] = useRecoilState(playingState);

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      setIsLoading(true);
      try {
        const result = await SongApi.getFavoriteSongs(userProfile.uid);
        setFavoriteSongs(result.data);

        setIsLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    fetchFavoriteSongs();
  }, [userProfile.uid, setFavoriteSongs]);

  const handleMouseEnter = (index) => {
    setHoveredRows((prevHoveredRows) =>
      prevHoveredRows.map((_, i) => i === index)
    );
  };

  const handleMouseLeave = () => {
    setHoveredRows((prevHoveredRows) => prevHoveredRows.map(() => false));
  };

  useEffect(() => {
    // Update the hoveredRows array whenever songs change
    setHoveredRows(new Array(favoriteSongs.length).fill(false));
  }, [favoriteSongs]);

  const handleSongClick = (url, image, name, duration, songWriter) => {
    setSong({
      name: name,
      image: image,
      url: url,
      duration: duration,
      songWriter: songWriter,
    });

    setIsPlaying(true);
  };

  const removeSongFromFavorites = async (songId) => {
    try {
      await UserSongApi.deleteUserSong(userProfile.uid, songId);

      setFavoriteSongs((prevFavoriteSongs) =>
        prevFavoriteSongs.filter((song) => song.id !== songId)
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-8 bg-background rounded-md overflow-y-scroll">
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
                src={userInformationState.photoURL}
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

      <div className="mt-5">
        {isLoading ? (
          <Loading />
        ) : favoriteSongs.length === 0 ? (
          <p className="text-text">Geen nummers gevonden</p>
        ) : (
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="py-2 pl-4 text-customgray text-left">#</th>
                <th className="py-2 pr-4 text-customgray text-left">Titel</th>
                <th className="py-2 px-4 text-customgray text-left">Album</th>
                <th></th>
                <th className="py-2 px-4 text-left">
                  <Icon className="w-5 h-5 text-customgray" icon="ph:clock" />
                </th>
              </tr>
            </thead>
            <tbody>
              {favoriteSongs.map((filteredSong, index) => (
                <tr
                  key={index}
                  className="mb-4 hover:bg-lightgray"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}>
                  <td
                    className="py-2 pl-4 text-customgray"
                    style={{width: "78px"}} // Adjust the width accordingly
                  >
                    {hoveredRows[index] ? (
                      <Icon
                        className="text-text w-5 h-5"
                        icon="mdi:play"
                        onClick={() =>
                          handleSongClick(
                            filteredSong.url,
                            filteredSong.image,
                            filteredSong.name,
                            filteredSong.duration,
                            filteredSong.songWriter
                          )
                        }
                      />
                    ) : isPlaying ? (
                      song.name === filteredSong.name ? (
                        <Icon
                          className="text-green-500"
                          icon="svg-spinners:bars-scale-middle"
                        />
                      ) : (
                        filteredSong.id
                      )
                    ) : (
                      filteredSong.id
                    )}
                  </td>
                  <td className="py-2 pr-4 text-text flex items-center gap-3 ">
                    <img
                      className="w-12 h-12 rounded-md object-cover"
                      src={filteredSong.image}
                      alt={filteredSong.name}
                    />
                    <div>
                      <p className="text-green-500">{filteredSong.name}</p>
                      <p className="text-customgray">
                        {filteredSong.songWriter}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-customgray">
                    {filteredSong.description}
                  </td>
                  <td
                    className="cursor-pointer"
                    onClick={() => removeSongFromFavorites(filteredSong.id)}>
                    <Icon
                      className="w-5 h-5 text-green-500 fill-current"
                      icon="mdi:heart"
                    />
                  </td>
                  <td className="py-2 px-4 text-customgray">
                    {filteredSong.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
