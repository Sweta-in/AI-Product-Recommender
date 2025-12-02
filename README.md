**AI Product Recommendation System**

A full-stack web application that recommends products based on user preferences using FastAPI, React, and Groq LLaMA 3.1 models.

🚀 Features
Frontend (React + Vite)

Clean UI

Sends natural-language preferences

Displays recommended products with highlighting

Lists all products

Backend (FastAPI + Groq API)

Generates product recommendations using LLaMA model

Parses model output into valid JSON

Fully CORS-enabled

Works locally with free Groq API key

🧠 Tech Stack
Layer	Technology
Frontend	React, Vite, Tailwind (optional)
Backend	FastAPI
AI Model	Groq LLaMA-3.1 8B Instant
Tools	Uvicorn, Axios
⚙️ Installation & Setup
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/AI-Product-Recommender.git
cd AI-Product-Recommender

🟦 Backend Setup (FastAPI + Groq)
1. Create virtual environment
cd Backend
python -m venv .venv
.venv\Scripts\activate   # Windows

2. Install dependencies
pip install -r requirements.txt

3. Create .env
GROQ_API_KEY=your_groq_api_key_here

4. Run FastAPI server
uvicorn main:app --reload --port 8000


Backend runs at:

http://127.0.0.1:8000
http://127.0.0.1:8000/docs  (Swagger UI)

🟩 Frontend Setup (React)
1. Start frontend
cd Frontend
npm install
npm run dev


Frontend will run at:

http://localhost:5173


Make sure backend is running at port 8000.

🧪 Example Prompt
I want a phone under $500


Response example:

{
  "ids": [1, 3],
  "recommendedProducts": [
    { "id": 1, "name": "Budget Phone X1", "price": 299 },
    { "id": 3, "name": "Midrange Phone M5", "price": 499 }
  ]
}

📁 Project Structure
Backend/
  main.py              → FastAPI server
  products.py          → Product data
  prompt_templates.py  → Model prompt generator
  requirements.txt
  .env.example

Frontend/
  src/
    App.jsx            → UI logic
    api.js             → Axios API calls

📌 Notes

No OpenAI keys are required; Groq is free and fast.

.env is not included in GitHub for security reasons.

Both frontend and backend run independently.
