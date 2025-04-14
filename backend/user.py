from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Path
from pydantic import BaseModel
import mysql.connector
import shutil
import os

router = APIRouter()

# Connexion à la BDD
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="AA0556563a",
        database="benjedoudb"
    )

# Création de la table si elle n'existe pas
def create_users_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nom VARCHAR(255),
            prenom VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            profile VARCHAR(255)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_users_table()

# ✅ Route d'inscription avec enregistrement de l'image
@router.post("/register")
def register_user(
    nom: str = Form(...),
    prenom: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    profile: UploadFile = File(...)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Email already registered")

    os.makedirs("images", exist_ok=True)
    filename = f"{email.replace('@', '_')}_{profile.filename}"
    profile_path = f"images/{filename}"

    with open(profile_path, "wb") as buffer:
        shutil.copyfileobj(profile.file, buffer)

    cursor.execute(
        "INSERT INTO users (nom, prenom, email, password, profile) VALUES (%s, %s, %s, %s, %s)",
        (nom, prenom, email, password, profile_path)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "User registered successfully", "profile": profile_path}

# ✅ Données pour la connexion
class LoginData(BaseModel):
    email: str
    password: str

# ✅ Route de connexion
@router.post("/login")
def login_user(data: LoginData):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (data.email, data.password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user": user}

# ✅ Route pour récupérer le profil d'un user
@router.get("/userprofile/{email}")
def get_user_profile(email: str = Path(...)):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT nom, prenom, email, profile FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "nom": user["nom"],
        "prenom": user["prenom"],
        "email": user["email"],
        "profile": user["profile"]  # chemin statique de l'image
    }
