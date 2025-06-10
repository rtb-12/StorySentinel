import React, { useState } from "react";
import {
  Shield,
  Plus,
  Search,
  AlertTriangle,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";
import IPPortfolio from "./IPPortfolio";
import AlertsLog from "./AlertsLog";
import DisputesEnforcement from "./DisputesEnforcement";
import Analytics from "./Analytics";
import { WalletButton } from "./WalletButton";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  const tabs = [
    { id: "portfolio", name: "IP Portfolio", icon: Shield },
    { id: "alerts", name: "Alerts", icon: AlertTriangle, badge: 3 },
    { id: "disputes", name: "Disputes", icon: Search },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "portfolio":
        return <IPPortfolio />;
      case "alerts":
        return <AlertsLog />;
      case "disputes":
        return <DisputesEnforcement />;
      case "analytics":
        return <Analytics />;
      default:
        return <IPPortfolio />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                StorySentinel
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                    {tab.badge && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New IP
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Search className="h-4 w-4 mr-2" />
                  Manual Scan
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
