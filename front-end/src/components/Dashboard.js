import Avatar from "./Avatar";
import React, {useState} from "react";
import {useRecoilValue} from "recoil";
import {userProfileState} from "../store";
import {Icon} from "@iconify/react";
import {storage, ref, uploadBytes, getDownloadURL} from "../config/firebase";
import SongApi from "../apis/SongApi";
import {uploadBytesResumable} from "firebase/storage";

export default function Dashboard() {
  const userProfile = useRecoilValue(userProfileState);
  const [model, setModel] = useState(false);
  const [song, setSong] = useState({
    name: "",
    description: "",
    duration: "",
    image: "",
    url: "",
    songWriter: "",
  });

  const createSong = async () => {
    try {
      const storageRefImage = ref(storage, `images/${song.image.name}`);
      const storageRefFile = ref(storage, `songs/${song.image.name}`);

      await uploadBytesResumable(storageRefImage, song.image);
      await uploadBytes(storageRefFile, song.url);

      // Get the download URL for the uploaded image
      const imageUrl = await getDownloadURL(storageRefImage);
      const fileUrl = await getDownloadURL(storageRefFile);

      const newSong = {...song, image: imageUrl, url: fileUrl};

      //console.log(newSong);

      await SongApi.createSong(newSong);

      setModel(false);
    } catch (e) {
      console.log(e);
    }
  };

  const openModel = () => {
    setModel(!model);
  };

  return (
    <div className="p-8 bg-background flex-1 items-center relative rounded-md">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl text-text font-bold mb-4">
          Here you can manage songs!
        </h1>
        {userProfile.length !== 0 && <Avatar />}
      </div>
      <button
        className="bg-lightgray px-4 py-2 rounded-md text-text"
        onClick={openModel}>
        Create song
      </button>

      {/* Centered model */}
      {model && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative rounded-lg shadow bg-lightgray">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-customgray">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create New Song
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal">
                  <Icon
                    className="w-5 h-5"
                    icon="material-symbols:close"
                    onClick={() => setModel(false)}
                  />
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <div className="grid gap-4 mb-4 grid-cols-4">
                  <div className="col-span-3">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-white">
                      Name
                    </label>
                    <input
                      value={song.name}
                      onChange={(e) => setSong({...song, name: e.target.value})}
                      type="text"
                      name="name"
                      id="name"
                      className="outline-none border text-sm rounded-lg block w-full p-2.5 bg-searchColor border-customgray placeholder-customgray text-white"
                      placeholder="Type song name"
                      required=""
                    />
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Duration
                    </label>
                    <input
                      value={song.duration}
                      onChange={(e) =>
                        setSong({...song, duration: e.target.value})
                      }
                      type="text"
                      name="name"
                      id="name"
                      className="outline-none border text-sm rounded-lg block w-full p-2.5 bg-searchColor border-customgray placeholder-customgray text-white"
                      placeholder="e.g 2:43"
                      required=""
                    />
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="songWriter"
                      className="block mb-2 text-sm font-medium text-white">
                      songWriter
                    </label>
                    <input
                      value={song.songWriter}
                      onChange={(e) =>
                        setSong({...song, songWriter: e.target.value})
                      }
                      type="text"
                      name="songWriter"
                      id="songWriter"
                      className="outline-none border text-sm rounded-lg block w-full p-2.5 bg-searchColor border-customgray placeholder-customgray text-white"
                      placeholder="Type song writer"
                      required=""
                    />
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-text mb-3">
                      Image
                    </label>
                    <div className="mt-1">
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                        Choose photo cover
                      </label>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setSong({...song, image: file});
                        }}
                        className="hidden"
                      />
                      <div className="mt-2 text-customgray">
                        {song.image ? song.image.name : "No file chosen"}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-text mb-3">
                      Song file
                    </label>
                    <div className="mt-1">
                      <label
                        htmlFor="songInput"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
                        Choose music File
                      </label>
                      <input
                        type="file"
                        id="songInput"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setSong({...song, url: file});
                        }}
                        className="hidden"
                      />
                      <div className="mt-2 text-customgray">
                        {song.url ? song.url.name : "No file chosen"}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={createSong}
                  type="submit"
                  className="mt-4 text-lightgray inline-flex border-none items-center bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  <svg
                    className="me-1 -ms-1 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"></path>
                  </svg>
                  Add new song
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
