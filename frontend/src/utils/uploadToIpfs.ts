import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: import.meta.env.VITE_PINATA_GATEWAY,
});

/**
 * Upload JSON metadata to IPFS using Pinata
 * @param jsonMetadata - The JSON object to upload
 * @returns Promise<string> - The IPFS hash
 */
export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
  if (!import.meta.env.VITE_PINATA_JWT) {
    throw new Error(
      "PINATA_JWT environment variable is required for IPFS uploads"
    );
  }

  try {
    console.log("Uploading JSON to IPFS:", jsonMetadata);
    const { IpfsHash } = await pinata.upload.json(jsonMetadata);
    console.log("JSON uploaded to IPFS with hash:", IpfsHash);
    return IpfsHash;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error(`Failed to upload JSON to IPFS: ${error}`);
  }
}

/**
 * Upload file to IPFS using Pinata
 * @param file - The file to upload
 * @returns Promise<string> - The IPFS hash
 */
export async function uploadFileToIPFS(file: File): Promise<string> {
  if (!import.meta.env.VITE_PINATA_JWT) {
    throw new Error(
      "PINATA_JWT environment variable is required for IPFS uploads"
    );
  }

  try {
    console.log("Uploading file to IPFS:", file.name);
    const { IpfsHash } = await pinata.upload.file(file);
    console.log("File uploaded to IPFS with hash:", IpfsHash);
    return IpfsHash;
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw new Error(`Failed to upload file to IPFS: ${error}`);
  }
}

/**
 * Create SHA-256 hash from JSON metadata
 * @param jsonMetadata - The JSON object to hash
 * @returns Promise<string> - The SHA-256 hash as hex string
 */
export async function createMetadataHash(
  jsonMetadata: unknown
): Promise<string> {
  const jsonString = JSON.stringify(jsonMetadata);
  const encoder = new TextEncoder();
  const data = encoder.encode(jsonString);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `0x${hashHex}`;
}

/**
 * Get IPFS gateway URL from hash
 * @param ipfsHash - The IPFS hash
 * @returns string - The full IPFS URL
 */
export function getIPFSUrl(ipfsHash: string): string {
  const gateway = import.meta.env.VITE_PINATA_GATEWAY || "https://ipfs.io/ipfs";
  return `${gateway}/${ipfsHash}`;
}
