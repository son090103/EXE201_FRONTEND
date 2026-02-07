import { useEffect, useState } from "react";
import { Bell, Calendar, MessageCircle, Search, Users } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Footer from "./footer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "./../store/store";
import API_USER from "../services/user.ts";
import { loginSuccess, logout } from "../store/slices/userSlice.ts";
import type { Chat } from "../model/chat.tsx";
import ChatSidebar from "../pages/ChatSidebar.tsx";
function Header() {
    console.log("chạy vào header")
    const [searchQuery, setSearchQuery] = useState("");
    const users = useSelector((state: RootState) => state.user.user);
    console.log("user trong header là : ", users)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showUserMenu, setShowUserMenu] = useState(false);
    const pendingFriendRequests = 3; // Hardcode tạm, sau này fetch từ API
    const unreadMessages = 3;


    useEffect(() => {
        if (users != null) return; // ⛔ đã có user thì KHÔNG fetch nữa

        const fetchProfile = async () => {
            try {
                console.log("chạy vào hàm try")
                const response = await fetch(API_USER.profile, {
                    credentials: "include",
                });

                if (response.status === 401) {
                    dispatch(logout());
                    return;
                }

                const dataProfile = await response.json();
                console.log("data trong header là : ", dataProfile)
                if (!response.ok) {
                    throw new Error(dataProfile.message || "Profile fail");
                }

                dispatch(loginSuccess(dataProfile.data));
            } catch (error) {
                console.log("lỗi chương trình là : ", error)
                dispatch(logout());
                navigate("/")
            }
        };

        fetchProfile();
    }, [users, dispatch]);

    const [showMessages, setShowMessages] = useState(false);

    // tin nhắn 
    // chat 
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [showChatSidebar, setShowChatSidebar] = useState(false);
    const recentChats: Chat[] = [
        {
            id: 1,
            name: "Nguyễn Văn An",
            avatar: "https://i.pravatar.cc/100?img=12",
            lastMessage: "Tối nay đi cafe không?",
            unread: 2,
        },
        {
            id: 2,
            name: "Trần Thị Bích",
            avatar: "https://i.pravatar.cc/100?img=32",
            lastMessage: "Ok, để mình xem lại nhé",
            unread: 0,
        },
    ];

    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link to={"/"} className="text-2xl font-bold cursor-pointer">
                        <span className="text-gray-900">FAVE</span>
                        <span className="text-gray-600">MATES</span>
                    </Link>

                    {/* Navigation - Center */}
                    {users && (
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
                            <Link to="/" className="hover:text-gray-900 transition-colors">
                                Home
                            </Link>
                            <Link to="/home" className="hover:text-gray-900 transition-colors">
                                Community
                            </Link>
                            <Link to="/event" className="hover:text-gray-900 transition-colors">
                                Events
                            </Link>
                            <Link to="/friend" className="hover:text-gray-900 transition-colors relative flex items-center gap-2">
                                <Users size={18} />
                                Friends
                                {pendingFriendRequests > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {pendingFriendRequests}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    )}

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Search - Only show when logged in */}
                        {users && (
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-60 rounded-full border-2 border-gray-200 px-4 py-2 pr-10 text-sm focus:outline-none focus:border-gray-900 transition-all"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    <Search size={18} />
                                </button>
                            </div>
                        )}

                        {users ? (
                            <>
                                <div className="relative hidden md:block">
                                    <button
                                        onClick={() => setShowMessages(!showMessages)}
                                        className="relative p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <MessageCircle size={22} />
                                        {unreadMessages > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {unreadMessages}
                                            </span>
                                        )}
                                    </button>

                                    {showMessages && (
                                        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-2xl shadow-xl z-50">
                                            <div className="px-4 py-3 font-bold border-b">
                                                Messages
                                            </div>

                                            {recentChats.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    onClick={() => {
                                                        setActiveChat(chat);
                                                        setShowChatSidebar(true);
                                                        setShowMessages(false);
                                                    }}
                                                    className="flex gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                                                >
                                                    <img
                                                        src={chat.avatar}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between">
                                                            <p className="font-semibold truncate">{chat.name}</p>
                                                            {Number(chat.unread) > 0 && (
                                                                <span className="w-2 h-2 bg-blue-600 rounded-full" />
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {chat.lastMessage}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            <Link
                                                to="/messages"
                                                className="block text-center py-3 font-semibold hover:bg-gray-50"
                                            >
                                                See all messages
                                            </Link>
                                        </div>
                                    )}
                                </div>


                                {/* Notifications Icon */}
                                <button
                                    className="relative p-2 hover:bg-gray-100 rounded-full transition-all hidden md:block"
                                    title="Notifications"
                                >
                                    <Bell size={22} className="text-gray-700" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* User Avatar with Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-all"
                                    >
                                        {users.avatar ? (
                                            <img
                                                src={users.avatar}
                                                alt={users.name}
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">
                                                    {users.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 z-50 overflow-hidden">
                                            {/* User Info */}
                                            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                                                <p className="font-bold text-gray-900 text-lg">{users.name}</p>
                                                <p className="text-sm text-gray-600 mt-1">{users.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-colors text-gray-800 hover:text-purple-700"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span className="font-medium">Profile</span>
                                                </Link>

                                                <Link
                                                    to="/friends"
                                                    className="flex items-center justify-between px-5 py-3 hover:bg-purple-50 transition-colors text-gray-800 hover:text-purple-700"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Users className="w-5 h-5 text-purple-600" />
                                                        <span className="font-medium">Friend Requests</span>
                                                    </div>
                                                    {pendingFriendRequests > 0 && (
                                                        <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">
                                                            {pendingFriendRequests}
                                                        </span>
                                                    )}
                                                </Link>

                                                {/* New: Create Event - Dùng Link thay vì button */}
                                                <Link
                                                    to="/createEvent"
                                                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-colors text-gray-800 hover:text-purple-700"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <Calendar className="w-5 h-5 text-purple-600" />
                                                    <span className="font-medium">Create Event</span>
                                                </Link>

                                                <Link
                                                    to="/settings"
                                                    className="flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-colors text-gray-800 hover:text-purple-700"
                                                    onClick={() => setShowUserMenu(false)}
                                                >
                                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="font-medium">Settings</span>
                                                </Link>
                                            </div>

                                            <hr className="my-2 border-gray-100 mx-4" />

                                            <Link
                                                to="/logout"
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-600 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                <span className="font-medium">Logout</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-full bg-white border-2 border-gray-900 px-6 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition-all"
                                >
                                    Join Us
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <Outlet />
            <Footer />
            {showChatSidebar && activeChat && (
                <ChatSidebar
                    chat={activeChat}
                    onClose={() => setShowChatSidebar(false)}
                />
            )}
        </>
    );
};

export default Header;
