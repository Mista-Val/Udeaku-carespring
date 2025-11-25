# Udeaku CareSpring Support Foundation

![Udeaku CareSpring Logo](https://via.placeholder.com/150x50?text=Udeaku+CareSpring)  
*Empowering Communities Through Health Education & Support*

## About

Udeaku CareSpring Support Foundation is a non-profit organization dedicated to promoting first aid education, health awareness, and community support in Nigeria. Our mission is to equip individuals with life-saving skills and create a culture of care and compassion in communities.

## Key Features

- **5-Day First Aid Training Workshop** - Comprehensive certification program
- **Community Health Awareness Programs** - Outreach and education initiatives
- **Youth & Student Empowerment** - Leadership and skill development
- **Women's Health & Hygiene Programs** - Pad-a-Girl campaign and support
- **Volunteer & Support Networks** - Community engagement opportunities
- **Global News & Updates** - Latest health information and research
- **Interactive Forms** - Contact, partnership, and workshop registration
- **Responsive Design** - Mobile-first approach for all devices

## Technologies Used

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom responsive design with modern animations
- **JavaScript**: Interactive forms, mobile navigation, modals
- **Responsive Design**: Mobile-first approach (768px+ breakpoints)
- **Video Integration**: YouTube embed with optimized loading

### Backend
- **Node.js**: Express.js server with security middleware
- **API Endpoints**: RESTful API for forms and registrations
- **Error Handling**: Comprehensive error management
- **Security**: Helmet, CORS, rate limiting, compression

### Development Tools
- **Webpack**: Module bundling and build optimization
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## Project Structure

```
Udeaku-CareSpring/
├── 📁 public/                    # Static assets (deployment ready)
│   ├── 📄 index.html            # Main landing page
│   ├── 📄 about.html            # About page
│   ├── 📄 projects.html         # Projects/workshop page
│   ├── 📄 404.html              # Custom error page
│   ├── 📁 css/styles.css        # Complete stylesheet
│   ├── 📁 js/main.js            # JavaScript bundle
│   ├── 📁 images/               # Images (15 files)
│   └── 📁 videos/               # Video files (outreach.mp4, outreach2.mp4)
├── 📁 src/                      # Source code
│   └── 📁 server/               # Backend API
│       ├── controllers/         # API handlers
│       ├── middleware/          # Error handling
│       ├── utils/               # Utilities
│       └── server.js            # Express server
├── 📁 docs/                     # Documentation
├── 📁 k8s/                      # Kubernetes configs
├── 📄 package.json              # Dependencies & scripts
├── 📄 webpack.config.js        # Build configuration
├── 📄 netlify.toml             # Deployment configuration
├── 📄 Dockerfile               # Docker container configuration
├── 📄 .dockerignore            # Docker ignore patterns
├── 📄 .eslintrc.js              # ESLint configuration
├── 📄 .env.example              # Environment template
├── 📄 .gitignore                # Git exclusions
└── 📄 README.md                 # This file
```

## Features Implemented

### ✅ Interactive Components
- **Mobile Navigation**: Responsive hamburger menu with smooth animations
- **Contact Forms**: Backend-integrated contact and partnership forms
- **Workshop Registration**: Complete registration flow with validation
- **Video Showcase**: Embedded YouTube videos with responsive design
- **News Grid**: Dynamic content display with 2x2 responsive layout
- **Modals**: Interactive contact and partnership modals

### ✅ Backend Integration
- **API Endpoints**: 
  - `POST /api/register` - Workshop registration
  - `POST /api/contact` - Contact form submissions
  - `POST /api/send-partnership-email` - Partnership inquiries
- **Error Handling**: Comprehensive error management
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Form validation and sanitization

### ✅ Design Features
- **Responsive Design**: Mobile-first approach (1-column mobile, 2-column desktop)
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Lazy loading, optimized images, minified assets
- **SEO**: Meta tags, structured data, semantic markup

## Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version
- **Modern web browser**: Chrome, Firefox, Safari, Edge

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/udeaku-carespring.git
   cd udeaku-carespring
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration (required)
   # The server will NOT start without PORT set in .env
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Frontend: http://localhost:3001
   - API: http://localhost:5001

## Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with hot reload
npm run build          # Build for production
npm run dev:client     # Start webpack dev server only
npm run lint           # Run ESLint code quality check
npm run lint:fix       # Fix ESLint issues automatically
npm run format         # Format code with Prettier
npm run docker:build   # Build Docker image
npm run docker:run     # Run Docker container
npm run k8s:deploy      # Deploy to Kubernetes
npm run k8s:delete      # Delete Kubernetes deployment
npm run k8s:logs        # View Kubernetes logs
npm run k8s:status      # Check Kubernetes status
```

## Deployment

### Frontend (Netlify)

1. **Connect repository** to Netlify
2. **Build settings** (auto-configured via `netlify.toml`):
   - Build command: `npm install && npm run build`
   - Publish directory: `./`
   - Node version: 20

3. **Environment variables** (in Netlify dashboard):
   - Set production values from `.env.example`

### Backend (Heroku/Vercel/Render)

1. **Deploy** `src/server/` directory
2. **Set environment variables**
3. **Configure** database if needed
4. **Scale** as needed

### Docker Deployment

1. **Build Docker image:**
   ```bash
   docker build -t udeaku-carespring .
   ```

2. **Run container:**
   ```bash
   docker run -p 5001:5001 --env-file .env udeaku-carespring
   ```

3. **Docker Compose (optional):**
   ```bash
   docker-compose up -d
   ```

### Static Deployment Alternative

The frontend can be deployed as a static site to:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any static hosting service

## API Documentation

### Endpoints

#### Workshop Registration
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "info@udeakucarespringsupportfoundation.org",
  "phone": "+234XXXXXXXXXX",
  "workshop": "First Aid Training"
}
```

#### Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "info@udeakucarespringsupportfoundation.org",
  "subject": "Inquiry",
  "message": "I would like more information..."
}
```

#### Partnership Inquiry
```http
POST /api/send-partnership-email
Content-Type: application/json

{
  "orgName": "Organization Name",
  "contactPerson": "John Doe",
  "contactEmail": "info@udeakucarespringsupportfoundation.org",
  "partnershipInterest": "Training Program"
}
```

## Code Quality

- **ESLint**: Configured with recommended rules and Prettier integration
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit hooks for code quality
- **Build Process**: Webpack optimization for production

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Image Optimization**: WebP format, lazy loading
- **Bundle Size**: Optimized with Webpack
- **Loading**: Progressive loading with skeleton screens

### Development Guidelines

- Follow ESLint rules and Prettier formatting
- Write meaningful commit messages
- Update documentation as needed
- Ensure mobile responsiveness

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Built and powered by: Avalance Tech Resources

For more enquiries about the developer team, please contact:

- **Email**: avalancetechpartner@gmail.com
- **WhatsApp**: +234 802 9819798
- **website**: https://solutions.avalance-resources.online
