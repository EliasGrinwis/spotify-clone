import "./App.css";
import {Route, Routes} from "react-router-dom";
import Bottombar from "./components/BottomBar";
import Sidebar from "./components/SideBar";
import Search from "./components/Search";
import Home from "./components/Home";
import {useRecoilValue} from "recoil";
import {userProfileState} from "./store";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import FavoriteSongs from "./components/FavoriteSongs";
import Profile from "./components/Profile";

export default function App() {
  const userProfile = useRecoilValue(userProfileState);

  return (
    <>
      {userProfile.length === 0 ? (
        <Login />
      ) : (
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="bg-black flex-1 flex flex-col overflow-hidden pt-2">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/collection/tracks" element={<FavoriteSongs />} />
                {userProfile && userProfile.displayName && (
                  <Route
                    path={
                      "/user/" +
                      userProfile.displayName.toLowerCase().replace(/\s/g, "")
                    }
                    element={<Profile />}
                  />
                )}
              </Routes>
            </div>
          </div>
          <Bottombar />
        </div>
      )}
    </>
  );
}
