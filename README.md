# SalesforceLearnHub - AI-Powered Salesforce Learning Platform

A modern, AI-powered learning platform for Salesforce professionals built with Next.js, Tailwind CSS, and Supabase.

## 🚀 Features

- **AI-Powered Learning Experience**: Intelligent content processing, conversational learning assistant, and instant knowledge extraction
- **Personalized Learning Paths**: Role-based recommendations with adaptive difficulty levels
- **Smart Search & Summarization**: Natural language queries with intelligent content summaries
- **Real-time Content Updates**: Latest Salesforce features and best practices
- **Progress Tracking**: User progress monitoring across learning modules
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd salesforce-learn-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Run the SQL commands from `supabase_schema.sql` in your Supabase SQL Editor to create the required tables.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

The application uses the following main tables:

- `learning_paths` - Stores learning path information
- `learning_modules` - Individual modules within learning paths
- `users` - User account information
- `user_progress` - Tracks user progress through modules
- `search_queries` - Stores popular search queries

## 🔌 API Endpoints

- `GET /api/learning-paths` - Fetch all learning paths
- `POST /api/learning-paths` - Create a new learning path
- `GET /api/modules` - Fetch learning modules
- `POST /api/modules` - Create a new module
- `GET /api/search` - Get popular search queries
- `POST /api/search` - Perform search
- `GET /api/user-progress` - Get user progress
- `POST /api/user-progress` - Update user progress

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js applications.

## 🔄 Migration from Google Sheets

This application replaces a Google Sheets backend with Supabase. The migration involves:

1. **Data Export**: Export data from Google Sheets to CSV/JSON
2. **Schema Mapping**: Map Google Sheets columns to Supabase tables
3. **Data Import**: Import data into Supabase tables
4. **API Integration**: Replace Google Sheets API calls with Supabase queries

## 🎨 Customization

### Adding New Learning Paths

1. Use the `/api/learning-paths` POST endpoint
2. Or directly insert into the `learning_paths` table in Supabase

### Modifying UI Components

- Components are located in `src/components/`
- Styling uses Tailwind CSS classes
- Icons from Lucide React

### Adding New API Endpoints

Create new route files in `src/app/api/` following the Next.js App Router convention.

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation

## 🔮 Future Enhancements

- [ ] Advanced AI chat integration
- [ ] Video content support
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with Salesforce Trailhead
- [ ] Multi-language support
- [ ] Offline learning capabilities

---

Built with ❤️ for the Salesforce community

