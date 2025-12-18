import asyncio
from models import Base
from database import engine

async def go():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print('DB created')

if __name__ == "__main__":
    asyncio.run(go())
