export type CodeLanguage = "html" | "react" | "vue" | "nextjs";

export interface GeneratedProject {
  id: string;
  title: string;
  description: string;
  language: CodeLanguage;
  code: string;
  timestamp: Date;
}

export const generateCode = (prompt: string, language: CodeLanguage): string => {
  const cleanPrompt = prompt.toLowerCase();

  // HTML templates
  if (language === "html") {
    if (cleanPrompt.includes("landing") || cleanPrompt.includes("hero")) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        
        .hero {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-align: center;
            padding: 20px;
        }
        
        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: slideDown 0.8s ease-out;
        }
        
        .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: fadeIn 1s ease-out 0.3s both;
        }
        
        .cta-button {
            display: inline-block;
            padding: 15px 40px;
            background: white;
            color: #667eea;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            border: none;
            transition: transform 0.3s, box-shadow 0.3s;
            animation: slideUp 0.8s ease-out 0.5s both;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>Welcome to Your Website</h1>
            <p>Create beautiful web experiences with AI</p>
            <button class="cta-button">Get Started</button>
        </div>
    </section>
</body>
</html>`;
    }

    if (cleanPrompt.includes("portfolio") || cleanPrompt.includes("about")) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
        
        header {
            background: #2c3e50;
            color: white;
            padding: 2rem 5%;
            text-align: center;
        }
        
        header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
        header p { font-size: 1.1rem; opacity: 0.9; }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 5%;
        }
        
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .project-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .project-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .project-image {
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .project-content {
            padding: 1.5rem;
        }
        
        .project-content h3 {
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }
        
        .project-content p {
            color: #666;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <header>
        <h1>My Portfolio</h1>
        <p>Creating beautiful digital experiences</p>
    </header>
    
    <div class="container">
        <div class="projects">
            <div class="project-card">
                <div class="project-image">🎨</div>
                <div class="project-content">
                    <h3>Project One</h3>
                    <p>A beautiful design project showcasing modern web design principles.</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-image">💻</div>
                <div class="project-content">
                    <h3>Project Two</h3>
                    <p>Full-stack application with cutting-edge technologies.</p>
                </div>
            </div>
            <div class="project-card">
                <div class="project-image">🚀</div>
                <div class="project-content">
                    <h3>Project Three</h3>
                    <p>Innovative solution solving real-world problems.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    if (cleanPrompt.includes("dashboard") || cleanPrompt.includes("admin")) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f0f; color: white; }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        
        .sidebar {
            background: #1a1a1a;
            border-right: 1px solid #333;
            padding: 2rem 1.5rem;
        }
        
        .sidebar h2 { font-size: 1.5rem; margin-bottom: 2rem; }
        .sidebar ul { list-style: none; }
        .sidebar li { padding: 1rem 0; border-bottom: 1px solid #333; }
        .sidebar a { color: #aaa; text-decoration: none; transition: color 0.3s; }
        .sidebar a:hover { color: #667eea; }
        
        .main-content {
            padding: 2rem;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: #1a1a1a;
            padding: 1.5rem;
            border-radius: 8px;
            border: 1px solid #333;
        }
        
        .stat-card h3 { color: #aaa; font-size: 0.9rem; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 2rem; font-weight: 600; color: #667eea; }
        
        .chart {
            background: #1a1a1a;
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid #333;
        }
        
        .chart h3 { margin-bottom: 1.5rem; }
        .bar { height: 30px; background: linear-gradient(90deg, #667eea, #764ba2); margin: 1rem 0; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li><a href="#">Overview</a></li>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Reports</a></li>
                <li><a href="#">Settings</a></li>
                <li><a href="#">Logout</a></li>
            </ul>
        </div>
        <div class="main-content">
            <h1 style="margin-bottom: 2rem;">Welcome to Dashboard</h1>
            <div class="stats">
                <div class="stat-card">
                    <h3>Total Users</h3>
                    <div class="value">1,234</div>
                </div>
                <div class="stat-card">
                    <h3>Revenue</h3>
                    <div class="value">$45,231</div>
                </div>
                <div class="stat-card">
                    <h3>Active Sessions</h3>
                    <div class="value">589</div>
                </div>
                <div class="stat-card">
                    <h3>Growth</h3>
                    <div class="value">+23%</div>
                </div>
            </div>
            <div class="chart">
                <h3>Performance Metrics</h3>
                <div class="bar"></div>
                <div class="bar" style="width: 70%;"></div>
                <div class="bar" style="width: 85%;"></div>
                <div class="bar" style="width: 60%;"></div>
            </div>
        </div>
    </div>
</body>
</html>`;
    }

    // Default HTML
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 20px;
        }
        .container {
            text-align: center;
            max-width: 600px;
        }
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            animation: fadeIn 0.8s ease-out;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.95;
            line-height: 1.8;
            animation: fadeIn 0.8s ease-out 0.2s both;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Website Generated! ✨</h1>
        <p>Your AI-powered website has been created successfully. This is a live preview of your generated website.</p>
    </div>
</body>
</html>`;
  }

  // React template
  if (language === "react") {
    return `import React from 'react';

export default function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          React Component Generated
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95 }}>
          ${prompt}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`;
  }

  // Vue template
  if (language === "vue") {
    return `<template>
  <div class="app">
    <div class="container">
      <h1>Vue Component Generated</h1>
      <p>{{ description }}</p>
      <button @click="count++">Count: {{ count }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const count = ref(0)
const description = "${prompt}"
</script>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
}

.container {
  text-align: center;
  max-width: 500px;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: slideDown 0.8s ease-out;
}

p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

button {
  padding: 12px 30px;
  font-size: 1rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>`;
  }

  // Next.js template
  if (language === "nextjs") {
    return `'use client';

import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Next.js App Generated
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95 }}>
          ${prompt}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Count: {count}
        </button>
      </div>
    </main>
  );
}`;
  }

  return `<!-- Default generated website -->`;
};
