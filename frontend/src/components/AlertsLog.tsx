import React, { useState } from "react";
import {
  AlertTriangle,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  X,
  Filter,
  Search,
  MoreVertical,
  Shield,
  TrendingUp,
  Zap,
  Play,
} from "lucide-react";

interface Alert {
  id: string;
  title: string;
  description: string;
  similarity: number;
  confidence: number;
  source: {
    url: string;
    platform: string;
    timestamp: string;
  };
  ipAsset: {
    id: string;
    title: string;
    thumbnail: string;
  };
  suspectContent: {
    thumbnail: string;
    url: string;
  };
  status: "new" | "reviewed" | "disputed" | "resolved" | "ignored";
  priority: "low" | "medium" | "high" | "critical";
  yakoaData?: {
    matchId: string;
    detectionMethod: string;
  };
}

const AlertsLog: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  // Mock data - would come from Yakoa API
  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      title: "High Similarity Match Detected",
      description:
        "Your digital art has been found on an unauthorized marketplace",
      similarity: 94,
      confidence: 87,
      source: {
        url: "https://example-marketplace.com/art/stolen-piece",
        platform: "NFT Marketplace",
        timestamp: "2025-06-10T08:30:00Z",
      },
      ipAsset: {
        id: "1",
        title: "Digital Art Collection #1",
        thumbnail: "/api/placeholder/100/100",
      },
      suspectContent: {
        thumbnail: "/api/placeholder/100/100",
        url: "https://example-marketplace.com/art/stolen-piece",
      },
      status: "new",
      priority: "critical",
      yakoaData: {
        matchId: "yakoa_match_001",
        detectionMethod: "AI_VISUAL_SIMILARITY",
      },
    },
    {
      id: "2",
      title: "Logo Usage Detected",
      description: "Your brand logo is being used without authorization",
      similarity: 89,
      confidence: 92,
      source: {
        url: "https://social-platform.com/post/123456",
        platform: "Social Media",
        timestamp: "2025-06-09T15:22:00Z",
      },
      ipAsset: {
        id: "2",
        title: "Brand Logo Design",
        thumbnail: "/api/placeholder/100/100",
      },
      suspectContent: {
        thumbnail: "/api/placeholder/100/100",
        url: "https://social-platform.com/post/123456",
      },
      status: "reviewed",
      priority: "high",
      yakoaData: {
        matchId: "yakoa_match_002",
        detectionMethod: "WATERMARK_DETECTION",
      },
    },
    {
      id: "3",
      title: "Video Content Match",
      description: "Partial match found in user-generated content",
      similarity: 76,
      confidence: 68,
      source: {
        url: "https://video-platform.com/watch/abc123",
        platform: "Video Platform",
        timestamp: "2025-06-08T11:45:00Z",
      },
      ipAsset: {
        id: "3",
        title: "Product Demo Video",
        thumbnail: "/api/placeholder/100/100",
      },
      suspectContent: {
        thumbnail: "/api/placeholder/100/100",
        url: "https://video-platform.com/watch/abc123",
      },
      status: "ignored",
      priority: "medium",
      yakoaData: {
        matchId: "yakoa_match_003",
        detectionMethod: "AI_CONTENT_ANALYSIS",
      },
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "from-red-500 to-pink-500";
      case "high":
        return "from-orange-500 to-red-500";
      case "medium":
        return "from-yellow-500 to-orange-500";
      case "low":
        return "from-blue-500 to-cyan-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Zap className="h-4 w-4 text-blue-500" />;
      case "reviewed":
        return <Eye className="h-4 w-4 text-yellow-500" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "ignored":
        return <X className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesFilter = filter === "all" || alert.status === filter;
    const matchesSearch = alert.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectAlert = (alertId: string) => {
    setSelectedAlerts((prev) =>
      prev.includes(alertId)
        ? prev.filter((id) => id !== alertId)
        : [...prev, alertId]
    );
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-red-50/30 to-orange-50/30">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-red-600 bg-clip-text text-transparent">
              Security Alerts
            </h1>
            <p className="text-gray-600 mt-2">
              Monitor and respond to potential IP infringements
            </p>
          </div>
          <div className="flex gap-3">
            <button className="group flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300">
              <Filter className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Advanced Filter
            </button>
            <button className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:transform hover:scale-105">
              <Play className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
              Auto-Scan
            </button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Alerts
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">47</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-red-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-red-600 mt-1">3</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-yellow-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">12</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-green-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600 mt-1">28</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-purple-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Success Rate
                </p>
                <p className="text-3xl font-bold text-purple-600 mt-1">94%</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm min-w-[250px]"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="disputed">Disputed</option>
              <option value="resolved">Resolved</option>
              <option value="ignored">Ignored</option>
            </select>
          </div>

          {selectedAlerts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedAlerts.length} selected
              </span>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                Mark as Disputed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-red-300/50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                {/* Priority Indicator */}
                <div
                  className={`w-1 h-20 bg-gradient-to-b ${getPriorityColor(
                    alert.priority
                  )} rounded-full flex-shrink-0`}
                />

                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedAlerts.includes(alert.id)}
                        onChange={() => handleSelectAlert(alert.id)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                        {alert.title}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          alert.priority === "critical"
                            ? "bg-red-100 text-red-700"
                            : alert.priority === "high"
                            ? "bg-orange-100 text-orange-700"
                            : alert.priority === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {alert.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(alert.status)}
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{alert.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original Asset */}
                    <div className="bg-gray-50/50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Your Asset
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          src={alert.ipAsset.thumbnail}
                          alt={alert.ipAsset.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {alert.ipAsset.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            Protected Asset
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Suspect Content */}
                    <div className="bg-red-50/50 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Suspect Content
                      </h4>
                      <div className="flex items-center gap-3">
                        <img
                          src={alert.suspectContent.thumbnail}
                          alt="Suspect content"
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            {alert.source.platform}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {alert.source.url}
                          </p>
                        </div>
                        <button className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Similarity & Confidence */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                      <p className="text-sm text-gray-600">Similarity</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {alert.similarity}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-2xl font-bold text-green-600">
                        {alert.confidence}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl">
                      <p className="text-sm text-gray-600">Detection Time</p>
                      <p className="text-sm font-medium text-purple-600">
                        {alert.source.timestamp}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg">
                      <AlertTriangle className="h-4 w-4" />
                      File Dispute
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                      <X className="h-4 w-4" />
                      Ignore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAlerts.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200/50">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "All clear! No security alerts at this time."}
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg mx-auto">
              <Play className="h-4 w-4" />
              Run Manual Scan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsLog;
