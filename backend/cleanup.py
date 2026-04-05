from app.database import engine
from app.models import Base
import redis
import os
from dotenv import load_dotenv

load_dotenv()

# Clear database tables
print("Clearing database...")
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("✅ Database cleared!")

# Clear Redis cache
print("Clearing Redis cache...")
r = redis.from_url(os.getenv("REDIS_URL"))
r.flushall()
print("✅ Redis cleared!")

print("🎉 All done! Fresh start!")