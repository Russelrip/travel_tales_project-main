# Travel Tales Project

A full-stack web application for sharing and exploring travel stories. The project features a modern React frontend and a robust Node.js backend, using Prisma ORM for database management.

## Features

- **User Stories**: Post and view travel experiences from users around the world  
- **Authentication**: Secure login and registration system  
- **Image Uploads**: Share photos along with travel tales  
- **Prisma ORM**: Structured database models and queries using Prisma  
- **Responsive Frontend**: Clean and dynamic interface built with React  
- **Developer Utilities**: Prisma Studio for easy database inspection  

## Technology Stack

- **Frontend**: React.js (Vite)
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (via Prisma ORM)
- **ORM**: Prisma
- **Dev Tools**: Prisma Studio (optional)

## Installation

### Clone the repository:

```bash
git clone https://github.com/Russelrip/travel_tales_project-main.git
cd travel_tales_project-main
```

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

### Optional: Launch Prisma Studio

To view and manage your database in a browser interface:
```bash
npx prisma studio
```

## Project Structure

```
travel_tales_project-main/
├── client/      # React frontend
├── server/      # Node.js backend with Express and Prisma
├── prisma/      # Prisma schema and migrations
```

## License

This project is licensed under the MIT License.
