import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, Star, Zap } from 'lucide-react';
import API_USER from '../services/user';
import { loginSuccess } from '../store/slices/userSlice';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Email và password không được để trống");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(API_USER.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            const ResponseProfile = await fetch(API_USER.profile, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const dataProfile = await ResponseProfile.json();

            if (!ResponseProfile.ok) {
                throw new Error(dataProfile.message || "Profile failed");
            }

            dispatch(loginSuccess(dataProfile.data));
            navigate("/home");
        } catch (error) {
            console.error("Login error:", error);
            alert(error instanceof Error ? error.message : "Login error");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') handleLogin();
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 shadow-2xl">
                        <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                        <p className="text-gray-700 font-semibold text-lg">Đang đăng nhập...</p>
                        <p className="text-gray-400 text-sm">Vui lòng chờ một chút</p>
                    </div>
                </div>
            )}

            {/* WRAPPER 90% */}
            <div className="flex w-[90%] mx-auto min-h-[90vh] flex-row-reverse bg-white rounded-3xl overflow-hidden shadow-2xl">

                {/* IMAGE SECTION (RIGHT) */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-700">
                    <img
                        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200"
                        alt="Sports community"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                    <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Heart className="text-purple-600" size={24} fill="currentColor" />
                                </div>
                                <span className="text-2xl font-bold">Community</span>
                            </div>
                            <p className="text-white/80 text-sm">Where passions connect</p>
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-5xl font-bold leading-tight">
                                Connect with people who share your passion
                            </h1>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Star className="text-yellow-300" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">10K+ Active Members</p>
                                        <p className="text-sm text-white/70">Join a thriving community</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Zap className="text-yellow-300" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-semibold">500+ Monthly Events</p>
                                        <p className="text-sm text-white/70">Never miss out on activities</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                            <p className="text-lg italic mb-4">
                                "This platform changed how I connect with people. Found my tennis partner in just one week!"
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
                                    alt="User"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                />
                                <div>
                                    <p className="font-semibold">Sarah Johnson</p>
                                    <p className="text-sm text-white/70">Premium Member</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LOGIN FORM (LEFT) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h2>
                            <p className="text-gray-600 text-lg">Sign in to continue your journey</p>
                        </div>

                        <div className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-60"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading}
                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700">Remember me</span>
                                </label>
                                <a className="text-sm font-semibold text-purple-600 hover:text-purple-700 cursor-pointer">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Button */}
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                Sign In
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;