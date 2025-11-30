# app.py
from flask import Flask, render_template, request, jsonify 
from data_processing import db_connector # DB 모듈 임포트

# Flask 애플리케이션 초기화
app = Flask(__name__)

# --- 1. 웹 페이지 렌더링 ---
@app.route('/')
def index():
    """메인 페이지 렌더링"""
    return render_template('index.html')

# --- 2. API 테스트 (테스트 완료 후 삭제 가능) ---
@app.route('/api/test', methods=['GET'])
def api_test():
    """API 연동 테스트용 엔드포인트"""
    return jsonify({"message": "API 연동 성공!", "status": "OK"})

# --- 3. 지출 기록 CRUD API ---

@app.route('/api/records', methods=['POST'])
def add_record():
    """새로운 기록 등록 (CREATE)"""
    try:
        data = request.json
        description = data.get('description')
        amount = data.get('amount')
        category = data.get('category')
        date = data.get('date')
        
        if not all([description, amount, category, date]):
            return jsonify({"error": "필수 입력 필드가 누락되었습니다."}), 400

        db_connector.insert_record(description, amount, category, date)
        return jsonify({"message": "기록이 성공적으로 등록되었습니다."}), 201
    except Exception as e:
        return jsonify({"error": f"기록 등록 중 오류 발생: {str(e)}"}), 500


@app.route('/api/records', methods=['GET'])
def get_records():
    """모든 기록 조회 (READ)"""
    try:
        records = db_connector.get_all_records()
        return jsonify(records), 200
    except Exception as e:
        return jsonify({"error": f"기록 조회 중 오류 발생: {str(e)}"}), 500


@app.route('/api/records/<int:record_id>', methods=['PUT'])
def update_record_api(record_id):
    """특정 기록 수정 (UPDATE)"""
    try:
        data = request.json
        description = data.get('description')
        amount = data.get('amount')
        category = data.get('category')
        date = data.get('date')
        
        if not all([description, amount, category, date]):
             return jsonify({"error": "필수 입력 필드가 누락되었습니다."}), 400

        db_connector.update_record(record_id, description, amount, category, date)
        return jsonify({"message": f"ID {record_id} 기록이 수정되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": f"기록 수정 중 오류 발생: {str(e)}"}), 500


@app.route('/api/records/<int:record_id>', methods=['DELETE'])
def delete_record_api(record_id):
    """특정 기록 삭제 (DELETE)"""
    try:
        db_connector.delete_record(record_id)
        return jsonify({"message": f"ID {record_id} 기록이 삭제되었습니다."}), 200
    except Exception as e:
        return jsonify({"error": f"기록 삭제 중 오류 발생: {str(e)}"}), 500