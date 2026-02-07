import React, { useEffect, useRef, useState } from "react";
import {
    Search,
    Send,
    Image as ImageIcon,
    Phone,
    Video,
    Info,
    Paperclip,
    Plus,
    Users,
    X,
    Check
} from "lucide-react";
// import type { GetFriend } from "../model/getFriend";
import API_FRIEND from "../services/friend";
import type { GetFriend } from "../model/getFriend";
import type { ChatRoomUser } from "../model/Roomchat";
import API_MESSAGE from "../services/message";
import { useSelector } from "react-redux";
import type { RootState } from "./../store/store";
import type { Message, User } from "./Message";
import { useNavigate, useParams } from "react-router-dom";


const MessagesPage: React.FC = () => {

    const navigate = useNavigate()
    // láy thông tin của roomId
    const { roomId } = useParams<{ roomId: string }>();

    // lấy thông tin người dùng 
    const users = useSelector((state: RootState) => state.user.user as User);
    // bắt đầu làm việc ở đây 
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);
    const [friends, setFriends] = useState<GetFriend[]>([]);

    // hết 
    useEffect(() => {
        if (!showNewMessageModal) return;

        const fetchFriends = async () => {
            try {
                const res = await fetch(API_FRIEND.friendPrimary, {
                    credentials: "include",
                });
                const data = await res.json();
                console.log("friend là : ", data.data)
                setFriends(data.data || data); // tùy backend
            } catch (err) {
                console.error(err);
            }
        };

        fetchFriends();
    }, [showNewMessageModal]);

    // tạo cột bạn bè bên phải
    const [friendMessage, setFriendMessage] = useState<ChatRoomUser[]>([])
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(API_MESSAGE.getRoom, {
                    method: "GET",
                    credentials: "include", // bắt buộc nếu dùng cookie
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                console.log("data phải gửi tin nhắn là : ", data)
                setFriendMessage(data)
            } catch (err) {
                console.error("Lỗi trong chương trình:", err);
            }
        };

        fetchRoom();
    }, []);

    const [isNewChat, setIsNewChat] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    /* =======================
       MOCK CONVERSATIONS
    ======================= */

    // const [friends, setFriends] = useState<GetFriend[]>([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await fetch(API_FRIEND.friendPrimary, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // ⭐ gửi cookie
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Fetch friends failed");
                }

                // setFriends(data.data);
                // ↑ tùy backend trả { friends: [] } hay []

            } catch (error) {
                console.error("Fetch friends error:", error);
            }
        };

        fetchFriends();
    }, []);
    /* =======================
       MOCK MESSAGES
       
    ======================= */
    const [selectedConversation, setSelectedConversation] = useState<number | null>(Number(roomId));
    const [messages, setMessage] = useState<Message[]>([])


    // lấy toàn bộ tin nhắn 
    useEffect(() => {
        if (selectedConversation === null) return; // ⭐ CỰC KỲ QUAN TRỌNG
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_MESSAGE.getMessage}/${selectedConversation}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include", // ⭐ gửi cookie
                });

                if (!response.ok) {
                    throw new Error("Fetch messages failed");
                }

                const data = await response.json();
                console.log("Messages:", data);
                setMessage(data)
            } catch (error) {
                console.error("Lỗi khi gọi API getMessage:", error);
            }
        };

        fetchMessages();
    }, [selectedConversation]);
    useEffect(() => {
        if (!roomId) return;

        const id = Number(roomId);
        if (isNaN(id)) return;

        setSelectedConversation(id);
    }, [roomId]);
    // scroll 
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);
    const [selectedConv, setselectedConv] = useState<User>()
    const [nameRoom, setNameRoom] = useState("")


    const [content, setContent] = useState("")
    /* =======================
       HANDLERS
    ======================= */
    const handleSendMessage = async (id: number) => {
        if (!content.trim()) return;
        console.log("id là : ", id)
        console.log("Send:", content);
        console.log("room Id là : ", roomId)
        try {
            const response = await fetch(API_MESSAGE.postchat, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ⭐ gửi cookie (JWT)
                body: JSON.stringify({
                    friend_id: id,
                    roomId: roomId,
                    content: content.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Send message failed");
            }

            const newMessage = await response.json();
            console.log("Message sent:", newMessage);

            // (tuỳ chọn) update UI ngay (optimistic)
            setMessage(prev => [...prev, newMessage.data]);

            setContent("");
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        }
    };


    useEffect(() => {
        if (!roomId || friendMessage.length === 0) return;

        const roomIdNum = Number(roomId);
        if (isNaN(roomIdNum)) return;

        const foundRoom = friendMessage.find(
            r => r.chat_room_id === roomIdNum
        );

        if (!foundRoom) return;

        const otherUser = foundRoom.Chat_room?.members?.[0]?.User;
        const nameRoom = foundRoom.Chat_room?.name;
        if (!otherUser) return;

        setselectedConv(otherUser);
        setNameRoom(nameRoom)
        setIsNewChat(false);
    }, [roomId, friendMessage]);
    // thêm vào là tạo group 
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    console.log("trạng thái của showCreateGroupModal là : ", showCreateGroupModal)
    useEffect(() => {
        if (!showNewMessageModal && !setShowCreateGroupModal) return;

        const fetchFriends = async () => {
            try {
                const res = await fetch(API_FRIEND.friendPrimary, {
                    credentials: "include",
                });
                const data = await res.json();
                console.log("friend là : ", data.data)
                setFriends(data.data || data); // tùy backend
            } catch (err) {
                console.error(err);
            }
        };

        fetchFriends();
    }, [showNewMessageModal, showCreateGroupModal]);
    const canCreateGroup =
        groupName.trim().length > 0 && selectedMembers.length >= 1;
    const [roomType, setRoomType] = useState("");
    const handleToggleRoomType = async () => {
        if (!selectedConversation) return;

        try {
            const res = await fetch(API_MESSAGE.updateRoomType, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    room_id: selectedConversation,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Update room failed");
                return;
            }

            // ✅ cập nhật UI theo dữ liệu backend trả về
            setRoomType(data.data.visibility);

        } catch (err) {
            console.error("❌ Update room type failed:", err);
        }
    };


    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div
                    className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden"
                    style={{ height: "calc(100vh - 180px)" }}
                >
                    <div className="grid grid-cols-12 h-full">

                        {/* =======================
                           LEFT SIDEBAR
                        ======================= */}
                        <div className="col-span-12 md:col-span-4 border-r-2 border-gray-100 flex flex-col">
                            {/* Search */}
                            <div className="p-4 border-b-2 border-gray-100">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..."
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                                    />
                                </div>
                            </div>

                            {/* New Message */}
                            <div className="p-4 border-b border-gray-100">
                                <button
                                    onClick={() => {
                                        setShowNewMessageModal(true);
                                    }}

                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
                                >
                                    <Plus size={18} /> New Message
                                </button>
                            </div>
                            <div className="p-4 border-b border-gray-100">
                                <button
                                    onClick={() => setShowCreateGroupModal(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    <Users size={18} /> Create Group
                                </button>
                            </div>
                            {/* Conversations */}
                            <div className="flex-1 overflow-y-auto">
                                {friendMessage.map((conv) => {
                                    const otherUser = conv?.Chat_room?.members?.[0]?.User;
                                    const nameRoom = conv?.Chat_room?.name;
                                    const RoomType = conv?.Chat_room?.type_room;
                                    return (
                                        <button
                                            key={conv.chat_room_id}
                                            onClick={() => {
                                                setSelectedConversation(conv.chat_room_id);
                                                setIsNewChat(false);
                                                setselectedConv(otherUser);
                                                setNameRoom(nameRoom)
                                                setRoomType(RoomType)
                                                navigate(`/messages/${conv.chat_room_id}`);
                                            }}
                                            className={`w-full text-left p-4 cursor-pointer transition-all
                    ${selectedConversation === conv.chat_room_id
                                                    ? "bg-gray-100 border-l-4 border-gray-900"
                                                    : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <img
                                                    src={otherUser?.avatar || "/default-avatar.png"}
                                                    alt="avatar"
                                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                                />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        {
                                                            nameRoom ? (<h4 className="font-semibold text-gray-900 truncate">
                                                                {nameRoom || "Unknown User"}
                                                            </h4>)
                                                                :
                                                                <h4 className="font-semibold text-gray-900 truncate">
                                                                    {otherUser?.name || "Unknown User"}
                                                                </h4>
                                                        }


                                                        {/* Time (placeholder) */}
                                                        <span className="text-xs text-gray-500">
                                                            {/* 12:30 */}
                                                        </span>
                                                    </div>

                                                    {/* Last message (placeholder) */}
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {/* Tin nhắn gần nhất */}
                                                    </p>

                                                    {/* Unread badge */}
                                                    {/* {conv.unreadCount > 0 && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-900 text-white text-xs rounded-full">
                                {conv.unreadCount}
                            </span>
                        )} */}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                        </div>

                        {/* =======================
                           RIGHT CHAT AREA
                        ======================= */}
                        <div className="col-span-12 md:col-span-8 flex flex-col overflow-hidden">

                            {(selectedConv || isNewChat) ? (
                                <>
                                    {/* Header */}
                                    <div className="p-4 border-b-2 border-gray-100 flex justify-between items-center">
                                        {isNewChat ? (
                                            <h3 className="font-bold text-gray-900">New Message</h3>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                {/* LEFT: Avatar + Name */}
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={selectedConv!.avatar || "/default-avatar.png"}
                                                        className="w-10 h-10 rounded-full"
                                                    />

                                                    <div>
                                                        {nameRoom ? (
                                                            <h3 className="font-bold flex items-center gap-2">
                                                                {nameRoom}
                                                                <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                                                                    Group
                                                                </span>
                                                            </h3>
                                                        ) : (
                                                            <h3 className="font-bold">{selectedConv!.name}</h3>
                                                        )}

                                                        <p className="text-sm text-gray-500">
                                                            Active now
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* RIGHT: Toggle Public / Private (CHỈ GROUP) */}
                                                {nameRoom && (
                                                    <button
                                                        onClick={handleToggleRoomType}
                                                        className={`px-3 py-1 text-sm rounded-full border transition
                ${roomType === "public"
                                                                ? "bg-green-100 text-green-700 border-green-300"
                                                                : "bg-gray-100 text-gray-700 border-gray-300"
                                                            }`}
                                                    >
                                                        {roomType === "public" ? "Public" : "Private"}
                                                    </button>
                                                )}
                                            </div>

                                        )}

                                        {!isNewChat && (
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Phone size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Video size={18} />
                                                </button>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Info size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Messages */}
                                    {/* Messages */}
                                    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
                                        {isNewChat ? (
                                            <p className="text-gray-500 text-center">
                                                Start typing to begin a conversation 💬
                                            </p>
                                        ) : messages.length === 0 ? (
                                            <p className="text-gray-400 text-center">
                                                No messages yet
                                            </p>
                                        ) : (
                                            messages.map((msg) => {
                                                const isMe = msg.user_id === users.id;

                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isMe ? "justify-end" : "justify-start"} items-end`}
                                                    >
                                                        {/* AVATAR – chỉ hiện khi KHÔNG phải mình */}
                                                        {!isMe && (
                                                            <img
                                                                src={msg.User?.avatar || "/default-avatar.png"}
                                                                alt="avatar"
                                                                className="w-8 h-8 rounded-full mr-2 self-start"
                                                            />
                                                        )}

                                                        {/* MESSAGE BOX */}
                                                        <div className="max-w-md">
                                                            {/* NAME – chỉ hiện khi KHÔNG phải mình */}
                                                            {!isMe && (
                                                                <p className="text-xs text-gray-500 mb-1 ml-1">
                                                                    {msg.User?.name || "Unknown"}
                                                                </p>
                                                            )}

                                                            <div
                                                                className={`px-4 py-2 rounded-2xl break-words
                        ${isMe
                                                                        ? "bg-gray-900 text-white rounded-br-none"
                                                                        : "bg-gray-100 text-gray-900 rounded-bl-none"
                                                                    }`}
                                                            >
                                                                {msg.content}
                                                            </div>

                                                            {/* TIMESTAMP (optional) */}
                                                            <div
                                                                className={`text-xs text-gray-400 mt-1 ${isMe ? "text-right" : "text-left ml-1"
                                                                    }`}
                                                            >
                                                                {/* {msg.createdAt} */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}

                                        {/* AUTO SCROLL */}
                                        <div ref={messagesEndRef} />
                                    </div>



                                    {/* Input */}
                                    <div className="p-4 border-t-2 border-gray-100">
                                        <div className="flex gap-3 items-end">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                <Paperclip size={20} />
                                            </button>
                                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                <ImageIcon size={20} />
                                            </button>

                                            <textarea
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                placeholder={isNewChat ? "Write your first message..." : "Type a message..."}
                                                rows={1}
                                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-gray-900"
                                            />

                                            <button
                                                onClick={() => {
                                                    if (!selectedConv) return;
                                                    handleSendMessage(selectedConv.id);
                                                }}
                                                className="p-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-center">
                                    <div>
                                        <Send size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Select a conversation
                                        </h3>
                                        <p className="text-gray-500">
                                            Or start a new message
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                    {showNewMessageModal && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
                            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

                                {/* Header */}
                                <div className="p-4 border-b flex justify-between items-center">
                                    <h3 className="font-bold text-lg">New Message</h3>
                                    <button
                                        onClick={() => setShowNewMessageModal(false)}
                                        className="text-gray-500 hover:text-gray-900"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Search */}
                                <div className="p-4 border-b">
                                    <input
                                        placeholder="Search friends..."
                                        className="w-full px-4 py-2 border rounded-xl focus:outline-none"
                                    />
                                </div>

                                {/* Friends list */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {friends.map(friend => (
                                        <div
                                            key={friend.id}
                                            onClick={() => {
                                                // 👉 TODO: gọi API findOrCreateChatRoom(friend.id)
                                                setShowNewMessageModal(false);
                                                setIsNewChat(true);
                                                setSelectedConversation(null);
                                            }}
                                            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-100"
                                        >
                                            <img
                                                src={friend.friend.avatar}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold">{friend.friend.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {friend.friend.isOnline ? "Online" : "Offline"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {friends.length === 0 && (
                                        <p className="text-center text-gray-500 p-6">
                                            No friends found
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {showCreateGroupModal && (
                        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">

                                {/* Header */}
                                <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-xl text-white">Create New Group</h3>
                                        <button
                                            onClick={() => {
                                                setShowCreateGroupModal(false);
                                                setGroupName("");
                                                setSelectedMembers([]);
                                            }}
                                            className="text-white hover:bg-white/20 p-1 rounded-lg transition-all"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Group Name Input */}
                                <div className="p-6 border-b">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Group Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="Enter group name..."
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-all"
                                    />
                                </div>

                                {/* Search Members */}
                                <div className="p-6 border-b">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Add Members
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search friends..."
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900"
                                        />
                                    </div>

                                    {/* Selected Members Tags */}
                                    {selectedMembers.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {selectedMembers.map(memberId => {
                                                const friend = friends.find(f => f.friend.id === memberId);
                                                return friend ? (
                                                    <div
                                                        key={memberId}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm"
                                                    >
                                                        <img
                                                            src={friend.friend.avatar}
                                                            alt={friend.friend.name}
                                                            className="w-5 h-5 rounded-full object-cover"
                                                        />
                                                        <span className="font-medium">{friend.friend.name}</span>
                                                        <button
                                                            onClick={() => setSelectedMembers(prev => prev.filter(id => id !== memberId))}
                                                            className="hover:bg-blue-100 rounded-full p-0.5"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Friends List */}
                                <div className="max-h-[300px] overflow-y-auto">
                                    {friends.map(friend => {
                                        const isSelected = selectedMembers.includes(friend.friend.id);
                                        return (
                                            <button
                                                key={friend.id}
                                                onClick={() => {
                                                    if (isSelected) {
                                                        setSelectedMembers(prev => prev.filter(id => id !== friend.friend.id));
                                                    } else {
                                                        setSelectedMembers(prev => [...prev, friend.friend.id]);
                                                    }
                                                }}
                                                className={`w-full flex items-center gap-3 p-4 cursor-pointer transition-all
                                ${isSelected ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'}
                            `}
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={friend.friend.avatar}
                                                        alt={friend.friend.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <Check size={14} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="font-semibold text-gray-900">{friend.friend.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {friend.friend.isOnline ? "Online" : "Offline"}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}

                                    {friends.length === 0 && (
                                        <div className="text-center text-gray-500 p-8">
                                            <Users size={48} className="mx-auto mb-4 text-gray-300" />
                                            <p>No friends available</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t bg-gray-50 flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowCreateGroupModal(false);
                                            setGroupName("");
                                            setSelectedMembers([]);
                                        }}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={!canCreateGroup}
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(API_MESSAGE.createGroup, {
                                                    method: 'POST',
                                                    credentials: 'include',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({
                                                        name: groupName.trim(),
                                                        member_ids: selectedMembers,
                                                    }),
                                                });

                                                if (!response.ok) {
                                                    const err = await response.json();
                                                    throw new Error(err.message || 'Create group failed');
                                                }

                                                const result = await response.json();
                                                console.log('✅ Group created:', result);

                                                setShowCreateGroupModal(false);
                                                setGroupName('');
                                                setSelectedMembers([]);

                                                // TODO: refresh conversations list
                                            } catch (error) {
                                                console.error(error);
                                            }
                                        }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600
             text-white rounded-xl font-semibold
             disabled:opacity-50"
                                    >
                                        Create Group ({selectedMembers.length + 1})
                                    </button>


                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default MessagesPage;
