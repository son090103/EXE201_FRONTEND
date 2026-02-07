import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Clock, Image as ImageIcon, X, DollarSign, Globe, Lock, Award, Info, Plus } from 'lucide-react';
import API_call from '../hooks/api_call';
import API_SPORT from '../services/sport';
import type { Sport } from '../model/user';
import API_community from '../services/community';

interface EventFormData {
    title: string;
    description: string;
    category: string;
    registrationStartDate: string;   // Ngày mở đăng ký
    registrationEndDate: string;     // Ngày kết thúc đăng ký
    startDate: string;               // Ngày sự kiện bắt đầu
    endDate: string;                 // Ngày sự kiện kết thúc
    time: string;
    location: string;
    city: string;
    maxParticipants: string;
    price: string;
    privacy: 'public' | 'private' | 'friends';
    images: File[];
    imagePreviews: string[];
}

const CreateEventPage: React.FC = () => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [formData, setFormData] = useState<EventFormData>({
        title: '',
        description: '',
        category: '',
        registrationStartDate: '',
        registrationEndDate: '',
        startDate: '',
        endDate: '',
        time: '',
        location: '',
        city: '',
        maxParticipants: '',
        price: '',
        privacy: 'public',
        images: [],
        imagePreviews: [],
    });

    // const categories = [
    //     { id: 'tennis', name: 'Tennis', icon: '🎾' },
    //     { id: 'basketball', name: 'Basketball', icon: '🏀' },
    //     { id: 'football', name: 'Football', icon: '⚽' },
    //     { id: 'swimming', name: 'Swimming', icon: '🏊' },
    //     { id: 'yoga', name: 'Yoga', icon: '🧘' },
    //     { id: 'running', name: 'Running', icon: '🏃' },
    //     { id: 'gym', name: 'Gym', icon: '💪' },
    //     { id: 'cycling', name: 'Cycling', icon: '🚴' },
    // ];
    const [categories, setCategories] = useState<Sport[]>([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await API_call(API_SPORT.sports);
            setCategories(data.data);
        };
        fetchData()
    }, [])
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);
        const validFiles = files.filter((file) => file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024);

        if (validFiles.length === 0) {
            alert('Please select valid image files (max 10MB each)');
            return;
        }

        const currentCount = formData.imagePreviews.length;
        const canAdd = Math.min(validFiles.length, 5 - currentCount);

        if (canAdd === 0) {
            alert('Maximum 5 images allowed');
            return;
        }

        const newImages = validFiles.slice(0, canAdd);
        const newPreviews = newImages.map((file) => URL.createObjectURL(file));

        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
            imagePreviews: [...prev.imagePreviews, ...newPreviews],
        }));

        e.target.value = '';
    };

    useEffect(() => {
        return () => {
            formData.imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [formData.imagePreviews]);
    const combineDateTime = (date?: string, time?: string): string => {
        return date && time ? `${date}T${time}:00` : "";
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();

            formDataToSend.append('category', formData.category);
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);

            formDataToSend.append(
                'registration_start_date',
                combineDateTime(formData.registrationStartDate, '00:00')
            );

            formDataToSend.append(
                'registration_end_date',
                combineDateTime(formData.registrationEndDate, '23:59')
            );

            formDataToSend.append(
                'start_date',
                combineDateTime(formData.startDate, formData.time)
            );

            formDataToSend.append(
                'end_date',
                combineDateTime(formData.endDate, formData.time)
            );

            formDataToSend.append('location', formData.location);
            formDataToSend.append('city', formData.city);

            if (formData.maxParticipants) {
                formDataToSend.append('max_participants', formData.maxParticipants);
            }

            formDataToSend.append('privacy', formData.privacy);

            formData.images.forEach(file => {
                formDataToSend.append('images', file);
            });

            await fetch(API_community.postEvent, {
                method: "POST",
                credentials: "include",
                body: formDataToSend,
            });

            alert('🎉 Event published successfully!');
        } catch (err) {
            console.error(err);
            alert('❌ Failed to create event');
        }
    };



    // Validation
    const isStep1Valid = formData.title.trim() && formData.category && formData.description.trim();
    const isStep2Valid =
        formData.registrationStartDate &&
        formData.registrationEndDate &&
        formData.startDate &&
        formData.endDate &&
        formData.time &&
        formData.location.trim() &&
        formData.city.trim() &&
        new Date(formData.registrationEndDate) >= new Date(formData.registrationStartDate) &&
        new Date(formData.endDate) >= new Date(formData.startDate);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {s}
                                    </div>
                                    <div className="ml-3 hidden md:block">
                                        <p className={`text-sm font-semibold ${step >= s ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {s === 1 && 'Basic Info'}
                                            {s === 2 && 'Event Dates & Location'}
                                            {s === 3 && 'Review & Publish'}
                                        </p>
                                    </div>
                                </div>
                                {s < 3 && (
                                    <div
                                        className={`w-24 h-1 mx-4 rounded ${step > s ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">Create New Event</h2>
                        <p className="text-blue-100">
                            {step === 1 && "Let's start with the basics"}
                            {step === 2 && 'Set event dates, registration period and location'}
                            {step === 3 && 'Review and publish your event'}
                        </p>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Basic Info */}
                        {step === 1 && (
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g., Weekend Tennis Tournament"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Sport Category *</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setFormData({ ...formData, category: String(cat.id) })}
                                                className={`p-4 rounded-xl border-2 transition-all ${formData.category === String(cat.id)
                                                    ? 'border-blue-600 bg-blue-50 shadow-md'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {/* <div className="text-3xl mb-2">{cat.icon}</div> */}
                                                <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Tell people what your event is about..."
                                        rows={5}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 resize-none transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500 characters</p>
                                </div>

                                {/* Multiple Images Upload */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Event Cover Images (up to 5)
                                    </label>

                                    {formData.imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                            {formData.imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newImages = formData.images.filter((_, i) => i !== index);
                                                            const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
                                                            setFormData({ ...formData, images: newImages, imagePreviews: newPreviews });
                                                        }}
                                                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-90 hover:opacity-100 transition-all shadow-lg hover:bg-red-600 transform hover:scale-110"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <label className="block w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-all cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center h-full">
                                                <ImageIcon className="text-gray-400 mb-4" size={56} />
                                                <p className="text-gray-700 font-semibold mb-2">Click or drag to upload cover images</p>
                                                <p className="text-sm text-gray-500">PNG, JPG, up to 10MB each — multiple allowed</p>
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                    {formData.imagePreviews.length > 0 && formData.imagePreviews.length < 5 && (
                                        <label className="inline-flex items-center gap-2 px-5 py-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors cursor-pointer font-medium">
                                            <Plus size={20} />
                                            Add More Images
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Dates & Location */}
                        {step === 2 && (
                            <div className="space-y-8">
                                {/* Registration Period */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Registration Period</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Registration Opens *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    value={formData.registrationStartDate}
                                                    onChange={(e) => setFormData({ ...formData, registrationStartDate: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Registration Closes *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    value={formData.registrationEndDate}
                                                    onChange={(e) => setFormData({ ...formData, registrationEndDate: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                                    min={formData.registrationStartDate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Dates */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-gray-900">Event Dates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Event Start Date *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Event End Date *</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                                    min={formData.startDate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Time */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Event Time *</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Location & City */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Location *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="e.g., My Khe Beach"
                                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                placeholder="e.g., Da Nang"
                                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Max Participants & Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Max Participants</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                            <input
                                                type="number"
                                                min="1"
                                                value={formData.maxParticipants}
                                                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                                                placeholder="e.g., 50 (leave blank for unlimited)"
                                                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Privacy */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Event Privacy</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setFormData({ ...formData, privacy: 'public' })}
                                            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center ${formData.privacy === 'public' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Globe className={`mb-2 ${formData.privacy === 'public' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                                            <p className="font-semibold text-gray-900">Public</p>
                                            <p className="text-xs text-gray-600 text-center mt-1">Anyone can see and join</p>
                                        </button>

                                        <button
                                            onClick={() => setFormData({ ...formData, privacy: 'friends' })}
                                            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center ${formData.privacy === 'friends' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Users className={`mb-2 ${formData.privacy === 'friends' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                                            <p className="font-semibold text-gray-900">Friends Only</p>
                                            <p className="text-xs text-gray-600 text-center mt-1">Only friends can join</p>
                                        </button>

                                        <button
                                            onClick={() => setFormData({ ...formData, privacy: 'private' })}
                                            className={`p-5 rounded-xl border-2 transition-all flex flex-col items-center ${formData.privacy === 'private' ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Lock className={`mb-2 ${formData.privacy === 'private' ? 'text-blue-600' : 'text-gray-400'}`} size={28} />
                                            <p className="font-semibold text-gray-900">Private</p>
                                            <p className="text-xs text-gray-600 text-center mt-1">Invite only</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <div className="space-y-8">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                    <div className="flex items-start gap-3">
                                        <Info className="text-blue-600 flex-shrink-0" size={24} />
                                        <div>
                                            <p className="font-semibold text-gray-900 mb-1">Review your event</p>
                                            <p className="text-sm text-gray-700">Please check all details before publishing.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Images Preview */}
                                {formData.imagePreviews.length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-lg font-bold text-gray-900">Cover Images</h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {formData.imagePreviews.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview}
                                                    alt={`Event preview ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-xl shadow-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900">{formData.title || 'Untitled Event'}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-3">
                                            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {categories.find((c) => String(c.id) === formData.category)?.name || 'Uncategorized'}
                                            </span>
                                            <span
                                                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${formData.privacy === 'public'
                                                    ? 'bg-green-100 text-green-700'
                                                    : formData.privacy === 'friends'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {formData.privacy.charAt(0).toUpperCase() + formData.privacy.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{formData.description || 'No description'}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Calendar className="text-blue-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Registration Opens</p>
                                                <p className="font-semibold text-gray-900">{formData.registrationStartDate || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Calendar className="text-purple-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Registration Closes</p>
                                                <p className="font-semibold text-gray-900">{formData.registrationEndDate || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Calendar className="text-green-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Event Starts</p>
                                                <p className="font-semibold text-gray-900">{formData.startDate || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Calendar className="text-red-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Event Ends</p>
                                                <p className="font-semibold text-gray-900">{formData.endDate || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Clock className="text-indigo-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Time</p>
                                                <p className="font-semibold text-gray-900">{formData.time || 'Not set'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <MapPin className="text-red-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Location</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formData.location || 'Not set'} {formData.city ? `, ${formData.city}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Users className="text-purple-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Max Participants</p>
                                                <p className="font-semibold text-gray-900">{formData.maxParticipants || 'Unlimited'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                                            <DollarSign className="text-yellow-600" size={20} />
                                            <div>
                                                <p className="text-xs text-gray-600">Price</p>
                                                <p className="font-semibold text-gray-900">
                                                    {formData.price ? `${formData.price} VND` : 'Free'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-8 py-6 border-t flex items-center justify-between">
                        <button
                            onClick={() => step > 1 && setStep((step - 1) as 1 | 2 | 3)}
                            disabled={step === 1}
                            className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => console.log('Saved as draft:', formData)}
                                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all"
                            >
                                Save Draft
                            </button>

                            {step < 3 ? (
                                <button
                                    onClick={() => setStep((step + 1) as 2 | 3)}
                                    disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    Continue
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Award size={20} />
                                    Publish Event
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateEventPage;