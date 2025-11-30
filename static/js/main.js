// static/js/main.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recordForm');
    const recordsBody = document.querySelector('#recordsTable tbody');
    const colorModeSelect = document.getElementById('colorMode');
    const customColorInput = document.getElementById('customColorInput');

    const DEFAULT_COLORS = [
        '#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1', 
        '#17a2b8', '#fd7e14', '#e83e8c', '#adb5bd', '#20c997'
    ];

    let currentRecords = [];

    fetchAndRenderRecords();

    colorModeSelect.addEventListener('change', () => {
        updateColorSettingsUI(currentRecords);
        renderChart(getCategoryMap(currentRecords));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const newRecord = {
            date: document.getElementById('date').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
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
            fetchAndRenderRecords();
        } else {
            const data = await response.json();
            alert(`기록 추가 실패: ${data.error}`);
        }
    });

    async function fetchAndRenderRecords() {
        const response = await fetch('/api/records');
        const records = await response.json();
        
        currentRecords = records;
        recordsBody.innerHTML = '';

        const categoryMap = {};

        records.forEach(record => {
            const row = recordsBody.insertRow();
            row.insertCell(0).textContent = record.id;
            row.insertCell(1).textContent = record.date;
            row.insertCell(2).textContent = record.category;
            row.insertCell(3).textContent = record.description;
            row.insertCell(4).textContent = record.amount.toLocaleString('ko-KR') + '원';
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.onclick = () => deleteRecord(record.id);
            row.insertCell(5).appendChild(deleteButton);

            categoryMap[record.category] = (categoryMap[record.category] || 0) + record.amount;
        });
        
        updateColorSettingsUI(records);
        renderChart(categoryMap);
    }

    function updateColorSettingsUI(records) {
        customColorInput.innerHTML = '';
        const mode = colorModeSelect.value;
        
        if (mode === 'default') {
            customColorInput.style.display = 'none';
            return;
        }

        customColorInput.style.display = 'flex';
        
        const categoryMap = getCategoryMap(records);
        let targetCategories = [];

        if (mode === 'custom') {
            targetCategories = Object.keys(categoryMap);
        } else if (mode === 'size') {
            targetCategories = Object.entries(categoryMap)
                                     .sort((a, b) => b[1] - a[1])
                                     .slice(0, 5)
                                     .map(item => item[0]);
        }

        if (targetCategories.length === 0) {
             customColorInput.innerHTML = `<p>데이터가 없어 설정할 카테고리가 없습니다.</p>`;
             return;
        }

        customColorInput.innerHTML = `<p style="width: 100%; margin-bottom: 10px;">${mode === 'custom' ? '모든 카테고리' : '상위 5개 카테고리'} 색상을 지정하세요.</p>`;
        
        targetCategories.forEach((cat, index) => {
            const div = document.createElement('div');
            div.className = 'color-setting-item';
            div.innerHTML = `
                <label>${cat} (${mode === 'size' ? (index + 1) + '위' : '커스텀'}):</label>
                <input type="color" id="color-${cat}" data-category="${cat}" value="${DEFAULT_COLORS[index % DEFAULT_COLORS.length]}">
            `;
            customColorInput.appendChild(div);
        });

        customColorInput.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('input', () => {
                renderChart(getCategoryMap(records));
            });
        });
    }
    
    function getCategoryMap(records) {
        const map = {};
        records.forEach(r => {
            map[r.category] = (map[r.category] || 0) + r.amount;
        });
        return map;
    }

    async function deleteRecord(id) {
        if (!confirm('정말로 이 기록을 삭제하시겠습니까?')) return;

        const response = await fetch(`/api/records/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('삭제 완료');
            fetchAndRenderRecords();
        } else {
            alert('삭제 실패');
        }
    }

    let chartInstance = null;

    function renderChart(categoryMap) {
        const ctx = document.getElementById('categoryChart').getContext('2d');
        
        if (chartInstance) {
            chartInstance.destroy();
        }

        const labels = Object.keys(categoryMap);
        const data = Object.values(categoryMap);
        const mode = colorModeSelect.value;
        let backgroundColors = [];

        // 데이터 정렬
        const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
        const sortedLabels = sortedCategories.map(item => item[0]);
        const sortedData = sortedCategories.map(item => item[1]);


        if (mode === 'custom' || mode === 'size') {
            const customColors = {};
            customColorInput.querySelectorAll('input[type="color"]').forEach(input => {
                customColors[input.dataset.category] = input.value;
            });
            
            // 정렬된 순서대로 색상을 가져오거나 기본 색상을 적용
            backgroundColors = sortedLabels.map((cat, index) => {
                // 커스텀 색상이 있다면 사용, 없으면 기본 색상 사용
                return customColors[cat] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            });

        } else { // 'default' 모드
            // 정렬된 순서대로 기본 색상 적용
            backgroundColors = sortedLabels.map((_, index) => DEFAULT_COLORS[index % DEFAULT_COLORS.length]);
        }


        chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: sortedLabels,
                datasets: [{
                    label: '카테고리별 지출 비율',
                    data: sortedData,
                    backgroundColor: backgroundColors,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: '월별 지출 카테고리 분포' }
                }
            }
        });
    }
});