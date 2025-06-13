import React, { useState } from "react";
import {
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ExternalLink,
  Loader2,
  AlertCircle,
  Flag,
} from "lucide-react";
import {
  backendApiService,
  type YakoaTokenRegistrationResponse,
} from "../services/backendApi";

interface InfringementData {
  tokenId: string;
  tokenData: YakoaTokenRegistrationResponse;
  lastChecked: Date;
}

const InfringementChecker: React.FC = () => {
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);
  const [infringementData, setInfringementData] =
    useState<InfringementData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [submittingDispute, setSubmittingDispute] = useState(false);

  const handleCheckInfringement = async () => {
    if (!tokenId.trim()) {
      setError("Please enter a valid token ID");
      return;
    }

    setLoading(true);
    setError(null);
    setInfringementData(null);

    try {
      const tokenData = await backendApiService.getTokenFromYakoa(
        tokenId.trim()
      );

      setInfringementData({
        tokenId: tokenId.trim(),
        tokenData,
        lastChecked: new Date(),
      });
    } catch (err) {
      console.error("Failed to check infringement:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to check infringement status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!disputeReason.trim() || !disputeDescription.trim()) {
      setError("Please fill in all dispute fields");
      return;
    }

    setSubmittingDispute(true);
    setError(null);

    try {
      // For now, we'll simulate a dispute submission
      // In a real implementation, this would call a backend API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert(
        "Dispute submitted successfully! You will receive updates on the status via email."
      );
      setShowDisputeForm(false);
      setDisputeReason("");
      setDisputeDescription("");
    } catch (err) {
      console.error("Failed to submit dispute:", err);
      setError("Failed to submit dispute. Please try again.");
    } finally {
      setSubmittingDispute(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
              Infringement Checker
            </h1>
            <p className="text-gray-600 mt-1">
              Check the infringement status of your IP assets and manage
              disputes
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Token ID Lookup
          </h2>
          <p className="text-gray-600">
            Enter your Yakoa token ID to check infringement status
          </p>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token ID
            </label>
            <input
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID (e.g., 0x123...abc:1)"
              className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
              onKeyPress={(e) => e.key === "Enter" && handleCheckInfringement()}
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCheckInfringement}
              disabled={loading || !tokenId.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              {loading ? "Checking..." : "Check Status"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {infringementData && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Token Information
              </h2>
              <p className="text-gray-600">Basic details about the IP asset</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Token ID
                </label>
                <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  {infringementData.tokenId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Creator ID
                </label>
                <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm">
                  {infringementData.tokenData.creator_id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Checked
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {formatDate(infringementData.lastChecked)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chain
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {infringementData.tokenData.registration_tx.chain}
                </div>
              </div>
            </div>
          </div>

          {/* Infringement Status */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Infringement Status
              </h2>
              <p className="text-gray-600">
                Current monitoring status and any detected infringements
              </p>
            </div>

            <div className="space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(
                    infringementData.tokenData.infringements?.status ||
                      "unknown"
                  )}
                  <span className="font-medium text-gray-900">Status:</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    infringementData.tokenData.infringements?.status ||
                      "unknown"
                  )}`}
                >
                  {infringementData.tokenData.infringements?.status?.toUpperCase() ||
                    "UNKNOWN"}
                </span>
              </div>

              {/* Status Details */}
              {infringementData.tokenData.infringements?.status ===
                "completed" && (
                <div className="space-y-4">
                  {infringementData.tokenData.infringements.reasons?.length >
                  0 ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <h3 className="font-medium text-red-900">
                          Potential Infringement Detected
                        </h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-red-800 font-medium">Reasons:</p>
                        <ul className="list-disc list-inside text-red-700 space-y-1">
                          {infringementData.tokenData.infringements.reasons.map(
                            (reason, index) => (
                              <li key={index}>{reason}</li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* Dispute Button */}
                      <div className="mt-6">
                        <button
                          onClick={() => setShowDisputeForm(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <Flag className="h-4 w-4" />
                          Raise Dispute
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h3 className="font-medium text-green-900">
                          No Infringement Detected
                        </h3>
                      </div>
                      <p className="text-green-700 mt-2">
                        Your IP asset appears to be safe. No unauthorized use
                        has been detected.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {infringementData.tokenData.infringements?.status ===
                "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-medium text-yellow-900">
                      Monitoring in Progress
                    </h3>
                  </div>
                  <p className="text-yellow-700 mt-2">
                    Your IP asset is currently being monitored for infringement.
                    This process may take some time to complete.
                  </p>
                </div>
              )}

              {infringementData.tokenData.infringements?.status ===
                "failed" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-medium text-red-900">
                      Monitoring Failed
                    </h3>
                  </div>
                  <p className="text-red-700 mt-2">
                    The infringement monitoring process failed.
                    {infringementData.tokenData.infringements.reasons?.length >
                      0 && (
                      <>
                        <br />
                        <strong>Reasons:</strong>{" "}
                        {infringementData.tokenData.infringements.reasons.join(
                          ", "
                        )}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Registration Details
              </h2>
              <p className="text-gray-600">
                Blockchain transaction information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Hash
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <code className="text-sm font-mono flex-1">
                    {infringementData.tokenData.registration_tx.hash}
                  </code>
                  <button className="text-blue-600 hover:text-blue-800">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Block Number
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {infringementData.tokenData.registration_tx.block_number}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Time
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {new Date(
                    infringementData.tokenData.registration_tx.timestamp
                  ).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metadata
                </label>
                <div className="p-3 bg-gray-50 rounded-lg text-sm">
                  {Object.keys(infringementData.tokenData.metadata).length}{" "}
                  properties
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Form Modal */}
      {showDisputeForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Flag className="h-5 w-5 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Raise Dispute
                  </h2>
                </div>
                <button
                  onClick={() => setShowDisputeForm(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dispute Reason *
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select a reason</option>
                    <option value="false_positive">
                      False Positive Detection
                    </option>
                    <option value="fair_use">Fair Use</option>
                    <option value="authorized_use">Authorized Use</option>
                    <option value="incorrect_matching">
                      Incorrect Content Matching
                    </option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    value={disputeDescription}
                    onChange={(e) => setDisputeDescription(e.target.value)}
                    placeholder="Please provide a detailed explanation of why you believe this infringement detection is incorrect..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-yellow-800 font-medium">
                        Important Note
                      </p>
                      <p className="text-yellow-700 text-sm mt-1">
                        By submitting this dispute, you acknowledge that the
                        information provided is accurate and that you have the
                        right to dispute this infringement claim. False disputes
                        may result in penalties.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowDisputeForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRaiseDispute}
                    disabled={
                      submittingDispute ||
                      !disputeReason ||
                      !disputeDescription.trim()
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingDispute ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Flag className="h-4 w-4" />
                    )}
                    {submittingDispute ? "Submitting..." : "Submit Dispute"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfringementChecker;
