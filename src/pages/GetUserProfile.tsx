import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Calendar, ExternalLink, MoreHorizontal, Heart, MessageCircle, Share2, Image, Video, Smile, Users, Trophy, Activity, UserPlus, Send } from 'lucide-react';
import type { User } from '../model/user';
import API_USER from '../services/user';
import { useNavigate, useParams } from 'react-router-dom';
import API_MESSAGE from '../services/message';
import API_FRIEND from '../services/friend';

interface Post {
    id: number;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    isLiked: boolean;
}

interface UserProfile {
    id: number;
    name: string;
    avatar: string;
    coverImage: string;
    location: string;
    joinedDate: string;
    website: string;
    followers: number;
    following: number;
    posts: number;
    interests: string[];
}
type ProfileTab = 'posts' | 'about' | 'friends' | 'photos';
const TABS: ProfileTab[] = ['posts', 'about', 'friends', 'photos'];

const GetUserProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

    const [newPost, setNewPost] = useState<string>('');
    const [showPostModal, setShowPostModal] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const { id } = useParams()
    console.log("id trong profile user là : ", id)
    // lấy user
    const [friend, setFriend] = useState<User>()
    console.log("url là : ", `${API_USER.getUserProfile}/${id}`)
    useEffect(() => {
        fetch(`${API_USER.getUserProfile}/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Lỗi khi gọi API");
                }
                return res.json();
            })
            .then((data) => {
                console.log("data  trong get user là : ", data.data)
                setFriend(data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);
    console.log("friend trong data là : ", friend)
    const profile: UserProfile = {
        id: 1,
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
        coverImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1200',
        location: 'Hà Nội, Vietnam',
        joinedDate: 'Joined January 2024',
        website: 'www.example.com',
        followers: 1234,
        following: 567,
        posts: 89,
        interests: ['Tennis', 'Swimming', 'Yoga', 'Running']
    };

    const posts: Post[] = [
        {
            id: 1,
            content: 'Just finished an amazing tennis match! 🎾 Looking for doubles partners this weekend. Who\'s in?',
            image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800',
            likes: 45,
            comments: 12,
            shares: 3,
            timestamp: '2 hours ago',
            isLiked: false
        },
        {
            id: 2,
            content: 'Morning workout done! Nothing beats starting the day with a good gym session. 💪 #FitnessGoals',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
            likes: 89,
            comments: 24,
            shares: 7,
            timestamp: '1 day ago',
            isLiked: true
        }
    ];

    const handleAddFriend = async (id: number) => {
        setIsSending(true);
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

            setIsFriend(true)

        } catch (error) {
            console.error("Accept friend error:", error);
        }
    };
    const navigate = useNavigate()
    const handleMessage = async (id: number) => {
        try {
            const res = await fetch(`${API_MESSAGE.postroom}`, {
                method: "POST",
                credentials: "include",
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
    };

    const handleCreatePost = (): void => {
        if (newPost.trim()) {
            console.log('Creating post:', newPost);
            setNewPost('');
            setShowPostModal(false);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Section */}
            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* Cover & Avatar */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden mb-6">
                    {/* Cover Photo */}
                    <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                        <img
                            src={profile.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-8 pb-6">
                        {/* Avatar */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
                            <div className="relative">
                                <img
                                    src={friend?.avatar || "/default-avatar.png"}
                                    alt={friend?.name || "User avatar"}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                />

                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                                    <Camera className="text-white" size={18} />
                                </button>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button
                                    onClick={() => {
                                        if (friend && friend.id) {
                                            handleAddFriend(Number(friend.id));
                                        }
                                    }}

                                    disabled={isSending}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${isFriend
                                        ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                                >
                                    <UserPlus size={18} />
                                    {isFriend ? 'Friends' : 'Add Friend'}
                                </button>
                                <button
                                    onClick={() => {
                                        if (friend && friend.id) {
                                            handleMessage(Number(friend.id));
                                        }
                                    }}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 active:scale-95"
                                >
                                    <Send size={18} />
                                    Message
                                </button>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{friend?.name}</h2>
                            <p className="text-gray-700 text-lg mb-4"> {friend?.Community_Members?.[0]?.Community?.Sport?.name || "No sport"} 🎾 | Fitness lover 💪 | Always up for new adventures</p>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    {profile.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    {profile.joinedDate}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ExternalLink size={16} className="text-gray-400" />
                                    <a href={`https://${profile.website}`} className="text-blue-600 hover:underline">
                                        {profile.website}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 py-4 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{profile.posts}</p>
                                <p className="text-sm text-gray-600">Posts</p>
                            </div>
                            <div className="text-center cursor-pointer hover:bg-gray-50 rounded-lg transition-all p-2">
                                <p className="text-2xl font-bold text-gray-900">{profile.followers}</p>
                                <p className="text-sm text-gray-600">Followers</p>
                            </div>
                            <div className="text-center cursor-pointer hover:bg-gray-50 rounded-lg transition-all p-2">
                                <p className="text-2xl font-bold text-gray-900">{profile.following}</p>
                                <p className="text-sm text-gray-600">Following</p>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            {profile.interests.map((interest, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                                >
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* About Card */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">About</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Activity className="text-gray-400" size={18} />
                                    <span>Active in 4 sports groups</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Trophy className="text-gray-400" size={18} />
                                    <span>Won 3 tournaments</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Users className="text-gray-400" size={18} />
                                    <span>Member since Jan 2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Photos Card */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Photos</h3>
                                <button className="text-sm text-blue-600 hover:underline font-semibold">
                                    See all
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400',
                                    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400',
                                    'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=400',
                                    'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400',
                                    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400',
                                    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400'
                                ].map((photo, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <img
                                            src={photo}
                                            alt={`Photo ${i + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Friends Card */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Friends</h3>
                                <button className="text-sm text-blue-600 hover:underline font-semibold">
                                    See all
                                </button>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="text-center">
                                        <img
                                            src={`https://i.pravatar.cc/150?img=${i}`}
                                            alt={`Friend ${i}`}
                                            className="w-full aspect-square rounded-xl object-cover mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                                        />
                                        <p className="text-xs font-medium text-gray-900 truncate">Friend {i}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Tabs */}
                        <div className="bg-white rounded-2xl p-2 border-2 border-gray-100">
                            <div className="flex gap-2">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all capitalize ${activeTab === tab
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Create Post */}
                        {activeTab === 'posts' && (
                            <>
                                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                    <div className="flex gap-4">
                                        <img
                                            src={profile.avatar}
                                            alt={profile.name}
                                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                        />
                                        <button
                                            onClick={() => setShowPostModal(true)}
                                            className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-all"
                                        >
                                            What's on your mind, {profile.name.split(' ')[0]}?
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-all text-gray-700">
                                            <Image size={20} className="text-green-500" />
                                            <span className="font-semibold text-sm">Photo</span>
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-all text-gray-700">
                                            <Video size={20} className="text-red-500" />
                                            <span className="font-semibold text-sm">Video</span>
                                        </button>
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg transition-all text-gray-700">
                                            <Smile size={20} className="text-yellow-500" />
                                            <span className="font-semibold text-sm">Feeling</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Posts Feed */}
                                {posts.map((post) => (
                                    <article key={post.id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                                        {/* Post Header */}
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-3">
                                                    <img
                                                        src={profile.avatar}
                                                        alt={profile.name}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{profile.name}</h4>
                                                        <p className="text-sm text-gray-600">{post.timestamp}</p>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreHorizontal size={20} className="text-gray-600" />
                                                </button>
                                            </div>
                                            <p className="text-gray-900 leading-relaxed">{post.content}</p>
                                        </div>

                                        {/* Post Image */}
                                        {post.image && (
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="w-full max-h-96 object-cover"
                                            />
                                        )}

                                        {/* Post Stats */}
                                        <div className="px-6 py-3 flex items-center justify-between text-sm text-gray-600 border-t border-gray-100">
                                            <span>{post.likes} likes</span>
                                            <div className="flex gap-4">
                                                <span>{post.comments} comments</span>
                                                <span>{post.shares} shares</span>
                                            </div>
                                        </div>

                                        {/* Post Actions */}
                                        <div className="px-6 pb-4 flex items-center gap-2 border-t border-gray-100 pt-2">
                                            <button className={`flex-1 py-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold ${post.isLiked ? 'text-red-600' : 'text-gray-700'
                                                }`}>
                                                <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                                                Like
                                            </button>
                                            <button className="flex-1 py-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-gray-700">
                                                <MessageCircle size={20} />
                                                Comment
                                            </button>
                                            <button className="flex-1 py-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-gray-700">
                                                <Share2 size={20} />
                                                Share
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </>
                        )}

                        {/* Other Tabs Content */}
                        {activeTab !== 'posts' && (
                            <div className="bg-white rounded-2xl p-12 border-2 border-gray-100 text-center">
                                <p className="text-gray-500 text-lg">Content for {activeTab} tab</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {
                showPostModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
                            {/* Header */}
                            <div className="p-6 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900">Create Post</h3>
                                <button
                                    onClick={() => setShowPostModal(false)}
                                    className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all"
                                >
                                    <span className="text-2xl text-gray-500">×</span>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="flex gap-3 mb-4">
                                    <img
                                        src={profile.avatar}
                                        alt={profile.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{profile.name}</p>
                                        <select className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                                            <option>Public</option>
                                            <option>Friends</option>
                                            <option>Only me</option>
                                        </select>
                                    </div>
                                </div>

                                <textarea
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder={`What's on your mind, ${profile.name.split(' ')[0]}?`}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 resize-none transition-all"
                                    rows={6}
                                />

                                <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Add to your post</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all">
                                            <Image size={24} className="text-green-500 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all">
                                            <Video size={24} className="text-red-500 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all">
                                            <Smile size={24} className="text-yellow-500 mx-auto" />
                                        </button>
                                        <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all">
                                            <MapPin size={24} className="text-blue-500 mx-auto" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t">
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPost.trim()}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default GetUserProfilePage;