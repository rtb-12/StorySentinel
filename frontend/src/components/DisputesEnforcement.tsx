import React, { useState, useEffect, useCallback } from "react";
import {
  Scale,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  ExternalLink,
  Eye,
  Search,
  Shield,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe,
  RefreshCw,
  Plus,
  Upload,
} from "lucide-react";
import { getStoryApiService } from "../utils/storyApi";
import { getStoryClient } from "../utils/storyClient";
import { parseEther } from "viem";
import { DisputeTargetTag } from "@story-protocol/core-sdk";
import type { Dispute, ChainType, DisputeDetails } from "../utils/storyApi";

const DisputesEnforcement: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChain, setSelectedChain] = useState<ChainType>("story-aeneid");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    hasNext: boolean;
    hasPrev: boolean;
    next?: string;
    prev?: string;
  }>({
    hasNext: false,
    hasPrev: false,
    next: undefined,
    prev: undefined,
  });

  // New state for dispute details modal
  const [selectedDispute, setSelectedDispute] = useState<DisputeDetails | null>(
    null
  );
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Dispute creation state
  const [showCreateDispute, setShowCreateDispute] = useState(false);
  const [creatingDispute, setCreatingDispute] = useState(false);
  const [disputeForm, setDisputeForm] = useState({
    targetIpId: "",
    targetTag: "",
    evidenceFile: null as File | null,
    evidenceDescription: "",
    bond: "0.1",
    liveness: "2592000", // 30 days in seconds
  });
  const [evidenceCid, setEvidenceCid] = useState<string | null>(null);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);

  // Counter dispute state
  const [showCounterDispute, setShowCounterDispute] = useState(false);
  const [counterDisputeForm, setCounterDisputeForm] = useState({
    ipId: "",
    counterEvidenceFile: null as File | null,
    counterEvidenceDescription: "",
  });
  const [counterEvidenceCid, setCounterEvidenceCid] = useState<string | null>(
    null
  );
  const [uploadingCounterEvidence, setUploadingCounterEvidence] =
    useState(false);
  const [submittingCounterDispute, setSubmittingCounterDispute] =
    useState(false);

  const fetchDisputes = useCallback(
    async (cursor?: string, direction?: "next" | "prev") => {
      setLoading(true);
      setError(null);

      try {
        const apiService = getStoryApiService();

        const options = {
          pagination: {
            limit: 20,
            ...(cursor && direction === "next" ? { after: cursor } : {}),
            ...(cursor && direction === "prev" ? { before: cursor } : {}),
          },
        };

        const response = await apiService.getDisputes(selectedChain, options);
        setDisputes(response.data);
        setPagination({
          hasNext: response.pagination?.hasNext || false,
          hasPrev: response.pagination?.hasPrev || false,
          next: response.pagination?.next,
          prev: response.pagination?.prev,
        });
      } catch (err) {
        console.error("Failed to fetch disputes from Story API:", err);
        setError("Failed to load disputes. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [selectedChain]
  );

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchDisputes(pagination.next, "next");
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchDisputes(pagination.prev, "prev");
    }
  };

  const handleRefresh = () => {
    fetchDisputes(); // Reset to first page
  };

  // Real API handlers for button actions
  const handleViewDetails = async (disputeId: string) => {
    setLoadingDetails(true);
    try {
      const apiService = getStoryApiService();
      const details = await apiService.getDisputeDetails(
        selectedChain,
        disputeId
      );
      setSelectedDispute(details);
      setShowDisputeModal(true);
    } catch (err) {
      console.error("Failed to fetch dispute details:", err);
      setError("Failed to load dispute details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleViewOnStoryProtocol = (disputeId: string) => {
    const explorerUrl =
      selectedChain === "story-aeneid"
        ? `https://aeneid.explorer.story.foundation/disputes/${disputeId}`
        : `https://explorer.story.foundation/disputesthe t/${disputeId}`;
    window.open(explorerUrl, "_blank");
  };

  const handleViewUMA = (umaLink: string) => {
    if (umaLink) {
      window.open(umaLink, "_blank");
    }
  };

  const closeModal = () => {
    setShowDisputeModal(false);
    setSelectedDispute(null);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "from-yellow-500 to-orange-500";
      case "in-progress":
      case "active":
        return "from-blue-500 to-cyan-500";
      case "resolved":
      case "won":
        return "from-green-500 to-emerald-500";
      case "rejected":
      case "lost":
        return "from-red-500 to-pink-500";
      case "escalated":
        return "from-purple-500 to-violet-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "in-progress":
      case "active":
        return <Scale className="h-4 w-4 text-blue-500" />;
      case "resolved":
      case "won":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
      case "lost":
        return <X className="h-4 w-4 text-red-500" />;
      case "escalated":
        return <AlertTriangle className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const normalizedStatus = dispute.status.toLowerCase();
    const normalizedFilter = filter.toLowerCase();
    const matchesFilter =
      filter === "all" || normalizedStatus === normalizedFilter;

    // Search in available fields from the real API response
    const searchableText = [
      dispute.id,
      dispute.initiator,
      dispute.targetIpAsset,
      dispute.status,
      dispute.currentTag,
      dispute.targetTag,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Upload evidence to IPFS
  const uploadEvidenceToIPFS = async (
    file: File,
    description: string
  ): Promise<string> => {
    setUploadingEvidence(true);
    try {
      // Create a metadata object with the evidence
      const evidenceData = {
        description,
        timestamp: Date.now(),
        filename: file.name,
        filesize: file.size,
        type: "dispute_evidence",
      };

      // Create FormData for the upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("metadata", JSON.stringify(evidenceData));

      // For this example, we'll simulate an IPFS upload
      // In a real implementation, you would upload to IPFS
      const simulatedCid = `Qm${Math.random()
        .toString(36)
        .substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return simulatedCid;
    } finally {
      setUploadingEvidence(false);
    }
  };

  // Handle evidence file selection
  const handleEvidenceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisputeForm((prev) => ({ ...prev, evidenceFile: file }));
      setEvidenceCid(null); // Reset CID when new file is selected
    }
  };

  // Upload evidence handler
  const handleUploadEvidence = async () => {
    if (!disputeForm.evidenceFile || !disputeForm.evidenceDescription.trim()) {
      setError(
        "Please select a file and provide a description for the evidence"
      );
      return;
    }

    try {
      const cid = await uploadEvidenceToIPFS(
        disputeForm.evidenceFile,
        disputeForm.evidenceDescription
      );
      setEvidenceCid(cid);
      setError(null);
    } catch (err) {
      console.error("Failed to upload evidence:", err);
      setError("Failed to upload evidence to IPFS. Please try again.");
    }
  };

  // Create dispute handler
  const handleCreateDispute = async () => {
    if (!disputeForm.targetIpId.trim()) {
      setError("Please enter a target IP ID");
      return;
    }

    if (!disputeForm.targetTag) {
      setError("Please select a dispute tag");
      return;
    }

    if (!evidenceCid) {
      setError("Please upload evidence first");
      return;
    }

    setCreatingDispute(true);
    setError(null);

    try {
      const storyClient = getStoryClient();

      // Validate that the selected tag is a valid enum value
      const validTags = Object.values(DisputeTargetTag);
      if (!validTags.includes(disputeForm.targetTag as DisputeTargetTag)) {
        throw new Error(`Invalid dispute tag: ${disputeForm.targetTag}. Valid tags are: ${validTags.join(', ')}`);
      }

      // Use the string value directly since DisputeTargetTag is a string enum
      const disputeTag = disputeForm.targetTag as DisputeTargetTag;
      
      console.log('Dispute form data:', {
        targetIpId: disputeForm.targetIpId.trim(),
        targetTag: disputeForm.targetTag,
        disputeTagToUse: disputeTag,
        availableEnumKeys: Object.keys(DisputeTargetTag),
        availableEnumValues: Object.values(DisputeTargetTag),
        evidenceCid,
        bond: disputeForm.bond,
        liveness: disputeForm.liveness
      });

      const response = await storyClient.dispute.raiseDispute({
        targetIpId: disputeForm.targetIpId.trim() as `0x${string}`,
        cid: evidenceCid,
        targetTag: disputeTag,
        bond: parseEther(disputeForm.bond),
        liveness: parseInt(disputeForm.liveness),
      });

      console.log(
        `Dispute raised at transaction hash ${response.txHash}, Dispute ID: ${response.disputeId}`
      );

      // Reset form and close modal
      setDisputeForm({
        targetIpId: "",
        targetTag: "",
        evidenceFile: null,
        evidenceDescription: "",
        bond: "0.1",
        liveness: "2592000",
      });
      setEvidenceCid(null);
      setShowCreateDispute(false);

      // Refresh disputes list
      await fetchDisputes();

      // Show success message
      alert(
        `Dispute created successfully! Transaction hash: ${response.txHash}`
      );
    } catch (err) {
      console.error("Failed to create dispute:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create dispute. Please try again."
      );
    } finally {
      setCreatingDispute(false);
    }
  };

  // Handle counter dispute
  const handleCounterDispute = async (disputeId: string) => {
    if (!counterDisputeForm.ipId.trim()) {
      setError("Please enter the IP ID");
      return;
    }

    if (!counterEvidenceCid) {
      setError("Please upload counter evidence first");
      return;
    }

    setSubmittingCounterDispute(true);
    setError(null);

    try {
      const storyClient = getStoryClient();

      // First get the assertion ID from dispute ID
      const assertionId = await storyClient.dispute.disputeIdToAssertionId(
        parseInt(disputeId)
      );

      // Submit counter dispute
      const response = await storyClient.dispute.disputeAssertion({
        ipId: counterDisputeForm.ipId.trim() as `0x${string}`,
        assertionId: assertionId,
        counterEvidenceCID: counterEvidenceCid,
      });

      console.log(
        `Counter dispute submitted at transaction hash ${response.txHash}`
      );

      // Reset form and close modal
      setCounterDisputeForm({
        ipId: "",
        counterEvidenceFile: null,
        counterEvidenceDescription: "",
      });
      setCounterEvidenceCid(null);
      setShowCounterDispute(false);

      // Refresh disputes list
      await fetchDisputes();

      // Show success message
      alert(
        `Counter dispute submitted successfully! Transaction hash: ${response.txHash}`
      );
    } catch (err) {
      console.error("Failed to submit counter dispute:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit counter dispute. Please try again."
      );
    } finally {
      setSubmittingCounterDispute(false);
    }
  };

  // Upload counter evidence
  const handleUploadCounterEvidence = async () => {
    if (
      !counterDisputeForm.counterEvidenceFile ||
      !counterDisputeForm.counterEvidenceDescription.trim()
    ) {
      setError(
        "Please select a file and provide a description for the counter evidence"
      );
      return;
    }

    setUploadingCounterEvidence(true);
    try {
      const cid = await uploadEvidenceToIPFS(
        counterDisputeForm.counterEvidenceFile,
        counterDisputeForm.counterEvidenceDescription
      );
      setCounterEvidenceCid(cid);
      setError(null);
    } catch (err) {
      console.error("Failed to upload counter evidence:", err);
      setError("Failed to upload counter evidence to IPFS. Please try again.");
    } finally {
      setUploadingCounterEvidence(false);
    }
  };

  // Handle counter evidence file selection
  const handleCounterEvidenceFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setCounterDisputeForm((prev) => ({ ...prev, counterEvidenceFile: file }));
      setCounterEvidenceCid(null); // Reset CID when new file is selected
    }
  };

  const closeCounterDisputeModal = () => {
    setShowCounterDispute(false);
    setCounterDisputeForm({
      ipId: "",
      counterEvidenceFile: null,
      counterEvidenceDescription: "",
    });
    setCounterEvidenceCid(null);
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
              Disputes & Enforcement
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage disputes on Story Protocol network
            </p>
          </div>
          <div className="flex gap-3">
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
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Aeneid Testnet
              </button>
              <button
                onClick={() => setSelectedChain("story")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedChain === "story"
                    ? "bg-white shadow-sm text-purple-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Mainnet
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-amber-800">{error}</span>
            <button
              onClick={handleRefresh}
              className="ml-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dispute Stats - Based on real data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-blue-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Disputes
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {disputes.length}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Scale className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-yellow-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {
                    disputes.filter((d) => d.status.toLowerCase() === "pending")
                      .length
                  }
                </p>
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
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {
                    disputes.filter((d) =>
                      ["resolved", "won"].includes(d.status.toLowerCase())
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-emerald-300/50 hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Network</p>
                <p className="text-sm font-bold text-emerald-600 mt-1">
                  {selectedChain === "story-aeneid" ? "Testnet" : "Mainnet"}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                <Globe className="h-6 w-6 text-white" />
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
                placeholder="Search disputes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm min-w-[250px]"
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
              <option value="escalated">Escalated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-6">
        {filteredDisputes.map((dispute) => (
          <div
            key={dispute.id}
            className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-purple-300/50 overflow-hidden"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-1 h-16 bg-gradient-to-b ${getStatusColor(
                      dispute.status
                    )} rounded-full`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors mb-1">
                      Dispute #{dispute.id}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        Target IP: {formatAddress(dispute.targetIpAsset)}
                      </span>
                      <span>•</span>
                      <span>Tag: {dispute.currentTag}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700`}
                  >
                    {dispute.status.toUpperCase()}
                  </span>
                  {getStatusIcon(dispute.status)}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Initiator
                  </h4>
                  <p className="font-mono text-sm text-gray-900">
                    {formatAddress(dispute.initiator)}
                  </p>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Block Info
                  </h4>
                  <p className="text-sm text-gray-900">
                    Block: {dispute.blockNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Time: {formatTimestamp(dispute.blockTimestamp)}
                  </p>
                </div>

                <div className="bg-gray-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Evidence
                  </h4>
                  <p className="text-sm text-gray-900">
                    Hash:{" "}
                    {dispute.evidenceHash
                      ? formatAddress(dispute.evidenceHash)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => handleViewDetails(dispute.id)}
                  disabled={loadingDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {loadingDetails ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  View Details
                </button>
                <button
                  onClick={() => handleViewOnStoryProtocol(dispute.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Story Protocol
                </button>
                {dispute.umaLink && (
                  <button
                    onClick={() => handleViewUMA(dispute.umaLink!)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    UMA
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-gray-200/50">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-center">Loading disputes...</p>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredDisputes.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </button>

          <div className="px-4 py-2 text-gray-600">
            {disputes.length} disputes loaded
          </div>

          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNext}
            className="flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Dispute Details Modal */}
      {showDisputeModal && selectedDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Dispute Details
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 flex-shrink-0">
                        Dispute ID:
                      </span>
                      <span className="font-mono text-right break-all ml-2">
                        {selectedDispute.id}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 flex-shrink-0">
                        Status:
                      </span>
                      <span className="font-medium text-right ml-2">
                        {selectedDispute.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 flex-shrink-0">
                        Initiator:
                      </span>
                      <span className="font-mono text-right break-all ml-2 max-w-[200px]">
                        {formatAddress(selectedDispute.initiator)}
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 flex-shrink-0">
                        Target IP ID:
                      </span>
                      <span className="font-mono text-right break-all ml-2 max-w-[200px]">
                        {formatAddress(selectedDispute.targetIpId)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Timestamps
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Block Number:</span>
                      <span className="font-mono">
                        {selectedDispute.blockNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Block Time:</span>
                      <span>
                        {formatTimestamp(selectedDispute.blockTimestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dispute Time:</span>
                      <span>
                        {formatTimestamp(selectedDispute.disputeTimestamp)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Liveness:</span>
                      <span>
                        {Math.floor(selectedDispute.liveness / 3600)} hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Evidence</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-gray-600 block mb-1">
                      Evidence Hash:
                    </span>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-mono text-xs break-all leading-relaxed">
                        {selectedDispute.evidenceHash}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">
                      Counter Evidence Hash:
                    </span>
                    <div className="bg-white p-3 rounded-lg border">
                      <p className="font-mono text-xs break-all leading-relaxed">
                        {selectedDispute.counterEvidenceHash}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Technical Details
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <span className="text-gray-600 block mb-1">
                        Arbitration Policy:
                      </span>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-mono text-xs break-all leading-relaxed">
                          {selectedDispute.arbitrationPolicy}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">
                        Transaction Hash:
                      </span>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-mono text-xs break-all leading-relaxed">
                          {selectedDispute.transactionHash}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 block mb-1">Target:</span>
                      <div className="bg-white p-3 rounded-lg border">
                        <p className="font-mono text-xs break-all leading-relaxed max-w-full overflow-hidden">
                          {selectedDispute.targetIpId}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600">Current Tag:</span>
                      <span className="font-medium ml-2">
                        {selectedDispute.currentTag}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Target Tag:</span>
                      <span className="font-medium ml-2">
                        {selectedDispute.targetTag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Section */}
              {selectedDispute.data && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Dispute Data
                  </h3>
                  <div className="bg-white rounded-lg border max-h-64 overflow-y-auto">
                    <pre className="text-xs p-4 whitespace-pre-wrap break-all leading-relaxed">
                      {selectedDispute.data}
                    </pre>
                  </div>
                </div>
              )}

              {/* UMA Link */}
              {selectedDispute.umaLink && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    External Links
                  </h3>
                  <a
                    href={selectedDispute.umaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on UMA
                  </a>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => handleViewOnStoryProtocol(selectedDispute.id)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View on Story Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Dispute Section */}
      <div className="mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Dispute
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Raise a dispute against an IP asset for infringement or improper
                registration
              </p>
            </div>
            <button
              onClick={() => setShowCreateDispute(!showCreateDispute)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              <Plus
                className={`h-4 w-4 transition-transform duration-300 ${
                  showCreateDispute ? "rotate-45" : ""
                }`}
              />
              {showCreateDispute ? "Cancel" : "Create Dispute"}
            </button>
          </div>

          {showCreateDispute && (
            <div className="space-y-6 border-t border-gray-200/50 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target IP ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target IP ID *
                  </label>
                  <input
                    type="text"
                    value={disputeForm.targetIpId}
                    onChange={(e) =>
                      setDisputeForm((prev) => ({
                        ...prev,
                        targetIpId: e.target.value,
                      }))
                    }
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-mono text-sm"
                  />
                </div>

                {/* Dispute Tag */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Tag *
                  </label>{" "}
                  <select
                    value={disputeForm.targetTag}
                    onChange={(e) =>
                      setDisputeForm((prev) => ({
                        ...prev,
                        targetTag: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  >
                    <option value="">Select a dispute tag</option>
                    <option value="IMPROPER_REGISTRATION">
                      Improper Registration
                    </option>
                    <option value="IMPROPER_USAGE">Improper Usage</option>
                    <option value="IMPROPER_PAYMENT">Improper Payment</option>
                    <option value="CONTENT_STANDARDS_VIOLATION">
                      Content Standards Violation
                    </option>
                    <option value="IN_DISPUTE">In Dispute</option>
                  </select>
                </div>

                {/* Bond Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bond Amount (IP Tokens) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    value={disputeForm.bond}
                    onChange={(e) =>
                      setDisputeForm((prev) => ({
                        ...prev,
                        bond: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: 0.1 IP tokens
                  </p>
                </div>

                {/* Liveness Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liveness Period (seconds) *
                  </label>
                  <select
                    value={disputeForm.liveness}
                    onChange={(e) =>
                      setDisputeForm((prev) => ({
                        ...prev,
                        liveness: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                  >
                    <option value="604800">7 days (604,800 seconds)</option>
                    <option value="1209600">14 days (1,209,600 seconds)</option>
                    <option value="2592000">30 days (2,592,000 seconds)</option>
                    <option value="5184000">60 days (5,184,000 seconds)</option>
                  </select>
                </div>
              </div>

              {/* Evidence Section */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Dispute Evidence
                </h3>

                <div className="space-y-4">
                  {/* Evidence Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidence Description *
                    </label>
                    <textarea
                      value={disputeForm.evidenceDescription}
                      onChange={(e) =>
                        setDisputeForm((prev) => ({
                          ...prev,
                          evidenceDescription: e.target.value,
                        }))
                      }
                      placeholder="Describe the evidence you're providing to support this dispute..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Evidence File *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleEvidenceFileChange}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.zip"
                        className="hidden"
                        id="evidence-file"
                      />
                      <label
                        htmlFor="evidence-file"
                        className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300/50 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <Upload className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">
                          {disputeForm.evidenceFile
                            ? disputeForm.evidenceFile.name
                            : "Click to upload evidence file"}
                        </span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, images, videos, ZIP
                      files
                    </p>
                  </div>

                  {/* Upload Evidence Button */}
                  {disputeForm.evidenceFile &&
                    disputeForm.evidenceDescription.trim() &&
                    !evidenceCid && (
                      <button
                        onClick={handleUploadEvidence}
                        disabled={uploadingEvidence}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {uploadingEvidence ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                        {uploadingEvidence
                          ? "Uploading to IPFS..."
                          : "Upload Evidence"}
                      </button>
                    )}

                  {/* Evidence CID Display */}
                  {evidenceCid && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">
                          Evidence uploaded successfully
                        </span>
                      </div>
                      <p className="text-sm text-green-700">
                        <strong>IPFS CID:</strong>{" "}
                        <code className="bg-green-100 px-2 py-1 rounded text-xs">
                          {evidenceCid}
                        </code>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Validation Status */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Validation Checklist:
                </h4>
                <div className="space-y-1 text-sm">
                  <div
                    className={`flex items-center gap-2 ${
                      disputeForm.targetIpId.trim()
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {disputeForm.targetIpId.trim() ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Target IP ID:{" "}
                    {disputeForm.targetIpId.trim() ? "Provided" : "Required"}
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      disputeForm.targetTag ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {disputeForm.targetTag ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Dispute Tag:{" "}
                    {disputeForm.targetTag ? `Selected (${disputeForm.targetTag})` : "Required"}
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      evidenceCid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {evidenceCid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                    Evidence Upload: {evidenceCid ? "Completed" : "Required"}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    <strong>Available Dispute Tags:</strong> {Object.keys(DisputeTargetTag).join(', ')}
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200/50">
                <button
                  onClick={() => setShowCreateDispute(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDispute}
                  disabled={
                    creatingDispute ||
                    !evidenceCid ||
                    !disputeForm.targetIpId.trim() ||
                    !disputeForm.targetTag
                  }
                  title={
                    creatingDispute
                      ? "Creating dispute..."
                      : !disputeForm.targetIpId.trim()
                      ? "Please enter Target IP ID"
                      : !disputeForm.targetTag
                      ? "Please select a Dispute Tag"
                      : !evidenceCid
                      ? "Please upload evidence first"
                      : "Ready to create dispute"
                  }
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingDispute ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Scale className="h-4 w-4" />
                  )}
                  {creatingDispute ? "Creating Dispute..." : "Create Dispute"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!loading && filteredDisputes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-gray-200/50">
            <Scale className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No disputes found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "No disputes are currently available on this network"}
            </p>
          </div>
        </div>
      )}

      {/* Counter Dispute Modal - New feature */}
      {showCounterDispute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Submit Counter Dispute
              </h2>
              <button
                onClick={closeCounterDisputeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Counter Dispute Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target IP ID *
                  </label>
                  <input
                    type="text"
                    value={counterDisputeForm.ipId}
                    onChange={(e) =>
                      setCounterDisputeForm((prev) => ({
                        ...prev,
                        ipId: e.target.value,
                      }))
                    }
                    placeholder="0x..."
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm font-mono text-sm"
                  />
                </div>

                {/* Evidence Section */}
                <div className="bg-gray-50/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Counter Evidence
                  </h3>

                  <div className="space-y-4">
                    {/* Evidence Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Evidence Description *
                      </label>
                      <textarea
                        value={counterDisputeForm.counterEvidenceDescription}
                        onChange={(e) =>
                          setCounterDisputeForm((prev) => ({
                            ...prev,
                            counterEvidenceDescription: e.target.value,
                          }))
                        }
                        placeholder="Describe the evidence you're providing for the counter dispute..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Evidence File *
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleCounterEvidenceFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.zip"
                          className="hidden"
                          id="counter-evidence-file"
                        />
                        <label
                          htmlFor="counter-evidence-file"
                          className="flex items-center gap-3 w-full px-4 py-3 border border-gray-300/50 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <Upload className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-600">
                            {counterDisputeForm.counterEvidenceFile
                              ? counterDisputeForm.counterEvidenceFile.name
                              : "Click to upload counter evidence file"}
                          </span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, DOC, DOCX, images, videos, ZIP
                        files
                      </p>
                    </div>

                    {/* Upload Evidence Button */}
                    {counterDisputeForm.counterEvidenceFile &&
                      counterDisputeForm.counterEvidenceDescription.trim() &&
                      !counterEvidenceCid && (
                        <button
                          onClick={handleUploadCounterEvidence}
                          disabled={uploadingCounterEvidence}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {uploadingCounterEvidence ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          {uploadingCounterEvidence
                            ? "Uploading to IPFS..."
                            : "Upload Evidence"}
                        </button>
                      )}

                    {/* Evidence CID Display */}
                    {counterEvidenceCid && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-900">
                            Evidence uploaded successfully
                          </span>
                        </div>
                        <p className="text-sm text-green-700">
                          <strong>IPFS CID:</strong>{" "}
                          <code className="bg-green-100 px-2 py-1 rounded text-xs">
                            {counterEvidenceCid}
                          </code>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeCounterDisputeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() =>
                  selectedDispute && handleCounterDispute(selectedDispute.id)
                }
                disabled={
                  submittingCounterDispute ||
                  !counterEvidenceCid ||
                  !counterDisputeForm.ipId.trim() ||
                  !selectedDispute
                }
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingCounterDispute ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Scale className="h-4 w-4" />
                )}
                {submittingCounterDispute
                  ? "Submitting Counter Dispute..."
                  : "Submit Counter Dispute"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputesEnforcement;
