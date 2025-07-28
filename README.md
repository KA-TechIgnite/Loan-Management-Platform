# LMP Frontend Application

A production-ready frontend application for loan management and processing, built with HTML, CSS, and JavaScript. This application provides a comprehensive interface for customers and managers to handle loan applications, calculations, and status tracking.

## 🚀 Project Overview

The Loan Accelerator application is designed to streamline the loan application process with an intuitive user interface that supports both customer and manager roles. The application features real-time EMI calculations, application tracking, credit score monitoring, and comprehensive dashboard analytics.

## 📁 Project Structure

```
Loan-Accelerator/
├── index.html                 # Main HTML file with login and dashboard pages
├── loan-application.html      # Multi-step loan application form
├── styles/                    # CSS stylesheets
│   ├── main.css              # Global styles and utilities
│   ├── components.css        # Component-specific styles
│   ├── pages.css             # Page-specific styles
│   └── loan-application.css  # Loan application specific styles
├── js/                       # JavaScript modules
│   ├── app.js               # Main application logic and navigation
│   ├── auth.js              # Authentication and session management
│   ├── dashboard.js         # Dashboard functionality and data management
│   ├── charts.js            # Chart visualizations using Chart.js
│   ├── loan-application.js  # Loan application form logic
│   └── api.js               # API service for .NET backend integration
└── README.md                # Project documentation
```

## 🛠️ Technology Stack

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Modular architecture with modern features
- **Chart.js**: Data visualization for charts and graphs
- **Font Awesome**: Icon library for UI elements
- **Responsive Design**: Mobile-first approach

## 🎯 Features

### Authentication System
- Role-based login (Customer/Manager)
- Session management with token-based authentication
- Password validation and security measures
- Auto-logout on token expiration

### Dashboard Components
- **Welcome Section**: Personalized user greeting
- **EMI Calculator**: Real-time loan calculation with visual charts
- **Application Status**: Comprehensive table of loan applications
- **Eligibility Score**: Credit score gauge with status indicators
- **Application Profile**: Loan repayment progress tracking

### Interactive Features
- Real-time EMI calculations
- Dynamic chart updates
- Responsive data tables
- Form validation and error handling
- Loading states and user feedback
- Multi-step loan application process
- Document upload functionality
- Progress tracking and summary updates

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)
- .NET backend API (for full functionality)

### Installation

1. **Clone or download the project files**
   ```bash
   git clone <repository-url>
   cd loan-accelerator
   ```

2. **Serve the files using a local web server**
   
   **Option A: Using Python (if installed)**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **Option B: Using Node.js (if installed)**
   ```bash
   npx http-server -p 8000
   ```
   
   **Option C: Using Live Server (VS Code extension)**
   - Install Live Server extension in VS Code
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Demo Credentials

For testing purposes, the application accepts any valid email and password combination:

- **Admin Access**: `admin@test.com` / `admin123`
- **General Access**: Any email format with password length ≥ 6 characters
- **Roles**: Select either "Customer" or "Manager" during login

## 🎨 Component Mapping to UI Design

### Login Page (First Image)

| Component | Description | File Location |
|-----------|-------------|---------------|
| **Welcome Section** | Left side branding with gradient background | `styles/pages.css` (.login-left) |
| **Logo Component** | Circular logo with "L" branding | `styles/main.css` (.logo-icon) |
| **Role Selector** | Customer/Manager selection buttons | `styles/components.css` (.role-selector) |
| **Login Form** | Email, password inputs with validation | `js/auth.js` (authentication logic) |
| **Dashboard Preview** | Mockup preview of dashboard interface | `styles/pages.css` (.dashboard-preview) |

### Dashboard Page (Second Image)

| Component | Description | File Location |
|-----------|-------------|---------------|
| **Header Navigation** | Top bar with search, notifications, profile | `styles/components.css` (.dashboard-header) |
| **Sidebar Menu** | Left navigation with menu items | `styles/components.css` (.sidebar) |
| **EMI Calculator** | Loan calculation with donut chart | `js/dashboard.js` + `js/charts.js` |
| **Application Status Table** | Loan applications with status badges | `js/dashboard.js` (.updateApplicationTable) |
| **Eligibility Score Gauge** | Credit score visualization | `js/charts.js` (.initEligibilityScoreGauge) |
| **Application Profile** | Loan repayment progress charts | `js/charts.js` (.initProfileCharts) |

### Loan Application Pages (New Multi-Step Flow)

| Component | Description | File Location |
|-----------|-------------|---------------|
| **Loan Category Selection** | 9 loan types with icon selection | `loan-application.html` (loan-category-page) |
| **Loan Details Form** | Amount, tenure, date inputs with tabs | `js/loan-application.js` (validateLoanDetails) |
| **Document Upload** | File upload for verification documents | `js/loan-application.js` (initializeFileUploads) |
| **Personal Information** | Comprehensive personal details form | `styles/loan-application.css` (.personal-info-form) |
| **Address Information** | Present and permanent address forms | `styles/loan-application.css` (.address-info-form) |
| **Step Navigation** | Progress tracking with completed steps | `styles/loan-application.css` (.step-navigation) |
| **Summary Panel** | Real-time application summary | `js/loan-application.js` (updateLoanDetailsSummary) |

## 🔌 .NET Backend Integration Points

The application is designed with placeholder logic for seamless integration with a .NET backend. Here are the key integration points:

### Authentication Endpoints

```javascript
// Login Integration
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"
}

// Token Refresh
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}

// Session Validation
GET /api/auth/validate
Headers: { "Authorization": "Bearer token_here" }
```

### User Management Endpoints

```javascript
// Get User Profile
GET /api/user/profile
Headers: { "Authorization": "Bearer token_here" }

// Update Profile
PUT /api/user/profile
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### Loan Calculation Endpoints

```javascript
// Calculate EMI
POST /api/loans/calculate-emi
{
  "loanType": "Personal Loan",
  "amount": 300000,
  "tenure": 24,
  "interestRate": 7.21
}

// Check Eligibility
POST /api/loans/eligibility
{
  "income": 50000,
  "creditScore": 750,
  "existingLoans": 100000
}
```

### Application Management Endpoints

```javascript
// Submit Application
POST /api/applications
{
  "loanType": "Personal Loan",
  "amount": 300000,
  "tenure": 24,
  "purpose": "Home renovation"
}

// Get Applications
GET /api/applications
Query: ?status=pending&page=1&limit=10

// Update Status (Manager only)
PATCH /api/applications/{id}/status
{
  "status": "approved",
  "comments": "Application approved after verification"
}
```

### File Upload Endpoints

```javascript
// Upload Documents
POST /api/documents/upload
Content-Type: multipart/form-data
{
  "file": File,
  "documentType": "income_proof",
  "applicationId": "APP123456"
}
```

## 🔧 Configuration

### API Configuration

Update the API base URL in `js/api.js`:

```javascript
const API_CONFIG = {
    baseUrl: 'https://your-api-domain.com/api', // Update this
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
};
```

### Environment Variables

For production deployment, consider using environment variables:

```javascript
const API_CONFIG = {
    baseUrl: process.env.API_BASE_URL || 'https://localhost:5001/api',
    // ... other config
};
```

## 📱 Responsive Design

The application is built with a mobile-first approach and includes:

- **Breakpoints**:
  - Mobile: < 480px
  - Tablet: 481px - 768px
  - Desktop: > 768px

- **Responsive Features**:
  - Collapsible sidebar on mobile
  - Stacked form layouts
  - Optimized touch targets
  - Readable font sizes
  - Accessible color contrasts

## 🎨 Customization

### Theming

The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #4285f4;
  --success-color: #34a853;
  --warning-color: #fbbc04;
  --error-color: #ea4335;
  --text-color: #333;
  --background-color: #f5f7fa;
}
```

### Adding New Components

1. Create HTML structure in `index.html`
2. Add styles in appropriate CSS file
3. Implement functionality in relevant JS module
4. Update this documentation

## 🔒 Security Considerations

- **Token Storage**: Uses localStorage (consider httpOnly cookies for production)
- **Input Validation**: Client-side validation (server-side validation required)
- **HTTPS**: Ensure all API calls use HTTPS in production
- **CORS**: Configure proper CORS policies on the backend
- **CSP**: Implement Content Security Policy headers

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with different roles
- [ ] EMI calculation with various inputs
- [ ] Application table sorting and filtering
- [ ] Chart responsiveness and data updates
- [ ] Mobile device compatibility
- [ ] Error handling and user feedback

### Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## 📈 Performance Optimization

- **Lazy Loading**: Charts initialized only when needed
- **Debounced Inputs**: EMI calculations debounced for performance
- **Efficient DOM Updates**: Minimal DOM manipulation
- **Optimized Assets**: Compressed CSS and minified JavaScript recommended for production

## 🚀 Deployment

### Static Hosting

The application can be deployed to any static hosting service:

- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

### Production Build

1. Minify CSS and JavaScript files
2. Optimize images and assets
3. Configure proper cache headers
4. Set up CDN for better performance
5. Enable GZIP compression

## 🔮 Future Enhancements

### Planned Features
- [ ] Dark/Light theme toggle
- [ ] Advanced filtering and search
- [ ] Real-time notifications
- [ ] Document preview functionality
- [ ] Export reports to PDF
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

### Technical Improvements
- [ ] TypeScript migration
- [ ] Unit test coverage
- [ ] E2E testing with Cypress
- [ ] State management with Redux
- [ ] Component library development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions, issues, or feature requests:

- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🙏 Acknowledgments

- Chart.js for excellent charting library
- Font Awesome for comprehensive icon set
- Modern CSS Grid and Flexbox for layout capabilities
- The design team for the beautiful UI mockups

---

**Note**: This application is designed as a frontend interface and requires a corresponding .NET backend API for full functionality. The current implementation includes placeholder data and mock API calls for demonstration purposes.