const npcData = {
    thomas: {
        id: 'thomas',
        name: '토마스',
        image: 'assets/images/npcs/thomas_idle.png',
        baseScale: 0.8, // 뷰포트 너비 대비 35%
        position: { bottom: '0%' },
        dialogues: {
            welcome: [
                '자네가 새로 온 화가인가?',
                '꿈의 그림 공방에 온 걸 환영하네!',
                '나는 이곳의 집사 토마스라고 하네.',
                '앞으로 잘 부탁하네.',
                '그럼 이제 자네 실력 좀 보지.'
            ],
            // ... 추후 다른 대사 추가
        }
    },
    // ... 추후 다른 NPC 추가
};

const dialogData = {
    default: {
        position: { bottom: '60%', left: '10%', right: '10%' },
        size: { width: 'auto', maxWidth: '400px' }
    }
    // ... 추후 다른 위치/크기 프리셋 추가
};

// 그림 모드 기본 설정
const drawConfig = {
    colors: ['#000000', '#ff0000', '#0057ff', '#00a86b', '#ffd166', '#ffffff'],
    brushSizes: [2, 4, 8, 12], // px 단위 (강화로 확장)
    useSlider: false, // 강화로 true 전환
    eraserSizes: [8, 16, 24]
};
