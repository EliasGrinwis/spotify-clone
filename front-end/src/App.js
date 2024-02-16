import "./App.css";
import {Navigate, Route, Routes} from "react-router-dom";
import Bottombar from "./components/BottomBar";
import Sidebar from "./components/SideBar";
import Search from "./components/Search";
import Home from "./components/Home";
import {useRecoilValue} from "recoil";
import {selectedPlaylist, userProfileState} from "./store";
import Dashboard from "./components/Dashboard";
import FavoriteSongs from "./components/FavoriteSongs";
import Profile from "./components/Profile";
import Login from "./components/Login";
import ProtectedGuard from "./auth/ProtectedGuard";
import Register from "./components/Register";
import Playlist from "./components/Playlist";

export default function App() {
  const userProfile = useRecoilValue(userProfileState);
  const playlist = useRecoilValue(selectedPlaylist);

  return (
    <>
      {userProfile.length === 0 ? (
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
            <div className="bg-black flex-1 flex flex-col overflow-hidden pt-2 pr-2 pb-2">
              <Routes>
                <Route
                  path="/"
                  element={<ProtectedGuard component={Home} admin={false} />}
                />
                <Route
                  path="/search"
                  element={<ProtectedGuard component={Search} admin={false} />}
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedGuard component={Dashboard} admin={true} />
                  }
                />
                <Route
                  path="/collection/tracks"
                  element={
                    <ProtectedGuard component={FavoriteSongs} admin={false} />
                  }
                />
                <Route
                  path={
                    "/user/" +
                    userProfile.displayName.toLowerCase().replace(/\s/g, "")
                  }
                  element={<ProtectedGuard component={Profile} admin={false} />}
                />

                {playlist && (
                  <Route
                    path={"/playlist/" + playlist.id}
                    element={
                      <ProtectedGuard component={Playlist} admin={false} />
                    }
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
