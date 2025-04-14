from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from user import router as user_router
from category import router as category_router
from produit import router as product_router

app = FastAPI()

# Autoriser l'origine Angular
origins = [
    "http://localhost:4200",
]

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Monter le dossier des images
app.mount("/images", StaticFiles(directory="images"), name="images")

# Inclure les routeurs
app.include_router(user_router)
app.include_router(category_router)
app.include_router(product_router)

# Route test
@app.get("/hello")
def root():
    return {"message": "Hello, world!"}
