import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart, MapPin } from 'lucide-react';
import type { Locations } from "../model/locations";
import API_call from '../hooks/api_call';
import api_location from '../services/localtion';
import API_USER from '../services/user';
import { useNavigate } from 'react-router-dom';
import type { Sport } from '../model/Sport';
import API_SPORT from '../services/sport';

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        location_id: '',
        sport_id: ''
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const navigate = useNavigate()

    const [location, setLocations] = useState<Locations[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(api_location.getlocation);
            setLocations(data.data);
        };

        fetchData();
    }, []);
    const [sport, setSport] = useState<Sport[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(API_SPORT.sports);
            setSport(data.data);
        };
        fetchData()
    }, [])
    const handleSubmit = async () => {
        if (!agreeTerms) {
            alert("You must agree to the Terms and Privacy Policy");
            return;
        }

        const { name, email, password, confirmPassword, location_id, sport_id } = formData;
        console.log("sport Id là: ", sport_id)
        if (!name || !email || !password || !confirmPassword || !location_id || !sport_id) {
            alert("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(API_USER.register, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    location_id: Number(location_id), // 🔥 convert string → number
                    sport_id: Number(location_id),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Register failed");
                return;
            }

            navigate("/login");

        } catch (error) {
            console.error("Register error:", error);
            alert("Server error");
        } finally {
            setLoading(false); // 🔥 kết thúc loading (LUÔN chạy)
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
            {/* MAIN WRAPPER */}
            <div className="flex w-[95%] min-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl">

                {/* ================= LEFT: REGISTER FORM ================= */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-gray-900 mb-3" >
                                Create Account
                            </h2>
                            <p className="text-gray-600 text-lg">
                                Join our community today
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-5">

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl
                                           focus:outline-none focus:border-purple-500
                                           focus:ring-4 focus:ring-purple-50 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl
                                           focus:outline-none focus:border-purple-500
                                           focus:ring-4 focus:ring-purple-50 transition-all"
                                    />
                                </div>
                            </div>
                            {/* City/Location Select */}
                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                    <select
                                        id="city"
                                        value={formData.location_id}
                                        onChange={(e) => handleChange('location_id', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all appearance-none bg-white cursor-pointer"
                                    >
                                        <option value="">Select your city</option>
                                        {
                                            location && location.map((item, index) => (
                                                <option key={index} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="sport"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                    Sport
                                </label>

                                <div className="relative">
                                    {/* Icon */}
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 3v18M19 3v18M9 7h6M9 17h6"
                                        />
                                    </svg>

                                    <select
                                        id="sport"
                                        value={formData.sport_id}
                                        onChange={(e) => handleChange('sport_id', (e.target.value))}
                                        disabled={!sport || sport.length === 0}
                                        className="
        w-full
        pl-12 pr-10 py-3.5
        border-2 border-gray-200
        rounded-xl
        bg-white
        text-gray-800
        cursor-pointer
        appearance-none
        transition-all
        focus:outline-none
        focus:border-purple-500
        focus:ring-4 focus:ring-purple-50
        disabled:bg-gray-100
        disabled:cursor-not-allowed
      "
                                    >
                                        <option value="" disabled>
                                            Select your sport
                                        </option>

                                        {sport?.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Arrow */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => handleChange('password', e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl
                                           focus:outline-none focus:border-purple-500
                                           focus:ring-4 focus:ring-purple-50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl
                                           focus:outline-none focus:border-purple-500
                                           focus:ring-4 focus:ring-purple-50 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-3 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span>
                                    I agree to the{' '}
                                    <span className="font-semibold text-purple-600">Terms of Service</span> and{' '}
                                    <span className="font-semibold text-purple-600">Privacy Policy</span>
                                </span>
                            </label>

                            {/* Button */}

                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600
                                   text-white py-4 rounded-xl font-semibold
                                   hover:from-blue-700 hover:to-purple-700
                                   transition-all shadow-lg hover:shadow-xl
                                   flex items-center justify-center gap-2 group"
                            >
                                {loading ? "Creating..." : "Create Account"}
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Footer */}
                            <p className="text-center text-gray-600 pt-4">
                                Already have an account?{' '}
                                <span className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer">
                                    Sign in
                                </span>
                            </p>

                        </div>
                    </div>
                </div>

                {/* ================= RIGHT: IMAGE & BENEFITS ================= */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-purple-600 to-pink-600">
                    <img
                        src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200"
                        alt="Community"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>

                    <div className="absolute inset-0 flex flex-col justify-between p-12 text-white">

                        {/* Top */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                    <Heart className="text-pink-600" size={24} fill="currentColor" />
                                </div>
                                <span className="text-2xl font-bold">Join Us</span>
                            </div>
                            <p className="text-white/80 text-sm">
                                Start your journey today
                            </p>
                        </div>

                        {/* Middle */}
                        <div>
                            <h1 className="text-5xl font-bold leading-tight mb-8">
                                Discover a community built for you
                            </h1>
                        </div>

                        {/* Bottom */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                                <p className="text-3xl font-bold">10K+</p>
                                <p className="text-sm text-white/70">Members</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                                <p className="text-3xl font-bold">500+</p>
                                <p className="text-sm text-white/70">Events</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                                <p className="text-3xl font-bold">50+</p>
                                <p className="text-sm text-white/70">Cities</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    );
};

export default RegisterPage;