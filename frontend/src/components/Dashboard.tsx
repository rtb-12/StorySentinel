import React, { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  BarChart3,
  Settings,
  Zap,
  Upload,
  Eye,
} from "lucide-react";
import IPPortfolio from "./IPPortfolio";
import DisputesEnforcement from "./DisputesEnforcement";
import Analytics from "./Analytics";
import CreateIP from "./CreateIP";
import InfringementChecker from "./InfringementChecker";
import Navbar from "./Navbar";
import { WalletStatus } from "./WalletStatus";
import { Web3Demo } from "./Web3Demo";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    { id: "portfolio", name: "IP Portfolio", icon: Shield },
    { id: "create", name: "Create IP", icon: Upload },
    { id: "infringement", name: "Check Infringement", icon: Eye },
    { id: "disputes", name: "Disputes", icon: Search },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "web3", name: "Web3", icon: Zap },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "portfolio":
        return <IPPortfolio />;
      case "create":
        return <CreateIP />;
      case "infringement":
        return <InfringementChecker />;
      case "disputes":
        return <DisputesEnforcement />;
      case "analytics":
        return <Analytics />;
      case "web3":
        return <Web3Demo />;
      default:
        return <IPPortfolio />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Dashboard Content */}
      <div className="pt-16">
        <div className="max-w-full">
          <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar Navigation */}
            <div className="w-72 flex-shrink-0 bg-white/80 backdrop-blur-lg border-r border-gray-200/50 shadow-xl">
              <div className="p-6">
                {/* Logo Section */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                    <Shield className="h-6 w-6" />
                    <span className="font-bold text-lg">StorySentinel</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`group w-full flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md hover:transform hover:scale-[1.01]"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 mr-3 transition-transform duration-300 ${
                            activeTab === tab.id
                              ? "scale-110"
                              : "group-hover:scale-105"
                          }`}
                        />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="group w-full flex items-center px-4 py-3.5 text-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:transform hover:scale-105 hover:shadow-blue-500/25">
                      <Plus className="h-4 w-4 mr-3 transition-transform duration-300 group-hover:rotate-90" />
                      Register New IP
                    </button>
                    <button className="group w-full flex items-center px-4 py-3.5 text-sm text-gray-700 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50 hover:border-gray-300">
                      <Search className="h-4 w-4 mr-3 transition-transform duration-300 group-hover:scale-110" />
                      Manual Scan
                    </button>
                    <button className="group w-full flex items-center px-4 py-3.5 text-sm text-gray-700 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200/50 hover:border-gray-300">
                      <Settings className="h-4 w-4 mr-3 transition-transform duration-300 group-hover:rotate-45" />
                      Settings
                    </button>
                  </div>
                </div>

                {/* Wallet Status */}
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                    Wallet Status
                  </h3>
                  <WalletStatus />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="h-full bg-white/50 backdrop-blur-sm">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
