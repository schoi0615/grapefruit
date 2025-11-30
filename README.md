# 프로젝트 제목: 💵 Python Flask 기반 간편 예산 관리 웹 대시보드

## 📌 1. 프로젝트 소개 및 융합 목표
본 프로젝트는 본인의 전공/관심사(경영학/재무 관리)를 IT 기술(Python Flask, 데이터 시각화)과 융합하여 구현한 웹 애플리케이션입니다.

* 목표: 사용자가 일별 지출 기록을 입력하면, 실시간으로 데이터를 SQLite DB에 저장하고, JavaScript Chart.js 라이브러리를 통해 카테고리별 지출 비율을 원형 차트(파이 차트)로 시각화하여 직관적인 재무 분석을 제공합니다.
* 전공자 중점: 데이터베이스(SQLite), 백엔드 API(Flask), 데이터 처리 모듈을 분리하여 모듈화 및 깔끔한 폴더 구조를 구현했습니다.

---

## ⚙️ 2. 구현한 주요 기능

1.  지출 기록 CRUD: 새로운 지출 기록을 등록(POST)하고, 전체 목록을 테이블로 조회(GET)하며, 기록을 삭제(DELETE)할 수 있는 기능을 구현했습니다.
2.  데이터베이스 연동: Python SQLite3를 사용하여 지출 기록을 영구적으로 저장하고 관리합니다.
3.  실시간 데이터 시각화: JavaScript Chart.js 라이브러리를 사용하여, 입력된 지출 데이터를 분석하여 카테고리별 지출 비율을 실시간으로 계산하고 원형 차트로 업데이트합니다.
4.  RESTful API: 프론트엔드(HTML/JS)와 백엔드(Flask)가 /api/records 엔드포인트를 통해 JSON 형태로 데이터를 주고받습니다.

---

## 🛠 3. 사용한 기술 스택

| 구분 | 기술 / 라이브러리 | 역할 |
| :--- | :--- | :--- |
| 백엔드 | Python Flask | 웹 서버 및 RESTful API 구축 |
| 데이터 | SQLite3 | 지출 기록 데이터베이스 관리 |
| 분석 | Pandas (설치됨) | 데이터 분석 및 통계 처리 (확장성 확보) |
| 프론트엔드 | HTML5, CSS3, JavaScript (Vanilla) | 사용자 인터페이스 및 동작 구현 |
| 시각화 | Chart.js | 클라이언트 측 데이터 시각화 담당 |

---

## 🚀 4. 실행 방법

1.  프로젝트 복제: GitHub 저장소에서 코드를 로컬로 복제합니다.
2.  환경 설정: Python 환경이 준비된 터미널(CMD/PowerShell)에서 프로젝트 폴더로 이동합니다.
    * 가상 환경 활성화: `.\venv\Scripts\activate` (또는 `cd venv\Scripts` 후 `.\activate`, 이후 `cd ..\..` 복귀)
    * 필수 라이브러리 설치: `pip install -r requirements.txt` (또는 `pip install Flask pandas`)
3.  서버 구동: Flask 애플리케이션을 실행합니다.
    * `set FLASK_APP=app.py`
    * `flask run`
4.  접속: 브라우저에서 `http://127.0.0.1:5000/`로 접속하여 사용합니다.

---