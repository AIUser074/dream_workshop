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
                '앞으로 잘 부탁하네.'
            ],
            reaction_perfect: [
                '세상에, 이건... 완벽 그 자체로군!',
                '자네는 천재적인 재능을 가졌어!'
            ],
            reaction_good: [
                '오! 정말 멋진 그림이군!',
                '자네의 실력에 감탄했네.'
            ],
            reaction_normal: [
                '음, 나쁘지 않군.',
                '다음엔 더 잘할 수 있을 걸세.'
            ],
            reaction_bad: [
                '흠... 이건 좀 아쉽군.',
                '조금 더 노력해야겠어.'
            ],
            reaction_terrible: [
                '이게... 뭔가...?',
                '의도를 전혀 모르겠네.'
            ]
        },
        requests: [
            '행복한 돌고래를 그려보게.',
            '언덕 위의 작은 집을 그려보게.',
            '밤하늘에 떠 있는 초승달을 그려보게.',
            '활짝 핀 해바라기 한 송이를 그려보게.',
            '커다란 빨간 사과를 그려보게.'
        ]
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

const skillData = {
    // 그룹 1: 기본 역량
    'concentration': {
        name: '집중력',
        icon: '⏰',
        group: 'basic',
        description: '그림 그리기 제한 시간을 영구적으로 늘려줍니다.',
        levels: [
            { cost: 50, effect: '+10초 (총 70초)' },
            { cost: 75, effect: '+10초 (총 80초)' },
            { cost: 125, effect: '+15초 (총 95초)' },
            { cost: 200, effect: '+15초 (총 110초)' },
            { cost: 300, effect: '+20초 (총 130초)' }
        ]
    },
    'negotiator': {
        name: '협상의 달인',
        icon: '🤝',
        group: 'basic',
        description: '획득하는 골드 보너스가 영구적으로 증가합니다.',
        levels: [
            { cost: 120, effect: '골드 보너스 +3%' }, { cost: 180, effect: '골드 보너스 +6%' },
            { cost: 250, effect: '골드 보너스 +9%' }, { cost: 350, effect: '골드 보너스 +12%' },
            { cost: 500, effect: '골드 보너스 +15%' }, { cost: 700, effect: '골드 보너스 +18%' },
            { cost: 950, effect: '골드 보너스 +21%' }, { cost: 1250, effect: '골드 보너스 +24%' },
            { cost: 1600, effect: '골드 보너스 +27%' }, { cost: 2000, effect: '골드 보너스 +30%' }
        ]
    },
    'wisdom': {
        name: '지혜의 성장',
        icon: '✨📖',
        group: 'basic',
        description: '획득하는 경험치(XP) 보너스가 영구적으로 증가합니다.',
        levels: [
            { cost: 100, effect: 'XP 보너스 +3%' }, { cost: 150, effect: 'XP 보너스 +6%' },
            { cost: 220, effect: 'XP 보너스 +9%' }, { cost: 300, effect: 'XP 보너스 +12%' },
            { cost: 400, effect: 'XP 보너스 +15%' }, { cost: 550, effect: 'XP 보너스 +18%' },
            { cost: 750, effect: 'XP 보너스 +21%' }, { cost: 1000, effect: 'XP 보너스 +24%' },
            { cost: 1300, effect: 'XP 보너스 +27%' }, { cost: 1700, effect: 'XP 보너스 +30%' }
        ]
    },
    // 그룹 2: 전문 기술
    'mindsEye': {
        name: '마음의 눈',
        icon: '❤️👁️',
        group: 'expert',
        reqLevel: 4,
        description: '손님의 숨겨진 선호도를 파악하는 능력을 얻습니다.',
        levels: [
            { cost: 500, effect: "'좋아하는 색상' 힌트 표시" },
            { cost: 1500, effect: "'싫어하는 것' 힌트 표시 (요구 레벨: 9)" },
            { cost: 3000, effect: "'손님 정보 노트' 기능 해금 (요구 레벨: 16)" }
        ]
    },
    'reputation': {
        name: '예술가의 평판',
        icon: '📈',
        group: 'expert',
        reqLevel: 8,
        description: '그림 완성 시, 확률적으로 획득 명성이 2배가 됩니다.',
        levels: [
            { cost: 800, effect: '5% 확률로 명성 2배' }, { cost: 1200, effect: '10% 확률 (요구 레벨: 12)' },
            { cost: 1800, effect: '15% 확률 (요구 레벨: 16)' }, { cost: 2500, effect: '20% 확률 (요구 레벨: 20)' },
            { cost: 3500, effect: '25% 확률 (요구 레벨: 24)' }
        ]
    },
    'trust': {
        name: '굳건한 신뢰',
        icon: '🛡️',
        group: 'expert',
        reqLevel: 10,
        description: '명성이 하락할 때, 확률적으로 하락을 무시합니다.',
        levels: [
            { cost: 1000, effect: '10% 확률로 명성 하락 무시' }, { cost: 1500, effect: '20% 확률 (요구 레벨: 14)' },
            { cost: 2200, effect: '30% 확률 (요구 레벨: 18)' }, { cost: 3000, effect: '40% 확률 (요구 레벨: 22)' },
            { cost: 4200, effect: '50% 확률 (요구 레벨: 26)' }
        ]
    },
    // 그룹 3: 장인의 비급
    'swiftHands': {
        name: '신속의 손놀림',
        icon: '👐',
        group: 'master',
        reqLevel: 15,
        description: '의뢰를 빨리 끝낼수록 보너스 골드를 획득합니다.',
        levels: [
            { cost: 2000, effect: '남은 1초당 +0.5 골드' }, { cost: 2800, effect: '남은 1초당 +1.0 골드 (요구 레벨: 19)' },
            { cost: 3800, effect: '남은 1초당 +1.5 골드 (요구 레벨: 23)' }, { cost: 5000, effect: '남은 1초당 +2.0 골드 (요구 레벨: 27)' },
            { cost: 6500, effect: '남은 1초당 +2.5 골드 (요구 레벨: 30)' }
        ]
    }
};

// 그림 모드 기본 설정
const drawConfig = {
    colors: ['#000000', '#ff0000', '#0057ff', '#00a86b', '#ffd166', '#ffffff'],
    brushSizes: [2, 4, 8, 12], // px 단위 (강화로 확장)
    useSlider: false, // 강화로 true 전환
    eraserSizes: [24, 16, 8] /* 굵은 순서로 변경 */
};

const shopData = {
    paints: {
        // 2단계: 튜토리얼 -> 초보자용 팔레트 (LV.1)
        beginnerPaletteSet: {
            name: '초보자용 팔레트',
            icon: '🌱',
            description: "그림의 기초가 되는 노랑, 초록 2색을 해금합니다.",
            reqLevel: 1,
            cost: 100
        },

        // 3단계: 기본 팔레트 완성 (세트 상품)
        basicPaletteSet: {
            name: '기본 팔레트 확장 세트',
            icon: '🎨',
            description: "그림의 기본이 되는 6가지 필수 색상을 한 번에 해금합니다.",
            reqLevel: 2,
            cost: 800
        },

        // 4단계: 특수 색상 (개별 구매)
        cyan:   { name: '청록색 물감', icon: '🩵', color: '#00CED1', reqLevel: 5, cost: 350, special: true },
        apricot:{ name: '살구색 물감', icon: '🍑', color: '#FFDAB9', reqLevel: 7, cost: 450, special: true },
        gold:   { name: '금색 물감',   icon: '🌟', color: '#FFD700', reqLevel: 10, cost: 1200, special: true },
        silver: { name: '은색 물감',   icon: '💿', color: '#C0C0C0', reqLevel: 10, cost: 1200, special: true },
        coral:  { name: '코랄 핑크 물감', icon: '🪸', color: '#FF7F50', reqLevel: 12, cost: 700, special: true },
        indigo: { name: '남색 물감', icon: '🌌', color: '#4B0082', reqLevel: 14, cost: 850, special: true }
    },

    tools: {
        timeSandglass: {
            name: '모래시계',
            icon: '⏳',
            description: "그림 그리기 중 실수를 무제한으로 되돌릴 수 있는 '뒤로 가기' 기능을 영구적으로 해금합니다.",
            reqLevel: 3,
            cost: 3000
        },
        sparklingBrush: {
            name: '반짝이 붓',
            icon: '🖌️✨',
            description: '그림에 반짝이는 별가루 효과를 주는 특수 붓을 영구적으로 해금합니다. 그리기 모드에 새로운 붓이 추가됩니다.',
            reqLevel: 8,
            cost: 5000
        }
    },

    consumables: {
        goldenBrush: {
            name: '황금 붓 (30분)',
            icon: '🖌️💰',
            description: '사용 후 30분 동안 모든 의뢰에서 획득하는 골드가 2배가 됩니다. (1회용)',
            cost: 500,
            dailyLimit: 1
        }
    }
};
