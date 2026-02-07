import React, { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, Calendar, ExternalLink, Edit, MoreHorizontal, Heart, MessageCircle, Share2, Image, Video, Smile, Users, Trophy, Activity } from 'lucide-react';
import type { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import type { Locations } from '../model/locations';
import API_call from '../hooks/api_call';
import api_location from '../services/localtion';
import type { Sport } from '../model/user';
import API_SPORT from '../services/sport';
import API_USER from '../services/user';
import { updateAvatar } from '../store/slices/userSlice';

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

const ProfilePage: React.FC = () => {

    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');


    const [newPost, setNewPost] = useState<string>('');
    const [showPostModal, setShowPostModal] = useState(false);
    // lấy user
    const users = useSelector(
        (state: RootState) => state.user.user
    );

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

    const handleCreatePost = (): void => {
        if (newPost.trim()) {
            console.log('Creating post:', newPost);
            setNewPost('');
            setShowPostModal(false);
        }
    };

    // edit profile
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [location, setLocations] = useState<Locations[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(api_location.getlocation);
            setLocations(data.data);
        };

        fetchData();
    }, []);
    const [editForm, setEditForm] = useState({
        name: users?.name ?? '',
        locationId: null as number | null,
        sportId: null as number | null,
    });

    const [sport, setSport] = useState<Sport[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(API_SPORT.sports);
            setSport(data.data);
        };
        fetchData()
    }, [])
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setAvatarFile(file);
        setAvatarPreview(previewUrl);
    };
    const dispatch = useDispatch();
    const handleSaveProfile = async () => {
        if (!users) return;

        const formData = new FormData();

        formData.append("name", editForm.name);
        if (editForm.locationId)
            formData.append("location_id", String(editForm.locationId));
        if (editForm.sportId)
            formData.append("sport_id", String(editForm.sportId));

        // ✅ gửi avatar nếu có
        if (avatarFile) {
            formData.append("avatar", avatarFile);
        }
        console.log("avatar là : ", avatarFile)
        try {
            const res = await fetch(
                `${API_USER.updateProfile}`, {

                method: "PUT",
                credentials: "include", // ⭐ QUAN TRỌNG
                body: (formData),
            }
            );

            const data = await res.json();
            if (data?.data?.avatar) {
                dispatch(updateAvatar(data.data.avatar));
            }
            if (!res.ok) {
                throw new Error(data.message || "Update profile failed");
            }

            console.log("Profile updated successfully", data);

            // ✅ TODO: cập nhật Redux (rất quan trọng)
            // dispatch(updateUser(data.user));

            setShowEditProfile(false);
        } catch (error) {
            console.error("Update profile failed", error);
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
                        <button className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl font-semibold hover:bg-white transition-all flex items-center gap-2">
                            <Camera size={18} />
                            Edit Cover
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-8 pb-6">
                        {/* Avatar */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
                            <div className="relative">
                                <img
                                    src={users?.avatar || "/default-avatar.png"}
                                    alt={users?.name || "User avatar"}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                                />

                                <button className="absolute bottom-2 right-2 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                                    <Camera className="text-white" size={18} />
                                </button>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0">
                                <button
                                    onClick={() => setShowEditProfile(true)}
                                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
                                >
                                    <Edit size={18} />
                                    Edit Profile
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                                        className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-900 transition-all"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {showMoreMenu && (
                                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg z-50">
                                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Change password
                                            </button>
                                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
                                                Settings
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{users?.name}</h2>
                            <p className="text-gray-700 text-lg mb-4"> {users?.Community_Members?.[0]?.Community?.Sport?.name || "No sport"} 🎾 | Fitness lover 💪 | Always up for new adventures</p>

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
            {showPostModal && (
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
            )}
            {showEditProfile && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

                        {/* Header với Gradient */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Edit className="text-white" size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                                </div>
                                <button
                                    onClick={() => setShowEditProfile(false)}
                                    className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 group"
                                >
                                    <span className="text-2xl text-white group-hover:rotate-90 transition-transform duration-200">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto flex-1">

                            {/* Avatar Upload Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Camera size={14} className="text-blue-600" />
                                    </div>
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="relative group">
                                        <img
                                            src={avatarPreview || users?.avatar || "/default-avatar.png"}
                                            alt="Avatar"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg transition-all duration-200 group-hover:border-blue-400"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-200 shadow-lg hover:scale-110"
                                        >
                                            <Camera size={18} />
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all duration-200 mb-2"
                                        >
                                            Upload Photo
                                        </button>
                                        <p className="text-xs text-gray-500">JPG or PNG. Max size 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Photo Section */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Image size={14} className="text-purple-600" />
                                    </div>
                                    Cover Photo
                                </label>
                                <div className="relative h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl overflow-hidden group shadow-lg">
                                    <img
                                        src={profile.coverImage}
                                        alt="Cover"
                                        className="w-full h-full object-cover"
                                    />
                                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all duration-200">
                                        <div className="text-center text-white transform group-hover:scale-105 transition-transform duration-200">
                                            <Camera className="mx-auto mb-2" size={28} />
                                            <span className="text-sm font-semibold">Change Cover Photo</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <Users size={16} className="text-gray-500" />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-500" />
                                        Location
                                    </label>
                                    {location && location.length > 0 && (
                                        <div className="relative">
                                            <select
                                                value={editForm.locationId ?? ''}
                                                onChange={(e) => setEditForm({ ...editForm, locationId: Number(e.target.value) })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 appearance-none cursor-pointer bg-white"
                                            >
                                                <option value="">Select your location</option>
                                                {location.map((loc) => (
                                                    <option key={loc.id} value={loc.id}>
                                                        {loc.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Interests/Sports */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <Activity size={16} className="text-gray-500" />
                                        Interests & Sports
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {sport.map((s) => {
                                            const isSelected = selectedSportId === s.id;
                                            return (
                                                <button
                                                    key={s.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedSportId(s.id);
                                                        setEditForm({ ...editForm, sportId: s.id });
                                                    }}
                                                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${isSelected
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                                        }`}
                                                >
                                                    {s.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Fixed at bottom */}
                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowEditProfile(false)}
                                className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
                            >
                                Save Changes
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div >
    );
};

export default ProfilePage;