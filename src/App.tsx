import { Route, Routes } from "react-router-dom";
import Header from "./layouts/header";
import Home from "./pages/home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/registerPage";
import CommunityPage from "./pages/CommunityPage";
import Logout from "./pages/LogoutPage";
import FriendRequestsPage from "./pages/FriendPage";
import MessagesPage from "./pages/messagePage";
import ProfilePage from "./pages/ProfilePage";
import CreateEventPage from "./pages/CreateEven";
import EventsPage from "./pages/EvnetPage";
import GetUserProfilePage from "./pages/GetUserProfile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />} >
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<CommunityPage />} />
        <Route path="/event" element={<EventsPage />} />
        <Route path="/friend" element={<FriendRequestsPage />} />
        <Route path="/createEvent" element={<CreateEventPage />} />
        <Route path="/messages/:roomId" element={<MessagesPage />} />
        <Route path="/user/:id" element={<GetUserProfilePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  )
}