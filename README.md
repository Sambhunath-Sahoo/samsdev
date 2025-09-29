# Sambhunath Sahoo - Portfolio

A clean, minimal portfolio website built with Next.js 15, inspired by modern design principles and focused on showcasing professional experience and projects.

## 🚀 Features

- **Modern Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Dark/Light Theme**: Seamless theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with clean typography
- **Performance Optimized**: Fast loading with Next.js optimizations
- **Clean Architecture**: Well-organized component structure
- **Type Safe**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Theme**: next-themes for dark/light mode
- **Fonts**: Geist Sans & Geist Mono
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── blog/              # Blog page
│   ├── photos/            # Photos page
│   ├── projects/          # Projects page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── navbar.tsx         # Navigation component
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Theme switcher
└── data/
    └── personal-info.json # Portfolio data
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sambhunathsahoo/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Customization

### Personal Information

Edit `src/data/personal-info.json` to update:
- Personal details (name, title, bio)
- Work experience
- Projects
- Skills and technologies
- Social links

### Styling

- Global styles: `src/app/globals.css`
- Tailwind config: Uses Tailwind CSS v4 with inline configuration
- Theme colors: Defined in CSS custom properties

### Adding New Pages

Create new pages in the `src/app/` directory following Next.js App Router conventions.

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sambhunathsahoo/portfolio)

## 🎨 Design Inspiration

This portfolio is inspired by clean, minimal design principles focusing on:
- Typography-first approach
- Generous whitespace
- Subtle animations and transitions
- Professional color palette
- Mobile-responsive design

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/sambhunathsahoo/portfolio/issues).

## 📞 Contact

Sambhunath Sahoo - [Your Email](mailto:your.email@example.com)

Project Link: [https://github.com/sambhunathsahoo/portfolio](https://github.com/sambhunathsahoo/portfolio)

---

⭐ Star this repo if you found it helpful!