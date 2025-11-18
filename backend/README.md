# ⚙️ Backend API - Crypto Trading Dashboard

Backend API עם Node.js, TypeScript, Express, MongoDB, Redis, ו-WebSocket.

---

## 📋 תוכן עניינים

1. [סקירה](#סקירה)
2. [טכנולוגיות](#טכנולוגיות)
3. [התקנה](#התקנה)
4. [הגדרה](#הגדרה)
5. [הרצה](#הרצה)
6. [API Endpoints](#api-endpoints)
7. [WebSocket Events](#websocket-events)
8. [ארכיטקטורה](#ארכיטקטורה)

---

## 🎯 סקירה

Backend API מספק:
- ✅ REST API לניהול בוטים, פוזיציות, טריידים
- ✅ WebSocket לעדכונים בזמן אמת
- ✅ MongoDB לאחסון נתונים
- ✅ Redis לcaching
- ✅ Clean Architecture
- ✅ TypeScript מלא

---

## 🛠️ טכנולוגיות

### Core:
- **Node.js** 18+
- **TypeScript** 5.3
- **Express** 4.18

### Database:
- **MongoDB** 6+ (Mongoose)
- **Redis** 7+ (optional)

### Real-time:
- **Socket.io** 4.6

### Utilities:
- **Zod** - Validation
- **Helmet** - Security
- **Cors** - CORS handling
- **Winston** - Logging
- **Compression** - Response compression

---

## 📥 התקנה

### 1. דרישות מקדימות

```bash
node --version
```
נדרש: Node.js 18+

```bash
mongod --version
```
נדרש: MongoDB 6+

### 2. התקנת תלויות

```bash
cd backend
npm install
```

---

## ⚙️ הגדרה

### 1. משתני סביבה

```bash
cp .env.example .env
nano .env
```

ערוך:
```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/crypto-dashboard
REDIS_URL=redis://localhost:6379

CORS_ORIGIN=http://localhost:3000

LOG_LEVEL=info

PYTHON_BOTS_PATH=../python_bots
```

### 2. הפעלת MongoDB

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

**Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 3. הפעלת Redis (אופציונלי)

**Mac:**
```bash
brew services start redis
```

**Linux:**
```bash
sudo systemctl start redis
```

**Docker:**
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

---

## 🚀 הרצה

### Development:
```bash
npm run dev
```

### Build:
```bash
npm run build
```

### Production:
```bash
npm start
```

### With PM2:
```bash
pm2 start dist/index.js --name crypto-api
```

---

## 📡 API Endpoints

### Health Check

**GET** `/health`

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-11-09T15:30:00.000Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "websocket": "running"
  },
  "websocket": {
    "connectedClients": 3,
    "rooms": ["bots", "positions", "price:BTCUSDT"]
  }
}
```

---

### Bots API

#### Get All Bots
**GET** `/api/bots`

Response:
```json
[
  {
    "_id": "bot123",
    "name": "Range Bot",
    "type": "RANGE",
    "exchange": "bitunix",
    "status": "RUNNING",
    "config": {...},
    "stats": {
      "totalTrades": 150,
      "winRate": 65,
      "totalPnL": 1250.50
    },
    "openPositions": 5
  }
]
```

#### Get Bot by ID
**GET** `/api/bots/:id`

#### Create Bot
**POST** `/api/bots`

Body:
```json
{
  "name": "My Range Bot",
  "type": "RANGE",
  "exchange": "bitunix",
  "config": {
    "symbol": "BTCUSDT",
    "leverage": 5,
    "positionSize": 0.001,
    "strategy": {...},
    "riskManagement": {...}
  }
}
```

#### Start Bot
**POST** `/api/bots/:id/start`

#### Stop Bot
**POST** `/api/bots/:id/stop`

#### Delete Bot
**DELETE** `/api/bots/:id`

#### Get Bot Stats
**GET** `/api/bots/:id/stats`

---

### Positions API

#### Get All Positions
**GET** `/api/positions`

Query params:
- `status` - OPEN, CLOSED, LIQUIDATED
- `botId` - filter by bot
- `exchange` - filter by exchange
- `symbol` - filter by symbol

#### Get Open Positions
**GET** `/api/positions/open`

Response:
```json
[
  {
    "_id": "pos123",
    "botId": "bot123",
    "exchange": "bitunix",
    "symbol": "BTCUSDT",
    "side": "LONG",
    "status": "OPEN",
    "entryPrice": 45000,
    "currentPrice": 46000,
    "unrealizedPnL": 100.50,
    "quantity": 0.001,
    "leverage": 5
  }
]
```

#### Get Positions Summary
**GET** `/api/positions/summary`

Response:
```json
{
  "totalOpen": 12,
  "totalLong": 8,
  "totalShort": 4,
  "totalUnrealizedPnL": 450.75,
  "totalMargin": 2500,
  "byBot": {
    "bot123": {
      "open": 5,
      "unrealizedPnL": 200
    }
  },
  "byExchange": {
    "bitunix": {
      "open": 8,
      "unrealizedPnL": 300
    }
  }
}
```

#### Get Position by ID
**GET** `/api/positions/:id`

#### Close Position
**POST** `/api/positions/:id/close`

---

## 🔌 WebSocket Events

### Client → Server

#### Subscribe to Bots
```javascript
socket.emit('subscribe:bots');
```

#### Subscribe to Positions
```javascript
socket.emit('subscribe:positions');
```

#### Subscribe to Trades
```javascript
socket.emit('subscribe:trades');
```

#### Subscribe to Prices
```javascript
socket.emit('subscribe:prices', ['BTCUSDT', 'ETHUSDT']);
```

### Server → Client

#### Connected
```javascript
socket.on('connected', (data) => {
  console.log(data.message);
});
```

#### Bot Status Changed
```javascript
socket.on('bot:status:changed', (data) => {
  // data: { botId, name, status, timestamp }
});
```

#### Bot Stats Updated
```javascript
socket.on('bot:stats:updated', (data) => {
  // data: { botId, stats }
});
```

#### Position Opened
```javascript
socket.on('position:opened', (data) => {
  // data: { positionId, botId, symbol, ... }
});
```

#### Position Updated
```javascript
socket.on('position:updated', (data) => {
  // data: { positionId, currentPrice, unrealizedPnL, ... }
});
```

#### Position Closed
```javascript
socket.on('position:closed', (data) => {
  // data: { positionId, botId, pnl, timestamp }
});
```

#### Price Update
```javascript
socket.on('price:update', (data) => {
  // data: { symbol, price, timestamp }
});
```

---

## 🏗️ ארכיטקטורה

### Clean Architecture

```
backend/
├── src/
│   ├── domain/              # Business Logic
│   │   └── entities/        # Bot, Position, Trade
│   │
│   ├── application/         # Use Cases
│   │   └── (to be added)
│   │
│   ├── infrastructure/      # External Services
│   │   ├── database/        # MongoDB
│   │   ├── cache/           # Redis
│   │   └── websocket/       # Socket.io
│   │
│   └── presentation/        # HTTP Layer
│       ├── controllers/     # Request handlers
│       ├── routes/          # Route definitions
│       └── middlewares/     # Express middlewares
│
├── package.json
├── tsconfig.json
└── .env.example
```

### Data Flow

```
Client Request
    ↓
Express Routes
    ↓
Controllers
    ↓
MongoDB Models
    ↓
Response

WebSocket:
Python Bots → MongoDB → WebSocket Server → Frontend
```

---

## 🧪 Testing

### בדיקת חיבור

```bash
curl http://localhost:3001/health
```

### בדיקת Bots API

```bash
curl http://localhost:3001/api/bots
```

### בדיקת WebSocket

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connected', (data) => {
  console.log('Connected:', data);
});

socket.emit('subscribe:bots');

socket.on('bot:status:changed', (data) => {
  console.log('Bot status:', data);
});
```

---

## 🔒 Security

### Headers (Helmet)
- XSS Protection
- Content Security Policy
- HSTS
- Frame Options

### CORS
- Configurable origin
- Credentials support

### Rate Limiting (מומלץ להוסיף)
```bash
npm install express-rate-limit
```

---

## 📊 Monitoring

### Logs
```bash
tail -f logs/app.log
```

### MongoDB Stats
```bash
mongo
> db.stats()
> db.bots.countDocuments()
> db.positions.countDocuments()
```

### Redis Stats
```bash
redis-cli
> INFO
> DBSIZE
> KEYS *
```

---

## 🚀 Production

### Build
```bash
npm run build
```

### Run with PM2
```bash
pm2 start ecosystem.config.js
pm2 logs
pm2 monit
```

### Environment
```env
NODE_ENV=production
LOG_LEVEL=error
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
sudo systemctl status mongod
sudo systemctl restart mongod
```

### Redis Connection Failed
```bash
brew services restart redis
redis-cli ping
```

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill
```

### WebSocket Not Working
- בדוק CORS_ORIGIN
- בדוק firewall
- בדוק client URL

---

## 📚 תיעוד נוסף

- **MongoDB**: https://www.mongodb.com/docs/
- **Socket.io**: https://socket.io/docs/
- **Express**: https://expressjs.com/

---

**Built with ❤️ for automated crypto trading**
