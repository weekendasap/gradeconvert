document.addEventListener('DOMContentLoaded', () => {
    // HTML 요소들을 JavaScript 변수로 가져옵니다.
    const totalStudentsInput = document.getElementById('totalStudents');
    const calculateBtn = document.getElementById('calculateBtn');
    const gradeResultsDiv = document.getElementById('gradeResults');
    const averageGrade9Div = document.getElementById('averageGrade9');
    const overallPercentageDiv = document.getElementById('overallPercentage');

    // 과목별 입력 필드를 배열로 저장합니다. (ID가 rank로 변경)
    const subjects = [
        { id: 'koreanRank', name: '국어' },
        { id: 'englishRank', name: '영어' },
        { id: 'mathRank', name: '수학' },
        { id: 'scienceRank', name: '과학' },
        { id: 'historyRank', name: '역사' },
        { id: 'peRank', name: '체육' },
        { id: 'artRank', name: '미술' },
        { id: 'socialRank', name: '사회' }
    ];

    // 백분위를 9등급제로 변환하는 함수
    function convertPercentileTo9Grade(percentile) {
        if (percentile <= 4) return 1;
        else if (percentile <= 11) return 2;
        else if (percentile <= 23) return 3;
        else if (percentile <= 40) return 4;
        else if (percentile <= 60) return 5;
        else if (percentile <= 77) return 6;
        else if (percentile <= 89) return 7;
        else if (percentile <= 96) return 8;
        else return 9;
    }

    // 버튼 클릭 이벤트 리스너
    calculateBtn.addEventListener('click', () => {
        // 1. 기본 정보 가져오기
        const totalStudents = parseInt(totalStudentsInput.value);

        // 유효성 검사 (전체 학생 수)
        if (isNaN(totalStudents) || totalStudents <= 0) {
            alert('전체 1학년 학생 수를 올바르게 입력해주세요.');
            return;
        }

        // 2. 과목별 등급 계산 및 표시
        gradeResultsDiv.innerHTML = ''; // 이전 결과 초기화
        let sum9Grade = 0; // 9등급제 등급의 합계
        let validSubjectCount = 0; // 유효하게 입력된 과목 수
        let totalPercentile = 0; // 전체 과목의 백분위 합 (평균 백분위 계산용)

        subjects.forEach(subject => {
            const inputElement = document.getElementById(subject.id);
            const myRank = parseInt(inputElement.value);

            // 과목별 등수 유효성 검사
            if (isNaN(myRank) || myRank < 1 || myRank > totalStudents) {
                // 등수를 입력하지 않았거나 유효하지 않은 경우
                gradeResultsDiv.innerHTML += `
                    <div class="grade-result-item">
                        <strong>${subject.name}:</strong> 등수를 올바르게 입력해주세요. (계산 제외)
                    </div>
                `;
            } else {
                // 등수를 바탕으로 백분위 계산 (상위 퍼센트)
                const percentile = ((myRank / totalStudents) * 100).toFixed(2);
                const grade9 = convertPercentileTo9Grade(parseFloat(percentile)); // 9등급제 등급 산출

                gradeResultsDiv.innerHTML += `
                    <div class="grade-result-item">
                        <strong>${subject.name}:</strong> 
                        내 등수: ${myRank}등 (${totalStudents}명 중)<br>
                        상위 백분위: <span style="color: #28a745;">${percentile}%</span><br>
                        9등급제 등급: <span style="color: #dc3545;">${grade9}등급</span>
                    </div>
                `;
                sum9Grade += grade9;
                validSubjectCount++;
                totalPercentile += parseFloat(percentile);
            }
        });

        // 3. 전체 평균 등급 (9등급제) 및 전체 상위 퍼센트 계산 및 표시
        if (validSubjectCount > 0) {
            const average9Grade = (sum9Grade / validSubjectCount).toFixed(2);
            const averagePercentile = (totalPercentile / validSubjectCount).toFixed(2);

            // 9등급제 등급은 정수로 표시하는 것이 일반적이므로 반올림 또는 내림 처리
            // 여기서는 반올림하여 가까운 정수로 표시 (예: 2.3 -> 2등급, 2.7 -> 3등급)
            const finalAverage9Grade = Math.round(parseFloat(average9Grade));

            averageGrade9Div.innerHTML = `
                전체 과목 <strong>평균 9등급제: <span style="color: #dc3545;">${finalAverage9Grade}등급</span></strong> (세부 평균: ${average9Grade}등급)
            `;

            overallPercentageDiv.innerHTML = `
                <p>입력된 과목 등수들의 평균으로 추정할 때,</p>
                <p>당신은 전체 1학년 학생 중 <span style="color: #007bff; font-size: 1.4em;">상위 ${averagePercentile}%</span>에 해당합니다.</p>
                <p style="font-size: 0.9em; color: #888;">(전체 학생 수를 기준으로 계산된 과목별 등수의 평균 백분위입니다.)</p>
            `;

        } else {
            averageGrade9Div.innerHTML = `평균 등급을 계산하려면 과목별 등수를 하나 이상 입력해주세요.`;
            overallPercentageDiv.innerHTML = ``;
        }
    });
});