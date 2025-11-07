# Meeting Insights AI - Frontend

React frontend for analyzing meeting transcripts using AI.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: PrimeReact
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **API Client**: ts-rest (type-safe REST client)

## Prerequisites

- Node.js 18+
- Backend server running on `http://localhost:3001`

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

The frontend works with default configuration, but you can customize:

```bash
cp .env.example .env
```

Edit `.env` if needed:
```env
VITE_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

### 📝 Transcript Input
- Large textarea for pasting meeting transcripts
- Character counter (max 50,000 characters)
- Sample transcript loader for testing
- Clear button to reset
- Real-time validation

### 🤖 AI Analysis
- Loading state with spinner
- Progress indicator
- Error handling with clear messages
- Retry functionality

### 📊 Results Display
- **Sentiment Card**: Shows meeting tone with color-coded tag
- **Action Items**: Listed with:
  - Priority indicators (high/medium/low)
  - Owner tags
  - Deadline tags
- **Decisions**: Categorized as:
  - Made (with green check)
  - Pending (with yellow clock)
  - Context information

### 🎨 UI/UX Features
- Clean, modern design with PrimeReact components
- Responsive layout
- Color-coded priorities and sentiments
- Icons for visual hierarchy
- Smooth transitions and hover effects
- Loading and error states

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── TranscriptInput.tsx    # Input form component
│   │   ├── AnalysisResults.tsx    # Results display component
│   │   ├── SideBar.tsx            # Navigation sidebar
│   │   ├── LoadingSpinner.tsx     # Loading state component
│   │   └── ErrorAlert.tsx         # Error display component
│   ├── pages/
│   │   ├── Home.tsx               # Home page with transcript input
│   │   ├── ViewAnalysis.tsx       # Single analysis view page
│   │   └── ViewPastAnalyses.tsx   # Past analyses list page
│   ├── lib/
│   │   ├── contract.ts            # Shared API contract (from backend)
│   │   ├── api-client.ts          # ts-rest client
│   │   └── api-query.ts           # React Query integration
│   ├── types/
│   │   └── index.tsx              # TypeScript type definitions
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts             # TypeScript declarations
├── index.html                     # HTML template
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Component Overview

### Components

#### TranscriptInput
**Purpose**: Capture meeting transcript from user

**Features**:
- Multi-line textarea with auto-resize
- Character count validation
- Sample transcript loader
- Clear functionality
- Submit button with loading state

**Props**:
- `onSubmit: (transcript: string) => void`
- `isLoading: boolean`

#### AnalysisResults
**Purpose**: Display AI-generated insights

**Features**:
- Sentiment card with color-coded tags
- Action items with priority indicators
- Decisions with status tags
- Owner and deadline tags
- New analysis button

**Props**:
- `analysis: AnalysisResponse`
- `onNewAnalysis: () => void`

#### SideBar
**Purpose**: Navigation sidebar for the application

**Features**:
- Route navigation
- Active route highlighting
- Responsive menu

#### LoadingSpinner
**Purpose**: Reusable loading state indicator

**Features**:
- Animated spinner
- Optional loading message
- Consistent styling across the app

#### ErrorAlert
**Purpose**: Display error messages to users

**Features**:
- Clear error messaging
- Optional retry functionality
- Dismissible alerts

### Pages

#### Home
**Purpose**: Main landing page with transcript input

**Features**:
- Transcript submission form
- Quick access to analysis

#### ViewAnalysis
**Purpose**: Display individual analysis results

**Features**:
- Full analysis details
- Action items and decisions
- Sentiment analysis

#### ViewPastAnalyses
**Purpose**: Browse historical analyses

**Features**:
- List of past analyses
- Quick navigation to individual results
- Search and filter capabilities

## Design Decisions

### Why PrimeReact?
- Rich component library out of the box
- Professional UI with minimal custom styling
- Good TypeScript support
- Theming system (using Lara Light Blue)
- Fast development for MVP

### Why TanStack Query?
- Excellent loading/error state management
- Built-in caching
- Perfect for ts-rest integration
- Automatic refetching and retries

### UI Design Choices
- **Card-based layout**: Clear visual separation of insights
- **Color coding**: Visual hierarchy for priorities and statuses
  - Green: Positive, completed, made decisions
  - Yellow: Pending, medium priority, warnings
  - Red: High priority, negative sentiment
  - Blue: Info, low priority, neutral
- **Icons**: PrimeIcons for visual context
- **Progressive disclosure**: Cards can be expanded later for more details

### Error Handling
- Network errors show clear retry options
- Validation errors appear inline
- Backend errors display user-friendly messages
- Loading states prevent multiple submissions

## Type Safety

The frontend shares the API contract with the backend through `src/lib/contract.ts`:
- Input/output validation with Zod
- Type-safe API calls
- Compile-time error detection
- IntelliSense in IDE

## Customization

### Changing Theme
Edit `src/index.css` to change PrimeReact theme:
```css
@import 'primereact/resources/themes/[theme-name]/theme.css';
```

Available themes: lara-light-blue, lara-dark-blue, bootstrap4-light-blue, etc.

### Styling
- Use Tailwind utility classes for spacing and colors
- PrimeReact components have built-in styling
- Custom styles can be added to component files

## Future Enhancements

- [ ] Export results as PDF/Markdown
- [ ] Copy individual items to clipboard
- [ ] Filter/search within results
- [ ] Real-time analysis progress
- [ ] Dark mode support
- [ ] Transcript file upload
- [ ] Share analysis via URL

## Troubleshooting

**Frontend not connecting to backend?**
- Ensure backend is running on port 3001
- Check CORS settings in backend
- Verify API URL in .env

**Build errors?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node version: `node -v` (should be 18+)

**Styling issues?**
- Make sure Tailwind classes are being processed
- Check that PrimeReact CSS is imported in index.css

## Testing the App

1. Start the backend server
2. Start the frontend: `npm run dev`
3. Click "Load Sample" to populate with example transcript
4. Click "Analyse Transcript"
5. View the AI-generated insights

## Production Build

```bash
npm run build
npm run preview
```

The build output will be in the `dist/` directory.
