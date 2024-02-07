import React, {useState} from "react";
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  inMemoryPersistence,
  GoogleAuthProvider,
} from "firebase/auth";
import {useSetRecoilState} from "recoil";
import {userProfileState} from "../store";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const provider = new GoogleAuthProvider();
  const authInstance = getAuth();

  const setUserProfile = useSetRecoilState(userProfileState);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);

      await setPersistence(authInstance, inMemoryPersistence);

      const result = await signInWithPopup(authInstance, provider);

      // This gives you a Google Access Token. You can use it to access the Google API.
      //const credential = GoogleAuthProvider.credentialFromResult(result);
      //const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      setUserProfile(user);
      // IdP data available using getAdditionalUserInfo(result)
      // ...

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
