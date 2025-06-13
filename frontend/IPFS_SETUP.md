# IPFS Upload Configuration

This document explains how to configure IPFS uploads for StorySentinel using Pinata.

## Overview

The application now uses a dedicated `uploadToIpfs.ts` utility for all IPFS operations, following the pattern you requested. This separates IPFS concerns from Story Protocol logic and provides better error handling.

## Files Created/Modified

### New Files

- `src/utils/uploadToIpfs.ts` - Dedicated IPFS upload utility
- `IPFS_SETUP.md` - This documentation file

### Modified Files

- `src/utils/storyProtocol.ts` - Updated to use new upload utility
- `src/components/CreateIP.tsx` - Updated to use `registerIPAsset` workflow
- `.env` - Added better Pinata configuration documentation

## Configuration Required

### 1. Pinata Account Setup

1. Sign up at [https://app.pinata.cloud/](https://app.pinata.cloud/)
2. Navigate to the "API Keys" section
3. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `userPinnedDataTotal`

### 2. Environment Variables

Update your `.env` file with your actual Pinata credentials:

```env
# Replace with your actual JWT token from Pinata
VITE_PINATA_JWT=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Use your custom Pinata gateway
VITE_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs
```

### 3. Gateway Configuration (Optional)

If you have a custom Pinata gateway:

1. Go to your Pinata dashboard
2. Navigate to "Gateways"
3. Copy your gateway URL
4. Update `VITE_PINATA_GATEWAY` in your `.env` file

## API Functions

### `uploadJSONToIPFS(jsonMetadata)`

Uploads JSON metadata to IPFS and returns the hash.

### `uploadFileToIPFS(file)`

Uploads a file to IPFS and returns the hash.

### `createMetadataHash(jsonMetadata)`

Creates a SHA-256 hash of JSON metadata for integrity verification.

### `getIPFSUrl(ipfsHash)`

Constructs the full IPFS URL from a hash.

## Story Protocol Integration

The `registerIPAsset` function in `storyProtocol.ts` now handles the complete workflow:

1. Uploads media files to IPFS
2. Generates IP metadata following Story Protocol format
3. Uploads IP metadata to IPFS
4. Generates NFT metadata in OpenSea format
5. Uploads NFT metadata to IPFS
6. Creates content hashes for all metadata
7. Returns all necessary data for Story Protocol registration

## Usage Example

```typescript
import { registerIPAsset } from "../utils/storyProtocol";

const result = await registerIPAsset({
  title: "My IP Asset",
  description: "Description of my asset",
  creators: [
    {
      name: "Creator Name",
      address: "0x...",
      contributionPercent: 100,
    },
  ],
  file: myFile, // Optional File object
  licenseTerms: {
    defaultMintingFee: 1,
    commercialRevShare: 5,
  },
});

// Result contains:
// - ipMetadata, ipIpfsHash, ipHash
// - nftMetadata, nftIpfsHash, nftHash
// - mediaUrl, mediaHash
```

## Error Handling

The upload functions will throw errors if:

- Pinata JWT is not configured
- Network connectivity issues
- Invalid file types
- API rate limits exceeded

Make sure to handle these errors appropriately in your UI.

## Testing

Before deploying, test your Pinata configuration:

1. Set your actual JWT token in `.env`
2. Run the development server: `npm run dev`
3. Try creating an IP asset with a small test file
4. Check the browser console for upload logs
5. Verify files appear in your Pinata dashboard

## Next Steps

Once you've configured your Pinata credentials:

1. Update the `.env` file with your actual JWT token
2. Test the upload functionality
3. The application will use real IPFS uploads instead of mock data
4. IP assets will be properly stored on IPFS with verifiable hashes
