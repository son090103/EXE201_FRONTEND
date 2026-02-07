
import { Users, MoveUpRight, MoveRight, MoveLeft, ChevronLeft, ChevronRight, Search, ArrowUpRight, Send } from 'lucide-react';
import { useState } from 'react';
type TabType = 'places' | 'groups' | 'suggestions';
interface Card {
    id: number;
    image: string;
    category: string;
    title: string;
}

function Home() {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const cards: Card[] = [
        {
            id: 1,
            image: './tennis.jpg',
            category: 'Tennis',
            title: 'Lorem ipsum dolor sit amet consectetur.'
        },
        {
            id: 2,
            image: './swim.jpg',
            category: 'Swimming',
            title: 'Lorem ipsum dolor sit amet consectetur.'
        },
        {
            id: 3,
            image: 'gym.jpg',
            category: 'Gym area',
            title: 'Lorem ipsum dolor sit amet consectetur.'
        },
        {
            id: 4,
            image: 'basketball.jpg',
            category: 'Basketball',
            title: 'Lorem ipsum dolor sit amet consectetur.'
        }
    ];
    const [activeTab, setActiveTab] = useState<TabType>('places');
    const tabs = [
        { id: 'places' as TabType, label: 'Places & Services' },
        { id: 'groups' as TabType, label: 'Groups & Events' },
        { id: 'suggestions' as TabType, label: 'Suggestions' }
    ];
    const [activeTabnext, setActiveTabnext] = useState<'lorem' | 'reviews'>('reviews');
    const [email, setEmail] = useState<string>('');
    const [activeTabtiep, setActiveTabtiep] = useState<'subscribe' | 'newsletter'>('subscribe');

    const handleSubmit = (): void => {
        if (email) {
            console.log('Email submitted:', email);
            setEmail('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    return (
        <>
            <section className="relative h-screen w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: "url('/navbar.jpg')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
                    <div className="max-w-3xl">
                        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
                            <div className="max-w-3xl mt-64">
                                {/* Main Heading */}
                                <h3 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                                    THE PLACE WHERE PEOPLE
                                    <br />
                                    MEET, SHARE, AND CONNECT
                                    <br />
                                    THROUGH THE THINGS THEY LOVE
                                </h3>
                            </div>
                        </div>
                        {/* Scroll Indicator */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 mb-12">
                            <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
                                Join Our Community
                            </button>
                            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200 transform hover:scale-105">
                                Learn More
                            </button>
                        </div>

                        {/* Feature Icons */}
                        <div className="flex items-center gap-8 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">10K+</p>
                                    <p className="text-sm text-gray-300">Active Members</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">500+</p>
                                    <p className="text-sm text-gray-300">Events Monthly</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Right Icon Section */}
                <div
                    className="
                    absolute bottom-12 right-12 z-10
                    rounded-2xl p-6
                    shadow-2xl max-w-xs
                "
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>

                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </div>



                    </div>

                    <p className="text-white text-sm font-medium leading-relaxed">
                        Our team brings you a place to connect and share what you love.
                    </p>
                </div>


                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* phần 2  */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Column 1 (4 cols) - Left Content */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Badge */}
                            <div className="inline-block mb-8">
                                <span className="text-xs font-semibold text-gray-600 px-4 py-2 border-2 border-gray-300 rounded-full uppercase tracking-wider">
                                    About FaveMates
                                </span>
                            </div>

                            {/* Heading */}
                            <h3 className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 leading-relaxed">
                                At FaveMates, we bring people together, creating a space where shared interests and passions lead to real connections and lasting friendships.
                            </h3>

                            {/* CTA Button */}
                            <button className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-gray-800 transition-all duration-200">
                                Sign up now
                            </button>
                        </div>

                        {/* Column 2 (4 cols) - First Card */}
                        <div className="lg:col-span-4">
                            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="./anhnay.jpg"
                                    alt="Find friends nearby"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                {/* Text Overlay */}
                                <div className="absolute bottom-8 left-8 right-20 text-white">
                                    <h3 className="text-2xl font-bold mb-2 leading-tight">
                                        Find friends nearby
                                    </h3>
                                    <p className="text-lg text-gray-100 leading-relaxed">
                                        who share your interests.
                                    </p>
                                </div>

                                <div className="absolute bottom-6 right-6 flex gap-3">
                                    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg">
                                        <MoveUpRight className="text-gray-900" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Column 3 (4 cols) - Second Card */}
                        <div className="lg:col-span-4">
                            {/* IMAGE */}
                            <div className="relative h-48 lg:h-56 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="./anhkia.jpg"
                                    alt="Suggest places"
                                    className="w-full h-full object-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                {/* Text Overlay */}
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <h3 className="text-lg lg:text-xl font-bold leading-tight">
                                        Suggest places &
                                    </h3>
                                    <p className="text-sm lg:text-base text-gray-200">
                                        related services
                                    </p>
                                </div>
                            </div>

                            {/* NAVIGATION BUTTONS - BELOW IMAGE */}
                            <div className="mt-4 flex justify-end gap-4">
                                <button
                                    className="
      w-14 h-14
      rounded-full
      border-2 border-gray-900
      bg-white
      flex items-center justify-center
      hover:bg-gray-900 hover:text-white
      transition-all duration-200
      shadow-lg
    "
                                >
                                    <MoveLeft size={26} className="text-gray-900 group-hover:text-white" />
                                </button>

                                <button
                                    className="
      w-14 h-14
      rounded-full
      border-2 border-gray-900
      bg-white
      flex items-center justify-center
      hover:bg-gray-900 hover:text-white
      transition-all duration-200
      shadow-lg
    "
                                >
                                    <MoveRight size={26} className="text-gray-900 group-hover:text-white" />
                                </button>
                            </div>

                        </div>



                    </div>
                </div>
            </section>
            {/* tiếp tục phần 3 */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Tabs Navigation */}
                    <div className="flex gap-4 mb-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Column - Main Feature Card (8 cols) */}
                        <div className="lg:col-span-7">
                            <div className="bg-[#303030] rounded-3xl p-8 h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                                    {/* Left - Image */}
                                    <div className="relative">
                                        <img
                                            src="./image.png"
                                            alt="Outdoor event"
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    </div>

                                    {/* Right - Content */}
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                                                EXPLORE PLACES & SERVICES
                                            </h2>

                                            <div className="space-y-4 text-white">
                                                <p className="text-base leading-relaxed">
                                                    Show nearby cafés, restaurants, events, and activities.
                                                </p>
                                                <p className="text-base leading-relaxed">
                                                    Include suggestions based on shared interests of users.
                                                </p>
                                                <p className="text-base leading-relaxed">
                                                    Can include reviews, photos, and maps.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Navigation Arrows */}
                                        <div className="flex gap-3 mt-8">
                                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg">
                                                <ChevronLeft className="text-gray-900" size={20} />
                                            </button>
                                            <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg">
                                                <ChevronRight className="text-gray-900" size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - News Feed (4 cols) */}
                        <div className="lg:col-span-5">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    News Feed / Updates
                                </h3>

                                <div className="flex gap-6">
                                    {/* Image with Icon */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src="./iphone.png"
                                            alt="News update"
                                            className="w-40 h-60 object-cover rounded-2xl"
                                        />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-1 flex items-center">
                                        <p className="text-gray-700 leading-relaxed">
                                            Allow users to share their personal experiences, upload photos, write detailed reviews of places they have visited, recommend activities or events, and provide tips or insights to help others discover new interests.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* tiếp tục phần 4 */}
            <section className="bg-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                        {/* Left - Title */}
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-2 border-2 border-gray-400 rounded-full text-sm font-medium text-gray-700">
                                Lorem
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Lorem ipsum dolor sit
                            </h2>
                        </div>

                        {/* Right - Search & View All */}
                        <div className="flex items-center gap-4 w-full lg:w-auto">
                            <div className="relative flex-1 lg:flex-initial">
                                <input
                                    type="text"
                                    placeholder="Search here"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full lg:w-80 px-5 py-3 pr-12 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                                <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <Search className="text-gray-500" size={20} />
                                </button>
                            </div>
                            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200 whitespace-nowrap">
                                View All
                                <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {cards.map((card) => (
                            <div
                                key={card.id}
                                className="relative h-96 rounded-3xl overflow-hidden group cursor-pointer"
                            >
                                {/* Image */}
                                <img
                                    src={card.image}
                                    alt={card.category}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                {/* Category Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900">
                                        {card.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h3 className="text-white text-xl font-bold leading-tight">
                                        {card.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        {/* Navigation Arrows */}
                        <div className="flex gap-3">
                            <button className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200">
                                <ChevronLeft className="text-gray-700" size={20} />
                            </button>
                            <button className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200">
                                <ChevronRight className="text-gray-700" size={20} />
                            </button>
                        </div>

                        {/* Description Text */}
                        <div className="max-w-md">
                            <p className="text-gray-700 text-sm leading-relaxed">
                                Lorem ipsum dolor sit amet consectetur. Turpis nunc quam sit sed facilisi. Amet ac.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* phần kế tiếp */}
            <section className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header with Tabs and Navigation */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
                        {/* Left - Tabs */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setActiveTabnext('lorem')}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTabnext === 'lorem'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                Lorem ipsum
                            </button>
                            <button
                                onClick={() => setActiveTabnext('reviews')}
                                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${activeTabnext === 'reviews'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                What they say about us
                            </button>
                        </div>

                        {/* Center - Navigation Arrows */}
                        <div className="flex gap-3">
                            <button className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200">
                                <ChevronLeft className="text-gray-700" size={20} />
                            </button>
                            <button className="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-200">
                                <ChevronRight className="text-gray-700" size={20} />
                            </button>
                        </div>

                        {/* Right - Heading */}
                        <div className="lg:text-right">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                                Lorem ipsum dolor sit amet consectetur
                            </h2>
                        </div>
                    </div>

                    {/* Testimonial Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left - Large Image */}
                        <div className="lg:col-span-4">
                            <div className="relative">
                                <img
                                    src="./nuocngoai.jpg"
                                    alt="Barry Allen"
                                    className="w-full h-96 object-cover rounded-3xl shadow-lg"
                                />
                            </div>
                        </div>

                        {/* Center - Quote Content */}
                        <div className="lg:col-span-5 space-y-6">
                            <p className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                Lorem ipsum dolor sit amet consectetur. Adipiscing pellentesque tincidunt pellentesque sit.
                            </p>

                            <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold text-gray-900">
                                    Barry Allen
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-600">
                                    Premium member
                                </span>
                            </div>
                        </div>

                        {/* Right - Thumbnail & Pagination */}
                        <div className="lg:col-span-3 flex flex-col items-end gap-6">
                            {/* Thumbnail Image */}
                            <div className="relative">
                                <img
                                    src="ongcu.jpg"
                                    alt="Thumbnail"
                                    className="w-48 h-56 object-cover rounded-2xl shadow-md"
                                />
                            </div>

                            {/* Pagination Counter */}
                            <div className="text-gray-600 font-medium">
                                <span className="text-2xl font-bold text-gray-900">1</span>
                                <span className="mx-2 text-gray-400">/</span>
                                <span className="text-lg">8</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* phân tiếp theo */}
            <section className="bg-gray-100 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#212121] rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                            {/* Left - Image */}
                            <div className="lg:col-span-4 p-8 " >
                                <img
                                    src="./nugym.jpg"
                                    alt="Workout"
                                    className="w-80 h-80 object-cover min-h-80 rounded-lg"
                                />

                            </div>

                            {/* Right - Content */}
                            <div className="lg:col-span-8 p-10 lg:p-16 flex flex-col justify-center">
                                {/* Tabs */}
                                <div className="flex gap-3 mb-8">
                                    <button
                                        onClick={() => setActiveTabtiep('subscribe')}
                                        className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeTabtiep === 'subscribe'
                                            ? 'bg-white text-gray-900'
                                            : 'bg-transparent text-white border border-white/30 hover:border-white/60'
                                            }`}
                                    >
                                        Subscribe
                                    </button>
                                    <button
                                        onClick={() => setActiveTabtiep('newsletter')}
                                        className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${activeTabtiep === 'newsletter'
                                            ? 'bg-white text-gray-900'
                                            : 'bg-transparent text-white border border-white/30 hover:border-white/60'
                                            }`}
                                    >
                                        Newsletter
                                    </button>
                                </div>

                                {/* Heading */}
                                <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-8">
                                    Lorem ipsum dolor sit amet consectetur. Vitae porttitor odio eu sagittis tortor!
                                </h2>

                                {/* Email Input */}
                                <div className="relative max-w-xl">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address..."
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="w-full px-6 py-4 pr-16 bg-transparent border-2 border-white/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white transition-all duration-200"
                                    />
                                    <button
                                        onClick={handleSubmit}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200 shadow-lg"
                                        aria-label="Submit email"
                                    >
                                        <Send className="text-gray-900" size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;