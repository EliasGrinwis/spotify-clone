import "./App.css";
import {Route, Routes} from "react-router-dom";
import Bottombar from "./components/bottombar";
import Sidebar from "./components/sidebar";
import Search from "./pages/search";
import Home from "./pages/home";
import {useRecoilValue} from "recoil";
import {userProfileState} from "./store";
import Login from "./pages/login";
import Dashboard from "./pages/admin/dashboard";
import FavoriteSongs from "./components/favorite_songs";

export default function App() {
  const userProfile = useRecoilValue(userProfileState);

  return (
    <>
      {!userProfile ? (
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
              </Routes>
            </div>
          </div>
          <Bottombar />
        </div>
      )}
    </>
  );
}
