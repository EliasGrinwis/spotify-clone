import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import SongApi from "../apis/SongApi";
import {useRecoilState, useRecoilValue} from "recoil";
import {
  favoriteSongsState,
  playingState,
  songState,
  userProfileState,
} from "../store";
import Loading from "./Loading";
import Avatar from "./Avatar";
import UserSongApi from "../apis/UserSongApi";
import SuccessMessage from "../components/SuccessMessage";
import SuccessDeleteMessage from "./SuccessDeleteMessage";

export default function Search() {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useRecoilState(songState);
  const [isPlaying, setIsPlaying] = useRecoilState(playingState);
  const [isLoading, setIsLoading] = useState(false);
  const userProfile = useRecoilValue(userProfileState);
  const [hoveredRows, setHoveredRows] = useState(
    new Array(songs.length).fill(false)
  );

  const [favoriteSongs, setFavoriteSongs] = useRecoilState(favoriteSongsState);
  const isSongInFavorites = (song) => favoriteSongs.includes(song.id);

  const [success, setSuccess] = useState(false);
  const [successDelete, setSuccessDelete] = useState(false);

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        if (userProfile.uid) {
          const result = await SongApi.getFavoriteSongs(userProfile.uid);
          setFavoriteSongs(result.data.map((song) => song.id));
        }
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
    setHoveredRows(new Array(songs.length).fill(false));
  }, [songs]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await SongApi.getSongs();
        setSongs(result.data);
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

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

  const addToFavorite = async (song) => {
    if (!isSongInFavorites(song)) {
      const createUserSong = async () => {
        try {
          const userSong = {
            userId: userProfile.uid,
            songId: song.id,
          };

          setFavoriteSongs((prevFavoriteSongs) => [
            ...prevFavoriteSongs,
            song.id,
          ]);

          await UserSongApi.createUserSong(userSong);
          setSuccess(true);

          setTimeout(() => {
            setSuccess(false);
          }, 5000);
        } catch (e) {
          console.log(e);
        }
      };

      createUserSong();
    } else {
      try {
        await UserSongApi.deleteUserSong(userProfile.uid, song.id);
        setSuccessDelete(true);

        setFavoriteSongs((prevFavoriteSongs) =>
          prevFavoriteSongs.filter((id) => id !== song.id)
        );

        setTimeout(() => {
          setSuccessDelete(false);
        }, 5000);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-background overflow-y-scroll rounded-md">
      <div className="flex justify-between">
        <h1 className="text-3xl text-text font-bold">
          Zoek hier naar alle nummers
        </h1>
        {userProfile.length !== 0 && <Avatar />}
      </div>

      <div className="mt-5">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <Icon
              className="w-5 h-5 text-text"
              icon="material-symbols:search"
            />
          </div>
          <input
            type="search"
            id="default-search"
            className="block w-96  p-4 ps-10 text-sm bg-searchColor outline-none text-text rounded-full"
            placeholder="Waar wil je naar luisteren?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="mt-5">
        {isLoading ? (
          <Loading />
        ) : filteredSongs.length === 0 ? (
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
              {filteredSongs.map((filteredSong, index) => (
                <tr
                  key={index}
                  className="mb-4 hover:bg-lightgray"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}>
                  <td
                    className={
                      song.name === filteredSong.name
                        ? "py-2 pl-4 text-green-500"
                        : "py-2 pl-4 text-customgray"
                    }
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
                      <p
                        className={
                          song.name === filteredSong.name
                            ? "text-green-500"
                            : ""
                        }>
                        {filteredSong.name}
                      </p>
                      <p className="text-customgray">
                        {filteredSong.songWriter}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-4 text-customgray">
                    {filteredSong.description}
                  </td>
                  <td className="cursor-pointer">
                    <Icon
                      className={`w-5 h-5 ${
                        isSongInFavorites(filteredSong)
                          ? "text-green-500 fill-current"
                          : "text-customgray"
                      }`}
                      icon={
                        isSongInFavorites(filteredSong)
                          ? "mdi:heart"
                          : "mdi:heart-outline"
                      }
                      onClick={() => addToFavorite(filteredSong)}
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

      {success && <SuccessMessage />}
      {successDelete && <SuccessDeleteMessage />}
    </div>
  );
}
