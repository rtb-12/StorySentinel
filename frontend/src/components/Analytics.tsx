import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Eye,
  AlertTriangle,
  Globe,
  Calendar,
  Download,
  Filter,
  RefreshCw,
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

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleExport = () => {
    console.log("Exporting analytics data...");
    // Here you would implement data export functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your IP protection performance
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">IP Protection Score</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.overview.protectionScore}%
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% vs last month
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-3xl font-bold text-blue-600">
                {analytics.overview.totalAssets}
              </p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 this month
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scans</p>
              <p className="text-3xl font-bold text-purple-600">
                {analytics.overview.totalScans.toLocaleString()}
              </p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% vs last week
              </p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alerts Generated</p>
              <p className="text-3xl font-bold text-orange-600">
                {analytics.overview.alertsGenerated}
              </p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                -5% vs last month
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Disputes Won</p>
              <p className="text-3xl font-bold text-green-600">
                {analytics.overview.disputesWon}
              </p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                89% success rate
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanning Activity */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Scanning Activity
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Scans
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Alerts
              </div>
            </div>
          </div>

          {/* Simple bar chart representation */}
          <div className="space-y-3">
            {analytics.trends.scansOverTime.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-3">
                <div className="w-16 text-xs text-gray-600">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(day.scans / 70) * 100}%` }}
                    ></div>
                  </div>
                  <div className="w-8 text-xs text-gray-600">{day.scans}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
                    {day.alerts > 0 && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="w-4 text-xs text-gray-600">{day.alerts}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Infringement by Platform
          </h3>
          <div className="space-y-4">
            {analytics.trends.platformBreakdown.map((platform, index) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">
                    {platform.platform}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${platform.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {platform.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Targeted Assets */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Most Targeted Assets
            </h3>
            <p className="text-sm text-gray-600">
              Assets with the highest infringement rates
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.trends.topInfringedAssets.map((asset, index) => (
              <div
                key={asset.name}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {asset.resolved} of {asset.infringements} resolved
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-red-600">
                    {asset.infringements}
                  </span>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Infringers */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Repeat Infringers
            </h3>
            <p className="text-sm text-gray-600">
              Accounts with multiple violations
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.trends.topInfringers.map((infringer, index) => (
              <div
                key={infringer.identifier}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-mono">
                      {infringer.identifier}
                    </p>
                    <p className="text-xs text-gray-600">
                      {infringer.platform}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-red-600">
                    {infringer.violations}
                  </span>
                  <span className="text-xs text-gray-500">violations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Protection Effectiveness
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Detection Accuracy</p>
                <p className="text-2xl font-bold text-green-600">96.7%</p>
              </div>
              <div>
                <p className="text-gray-600">Average Response Time</p>
                <p className="text-2xl font-bold text-blue-600">4.2hrs</p>
              </div>
              <div>
                <p className="text-gray-600">Resolution Success Rate</p>
                <p className="text-2xl font-bold text-green-600">89.3%</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <Shield className="h-16 w-16 text-green-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
