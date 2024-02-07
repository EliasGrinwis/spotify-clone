import {useEffect, useState} from "react";
import {Icon} from "@iconify/react";
import {useRecoilState, useRecoilValue} from "recoil";
import {playingState, songState} from "../store";
import SongApi from "../apis/songs_api";

export default function Bottombar() {
  const song = useRecoilValue(songState);
  const [songs, setSongs] = useState([]);

  const [audio, setAudio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useRecoilState(playingState);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(35);
  const [isRepeat, setIsRepeat] = useState(false); // New state for repeat

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const playPauseToggle = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Play error:", error);
      });

      // If repeat is enabled, set the event listener for 'ended'
      if (isRepeat) {
        audio.addEventListener("ended", () => {
          audio.currentTime = 0;
          audio.play();
        });
      }
    }

    setIsPlaying(!isPlaying);
  };

  const handleRepeatToggle = () => {
    setIsRepeat(!isRepeat);
  };

  const handleProgressChange = (value) => {
    setProgress(value);
    audio.currentTime = value;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await SongApi.getSongs();
        setSongs(result.data);
      } catch (e) {
        console.log(e);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const currentIndex = songs.findIndex(
      (songToFind) => songToFind.name === song.name
    );

    console.log(currentIndex);

    const newAudio = new Audio(song.url);

    newAudio.addEventListener("timeupdate", () => {
      setProgress(newAudio.currentTime);
    });

    // Play the audio immediately when the song.url changes
    newAudio.play().catch((error) => {
      console.error("Play error:", error);
    });

    setAudio(newAudio);

    // Cleanup function
    return () => {
      newAudio.pause();
      newAudio.src = "";
      // No need to reset audio here
    };
  }, [song.url, setIsPlaying, song.name, songs]);

  useEffect(() => {
    audio.volume = volume / 100;
  }, [volume, audio]);

  useEffect(() => {
    if (audio.duration && !isNaN(audio.duration)) {
      setProgress(audio.currentTime);
    }
  }, [audio.duration, audio.currentTime]);

  return (
    <div className="h-20 bg-black grid grid-cols-3 place-content-center p-2">
      <div className="p-3 flex items-center gap-3">
        <img
          src={song.image}
          className="w-14 h-14 rounded-md object-cover"
          alt="current music playing"
        />
        <div>
          <h3 className="text-text text-sm font-bold">{song.name}</h3>
          <p className="text-customgray text-xs">{song.songWriter}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center gap-5">
          <Icon className="w-5 h-5 text-text" icon="ph:shuffle-fill" />
          <Icon className="w-5 h-5 text-text" icon="ph:skip-back-fill" />
          <button
            className="bg-white p-1 rounded-full"
            onClick={playPauseToggle}>
            <Icon
              icon={isPlaying ? "material-symbols:pause" : "mdi:play"}
              className="w-7 h-7 text-black"
            />
          </button>
          <Icon className="w-5 h-5 text-text" icon="ph:skip-forward-fill" />

          <Icon
            className={
              isRepeat
                ? "w-5 h-5 text-green-600 cursor-pointer"
                : "w-5 h-5 text-text cursor-pointer"
            }
            icon="mi:repeat"
            onClick={handleRepeatToggle}
          />
        </div>
        <div className="flex items-center">
          <p className="text-white mr-2">{formatTime(progress)}</p>
          <input
            type="range"
            value={progress}
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            max={audio.duration || 100}
            className="appearance-none w-96 h-1 bg-[#4d4d4d] rounded-none outline-none text-white "
          />
          <p className="text-white ml-2">{song.duration}</p>
        </div>
      </div>

      <div className="p-3 flex items-center justify-end gap-4">
        <Icon className="w-5 h-5 text-text" icon="mdi:play-box-outline" />
        <Icon className="w-5 h-5 text-text" icon="lucide:mic-2" />
        <Icon className="w-5 h-5 text-text" icon="heroicons:queue-list" />
        <Icon className="w-5 h-5 text-text" icon="tdesign:device" />

        <div className="flex items-center gap-2">
          <Icon
            className="w-5 h-5 text-text"
            icon={volume > 0 ? "iconoir:sound-low" : "iconoir:sound-off"}
          />
          <input
            type="range"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            max={100}
            className="appearance-none w-24 h-1 bg-[#4d4d4d] rounded-full outline-none text-white"
          />
        </div>

        <Icon className="w-5 h-5 text-text" icon="akar-icons:miniplayer" />
      </div>
    </div>
  );
}
