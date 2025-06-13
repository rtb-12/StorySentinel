import React, { useState, useEffect, useCallback } from "react";
import {
  Image,
  Video,
  Music,
  File,
  Plus,
  Search,
  MoreVertical,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  Grid3X3,
  List,
  ExternalLink,
  RefreshCw,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  getStoryApiService,
  type IPAsset,
  type ChainType,
} from "../utils/storyApi";
import { useActiveAccount } from "thirdweb/react";

const IPPortfolio: React.FC = () => {
  const account = useActiveAccount();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedChain, setSelectedChain] = useState<ChainType>("story-aeneid");
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [prevCursor, setPrevCursor] = useState<string | undefined>(undefined);
  const itemsPerPage = 24;
  const [stats, setStats] = useState({
    total: 0,
    protected: 0,
    pending: 0,
    disputed: 0,
  });

  // Navigate to Create IP page
  const navigateToCreateIP = () => {
    // This assumes you're using React Router or similar
    // You can modify this based on your routing setup
    window.location.hash = "#/create-ip";
    // Or if using React Router: navigate('/create-ip');
  };

  // Fetch all assets from Story Protocol API (not user-specific)
  const fetchAssets = useCallback(
    async (cursor?: string, direction?: "next" | "prev") => {
      setLoading(true);
      setError(null);

      try {
        const storyApi = getStoryApiService();
        const paginationOptions: {
          limit: number;
          after?: string;
          before?: string;
        } = {
          limit: itemsPerPage,
        };

        if (cursor) {
          if (direction === "next") {
            paginationOptions.after = cursor;
          } else if (direction === "prev") {
            paginationOptions.before = cursor;
          }
        }

        const response = await storyApi.getAssets(selectedChain, {
          pagination: paginationOptions,
          orderBy: "blockNumber",
          orderDirection: "desc",
        });

        setAssets(response.data);

        // Set pagination info
        if (response.pagination) {
          setHasNext(response.pagination.hasNext);
          setHasPrev(response.pagination.hasPrev);
          setNextCursor(response.pagination.next);
          setPrevCursor(response.pagination.prev);
        }

        // Calculate stats from current page assets
        const total = response.data.length;
        const protectedCount = response.data.filter(
          (asset) => asset.status === "active"
        ).length;
        const pending = response.data.filter(
          (asset) => asset.status === "pending"
        ).length;
        const disputed = response.data.filter(
          (asset) => asset.status === "disputed"
        ).length;

        setStats({
          total: total, // Just show current page count since we don't have total count
          protected: protectedCount,
          pending,
          disputed,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assets");
        console.error("Error fetching assets:", err);
      } finally {
        setLoading(false);
      }
    },
    [selectedChain, itemsPerPage]
  );

  // Pagination handlers
  const handlePreviousPage = useCallback(() => {
    if (hasPrev && prevCursor) {
      fetchAssets(prevCursor, "prev");
    }
  }, [hasPrev, prevCursor, fetchAssets]);

  const handleNextPage = useCallback(() => {
    if (hasNext && nextCursor) {
      fetchAssets(nextCursor, "next");
    }
  }, [hasNext, nextCursor, fetchAssets]);

  const handleRefresh = useCallback(() => {
    fetchAssets(); // Reset to first page
  }, [fetchAssets]);

  // Fetch assets on component mount and when chain changes
  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "disputed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = filter === "all" || asset.type === filter;
    const matchesSearch = asset.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openStoryExplorer = (storyId: string) => {
    const explorerUrl =
      selectedChain === "story-aeneid"
        ? `https://aeneid.explorer.story.foundation/ipa/${storyId}`
        : `https://explorer.story.foundation/ipa/${storyId}`;
    window.open(explorerUrl, "_blank");
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              IP Assets on Story Protocol
            </h1>
            <p className="text-gray-600 mt-2">
              Explore all intellectual property assets registered on the Story
              Protocol network
            </p>
            {account && (
              <p className="text-sm text-gray-500 mt-1 font-mono">
                Connected: {account.address.slice(0, 6)}...
                {account.address.slice(-4)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            
          </div>
        </div>

        {/* Chain Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200/50">
            <Globe className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Network:</span>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setSelectedChain("story-aeneid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedChain === "story-aeneid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Aeneid Testnet
              </button>
              <button
                onClick={() => setSelectedChain("story")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedChain === "story"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mainnet
              </button>
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
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm min-w-[250px]"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Error loading assets:</span>
          </div>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200/50">
            <RefreshCw className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Loading Assets
            </h3>
            <p className="text-gray-600">
              Fetching IP assets from Story Protocol...
            </p>
          </div>
        </div>
      )}

      {/* Assets Grid/List */}
      {!loading && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className={`group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:transform hover:scale-105 overflow-hidden ${
                viewMode === "list" ? "flex items-center p-6" : "p-0"
              }`}
            >
              {viewMode === "grid" ? (
                <>
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // target.src = "/api/placeholder/300/200";
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700">
                        {getTypeIcon(asset.type)}
                        <span className="ml-1 capitalize">{asset.type}</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      {getStatusIcon(asset.status)}
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <button
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>
                        <button
                          onClick={() =>
                            asset.storyId && openStoryExplorer(asset.storyId)
                          }
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                          title="View on Story Explorer"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {asset.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Registered:</span>{" "}
                        {asset.registrationDate}
                      </p>
                      <p>
                        <span className="font-medium">License:</span>{" "}
                        {asset.licenseType}
                      </p>
                      <p>
                        <span className="font-medium">Story ID:</span>{" "}
                        <span className="font-mono text-xs">
                          {asset.storyId?.slice(0, 10)}...
                        </span>
                      </p>
                      {asset.infringements > 0 && (
                        <p className="text-red-600 font-medium">
                          {asset.infringements} infringement
                          {asset.infringements > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/api/placeholder/300/200";
                      }}
                    />
                  </div>
                  <div className="flex-1 ml-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {asset.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {getTypeIcon(asset.type)}
                            <span className="capitalize">{asset.type}</span>
                          </span>
                          <span>{asset.registrationDate}</span>
                          <span>{asset.licenseType}</span>
                          <span className="font-mono text-xs">
                            {asset.storyId?.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(asset.status)}
                        <button
                          onClick={() =>
                            asset.storyId && openStoryExplorer(asset.storyId)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View on Story Explorer"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && assets.length > 0 && (
        <div className="mt-8 flex items-center justify-between bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="text-sm text-gray-600">
            Showing {assets.length} assets per page
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrev || loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!hasNext || loading}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAssets.length === 0 && !error && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200/50">
            <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No assets found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : `No IP assets found on ${
                    selectedChain === "story-aeneid"
                      ? "Aeneid Testnet"
                      : "Mainnet"
                  }`}
            </p>
            <button
              onClick={navigateToCreateIP}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg mx-auto"
            >
              <Plus className="h-4 w-4" />
              Create Your First Asset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPPortfolio;
