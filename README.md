# OTP Verification System - Frontend

A modern React-based frontend for the OTP verification system that supports both WhatsApp and Email OTP delivery methods.

## Features

- **Dual Channel Support**: WhatsApp and Email OTP delivery
- **Real-time Timer**: 90-second countdown timer for OTP expiration
- **Smart OTP Input**: Auto-focus and auto-submit functionality
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean, professional design with animations
- **Toast Notifications**: Real-time feedback for user actions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will run on `http://localhost:5000`

## Usage

### 1. Organization Setup
- Enter your Organization ID in the input field
- Default Organization ID: `507f1f77bcf86cd799439011`

### 2. Request OTP
- Choose between WhatsApp or Email tab
- Enter phone number (10-15 digits) for WhatsApp
- Enter email address for Email OTP
- Click "Send OTP" button

### 3. Verify OTP
- Enter the 6-digit OTP code
- Auto-focus and auto-submit functionality
- Paste support for OTP codes
- Real-time validation

### 4. Features
- **Timer**: 90-second countdown for OTP expiration
- **Attempt Tracking**: Shows remaining attempts
- **Error Handling**: Displays specific error messages
- **Resend**: Option to resend OTP if needed

## API Integration

The frontend communicates with the backend API endpoints:

- `POST /api/v1/otp/request_otp/whatsapp` - Request WhatsApp OTP
- `POST /api/v1/otp/request_otp/email` - Request Email OTP
- `POST /api/v1/otp/verify` - Verify OTP
- `GET /api/v1/otp/:id/status` - Get OTP status
- `GET /api/v1/otp/channel/status` - Get channel lock status

## Error Handling

The system handles various error scenarios:

- **Network Errors**: Connection issues with backend
- **Validation Errors**: Invalid input formats
- **Rate Limiting**: Channel lock status
- **OTP Expiration**: Timer-based expiration
- **Invalid OTP**: Wrong verification attempts

## Components Structure

```
src/
├── components/
│   ├── Header.js              # Application header
│   ├── OtpSystem.js           # Main OTP system component
│   ├── OtpRequestForm.js      # OTP request form
│   └── OtpVerificationForm.js # OTP verification form
├── services/
│   └── api.js                 # API service functions
└── App.js                     # Main application component
```

## Styling

- Modern CSS with gradient backgrounds
- Responsive design for mobile devices
- Smooth animations and transitions
- Professional color scheme
- Accessibility-friendly design

## Development

### Available Scripts

- `npm start` - Start development server on port 5000
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Dependencies

- `react` - React library
- `react-dom` - React DOM
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications
- `lucide-react` - Icons

## Backend Requirements

Ensure your backend server is running and configured with:

1. **CORS**: Enable CORS for `http://localhost:5000`
2. **Organization**: Valid organization with WhatsApp authentication
3. **Email Service**: Configured email service for email OTP
4. **WhatsApp Service**: Authenticated WhatsApp client

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend has CORS enabled for frontend domain
2. **API Connection**: Verify backend is running on port 3000
3. **WhatsApp Errors**: Check if WhatsApp is authenticated for the organization
4. **Email Errors**: Verify email service configuration

### Debug Mode

Enable debug logging by adding to browser console:
```javascript
localStorage.setItem('debug', 'true');
```

## Security Features

- Input validation on frontend and backend
- Rate limiting through channel locks
- Secure OTP generation and verification
- Session management
- Error message sanitization

## Performance

- Lazy loading of components
- Optimized re-renders
- Efficient state management
- Minimal bundle size
- Fast loading times

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
