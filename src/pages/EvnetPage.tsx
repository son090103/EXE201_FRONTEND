import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, Clock, ArrowRight, Sparkles, Trophy, Heart, Share2, Check } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    city: string;
    participants: number;
    maxParticipants?: number;
    image: string;
    category: string;
    description: string;
    isFeatured?: boolean;
    price?: string;
}

const EventsPage: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [joinedEvents, setJoinedEvents] = useState<Set<number>>(new Set());

    useEffect(() => {
        const mockEvents: Event[] = [
            {
                id: 1,
                title: "Hanoi Open Tennis Tournament 2026",
                date: "Feb 15-16, 2026",
                time: "8:00 AM - 5:00 PM",
                location: "Hanoi Sports Club",
                city: "Hanoi",
                participants: 128,
                maxParticipants: 256,
                image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=1200",
                category: "Tennis",
                description: "Open tennis tournament for all levels. Attractive prizes and sponsor gifts await!",
                isFeatured: true,
            },
            {
                id: 2,
                title: "Saigon Morning Run & Yoga Festival",
                date: "Feb 23, 2026",
                time: "6:00 AM - 9:00 AM",
                location: "Tao Dan Park",
                city: "Ho Chi Minh City",
                participants: 450,
                image: "https://images.unsplash.com/photo-1549576490-b0b4831aa60a?q=80&w=1200",
                category: "Running • Yoga",
                description: "Gentle morning run combined with outdoor yoga. Free entry — early check-in gets a festival T-shirt!",
            },
            {
                id: 3,
                title: "Da Nang Beach Volleyball Championship",
                date: "Mar 8, 2026",
                time: "9:00 AM - 6:00 PM",
                location: "My Khe Beach",
                city: "Da Nang",
                participants: 64,
                maxParticipants: 80,
                image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1200",
                category: "Beach Volleyball",
                description: "2 vs 2 beach volleyball championship. Winning team gets trophy + regional qualifier spot.",
                price: "200,000₫ / team",
            },
            {
                id: 4,
                title: "Group Cycling: Da Nang → Hoi An",
                date: "Mar 1, 2026",
                time: "6:30 AM - 12:00 PM",
                location: "Dragon Bridge",
                city: "Da Nang",
                participants: 42,
                image: "https://images.unsplash.com/photo-1507035896870-6d47a3e3a6ab?q=80&w=1200",
                category: "Cycling",
                description: "Stunning coastal ride from Da Nang to Hoi An. Support vehicle and water stations included.",
            },
            {
                id: 5,
                title: "HCMC Pickleball Social Night",
                date: "Feb 28, 2026",
                time: "6:30 PM - 10:00 PM",
                location: "Pickleball Arena Q7",
                city: "Ho Chi Minh City",
                participants: 80,
                image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200",
                category: "Pickleball",
                description: "Fun evening pickleball mixer for beginners and advanced players. Free coaching available.",
            },
            {
                id: 6,
                title: "Vietnam Fitness Challenge 2026",
                date: "Mar 12-13, 2026",
                time: "7:00 AM - 8:00 PM",
                location: "Rach Mieu Stadium",
                city: "Ho Chi Minh City",
                participants: 320,
                maxParticipants: 500,
                image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200",
                category: "Fitness",
                description: "National fitness & endurance challenge with multiple categories and big prizes.",
                isFeatured: true,
            },
        ];

        setTimeout(() => {
            setEvents(mockEvents);
            setLoading(false);
        }, 1200);
    }, []);

    const handleJoin = (eventId: number) => {
        setJoinedEvents((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
                // TODO: Call real API to join event here
            }
            return newSet;
        });
    };

    const isJoined = (eventId: number) => joinedEvents.has(eventId);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 bg-gray-200/60 rounded-2xl animate-pulse mb-12 mx-auto max-w-md" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="glass-effect rounded-3xl overflow-hidden shadow-xl h-96 animate-pulse" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-effect rounded-3xl overflow-hidden shadow-xl h-96 animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-16px) rotate(2deg); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.2); } 50% { box-shadow: 0 0 40px rgba(139,92,246,0.4); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .glass-effect { background: rgba(255,255,255,0.75); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.4); }
        .hover-lift { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-lift:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 30px 60px rgba(0,0,0,0.18); }
        .text-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .btn-pulse:hover { animation: pulse-glow 1.5s infinite; }
      `}</style>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Hero Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gradient mb-4 animate-float tracking-tight">
                        Community Events
                    </h1>
                    <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                        Discover and join exciting sports events near you — connect, compete, and stay active!
                    </p>
                </div>

                {/* Featured Events */}
                <section className="mb-20">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                        <Sparkles className="text-yellow-500" size={32} />
                        Featured Events
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {events.filter((e) => e.isFeatured).map((event) => (
                            <div
                                key={event.id}
                                className="glass-effect rounded-3xl overflow-hidden shadow-2xl hover-lift group relative"
                            >
                                <div className="relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-80 object-cover transition-transform duration-800 group-hover:scale-110"
                                    />
                                    <div className="absolute top-5 left-5">
                                        <span className="px-5 py-2 bg-yellow-400 text-gray-900 rounded-full text-sm font-extrabold shadow-lg uppercase tracking-wide">
                                            Featured
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                        <h3 className="text-3xl font-extrabold mb-3 drop-shadow-lg">{event.title}</h3>
                                        <div className="flex items-center gap-5 text-base font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={18} /> {event.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} /> {event.city}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-gray-700 mb-6 line-clamp-3 text-base leading-relaxed">{event.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Users size={22} className="text-purple-600" />
                                            <span className="font-bold text-lg">
                                                {event.participants}/{event.maxParticipants || '∞'} joined
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleJoin(event.id)}
                                            className={`px-8 py-4 rounded-2xl font-extrabold text-lg flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg ${isJoined(event.id)
                                                ? 'bg-emerald-600 text-white'
                                                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white btn-pulse'
                                                }`}
                                        >
                                            {isJoined(event.id) ? (
                                                <>
                                                    <Check size={24} /> Joined
                                                </>
                                            ) : (
                                                <>
                                                    Join Now <ArrowRight size={24} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* All Events */}
                {/* All Events */}
                <section>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-4">
                        <Trophy className="text-amber-600" size={32} />
                        All Events
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="glass-effect rounded-3xl overflow-hidden shadow-xl hover-lift flex flex-col transition-all duration-400"
                            >
                                <div className="relative">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-extrabold text-gray-800 shadow-md uppercase tracking-wide">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="font-extrabold text-xl leading-tight mb-3">{event.title}</h3>
                                    <p className="text-gray-600 mb-5 line-clamp-3 text-sm flex-1">{event.description}</p>

                                    <div className="mt-auto space-y-5">
                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={18} className="text-purple-600" /> {event.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={18} className="text-purple-600" /> {event.time}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin size={18} className="text-purple-600" /> {event.city}
                                            </div>
                                            {event.price && (
                                                <div className="text-green-600 font-bold">{event.price}</div>
                                            )}
                                        </div>

                                        {/* Phần số người tham gia / giới hạn */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-purple-100 p-2 rounded-full">
                                                    <Users size={20} className="text-purple-700" />
                                                </div>
                                                <span className="font-bold text-base text-gray-800">
                                                    {event.participants}
                                                    {event.maxParticipants ? ` / ${event.maxParticipants}` : ''}{' '}
                                                    joined
                                                </span>
                                            </div>

                                            <div className="flex gap-2">
                                                <button className="p-3 hover:bg-red-50 rounded-xl transition-colors">
                                                    <Heart size={22} className="text-gray-600 hover:text-red-500 transition-colors" />
                                                </button>
                                                <button className="p-3 hover:bg-green-50 rounded-xl transition-colors">
                                                    <Share2 size={22} className="text-gray-600 hover:text-green-600 transition-colors" />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleJoin(event.id)}
                                            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] shadow-md ${isJoined(event.id)
                                                    ? 'bg-emerald-600 text-white'
                                                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:brightness-110'
                                                }`}
                                        >
                                            {isJoined(event.id) ? (
                                                <>
                                                    <Check size={22} /> Joined
                                                </>
                                            ) : (
                                                <>Join Event</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EventsPage;