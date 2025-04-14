from fastapi import APIRouter, HTTPException, Form, UploadFile, File
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
def create_product_table():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS produits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            description TEXT,
            price DECIMAL(10, 2),
            category_id INT,
            image VARCHAR(255),
            FOREIGN KEY (category_id) REFERENCES categories(id)
        )
    """)
    conn.commit()
    cursor.close()
    conn.close()

create_product_table()

# Modèle de données pour un produit
class Product(BaseModel):
    name: str
    description: str
    price: float
    category_id: int

# ✅ Route pour ajouter un produit avec une image
@router.post("/add_product")
async def add_product(
    product: Product,
    image: UploadFile = File(...),
):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Sauvegarde de l'image
    os.makedirs("images", exist_ok=True)
    image_filename = f"{product.name.replace(' ', '_')}_{image.filename}"
    image_path = f"images/{image_filename}"

    with open(image_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    cursor.execute(
        "INSERT INTO produits (name, description, price, category_id, image) VALUES (%s, %s, %s, %s, %s)",
        (product.name, product.description, product.price, product.category_id, image_path)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Product added successfully", "image": image_path}

# ✅ Route pour obtenir tous les produits
@router.get("/products")
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produits")
    products = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return products

# ✅ Route pour obtenir les produits d'une catégorie spécifique
@router.get("/products/category/{category_id}")
def get_products_by_category(category_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produits WHERE category_id = %s", (category_id,))
    products = cursor.fetchall()
    cursor.close()
    conn.close()

    return products

# ✅ Route pour obtenir un produit par son ID
@router.get("/product/{product_id}")
def get_product_by_id(product_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produits WHERE id = %s", (product_id,))
    product = cursor.fetchone()
    cursor.close()
    conn.close()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

# ✅ Route pour mettre à jour un produit par son ID
@router.put("/update_product/{product_id}")
async def update_product(product_id: int, product: Product, image: UploadFile = None):
    conn = get_db_connection()
    cursor = conn.cursor()

    if image:
        # Sauvegarde de la nouvelle image
        os.makedirs("images", exist_ok=True)
        image_filename = f"{product.name.replace(' ', '_')}_{image.filename}"
        image_path = f"images/{image_filename}"

        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        cursor.execute(
            "UPDATE produits SET name = %s, description = %s, price = %s, category_id = %s, image = %s WHERE id = %s",
            (product.name, product.description, product.price, product.category_id, image_path, product_id)
        )
    else:
        cursor.execute(
            "UPDATE produits SET name = %s, description = %s, price = %s, category_id = %s WHERE id = %s",
            (product.name, product.description, product.price, product.category_id, product_id)
        )

    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    cursor.close()
    conn.close()

    return {"message": "Product updated successfully"}

# ✅ Route pour supprimer un produit par son ID
@router.delete("/delete_product/{product_id}")
def delete_product(product_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM produits WHERE id = %s", (product_id,))
    conn.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Product not found")

    cursor.close()
    conn.close()

    return {"message": "Product deleted successfully"}

# ✅ Route pour trouver un produit par son nom
@router.get("/product_by_name/{product_name}")
def find_by_product_name(product_name: str):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM produits WHERE name = %s", (product_name,))
    product = cursor.fetchone()
    cursor.close()
    conn.close()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product
