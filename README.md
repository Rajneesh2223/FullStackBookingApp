# 🏠 StayScape - Your Home Away From Home
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> *"Where every stay tells a story"*

## 🌟 Welcome to StayScape!

Ever dreamed of finding the perfect getaway spot with just a few clicks? StayScape turns that dream into reality! Our platform connects wanderlust souls with unique living spaces, making booking your next adventure as easy as saying "home sweet home."

## ✨ Features That Make Us Special

### For Travelers 🎒
- **Smart Search** - Find your perfect match with our intuitive search system
- **Secure Booking** - Your peace of mind is our priority with encrypted transactions
- **Detailed Listings** - High-quality photos and comprehensive property information
- **Instant Confirmation** - Real-time booking updates and confirmation
- **User Profiles** - Keep track of your adventures and favorite spots

### For Hosts 🏡
- **Easy Listing Management** - Add, edit, and manage your properties effortlessly
- **Photo Upload** - Multiple ways to upload, including direct upload and URL
- **Booking Control** - Set your own rules, prices, and availability
- **Guest Management** - Keep track of your guests and communications
- **Secure Payments** - Reliable and secure payment processing

## 🚀 Tech Stack

Our application is built with modern technologies to ensure reliability, scalability, and maintainability:

```
Frontend: React + Vite
Backend: Express.js
Database: MongoDB
Authentication: JWT + Cookies
File Handling: Multer
Image Processing: image-downloader
Security: bcrypt
```

## 🛠 Installation

1. **Clone the repository**
```bash
git clone [your-repo-link]
cd stayscape
```

2. **Set up environment variables**
Create a `.env` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

3. **Install dependencies**
```bash
npm install
```

4. **Start the development server**
```bash
npm run dev
```

## 🌈 API Endpoints

### Authentication
- `POST /register` - Create a new user account
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile

### Properties
- `GET /places` - Get all available properties
- `POST /places` - Create a new property listing
- `GET /places/:id` - Get specific property details
- `PUT /places` - Update property information
- `GET /user-places` - Get user's property listings

### Bookings
- `POST /bookings` - Create a new booking
- `GET /bookings` - Get user's bookings

### Images
- `POST /upload` - Upload images directly
- `POST /upload-by-link` - Upload images via URL

## 🤝 Contributing

We love contributions! If you have suggestions or want to contribute code, please feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🌟 Coming Soon

- 📱 Mobile application
- 🗺 Interactive maps integration
- 💬 Real-time chat between hosts and guests
- ⭐ Enhanced review system
- 📊 Advanced analytics for hosts

## 📫 Support

Having issues? We're here to help!
- 📧 Email: support@stayscape.com
- 💬 Discord: [Join our community](#)
- 📚 Documentation: [View full docs](#)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

<p align="center">Made with ❤️ by the StayScape Team</p>
