import React, { useEffect, useState } from 'react';
import { UserCheck, Clock, CheckCircle, XCircle, Users, Send, Inbox } from 'lucide-react';
import type { GetFriend } from '../model/getFriend';
import API_FRIEND from '../services/friend';
import { formatVNTime } from '../utils/formatHour';
import { useNavigate } from 'react-router-dom';
import API_MESSAGE from '../services/message';



const FriendRequestsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'friends'>('received');
    const [receivedRequests, setSentRequests] = useState<GetFriend[]>([])
    const [sentRequests, setsentRequests] = useState<GetFriend[]>([])
    const navigate = useNavigate();
    // gọi fetch getfriend
    useEffect(() => {
        const fetchReceivedRequests = async () => {
            try {
                const res = await fetch(API_FRIEND.getFriends, {
                    method: "GET",
                    credentials: "include", // ⭐ bắt buộc nếu dùng cookie
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // ❌ chưa login hoặc hết hạn
                if (res.status === 401) {
                    setSentRequests([]);
                    return;
                }

                const result = await res.json();
                if (res.ok) {
                    setSentRequests(result.data);
                } else {
                    console.error("Fetch friends failed:", result.message);
                }

            } catch (error) {
                console.error("Fetch received requests error:", error);
            }
        };

        fetchReceivedRequests();
    }, []);



    // Lời mời đã gửi đi
    useEffect(() => {
        const fetchsentRequests = async () => {
            try {
                const res = await fetch(API_FRIEND.sentFriend, {
                    method: "GET",
                    credentials: "include", // ⭐ bắt buộc nếu dùng cookie
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // ❌ chưa login hoặc hết hạn
                if (res.status === 401) {
                    setsentRequests([]);
                    return;
                }

                const result = await res.json();
                if (res.ok) {
                    setsentRequests(result.data);
                } else {
                    console.error("Fetch friends failed:", result.message);
                }

            } catch (error) {
                console.error("Fetch received requests error:", error);
            }
        };

        fetchsentRequests();
    }, []);


    // Danh sách bạn bè
    const [friends, setFriends] = useState<GetFriend[]>([]);

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

                setFriends(data.data);
                // ↑ tùy backend trả { friends: [] } hay []

            } catch (error) {
                console.error("Fetch friends error:", error);
            }
        };

        fetchFriends();
    }, []);

    const handleAccept = async (id: number) => {
        try {
            console.log('Accept request:', id);

            const response = await fetch(API_FRIEND.addFriends, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // ⭐ gửi cookie (JWT)
                body: JSON.stringify({
                    friend_id: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Accept friend failed");
            }

            // console.log("Accept success:", data);

            // // 🔥 cập nhật UI sau khi accept
            setSentRequests(prev =>
                prev.filter(friend => friend.id !== id)
            );

        } catch (error) {
            console.error("Accept friend error:", error);
        }
    };

    const handleReject = (id: number): void => {
        console.log('Reject request:', id);
    };

    const handleCancel = (id: number): void => {
        console.log('Cancel request:', id);
    };

    const pendingSentCount = sentRequests.filter(r => r.status === 'pending').length;
    const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length;

    const handldeSent = async (id: number) => {
        try {
            const res = await fetch(`${API_MESSAGE.postroom}`, {
                method: "POST",
                credentials: "include", // ⭐ bắt buộc nếu dùng cookie
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    friend_id: id,
                }),
            });

            if (!res.ok) {
                // backend trả lỗi
                const errText = await res.text();
                console.error("POST room failed:", errText);
                return;
            }

            // nếu backend có trả data
            const data = await res.json();
            console.log("Create room success:", data);

            // ✅ thành công thì chuyển sang message
            navigate(`/messages/${data.roomId}`);
        } catch (err) {
            console.log("lỗi trong chương trình là ", err)
        }
    }
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Friends & Connections</h2>
                    <p className="text-gray-600 text-lg">Manage your friend requests and connections</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl p-2 border-2 border-gray-100 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('received')}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'received'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Inbox size={20} />
                            Received
                            {pendingReceivedCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'received' ? 'bg-white text-gray-900' : 'bg-red-500 text-white'
                                    }`}>
                                    {pendingReceivedCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'sent'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Send size={20} />
                            Sent
                            {pendingSentCount > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'sent' ? 'bg-white text-gray-900' : 'bg-blue-500 text-white'
                                    }`}>
                                    {pendingSentCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('friends')}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${activeTab === 'friends'
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Users size={20} />
                            My Friends
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === 'friends' ? 'bg-white text-gray-900' : 'bg-gray-200 text-gray-700'
                                }`}>
                                {friends.length}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Received Requests */}
                {activeTab === 'received' && (
                    <div className="space-y-4">
                        {receivedRequests.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 border-2 border-gray-100 text-center">
                                <Inbox className="mx-auto text-gray-400 mb-4" size={64} />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Friend Requests</h3>
                                <p className="text-gray-600">You don't have any pending friend requests</p>
                            </div>
                        ) : (
                            receivedRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={request.friend.avatar}
                                                    alt={request.friend.name}
                                                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                                                />
                                                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">{request.friend.name}</h4>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={() => handleAccept(request.friend.id)}
                                                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={20} />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-900 transition-all flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={20} />
                                                Decline
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <Clock size={14} />
                                            {formatVNTime(request.createdAt)}

                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Sent Requests */}
                {activeTab === 'sent' && (
                    <div className="space-y-5">
                        {sentRequests.length === 0 ? (
                            <div className="bg-white rounded-3xl p-14 border border-gray-100 text-center shadow-sm">
                                <Send className="mx-auto text-gray-300 mb-5" size={72} />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    No Sent Requests
                                </h3>
                                <p className="text-gray-500">
                                    You haven't sent any friend requests yet
                                </p>
                            </div>
                        ) : (
                            sentRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="relative flex-shrink-0">
                                                <img
                                                    src={request.friend.avatar}
                                                    alt={request.friend.name}
                                                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-100"
                                                />
                                                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 border-2 border-white rounded-full" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-bold text-gray-900 truncate">
                                                    {request.friend.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Friend request sent
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex flex-col items-end gap-3">
                                            {request.status === 'sent' && (
                                                <>
                                                    <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-2">
                                                        <Clock size={16} />
                                                        Pending
                                                    </span>

                                                    <button
                                                        onClick={() => handleCancel(request.id)}
                                                        className="px-6 py-2 rounded-full border border-gray-200 text-gray-600 font-semibold text-sm
                                        hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                                    >
                                                        ✕ Cancel Request
                                                    </button>
                                                </>
                                            )}

                                            {request.status === 'accepted' && (
                                                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold flex items-center gap-2">
                                                    <UserCheck size={16} />
                                                    Accepted
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-400 flex items-center gap-2">
                                            <Clock size={14} />
                                            Sent {formatVNTime(request.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}


                {/* Friends List */}
                {activeTab === 'friends' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {friends && friends.map((friend) => (
                            <div
                                key={friend.id}
                                className="bg-white rounded-2xl p-5 border-2 border-gray-100 
                           hover:border-gray-200 hover:shadow-xl 
                           transition-all duration-300 group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={friend.friend.avatar}
                                            alt={friend.friend.name}
                                            className="w-16 h-16 rounded-full object-cover 
                                       ring-2 ring-gray-100 
                                       group-hover:ring-gray-300 transition-all"
                                        />

                                        {/* Online dot */}
                                        <div className="absolute bottom-0 right-0 w-4 h-4 
                                        bg-green-500 rounded-full 
                                        border-2 border-white"></div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="text-lg font-bold text-gray-900 truncate">
                                            {friend.friend.name}
                                        </h4>

                                        {/* Sub info */}
                                        <p className="text-sm text-gray-500 truncate">
                                            @{friend.friend.name || "user"}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            🤝 0 mutual friends
                                        </p>

                                        {/* Action */}
                                        <button
                                            className="mt-3 w-full px-4 py-2.5 
                                       bg-gray-900 text-white rounded-xl 
                                       font-semibold 
                                       hover:bg-gray-800 active:scale-[0.98]
                                       transition-all flex items-center justify-center gap-2"
                                            onClick={() => handldeSent(friend.friend.id)}
                                        >
                                            <svg
                                                className="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                />
                                            </svg>
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default FriendRequestsPage;