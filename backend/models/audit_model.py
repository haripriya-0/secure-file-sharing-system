import psycopg2
from config import DB_URL

def create_audit_log(user_id, action, file_id=None, ip_address=None):
    conn = psycopg2.connect(DB_URL)
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO audit_logs (user_id, action, file_id, ip_address)
        VALUES (%s, %s, %s, %s)
    """, (user_id, action, file_id, ip_address))

    conn.commit()
    cursor.close()
    conn.close()