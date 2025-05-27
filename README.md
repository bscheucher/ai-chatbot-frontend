# AI Chatbot Frontend

A modern, responsive React frontend for the AI Chatbot application built with Vite, React 18, and Tailwind CSS.

## Features

- 🚀 **Modern Stack**: React 18 + Vite + Tailwind CSS
- 🎨 **Beautiful UI**: Clean, responsive design with smooth animations
- 🔒 **Authentication**: JWT-based auth with protected routes
- 💬 **Real-time Chat**: Smooth chat interface with typing indicators
- 🤖 **Multi-Model Support**: OpenAI, Anthropic, and Google AI models
- 📱 **Mobile Responsive**: Works seamlessly on all devices
- 🎯 **State Management**: Zustand for efficient state management
- 🔄 **Data Fetching**: React Query for server state management
- 📝 **Form Handling**: React Hook Form with validation
- 🎨 **Component Library**: Custom UI components with Headless UI
- 🌟 **Loading States**: Skeleton loaders and smooth transitions
- 🔔 **Notifications**: Toast notifications for user feedback

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query v3)
- **Routing**: React Router DOM v6
- **Form Handling**: React Hook Form
- **UI Components**: Headless UI
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── auth/           # Authentication components
│   └── chat/           # Chat-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Zustand stores
├── utils/              # Utility functions
└── styles/             # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- AI Chatbot Backend running on port 5000

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-chatbot-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI

## Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Development
VITE_APP_ENV=development
```

## Key Components

### Authentication
- **LoginForm**: User login with validation
- **RegisterForm**: User registration
- **ProtectedRoute**: Route protection wrapper

### Chat Interface
- **ChatContainer**: Main chat interface
- **ChatMessage**: Individual message component
- **ChatInput**: Message input with auto-resize
- **ModelSelector**: AI model selection dropdown

### Layout
- **Header**: Navigation header with user menu
- **Sidebar**: Conversation list and navigation
- **Layout**: Main application layout wrapper

## State Management

The app uses Zustand for state management with two main stores:

### Auth Store (`authStore.js`)
- User authentication state
- Login/logout actions
- User preferences

### Chat Store (`chatStore.js`)
- Conversation management
- Message history
- Model selection
- Real-time chat state

## API Integration

All API calls are handled through service files:

- **authService.js**: Authentication endpoints
- **chatService.js**: Chat and conversation endpoints
- **modelService.js**: AI model endpoints

## Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color scheme
- Responsive design utilities
- Custom animations

### Custom Components
- Consistent design system
- Reusable UI components
- Accessible form controls
- Loading states and animations

## Features Overview

### 🔐 Authentication
- Secure JWT-based authentication
- Persistent login state
- Protected routes
- User preferences management

### 💬 Chat Interface
- Real-time-like messaging
- Multiple AI model support
- Conversation history
- Message timestamps
- Typing indicators
- Auto-scrolling

### 🎨 User Experience
- Smooth animations
- Loading states
- Error handling
- Toast notifications
- Responsive design
- Dark/light theme support

### 📱 Mobile Support
- Touch-friendly interface
- Responsive layout
- Mobile-optimized navigation
- Swipe gestures (planned)

## Performance Optimizations

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Optimistic Updates**: Immediate UI feedback
- **Caching**: React Query for intelligent caching

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Use TypeScript-like prop validation

### Component Structure
- Keep components small and focused
- Use custom hooks for logic
- Implement proper loading states
- Handle errors gracefully

### State Management
- Use Zustand for global state
- Keep local state for UI-only data
- Implement optimistic updates
- Handle async operations properly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details