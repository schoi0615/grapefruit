// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // 폼 요소와 테이블 tbody 요소를 가져옵니다.
    const form = document.getElementById('recordForm');
    const recordsBody = document.querySelector('#recordsTable tbody');
    
    // 페이지 로드 시 기록을 불러오고 시각화합니다.
    fetchAndRenderRecords();

    // --- 1. 기록 등록 (Create) 핸들러 ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newRecord = {
            date: document.getElementById('date').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            // 금액을 숫자로 변환
            amount: parseFloat(document.getElementById('amount').value)
        };

        const response = await fetch('/api/records', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });

        if (response.ok) {
            alert('기록 추가 성공!');
            form.reset();
            fetchAndRenderRecords(); // 목록 새로고침
        } else {
            const data = await response.json();
            alert(`기록 추가 실패: ${data.error}`);
        }
    });

    // --- 2. 목록 조회 및 렌더링 (Read) ---
    async function fetchAndRenderRecords() {
        const response = await fetch('/api/records');
        const records = await response.json();
        
        recordsBody.innerHTML = ''; // 기존 목록 초기화

        let totalExpense = 0;
        const categoryMap = {}; // 카테고리별 합계를 위한 맵

        records.forEach(record => {
            // 테이블 행 생성
            const row = recordsBody.insertRow();
            row.insertCell(0).textContent = record.id;
            row.insertCell(1).textContent = record.date;
            row.insertCell(2).textContent = record.category;
            row.insertCell(3).textContent = record.description;
            row.insertCell(4).textContent = record.amount.toLocaleString('ko-KR') + '원';
            
            // 삭제 버튼 생성
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.onclick = () => deleteRecord(record.id);
            row.insertCell(5).appendChild(deleteButton);

            // 통계 데이터 계산
            totalExpense += record.amount;
            categoryMap[record.category] = (categoryMap[record.category] || 0) + record.amount;
        });
        
        // 시각화 함수 호출
        renderChart(categoryMap);
    }

    // --- 3. 기록 삭제 (Delete) ---
    async function deleteRecord(id) {
        if (!confirm('정말로 이 기록을 삭제하시겠습니까?')) return;

        const response = await fetch(`/api/records/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('삭제 완료');
            fetchAndRenderRecords(); // 목록 새로고침
        } else {
            alert('삭제 실패');
        }
    }

    // --- 4. 데이터 시각화 (Chart.js) ---
    let chartInstance = null; // 차트 인스턴스 저장 변수
    function renderChart(categoryMap) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy(); // 기존 차트가 있으면 파괴
        }

        const labels = Object.keys(categoryMap);
        const data = Object.values(categoryMap);

        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: '카테고리별 지출 비율',
                    data: data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '월별 지출 카테고리 분포'
                    }
                }
            }
        });
    }
});