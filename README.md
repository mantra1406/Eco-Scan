# EcoScan

EcoScan is an AI-powered web platform that identifies waste automatically using camera/image input and quantifies the environmental impact of proper disposal. Instead of just telling you "this is plastic," it tells you exactly how much CO₂ you saved, how many trees that equals, and rewards you for it.

## Features

- **AI Classification Engine**: Built using Teachable Machine with MobileNet transfer learning
- **Carbon Footprint Engine**: Scientifically derived emission factors for accurate CO₂ calculations
- **Analytics Dashboard**: Real-time visualizations with pie charts, line charts, and bar charts
- **Gamification**: Leaderboard system with green points and competitions
- **Admin Panel**: Data management, filtering, and CSV export capabilities

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ecoscan
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Connecting a Real Teachable Machine Model

By default, EcoScan runs in simulation mode with realistic fake predictions. To connect your own Teachable Machine model:

1. Train your model on [Teachable Machine](https://teachablemachine.withgoogle.com/)
2. Export the model and host it (e.g., on GitHub Pages, Netlify, or any static hosting)
3. Update the `MODEL_URL` in `src/config/constants.js`:

```javascript
export const MODEL_URL = 'https://your-hosted-model-url';
```

The model URL should point to the folder containing `model.json` and `metadata.json`.

## Environment Variables

No environment variables are required for basic setup. For advanced configuration, you can create a `.env` file:

```env
VITE_MODEL_URL=https://your-hosted-model-url
```

## Project Structure

```
ecoscan/
├── src/
│   ├── components/
│   │   ├── charts/          # Recharts components
│   │   ├── layout/          # Navbar, PageWrapper
│   │   └── ui/              # Reusable UI components
│   ├── config/
│   │   └── constants.js     # App configuration
│   ├── context/
│   │   └── AppContext.jsx   # Global state management
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useModel.js
│   │   └── useToast.js
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Scanner.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Admin.jsx
│   │   └── NotFound.jsx
│   ├── utils/
│   │   ├── carbonEngine.js  # Carbon calculation logic
│   │   ├── csvExport.js     # CSV export functionality
│   │   └── mockData.js      # Mock data generation
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **AI**: TensorFlow.js + Teachable Machine
- **Icons**: Lucide React

## How It Works

1. **Upload**: User uploads an image of waste
2. **Classify**: AI model identifies the waste category with confidence score
3. **Weight**: User enters the approximate weight
4. **Calculate**: System calculates CO₂ saved, trees equivalent, and green points
5. **Save**: Record is stored and dashboard updates in real-time

## Emission Factors

| Category | CO₂ Saved (kg/kg) | Waste Type |
|----------|-------------------|------------|
| Plastic | 2.5 | Recyclable |
| Paper | 1.0 | Recyclable |
| Metal | 4.0 | Recyclable |
| Glass | 0.5 | Recyclable |
| Organic | 0.8 | Biodegradable |
| Hazardous | 3.0 | Hazardous |

## Future Enhancements

- IoT smart bin sensors integration
- Carbon credit marketplace
- Multi-campus comparative dashboards
- PostgreSQL backend with FastAPI
- Mobile app version

## License

MIT License

## Team

Built for a sustainable future by Team EcoScan.
