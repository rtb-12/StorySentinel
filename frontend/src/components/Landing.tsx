import React from "react";
import { Link } from "react-router-dom";
import { Shield, Eye, Zap, Users, CheckCircle, ArrowRight } from "lucide-react";
import { WalletButton } from "./WalletButton";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                StorySentinel
              </span>
            </div>
            <div className="flex items-center gap-4">
              <WalletButton compact />
              <Link
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Protect Your{" "}
            <span className="text-blue-600">Intellectual Property</span>
            <br />
            with AI-Powered Detection
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            StorySentinel combines Story Protocol's blockchain IP registration
            with Yakoa's advanced AI detection to automatically monitor, detect,
            and enforce your IP rights across the web.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive IP Protection Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built on cutting-edge blockchain and AI technologies to give you
              complete control over your intellectual property.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Blockchain Registration
              </h3>
              <p className="text-gray-600">
                Register your IP assets on Story Protocol with immutable proof
                of ownership
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Detection
              </h3>
              <p className="text-gray-600">
                Yakoa's advanced AI continuously monitors for unauthorized use
                of your content
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Automated Enforcement
              </h3>
              <p className="text-gray-600">
                Smart contracts automatically enforce licensing terms and
                royalty payments
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Manage IP portfolios collaboratively with role-based access
                control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How StorySentinel Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to comprehensive IP protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Register Your IP
              </h3>
              <p className="text-gray-600">
                Upload your creative assets and register them on Story Protocol
                blockchain with customizable licensing terms.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Monitor & Detect
              </h3>
              <p className="text-gray-600">
                Our AI-powered system continuously scans the web for
                unauthorized use of your registered IP assets.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Enforce & Monetize
              </h3>
              <p className="text-gray-600">
                Automatically enforce your rights through smart contracts and
                collect royalties from authorized usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Your Intellectual Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who trust StorySentinel to protect their
            valuable IP assets.
          </p>
          <Link
            to="/dashboard"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Protecting Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="ml-2 text-lg font-semibold">StorySentinel</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2025 StorySentinel. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
