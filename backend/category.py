from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import mysql.connector

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
def create_category_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            description TEXT
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_category_table()

# ✅ Modèle de données avec id optionnel
class Category(BaseModel):
    id: int | None = None
    name: str
    description: str

# ✅ Ajouter une catégorie
@router.post("/add_category")
def add_category(category: Category):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO categories (name, description) VALUES (%s, %s)",
        (category.name, category.description)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Category added successfully"}

# ✅ Lister toutes les catégories
@router.get("/categories", response_model=list[Category])
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()
    cursor.close()
    conn.close()
    return categories

# ✅ Obtenir une catégorie par ID
@router.get("/category/{category_id}", response_model=Category)
def get_category(category_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories WHERE id = %s", (category_id,))
    category = cursor.fetchone()
    cursor.close()
    conn.close()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# ✅ Mettre à jour une catégorie
@router.put("/update_category/{category_id}")
def update_category(category_id: int, category: Category):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE categories SET name = %s, description = %s WHERE id = %s",
        (category.name, category.description, category_id)
    )
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    cursor.close()
    conn.close()
    return {"message": "Category updated successfully"}

# ✅ Supprimer une catégorie
@router.delete("/delete_category/{category_id}")
def delete_category(category_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM categories WHERE id = %s", (category_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    cursor.close()
    conn.close()
    return {"message": "Category deleted successfully"}

# ✅ Chercher une catégorie par son nom
@router.get("/category_by_name/{category_name}", response_model=Category)
def find_by_category_name(category_name: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories WHERE name = %s", (category_name,))
    category = cursor.fetchone()
    cursor.close()
    conn.close()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category
