# 🚀 Complete Installation & Setup Guide

## Step 1: Project Installation

### Prerequisites
- Node.js version 18 or higher
- npm or yarn
- Backend API running (your code from back.zip)

### Installation

```bash
cd crypto-trading-ui
npm install
```

This will install all dependencies:
- React 19
- React Router 7
- React Query 5
- Tailwind CSS v4
- AG Grid
- Framer Motion
- Axios
- i18next
- And more...

## Step 2: Environment Configuration

The `.env` file already exists with basic settings:

```env
VITE_API_URL=http://localhost:3000
```

If your Backend runs on a different port or address, change the value:

```env
VITE_API_URL=http://your-server:your-port
```

## Step 3: Running the Project

### Development Mode

```bash
npm run dev
```

The site will be available at: `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Step 4: Backend Connection

### Ensure your Backend supports CORS

In the Backend's `src/corsConfig.ts`, ensure you have:

```typescript
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Required API Endpoints

The frontend expects these API endpoints:

#### Bots
- `GET /api/bots` - Get all bots
- `GET /api/bots/:id` - Get bot by ID
- `POST /api/bots` - Create new bot
- `PUT /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot
- `POST /api/bots/:id/start` - Start bot
- `POST /api/bots/:id/stop` - Stop bot
- `GET /api/bots/:id/stats` - Get bot statistics

#### Positions
- `GET /api/positions` - Get all positions
- `POST /api/positions/:id/close` - Close position

#### Trades
- `GET /api/trades` - Get trade history

## Step 5: Using the Interface

### Creating a New Bot

1. Click "Trading Bots" in the menu
2. Click "Create New Bot"
3. Fill in the details:
   - Bot name
   - Type (Trend Long/Short)
   - Exchange (Binance/Bybit/KuCoin)
   - Trading pair (e.g., BTC/USDT)
   - Leverage
   - Position size
   - Risk management settings

### Managing Bots

- **Start**: Click the "Start" button next to a stopped bot
- **Stop**: Click the "Stop" button next to a running bot
- **Delete**: Click the trash icon
- **View**: Click on a table row for full details

### Monitoring

- **Positions**: View all open positions with real-time PnL
- **Trades**: Complete trade history
- **Wallet**: Balances across all exchanges
- **Settings**: Change language and refresh settings

## Step 6: Customization

### Changing Theme Colors

Edit `src/styles/app.css`:

```css
@theme {
  --color-accent: #3b82f6;        /* Primary color */
  --color-dark-bg: #0a0e1a;       /* Dark background */
  --color-dark-card: #131824;     /* Card background */
}
```

### Adding More Languages

1. Create translation file in `src/i18n/locales/your-lang.json`
2. Add the language in `src/i18n/index.ts`

### Changing API URL

Edit `.env`:

```env
VITE_API_URL=https://your-api-domain.com
```

## Step 7: Troubleshooting

### Bots Not Displaying

1. Check that the Backend is running:
```bash
curl http://localhost:3000/api/bots
```

2. Check the browser console (F12) for errors

3. Ensure CORS is configured correctly

### Installation Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Page Not Loading

```bash
rm -rf node_modules/.vite
npm run dev
```

## Step 8: Production Deployment

### Build

```bash
npm run build
```

Files will be in `dist/`

### Deploy to Server

Copy the `dist/` folder to your server (Nginx, Apache, Vercel, Netlify, etc.)

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

## Advanced Features

### WebSocket Support

To add real-time updates:

```bash
npm install socket.io-client
```

Create hook in `src/hooks/useWebSocket.ts`:

```typescript
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000');
    
    socket.on('botUpdate', (data) => {
      // Update React Query cache
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
};
```

### Custom Hooks

All API calls are managed through React Query hooks in `src/hooks/`:
- `useBots.ts` - Bot management
- `useData.ts` - Positions and trades

### TypeScript Types

All types are defined in `src/types/api.ts` and synced with the Backend

## Complete Folder Structure

```
crypto-trading-ui/
├── src/
│   ├── api/                  # API services
│   │   ├── client.ts        # Axios client
│   │   ├── bots.ts          # Bots API
│   │   ├── positions.ts     # Positions API
│   │   ├── trades.ts        # Trades API
│   │   └── stats.ts         # Stats API
│   ├── components/
│   │   ├── ui/              # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   └── bots/            # Bot-specific components
│   │       └── BotForm.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useBots.ts
│   │   └── useData.ts
│   ├── i18n/                # Translations
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── he.json
│   ├── pages/               # Pages
│   │   ├── HomePage.tsx
│   │   ├── BotsPage.tsx
│   │   ├── PositionsPage.tsx
│   │   ├── TradesPage.tsx
│   │   ├── WalletPage.tsx
│   │   └── SettingsPage.tsx
│   ├── router/              # Routing configuration
│   │   └── index.tsx
│   ├── styles/              # Styles
│   │   ├── app.css
│   │   └── ag-grid-custom.css
│   ├── types/               # TypeScript definitions
│   │   └── api.ts
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── .env                     # Environment variables
├── .env.example            # Environment example
├── .gitignore              # Git ignore
├── eslint.config.js        # ESLint config
├── index.html              # HTML template
├── package.json            # Dependencies
├── README.md               # Documentation
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Vite config
```

## Additional Support

If you have issues or questions:

1. Check the browser console (F12)
2. Verify the Backend is running and returning data
3. Ensure CORS is configured correctly
4. Check project log files

---

**Good luck! 🎉**

You now have a complete and advanced UI for managing crypto trading bots!
