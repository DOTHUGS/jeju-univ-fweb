// 드래그 허용
function allowDrop(event) {
    event.preventDefault(); // 드롭을 허용
}

function adjustPlantSize(plantElement, jar) {
    // 병의 크기 가져오기
    const jarWidth = jar.offsetWidth;
    const jarHeight = jar.offsetHeight;

    // 일정 비율로 크기 조정 
    const newWidth = jarWidth * 0.3;
    const newHeight = jarHeight * 0.3;

    // 식물 이미지의 크기 조정
    plantElement.style.width = `${newWidth}px`;
    plantElement.style.height = `${newHeight}px`;
}

// 드래그 시작 시 실행되는 함수
function drag(event) {
    event.dataTransfer.setData("text", event.target.id); // 드래그된 요소의 id 저장
}

// 드롭 시 실행되는 함수
function drop(event) {
    event.preventDefault();
    let data = event.dataTransfer.getData("text");
    let plantElement = document.getElementById(data);
    
    // 병 영역에만 드롭 가능하게 체크 (jar-walls 클래스가 병임)
    if (event.target.classList.contains("jar-walls")) {
        let jar = event.target; // 병의 드롭된 부분
        jar.appendChild(plantElement);

        // 식물의 위치와 스타일을 재설정
        plantElement.style.position = "absolute";
        plantElement.style.left = (event.clientX - jar.getBoundingClientRect().left) + "px";
        plantElement.style.top = (event.clientY - jar.getBoundingClientRect().top) + "px";
        
        // 식물의 크기를 병의 크기에 맞게 조정
        adjustPlantSize(plantElement, jar);
        // z-index를 설정해서 다른 식물들과 겹치지 않게 함
        plantElement.style.zIndex = highestZIndex++;
    }
}

// 각 식물에 드래그 이벤트 핸들러 추가
document.querySelectorAll('.plant').forEach(plant => {
    plant.addEventListener('dragstart', drag);
});

// 병 안의 영역에 드롭 이벤트 허용
document.querySelectorAll('.jar-walls').forEach(jar => {
    jar.addEventListener('dragover', allowDrop);  // 드롭 가능하도록 설정
    jar.addEventListener('drop', drop);           // 드롭 시 실행되는 함수 연결
});
