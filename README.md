# 🚗 CarApp - Vehicle Auction Platform

A modern React Native application built with Expo for vehicle auction management, featuring smart notifications, intelligent search, and seamless user experience.

## ✨ Features

### 🔍 Smart Search System
- **Dynamic Data Extraction**: Automatically extracts available makes/models from vehicle data
- **Intelligent Matching**: Supports exact, partial, and fuzzy search with typo tolerance
- **Advanced Algorithm**: Multi-tier search hierarchy with fallback mechanisms
- **Autocomplete Ready**: Built-in search suggestions for future UI enhancement

### 🔔 Advanced Notification System
- **Smart Notifications**: Context-aware auction reminders and updates
- **Multi-Platform Support**: Native notifications for development builds, Expo notifications for Expo Go
- **Automatic Detection**: Seamlessly switches between notification services
- **Customizable Settings**: User-controlled notification preferences

### 🎨 Modern UI/UX
- **Dark/Light Theme**: System-aware theme switching with manual override
- **Responsive Design**: Optimized for various screen sizes and orientations
- **Intuitive Navigation**: Drawer navigation with context-aware menu items
- **Accessibility**: WCAG-compliant design with proper contrast ratios

### 🚀 Performance & Architecture
- **Modular Redux**: Vehicles-only Redux state with Context API for authentication
- **Smart Caching**: Optimized data persistence with redux-persist
- **Clean Architecture**: Separation of concerns with dedicated services and utilities
- **Memory Efficient**: Cleaned unused utilities and optimized bundle size

### 🔐 Authentication & Security
- **Context-Based Auth**: Secure authentication using React Context API
- **Persistent Sessions**: Automatic login state restoration
- **Secure Storage**: Encrypted AsyncStorage for sensitive data
- **Form Validation**: Comprehensive email and required field validation

## 🏗️ Architecture

### **State Management**
```
Redux Toolkit (Vehicles) + Context API (Auth/Theme)
├── Vehicles: Redux with persistence
├── Authentication: Context API with AsyncStorage
├── Theme: Context API with system detection
└── Notifications: Smart service architecture
```

### **Project Structure**
```
app/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Modal, etc.)
│   └── ...             # Feature-specific components
├── contexts/           # React Context providers
│   └── AuthContext.jsx # Authentication & theme management
├── hooks/              # Custom React hooks
│   ├── useVehicleFilters.js  # Smart vehicle filtering
│   ├── useApiHooks.js        # API management
│   └── useAuctionNotifications.js # Notification handling
├── navigation/         # Navigation structure
├── screens/           # Application screens
├── services/          # Business logic & API services
├── store/             # Redux store (vehicles only)
├── utils/             # Utility functions
│   ├── searchUtils.js # Advanced search algorithms
│   ├── dateUtils.js   # Date parsing utilities
│   └── ...            # Other utilities
└── constants/         # App constants and static data
```

## 🛠️ Tech Stack

### **Core Technologies**
- **React Native** with **Expo** (managed workflow)
- **TypeScript/JavaScript** hybrid approach
- **Redux Toolkit** with **redux-persist**
- **React Navigation** v6
- **AsyncStorage** for local persistence

### **Key Dependencies**
- `@reduxjs/toolkit` - Modern Redux development
- `redux-persist` - State persistence
- `@react-navigation/native` - Navigation
- `expo-notifications` - Push notifications
- `expo-dev-client` - Development builds
- `react-native-async-storage` - Local storage

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Expo CLI** - Development tooling

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for device testing)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/riadh24/CarApp.git
   cd CarApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For Expo Go
   npm start
   
   # For development builds
   npm run android
   npm run ios
   ```

### **Environment Setup**

Create `.env` file in the root directory:
```env
# API Configuration
API_BASE_URL=your_api_url
API_KEY=your_api_key

# Notification Configuration
EXPO_PROJECT_ID=your_expo_project_id
```

## 🔧 Development

### **Available Scripts**

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS device/simulator
npm run web           # Run in web browser

# Code Quality
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run format        # Format code with Prettier

# Testing
npm test              # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Build
npm run build         # Build for production
npm run build:preview # Preview production build
```

### **Development Workflow**

1. **Feature Development**
   - Create feature branch from `main`
   - Follow component-driven development
   - Write tests for new functionality
   - Update documentation

2. **Code Quality**
   - Run linting before commits
   - Follow TypeScript/JavaScript best practices
   - Maintain consistent code formatting
   - Document complex functions

3. **Testing Strategy**
   - Unit tests for utilities and hooks
   - Component testing for UI elements
   - Integration tests for user flows
   - Manual testing on both platforms

## 📊 Recent Updates & Improvements

### **🔥 Major Enhancements (January 2025)**

#### **Smart Search System**
- Replaced hardcoded search arrays with dynamic data extraction
- Implemented fuzzy matching with Levenshtein distance algorithm
- Added search suggestions and autocomplete infrastructure
- Performance optimized with memoization

#### **Architecture Cleanup**
- Migrated authentication from Redux to Context API
- Consolidated theme management in Context API
- Reduced Redux to vehicles-only state management
- Cleaned up 50+ unused utility functions

#### **Code Quality Improvements**
- Removed all duplicate code and functionality
- Eliminated dead code and unused imports
- Standardized component exports and imports
- Enhanced JSDoc documentation

#### **Performance Optimizations**
- Reduced bundle size by ~30% through utility cleanup
- Optimized Redux store structure
- Improved component re-render efficiency
- Enhanced memory management

### **📋 Migration Notes**

#### **Breaking Changes**
- None! All migrations were backward compatible

#### **State Management Changes**
```javascript
// Before: Mixed Redux/Context usage
// After: Clean separation
Redux: Vehicle data only
Context: Authentication, theme, onboarding
```

#### **Search Functionality**
```javascript
// Before: Hardcoded arrays
const knownMakes = ['Tesla', 'BMW', 'Audi'];

// After: Dynamic extraction
const availableMakes = useMemo(() => 
  extractUniqueValues(allVehicles, 'make'), [allVehicles]
);
```

## 🧪 Testing

### **Test Coverage**
- Store/Reducers: Unit tested
- Custom Hooks: Comprehensive testing
- Utilities: 100% coverage for active functions
- Components: Visual regression testing

### **Testing Commands**
```bash
# Run all tests
npm test

# Run specific test file
npm test Store.test.js

# Generate coverage report
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 📱 Features in Detail

### **Vehicle Management**
- Browse vehicle auctions with advanced filtering
- Smart search across makes, models, and descriptions
- Favorite vehicles with persistent storage
- Real-time auction status updates

### **Notification System**
- Auction reminder notifications
- Favorite vehicle updates
- Bid status notifications
- Customizable notification settings

### **User Experience**
- Seamless onboarding flow
- Persistent login sessions
- Dark/light theme support
- Responsive design for all devices

### **Developer Experience**
- Hot reload development
- Comprehensive error handling
- Detailed logging in development
- Clean component architecture

## 🚀 Deployment

### **Production Build**
```bash
# Create production build
expo build:android
expo build:ios

# Or using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

### **Environment Configuration**
- Development: Expo Go compatible
- Staging: Development builds with native features
- Production: Standalone apps with full functionality

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Contribution Guidelines**
- Follow existing code style and patterns
- Write tests for new functionality
- Update documentation for API changes
- Ensure all tests pass before submitting

## 📋 Roadmap

### **Short Term (Q1 2025)**
- [ ] Implement autocomplete UI for search
- [ ] Add biometric authentication
- [ ] Enhance notification categories
- [ ] Performance monitoring integration

### **Medium Term (Q2 2025)**
- [ ] Offline mode with sync capabilities
- [ ] Advanced filtering with multiple criteria
- [ ] Push notification analytics
- [ ] Multi-language support expansion

### **Long Term (Q3-Q4 2025)**
- [ ] Real-time bidding functionality
- [ ] Advanced auction analytics
- [ ] Social features and sharing
- [ ] Machine learning recommendations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the excellent development platform
- **React Navigation** for seamless navigation solutions
- **Redux Toolkit** for simplified state management
- **React Native Community** for continuous innovation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/riadh24/CarApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/riadh24/CarApp/discussions)
- **Email**: riadh.azzabi@example.com

---

**Built with ❤️ using React Native & Expo**

*Last updated: January 2025*