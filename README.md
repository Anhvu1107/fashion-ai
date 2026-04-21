# fashion-ai

AI fashion assistant for outfit analysis, visual search, and style guidance.

## Highlights

- Image upload flow with drag-and-drop support.
- Gemini Vision integration for fashion analysis.
- Product/search UI with animated transitions and reusable views.
- Client-side state management for uploaded images, analysis history, and search results.
- Responsive dark luxury interface built for a fashion/e-commerce context.

## Tech Stack

| Area | Stack |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS 4, Framer Motion, Lucide React |
| State | Zustand |
| AI | Gemini API / Gemini Vision |
| UX | React Dropzone, animated navigation, history and search views |

## Project Structure

```text
src/
  components/    Shared UI components
  data/          Mock product data
  locales/       English/Vietnamese labels
  store/         Zustand application store
  views/         Main app screens
```

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and add your Gemini settings:

```env
VITE_GEMINI_API_KEY=your_api_key
VITE_GEMINI_MODEL=your_model
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build production assets |
| `npm run preview` | Preview the production build |

