import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Eye,
  Zap,
  Users,
  ArrowRight,
  Sparkles,
  Globe,
} from "lucide-react";
import Navbar from "./Navbar";
const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Section with Custom Background */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        {/* Custom background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative w-full py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-medium text-white mb-8 shadow-lg">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                AI-Powered IP Protection Platform
              </div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  Protect Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                  Intellectual Property
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Combine blockchain technology with advanced AI detection to
                <span className="font-semibold text-gray-100">
                  {" "}
                  automatically monitor, detect, and enforce{" "}
                </span>
                your IP rights across the digital landscape.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
                <Link
                  to="/dashboard"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center shadow-2xl hover:shadow-3xl transform hover:scale-105 min-w-[200px]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group border-2 border-white/50 bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[200px]">
                  Watch Demo
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                    →
                  </span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                  <div className="text-3xl font-bold text-white mb-2">150+</div>
                  <div className="text-white/90">Protected Assets</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                  <div className="text-3xl font-bold text-white mb-2">
                    99.9%
                  </div>
                  <div className="text-white/90">Detection Accuracy</div>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white/90">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6">
              <Globe className="w-4 h-4 mr-2" />
              Comprehensive Protection Platform
            </div>
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-6">
              Advanced IP Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Built on cutting-edge blockchain and AI technologies to give you
              complete control over your intellectual property portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Blockchain Registration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Register your IP assets on Story Protocol with immutable proof
                of ownership and authenticity
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                AI-Powered Detection
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yakoa's advanced AI continuously monitors for unauthorized use
                of your content across the internet
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Automated Enforcement
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Smart contracts automatically enforce licensing terms and
                royalty payments across platforms
              </p>
            </div>

            <div className="group text-center p-8 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                Team Collaboration
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Manage IP portfolios collaboratively with role-based access
                control and team permissions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              How It Works
            </div>
            <h2 className="text-5xl font-display font-bold text-gray-900 mb-6">
              Three Steps to Protection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Simple, powerful, and automated IP protection workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center relative">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl font-display shadow-xl group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Register Your IP
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Upload your creative assets and register them on Story Protocol
                blockchain with customizable licensing terms and proof of
                ownership.
              </p>
              {/* Connection line for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-blue-300 to-green-300 transform -translate-x-6"></div>
            </div>

            <div className="group text-center relative">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl font-display shadow-xl group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Monitor & Detect
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our AI-powered system continuously scans the web for
                unauthorized use of your registered IP assets with 99.9%
                accuracy.
              </p>
              {/* Connection line for desktop */}
              <div className="hidden md:block absolute top-10 left-full w-12 h-0.5 bg-gradient-to-r from-green-300 to-purple-300 transform -translate-x-6"></div>
            </div>

            <div className="group text-center">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white font-bold text-2xl font-display shadow-xl group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6">
                Enforce & Monetize
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Automatically enforce your rights through smart contracts and
                collect royalties from authorized usage across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-purple-600/50"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-8">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
            Start Your IP Protection Journey
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Ready to Protect Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Intellectual Property?
            </span>
          </h2>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of creators who trust StorySentinel to safeguard
            their valuable IP assets with cutting-edge blockchain and AI
            technology.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/dashboard"
              className="group bg-white text-blue-600 px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 inline-flex items-center shadow-2xl hover:shadow-3xl transform hover:scale-105 min-w-[220px]"
            >
              Start Protecting Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group border-2 border-white/30 bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[220px]">
              Schedule Demo
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">
                →
              </span>
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">10,000+</div>
              <div className="text-white/70 text-sm">Protected Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">$50M+</div>
              <div className="text-white/70 text-sm">IP Value Protected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-white/70 text-sm">Uptime Guarantee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-display font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  StorySentinel
                </span>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                Protecting intellectual property through advanced blockchain
                technology and AI-powered detection systems.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/portfolio"
                    className="hover:text-white transition-colors"
                  >
                    IP Portfolio
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analytics"
                    className="hover:text-white transition-colors"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/alerts"
                    className="hover:text-white transition-colors"
                  >
                    Alerts
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; 2025 StorySentinel. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
