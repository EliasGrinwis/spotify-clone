import {useRecoilValue} from "recoil";
import {userProfileState} from "../store";
import {useEffect, useState} from "react";
import UserApi from "../apis/UserApi";
import {Navigate} from "react-router-dom";

export default function ProtectedGuard({component: Component, admin, ...rest}) {
  const userProfile = useRecoilValue(userProfileState);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await UserApi.getUser(userProfile.uid);

        setIsAdmin(userData.data.isAdmin);
      } catch (e) {
        console.log(e);
      }
    };

    fetchUser();
  }, [userProfile.uid]);

  if (admin && !isAdmin) return <Navigate to="/" />;

  return <Component {...rest} />;
}
