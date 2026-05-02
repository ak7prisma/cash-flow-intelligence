# Cash Flow Intelligence (CFI)

Application for managing personal finances with AI-powered assistance.

## 🚀 Features
- **AI Chatbot**: Log transactions via voice or text using Gemini AI.
- **Smart Dashboard**: Real-time financial insights and trend charts.
- **Transaction History**: Edit and delete records with instant sync.
- **Native Experience**: Fully functional on Android via Capacitor.
- **Premium UI**: Dark mode support with Framer Motion animations.

## 📁 Project Structure

```text
src/
├── component/          # UI Components (Atomic, Molecules, Organisms)
│   ├── Assistant/      # Chat-related UI elements
│   ├── Dashboard/      # Summary and Chart components
│   ├── auth/           # Authentication forms and layouts
│   └── ui/             # Reusable base components (Buttons, Inputs)
├── context/            # React Context (Auth State management)
├── data/               # Static data and Constants
├── hooks/              # Custom React Hooks (Business Logic)
├── layout/             # Page Layout wrappers
├── models/             # OOP Data Models (Classes)
├── pages/              # Main Page components
├── service/            # External Services (Firebase, Gemini AI)
├── store/              # Zustand Store (Global State)
└── utils/              # Helper & Utility functions
```

## 🧪 Unit Testing Implementation

The project uses **Vitest** for automated unit testing, focusing on core business logic and utility functions to ensure data integrity.

### Key Test Suites:
1. **Transaction Model**: Validates OOP principles, amount formatting (IDR), and JSON serialization.
2. **Assistant Helpers**: Validates chat ID generation, time formatting, and currency display logic.

To run the tests:
```bash
npm test
```

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Firebase (Auth & Firestore)
- **AI**: Gemini AI API
- **State**: Zustand
- **Native**: Capacitor (Android)
