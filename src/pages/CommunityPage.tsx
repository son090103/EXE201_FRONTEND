import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Calendar, Heart, MessageCircle, Share2, MoreHorizontal, Image as ImageIcon, Video, Smile, TrendingUp, Hash, UserPlus, Zap, Sparkles, Award, Crown, Flame, ShoppingBag, Tag } from 'lucide-react';
import type { Friend } from '../model/friend';
import API_USER from '../services/user';
import API_FRIEND from '../services/friend';
import API_MESSAGE from '../services/message';
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import API_community from '../services/community';
import { Link } from 'react-router-dom';

interface Post {
    id: number;
    author: {
        name: string;
        avatar: string;
        city: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    timeAgo: string;
    activity: string;
}

interface Group {
    id: number;
    name: string;
    image: string;
    members: number;
    category: string;
    description: string;
}
type PostImage = {
    image_url: string;
};

type PostAuthor = {
    id: number;
    name: string;
    avatar: string;
};

type Post2 = {
    id: number;
    content: string;
    author: PostAuthor;
    images?: PostImage[];
};

const CommunityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'posts' | 'groups' | 'members'>('posts');
    const [newPost, setNewPost] = useState<string>('');
    const [getUsers, setGetUser] = useState<Friend[]>([])
    const [isActive, setIsActive] = useState(false)
    const [sentRequests, setSentRequests] = useState<number[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [images, setImages] = useState<File[]>([]);

    const handleRemoveImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const selectedFiles = Array.from(e.target.files);
        setImages((prev) => [...prev, ...selectedFiles]);
    };

    const users = useSelector((state: RootState) => state.user.user);
    const [showEmoji, setShowEmoji] = useState(false);

    // Static promotional ads
    const promotionalAds = [
        {
            title: "Join Premium",
            subtitle: "Get exclusive features",
            icon: Crown,
            gradient: "from-amber-400 via-yellow-500 to-orange-500",
            bgPattern: "diagonal-lines"
        },
        {
            title: "Hot Events Today",
            subtitle: "Don't miss out!",
            icon: Flame,
            gradient: "from-red-500 via-pink-500 to-rose-600",
            bgPattern: "dots"
        },
        {
            title: "Top Contributors",
            subtitle: "Monthly rewards",
            icon: Award,
            gradient: "from-purple-500 via-violet-600 to-indigo-600",
            bgPattern: "grid"
        },
        {
            title: "Boost Your Profile",
            subtitle: "Stand out in community",
            icon: Sparkles,
            gradient: "from-cyan-400 via-blue-500 to-indigo-600",
            bgPattern: "waves"
        }
    ];

    // Product advertising posters - Sports equipment
    const productAds = [
        {
            title: "Pro Pickleball Racket",
            subtitle: "Carbon Fiber • Lightweight",
            price: "1,299,000₫",
            discount: "30% OFF",
            image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800",
            gradient: "from-emerald-500 to-teal-600",
            tag: "NEW"
        },
        {
            title: "Nike Football Boots",
            subtitle: "Professional Grade",
            price: "2,599,000₫",
            discount: "25% OFF",
            image: "https://static.nike.com/a/images/f_auto/dpr_1.0,cs_srgb/w_1824,c_limit/8f414399-42c4-4e52-aa6c-e60cfb67b6ad/the-best-nike-football-boots.jpg",
            gradient: "from-blue-600 to-indigo-700",
            tag: "HOT"
        },
        {
            title: "Tennis Racket Pro",
            subtitle: "Graphite • Power Balance",
            price: "3,499,000₫",
            discount: "20% OFF",
            image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800",
            gradient: "from-orange-500 to-red-600",
            tag: "SALE"
        },
        {
            title: "Premium Basketball",
            subtitle: "Official Size • Indoor/Outdoor",
            price: "899,000₫",
            discount: "15% OFF",
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800",
            gradient: "from-purple-600 to-pink-600",
            tag: "BEST"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAdIndex((prev) => (prev + 1) % promotionalAds.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const productInterval = setInterval(() => {
            setCurrentProductIndex((prev) => (prev + 1) % productAds.length);
        }, 5000);
        return () => clearInterval(productInterval);
    }, []);

    const posts: Post[] = [
        {
            id: 1,
            author: {
                name: 'Sarah Johnson',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400',
                city: 'Hà Nội'
            },
            content: 'Just finished an amazing tennis match at the club! Looking for doubles partners this weekend. Who\'s in? 🎾',
            image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=800',
            likes: 45,
            comments: 12,
            shares: 3,
            timeAgo: '2 hours ago',
            activity: 'Tennis'
        },
        {
            id: 2,
            author: {
                name: 'Mike Chen',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
                city: 'Hồ Chí Minh'
            },
            content: 'Morning workout done! Nothing beats starting the day with a good gym session. Who else is hitting the gym today? 💪',
            image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800',
            likes: 89,
            comments: 24,
            shares: 7,
            timeAgo: '5 hours ago',
            activity: 'Gym'
        },
        {
            id: 3,
            author: {
                name: 'Emma Wilson',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400',
                city: 'Đà Nẵng'
            },
            content: 'Beach volleyball session was incredible today! The weather was perfect. Thanks everyone who joined! 🏐☀️',
            image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800',
            likes: 67,
            comments: 18,
            shares: 5,
            timeAgo: '1 day ago',
            activity: 'Volleyball'
        }
    ];

    const [viewPost, setViewPost] = useState<Post2[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await fetch(API_community.getCommunity, {
                    credentials: "include",
                });
                if (!res.ok) {
                    throw new Error("Fetch post community thất bại");
                }
                const data = await res.json();
                setViewPost(data.data || []);
            } catch (err) {
                console.error("❌ lỗi fetch post:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const trendingTopics = [
        { tag: 'WeekendTennis', posts: 234 },
        { tag: 'MorningRun', posts: 189 },
        { tag: 'YogaLife', posts: 156 },
        { tag: 'BasketballLeague', posts: 143 }
    ];

    const [group, setGroup] = useState<Group[]>([])
    const [joiningId, setJoiningId] = useState<number | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch(`${API_MESSAGE.getgroup}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!res.ok) {
                    throw new Error("Fetch group failed");
                }
                const result = await res.json();
                setGroup(result.data || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchGroups();
    }, []);

    const handleConnection = async () => {
        try {
            const response = await fetch(`${API_USER.getUser}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error fetching users:", data.message);
                return;
            }
            setGetUser(data.data)
            setIsActive(true)
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    const handleAddFriend = async (friend_id: number) => {
        try {
            const response = await fetch(`${API_FRIEND.postFriend}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ friend_id }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Add friend failed:", data.message);
                alert(`Failed to add friend: ${data.message}`);
                return;
            }
            setSentRequests(prev => [...prev, data.data.friend_id]);
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error. Please try again later.");
        }
    };

    const getGroupImage = (group: Group) => {
        if (group.image) return group.image;
        const random = Math.floor(Math.random() * 1000000);
        return `https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&h=400&rand=${random}`;
    };

    const handleJoinGroup = async (groupId: number) => {
        try {
            setJoiningId(groupId);
            const res = await fetch(`${API_MESSAGE.JoinGroup}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ chat_room_id: groupId })
            });
            const data = await res.json();
            if (!res.ok) {
                alert(data.message || "Join failed");
                return;
            }
            setGroup(prev => prev.filter(g => g.id !== groupId));
        } catch (err) {
            console.error("Join group error:", err);
        } finally {
            setJoiningId(null);
        }
    };

    const [loading, setLoading] = useState(false);
    const handlePost = async () => {
        if (!newPost.trim() && images.length === 0) {
            alert("Bài post không được rỗng");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            const locationId = users?.Community_Members?.[0]?.Community?.Location?.id;
            if (locationId !== undefined) {
                formData.append("community_id", locationId.toString());
            }
            formData.append("content", newPost);
            formData.append("post_type", "share");
            images.forEach((file) => {
                formData.append("images", file);
            });
            const res = await fetch(`${API_community.postCommunity}`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Post failed");
            }
            setNewPost("");
            setImages([]);
        } catch (err) {
            console.error("Post error:", err);
            alert("Đăng bài thất bại");
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = (postId: number) => {
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }

                @keyframes pulse-ring {
                    0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
                    50% { box-shadow: 0 0 0 15px rgba(139, 92, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
                }

                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }

                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                @keyframes gradientFlow {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    25% { transform: scale(1.2); }
                    50% { transform: scale(1); }
                }

                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }

                @keyframes glow-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
                }

                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }

                .animate-pulse-ring {
                    animation: pulse-ring 2s ease-out infinite;
                }

                .animate-shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }

                .animate-slide-up {
                    animation: slideUp 0.6s ease-out forwards;
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-scale-in {
                    animation: scaleIn 0.5s ease-out forwards;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradientFlow 6s ease infinite;
                }

                .animate-heartbeat {
                    animation: heartbeat 1s ease-in-out;
                }

                .animate-bounce-subtle {
                    animation: bounce-subtle 2s ease-in-out infinite;
                }

                .animate-glow {
                    animation: glow-pulse 2s ease-in-out infinite;
                }

                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }

                .hover-lift:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
                }

                .glass-effect {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .post-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .post-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
                }

                .text-gradient {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Pattern backgrounds */
                .bg-diagonal-lines {
                    background-image: repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                    );
                }

                .bg-dots {
                    background-image: radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .bg-grid {
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }

                .bg-waves {
                    background-image: repeating-linear-gradient(
                        0deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 11px
                    );
                }

                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
            `}</style>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-3 space-y-6 animate-slide-up">
                        <div className="glass-effect rounded-3xl p-6 shadow-xl hover-lift">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center animate-pulse-ring">
                                    <TrendingUp className="text-white" size={20} />
                                </div>
                                <h3 className="font-black text-gray-900 text-lg">Trending Topics</h3>
                            </div>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, index) => (
                                    <div
                                        key={index}
                                        className="cursor-pointer hover:bg-white/50 p-3 rounded-xl transition-all hover:scale-105 animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Hash size={16} className="text-purple-600" />
                                            <span className="font-bold text-gray-900">#{topic.tag}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 ml-6 font-semibold">{topic.posts} posts</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Promotional Ad */}
                        <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
                            {promotionalAds.map((ad, index) => {
                                const Icon = ad.icon;
                                const patternClass = `bg-${ad.bgPattern}`;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-all duration-700 ${index === currentAdIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                                    >
                                        <div className={`w-full h-full bg-gradient-to-br ${ad.gradient} ${patternClass} p-6 flex flex-col justify-between animate-gradient`}>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-2xl text-white mb-2 drop-shadow-lg">{ad.title}</h3>
                                                    <p className="text-white/90 font-semibold text-sm">{ad.subtitle}</p>
                                                </div>
                                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-float">
                                                    <Icon className="text-white" size={32} />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-black hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                                    Learn More
                                                </button>
                                                <div className="flex gap-2">
                                                    {promotionalAds.map((_, i) => (
                                                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentAdIndex ? 'w-8 bg-white' : 'w-1 bg-white/40'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Product Ad Poster */}
                        <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl animate-glow">
                            {productAds.map((product, index) => (
                                <div key={index} className={`absolute inset-0 transition-all duration-1000 ${index === currentProductIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                                    <div className={`w-full h-full bg-gradient-to-br ${product.gradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
                                        <div className="absolute inset-0 bg-dots opacity-30"></div>
                                        <div className="relative z-10">
                                            <span className="inline-block px-4 py-1.5 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-black shadow-lg animate-bounce-subtle">
                                                {product.tag}
                                            </span>
                                        </div>
                                        <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                                            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300 animate-float">
                                                <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="relative z-10 space-y-3">
                                            <div>
                                                <h4 className="text-white font-black text-xl mb-1 drop-shadow-lg">{product.title}</h4>
                                                <p className="text-white/90 text-sm font-semibold">{product.subtitle}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-white font-black text-2xl drop-shadow-lg">{product.price}</p>
                                                    <p className="text-white/90 text-xs font-bold">{product.discount}</p>
                                                </div>
                                                <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-black hover:bg-gray-100 transition-all transform hover:scale-110 shadow-xl flex items-center gap-2">
                                                    <ShoppingBag size={18} />
                                                    Shop Now
                                                </button>
                                            </div>
                                            <div className="flex gap-2 justify-center pt-2">
                                                {productAds.map((_, i) => (
                                                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentProductIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/50'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-6 space-y-6">
                        {/* Tabs */}
                        <div className="glass-effect rounded-3xl p-2 shadow-xl animate-scale-in">
                            <div className="flex gap-2">
                                <button onClick={() => setActiveTab('posts')} className={`flex-1 py-4 rounded-2xl font-black transition-all transform hover:scale-105 ${activeTab === 'posts' ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-xl' : 'text-gray-600 hover:bg-white/50'}`}>
                                    Posts
                                </button>
                                <button onClick={() => setActiveTab('groups')} className={`flex-1 py-4 rounded-2xl font-black transition-all transform hover:scale-105 ${activeTab === 'groups' ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-xl' : 'text-gray-600 hover:bg-white/50'}`}>
                                    Groups
                                </button>
                                <button onClick={() => setActiveTab('members')} className={`flex-1 py-4 rounded-2xl font-black transition-all transform hover:scale-105 ${activeTab === 'members' ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white shadow-xl' : 'text-gray-600 hover:bg-white/50'}`}>
                                    Members
                                </button>
                            </div>
                        </div>

                        {/* Create Post */}
                        {activeTab === 'posts' && (
                            <div className="glass-effect rounded-3xl p-6 shadow-xl hover-lift animate-slide-up delay-100">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-purple-200 animate-pulse-ring">
                                        {users?.avatar ? (
                                            <img src={users.avatar} alt={users.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                                <span className="text-white font-black text-xl">{users?.name?.charAt(0).toUpperCase() || "U"}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <textarea
                                            placeholder="Share your activity or thoughts..."
                                            value={newPost}
                                            onChange={(e) => setNewPost(e.target.value)}
                                            className="w-full p-5 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 resize-none transition-all bg-white/50"
                                            rows={3}
                                        />

                                        {images.length > 0 && (
                                            <div className="mt-4 grid grid-cols-3 gap-3">
                                                {images.map((file, index) => {
                                                    const previewUrl = URL.createObjectURL(file);
                                                    return (
                                                        <div key={index} className="relative rounded-2xl overflow-hidden border-2 border-gray-200 group hover-lift">
                                                            <img src={previewUrl} alt="preview" className="w-full h-32 object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(index)}
                                                                className="absolute top-2 right-2 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex gap-2">
                                                <input type="file" accept="image/*" multiple hidden ref={fileInputRef} onChange={handleSelectImages} />
                                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 hover:bg-purple-100 rounded-xl transition-all transform hover:scale-110">
                                                    <ImageIcon size={22} className="text-purple-600" />
                                                </button>
                                                <button className="p-3 hover:bg-blue-100 rounded-xl transition-all transform hover:scale-110">
                                                    <Video size={22} className="text-blue-600" />
                                                </button>
                                                <div className="relative">
                                                    <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-3 hover:bg-yellow-100 rounded-xl transition-all transform hover:scale-110">
                                                        <Smile className="text-yellow-600 w-5 h-5" />
                                                    </button>
                                                    {showEmoji && (
                                                        <div className="absolute bottom-full left-0 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden">
                                                            <EmojiPicker onEmojiClick={(emoji) => { setNewPost((prev) => prev + emoji.emoji); }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={handlePost}
                                                disabled={loading}
                                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-black hover:shadow-2xl transition-all disabled:opacity-50 transform hover:scale-105"
                                            >
                                                {loading ? "Posting..." : "Post"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Posts Feed */}
                        {activeTab === 'posts' && (
                            <div className="space-y-6">
                                {posts.map((post, index) => (
                                    <article key={post.id} className="glass-effect rounded-3xl overflow-hidden shadow-xl post-card animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-3">
                                                    <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-purple-200" />
                                                    <div>
                                                        <h4 className="font-black text-gray-900 text-lg">{post.author.name}</h4>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <MapPin size={14} className="text-purple-600" />
                                                            <span className="font-semibold">{post.author.city}</span>
                                                            <span>•</span>
                                                            <span>{post.timeAgo}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-xl transition-all transform hover:scale-110">
                                                    <MoreHorizontal size={20} className="text-gray-600" />
                                                </button>
                                            </div>

                                            <p className="text-gray-900 mb-3 leading-relaxed font-medium">{post.content}</p>
                                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full text-sm font-black">
                                                #{post.activity}
                                            </span>
                                        </div>

                                        {post.image && (
                                            <div className="relative overflow-hidden group">
                                                <img src={post.image} alt="Post" className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        )}

                                        <div className="p-6 pt-4">
                                            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                                <span className="font-bold">{post.likes + (likedPosts.has(post.id) ? 1 : 0)} likes</span>
                                                <div className="flex gap-4 font-semibold">
                                                    <span>{post.comments} comments</span>
                                                    <span>{post.shares} shares</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-200">
                                                <button onClick={() => toggleLike(post.id)} className={`flex-1 py-3 rounded-xl transition-all flex items-center justify-center gap-2 font-black transform hover:scale-105 ${likedPosts.has(post.id) ? 'bg-red-100 text-red-600 animate-heartbeat' : 'hover:bg-red-50 text-gray-700'}`}>
                                                    <Heart size={20} fill={likedPosts.has(post.id) ? "currentColor" : "none"} />
                                                    Like
                                                </button>
                                                <button className="flex-1 py-3 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-gray-700 transform hover:scale-105">
                                                    <MessageCircle size={20} />
                                                    Comment
                                                </button>
                                                <button className="flex-1 py-3 hover:bg-green-50 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-gray-700 transform hover:scale-105">
                                                    <Share2 size={20} />
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}

                                {/* Product Banner Ad between posts */}
                                <div className="glass-effect rounded-3xl overflow-hidden shadow-2xl animate-slide-up hover-lift">
                                    <div className="relative h-64 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 flex items-center justify-between overflow-hidden">
                                        <div className="absolute inset-0 bg-grid opacity-20"></div>
                                        <div className="relative z-10 flex-1">
                                            <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-black mb-4 animate-bounce-subtle">
                                                EXCLUSIVE OFFER
                                            </span>
                                            <h3 className="text-white font-black text-3xl mb-2 drop-shadow-lg">Premium Sports Gear</h3>
                                            <p className="text-white/90 font-semibold mb-4">Up to 40% OFF on all equipment</p>
                                            <button className="px-6 py-3 bg-white text-gray-900 rounded-xl font-black hover:bg-gray-100 transition-all transform hover:scale-110 shadow-2xl flex items-center gap-2">
                                                <ShoppingBag size={20} />
                                                Shop Collection
                                            </button>
                                        </div>
                                        <div className="relative z-10 hidden md:block">
                                            <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-all duration-300 animate-float">
                                                <img src="https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=800" alt="Sports equipment" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {viewPost.map((post, index) => (
                                    <article key={post.id} className="glass-effect rounded-3xl overflow-hidden shadow-xl post-card animate-slide-up" style={{ animationDelay: `${(posts.length + index) * 0.1}s` }}>
                                        <div className="p-6 pb-4">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex gap-3">
                                                    <Link to={`/user/${post.author.id}`}>
                                                        <img src={post.author.avatar} alt={post.author.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-purple-200" />
                                                    </Link>
                                                    <div>
                                                        <Link to={`/user/${post.author.id}`}>
                                                            <h4 className="font-black text-gray-900 text-lg">{post.author.name}</h4>

                                                        </Link>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <MapPin size={14} className="text-purple-600" />
                                                            <span className="font-semibold">Hà Nội</span>
                                                            <span>•</span>
                                                            <span>2 h ago</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="p-2 hover:bg-gray-100 rounded-xl transition-all transform hover:scale-110">
                                                    <MoreHorizontal size={20} className="text-gray-600" />
                                                </button>
                                            </div>

                                            <p className="text-gray-900 mb-3 leading-relaxed font-medium">{post.content}</p>
                                            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 rounded-full text-sm font-black">
                                                #football
                                            </span>
                                        </div>

                                        {post.images?.length === 1 && (
                                            <div className="relative overflow-hidden group">
                                                <img src={post.images[0].image_url} alt="Post" className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        )}

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


                                        <div className="p-6 pt-4">
                                            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                                                <span className="font-bold">89 likes</span>
                                                <div className="flex gap-4 font-semibold">
                                                    <span>3 comments</span>
                                                    <span>4 shares</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-200">
                                                <button className="flex-1 py-3 hover:bg-red-50 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-gray-700 transform hover:scale-105">
                                                    <Heart size={20} />
                                                    Like
                                                </button>
                                                <button className="flex-1 py-3 hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-gray-700 transform hover:scale-105">
                                                    <MessageCircle size={20} />
                                                    Comment
                                                </button>
                                                <button className="flex-1 py-3 hover:bg-green-50 rounded-xl transition-all flex items-center justify-center gap-2 font-black text-gray-700 transform hover:scale-105">
                                                    <Share2 size={20} />
                                                    Share
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        {/* Groups Grid */}
                        {activeTab === 'groups' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {group.map((grp, index) => (
                                    <div key={grp.id} className="glass-effect rounded-3xl overflow-hidden shadow-xl hover-lift cursor-pointer animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="relative overflow-hidden group">
                                            <img src={getGroupImage(grp)} alt={grp.name} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="font-black text-gray-900 mb-3 text-xl">{grp.name}</h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Users size={18} className="text-purple-600" />
                                                    <span className="font-bold">100+ members</span>
                                                </div>
                                                <button onClick={() => handleJoinGroup(grp.id)} disabled={joiningId === grp.id} className={`px-5 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all transform hover:scale-105 ${joiningId === grp.id ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-2xl"}`}>
                                                    <UserPlus size={18} />
                                                    {joiningId === grp.id ? "Joining..." : "Join"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Members View */}
                        {isActive && activeTab === 'members' ? (
                            getUsers && getUsers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {getUsers.map((user, index) => (
                                        <div key={user.id} className="glass-effect rounded-3xl p-6 shadow-xl hover-lift animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <div className="flex items-center gap-4">
                                                <div className="relative flex-shrink-0">
                                                    <img src={user.avatar || "/default-avatar.png"} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-200" />
                                                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-4 border-white animate-pulse-ring"></div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-lg font-black text-gray-900 truncate mb-2">{user.name}</h4>
                                                    {sentRequests.includes(user.id) ? (
                                                        <button disabled className="w-full px-4 py-3 bg-gray-900 text-white rounded-xl font-black transition-all duration-200 flex items-center justify-center gap-2">
                                                            <Zap size={18} />
                                                            Request Sent
                                                        </button>
                                                    ) : (
                                                        <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-black hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105" onClick={() => handleAddFriend(user.id)}>
                                                            <UserPlus size={18} />
                                                            Add Friend
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-effect rounded-3xl p-12 shadow-xl text-center animate-scale-in">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-float">
                                        <Users className="text-white" size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">Discover Members</h3>
                                    <p className="text-gray-600 mb-8 font-semibold">Find people who share your interests</p>
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-black hover:shadow-2xl transition-all transform hover:scale-105" onClick={handleConnection}>
                                        Connection Members
                                    </button>
                                </div>
                            )
                        ) : (
                            activeTab === 'members' && (
                                <div className="glass-effect rounded-3xl p-12 shadow-xl text-center animate-scale-in">
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center animate-float">
                                        <Users className="text-white" size={48} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-3">Discover Members</h3>
                                    <p className="text-gray-600 mb-8 font-semibold">Find people who share your interests</p>
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-black hover:shadow-2xl transition-all transform hover:scale-105" onClick={handleConnection}>
                                        Connection Members
                                    </button>
                                </div>
                            )
                        )}
                    </main>

                    {/* Right Sidebar */}
                    <aside className="lg:col-span-3 space-y-6 animate-slide-up delay-200">
                        {/* Quick Shop Banner */}
                        <div className="glass-effect rounded-3xl overflow-hidden shadow-xl hover-lift">
                            <div className="bg-gradient-to-br from-rose-500 to-orange-600 p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-dots opacity-30"></div>
                                <div className="relative z-10">
                                    <span className="inline-block px-3 py-1 bg-white text-gray-900 rounded-full text-xs font-black mb-3 animate-bounce-subtle">
                                        FLASH DEAL
                                    </span>
                                    <h3 className="text-white font-black text-xl mb-2 drop-shadow-lg">Gym Equipment</h3>
                                    <p className="text-white/90 text-sm font-semibold mb-4">Limited time offer - 50% OFF</p>
                                    <button className="w-full bg-white text-gray-900 py-2.5 rounded-xl font-black hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                                        <Tag size={16} />
                                        Grab Deal
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="glass-effect rounded-3xl p-6 shadow-xl hover-lift">
                            <h3 className="font-black text-gray-900 mb-6 text-lg">Suggested Groups</h3>
                            <div className="space-y-4">
                                {group.slice(0, 3).map((grp, index) => (
                                    <div key={grp.id} className="flex gap-3 cursor-pointer hover:bg-white/50 p-3 rounded-2xl transition-all transform hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <img src={getGroupImage(grp)} alt={grp.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-purple-200" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-sm truncate">{grp.name}</h4>
                                            <p className="text-xs text-gray-600 font-semibold">{grp.members} members</p>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full py-3 text-purple-600 font-black hover:bg-purple-50 rounded-xl transition-all transform hover:scale-105">
                                    See All
                                </button>
                            </div>
                        </div>

                        <div className="glass-effect rounded-3xl p-6 shadow-xl hover-lift">
                            <h3 className="font-black text-gray-900 mb-6 text-lg">Upcoming Events</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl hover-lift">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-purple-600" />
                                        <span className="text-xs font-black text-gray-900">Tomorrow</span>
                                    </div>
                                    <p className="text-sm font-black text-gray-900 mb-1">Tennis Tournament</p>
                                    <p className="text-xs text-gray-600 font-semibold">Hà Nội</p>
                                </div>
                                <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl hover-lift">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-blue-600" />
                                        <span className="text-xs font-black text-gray-900">This Weekend</span>
                                    </div>
                                    <p className="text-sm font-black text-gray-900 mb-1">Yoga Session</p>
                                    <p className="text-xs text-gray-600 font-semibold">Hồ Chí Minh</p>
                                </div>
                            </div>
                        </div>

                        {/* Mini Product Showcase */}
                        <div className="glass-effect rounded-3xl p-5 shadow-xl hover-lift">
                            <h4 className="font-black text-gray-900 mb-4 text-sm">Top Picks</h4>
                            <div className="space-y-3">
                                {[
                                    { name: "Yoga Mat Pro", price: "599K", img: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=200" },
                                    { name: "Water Bottle", price: "199K", img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=200" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/50 rounded-xl transition-all cursor-pointer">
                                        <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 text-xs">{item.name}</p>
                                            <p className="text-purple-600 font-black text-sm">{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;