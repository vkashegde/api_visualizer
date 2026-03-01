# API Visualizer - HTTP Request Lifecycle

A beautiful, responsive web application that visualizes the HTTP request lifecycle in real-time. Built with Next.js, React, and Tailwind CSS.

## Features

- 🎨 **Beautiful UI** - Modern dark theme with neon-colored highlights
- 📱 **Fully Responsive** - Works seamlessly on mobile and desktop
- ⚡ **Real-time Tracking** - Watch each stage of the HTTP request lifecycle
- 📊 **Visual Analytics** - Pipeline visualization, timing waterfall, and detailed logs
- 🔍 **Browser Render Details** - Step-by-step breakdown of the rendering process

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a URL in the input field (e.g., `https://example.com/index.html`)
2. Click "Track" to start the visualization
3. Watch as each stage of the HTTP request lifecycle is displayed:
   - DNS Lookup
   - TCP Handshake
   - TLS Handshake (for HTTPS)
   - HTTP Request
   - HTTP Response
   - Browser Render

## Project Structure

```
api_visualizer/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and classes
└── public/          # Static assets
```

## Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library

## License

MIT
