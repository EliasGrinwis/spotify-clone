import {useRecoilState} from "recoil";
import {userProfileState} from "../store";
import {useState} from "react";
import {getAuth, signOut} from "firebase/auth";

export default function Avatar() {
  const [userProfile, setUserProfile] = useRecoilState(userProfileState);
  const [dropDown, setDropDown] = useState(false);

  const auth = getAuth();

  const toggleDropDown = () => {
    setDropDown(!dropDown);
  };

  const handleLogout = async () => {
    try {
      signOut(auth).then(() => {
        // Sign-out successful.
        setUserProfile([]);
      });
    } catch (error) {
      // An error happened.
      console.log(error);
    }
  };

  return (
    <div className="relative z-50">
      <img
        className="rounded-full w-10 h-10 cursor-pointer"
        src={userProfile.photoURL}
        alt={userProfile.displayName}
        onClick={toggleDropDown}
      />

      {dropDown && (
        <div className="absolute top-14 right-0 bg-lightgray p-3 w-56 rounded-md">
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Account
          </p>
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Profiel
          </p>
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Neem Premium
          </p>
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Ondersteuning
          </p>
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Downloaden
          </p>
          <p className="p-2 text-text hover:bg-customgray cursor-pointer">
            Instellingen
          </p>
          <hr className="border-customgray" />
          <p
            onClick={handleLogout}
            className="p-2 text-text hover:bg-customgray cursor-pointer">
            Uitloggen
          </p>
        </div>
      )}
    </div>
  );
}
