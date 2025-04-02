from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from agno.agent import Agent
from agno.models.google import Gemini
from agno.knowledge.pdf import PDFKnowledgeBase
from agno.embedder.google import GeminiEmbedder
from agno.storage.agent.sqlite import SqliteAgentStorage
from agno.vectordb.lancedb import LanceDb


import os 
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


# Define the database URL where the vector database will be stored
db_url = "./tmp/lancedb"


# Create Ollama embedder
embedder = GeminiEmbedder(dimensions=1536)

# Create the vector database
vector_db = LanceDb(
    table_name="recipes",  # Table name in the vector database
    uri=db_url,  # Location to initiate/create the vector database
    embedder=embedder,  # Without using this, it will use OpenAIChat embeddings by default
)

# Create a knowledge base from a PDF URL using LanceDb for vector storage and OllamaEmbedder for embedding
knowledge_base = PDFKnowledgeBase(
    path="./data/Cant_Hurt_mee.pdf",
    vector_db=vector_db,
)

# Load the knowledge base without recreating it if it already exists in Vector LanceDB
knowledge_base.load(recreate=False)

# Set up SQL storage for the agent's data
storage = SqliteAgentStorage(table_name="canhurtme", db_file="data.db")
storage.create()  # Create the storage if it doesn't exist

# Initialize the Agent with various configurations including the knowledge base and storage
agent = Agent(
    session_id="session_id",  # use any unique identifier to identify the run
    user_id="user",  # user identifier to identify the user
    model=Gemini(api_key=os.getenv("GOOGLE_API_KEY")),
    knowledge=knowledge_base,
    storage=storage,
    show_tool_calls=True,
    debug_mode=True,  # Enable debug mode for additional information
)



@app.post("/chat")
async def chat(query: str = Body(..., embed=True)):
    response = agent.run(query)
    return {"response": response.content, "sources": []}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=8000)