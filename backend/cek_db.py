from database import SessionLocal
from models import User

db = SessionLocal()
users = db.query(User).all()
for u in users:
    print(u.username, u.role, u.hashed_password)
db.close()