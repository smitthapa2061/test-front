import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-white">ScoreSync</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-purple-400 hover:scale-105 transform transition-all duration-300 font-['Bebas'] tracking-widest text-lg">Home</a>
              <a href="#features" className="text-gray-300 hover:text-purple-400 hover:scale-105 transform transition-all duration-300 font-['Bebas'] tracking-widest text-lg">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-purple-400 hover:scale-105 transform transition-all duration-300 font-['Bebas'] tracking-widest text-lg">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-purple-400 hover:scale-105 transform transition-all duration-300 font-['Bebas'] tracking-widest text-lg">Contact</a>
            </div>
            <Link
              to="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover animate-pulse"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="./esports-bg.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 via-blue-900/30 to-indigo-900/40 animate-[pulse_4s_ease-in-out_infinite]"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-12 animate-[fadeIn_1s_ease-out]">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 mb-8 shadow-2xl hover:shadow-purple-500/50 transition-shadow duration-300 hover:animate-bounce">
              <img
                src="./logo.png"
                alt="ScoreSync Logo"
                className="w-24 h-24 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-gray-300 mb-6 leading-none animate-[slideInFromBottom_1.5s_ease-out] hover:animate-pulse font-['Tungsten'] tracking-wide uppercase drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              ScoreSync
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-700 mx-auto mb-8 rounded-full animate-[growWidth_2s_ease-out]"></div>
            <p className="text-2xl text-gray-300 mb-6 max-w-4xl mx-auto font-light animate-[fadeIn_2s_ease-out]">
              Professional Tournament Management System for Esports
            </p>
            <p className="text-xl text-gray-400 mb-16 max-w-5xl mx-auto leading-relaxed animate-[fadeIn_2.5s_ease-out]">
              Streamline your Battle Royale tournaments with real-time data integration, live statistics,
              and professional overlay themes. Manage everything from setup to results with our
              powerful dashboard and automated scoring system.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-[slideInFromBottom_3s_ease-out]">
            <Link
              to="/login"
              className="group px-12 py-5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-1 hover:scale-105 text-xl"
            >
              Get Started Free
              <svg className="inline-block w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              to="#features"
              className="px-12 py-5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-xl transition-all duration-300 shadow-xl backdrop-blur-sm border border-slate-600/50 text-xl hover:scale-105 hover:shadow-lg"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-[fadeIn_1s_ease-out]">
            <h2 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent font-['Tungsten'] uppercase tracking-widest">Powerful Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['Bebas'] tracking-wide">
              Everything you need to run professional esports tournaments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.5s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Updates</h3>
              <p className="text-gray-400 leading-relaxed">
                Live match data integration with automatic statistics tracking and real-time overlay updates during matches.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.7s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Professional Themes</h3>
              <p className="text-gray-400 leading-relaxed">
                Customizable overlay themes for streaming platforms with multiple design options and branding support.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.9s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Tournament Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Complete tournament lifecycle management from team registration to final results and statistics.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_1.1s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">API Integration</h3>
              <p className="text-gray-400 leading-relaxed">
                Seamless integration with game APIs for automatic data collection and live match statistics.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_1.3s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">API & Manual Events</h3>
              <p className="text-gray-400 leading-relaxed">
                Support for one API-driven event alongside multiple manual events, perfect for all battle royale games and custom tournaments.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_1.5s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-6 hover:animate-spin transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Automated Scoring</h3>
              <p className="text-gray-400 leading-relaxed">
                Intelligent scoring algorithms with customizable rules and automatic leaderboard updates.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/50 via-indigo-900/20 to-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-[shimmer_4s_ease-in-out_infinite]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-[fadeIn_1s_ease-out]">
            <h2 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent font-['Tungsten'] uppercase tracking-widest">Flexible Pricing</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['Bebas'] tracking-wide">
              Choose the plan that fits your tournament schedule
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.5s_ease-out]">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Daily</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-[pulse_2s_ease-in-out_infinite]">$5<span className="text-lg text-gray-400">/day</span></div>
                <p className="text-gray-400">Perfect for single-day events</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 20 teams
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.2s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Basic themes
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.4s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Live updates
                </li>
              </ul>
              <Link
                to="/login"
                className="w-full block text-center py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.7s_ease-out]">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Weekly</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-[pulse_2s_ease-in-out_infinite]">$25<span className="text-lg text-gray-400">/week</span></div>
                <p className="text-gray-400">Ideal for weekend tournaments</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Up to 50 teams
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.2s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium themes
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.4s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  API integration
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.6s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email support
                </li>
              </ul>
              <Link
                to="/login"
                className="w-full block text-center py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border-2 border-purple-500/50 relative hover:border-purple-500/80 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 animate-[slideInFromBottom_0.9s_ease-out]">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-1 rounded-full text-sm font-semibold animate-[pulse_2s_ease-in-out_infinite]">Most Popular</span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-[pulse_2s_ease-in-out_infinite]">$79<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">For regular tournament organizers</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited teams
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.2s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  All premium themes
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.4s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Advanced analytics
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.6s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.8s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom branding
                </li>
              </ul>
              <Link
                to="/login"
                className="w-full block text-center py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_1.1s_ease-out]">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Yearly</h3>
                <div className="text-4xl font-bold text-purple-400 mb-2 animate-[pulse_2s_ease-in-out_infinite]">$699<span className="text-lg text-gray-400">/year</span></div>
                <p className="text-gray-400">Best value for year-round events</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Monthly
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.2s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  2 months free
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.4s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Custom integrations
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-400 mr-3 animate-[bounce_1.6s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dedicated account manager
                </li>
              </ul>
              <Link
                to="/login"
                className="w-full block text-center py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-[shimmer_5s_ease-in-out_infinite]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent animate-[fadeIn_1s_ease-out] font-['Tungsten'] uppercase tracking-widest">Get In Touch</h2>
          <p className="text-xl text-gray-400 mb-12 animate-[fadeIn_1.5s_ease-out] font-['Bebas'] tracking-wide">
            Ready to elevate your tournaments? Contact us to get started.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.5s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mx-auto mb-6 hover:animate-bounce transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Email Us</h3>
              <p className="text-gray-400 mb-4">fusion1nepal@gmail.com</p>
              <p className="text-sm text-gray-500">We respond within 24 hours</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-green-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 animate-[slideInFromBottom_0.7s_ease-out]">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center mx-auto mb-6 hover:animate-bounce transition-transform">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">WhatsApp</h3>
              <p className="text-gray-400 mb-4">+977 9804344434</p>
              <p className="text-sm text-gray-500">Available 9 AM - 6 PM NPT</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-8 rounded-xl border border-slate-700/50 hover:border-purple-500/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 animate-[slideInFromBottom_0.9s_ease-out]">
            <h3 className="text-2xl font-semibold text-white mb-6">Start Your Free Trial</h3>
            <p className="text-gray-400 mb-8">
              Join thousands of tournament organizers who trust ScoreSync for their events.
            </p>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-sm text-gray-500">
            © 2025 ScoreSync. All rights reserved by Fusion Esports. Built for professional esports tournaments.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;