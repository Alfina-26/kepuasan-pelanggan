from database import SessionLocal
from models import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

db = SessionLocal()

existing = db.query(User).filter(User.username == "developer").first()
if existing:
    print("Developer sudah ada!")
else:
    dev = User(
        username="developer",
        hashed_password=pwd_context.hash("developer123"),
        role="developer"
    )
    db.add(dev)
    db.commit()
    print("Developer berhasil dibuat! Login dengan: developer / developer123")

db.close()