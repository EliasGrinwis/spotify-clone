import React, {useState} from "react";
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {useSetRecoilState} from "recoil";
import {extraUserInformationState, userProfileState} from "../store";
import UserApi from "../apis/UserApi";
import spotifyLogo from "../images/spotify_logo.png";
import {Icon} from "@iconify/react";
import {Link, useNavigate} from "react-router-dom";

export default function Register() {
  const authInstance = getAuth();
  const setUserProfile = useSetRecoilState(userProfileState);
  const setExtraUserInformationState = useSetRecoilState(
    extraUserInformationState
  );
  const [emailAndPassword, setEmailAndPassword] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setEmailAndPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUpWithEmailAndPassword = async () => {
    createUserWithEmailAndPassword(
      authInstance,
      emailAndPassword.email,
      emailAndPassword.password
    )
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Extract display name from email address
        const displayName = emailAndPassword.email.split("@")[0];
        const defaultPhoto =
          "https://firebasestorage.googleapis.com/v0/b/spotify-ab8ac.appspot.com/o/profileImages%2FdefaultUser.jpg?alt=media&token=577520d6-1375-4f73-b9a2-d1824b6c75e2";

        await updateProfile(user, {
          displayName: displayName,
          photoURL: defaultPhoto,
        });

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

        navigate("/");
      })
      .catch(() => {
        setError("Een account met dit e-mailadres bestaat al.");
      });
  };

  return (
    <div className="bg-background h-screen flex flex-col">
      <div className="p-8">
        <img src={spotifyLogo} className="w-32 h-auto" alt="Spotify logo" />
      </div>
      <div className="p-8 gradient-background flex-1 flex items-center justify-center">
        <div className="p-14 bg-background text-text w-[750px] h-full rounded-lg">
          <h1 className="text-5xl text-center font-bold">
            Create a Spotify account
          </h1>
          <div className="py-10">
            {error && (
              <div className="bg-red-500 p-3 flex items-center gap-3 mb-5">
                <Icon
                  className="w-6 h-6 text-text"
                  icon="mingcute:warning-line"
                />
                {error}
              </div>
            )}
          </div>
          <div className="outline outline-1 outline-[#292929]"></div>
          <div className="py-10">
            <div className="min-w-[40%] w-80 mx-auto">
              <label className="block mb-2 w-full font-semibold">
                E-mailadres of gebruikersnaam
              </label>
              <input
                type="text"
                name="email"
                value={emailAndPassword.email}
                onChange={handleInputChange}
                className="bg-transparent placeholder-customgray p-2 outline outline-1 outline-outlineColor rounded-sm w-full"
                placeholder="E-mailadres of gebruikersnaam"
              />
            </div>
            <div className="min-w-[40%] w-80 mx-auto mt-6">
              <label className="block mb-2 w-full font-semibold">
                Wachtwoord
              </label>
              <input
                type="password"
                name="password"
                value={emailAndPassword.password}
                onChange={handleInputChange}
                className="bg-transparent p-2 outline outline-1 outline-outlineColor rounded-sm w-full"
                placeholder="Wachtwoord"
              />
            </div>

            <div className="min-w-[40%] w-80 mx-auto mt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="w-11 h-6 bg-customgray peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                <span className="ms-3 text-sm font-medium text-text">
                  Mij onthouden
                </span>
              </label>
            </div>

            <div className="min-w-[40%] w-80 mx-auto mt-6">
              <button
                className="bg-green-500 p-2 w-full rounded-full text-black font-semibold"
                onClick={handleSignUpWithEmailAndPassword}>
                Registeren
              </button>
            </div>
          </div>

          <div className="outline outline-1 outline-[#292929]"></div>

          <div className="pt-10 text-center">
            <p>
              Heb je al een account?
              <Link to="/login">
                <span className="ml-1 font-semibold underline cursor-pointer">
                  Log hier in.
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
