# TeamsKit
A modern React + TailwindCSS frontend for the TeamsKit task & team-management system.

## Overview

TeamsKit Frontend is a fast, responsive, and scalable web application built with React, Vite, TailwindCSS, and Axios.
It communicates with a Django REST API backend and provides a clean user interface for:

- User authentication (JWT login)
- Task management (CRUD)
- Team collaboration
- Dashboard insights
- Mobile-friendly UI

The project is optimized for production, supports environment-based configuration, and is fully deployable via Nginx.


|Component| 	Technology|
|---|---|
|UI Framework|	React (Vite)|
|Styling|	TailwindCSS + custom components|
|State / API|	Axios, LocalStorage JWT|
|Routing|	React Router|
|Animations|	Framer Motion (optional)|
|Build Tool|	Vite|
|Deployment|	Nginx (static hosting)|

## Project Structure

teamskit-frontend/  
│── public/             
│── src/  
│   ├── api/             
│   ├── components/       
│   ├── pages/                       
│   ├── context/          
│   ├── assets/          
│   ├── App.jsx          
│   └── main.jsx        
│

│── package.json  
│── dist/                 
│── vite.config.js  
└── README.md

## Installation & Setup
1. Clone the repository
```bash
git clone https://github.com/alekiie/teamskit-frontend.git
cd teamskit-frontend
```
2. Install dependencies
```bash
npm install
```

3. Configure API URL.  
The frontend uses Axios with a relative base URL:  

```js
const api = axios.create({ baseURL: '/api' })
```

This lets Nginx route `/api/*` access ;Django backend automatically.
If running locally without Nginx, create a .env:

```
VITE_API_URL=http://127.0.0.1:8001/api
```

And update api.js:
```js
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })
```
## Running the Development Server
```bash
npm run dev
```

Open:
` http://localhost:5173`

## Building for Production
```
npm run build
```

This outputs optimized static files inside: `dist/`

### Deployment (Nginx Example)

Add this to your Nginx server block:
```
root /var/www/teamskit-frontend/dist;
index index.html;

location / {
    try_files $uri /index.html;
}

location /api/ {
    proxy_pass http://127.0.0.1:8001/api/;
}
```

Reload:
```bash
sudo nginx -t
sudo systemctl restart nginx
```
## Authentication Flow

- User submits username and password.
- React calls `/api/auth/login/`
- Django returns JWT access + refresh tokens
- Tokens are stored in localStorage
- Axios injects the Authorization: `Bearer <token>` header via interceptor
If a 401 occurs, the frontend auto-triggers logout.