# data_processing/db_connector.py
import sqlite3

# DB 파일 경로
DB_NAME = 'finance_records.db'

def get_db_connection():
    """데이터베이스 연결 객체를 반환합니다."""
    conn = sqlite3.connect(DB_NAME)
    # 결과를 딕셔너리 형태로 받을 수 있도록 설정
    conn.row_factory = sqlite3.Row 
    return conn

def init_db():
    """데이터베이스 테이블을 초기화합니다. 서버 시작 시 자동으로 실행됩니다."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            date TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

# init_db()를 호출하여 DB 파일이 없으면 생성
init_db()

# --- CRUD 함수 ---

def insert_record(description, amount, category, date):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO records (description, amount, category, date) VALUES (?, ?, ?, ?)",
        (description, amount, category, date)
    )
    conn.commit()
    conn.close()

def get_all_records():
    conn = get_db_connection()
    # 최신 날짜순으로 정렬
    records = conn.execute("SELECT * FROM records ORDER BY date DESC, id DESC").fetchall()
    conn.close()
    return [dict(row) for row in records] 

def update_record(record_id, description, amount, category, date):
    conn = get_db_connection()
    conn.execute(
        "UPDATE records SET description = ?, amount = ?, category = ?, date = ? WHERE id = ?",
        (description, amount, category, date, record_id)
    )
    conn.commit()
    conn.close()

def delete_record(record_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM records WHERE id = ?", (record_id,))
    conn.commit()
    conn.close()