# 🚀 מדריך התקנה והפעלה מלא

## שלב 1: התקנת הפרויקט

### דרישות מקדימות
- Node.js גרסה 18 ומעלה
- npm או yarn
- Backend API שרץ (הקוד שלך מ-back.zip)

### התקנה

```bash
cd crypto-trading-ui
npm install
```

זה יתקין את כל התלויות:
- React 19
- React Router 7
- React Query 5
- Tailwind CSS v4
- AG Grid
- Framer Motion
- Axios
- i18next
- ועוד...

## שלב 2: הגדרת משתני סביבה

קובץ `.env` כבר קיים עם ההגדרות הבסיסיות:

```env
VITE_API_URL=http://localhost:3000
```

אם ה-Backend שלך רץ על פורט או כתובת אחרים, שנה את הערך:

```env
VITE_API_URL=http://your-server:your-port
```

## שלב 3: הפעלת הפרויקט

### Development Mode

```bash
npm run dev
```

האתר יהיה זמין ב: `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## שלב 4: חיבור ל-Backend

### ודא שה-Backend שלך תומך ב-CORS

בקובץ `src/corsConfig.ts` של ה-Backend, ודא שיש:

```typescript
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### נקודות API הנדרשות

הפרונט מצפה לנקודות API הבאות:

#### Bots
- `GET /api/bots` - קבלת כל הבוטים
- `GET /api/bots/:id` - קבלת בוט לפי ID
- `POST /api/bots` - יצירת בוט חדש
- `PUT /api/bots/:id` - עדכון בוט
- `DELETE /api/bots/:id` - מחיקת בוט
- `POST /api/bots/:id/start` - הפעלת בוט
- `POST /api/bots/:id/stop` - עצירת בוט
- `GET /api/bots/:id/stats` - קבלת סטטיסטיקות בוט

#### Positions
- `GET /api/positions` - קבלת כל הפוזיציות
- `POST /api/positions/:id/close` - סגירת פוזיציה

#### Trades
- `GET /api/trades` - קבלת היסטוריית טריידים

## שלב 5: שימוש בממשק

### יצירת בוט חדש

1. לחץ על "Trading Bots" בתפריט
2. לחץ על "Create New Bot"
3. מלא את הפרטים:
   - שם הבוט
   - סוג (Trend Long/Short)
   - בורסה (Binance/Bybit/KuCoin)
   - זוג מסחר (למשל BTC/USDT)
   - מינוף
   - גודל פוזיציה
   - הגדרות ניהול סיכון

### ניהול בוטים

- **הפעלה**: לחץ על כפתור "Start" ליד בוט שעצור
- **עצירה**: לחץ על כפתור "Stop" ליד בוט פעיל
- **מחיקה**: לחץ על אייקון הפח
- **צפייה**: לחץ על שורה בטבלה לפרטים מלאים

### ניטור

- **Positions**: צפה בכל הפוזיציות הפתוחות עם PnL בזמן אמת
- **Trades**: היסטוריית עסקאות מלאה
- **Wallet**: יתרות בכל הבורסות
- **Settings**: שנה שפה והגדרות רענון

## שלב 6: התאמות אישיות

### שינוי צבעי ערכת הנושא

ערוך `src/styles/app.css`:

```css
@theme {
  --color-accent: #3b82f6;        /* צבע ראשי */
  --color-dark-bg: #0a0e1a;       /* רקע כהה */
  --color-dark-card: #131824;     /* כרטיסיות */
}
```

### הוספת שפות נוספות

1. צור קובץ תרגום ב-`src/i18n/locales/your-lang.json`
2. הוסף את השפה ב-`src/i18n/index.ts`

### שינוי URL של API

ערוך `.env`:

```env
VITE_API_URL=https://your-api-domain.com
```

## שלב 7: פתרון בעיות נפוצות

### הבוטים לא מוצגים

1. בדוק שה-Backend רץ:
```bash
curl http://localhost:3000/api/bots
```

2. בדוק את ה-console בדפדפן (F12) לשגיאות

3. ודא ש-CORS מוגדר נכון

### שגיאות התקנה

```bash
rm -rf node_modules package-lock.json
npm install
```

### הדף לא נטען

```bash
rm -rf node_modules/.vite
npm run dev
```

## שלב 8: Deploy לפרודקשן

### Build

```bash
npm run build
```

הקבצים יהיו ב-`dist/`

### Deploy ל-Server

העתק את תיקיית `dist/` לשרת שלך (Nginx, Apache, Vercel, Netlify וכו')

### Nginx Configuration דוגמה

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

## תכונות מתקדמות

### WebSocket Support

להוספת עדכונים בזמן אמת:

```bash
npm install socket.io-client
```

צור hook ב-`src/hooks/useWebSocket.ts`:

```typescript
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = () => {
  useEffect(() => {
    const socket = io('http://localhost:3000');
    
    socket.on('botUpdate', (data) => {
      // עדכן את React Query cache
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);
};
```

### Custom Hooks

כל ה-API calls מנוהלים דרך React Query hooks ב-`src/hooks/`:
- `useBots.ts` - ניהול בוטים
- `useData.ts` - פוזיציות וטריידים

### TypeScript Types

כל הטיפוסים מוגדרים ב-`src/types/api.ts` ומסונכרנים עם ה-Backend

## מבנה התיקיות המלא

```
crypto-trading-ui/
├── src/
│   ├── api/                  # שירותי API
│   │   ├── client.ts        # Axios client
│   │   ├── bots.ts          # Bots API
│   │   ├── positions.ts     # Positions API
│   │   ├── trades.ts        # Trades API
│   │   └── stats.ts         # Stats API
│   ├── components/
│   │   ├── ui/              # רכיבי UI בסיסיים
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── StatCard.tsx
│   │   ├── layout/          # רכיבי פריסה
│   │   │   ├── Navbar.tsx
│   │   │   └── Layout.tsx
│   │   └── bots/            # רכיבים ספציפיים לבוטים
│   │       └── BotForm.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useBots.ts
│   │   └── useData.ts
│   ├── i18n/                # תרגומים
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── he.json
│   ├── pages/               # עמודים
│   │   ├── HomePage.tsx
│   │   ├── BotsPage.tsx
│   │   ├── PositionsPage.tsx
│   │   ├── TradesPage.tsx
│   │   ├── WalletPage.tsx
│   │   └── SettingsPage.tsx
│   ├── router/              # תצורת routing
│   │   └── index.tsx
│   ├── styles/              # סגנונות
│   │   ├── app.css
│   │   └── ag-grid-custom.css
│   ├── types/               # הגדרות TypeScript
│   │   └── api.ts
│   ├── App.tsx              # רכיב App ראשי
│   └── main.tsx             # נקודת כניסה
├── .env                     # משתני סביבה
├── .env.example            # דוגמה למשתני סביבה
├── .gitignore              # Git ignore
├── eslint.config.js        # תצורת ESLint
├── index.html              # HTML template
├── package.json            # תלויות
├── README.md               # תיעוד
├── tsconfig.json           # תצורת TypeScript
└── vite.config.ts          # תצורת Vite
```

## תמיכה נוספת

אם יש בעיות או שאלות:

1. בדוק את הקונסול בדפדפן (F12)
2. בדוק שה-Backend רץ ומחזיר נתונים
3. ודא ש-CORS מוגדר נכון
4. בדוק את קבצי ה-log של הפרויקט

---

**הצלחה! 🎉**

עכשיו יש לך ממשק משתמש מלא ומתקדם לניהול בוטי מסחר בקריפטו!
