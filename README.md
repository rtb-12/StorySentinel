# StorySentinel

**Comprehensive IP Protection Platform** integrating Story Protocol blockchain technology with Yakoa AI-powered infringement detection.

## 🌟 Overview

StorySentinel is a next-generation intellectual property protection platform that combines the power of blockchain-based IP registration through Story Protocol with advanced AI-driven infringement detection via Yakoa. Our platform provides creators, businesses, and IP holders with comprehensive tools to register, monitor, and enforce their intellectual property rights.

## ✨ Key Features

### 🔐 IP Asset Management

- **Multi-format Support**: Register trademarks, copyrights, patents, and trade secrets
- **Blockchain Registration**: Secure IP registration on Story Protocol
- **NFT Representation**: Each IP asset is minted as an NFT for proof of ownership
- **Metadata Storage**: IPFS-based decentralized metadata storage

### 🤖 AI-Powered Monitoring

- **Real-time Detection**: Continuous monitoring across multiple platforms
- **Smart Alerts**: Intelligent notification system for potential infringements
- **Similarity Analysis**: Advanced AI algorithms for content comparison
- **Platform Coverage**: Monitor social media, marketplaces, and content platforms

### ⚖️ Dispute Management

- **Automated Evidence Collection**: Gather and organize infringement evidence
- **Story Protocol Integration**: Submit disputes directly to blockchain arbitration
- **Legal Workflow**: Streamlined dispute resolution process
- **Settlement Tracking**: Monitor case progress and outcomes

### 📊 Analytics & Insights

- **Portfolio Analytics**: Comprehensive IP portfolio management
- **Infringement Statistics**: Track detection rates and resolution success
- **Financial Metrics**: ROI analysis and cost-benefit tracking
- **Trend Analysis**: Market intelligence and competitive insights

## 🏗️ Architecture

### Frontend (React + TypeScript)

- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- **Real-time Updates**: Live data updates using React Query
- **Component Library**: Reusable UI components with Lucide icons

### Backend (Node.js + Express)

- **RESTful API**: Comprehensive API endpoints for all functionality
- **Service Architecture**: Modular service layer for external integrations
- **Authentication**: JWT-based secure authentication system
- **File Handling**: Support for media uploads and IPFS storage

### Smart Contracts (Solidity)

- **IP Asset NFTs**: ERC-721 based IP asset representation
- **Story Protocol Integration**: Native integration with Story Protocol
- **Access Control**: Role-based permissions and authorization
- **Upgradeable**: Proxy pattern for contract upgrades

### External Integrations

- **Story Protocol**: Blockchain IP registration and dispute resolution
- **Yakoa API**: AI-powered content detection and monitoring
- **IPFS**: Decentralized storage for metadata and evidence
- **MongoDB**: Primary database for application data

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-org/storysentinel.git
   cd storysentinel
   ```

2. **Install dependencies**

   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend && npm install

   # Install backend dependencies
   cd ../backend && npm install

   # Install contract dependencies
   cd ../contracts && npm install
   ```

3. **Environment Setup**

   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env

   # Edit the .env files with your API keys and configurations
   ```

4. **Start Development Servers**

   ```bash
   # Start backend (from root directory)
   npm run dev:backend

   # Start frontend (in another terminal)
   npm run dev:frontend
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/health

## 📖 API Documentation

### Core Endpoints

#### IP Assets

- `GET /api/ip-assets` - List all IP assets
- `POST /api/ip-assets` - Create new IP asset
- `GET /api/ip-assets/:id` - Get specific IP asset
- `PUT /api/ip-assets/:id` - Update IP asset
- `POST /api/ip-assets/:id/register` - Register on Story Protocol
- `POST /api/ip-assets/:id/scan` - Trigger infringement scan

#### Alerts

- `GET /api/alerts` - List alerts with filtering
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert status
- `POST /api/alerts/mark-read` - Mark multiple alerts as read
- `POST /api/alerts/:id/escalate` - Escalate alert to dispute

#### Disputes

- `GET /api/disputes` - List disputes
- `POST /api/disputes` - Create new dispute
- `POST /api/disputes/:id/submit-story` - Submit to Story Protocol
- `POST /api/disputes/:id/evidence` - Add evidence

#### Analytics

- `GET /api/analytics/overview` - Dashboard overview
- `GET /api/analytics/assets` - Asset statistics
- `GET /api/analytics/alerts` - Alert analytics
- `GET /api/analytics/disputes` - Dispute metrics
- `GET /api/analytics/financial` - Financial analysis

### External Integrations

#### Yakoa Integration

- `POST /api/yakoa/search` - Search for content
- `POST /api/yakoa/analyze` - Analyze content for infringement
- `GET /api/yakoa/monitoring/:assetId` - Get monitoring status
- `POST /api/yakoa/monitoring/start` - Start monitoring
- `POST /api/yakoa/monitoring/stop` - Stop monitoring

#### Story Protocol Integration

- `POST /api/story/register` - Register IP on blockchain
- `GET /api/story/asset/:ipId` - Get blockchain asset details
- `POST /api/story/license/create` - Create license
- `POST /api/story/dispute/submit` - Submit dispute
- `GET /api/story/royalties/:ipId` - Get royalty information

## 🔧 Configuration

### Environment Variables

#### Backend Configuration

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/storysentinel

# Story Protocol
STORY_PROTOCOL_API_KEY=your-api-key
STORY_PROTOCOL_NETWORK=testnet
STORY_PROTOCOL_RPC_URL=https://rpc.odyssey.storyrpc.io

# Yakoa API
YAKOA_API_KEY=your-yakoa-api-key
YAKOA_API_BASE_URL=https://api.yakoa.com/v1
```

#### Frontend Configuration

```env
# React App
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=StorySentinel

# Story Protocol
REACT_APP_STORY_PROTOCOL_NETWORK=testnet
REACT_APP_STORY_PROTOCOL_CHAIN_ID=1516
```

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test

# Run contract tests
cd contracts && npm test
```

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (AWS, Railway, Render, etc.)

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy to CDN or static hosting (Vercel, Netlify, etc.)

### Smart Contract Deployment

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network storyTestnet
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.storysentinel.com](https://docs.storysentinel.com)
- **Discord**: [Join our community](https://discord.gg/storysentinel)
- **Email**: support@storysentinel.com
- **Issues**: [GitHub Issues](https://github.com/your-org/storysentinel/issues)

## 🙏 Acknowledgments

- [Story Protocol](https://storyprotocol.xyz) for blockchain IP infrastructure
- [Yakoa](https://yakoa.com) for AI-powered content detection
- [OpenZeppelin](https://openzeppelin.com) for secure smart contract libraries
- The open-source community for amazing tools and libraries

---

**Built with ❤️ for creators and innovators worldwide**
