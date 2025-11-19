# Crypto Trading UI

Advanced cryptocurrency trading platform with automated bots, real-time data, and multi-exchange support.

## 🚀 Features

- **Automated Trading Bots** - Create and manage trading bots with customizable strategies
- **Real-time Data** - Live market data and instant trade execution with WebSocket support
- **Multi-Exchange Support** - Trade across Binance, Bybit, and KuCoin simultaneously
- **Advanced Analytics** - Comprehensive statistics and performance metrics
- **Modern UI** - Built with React 19, Tailwind v4, and Framer Motion
- **Multilingual** - English and Hebrew support with i18next
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile

## 🛠 Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **React Router 7** - Modern routing
- **React Query 5** - Server state management with caching
- **Tailwind CSS v4** - Utility-first styling
- **AG Grid** - Professional data tables
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **i18next** - Internationalization
- **Vite** - Fast build tool

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see backend configuration below)

### Steps

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```env
VITE_API_URL=http://localhost:3000
```

3. **Start development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Backend Configuration

The frontend expects the following API endpoints from your backend:

### Bots Endpoints

- `GET /api/bots` - Get all bots
- `GET /api/bots/:id` - Get bot by ID
- `POST /api/bots` - Create new bot
- `PUT /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot
- `POST /api/bots/:id/start` - Start bot
- `POST /api/bots/:id/stop` - Stop bot
- `GET /api/bots/:id/stats` - Get bot statistics

### Positions Endpoints

- `GET /api/positions` - Get all positions
- `GET /api/positions/:id` - Get position by ID
- `POST /api/positions/:id/close` - Close position

### Trades Endpoints

- `GET /api/trades` - Get trade history
- `GET /api/trades/:id` - Get trade by ID

### Stats Endpoints

- `GET /api/stats/global` - Get global statistics
- `GET /api/stats/bot/:botId` - Get bot-specific stats

## 📱 Usage

### Creating a Bot

1. Navigate to the "Bots" page
2. Click "Create New Bot"
3. Fill in the bot configuration:
   - Bot name
   - Bot type (Trend Long/Short)
   - Exchange (Binance/Bybit/KuCoin)
   - Trading pair (e.g., BTC/USDT)
   - Leverage
   - Position size
   - Risk management settings
4. Click "Create Bot"

### Managing Bots

- **Start Bot**: Click the "Start" button on a stopped bot
- **Stop Bot**: Click the "Stop" button on a running bot
- **Delete Bot**: Click the trash icon to delete a bot
- **View Details**: Click on a bot row to see detailed information

### Monitoring

- **Positions**: View all open positions with real-time PnL
- **Trades**: See complete trade history
- **Wallet**: Check balances across all exchanges
- **Settings**: Configure language and refresh intervals

## 🎨 Customization

### Changing Theme Colors

Edit `src/styles/app.css`:

```css
@theme {
  --color-accent: #your-color;
  --color-dark-bg: #your-bg-color;
}
```

### Adding New Languages

1. Create translation file in `src/i18n/locales/your-lang.json`
2. Import and add to `src/i18n/index.ts`

### Modifying API Endpoints

Update the API services in `src/api/`:
- `bots.ts` - Bot operations
- `positions.ts` - Position management
- `trades.ts` - Trade history
- `stats.ts` - Statistics

## 🏗 Build for Production

```bash
npm run build
```

The build output will be in the `dist/` folder.

Preview the production build:

```bash
npm run preview
```

## 📊 Project Structure

```
src/
├── api/              # API services and Axios client
├── components/       # Reusable React components
│   ├── ui/          # Base UI components (Button, Card, Modal, etc.)
│   ├── layout/      # Layout components (Navbar, Layout)
│   └── bots/        # Bot-specific components
├── hooks/           # Custom React hooks (React Query)
├── i18n/            # Internationalization
│   └── locales/     # Translation files
├── pages/           # Page components
├── router/          # React Router configuration
├── styles/          # Global styles and Tailwind config
├── types/           # TypeScript type definitions
├── App.tsx          # Main App component
└── main.tsx         # Entry point
```

## 🔌 WebSocket Support

The app is ready for WebSocket integration. To add real-time updates:

1. Install WebSocket client:
```bash
npm install socket.io-client
```

2. Create WebSocket hook in `src/hooks/useWebSocket.ts`
3. Connect to your backend WebSocket server
4. Update React Query cache on WebSocket events

## 🌐 Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)

## 🐛 Troubleshooting

### API Connection Issues

- Verify backend is running and accessible
- Check CORS settings on backend
- Ensure `VITE_API_URL` is correct in `.env`

### Build Errors

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📄 License

MIT

## 🤝 Support

For issues or questions, please contact support or create an issue in the repository.
