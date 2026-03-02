import React, { useEffect, useRef, useState } from 'react';
import { Camera, MapPin, ExternalLink, Edit, MoreHorizontal, Heart, MessageCircle, Image, Video, Smile, Trophy, Activity } from 'lucide-react';
import type { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import type { Locations } from '../model/locations';
import API_call from '../hooks/api_call';
import api_location from '../services/localtion';
import type { Sport } from '../model/user';
import API_SPORT from '../services/sport';
import API_USER from '../services/user';
import { updateAvatar } from '../store/slices/userSlice';

// ===================== INTERFACES =====================
interface CommunityPost {
    id: number;
    content: string;
    post_type: 'log' | 'question' | 'share';
    created_at: string;
    images?: { id: number; image_url: string }[];
}

interface UserProfile {
    coverImage: string;
    location: string;
    website: string;
    followers: number;
    following: number;
}

type ProfileTab = 'posts' | 'about' | 'friends' | 'photos';
const TABS: ProfileTab[] = ['posts', 'about', 'friends', 'photos'];

// ===================== HELPER =====================
const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
};

// ===================== COMPONENT =====================
const ProfilePage: React.FC = () => {

    const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
    const [newPost, setNewPost] = useState<string>('');
    const [showPostModal, setShowPostModal] = useState<boolean>(false);
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
    const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

    // Posts từ API
    const [apiPosts, setApiPosts] = useState<CommunityPost[]>([]);
    const [loadingPosts, setLoadingPosts] = useState<boolean>(false);

    // Location & Sport
    const [location, setLocations] = useState<Locations[]>([]);
    const [sport, setSport] = useState<Sport[]>([]);
    const [selectedSportId, setSelectedSportId] = useState<number | null>(null);

    // Avatar
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    // Edit form
    const [editForm, setEditForm] = useState({
        name: '',
        locationId: null as number | null,
        sportId: null as number | null,
    });

    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.user.user);

    const profile: UserProfile = {
        coverImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1200',
        location: users?.Community_Members?.[0]?.Community?.Location?.name || 'Chưa cập nhật',
        website: 'www.example.com',
        followers: 1234,
        following: 567,
    };

    // Sync editForm.name khi users load xong
    useEffect(() => {
        if (users?.name) {
            setEditForm(prev => ({ ...prev, name: users.name ?? '' }));
        }
    }, [users]);

    // Fetch locations
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(api_location.getlocation);
            setLocations(data.data);
        };
        fetchData();
    }, []);

    // Fetch sports
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(API_SPORT.sports);
            setSport(data.data);
        };
        fetchData();
    }, []);

    // Fetch posts của user
    useEffect(() => {
        const fetchPosts = async () => {
            setLoadingPosts(true);
            try {
                const res = await fetch(API_USER.homeUser, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });
                const data = await res.json();
                if (res.ok) {
                    setApiPosts(data.data || []);
                }
            } catch (err) {
                console.error('Fetch posts error:', err);
            } finally {
                setLoadingPosts(false);
            }
        };
        fetchPosts();
    }, []);

    const handleCreatePost = (): void => {
        if (newPost.trim()) {
            console.log('Creating post:', newPost);
            setNewPost('');
            setShowPostModal(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async (): Promise<void> => {
        if (!users) return;
        const formData = new FormData();
        formData.append('name', editForm.name);
        if (editForm.locationId) formData.append('location_id', String(editForm.locationId));
        if (editForm.sportId) formData.append('sport_id', String(editForm.sportId));
        if (avatarFile) formData.append('avatar', avatarFile);

        try {
            const res = await fetch(API_USER.updateProfile, {
                method: 'PUT',
                credentials: 'include',
                body: formData,
            });
            const data = await res.json();
            if (data?.data?.avatar) dispatch(updateAvatar(data.data.avatar));
            if (!res.ok) throw new Error(data.message || 'Update profile failed');
            setShowEditProfile(false);
        } catch (error) {
            console.error('Update profile failed', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-8">

                {/* ===== COVER & AVATAR ===== */}
                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden mb-6">
                    <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600">
                        <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                        <button className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl font-semibold hover:bg-white transition-all flex items-center gap-2">
                            <Camera size={18} />
                            Edit Cover
                        </button>
                    </div>

                    <div className="relative px-8 pb-6">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-4">
                            <div className="relative">
                                <img
                                    src={users?.avatar || '/default-avatar.png'}
                                    alt={users?.name || 'User'}
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
                                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Change password</button>
                                            <button className="w-full px-4 py-2 text-left hover:bg-gray-100">Settings</button>
                                            <button className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50">Logout</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">{users?.name}</h2>
                            <p className="text-gray-700 text-lg mb-4">
                                {users?.Community_Members?.[0]?.Community?.Sport?.name || 'No sport'} 🎾 | Fitness lover 💪 | Always up for new adventures
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-400" />
                                    {profile.location}
                                </div>

                                <div className="flex items-center gap-2">
                                    <ExternalLink size={16} className="text-gray-400" />
                                    <a href={`https://${profile.website}`} className="text-blue-600 hover:underline">{profile.website}</a>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6 py-4 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{apiPosts.length}</p>
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

                        {/* Interests từ API */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            {users?.Community_Members?.map((m, idx) =>
                                m.Community?.Sport?.name ? (
                                    <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                                        {m.Community.Sport.name}
                                    </span>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>

                {/* ===== MAIN CONTENT ===== */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">About</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Activity className="text-gray-400" size={18} />
                                    <span>Active in {users?.Community_Members?.length || 0} sports groups</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Trophy className="text-gray-400" size={18} />
                                    <span>Won 3 tournaments</span>
                                </div>
                            </div>
                        </div>

                        {/* Photos từ posts */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Photos</h3>
                                <button className="text-sm text-blue-600 hover:underline font-semibold">See all</button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {apiPosts
                                    .filter(p => p.images && p.images.length > 0)
                                    .slice(0, 6)
                                    .map((post, i) => (
                                        <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                            <img src={post.images![0].image_url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                {apiPosts.filter(p => p.images && p.images.length > 0).length === 0 && (
                                    <p className="col-span-3 text-sm text-gray-400 text-center py-4">No photos yet</p>
                                )}
                            </div>
                        </div>

                        {/* Friends */}
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-gray-900">Friends</h3>
                                <button className="text-sm text-blue-600 hover:underline font-semibold">See all</button>
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
                                        className={`flex-1 py-3 rounded-xl font-semibold transition-all capitalize ${activeTab === tab ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeTab === 'posts' && (
                            <>
                                {/* Create Post Box */}
                                <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                                    <div className="flex gap-4">
                                        <img
                                            src={users?.avatar || '/default-avatar.png'}
                                            alt={users?.name || 'User'}
                                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                                        />
                                        <button
                                            onClick={() => setShowPostModal(true)}
                                            className="flex-1 text-left px-4 py-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-all"
                                        >
                                            What's on your mind, {users?.name?.split(' ')[0]}?
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

                                {/* Loading */}
                                {loadingPosts && (
                                    <div className="bg-white rounded-2xl p-12 border-2 border-gray-100 flex justify-center">
                                        <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
                                    </div>
                                )}

                                {/* Empty */}
                                {!loadingPosts && apiPosts.length === 0 && (
                                    <div className="bg-white rounded-2xl p-12 border-2 border-gray-100 text-center">
                                        <p className="text-gray-400 text-lg">Chưa có bài viết nào</p>
                                    </div>
                                )}

                                {/* Posts Feed */}
                                {!loadingPosts && apiPosts.map((post) => (
                                    <article key={post.id} className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-3">
                                                    <img
                                                        src={users?.avatar || '/default-avatar.png'}
                                                        alt={users?.name || 'User'}
                                                        className="w-12 h-12 rounded-full object-cover"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{users?.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm text-gray-500">{formatDate(post.created_at)}</p>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.post_type === 'log'
                                                                ? 'bg-green-100 text-green-600'
                                                                : post.post_type === 'question'
                                                                    ? 'bg-blue-100 text-blue-600'
                                                                    : 'bg-purple-100 text-purple-600'
                                                                }`}>
                                                                {post.post_type}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                                    <MoreHorizontal size={20} className="text-gray-600" />
                                                </button>
                                            </div>
                                            <p className="text-gray-900 leading-relaxed">{post.content}</p>
                                        </div>

                                        {post.images && post.images.length > 1 && (
                                            <div className="grid grid-cols-2 gap-2 p-2">
                                                {post.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="relative overflow-hidden rounded-2xl group">
                                                        <img
                                                            src={img.image_url}
                                                            alt={`Post image ${imgIndex + 1}`}
                                                            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = "/no-image.png";
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="px-6 pb-4 flex items-center gap-2 border-t border-gray-100 pt-3 mt-2">
                                            <button className="flex-1 py-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-gray-700">
                                                <Heart size={20} />
                                                Like
                                            </button>
                                            <button className="flex-1 py-2.5 hover:bg-gray-50 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-gray-700">
                                                <MessageCircle size={20} />
                                                Comment
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </>
                        )}

                        {activeTab !== 'posts' && (
                            <div className="bg-white rounded-2xl p-12 border-2 border-gray-100 text-center">
                                <p className="text-gray-500 text-lg">Content for {activeTab} tab</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== CREATE POST MODAL ===== */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl">
                        <div className="p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900">Create Post</h3>
                            <button onClick={() => setShowPostModal(false)} className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all">
                                <span className="text-2xl text-gray-500">×</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-3 mb-4">
                                <img src={users?.avatar || '/default-avatar.png'} alt={users?.name || 'User'} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-gray-900">{users?.name}</p>
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
                                placeholder={`What's on your mind, ${users?.name?.split(' ')[0]}?`}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 resize-none transition-all"
                                rows={6}
                            />
                            <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl">
                                <p className="text-sm font-semibold text-gray-700 mb-3">Add to your post</p>
                                <div className="flex gap-2">
                                    <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all"><Image size={24} className="text-green-500 mx-auto" /></button>
                                    <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all"><Video size={24} className="text-red-500 mx-auto" /></button>
                                    <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all"><Smile size={24} className="text-yellow-500 mx-auto" /></button>
                                    <button className="flex-1 p-3 hover:bg-gray-100 rounded-lg transition-all"><MapPin size={24} className="text-blue-500 mx-auto" /></button>
                                </div>
                            </div>
                        </div>
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

            {/* ===== EDIT PROFILE MODAL ===== */}
            {showEditProfile && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                        <Edit className="text-white" size={20} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Edit Profile</h3>
                                </div>
                                <button onClick={() => setShowEditProfile(false)} className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 group">
                                    <span className="text-2xl text-white group-hover:rotate-90 transition-transform duration-200">×</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {/* Avatar Upload */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Profile Picture</label>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <img
                                            src={avatarPreview || users?.avatar || '/default-avatar.png'}
                                            alt="Avatar"
                                            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                                        />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg">
                                            <Camera size={18} />
                                        </button>
                                        <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                    </div>
                                    <div className="flex-1">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all mb-2">
                                            Upload Photo
                                        </button>
                                        <p className="text-xs text-gray-500">JPG or PNG. Max size 5MB</p>
                                    </div>
                                </div>
                            </div>

                            {/* Cover Photo */}
                            <div className="mb-8">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Cover Photo</label>
                                <div className="relative h-40 rounded-xl overflow-hidden group shadow-lg">
                                    <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
                                    <button className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-all">
                                        <div className="text-center text-white">
                                            <Camera className="mx-auto mb-2" size={28} />
                                            <span className="text-sm font-semibold">Change Cover Photo</span>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                    {location.length > 0 && (
                                        <div className="relative">
                                            <select
                                                value={editForm.locationId ?? ''}
                                                onChange={(e) => setEditForm({ ...editForm, locationId: Number(e.target.value) })}
                                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer bg-white"
                                            >
                                                <option value="">Select your location</option>
                                                {location.map((loc) => (
                                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
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

                                {/* Sports */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Interests & Sports</label>
                                    <div className="flex flex-wrap gap-2">
                                        {sport.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => { setSelectedSportId(s.id); setEditForm({ ...editForm, sportId: s.id }); }}
                                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${selectedSportId === s.id
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                                                    }`}
                                            >
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3 flex-shrink-0">
                            <button onClick={() => setShowEditProfile(false)} className="flex-1 py-3.5 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-white hover:border-gray-400 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleSaveProfile} className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;