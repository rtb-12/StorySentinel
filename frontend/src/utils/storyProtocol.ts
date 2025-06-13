// Story Protocol utility functions
import {
  uploadJSONToIPFS as uploadJSON,
  uploadFileToIPFS as uploadFile,
  createMetadataHash,
  getIPFSUrl,
} from "./uploadToIpfs";
import type { IpMetadata } from "@story-protocol/core-sdk";
import { networkInfo, SPGNFTContractAddress } from "./storyClient";

// Export network configuration
export { networkInfo, SPGNFTContractAddress };

/**
 * Creates commercial remix terms for licensing
 */
export const createCommercialRemixTerms = ({
  defaultMintingFee,
  commercialRevShare,
}: {
  defaultMintingFee: number;
  commercialRevShare: number;
}) => {
  return {
    transferable: true,
    royaltyPolicy:
      import.meta.env.VITE_ROYALTY_POLICY_ADDRESS ||
      "0x1234567890abcdef1234567890abcdef12345678",
    defaultMintingFee: defaultMintingFee.toString(),
    expiration: "0",
    commercialUse: true,
    commercialAttribution: true,
    commercializerChecker: "0x0000000000000000000000000000000000000000",
    commercializerCheckerData: "0x",
    commercialRevShare: commercialRevShare * 100, // Convert to basis points
    derivativesAllowed: true,
    derivativesAttribution: true,
    derivativesApproval: false,
    derivativesReciprocal: true,
    derivativeRevShare: commercialRevShare * 100,
    currency: "0x0000000000000000000000000000000000000000", // ETH
    uri: "",
  };
};

/**
 * Generate IP metadata using Story Protocol format
 */
export const generateIpMetadata = ({
  title,
  description,
  createdAt,
  creators,
  image,
  imageHash,
  mediaUrl,
  mediaHash,
  mediaType,
}: {
  title: string;
  description: string;
  createdAt?: string;
  creators: Array<{
    name: string;
    address: string;
    contributionPercent: number;
  }>;
  image?: string;
  imageHash?: string;
  mediaUrl?: string;
  mediaHash?: string;
  mediaType?: string;
}): IpMetadata => {
  const metadata: IpMetadata = {
    title,
    description,
    createdAt: createdAt || Math.floor(Date.now() / 1000).toString(),
    creators: creators.map((creator) => ({
      name: creator.name,
      address: creator.address as `0x${string}`,
      contributionPercent: creator.contributionPercent,
    })),
  };

  if (image) {
    metadata.image = image;
  }

  if (imageHash) {
    metadata.imageHash = imageHash as `0x${string}`;
  }

  if (mediaUrl) {
    metadata.mediaUrl = mediaUrl;
  }

  if (mediaHash) {
    metadata.mediaHash = mediaHash as `0x${string}`;
  }

  if (mediaType) {
    metadata.mediaType = mediaType;
  }

  return metadata;
};

/**
 * Generate NFT metadata in OpenSea format
 */
export const generateNftMetadata = ({
  name,
  description,
  image,
  attributes = [],
}: {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}) => {
  return {
    name,
    description,
    image,
    attributes: [
      ...attributes,
      {
        trait_type: "Protocol",
        value: "Story Protocol",
      },
      {
        trait_type: "Platform",
        value: "StorySentinel",
      },
      {
        trait_type: "Created",
        value: new Date().toISOString(),
      },
    ],
  };
};

/**
 * Create hash from file content
 */
export const createFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hashHex}`;
};

/**
 * Upload file to IPFS and return both hash and URL
 */
export const uploadFileToIPFS = async (
  file: File
): Promise<{ hash: string; url: string }> => {
  const hash = await uploadFile(file);
  const url = getIPFSUrl(hash);
  return { hash, url };
};

/**
 * Upload metadata to IPFS and return both hash and URL
 */
export const uploadMetadataToIPFS = async (
  metadata: IpMetadata | Record<string, unknown>
): Promise<{ hash: string; url: string; contentHash: string }> => {
  const hash = await uploadJSON(metadata);
  const url = getIPFSUrl(hash);
  const contentHash = await createMetadataHash(metadata);
  return { hash, url, contentHash };
};

/**
 * Complete IP registration workflow
 */
export const registerIPAsset = async ({
  title,
  description,
  creators,
  file,
  licenseTerms,
}: {
  title: string;
  description: string;
  creators: Array<{
    name: string;
    address: string;
    contributionPercent: number;
  }>;
  file?: File;
  licenseTerms?: {
    defaultMintingFee: number;
    commercialRevShare: number;
  };
}) => {
  try {
    let mediaUrl: string | undefined;
    let mediaHash: string | undefined;
    let mediaType: string | undefined;

    // Upload file if provided
    if (file) {
      const { url, hash } = await uploadFileToIPFS(file);
      mediaUrl = url;
      mediaHash = hash;
      mediaType = file.type;
    }

    // Generate IP metadata
    const ipMetadata = generateIpMetadata({
      title,
      description,
      creators,
      mediaUrl,
      mediaHash,
      mediaType,
    });

    // Upload IP metadata
    const { hash: ipIpfsHash, contentHash: ipHash } =
      await uploadMetadataToIPFS(ipMetadata);

    // Generate NFT metadata
    const nftMetadata = generateNftMetadata({
      name: title,
      description,
      image: mediaUrl || "", // Use media URL as image for NFT
      attributes: [
        {
          trait_type: "Creators",
          value: creators.length,
        },
        {
          trait_type: "Media Type",
          value: mediaType || "None",
        },
      ],
    });

    // Upload NFT metadata
    const { hash: nftIpfsHash, contentHash: nftHash } =
      await uploadMetadataToIPFS(nftMetadata);

    return {
      ipMetadata,
      ipIpfsHash,
      ipHash,
      nftMetadata,
      nftIpfsHash,
      nftHash,
      mediaUrl,
      mediaHash,
    };
  } catch (error) {
    console.error("Error in IP registration workflow:", error);
    throw error;
  }
};
