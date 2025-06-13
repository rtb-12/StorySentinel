import React, { useState } from "react";
import {
  Upload,
  Image,
  Music,
  Video,
  File,
  Plus,
  Loader2,
  CheckCircle,
  ExternalLink,
  Hash,
  Globe,
  Wallet,
  Shield,
  Zap,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import {
  SPGNFTContractAddress,
  networkInfo,
  registerIPAsset,
} from "../utils/storyProtocol";
import {
  initializeStoryClient,
  validatePrivateKey,
} from "../utils/storyClient";
import backendApiService, {
  type YakoaTokenRegistrationResponse,
} from "../services/backendApi";

interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "audio" | "video" | "document";
}

interface Creator {
  name: string;
  address: string;
  contributionPercent: number;
}

interface NFTAttribute {
  key: string;
  value: string;
}

interface IPMetadata {
  title: string;
  description: string;
  creators: Creator[];
  image?: string;
  mediaUrl?: string;
  mediaType?: string;
  [key: string]: unknown;
}

interface NFTMetadata {
  name: string;
  description: string;
  image?: string;
  animation_url?: string;
  attributes: NFTAttribute[];
}

interface CreateIPResult {
  txHash: string;
  ipId: string;
  licenseTermsIds: string[];
  explorerUrl: string;
  yakoaResult?: YakoaTokenRegistrationResponse;
  yakoaTokenId?: string;
}

const CreateIP: React.FC = () => {
  const account = useActiveAccount();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<CreateIPResult | null>(null);
  const [checkingInfringement, setCheckingInfringement] = useState(false);

  // Form state
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null);
  const [imageFile, setImageFile] = useState<MediaFile | null>(null);
  const [ipMetadata, setIpMetadata] = useState<IPMetadata>({
    title: "",
    description: "",
    creators: [
      {
        name: "",
        address: account?.address || "",
        contributionPercent: 100,
      },
    ],
  });
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata>({
    name: "",
    description: "",
    attributes: [{ key: "", value: "" }],
  });

  // License terms
  const [defaultMintingFee, setDefaultMintingFee] = useState(1);
  const [commercialRevShare, setCommercialRevShare] = useState(5);

  const getFileType = (
    file: File
  ): "image" | "audio" | "video" | "document" => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    if (file.type.startsWith("video/")) return "video";
    return "document";
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-6 w-6" />;
      case "audio":
        return <Music className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "media" | "image"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    const fileType = getFileType(file);
    const fileData: MediaFile = { file, preview, type: fileType };

    if (type === "media") {
      setMediaFile(fileData);
    } else {
      setImageFile(fileData);
    }
  };

  const addCreator = () => {
    setIpMetadata((prev) => ({
      ...prev,
      creators: [
        ...prev.creators,
        { name: "", address: "", contributionPercent: 0 },
      ],
    }));
  };

  const updateCreator = (
    index: number,
    field: keyof Creator,
    value: string | number
  ) => {
    setIpMetadata((prev) => ({
      ...prev,
      creators: prev.creators.map((creator, i) =>
        i === index ? { ...creator, [field]: value } : creator
      ),
    }));
  };

  const removeCreator = (index: number) => {
    setIpMetadata((prev) => ({
      ...prev,
      creators: prev.creators.filter((_, i) => i !== index),
    }));
  };

  const addAttribute = () => {
    setNftMetadata((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));
  };

  const updateAttribute = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    setNftMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) =>
        i === index ? { ...attr, [field]: value } : attr
      ),
    }));
  };

  const removeAttribute = (index: number) => {
    setNftMetadata((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return (
          !!mediaFile &&
          !!imageFile &&
          !!ipMetadata.title &&
          !!ipMetadata.description
        );
      case 2:
        return (
          ipMetadata.creators.every(
            (creator) =>
              creator.name && creator.address && creator.contributionPercent > 0
          ) &&
          ipMetadata.creators.reduce(
            (sum, creator) => sum + creator.contributionPercent,
            0
          ) === 100
        );
      case 3:
        return !!nftMetadata.name && !!nftMetadata.description;
      default:
        return false;
    }
  };

  const handleCreateIP = async () => {
    if (
      !ipMetadata.title ||
      !ipMetadata.description ||
      ipMetadata.creators.length === 0
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Check if private key is configured
      const privateKey = import.meta.env.VITE_STORY_PRIVATE_KEY;
      if (!privateKey) {
        throw new Error(
          "Story Protocol private key not configured. Please set VITE_STORY_PRIVATE_KEY in your .env file"
        );
      }

      // Validate private key format
      if (!validatePrivateKey(privateKey)) {
        throw new Error(
          "Invalid private key format. Must be 64 hex characters (with or without 0x prefix)"
        );
      }

      // Initialize Story client with private key
      const client = initializeStoryClient(privateKey);

      // Step 1: Use the new registerIPAsset workflow
      setUploadProgress(25);
      const result = await registerIPAsset({
        title: ipMetadata.title,
        description: ipMetadata.description,
        creators: ipMetadata.creators,
        file: mediaFile?.file || imageFile?.file,
        licenseTerms: {
          defaultMintingFee: defaultMintingFee,
          commercialRevShare: commercialRevShare,
        },
      });

      setUploadProgress(50);

      // Step 2: Register IP Asset with Story Protocol
      if (!SPGNFTContractAddress) {
        throw new Error("SPG NFT Contract address not configured");
      }

      const response = await client.ipAsset.mintAndRegisterIpAssetWithPilTerms({
        spgNftContract: SPGNFTContractAddress,
        licenseTermsData: [
          {
            terms: {
              transferable: true,
              royaltyPolicy:
                "0x0000000000000000000000000000000000000000" as `0x${string}`,
              defaultMintingFee: "0",
              expiration: "0",
              commercialUse: false,
              commercialAttribution: false,
              commercializerChecker:
                "0x0000000000000000000000000000000000000000" as `0x${string}`,
              commercializerCheckerData: "0x",
              commercialRevShare: 0,
              commercialRevCeiling: "0",
              derivativesAllowed: true,
              derivativesAttribution: false,
              derivativesApproval: false,
              derivativesReciprocal: false,
              derivativeRevCeiling: "0",
              currency:
                "0x0000000000000000000000000000000000000000" as `0x${string}`,
              uri: "",
            },
          },
        ],
        ipMetadata: {
          ipMetadataURI: `https://ipfs.io/ipfs/${result.ipIpfsHash}`,
          ipMetadataHash: result.ipHash as `0x${string}`,
          nftMetadataURI: `https://ipfs.io/ipfs/${result.nftIpfsHash}`,
          nftMetadataHash: result.nftHash as `0x${string}`,
        },
      });

      setUploadProgress(75);

      // Step 3: Register with Yakoa for IP protection monitoring
      let yakoaResult: YakoaTokenRegistrationResponse | undefined;
      let yakoaTokenId: string | undefined;

      try {
        // Collect media URLs for Yakoa registration
        const mediaUrls: string[] = [];
        if (result.ipIpfsHash) {
          mediaUrls.push(`https://ipfs.io/ipfs/${result.ipIpfsHash}`);
        }
        if (result.nftIpfsHash) {
          mediaUrls.push(`https://ipfs.io/ipfs/${result.nftIpfsHash}`);
        }

        // Create Yakoa token registration data
        const yakoaTokenData =
          await backendApiService.createYakoaRegistrationData(
            {
              spgNftContract: SPGNFTContractAddress,
              tokenId: response.tokenId ? response.tokenId.toString() : "1",
              txHash: response.txHash,
              blockNumber: 1, // Would need to get actual block number
              ipHash: result.ipHash,
            },
            ipMetadata,
            mediaUrls,
            account?.address || ipMetadata.creators[0]?.address || ""
          );

        // The token identifier is already generated in the backend
        // yakoaTokenData.id is now a string, not an object
        yakoaTokenId = yakoaTokenData.id;

        // Register with Yakoa
        yakoaResult = await backendApiService.registerTokenWithYakoa(
          yakoaTokenData
        );
        console.log("Successfully registered with Yakoa:", yakoaResult);
      } catch (yakoaError) {
        console.warn(
          "Failed to register with Yakoa (continuing anyway):",
          yakoaError
        );
        // Don't fail the entire process if Yakoa registration fails
      }

      setUploadProgress(100);

      const finalResult: CreateIPResult = {
        txHash: response.txHash || "",
        ipId: response.ipId || "",
        licenseTermsIds: [],
        explorerUrl: `${networkInfo.protocolExplorer}/ipa/${
          response.ipId || ""
        }`,
        yakoaResult,
        yakoaTokenId,
      };

      setResult(finalResult);
      setStep(5);
    } catch (error) {
      console.error("Error creating IP:", error);
      alert("Failed to create IP asset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInfringement = async () => {
    if (!result?.yakoaTokenId) return;

    setCheckingInfringement(true);
    try {
      const tokenData = await backendApiService.getTokenFromYakoa(
        result.yakoaTokenId
      );

      // Update result with latest infringement data
      setResult((prev) =>
        prev
          ? {
              ...prev,
              yakoaResult: {
                ...prev.yakoaResult!,
                infringements: tokenData.infringements,
              },
            }
          : null
      );

      if (tokenData.infringements?.status === "completed") {
        if (tokenData.infringements?.reasons?.length > 0) {
          alert(
            `Infringement detected! Reasons: ${tokenData.infringements.reasons.join(
              ", "
            )}`
          );
        } else {
          alert("No infringement detected. Your IP is safe!");
        }
      } else if (tokenData.infringements?.status === "failed") {
        const reasons =
          tokenData.infringements?.reasons?.join(", ") || "Unknown reasons";
        alert(
          `Infringement monitoring failed: ${reasons}. This may be due to hash mismatches or other technical issues.`
        );
      } else if (tokenData.infringements?.status === "pending") {
        alert(
          "Infringement monitoring is in progress. Please check again later."
        );
      } else if (tokenData.infringements?.status) {
        alert(`Infringement check status: ${tokenData.infringements.status}`);
      } else {
        alert(
          "Infringement monitoring is initializing. Please check again later."
        );
      }
    } catch (error) {
      console.error("Failed to check infringement status:", error);
      alert("Failed to check infringement status. Please try again later.");
    } finally {
      setCheckingInfringement(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setMediaFile(null);
    setImageFile(null);
    setIpMetadata({
      title: "",
      description: "",
      creators: [
        {
          name: "",
          address: account?.address || "",
          contributionPercent: 100,
        },
      ],
    });
    setNftMetadata({
      name: "",
      description: "",
      attributes: [{ key: "", value: "" }],
    });
    setResult(null);
    setUploadProgress(0);
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
              Create IP Asset
            </h1>
            <p className="text-gray-600 mt-2">
              Upload your content and register it as an IP asset on Story
              Protocol
            </p>
          </div>
          {step > 1 && step < 5 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              Back
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-purple-600">
              {step}/4
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Upload</span>
            <span>Creators</span>
            <span>NFT Data</span>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
        {step === 1 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Upload Content & Metadata
              </h2>
              <p className="text-gray-600">
                Upload your main content file and cover image
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Media File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Content File *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "media")}
                    className="hidden"
                    id="media-upload"
                    accept="image/*,audio/*,video/*,.pdf,.doc,.docx"
                  />
                  <label
                    htmlFor="media-upload"
                    className="group flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all duration-300"
                  >
                    {mediaFile ? (
                      <div className="flex flex-col items-center">
                        {getFileIcon(mediaFile.type)}
                        <p className="mt-2 text-sm font-medium text-gray-900">
                          {mediaFile.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(mediaFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-10 w-10 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload main content
                        </p>
                        <p className="text-xs text-gray-500">
                          Audio, Video, Image, or Document
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cover Image *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    id="image-upload"
                    accept="image/*"
                  />
                  <label
                    htmlFor="image-upload"
                    className="group flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 hover:border-purple-400 transition-all duration-300 overflow-hidden"
                  >
                    {imageFile ? (
                      <img
                        src={imageFile.preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Image className="h-10 w-10 text-gray-400 group-hover:text-purple-500 transition-colors" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload cover image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Basic Metadata */}
            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={ipMetadata.title}
                  onChange={(e) =>
                    setIpMetadata((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter the title of your IP asset"
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={ipMetadata.description}
                  onChange={(e) =>
                    setIpMetadata((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your IP asset, its purpose, and any relevant details"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!validateStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: Creators
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Creator Information
              </h2>
              <p className="text-gray-600">
                Define who created this IP asset and their contribution
                percentages
              </p>
            </div>

            <div className="space-y-4">
              {ipMetadata.creators.map((creator, index) => (
                <div
                  key={index}
                  className="bg-gray-50/50 rounded-xl p-6 border border-gray-200/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Creator {index + 1}
                    </h3>
                    {ipMetadata.creators.length > 1 && (
                      <button
                        onClick={() => removeCreator(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={creator.name}
                        onChange={(e) =>
                          updateCreator(index, "name", e.target.value)
                        }
                        placeholder="Creator name"
                        className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wallet Address *
                      </label>
                      <input
                        type="text"
                        value={creator.address}
                        onChange={(e) =>
                          updateCreator(index, "address", e.target.value)
                        }
                        placeholder="0x..."
                        className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 font-mono text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contribution % *
                      </label>
                      <input
                        type="number"
                        value={creator.contributionPercent}
                        onChange={(e) =>
                          updateCreator(
                            index,
                            "contributionPercent",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addCreator}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 text-gray-600 hover:text-purple-600"
              >
                <Plus className="h-4 w-4" />
                Add Another Creator
              </button>

              {/* Contribution Summary */}
              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">
                    Total Contribution:
                  </span>
                  <span
                    className={`font-bold ${
                      ipMetadata.creators.reduce(
                        (sum, c) => sum + c.contributionPercent,
                        0
                      ) === 100
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {ipMetadata.creators.reduce(
                      (sum, c) => sum + c.contributionPercent,
                      0
                    )}
                    %
                  </span>
                </div>
                {ipMetadata.creators.reduce(
                  (sum, c) => sum + c.contributionPercent,
                  0
                ) !== 100 && (
                  <p className="text-sm text-red-600 mt-1">
                    Total contribution must equal 100%
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!validateStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next: NFT Metadata
                <Zap className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                NFT Metadata
              </h2>
              <p className="text-gray-600">
                Configure the NFT that will represent ownership of your IP asset
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NFT Name *
                </label>
                <input
                  type="text"
                  value={nftMetadata.name}
                  onChange={(e) =>
                    setNftMetadata((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Name for the NFT"
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NFT Description *
                </label>
                <textarea
                  value={nftMetadata.description}
                  onChange={(e) =>
                    setNftMetadata((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Description for the NFT that represents ownership"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70 backdrop-blur-sm"
                />
              </div>

              {/* License Terms */}
              <div className="bg-green-50/50 rounded-xl p-6 border border-green-200/50">
                <h3 className="font-medium text-green-900 mb-4">
                  License Terms
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Minting Fee (ETH)
                    </label>
                    <input
                      type="number"
                      value={defaultMintingFee}
                      onChange={(e) =>
                        setDefaultMintingFee(parseFloat(e.target.value) || 0)
                      }
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commercial Revenue Share (%)
                    </label>
                    <input
                      type="number"
                      value={commercialRevShare}
                      onChange={(e) =>
                        setCommercialRevShare(parseInt(e.target.value) || 0)
                      }
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/70"
                    />
                  </div>
                </div>
              </div>

              {/* NFT Attributes */}
              <div>
                <h3 className="font-medium text-gray-900 mb-4">
                  NFT Attributes
                </h3>
                <div className="space-y-3">
                  {nftMetadata.attributes.map((attribute, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={attribute.key}
                        onChange={(e) =>
                          updateAttribute(index, "key", e.target.value)
                        }
                        placeholder="Attribute name"
                        className="flex-1 px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70"
                      />
                      <input
                        type="text"
                        value={attribute.value}
                        onChange={(e) =>
                          updateAttribute(index, "value", e.target.value)
                        }
                        placeholder="Attribute value"
                        className="flex-1 px-4 py-2 border border-gray-300/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white/70"
                      />
                      {nftMetadata.attributes.length > 1 && (
                        <button
                          onClick={() => removeAttribute(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addAttribute}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 text-gray-600 hover:text-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Attribute
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!validateStep(3)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Create
                <Shield className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Review & Create IP Asset
              </h2>
              <p className="text-gray-600">
                Review all information before creating your IP asset
              </p>
            </div>

            {!account && (
              <div className="bg-yellow-50/50 border border-yellow-200/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Wallet className="h-5 w-5" />
                  <span className="font-medium">Wallet Required</span>
                </div>
                <p className="text-yellow-700 mt-1">
                  Please connect your wallet to create the IP asset.
                </p>
              </div>
            )}

            {/* Review Summary */}
            <div className="space-y-6">
              {/* Files */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">
                  Uploaded Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mediaFile && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
                      {getFileIcon(mediaFile.type)}
                      <div>
                        <p className="font-medium text-gray-900">
                          Main Content
                        </p>
                        <p className="text-sm text-gray-600">
                          {mediaFile.file.name}
                        </p>
                      </div>
                    </div>
                  )}
                  {imageFile && (
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200/50">
                      <Image className="h-6 w-6" />
                      <div>
                        <p className="font-medium text-gray-900">Cover Image</p>
                        <p className="text-sm text-gray-600">
                          {imageFile.file.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="bg-gray-50/50 rounded-xl p-6">
                <h3 className="font-medium text-gray-900 mb-4">IP Metadata</h3>
                <div className="space-y-2">
                  <p>
                    <strong>Title:</strong> {ipMetadata.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {ipMetadata.description}
                  </p>
                  <div>
                    <strong>Creators:</strong>
                    <ul className="mt-1 space-y-1">
                      {ipMetadata.creators.map((creator, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {creator.name} ({creator.contributionPercent}%) -{" "}
                          {creator.address.slice(0, 6)}...
                          {creator.address.slice(-4)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* License Terms */}
              <div className="bg-green-50/50 rounded-xl p-6 border border-green-200/50">
                <h3 className="font-medium text-green-900 mb-4">
                  License Terms
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>Minting Fee:</strong> {defaultMintingFee} ETH
                  </p>
                  <p>
                    <strong>Revenue Share:</strong> {commercialRevShare}%
                  </p>
                </div>
              </div>
            </div>

            {loading && (
              <div className="mt-8 bg-blue-50/50 rounded-xl p-6 border border-blue-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Creating IP Asset...
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-blue-700 mt-2">
                  {uploadProgress < 25 && "Uploading files to IPFS..."}
                  {uploadProgress >= 25 &&
                    uploadProgress < 50 &&
                    "Generating metadata hashes..."}
                  {uploadProgress >= 50 &&
                    uploadProgress < 75 &&
                    "Registering IP asset on Story Protocol..."}
                  {uploadProgress >= 75 &&
                    uploadProgress < 100 &&
                    "Registering with Yakoa for IP protection..."}
                  {uploadProgress >= 100 && "IP Asset created successfully!"}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep(3)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
              >
                Back
              </button>
              <button
                onClick={handleCreateIP}
                disabled={loading || !account}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Create IP Asset
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 5 && result && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                IP Asset Created Successfully!
              </h2>
              <p className="text-gray-600">
                Your content has been registered as an IP asset on Story
                Protocol
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {/* Story Protocol Details */}
              <div className="bg-gray-50/50 rounded-xl p-6 text-left">
                <h3 className="font-medium text-gray-900 mb-4">
                  Story Protocol Registration
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>Transaction Hash:</strong>
                    </span>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                      {result.txHash}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>IP Asset ID:</strong>
                    </span>
                    <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                      {result.ipId}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      <strong>License Terms:</strong>
                    </span>
                    <span className="text-xs">
                      {result.licenseTermsIds.join(", ") ||
                        "Default Commercial Terms"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yakoa Protection Details */}
              {result.yakoaResult && (
                <div className="bg-green-50/50 rounded-xl p-6 text-left border border-green-200/50">
                  <h3 className="font-medium text-green-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    IP Protection & Monitoring
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        <strong>Protection Status:</strong>
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          result.yakoaResult?.infringements?.status === "failed"
                            ? "bg-red-100 text-red-800"
                            : result.yakoaResult?.infringements?.status ===
                              "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {result.yakoaResult?.infringements?.status === "pending"
                          ? "Monitoring Active"
                          : result.yakoaResult?.infringements?.status ===
                            "failed"
                          ? "Monitoring Failed"
                          : result.yakoaResult?.infringements?.status?.toUpperCase() ||
                            "INITIALIZING"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        <strong>Yakoa Token ID:</strong>
                      </span>
                      <code className="text-xs bg-green-100 px-2 py-1 rounded font-mono">
                        {result.yakoaTokenId}
                      </code>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>✓ IP Protection Activated:</strong> Your asset
                        is now being monitored for infringement. You'll receive
                        alerts if any unauthorized use is detected.
                      </p>
                    </div>

                    {/* Show infringement details if available */}
                    {result.yakoaResult?.infringements?.status === "failed" && (
                      <div className="mt-4 p-3 bg-red-100 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>⚠ Monitoring Issue:</strong>{" "}
                          {result.yakoaResult.infringements.reasons?.join(
                            ", "
                          ) || "Technical issue detected"}
                          . The system may need manual review.
                        </p>
                      </div>
                    )}

                    {result.yakoaResult?.infringements?.status ===
                      "completed" &&
                      result.yakoaResult.infringements.reasons?.length > 0 && (
                        <div className="mt-4 p-3 bg-red-100 rounded-lg">
                          <p className="text-sm text-red-800">
                            <strong>⚠ Potential Infringement:</strong>{" "}
                            {result.yakoaResult.infringements.reasons.join(
                              ", "
                            )}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* Yakoa Registration Failed */}
              {!result.yakoaResult && (
                <div className="bg-yellow-50/50 rounded-xl p-6 text-left border border-yellow-200/50">
                  <h3 className="font-medium text-yellow-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    IP Protection Registration
                  </h3>
                  <div className="space-y-3">
                    <p className="text-sm text-yellow-800">
                      Your IP asset was successfully registered on Story
                      Protocol, but Yakoa IP protection monitoring could not be
                      activated automatically. You can manually register for
                      protection later.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                <ExternalLink className="h-4 w-4" />
                View on Explorer
              </a>

              {result.yakoaResult && result.yakoaTokenId && (
                <button
                  onClick={handleCheckInfringement}
                  disabled={checkingInfringement}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50"
                >
                  {checkingInfringement ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  Check Infringement Status
                </button>
              )}

              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                Create Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateIP;
