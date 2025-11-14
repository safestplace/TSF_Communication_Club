# TSF Communication Club - Frontend

A modern, professional, and responsive frontend for the TSF Communication Club web app built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Multi-Role Dashboard System**: Member, Club Admin, and Super Admin dashboards
- **Authentication System**: Local auth simulation with demo credentials
- **Chapter Management**: Create, join, and manage TSF chapters across Kerala
- **Meeting Management**: Schedule, join, and track communication practice sessions
- **Points & Certificates**: Gamified learning with achievement tracking
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Interactive UI**: Modern components with micro-interactions and animations

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **State Management**: React Context API + Local Storage
- **Icons**: Lucide React
- **Components**: Radix UI primitives via shadcn/ui

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tsf-communication-club
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Demo Credentials

The application uses local authentication with the following demo accounts:

### Member Account
- **Email**: `member@tsfcommsclub.com`
- **Password**: `test123`
- **Access**: Member dashboard with personal progress tracking

### Admin Account
- **Email**: `admin@tstcommsclub.com`
- **Password**: `test123`
- **Access**: Admin dashboard for NIT Calicut chapter management

### Super Admin Account
- **Email**: `super@tstcommsclub.com`
- **Password**: `test123`
- **Access**: Global admin dashboard with system-wide controls

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Role-based dashboards
│   ├── chapters/         # Chapter detail pages
│   ├── meetings/         # Meeting detail pages
│   └── page.tsx          # Public landing page
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── contexts/             # React contexts
├── lib/                  # Utilities and data access
└── data/                 # Dummy data files
    ├── colleges.json     # Kerala engineering colleges
    ├── users.json        # User accounts
    ├── chapters.json     # TSF chapters
    ├── meetings.json     # Meeting data
    ├── memberships.json  # Membership requests
    ├── points.json       # Points ledger
    └── certificates.json # Certificate data
```

## 📊 Data Structure

The application uses local JSON files for data persistence:

### Colleges
- 40+ major engineering colleges across Kerala
- Includes district, city, website, and type information

### Users
- Three role types: member, admin, super_admin
- Profile information with college associations

### Chapters
- Active and pending chapter statuses
- Meeting schedules and social links

### Meetings
- Role assignments (anchor, speaker, judge, etc.)
- Google Meet integration placeholders
- Feedback and rating system

## 🎯 Key Features

### Public Landing Page
- Hero section with mission statement
- How it works section
- Sample chapters carousel
- Testimonials and features

### Authentication Flow
- Login with demo credentials
- Signup with two paths: Start Club or Join Club
- College search and chapter selection
- Membership request system

### Member Dashboard
- Personal progress tracking
- Points and certificates
- Upcoming meetings with role assignments
- Chapter memberships

### Admin Dashboard
- Member management and approvals
- Meeting scheduling
- Attendance tracking
- Points and certificate management

### Super Admin Dashboard
- Global overview and statistics
- Pending chapter approvals
- District-wise analytics
- Policy management and reports

## 🎨 Design System

- **Color Palette**: Professional blue and slate tones
- **Typography**: Clean, readable font hierarchy
- **Components**: Consistent shadcn/ui component library
- **Responsive**: Mobile-first with desktop enhancements
- **Accessibility**: ARIA labels and keyboard navigation

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Responsive Design

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🧪 Testing

The application includes basic setup for testing. Tests can be added using:
- Jest for unit tests
- Playwright for E2E tests

## 🚀 Deployment

The application is optimized for Vercel deployment:
- Automatic builds on git push
- Edge caching for static assets
- Server-side rendering support

## 🔄 Future Enhancements

- Real database integration (PostgreSQL/Supabase)
- Real-time notifications with WebSockets
- Advanced analytics dashboard
- Mobile app development
- Video conferencing integration
- Advanced role-based permissions

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: info@tsfcommsclub.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

Built with ❤️ for engineering students across Kerala