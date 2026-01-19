# Budget Tracker Pro 💰

A professional, cloud-synced budget tracking application with comprehensive financial management features. Built with modern web technologies for cross-platform compatibility.

## 🚀 How to Run the App

### Quick Start (Recommended)
1. **Double-click `index.html`** or open it in your web browser
2. Sign in with your Google account to start tracking your finances

### Alternative Methods
- **Web Server**: Run `python -m http.server 8000` and open `http://localhost:8000`
- **Local File**: Simply open `index.html` directly in any modern web browser

### 💳 Core Financial Tracking
- **Income & Expense Tracking** - Log all your financial transactions
- **Account Management** - Multiple accounts and asset tracking
- **Transfer Support** - Move money between accounts seamlessly
- **Budget Planning** - Set and monitor spending limits by category

### 🔍 Advanced Features
- **Smart Search** - Search across all transaction fields (amount, description, category, date)
- **Custom Reminders** - Set recurring reminders for bills and income
- **Real-time Analytics** - Interactive charts and financial insights
- **Data Export** - Export data in CSV or JSON format for backup/analysis

### ☁️ Cloud & Security
- **Firebase Integration** - Secure cloud storage and synchronization
- **User Authentication** - Secure login system
- **Auto-logout** - Automatic logout after 5 minutes of inactivity
- **Data Privacy** - All data stored securely in your Firebase account

### Quick Start

**⚠️ Important:** Do NOT double-click `index.html` directly! This causes CORS errors.

**✅ Correct way to run:**
1. Double-click `run-pwa.bat` (auto-generates icons and starts server), OR
2. Double-click `LAUNCH.html` for setup instructions, OR
3. Open `icon-generator-canvas.html` in browser to generate icons manually, OR
4. Run `python generate_icons_simple.py && python -m http.server 8000` and open `http://localhost:8000`

### Installation
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Firebase account for cloud features

### Installation

1. **Clone or download** this repository
2. **Configure Firebase** (see setup instructions below)
3. **Generate PWA Icons** (optional - SVG icons work for basic functionality):
   ```bash
   npm install
   npm run generate-icons
   ```
4. **Start the development server**:
   ```bash
   # Windows
   double-click start-server.bat
   
   # Or manually:
   python -m http.server 8000
   ```
5. **Open in browser**: `http://localhost:8000`

### Troubleshooting

**CORS Errors / Manifest Loading Issues:**
- **Problem**: Opening `index.html` directly in browser shows CORS errors
- **Solution**: Always serve through a web server (HTTP/HTTPS), never open as `file://`
- **Quick Fix**: Use the provided `start-server.bat` or run `python -m http.server 8000`

**Missing Icon Files:**
- **Problem**: `icon-192.png` and `icon-512.png` not found
- **Solution**: Run `npm install && npm run generate-icons` to create PNG icons
- **Temporary Fix**: SVG icons are used by default and work for basic PWA functionality

**JavaScript Errors:**
- **Problem**: "Cannot read properties of undefined (reading 'target')"
- **Solution**: This has been fixed in the latest version. Make sure you're using the updated code.

### Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication and Firestore Database
3. Copy your Firebase config and replace the placeholder in `index.html`

## 📊 Usage

### Getting Started
1. **Sign Up/Login** - Create your account
2. **Add Accounts** - Set up your bank accounts and assets
3. **Log Transactions** - Record income and expenses
4. **Set Budgets** - Define spending limits
5. **View Analytics** - Monitor your financial health

### Key Features
- **Dashboard** - Overview of income, expenses, and balance
- **Transactions** - Detailed transaction history with search
- **Accounts** - Manage multiple accounts and transfers
- **Budgets** - Track spending against budgets
- **Reminders** - Custom recurring reminders
- **Analytics** - Charts and financial insights
- **Export** - Download your data for backup

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore)
- **Charts**: Chart.js for data visualization
- **Styling**: Tailwind CSS with custom gradients

## 🔧 Development

### Local Development
```bash
# Start local server
python -m http.server 8000
# or
npx serve .

# Open in browser
# http://localhost:8000
```

### Project Structure
```
├── index.html          # Main application
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── icon-generator.html # Icon generation tool
├── generate-icons.js   # Node.js icon generator
├── icons/             # PWA icons
├── PWA-README.md      # PWA setup guide
└── README.md          # This file
```

## 📋 API Reference

### Firebase Configuration
Replace the placeholder config in `index.html`:
```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋 Support

If you encounter any issues or have questions:
1. Check the PWA-README.md for setup issues
2. Verify your Firebase configuration
3. Ensure you're using a modern browser
4. Check browser console for error messages

---

**Built with ❤️ for personal finance management**
