import React, { useState } from "react";
import {
  Image,
  Video,
  Music,
  File,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
} from "lucide-react";

interface IPAsset {
  id: string;
  title: string;
  type: "image" | "video" | "audio" | "document";
  thumbnail: string;
  registrationDate: string;
  licenseType: string;
  status: "active" | "disputed" | "pending";
  infringements: number;
  storyId?: string;
  ipfsHash?: string;
}

const IPPortfolio: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - would come from Story Protocol API
  const [assets] = useState<IPAsset[]>([
    {
      id: "1",
      title: "Digital Art Collection #1",
      type: "image",
      thumbnail: "/api/placeholder/300/200",
      registrationDate: "2025-06-01",
      licenseType: "Commercial Use",
      status: "active",
      infringements: 0,
      storyId: "0xabc123...",
      ipfsHash: "QmX1Y2Z3...",
    },
    {
      id: "2",
      title: "Brand Logo Design",
      type: "image",
      thumbnail: "/api/placeholder/300/200",
      registrationDate: "2025-05-28",
      licenseType: "Non-Commercial",
      status: "disputed",
      infringements: 2,
      storyId: "0xdef456...",
      ipfsHash: "QmA4B5C6...",
    },
    {
      id: "3",
      title: "Product Demo Video",
      type: "video",
      thumbnail: "/api/placeholder/300/200",
      registrationDate: "2025-05-25",
      licenseType: "Commercial Use",
      status: "active",
      infringements: 1,
      storyId: "0xghi789...",
      ipfsHash: "QmD7E8F9...",
    },
    {
      id: "4",
      title: "Background Music Track",
      type: "audio",
      thumbnail: "/api/placeholder/300/200",
      registrationDate: "2025-05-20",
      licenseType: "Royalty Free",
      status: "pending",
      infringements: 0,
      storyId: "",
      ipfsHash: "QmG1H2I3...",
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-5 w-5" />;
      case "video":
        return <Video className="h-5 w-5" />;
      case "audio":
        return <Music className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string, infringements: number) => {
    if (status === "disputed" || infringements > 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {infringements} Alert{infringements !== 1 ? "s" : ""}
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
        <CheckCircle className="h-3 w-3 mr-1" />
        Protected
      </span>
    );
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" || asset.type === filter || asset.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">IP Portfolio</h1>
          <p className="text-gray-600">
            Manage your registered intellectual property assets
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Register New IP
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your IP assets..."
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
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="audio">Audio</option>
          <option value="document">Documents</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="disputed">Disputed</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {assets.length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Protection</p>
              <p className="text-2xl font-bold text-green-600">
                {assets.filter((a) => a.status === "active").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {assets.reduce((sum, a) => sum + a.infringements, 0)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {assets.filter((a) => a.status === "pending").length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {getTypeIcon(asset.type)}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {asset.title}
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      Registered:{" "}
                      {new Date(asset.registrationDate).toLocaleDateString()}
                    </p>
                    <p>License: {asset.licenseType}</p>
                    {asset.storyId && (
                      <p className="font-mono text-xs">
                        Story ID: {asset.storyId}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    {getStatusBadge(asset.status, asset.infringements)}
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Search className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No IP assets found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Start by registering your first IP asset"}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Register New IP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IPPortfolio;
