import React, { useState } from "react";
import {
  Scale,
  FileText,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  ExternalLink,
  Download,
  Eye,
  MoreVertical,
  Filter,
  Search,
} from "lucide-react";

interface Dispute {
  id: string;
  title: string;
  ipAssetId: string;
  ipAssetTitle: string;
  disputeType: "infringement" | "licensing" | "ownership" | "takedown";
  status: "pending" | "in-progress" | "resolved" | "rejected" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  description: string;
  evidence: {
    id: string;
    type: "image" | "document" | "url" | "transaction";
    title: string;
    url?: string;
  }[];
  respondent: {
    platform: string;
    identifier: string;
    contact?: string;
  };
  outcome?: {
    result: "won" | "lost" | "settled";
    compensation?: string;
    terms?: string;
  };
  storyDisputeId?: string;
  timeline: {
    date: string;
    action: string;
    actor: string;
    description: string;
  }[];
}

const DisputesEnforcement: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);

  // Mock data - would come from Story Protocol dispute system
  const [disputes] = useState<Dispute[]>([
    {
      id: "1",
      title: "Unauthorized NFT Marketplace Sale",
      ipAssetId: "1",
      ipAssetTitle: "Digital Art Collection #1",
      disputeType: "infringement",
      status: "in-progress",
      priority: "high",
      createdAt: "2025-06-08T10:00:00Z",
      updatedAt: "2025-06-09T14:30:00Z",
      description:
        "User is selling our registered IP asset without permission on unauthorized marketplace",
      evidence: [
        {
          id: "1",
          type: "url",
          title: "Infringing Listing",
          url: "https://marketplace.com/item/123",
        },
        { id: "2", type: "image", title: "Screenshot Evidence" },
        { id: "3", type: "transaction", title: "Original Registration Tx" },
      ],
      respondent: {
        platform: "OpenSea Clone",
        identifier: "0x742d35cc6e5e",
        contact: "support@marketplace.com",
      },
      storyDisputeId: "dispute_001_story",
      timeline: [
        {
          date: "2025-06-08T10:00:00Z",
          action: "Created",
          actor: "System",
          description: "Dispute automatically created from alert",
        },
        {
          date: "2025-06-08T10:15:00Z",
          action: "Evidence Added",
          actor: "User",
          description: "Added screenshot and transaction proof",
        },
        {
          date: "2025-06-08T11:30:00Z",
          action: "Submitted",
          actor: "System",
          description: "Dispute submitted to Story Protocol",
        },
        {
          date: "2025-06-09T14:30:00Z",
          action: "Response Required",
          actor: "Story Protocol",
          description: "Waiting for respondent reply",
        },
      ],
    },
    {
      id: "2",
      title: "Brand Logo Misuse",
      ipAssetId: "2",
      ipAssetTitle: "Brand Logo Design",
      disputeType: "licensing",
      status: "resolved",
      priority: "medium",
      createdAt: "2025-06-05T09:00:00Z",
      updatedAt: "2025-06-07T16:45:00Z",
      description: "Company using our logo without proper licensing agreement",
      evidence: [
        {
          id: "4",
          type: "url",
          title: "Company Website",
          url: "https://company.com/about",
        },
        { id: "5", type: "document", title: "Cease & Desist Letter" },
      ],
      respondent: {
        platform: "Corporate Website",
        identifier: "TechCorp Inc.",
        contact: "legal@techcorp.com",
      },
      outcome: {
        result: "settled",
        compensation: "0.5 ETH",
        terms: "Logo removed, licensing fee paid",
      },
      storyDisputeId: "dispute_002_story",
      timeline: [
        {
          date: "2025-06-05T09:00:00Z",
          action: "Created",
          actor: "User",
          description: "Manual dispute creation",
        },
        {
          date: "2025-06-05T10:30:00Z",
          action: "Contact Attempted",
          actor: "System",
          description: "Automated takedown notice sent",
        },
        {
          date: "2025-06-06T14:00:00Z",
          action: "Response Received",
          actor: "Respondent",
          description: "Company agreed to negotiate",
        },
        {
          date: "2025-06-07T16:45:00Z",
          action: "Resolved",
          actor: "System",
          description: "Settlement reached and executed",
        },
      ],
    },
    {
      id: "3",
      title: "Video Content Copyright Claim",
      ipAssetId: "3",
      ipAssetTitle: "Product Demo Video",
      disputeType: "takedown",
      status: "pending",
      priority: "low",
      createdAt: "2025-06-09T16:20:00Z",
      updatedAt: "2025-06-09T16:20:00Z",
      description:
        "Video platform user uploaded our demo video without attribution",
      evidence: [
        {
          id: "6",
          type: "url",
          title: "Uploaded Video",
          url: "https://video-platform.com/watch/abc123",
        },
        { id: "7", type: "image", title: "Comparison Screenshot" },
      ],
      respondent: {
        platform: "YouTube Alternative",
        identifier: "user123",
        contact: "dmca@videoplatform.com",
      },
      storyDisputeId: "dispute_003_story",
      timeline: [
        {
          date: "2025-06-09T16:20:00Z",
          action: "Created",
          actor: "System",
          description: "Auto-generated from similarity detection",
        },
      ],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "resolved":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "escalated":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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

  const getDisputeTypeIcon = (type: string) => {
    switch (type) {
      case "infringement":
        return <AlertTriangle className="h-5 w-5" />;
      case "licensing":
        return <FileText className="h-5 w-5" />;
      case "ownership":
        return <Scale className="h-5 w-5" />;
      case "takedown":
        return <X className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesSearch =
      dispute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      dispute.status === filter ||
      dispute.disputeType === filter;
    return matchesSearch && matchesFilter;
  });

  const generateEvidencePackage = (disputeId: string) => {
    console.log("Generating evidence package for dispute:", disputeId);
    // Here you would implement evidence package generation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Disputes & Enforcement
          </h1>
          <p className="text-gray-600">
            Track and manage IP dispute resolution
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <Scale className="h-4 w-4 mr-2" />
          Create Dispute
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search disputes..."
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
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
          <option value="escalated">Escalated</option>
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="infringement">Infringement</option>
          <option value="licensing">Licensing</option>
          <option value="ownership">Ownership</option>
          <option value="takedown">Takedown</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Disputes</p>
              <p className="text-2xl font-bold text-blue-600">
                {
                  disputes.filter(
                    (d) => d.status === "pending" || d.status === "in-progress"
                  ).length
                }
              </p>
            </div>
            <Scale className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {disputes.filter((d) => d.status === "resolved").length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (disputes.filter(
                    (d) =>
                      d.outcome?.result === "won" ||
                      d.outcome?.result === "settled"
                  ).length /
                    disputes.filter((d) => d.outcome).length) *
                    100
                ) || 0}
                %
              </p>
            </div>
            <Scale className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Resolution</p>
              <p className="text-2xl font-bold text-gray-900">5.2 days</p>
            </div>
            <Clock className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredDisputes.map((dispute) => (
            <div
              key={dispute.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(
                        dispute.priority
                      )}`}
                    >
                      {getDisputeTypeIcon(dispute.disputeType)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {dispute.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {dispute.description}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">
                          Related to: {dispute.ipAssetTitle}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900 capitalize">
                          {dispute.disputeType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Respondent</p>
                        <p className="font-medium text-gray-900">
                          {dispute.respondent.identifier}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Created</p>
                        <p className="font-medium text-gray-900">
                          {new Date(dispute.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            dispute.status
                          )}`}
                        >
                          {dispute.status.charAt(0).toUpperCase() +
                            dispute.status.slice(1).replace("-", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            dispute.priority
                          )}`}
                        >
                          {dispute.priority.charAt(0).toUpperCase() +
                            dispute.priority.slice(1)}{" "}
                          Priority
                        </span>
                        {dispute.outcome && (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              dispute.outcome.result === "won" ||
                              dispute.outcome.result === "settled"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {dispute.outcome.result.charAt(0).toUpperCase() +
                              dispute.outcome.result.slice(1)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            setSelectedDispute(
                              selectedDispute === dispute.id ? null : dispute.id
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          {selectedDispute === dispute.id
                            ? "Hide Details"
                            : "View Details"}
                        </button>
                        <button
                          onClick={() => generateEvidencePackage(dispute.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedDispute === dispute.id && (
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Evidence */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Evidence
                            </h4>
                            <div className="space-y-2">
                              {dispute.evidence.map((evidence) => (
                                <div
                                  key={evidence.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                >
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-900">
                                      {evidence.title}
                                    </span>
                                  </div>
                                  <div className="flex space-x-1">
                                    <button className="text-blue-600 hover:text-blue-800">
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    {evidence.url && (
                                      <button className="text-blue-600 hover:text-blue-800">
                                        <ExternalLink className="h-4 w-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">
                              Timeline
                            </h4>
                            <div className="space-y-3">
                              {dispute.timeline.map((event, index) => (
                                <div
                                  key={index}
                                  className="flex items-start space-x-3"
                                >
                                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {event.action}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {event.description}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      {new Date(event.date).toLocaleString()} •{" "}
                                      {event.actor}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Outcome */}
                        {dispute.outcome && (
                          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h4 className="text-sm font-medium text-green-900 mb-2">
                              Resolution Outcome
                            </h4>
                            <p className="text-sm text-green-800 mb-2">
                              Result:{" "}
                              <span className="font-medium">
                                {dispute.outcome.result}
                              </span>
                            </p>
                            {dispute.outcome.compensation && (
                              <p className="text-sm text-green-800 mb-2">
                                Compensation:{" "}
                                <span className="font-medium">
                                  {dispute.outcome.compensation}
                                </span>
                              </p>
                            )}
                            {dispute.outcome.terms && (
                              <p className="text-sm text-green-800">
                                Terms: {dispute.outcome.terms}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDisputes.length === 0 && (
          <div className="text-center py-12">
            <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No disputes found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "No active disputes at the moment"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisputesEnforcement;
