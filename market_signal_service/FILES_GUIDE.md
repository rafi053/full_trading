# 🗂 מדריך לקבצים - מה חשוב ומה לא

## ⭐ קבצים חשובים שאתה צריך להכיר

### 🚀 נקודת כניסה
- `app.py` - זה הקובץ שמריץ את השרת

### 🌐 API Layer (מה שרואים מבחוץ)
- `api/routes/signal_routes.py` - הנתיבים (URLs)
- `api/controllers/signal_controller.py` - טיפול בבקשות
- `api/schemas/signal_request.py` - ולידציה של קלט
- `api/schemas/signal_response.py` - פורמט של פלט

### 💼 Domain Layer (הלוגיקה העסקית)
- `domain/services/signal_service.py` - השירות המרכזי
- `domain/engine/decision/decision_engine.py` - המוח של המערכת

#### אינדיקטורים (חישובים מתמטיים)
- `domain/engine/indicators/ma_indicator.py` - Moving Average
- `domain/engine/indicators/ema_indicator.py` - EMA
- `domain/engine/indicators/rsi_indicator.py` - RSI
- `domain/engine/indicators/macd_indicator.py` - MACD
- `domain/engine/indicators/stochastic_indicator.py` - Stochastic
- `domain/engine/indicators/adx_indicator.py` - ADX
- `domain/engine/indicators/market_structure_indicator.py` - Market Structure

#### דטקטורים (פרשנות)
- `domain/engine/detectors/trend_detector.py` - זיהוי מגמה
- `domain/engine/detectors/momentum_detector.py` - זיהוי מומנטום
- `domain/engine/detectors/strength_detector.py` - זיהוי חוזק
- `domain/engine/detectors/structure_detector.py` - זיהוי מבנה

#### מנועים
- `domain/engine/scoring/scoring_engine.py` - חישוב ציון
- `domain/models/signal_result.py` - מודל התוצאה

### 🔌 Infrastructure Layer (חיבור לעולם)
- `infrastructure/market_data/market_data_service.py` - מנהל נתוני שוק
- `infrastructure/market_data/binance_client.py` - חיבור לבינאנס
- `infrastructure/market_data/bybit_client.py` - חיבור לביביט
- `infrastructure/market_data/kucoin_client.py` - חיבור לקוקוין
- `infrastructure/cache/cache_service.py` - קאש
- `infrastructure/config/settings.py` - הגדרות
- `infrastructure/logging/logger.py` - לוגים

### 🛠 Core (כלים משותפים)
- `core/timeframes.py` - טיימפריימים
- `core/thresholds.py` - סף ערכים
- `core/normalize.py` - נרמול
- `core/exceptions.py` - שגיאות
- `core/utils.py` - פונקציות עזר

### 🧪 Tests
- `tests/test_indicators.py` - בדיקות אינדיקטורים
- `tests/test_decision_engine.py` - בדיקות מנוע החלטות
- `tests/test_signal_service.py` - בדיקות שירות
- `tests/test_api.py` - בדיקות API

---

## 📄 קבצים טכניים (לא צריך לגעת)

### קבצי __init__.py
כל תיקייה צריכה `__init__.py` כדי ש-Python יזהה אותה כחבילה.
אפשר להשאיר אותם ריקים - הם רק "סימנים" ל-Python.

```
api/__init__.py
api/routes/__init__.py
api/controllers/__init__.py
api/schemas/__init__.py
domain/__init__.py
domain/services/__init__.py
domain/engine/__init__.py
domain/engine/indicators/__init__.py
domain/engine/detectors/__init__.py
domain/engine/scoring/__init__.py
domain/engine/decision/__init__.py
domain/models/__init__.py
infrastructure/__init__.py
infrastructure/market_data/__init__.py
infrastructure/cache/__init__.py
infrastructure/config/__init__.py
infrastructure/logging/__init__.py
core/__init__.py
tests/__init__.py
```

### קבצי תצורה
- `requirements.txt` - רשימת חבילות Python
- `.env.example` - דוגמה למשתני סביבה
- `.gitignore` - מה להתעלם בגיט
- `README.md` - תיעוד
- `STRUCTURE.md` - מבנה הפרויקט

---

## 🎯 איך להתחיל לעבוד?

### אם רוצה לשנות לוגיקת סיגנלים:
1. `domain/engine/scoring/scoring_engine.py` - שנה משקלים
2. `core/thresholds.py` - שנה ספים (BUY/SELL)

### אם רוצה להוסיף אינדיקטור חדש:
1. צור קובץ חדש ב-`domain/engine/indicators/`
2. הוסף אותו ל-Detector מתאים
3. עדכן את `decision_engine.py`

### אם רוצה להוסיף בורסה חדשה:
1. צור client חדש ב-`infrastructure/market_data/`
2. הוסף אותו ל-`market_data_service.py`

### אם רוצה לשנות API:
1. `api/routes/signal_routes.py` - הוסף endpoint
2. `api/controllers/signal_controller.py` - הוסף לוגיקה
3. `api/schemas/` - הוסף validation

---

## 📊 כמה קבצים בכל שכבה?

```
📦 Total: 56 קבצים

🌐 API Layer: 7 קבצים
   - 3 קבצי קוד אמיתיים
   - 4 __init__.py

💼 Domain Layer: 23 קבצים
   - 15 קבצי קוד אמיתיים
   - 8 __init__.py

🔌 Infrastructure: 16 קבצים
   - 10 קבצי קוד אמיתיים
   - 6 __init__.py

🛠 Core: 6 קבצים
   - 5 קבצי קוד אמיתיים
   - 1 __init__.py

🧪 Tests: 5 קבצים
   - 4 קבצי בדיקות
   - 1 __init__.py

📄 Root: 5 קבצים
   - app.py
   - requirements.txt
   - .env.example
   - README.md
   - STRUCTURE.md
```

---

## 💡 הכלל הזהב

**אם הקובץ נקרא `__init__.py` - אל תגע בו!**
הוא צריך להיות שם, אבל לא צריך לעשות איתו כלום.

כל השאר - זה קוד אמיתי שעושה משהו 🚀
