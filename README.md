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
- **Partnership Modal System** - Interactive partnership registration modal
- **Enhanced Header Design** - Optimized logo, navigation, and brand elements
- **Production-Ready Docker Setup** - Multi-stage build with health monitoring

## Technologies Used

### Frontend
- **HTML5**: Semantic markup with accessibility features and CSP security
- **CSS3**: Custom responsive design with modern animations and modal systems
- **JavaScript**: Interactive forms, mobile navigation, modals, and dynamic content
- **Responsive Design**: Mobile-first approach (768px+ breakpoints)
- **Video Integration**: YouTube embed with optimized loading
- **Modal Systems**: Partnership, contact, and confirmation modals with proper positioning

### Backend
- **Node.js 20**: Express.js server with security middleware
- **API Endpoints**: RESTful API for forms and registrations
- **Error Handling**: Comprehensive error management with custom error classes
- **Security**: Helmet, CORS, rate limiting, compression, and CSP headers
- **Health Monitoring**: Built-in health check endpoint with system metrics
- **Environment-Aware Configuration**: Development and production CORS settings

### Development Tools
- **Webpack**: Module bundling and build optimization with CSP integration
- **ESLint**: Code quality and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality
- **Docker**: Multi-stage build with production optimization

### Infrastructure
- **Docker**: Multi-stage build with health checks and security best practices
- **Kubernetes**: Production-ready deployment configurations
- **Environment Management**: Development and production environment separation

## Project Structure

```
Udeaku-CareSpring/
├── 📁 public/                    # Static assets (deployment ready)
│   ├── 📄 index.html            # Main landing page with partnership modal
│   ├── 📄 about.html            # About page with centered contact section
│   ├── 📄 projects.html         # Projects/workshop page
│   ├── 📄 404.html              # Custom error page with CSP
│   ├── 📁 css/styles.css        # Complete stylesheet with modal styles
│   ├── 📁 js/main.js            # JavaScript bundle with modal functionality
│   ├── 📁 js/donation.js        # Donation form handling
│   ├── 📁 images/               # Images (15+ files including optimized logos)
│   └── 📁 videos/               # Video files (outreach.mp4, outreach2.mp4)
├── 📁 src/                      # Source code
│   └── 📁 server/               # Backend API
│       ├── controllers/         # API handlers (workshop, contact, payment, donation)
│       ├── middleware/          # Error handling and security
│       ├── utils/               # Utilities and helpers
│       └── server.js            # Express server with health endpoint
├── 📁 docs/                     # Documentation
├── 📁 k8s/                      # Kubernetes configs (production ready)
├── 📄 package.json              # Dependencies & scripts
├── 📄 webpack.config.js        # Build configuration with CSP headers
├── 📄 Dockerfile               # Multi-stage Docker configuration
├── 📄 .dockerignore            # Docker ignore patterns
├── 📄 .env.example              # Environment template
├── 📄 .env.production           # Production environment variables
├── 📄 .eslintrc.js              # ESLint configuration
├── 📄 .gitignore                # Git exclusions
└── 📄 README.md                 # This file
```

## Features Implemented

### ✅ Interactive Components
- **Enhanced Mobile Navigation**: Responsive hamburger menu with smooth animations
- **Advanced Modal Systems**: 
  - Partnership registration modal with proper section positioning
  - Contact forms with validation and confirmation overlays
  - Workshop registration with multi-step forms
- **Optimized Header Design**: 
  - Increased logo size (100px x 100px) with proper container fitting
  - Enhanced brand text and navigation buttons
  - Consistent styling across all pages
- **Video Showcase**: Embedded YouTube videos with responsive design
- **News Grid**: Dynamic content display with 2x2 responsive layout
- **Form Validation**: Client-side and server-side validation with error handling

### ✅ Backend Integration
- **API Endpoints**: 
  - `POST /api/register` - Workshop registration with validation
  - `POST /api/contact` - Contact form submissions
  - `POST /api/send-partnership-email` - Partnership inquiries
  - `GET /health` - Health check endpoint with system metrics
- **Enhanced Error Handling**: Comprehensive error management with custom error classes
- **Advanced Security**: Rate limiting, environment-aware CORS, helmet security headers
- **Form Validation**: Input sanitization and validation with proper error responses
- **Health Monitoring**: Real-time health checks with uptime and version information

### ✅ Design Features
- **Responsive Design**: Mobile-first approach (1-column mobile, 2-column desktop)
- **Modern UI**: Gradient backgrounds, smooth animations, hover effects
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance**: Lazy loading, optimized images, minified assets
- **SEO**: Meta tags, structured data, semantic markup
- **Modal Positioning**: Proper z-index management and section-relative positioning
- **Cache Management**: Cache-busting parameters for CSS and assets

### ✅ Production Features
- **Docker Optimization**: Multi-stage builds with minimal attack surface
- **Health Monitoring**: Built-in health checks with wget-based monitoring
- **Environment Configuration**: Separate development and production settings
- **Security Hardening**: Non-root user execution, proper signal handling
- **Domain Configuration**: Updated for udeakucarespringsupportfoundation.org

## Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Latest version
- **Docker**: For containerized deployment (optional)
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
   - Health Check: http://localhost:5001/health

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

### Docker Production Deployment (Recommended)

1. **Build production image:**
   ```bash
   docker build -t udeaku-carespring:latest .
   ```

2. **Run with production environment:**
   ```bash
   docker run -p 5001:5001 --env-file .env.production udeaku-carespring:latest
   ```

3. **Health Check:**
   ```bash
   curl http://localhost:5001/health
   ```

### Kubernetes Deployment

1. **Deploy to Kubernetes:**
   ```bash
   npm run k8s:deploy
   ```

2. **Check deployment status:**
   ```bash
   npm run k8s:status
   ```

3. **View logs:**
   ```bash
   npm run k8s:logs
   ```

### Static Deployment Alternative

The frontend can be deployed as a static site to:
- Netlify (recommended)
- Vercel
- GitHub Pages
- Any static hosting service

## API Documentation

### Available POST /api Endpoints

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

#### Contact Form Submission
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "info@udeakucarespringsupportfoundation.org",
  "subject": "Inquiry",
  "message": "I would like more information...",
  "phone": "+234XXXXXXXXXX"
}
```

#### Partnership Inquiry
```http
POST /api/send-partnership-email
Content-Type: application/json

{
  "orgName": "Organization Name",
  "orgType": "NGO",
  "contactPerson": "John Doe",
  "contactEmail": "info@udeakucarespringsupportfoundation.org",
  "contactPhone": "+234XXXXXXXXXX",
  "partnershipInterest": "Training Program",
  "orgSize": "50-100",
  "partnershipGoals": "Community outreach",
  "availableResources": "Volunteers, funding",
  "timeline": "Q1 2025",
  "additionalInfo": "Additional details"
}
```

#### Payment Initialization
```http
POST /api/payment/initialize
Content-Type: application/json

{
  "email": "donor@example.com",
  "donorName": "John Doe",
  "phone": "+234XXXXXXXXXX",
  "paymentMethod": "paystack|googlepay|stripe",
  "currency": "NGN|USD|EUR"
}
```

#### Paystack Webhook Handler
```http
POST /api/payment/webhook
Headers: x-paystack-signature
Content-Type: application/json

{
  "event": "charge.success",
  "data": {
    "reference": "UDK-123456789",
    "amount": 500000,
    "customer": {
      "email": "donor@example.com"
    }
  }
}
```

#### Create Donation (Admin)
```http
POST /api/donations
Content-Type: application/json

{
  "donorName": "John Doe",
  "email": "donor@example.com",
  "amount": 5000,
  "paymentMethod": "paystack",
  "status": "completed",
  "reference": "UDK-123456789"
}
```

### Other Available Endpoints

#### Health Check
```http
GET /health
Response: {
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "version": "1.0.0",
  "environment": "production"
}
```

#### Payment Verification
```http
GET /api/payment/verify/:reference
Response: {
  "status": "success",
  "data": {
    "reference": "UDK-123456789",
    "status": "success",
    "amount": 5000
  }
}
```

#### Donation Management (Admin)
```http
GET /api/donations              # Get all donations
GET /api/donations/:id          # Get donation by ID
PATCH /api/donations/:id/status # Update donation status
GET /api/donations/stats        # Get donation statistics
DELETE /api/donations/:id       # Delete donation
```

## Recent Improvements

### ✅ Modal System Enhancements
- **Partnership Modal**: Fixed positioning to appear over partnership section instead of hero
- **Cancel Button**: Added proper event listener for modal closing
- **Scrolling**: Eliminated double scrollbars with optimized modal height
- **Sticky Actions**: Action buttons remain visible when scrolling long forms

### ✅ Header Design Optimization
- **Logo Sizing**: Increased to 100px x 100px with proper container fitting
- **Brand Enhancement**: Larger font sizes for brand text and navigation
- **Consistency**: Uniform styling across index.html, about.html, and projects.html
- **Image Optimization**: Full logo image display without cropping

### ✅ Production Readiness
- **Docker Health Checks**: Robust health monitoring with wget-based checks
- **Environment Configuration**: Separate development and production CORS settings
- **Security Hardening**: Non-root user execution, proper signal handling
- **Domain Updates**: Complete migration to udeakucarespringsupportfoundation.org

### ✅ Code Quality
- **CSP Headers**: Content Security Policy across all pages and webpack config
- **Error Handling**: Comprehensive error management with custom error classes
- **Form Validation**: Enhanced client and server-side validation
- **Accessibility**: Improved ARIA labels and semantic HTML

## Code Quality

- **ESLint**: Configured with recommended rules and Prettier integration
- **Prettier**: Consistent code formatting
- **Git Hooks**: Pre-commit hooks for code quality
- **Build Process**: Webpack optimization for production
- **Security**: CSP headers, rate limiting, and input validation

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
- **Cache Management**: Cache-busting for CSS and static assets

## Security Features

- **Content Security Policy**: Comprehensive CSP headers across all pages
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Environment-aware CORS settings
- **Helmet Security**: Security headers and best practices

## Development Guidelines

- Follow ESLint rules and Prettier formatting
- Write meaningful commit messages
- Update documentation as needed
- Ensure mobile responsiveness
- Test modal functionality across browsers
- Verify health check endpoints in production

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Built and powered by: Avalance Tech Resources

For more enquiries about the developer team, please contact:

- **Email**: avalancetechpartner@gmail.com
- **WhatsApp**: +234 802 9819798
- **website**: https://solutions.avalance-resources.online

---

**Project Status**: ✅ Production Ready  
**Last Updated**: November 2024  
**Version**: 1.0.0  
**Domain**: udeakucarespringsupportfoundation.org
# Carespring-Cloudflare
# Carespring-Cloudflare
# Carespring-Cloudflare
