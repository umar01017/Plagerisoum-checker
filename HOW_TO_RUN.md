# How to Run OriginalityAI

This guide provides instructions on how to start the backend and frontend components of the OriginalityAI project locally.

## Prerequisites
- **Python 3.8+** for the backend
- **Node.js 18+** for the frontend
- **MongoDB** running locally or a MongoDB connection string in `.env`

---

## 1. Running the Backend

The backend is a Python FastAPI application.

1. **Open a terminal** and navigate to the `backend` directory:
   ```bash
   cd originality-ai/backend
   ```

2. **Activate the virtual environment**:
   - On Windows:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - On Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
   *(If the virtual environment doesn't exist, you can create one with `python -m venv venv` and install requirements with `pip install -r requirements.txt`)*

3. **Check Environment Variables**:
   Ensure you have a `.env` file in the `backend` folder with your required variables (e.g., MongoDB URI, Groq API keys).

4. **Start the FastAPI server**:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run at `http://localhost:8000`. You can access the automatic API documentation at `http://localhost:8000/docs`.

---

## 2. Running the Frontend

The frontend is a React/Next.js application. 

1. **Open a new terminal** and navigate to the `frontend` directory:
   ```bash
   cd originality-ai/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   *(If your `package.json` is located in a different directory or the root, ensure you run `npm install` where the `package.json` file resides).*

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:3000`.

---

## Troubleshooting

- **CORS Issues:** Make sure your frontend is running on `http://localhost:3000`, as the backend explicitly allows this origin in `main.py`.
- **Database Connection Error:** Verify that MongoDB is running and that your connection string in `backend/.env` is correct.
- **Port Conflicts:** If `localhost:8000` or `localhost:3000` is already in use, stop other services or specify different ports when starting the servers.
