import Avatar from "./Avatar";
import React, {useRef} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {extraUserInformationState, userProfileState} from "../store";
import {Icon} from "@iconify/react";
import {storage, ref, getDownloadURL} from "../config/firebase";
import {uploadBytesResumable} from "firebase/storage";
import UserApi from "../apis/UserApi";

export default function Profile() {
  const userProfile = useRecoilValue(userProfileState);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [userInformationState, setExtraUserInformationState] = useRecoilState(
    extraUserInformationState
  );

  const changeImage = async () => {
    try {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      } else {
        console.log("File input reference is not initialized.");
      }
    } catch (error) {
      console.error("Error occurred while changing image:", error);
    }
  };

  // Event listener for file input change
  const handleFileInputChange = async (event) => {
    try {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        const storageRefImage = ref(
          storage,
          `profileImages/${selectedFile.name}`
        );
        await uploadBytesResumable(storageRefImage, selectedFile);
        const imageUrl = await getDownloadURL(storageRefImage);

        const existingUser = {
          id: userProfile.uid,
          photoURL: imageUrl,
        };

        await UserApi.updateUser(existingUser).catch((error) => {
          console.error("Error creating user:", error);
          throw error;
        });

        setExtraUserInformationState({
          ...userInformationState,
          photoURL: imageUrl,
        });
      } else {
        console.log("No image selected.");
      }
    } catch (error) {
      console.error("Error occurred while uploading image:", error);
    }
  };

  return (
    <div className="p-8 bg-background rounded-md">
      <div className="flex justify-between">
        <div className="flex items-end gap-5">
          <div className="relative">
            <img
              className="w-60 h-60 rounded-full"
              src={userInformationState.photoURL}
              alt="User Profile"
            />
            <div
              className="absolute top-0 bottom-0 left-0 right-0 h-full w-full group cursor-pointer rounded-full"
              onClick={changeImage} // Trigger file select when the overlay is clicked
            >
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-0 rounded-full group-hover:opacity-50"></div>
              <div className="text-text font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center flex-col justify-center gap-2">
                <Icon className="w-12 h-12 text-text" icon="lucide:pen" />
                <p>Foto kiezen</p>

                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  style={{display: "none"}}
                  ref={fileInputRef} // Assign the ref to the file input
                  onChange={handleFileInputChange} // Call handleFileInputChange on change
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-text text-sm">Profiel</p>
            <h1 className="text-text text-5xl font-bold">
              {userProfile.displayName}
            </h1>
            <p className="text-text text-sm">6 volgend</p>
          </div>
        </div>

        {userProfile.length !== 0 && <Avatar />}
      </div>
    </div>
  );
}
