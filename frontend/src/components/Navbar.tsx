import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { WalletButton } from "./WalletButton";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-display font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              StorySentinel
            </span>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <WalletButton compact />
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
