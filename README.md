 Riadh Car Auction App

A modern React Native car auction application built with Expo, featuring real-time notifications, Redux state management, and a clean, responsive UI.

 Features

- **🎯 Car Browsing**: Browse cars with search, filter, and pagination
- **❤️ Favorites**: Mark cars as favorites with notification scheduling
- **🔔 Notifications**: Smart notification system for auction endings
- **🌐 API Integration**: RESTful API with json-server backend
- **🎨 Modern UI**: Clean design with dark/light theme support
- **📱 Responsive**: Optimized for mobile and tablet devices

 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Start with API server (optional)
npm run dev
```

 Testing

```bash
# Run tests
npm test
```

Architecture

- **Frontend**: React Native + Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation v7
- **Notifications**: Expo Notifications
- **API**: json-server (development)
- **Testing**: Jest

 Project Structure

```
app/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── hooks/             # Custom React hooks
├── services/          # API services
├── constants/         # App constants
└── Store.jsx          # Redux store configuration
```

 Key Technologies

- React Native 0.79
- Expo SDK 52
- Redux Toolkit
- React Navigation v7
- Expo Notifications
- Axios for API calls
