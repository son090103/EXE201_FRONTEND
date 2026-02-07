const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Column 1 - Logo */}
                    <div className="md:col-span-2">
                        <h1 className="text-2xl font-bold">
                            <span className="text-gray-900">FAVE</span>
                            <span className="text-gray-600">MATES</span>
                        </h1>
                    </div>

                    {/* Column 2 - Facilities */}
                    <div className="md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Facilities</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <a href="#tennis" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Tennis
                                </a>
                            </li>
                            <li>
                                <a href="#basketball" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Basketball
                                </a>
                            </li>
                            <li>
                                <a href="#swimming" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Swimming
                                </a>
                            </li>
                            <li>
                                <a href="#gym" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Gym
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3 - About */}
                    <div className="md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">About</h3>
                        <ul className="space-y-2.5">
                            <li>
                                <a href="#mission" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Our Mission
                                </a>
                            </li>
                            <li>
                                <a href="#vision" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Vision
                                </a>
                            </li>
                            <li>
                                <a href="#community" className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
                                    Community
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4 - Social */}
                    <div className="md:col-span-2">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Social</h3>
                        <div className="flex flex-col gap-3">
                            <a
                                href="#instagram"
                                className="inline-block px-4 py-2 border-2 border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 text-center w-fit"
                            >
                                Instagram
                            </a>
                            <a
                                href="#facebook"
                                className="inline-block px-4 py-2 border-2 border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 text-center w-fit"
                            >
                                Facebook
                            </a>
                            <a
                                href="#linkedin"
                                className="inline-block px-4 py-2 border-2 border-gray-300 rounded-full text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-all duration-200 text-center w-fit"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Column 5 - Tagline (Right aligned) */}
                    <div className="md:col-span-4 text-left md:text-right">
                        <p className="text-base font-bold text-gray-900 leading-relaxed">Your Play, Your Way</p>
                        <p className="text-base text-gray-900 leading-relaxed">Modern Sports Facilities</p>
                        <p className="text-base text-gray-900 leading-relaxed">for Every Passion</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;