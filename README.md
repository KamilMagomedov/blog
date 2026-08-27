# Kamil's Blog

A full-stack personal blog built with Next.js, TypeScript, PostgreSQL and Vercel.

The project combines two of my main interests: software development and travel. I use the blog to publish articles about tech meetups, programming, travel experiences and life in London.

The application was developed as both a personal blog and a portfolio project, with a focus on responsive design, clean architecture, type safety and real-world functionality.

## Live Demo

🔗 [View the live website](https://blog-ten-rho-43.vercel.app)

## Engineering Highlights

- Migrated backend functionality into **Next.js Route Handlers**, keeping frontend and server-side logic within the same Next.js application.
- Designed and worked with **PostgreSQL relational data** for posts, categories, tags, comments and nested replies.
- Improved **TypeScript data contracts** between PostgreSQL/API responses and frontend models, resolving data-shape and type inconsistencies across application layers.
- Implemented **search, category and tag filtering, pagination, and archive navigation** for dynamic blog content.
- Built post interaction functionality including **comments, nested parent-child replies, likes, views and comment counts**.
- Integrated **Vercel Blob** for image storage and deployed the application to production with Vercel.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend

- Next.js Route Handlers
- Neon PostgreSQL
- SQL
- Nodemailer

### Storage & Deployment

- Vercel
- Vercel Blob
- Neon Database

## Screenshots

### Home

![Home page](docs/screenshots/home-desktop.png)

### Article

![Article page](docs/screenshots/post-desktop.png)

### About

![About page](docs/screenshots/about-desktop.png)

### Mobile

![Mobile layout](docs/screenshots/home-mobile.png)

## Features

### Blog

- Development and Travel articles
- Individual post pages
- Search by keyword
- Category filtering
- Tag filtering
- Archive filtering by year and month
- Pagination
- Popular articles
- Responsive layout for desktop, tablet and mobile

### Post Interaction

- Post likes
- View counter
- Comments
- Nested comment replies
- Optional avatar upload for comments
- Comment count for each article

### Additional Features

- Newsletter subscriptions
- Contact form with email delivery
- Dynamic SEO metadata for posts and pages
- About and Contact pages
- User visit tracking
- Loading skeletons
- Responsive navigation and mobile burger menu

## Architecture

The project uses the Next.js App Router architecture.

The frontend and backend are part of the same Next.js application.

```text
Browser
   │
   ▼
Next.js / React
   │
   ├── Server Components
   ├── Client Components
   │
   ▼
Next.js Route Handlers
   │
   ├── Comments
   ├── Likes
   ├── Views
   ├── Newsletter
   ├── Contact Form
   └── User Visits
   │
   ▼
Neon PostgreSQL
```

Images uploaded through the application are stored in Vercel Blob.

## Database

The application uses PostgreSQL hosted on Neon.

The main entities include:

- Posts
- Categories
- Tags
- Post–tag relationships
- Comments and replies
- Newsletter subscriptions

Posts can belong to categories and contain multiple tags.

Comments support parent-child relationships, allowing users to reply to existing comments.

## Project Structure

```text
src/
├── app/
│   ├── about/
│   ├── api/
│   ├── contact/
│   ├── development/
│   ├── post/
│   └── travel/
│
├── components/
├── contexts/
├── data/
├── lib/
├── styles/
├── tests/
└── types/
```

### `app`

Contains pages and API Route Handlers using the Next.js App Router.

### `components`

Reusable React components used across the application.

### `lib`

Database queries, API logic, helpers and shared application utilities.

### `types`

TypeScript interfaces for application and database data.

## Environment Variables

Create a `.env.local` file in the project root.

```env
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
EMAIL_USER=
EMAIL_PASS=
```

### Variables

`DATABASE_URL`

Connection string for the Neon PostgreSQL database.

`BLOB_READ_WRITE_TOKEN`

Token used to upload images to Vercel Blob.

`EMAIL_USER`

Email account used by the contact form and comment notification system.

`EMAIL_PASS`

Email application password used by Nodemailer.

> Never commit real environment variable values to Git.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/KamilMagomedov/blog.git
```

Open the project directory:

```bash
cd blog
```

Install dependencies:

```bash
npm install
```

Create your `.env.local` file and add the required environment variables.

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Type Checking

Run TypeScript validation:

```bash
npx tsc --noEmit
```

## Production Build

Create a production build:

```bash
npm run build
```

## Future Improvements

Possible future improvements include:

- Admin dashboard for creating and editing posts
- Authentication
- Rich text editor for article creation
- Comment moderation dashboard
- Automated tests for more application features
- Improved analytics
- Draft and scheduled article publishing

## Author

**Kamil Mahomedov**

Frontend Developer based in London.

- GitHub: [KamilMagomedov](https://github.com/KamilMagomedov)
- LinkedIn: [Kamil Mahomedov](https://www.linkedin.com/in/kamil-mahomedov/)
