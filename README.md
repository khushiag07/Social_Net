# Social Network PathFinder

An interactive web application that finds the shortest connection between two people in a social network using **Standard BFS** and **Bidirectional BFS**.

## Features
- Interactive social network graph visualization.
- Finds the shortest connection path between two people.
- Identifies mutual connections.
- Compares BFS and Bidirectional BFS performance.
- Displays network metrics and connection paths.

## Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Backend:** Python, FastAPI
- **Algorithms:** BFS, Bidirectional BFS
- **Visualization:** Interactive SVG graph

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Purpose
This project demonstrates how graph theory and search algorithms can solve real-world social network connection problems.
