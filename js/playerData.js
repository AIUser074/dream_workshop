const PlayerData = {
    data: {
        level: 10,
        xp: 0,
        nextLevelXp: 100,
        reputation: 0,
        nextReputationGoal: 100, // 목표 명성 추가
        gold: 10000, // 테스트를 위해 초기 골드 증가
        skills: {
            'concentration': 0,
            'negotiator': 0,
            'wisdom': 0,
            'mindsEye': 0,
            'reputation': 0,
            'trust': 0,
            'swiftHands': 0
        },
        // 상점 구매 내역
        purchasedItems: {
            paints: [], // 구매한 개별 물감 ID 리스트 (특수 색상 등)
            tools: [],  // 구매한 도구 ID 리스트
            consumables: {}, // 소모품별 일일 구매 횟수 { itemId: { date: 'YYYY-MM-DD', count: 0 } },
            beginnerPaletteSet: false, // 초보자용 팔레트 구매 여부
            basicPaletteSet: false // 기본 팔레트 확장 세트 구매 여부
        }
    },

    // 데이터 변경 시 호출할 이벤트 리스너 배열
    _listeners: [],

    // 데이터 변경을 감지하고 리스너를 호출하는 프록시 설정
    init() {
        // ... (향후 데이터 감지 로직 추가 가능)
    },

    // 데이터 가져오기
    get(key) {
        return this.data[key];
    },

    // 데이터 설정하고 UI 업데이트 트리거
    set(key, value) {
        this.data[key] = value;
        this.emitChange();
    },

    // 골드 추가
    addGold(amount) {
        this.data.gold += amount;
        this.emitChange();
    },

    // 명성 추가
    addReputation(amount) {
        this.data.reputation += amount;
        this.emitChange();
    },

    // 경험치 추가 및 레벨업 처리
    addXp(amount) {
        this.data.xp += amount;
        if (this.data.xp >= this.data.nextLevelXp) {
            this.levelUp();
        }
        this.emitChange();
    },

    levelUp() {
        this.data.level++;
        this.data.xp -= this.data.nextLevelXp;
        this.data.nextLevelXp = Math.floor(this.data.nextLevelXp * 1.5); // 다음 레벨 필요 경험치 증가
        console.log(`레벨 업! ${this.data.level}레벨이 되었습니다.`);
        // TODO: 레벨업 축하 효과
    },

    // 변경 사항을 구독(listen)하는 함수
    onChange(callback) {
        this._listeners.push(callback);
    },

    // 모든 리스너에게 변경 사항 알림
    emitChange() {
        this._listeners.forEach(callback => callback(this.data));
    }
};

PlayerData.init();
