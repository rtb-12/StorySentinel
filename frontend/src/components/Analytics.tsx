import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Shield,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  Target,
} from "lucide-react";

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  // Mock analytics data - would come from backend API
  const analytics = {
    overview: {
      totalAssets: 24,
      totalScans: 1847,
      alertsGenerated: 12,
      disputesWon: 8,
      protectionScore: 94,
    },
    trends: {
      scansOverTime: [
        { date: "2025-06-01", scans: 45, alerts: 2 },
        { date: "2025-06-02", scans: 52, alerts: 1 },
        { date: "2025-06-03", scans: 38, alerts: 3 },
        { date: "2025-06-04", scans: 61, alerts: 0 },
        { date: "2025-06-05", scans: 44, alerts: 2 },
        { date: "2025-06-06", scans: 57, alerts: 1 },
        { date: "2025-06-07", scans: 49, alerts: 3 },
      ],
      topInfringedAssets: [
        { name: "Digital Art Collection #1", infringements: 5, resolved: 4 },
        { name: "Brand Logo Design", infringements: 3, resolved: 3 },
        { name: "Product Demo Video", infringements: 2, resolved: 1 },
        { name: "Background Music Track", infringements: 1, resolved: 0 },
      ],
      platformBreakdown: [
        { platform: "Social Media", count: 8, percentage: 40 },
        { platform: "NFT Marketplaces", count: 6, percentage: 30 },
        { platform: "Video Platforms", count: 4, percentage: 20 },
        { platform: "E-commerce", count: 2, percentage: 10 },
      ],
      topInfringers: [
        {
          identifier: "0x742d35cc...",
          platform: "OpenSea Clone",
          violations: 3,
        },
        { identifier: "user123", platform: "Social Platform", violations: 2 },
        {
          identifier: "TechCorp Inc.",
          platform: "Corporate Site",
          violations: 2,
        },
        {
          identifier: "content_thief",
          platform: "Video Platform",
          violations: 1,
        },
      ],
    },
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into your IP protection performance
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw
                className={`h-5 w-5 transition-transform duration-300 ${
                  refreshing ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
              Refresh
            </button>
            <button className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 hover:transform hover:scale-105">
              <Download className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Assets
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics.overview.totalAssets}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-purple-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {analytics.overview.totalScans.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+24%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-red-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Alerts Generated
                </p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {analytics.overview.alertsGenerated}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              <span className="text-red-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-green-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Disputes Won
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {analytics.overview.disputesWon}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">+16%</span>
              <span className="text-gray-500 ml-1">vs last month</span>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-indigo-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Protection Score
                </p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">
                  {analytics.overview.protectionScore}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.overview.protectionScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50 mb-8">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="font-medium text-gray-900">Time Range:</span>
            <div className="flex bg-gray-100 rounded-xl p-1">
              {["7d", "30d", "90d", "1y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    timeRange === range
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {range === "7d"
                    ? "7 Days"
                    : range === "30d"
                    ? "30 Days"
                    : range === "90d"
                    ? "90 Days"
                    : "1 Year"}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
            <Filter className="h-4 w-4" />
            Custom Range
          </button>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Scans Over Time Chart */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Scan Activity
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Scans</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Alerts</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.trends.scansOverTime.map((day, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                    style={{
                      height: `${(day.scans / 70) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <div
                    className="bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all duration-500 hover:from-red-600 hover:to-red-500"
                    style={{
                      height: `${(day.alerts / 5) * 20}%`,
                      minHeight: day.alerts > 0 ? "4px" : "0px",
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 transform rotate-45 origin-left mt-2">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Platform Distribution
            </h3>
            <PieChart className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {analytics.trends.platformBreakdown.map((platform, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">
                    {platform.platform}
                  </span>
                  <span className="text-sm text-gray-600">
                    {platform.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      index === 0
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : index === 1
                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                        : index === 2
                        ? "bg-gradient-to-r from-purple-500 to-violet-500"
                        : "bg-gradient-to-r from-orange-500 to-red-500"
                    } group-hover:shadow-lg`}
                    style={{ width: `${platform.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {platform.count} infringement{platform.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Infringed Assets and Top Infringers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Infringed Assets */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Most Targeted Assets
          </h3>
          <div className="space-y-4">
            {analytics.trends.topInfringedAssets.map((asset, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                      index === 0
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : index === 1
                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                        : index === 2
                        ? "bg-gradient-to-r from-orange-600 to-red-600"
                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-600">
                      {asset.infringements} infringement
                      {asset.infringements !== 1 ? "s" : ""} • {asset.resolved}{" "}
                      resolved
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {asset.infringements}
                  </p>
                  <p className="text-xs text-green-600">
                    {Math.round((asset.resolved / asset.infringements) * 100)}%
                    resolved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Infringers */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Frequent Infringers
          </h3>
          <div className="space-y-4">
            {analytics.trends.topInfringers.map((infringer, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {infringer.identifier.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {infringer.identifier}
                    </p>
                    <p className="text-sm text-gray-600">
                      {infringer.platform}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {infringer.violations}
                  </p>
                  <p className="text-xs text-gray-600">violations</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
