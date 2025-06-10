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
  Globe,
  User,
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
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "text-blue-600 bg-blue-100";
      case "reviewed":
        return "text-purple-600 bg-purple-100";
      case "disputed":
        return "text-red-600 bg-red-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "ignored":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "text-red-600";
    if (similarity >= 75) return "text-orange-600";
    if (similarity >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" || alert.status === filter || alert.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for alerts:`, selectedAlerts);
    // Here you would implement the bulk action logic
    setSelectedAlerts([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Infringement Alerts
          </h1>
          <p className="text-gray-600">
            Monitor and respond to potential IP violations
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Manual Scan
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="disputed">Disputed</option>
          <option value="resolved">Resolved</option>
          <option value="ignored">Ignored</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {alerts.filter((a) => a.status === "new").length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  alerts.filter(
                    (a) => a.priority === "critical" || a.priority === "high"
                  ).length
                }
              </p>
            </div>
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {alerts.filter((a) => a.status === "resolved").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Similarity</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  alerts.reduce((sum, a) => sum + a.similarity, 0) /
                    alerts.length
                )}
                %
              </p>
            </div>
            <Eye className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedAlerts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              {selectedAlerts.length} alert
              {selectedAlerts.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction("ignore")}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Ignore All
              </button>
              <button
                onClick={() => handleBulkAction("dispute")}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Raise Disputes
              </button>
              <button
                onClick={() => setSelectedAlerts([])}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={selectedAlerts.includes(alert.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAlerts([...selectedAlerts, alert.id]);
                    } else {
                      setSelectedAlerts(
                        selectedAlerts.filter((id) => id !== alert.id)
                      );
                    }
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />

                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-6 w-6 text-gray-400" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {alert.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.description}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Similarity Score</p>
                      <p
                        className={`font-medium ${getSimilarityColor(
                          alert.similarity
                        )}`}
                      >
                        {alert.similarity}% match
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Source Platform</p>
                      <p className="font-medium text-gray-900">
                        {alert.source.platform}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Detected</p>
                      <p className="font-medium text-gray-900">
                        {new Date(alert.source.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                          alert.priority
                        )}`}
                      >
                        {alert.priority.charAt(0).toUpperCase() +
                          alert.priority.slice(1)}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          alert.status
                        )}`}
                      >
                        {alert.status.charAt(0).toUpperCase() +
                          alert.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Raise Dispute
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "Great! No infringement alerts at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsLog;
