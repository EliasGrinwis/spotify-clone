import React, {useState} from "react";
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  GoogleAuthProvider,
  browserLocalPersistence,
} from "firebase/auth";
import {useSetRecoilState} from "recoil";
import {extraUserInformationState, userProfileState} from "../store";
import UserApi from "../apis/UserApi";
import spotifyLogo from "../images/spotify_logo.png";
import googleLogo from "../images/google_logo.png";

export default function Login() {
  const [error, setError] = useState(null);

  const authInstance = getAuth();
  const setUserProfile = useSetRecoilState(userProfileState);
  const setExtraUserInformationState = useSetRecoilState(
    extraUserInformationState
  );

  const handleSignIn = async () => {
    try {
      setError(null);

      const googleProvider = new GoogleAuthProvider();

      // Sign in with Google provider
      await signInWithPopup(authInstance, googleProvider);

      // Set the persistence
      await setPersistence(authInstance, browserLocalPersistence);

      // Get the current user
      const user = authInstance.currentUser;

      // Check if the user exists in the database
      let existingUser = await UserApi.getUsers()
        .then((response) => {
          return response.data.find((u) => u.id === user.uid);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          throw error;
        });

      // If the user doesn't exist, create a new user entry
      if (!existingUser) {
        existingUser = {
          id: user.uid,
          photoURL: user.photoURL,
        };
        await UserApi.createUser(existingUser).catch((error) => {
          console.error("Error creating user:", error);
          throw error;
        });
      }

      const result = await UserApi.getUser(user.uid);

      setExtraUserInformationState(result.data);
      setUserProfile(user);
    } catch (error) {
      // Handle Errors here.
      const errorMessage = error.message;
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-background h-screen flex flex-col">
      <div className="p-8">
        <img src={spotifyLogo} className="w-32 h-auto" alt="Spotify logo" />
      </div>
      <div className="p-8 gradient-background flex-1 flex items-center justify-center">
        <div className="p-14 bg-background text-text w-[750px] h-full rounded-lg">
          <h1 className="text-5xl text-center font-bold">
            Bestaand Spotify account
          </h1>
          <div className="py-10">
            <div
              onClick={handleSignIn}
              className="w-[50%] outline outline-1 outline-outlineColor hover:outline-white p-3 rounded-full text-center mx-auto flex items-center justify-evenly cursor-pointer">
              <img src={googleLogo} className="w-6 h-auto" alt="Google logo" />
              <p className="text-md font-semibold">Verdergaan met Google</p>
            </div>
          </div>
          <div className="outline outline-1 outline-[#292929]"></div>
          <div className="py-10">
            <div class="text-center bg-outlineColor p-4 rounded-lg">
              <p class="text-lg font-semibold">Coming Soon</p>
            </div>

            {/* <div className="min-w-[40%] w-80 mx-auto">
            <label className="block mb-2 w-full">
              E-mailadres of gebruikersnaam
            </label>
            <input
              className="bg-transparent p-2 outline outline-1 outline-outlineColor rounded-sm w-full"
              placeholder="E-mailadres of gebruikersnaam"
            />
          </div> */}
          </div>
        </div>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
