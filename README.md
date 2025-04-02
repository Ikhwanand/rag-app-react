# RAG-Django Project

A full-stack Retrieval-Augmented Generation (RAG) application built with FastAPI and React. This project combines the power of modern web technologies with advanced AI capabilities for enhanced document processing and information retrieval.

## Tech Stack

### Backend
- Python 3.12+
- Google Generative AI
- pgvector (Vector database extension for PostgreSQL)
- FastAPI
- SQLAlchemy

### Frontend
- React
- TypeScript
- Vite

## Project Structure

```
project/
├── backend/           # Django backend
│   ├── api.py         # API endpoints
│   ├── data/          # Data storage
│   └── tmp/           # Temporary files
├── frontend/          # React frontend
│   ├── src/           # Source code
│   ├── public/        # Static files
│   └── ...           # Configuration files
└── pyproject.toml    # Python dependencies
```

## Setup Instructions

### Backend Setup

1. Ensure Python 3.12+ is installed
2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -e .
   ```
4. Copy `.env_example` to `.env` in the backend directory and configure your environment variables
5. Set up your PostgreSQL database with pgvector extension

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Features

- Document processing and analysis
- Vector-based document retrieval
- Integration with Google's Generative AI
- RESTful API endpoints
- Modern React-based user interface
- TypeScript for enhanced type safety

## Development

- Backend development server: Runs on `http://localhost:8000`
- Frontend development server: Runs on `http://localhost:5173`
- API documentation is available at `/api/docs` when the backend server is running

## Dependencies

Key backend dependencies include:

- fastapi
- google-genai
- pgvector
- python-dotenv
- uvicorn

Frontend dependencies are managed through `package.json`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.