import React, {useState} from "react";
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import {useSetRecoilState} from "recoil";
import {extraUserInformationState, userProfileState} from "../store";
import UserApi from "../apis/UserApi";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authInstance = getAuth();
  const setUserProfile = useSetRecoilState(userProfileState);
  const setExtraUserInformationState = useSetRecoilState(
    extraUserInformationState
  );

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Google provider
      const googleProvider = new GoogleAuthProvider();
      await signInWithPopup(authInstance, googleProvider);

      // Set the persistence
      await setPersistence(authInstance, inMemoryPersistence);

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

      setLoading(false);
    } catch (error) {
      // Handle Errors here.
      const errorMessage = error.message;
      setError(errorMessage);

      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleSignIn}
        className={`text-text ${loading ? "disabled" : ""}`}
        disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </>
  );
}
