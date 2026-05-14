from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
db = SessionLocal()
user = db.query(User).filter(User.username == "admin").first()
if user:
    print("User ditemukan!")
    print("Username:", user.username)
    print("Role:", user.role)
    print("Password cocok:", pwd_context.verify("admin123", user.hashed_password))
else:
    print("User admin TIDAK ADA di database!")
db.close()