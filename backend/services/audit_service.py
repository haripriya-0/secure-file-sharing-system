import uuid
import psycopg2
from config import DB_URL

def log_event(user_id, file_id, action):
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO audit_logs (user_id, file_id, action)
    VALUES (%s, %s, %s)
    """, (user_id, file_id, action))

    conn.commit()
    cur.close()
    conn.close()