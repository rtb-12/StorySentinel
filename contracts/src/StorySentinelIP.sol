// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title StorySentinelIP
 * @dev NFT contract for representing IP assets in the StorySentinel ecosystem
 * This contract works alongside Story Protocol for comprehensive IP management
 */
contract StorySentinelIP is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // IP Asset structure
    struct IPAsset {
        string title;
        string description;
        string ipType; // trademark, copyright, patent, trade_secret
        string[] tags;
        address creator;
        uint256 createdAt;
        uint256 registrationDate;
        string storyProtocolId; // Link to Story Protocol IP ID
        bool isMonitored; // Whether asset is being monitored for infringement
        string metadataHash; // IPFS hash of detailed metadata
    }

    // Mapping from token ID to IP asset details
    mapping(uint256 => IPAsset) public ipAssets;
    
    // Mapping from creator to their asset IDs
    mapping(address => uint256[]) public creatorAssets;
    
    // Mapping for authorized operators (StorySentinel platform)
    mapping(address => bool) public authorizedOperators;

    // Events
    event IPAssetCreated(
        uint256 indexed tokenId,
        address indexed creator,
        string ipType,
        string title
    );
    
    event IPAssetRegistered(
        uint256 indexed tokenId,
        string storyProtocolId
    );
    
    event MonitoringEnabled(uint256 indexed tokenId);
    event MonitoringDisabled(uint256 indexed tokenId);

    constructor() ERC721("StorySentinel IP", "SSIP") {}

    /**
     * @dev Mint a new IP asset NFT
     */
    function createIPAsset(
        address to,
        string memory title,
        string memory description,
        string memory ipType,
        string[] memory tags,
        string memory tokenURI,
        string memory metadataHash
    ) public returns (uint256) {
        require(
            msg.sender == owner() || authorizedOperators[msg.sender],
            "Not authorized to create IP assets"
        );
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        ipAssets[tokenId] = IPAsset({
            title: title,
            description: description,
            ipType: ipType,
            tags: tags,
            creator: to,
            createdAt: block.timestamp,
            registrationDate: 0,
            storyProtocolId: "",
            isMonitored: false,
            metadataHash: metadataHash
        });
        
        creatorAssets[to].push(tokenId);
        
        emit IPAssetCreated(tokenId, to, ipType, title);
        
        return tokenId;
    }

    /**
     * @dev Register IP asset with Story Protocol
     */
    function registerWithStoryProtocol(
        uint256 tokenId,
        string memory storyProtocolId
    ) public {
        require(
            ownerOf(tokenId) == msg.sender || 
            msg.sender == owner() || 
            authorizedOperators[msg.sender],
            "Not authorized to register this asset"
        );
        
        ipAssets[tokenId].storyProtocolId = storyProtocolId;
        ipAssets[tokenId].registrationDate = block.timestamp;
        
        emit IPAssetRegistered(tokenId, storyProtocolId);
    }

    /**
     * @dev Enable monitoring for IP asset
     */
    function enableMonitoring(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == msg.sender || 
            msg.sender == owner() || 
            authorizedOperators[msg.sender],
            "Not authorized to modify this asset"
        );
        
        ipAssets[tokenId].isMonitored = true;
        emit MonitoringEnabled(tokenId);
    }

    /**
     * @dev Disable monitoring for IP asset
     */
    function disableMonitoring(uint256 tokenId) public {
        require(
            ownerOf(tokenId) == msg.sender || 
            msg.sender == owner() || 
            authorizedOperators[msg.sender],
            "Not authorized to modify this asset"
        );
        
        ipAssets[tokenId].isMonitored = false;
        emit MonitoringDisabled(tokenId);
    }

    /**
     * @dev Get IP asset details
     */
    function getIPAsset(uint256 tokenId) public view returns (IPAsset memory) {
        require(_exists(tokenId), "Asset does not exist");
        return ipAssets[tokenId];
    }

    /**
     * @dev Get assets created by a specific address
     */
    function getCreatorAssets(address creator) public view returns (uint256[] memory) {
        return creatorAssets[creator];
    }

    /**
     * @dev Get total number of IP assets
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    /**
     * @dev Authorize an operator (StorySentinel platform contracts)
     */
    function authorizeOperator(address operator) public onlyOwner {
        authorizedOperators[operator] = true;
    }

    /**
     * @dev Revoke operator authorization
     */
    function revokeOperator(address operator) public onlyOwner {
        authorizedOperators[operator] = false;
    }

    /**
     * @dev Update metadata hash for an IP asset
     */
    function updateMetadataHash(uint256 tokenId, string memory newHash) public {
        require(
            ownerOf(tokenId) == msg.sender || 
            msg.sender == owner() || 
            authorizedOperators[msg.sender],
            "Not authorized to update this asset"
        );
        
        ipAssets[tokenId].metadataHash = newHash;
    }

    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete ipAssets[tokenId];
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
