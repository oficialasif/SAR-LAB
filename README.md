# Teacher Research Portfolio

A web application for managing and showcasing teacher research projects, team members, and publications.

## Setup Instructions

1. Clone the repository
```bash
git clone <your-repository-url>
cd teacher-research-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Firebase Configuration
- Copy `src/config/firebase.config.example.ts` to `src/config/firebase.ts`
- Replace the placeholder values with your Firebase project credentials:
  - `apiKey`: Your Firebase API key
  - `authDomain`: Your Firebase auth domain
  - `projectId`: Your Firebase project ID
  - `storageBucket`: Your Firebase storage bucket
  - `messagingSenderId`: Your Firebase messaging sender ID
  - `appId`: Your Firebase app ID
  - `measurementId`: Your Firebase measurement ID

4. Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_APP_TITLE=Teacher Research Portfolio
# Add any other environment variables here
```

5. Start the development server
```bash
npm run dev
```

## Features

- Authentication and Authorization
- Admin Dashboard
- Team Member Management
- Project Management
- Research Paper Management
- Public Pages for Viewing Content

## Security

- Firebase Authentication
- Role-based Access Control
- Secure Firestore Rules
- Protected Admin Routes

## Built With

- React
- TypeScript
- Vite
- Firebase (Auth, Firestore, Storage)
- Material-UI
- Framer Motion
- TailwindCSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed by OficialAsif.
