const PlayerData = {
    _storageKey: 'dream_workshop_player_data',
    _createDefaultData() {
        return {
        level: 1,
        xp: 0,
            nextLevelXp: 50,
            reputation: 50,
        nextReputationGoal: 100, // 목표 명성 추가
            gold: 100,
        skills: {
            'concentration': 0,
            'negotiator': 0,
            'wisdom': 0,
            'mindsEye': 0,
            'reputation': 0,
            'trust': 0,
                'swiftHands': 0,
                'lastFocus': 0
        },
        // 상점 구매 내역
        purchasedItems: {
            paints: [], // 구매한 개별 물감 ID 리스트 (특수 색상 등)
            tools: [],  // 구매한 도구 ID 리스트
            consumables: {}, // 소모품별 일일 구매 횟수 { itemId: { date: 'YYYY-MM-DD', count: 0 } },
            beginnerPaletteSet: false, // 초보자용 팔레트 구매 여부
                basicPaletteSet: false, // 기본 팔레트 확장 세트 구매 여부
                skilledPaletteSet: false,
                artisanPaletteSet: false
        },
        // 출석 정보
        attendance: {
            currentDay: 1, // 다음 출석 일차
            attendedDays: [], // 출석 완료한 일차 배열
            lastDate: null // 마지막 출석 날짜
        },
        // 완성된 작품 기록 (앨범용)
        artworks: [],
            // 현재 방문 중인 NPC ID (방문 시작 시 설정, 그림 제출/세션 종료 시 null)
            currentNpcId: null,
            // 현재 진행 중인 의뢰/요청 식별자 (재접속 시 동일 의뢰 복원용)
            currentQuestId: null,   // questData의 quest.id (게시판/스토리 의뢰 등)
            currentRequestId: null, // REQUEST_DATA 또는 npc.requests의 request.id
            // 의뢰 게시판에서 예약된 의뢰 정보 { npcId, questId, requestId }
            nextReserved: null,
            // 예약된 다음 손님 NPC ID (보드 UI 표시용)
            nextReservedCustomer: null,
        // 첫 의뢰 완료 여부 플래그
            hasCompletedFirstQuest: false,
            // 편지(의뢰 상세) 읽음 상태: { [questId]: true }
            questLettersRead: {},
            // ----- 스토리/진행 저장 -----
            saveVersion: 1,
            tutorialCompleted: false,
            drawingTutorialCompleted: false,
            solveTutorialCompleted: false,
            pendingSolveTutorial: false,
            storyProgress: {
                leo: 0,
                press: 0,
                pie: 0
            },
            storyOutcomes: {
                // 예: leo_quest1: 'creative_success'
            },
            relationships: {
                sofia_romance_points: 0
            },
            // 최근 방문 NPC 큐 (중복 방지용)
            recentCustomers: [],
            // 마지막 스토리 이후 랜덤 방문 카운트
            randomSinceLastStory: 0,
            // 스토리 다음 단계까지 필요한 랜덤 방문 목표 수
            storyRandomTarget: {
                leo: 0,
                press: 0,
                pie: 0 // 첫 파이 스토리도 바로 등장하도록 0으로 설정
            },
            // 스토리 에필로그(보상-only 방문) 대기 플래그
            epiloguePending: {
                leo: false,
                press: false,
                pie: false
            },
            // 보상만 주고 떠나는 방문(에필로그 등) 대기 큐
            pendingRewardVisits: [],
            activeConsumables: {},
            completedQuestIds: [],
            completedRequestIds: [],
            questBoardIds: [],
            _declineCooldownActive: false,
            declinedQuestIds: [],
            submissionCount: 0 // 그림 제출 횟수 카운트
        };
    },
    data: null,

    // 데이터 변경 시 호출할 이벤트 리스너 배열
    _listeners: [],

    // 데이터 변경을 감지하고 리스너를 호출하는 프록시 설정
    init() {
        // ... (향후 데이터 감지 로직 추가 가능)
    },

    load() {
        try {
            if (typeof localStorage === 'undefined') return;
            const raw = localStorage.getItem(this._storageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return;
            const merged = { ...this.data, ...parsed };
            merged.skills = { ...this.data.skills, ...(parsed.skills || {}) };
            const parsedPurchased = parsed.purchasedItems || {};
            merged.purchasedItems = {
                ...this.data.purchasedItems,
                ...parsedPurchased,
                paints: Array.isArray(parsedPurchased.paints) ? parsedPurchased.paints : (this.data.purchasedItems.paints || []).slice(),
                tools: Array.isArray(parsedPurchased.tools) ? parsedPurchased.tools : (this.data.purchasedItems.tools || []).slice(),
                consumables: { ...this.data.purchasedItems.consumables, ...(parsedPurchased.consumables || {}) }
            };
            merged.attendance = {
                ...this.data.attendance,
                ...(parsed.attendance || {})
            };
            merged.storyProgress = { ...this.data.storyProgress, ...(parsed.storyProgress || {}) };
            merged.storyOutcomes = { ...this.data.storyOutcomes, ...(parsed.storyOutcomes || {}) };
            merged.relationships = { ...this.data.relationships, ...(parsed.relationships || {}) };
            merged.recentCustomers = Array.isArray(parsed.recentCustomers) ? parsed.recentCustomers : this.data.recentCustomers;
            merged.randomSinceLastStory = typeof parsed.randomSinceLastStory === 'number' ? parsed.randomSinceLastStory : this.data.randomSinceLastStory;
            merged.storyRandomTarget = { ...this.data.storyRandomTarget, ...(parsed.storyRandomTarget || {}) };
            merged.epiloguePending = { ...this.data.epiloguePending, ...(parsed.epiloguePending || {}) };
            merged.pendingRewardVisits = Array.isArray(parsed.pendingRewardVisits) ? parsed.pendingRewardVisits : this.data.pendingRewardVisits;
            merged.activeConsumables = { ...this.data.activeConsumables, ...(parsed.activeConsumables || {}) };
            merged.completedQuestIds = Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds : this.data.completedQuestIds;
            merged.completedRequestIds = Array.isArray(parsed.completedRequestIds) ? parsed.completedRequestIds : this.data.completedRequestIds;
            merged.questBoardIds = Array.isArray(parsed.questBoardIds) ? parsed.questBoardIds : this.data.questBoardIds;
            merged._declineCooldownActive = !!parsed._declineCooldownActive;
            merged.declinedQuestIds = Array.isArray(parsed.declinedQuestIds) ? parsed.declinedQuestIds : this.data.declinedQuestIds;
            merged.artworks = Array.isArray(parsed.artworks) ? parsed.artworks : this.data.artworks;
            merged.questLettersRead = { ...this.data.questLettersRead, ...(parsed.questLettersRead || {}) };
            merged.hasCompletedFirstQuest = !!parsed.hasCompletedFirstQuest;
            merged.submissionCount = (typeof parsed.submissionCount === 'number') ? parsed.submissionCount : 0;
            merged.currentNpcId = (typeof parsed.currentNpcId === 'string' && parsed.currentNpcId) ? parsed.currentNpcId : null;
            merged.nextReserved = (parsed.nextReserved && typeof parsed.nextReserved === 'object') ? parsed.nextReserved : null;
            merged.nextReservedCustomer = (typeof parsed.nextReservedCustomer === 'string' && parsed.nextReservedCustomer) ? parsed.nextReservedCustomer : null;
            this.data = merged;
        } catch (e) {
            console.warn('PlayerData load failed:', e);
        }
    },

    reset() {
        this.data = this._createDefaultData();
        this.emitChange();
    },

    async resetAsync() {
        this.data = this._createDefaultData();
        this.persist();
        try {
            await this.persistToNative();
        } catch(e) {
            console.warn('resetAsync persistToNative failed:', e);
        }
        this._listeners.forEach(callback => callback(this.data));
    },

    persist() {
        try {
            if (typeof localStorage === 'undefined') return;
            localStorage.setItem(this._storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.warn('PlayerData persist failed:', e);
        }
    },

    // Toss Native Storage (또는 호스트 앱에서 주입한 Storage) 핸들러
    _getNativeStorage() {
        try {
            if (typeof window === 'undefined') return null;
            const ns = window.DWNativeStorage || null;
            if (ns && typeof ns.getItem === 'function' && typeof ns.setItem === 'function') {
                return ns;
            }
        } catch (_) {}
        return null;
    },

    async loadFromNative() {
        try {
            const ns = this._getNativeStorage();
            if (!ns) return;
            const raw = await ns.getItem(this._storageKey);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return;
            const merged = { ...this.data, ...parsed };
            merged.skills = { ...this.data.skills, ...(parsed.skills || {}) };
            const parsedPurchased = parsed.purchasedItems || {};
            merged.purchasedItems = {
                ...this.data.purchasedItems,
                ...parsedPurchased,
                paints: Array.isArray(parsedPurchased.paints) ? parsedPurchased.paints : (this.data.purchasedItems.paints || []).slice(),
                tools: Array.isArray(parsedPurchased.tools) ? parsedPurchased.tools : (this.data.purchasedItems.tools || []).slice(),
                consumables: { ...this.data.purchasedItems.consumables, ...(parsedPurchased.consumables || {}) }
            };
            merged.attendance = {
                ...this.data.attendance,
                ...(parsed.attendance || {})
            };
            merged.storyProgress = { ...this.data.storyProgress, ...(parsed.storyProgress || {}) };
            merged.storyOutcomes = { ...this.data.storyOutcomes, ...(parsed.storyOutcomes || {}) };
            merged.relationships = { ...this.data.relationships, ...(parsed.relationships || {}) };
            merged.recentCustomers = Array.isArray(parsed.recentCustomers) ? parsed.recentCustomers : this.data.recentCustomers;
            merged.randomSinceLastStory = typeof parsed.randomSinceLastStory === 'number' ? parsed.randomSinceLastStory : this.data.randomSinceLastStory;
            merged.storyRandomTarget = { ...this.data.storyRandomTarget, ...(parsed.storyRandomTarget || {}) };
            merged.epiloguePending = { ...this.data.epiloguePending, ...(parsed.epiloguePending || {}) };
            merged.pendingRewardVisits = Array.isArray(parsed.pendingRewardVisits) ? parsed.pendingRewardVisits : this.data.pendingRewardVisits;
            merged.activeConsumables = { ...this.data.activeConsumables, ...(parsed.activeConsumables || {}) };
            merged.completedQuestIds = Array.isArray(parsed.completedQuestIds) ? parsed.completedQuestIds : this.data.completedQuestIds;
            merged.completedRequestIds = Array.isArray(parsed.completedRequestIds) ? parsed.completedRequestIds : this.data.completedRequestIds;
            merged.questBoardIds = Array.isArray(parsed.questBoardIds) ? parsed.questBoardIds : this.data.questBoardIds;
            merged._declineCooldownActive = !!parsed._declineCooldownActive;
            merged.declinedQuestIds = Array.isArray(parsed.declinedQuestIds) ? parsed.declinedQuestIds : this.data.declinedQuestIds;
            merged.artworks = Array.isArray(parsed.artworks) ? parsed.artworks : this.data.artworks;
            merged.questLettersRead = { ...this.data.questLettersRead, ...(parsed.questLettersRead || {}) };
            merged.hasCompletedFirstQuest = !!parsed.hasCompletedFirstQuest;
            merged.submissionCount = (typeof parsed.submissionCount === 'number') ? parsed.submissionCount : 0;
            this.data = merged;
            this.emitChange();
        } catch (e) {
            console.warn('PlayerData loadFromNative failed:', e);
        }
    },

    persistToNative() {
        try {
            const ns = this._getNativeStorage();
            if (!ns) return Promise.resolve();
            const payload = JSON.stringify(this.data);
            // 비동기지만 여기서는 fire-and-forget으로 처리
            return Promise.resolve(ns.setItem(this._storageKey, payload)).catch((e) => {
                console.warn('PlayerData persistToNative failed:', e);
            });
        } catch (e) {
            console.warn('PlayerData persistToNative failed:', e);
            return Promise.resolve();
        }
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
        // 명성은 0~100 사이로 제한
        this.data.reputation = Math.max(0, Math.min(100, this.data.reputation));
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
        try {
            document.dispatchEvent(new CustomEvent('player:levelUp', {
                detail: { level: this.data.level }
            }));
        } catch (e) {
            console.warn('player:levelUp 이벤트 전파 실패', e);
        }
    },

    // 새 작품을 갤러리에 추가
    addArtwork(artworkData) {
        if (!this.data.artworks) {
            this.data.artworks = [];
        }
        this.data.artworks.unshift(artworkData); // 최신 그림이 맨 앞에 오도록 unshift 사용
        this.emitChange();
        console.log("New artwork added to gallery:", artworkData);
    },

    // 특정 의뢰 편지를 읽음으로 표시
    markLetterRead(questId) {
        if (!questId) return;
        const map = this.data.questLettersRead || {};
        if (!map[questId]) {
            map[questId] = true;
            this.data.questLettersRead = map;
            this.emitChange();
        }
    },

    // 특정 의뢰 편지가 읽혔는지 여부
    isLetterRead(questId) {
        const map = this.data.questLettersRead || {};
        return !!map[questId];
    },

    // 변경 사항을 구독(listen)하는 함수
    onChange(callback) {
        this._listeners.push(callback);
    },

    // 모든 리스너에게 변경 사항 알림
    emitChange() {
        this.persist();
        this.persistToNative();
        this._listeners.forEach(callback => callback(this.data));
    },

    addActiveConsumable(id, uses) {
        if (!id || !uses) return;
        const map = this.data.activeConsumables || {};
        map[id] = (map[id] || 0) + uses;
        this.data.activeConsumables = map;
        this.emitChange();
    },

    consumeActiveConsumable(id) {
        if (!id) return;
        const map = this.data.activeConsumables || {};
        if (!map[id]) return;
        map[id] -= 1;
        if (map[id] <= 0) {
            delete map[id];
        }
        this.data.activeConsumables = map;
        this.emitChange();
    },

    getActiveConsumableCount(id) {
        const map = this.data.activeConsumables || {};
        return map[id] || 0;
    },

    markQuestCompleted(questId) {
        if (!questId) return;
        const list = Array.isArray(this.data.completedQuestIds) ? this.data.completedQuestIds : [];
        if (!list.includes(questId)) {
            list.push(questId);
            this.data.completedQuestIds = list;
            this.emitChange();
        }
    },

    hasCompletedQuest(questId) {
        if (!questId) return false;
        const list = Array.isArray(this.data.completedQuestIds) ? this.data.completedQuestIds : [];
        return list.includes(questId);
    },

    markRequestCompleted(requestId) {
        if (!requestId) return;
        const list = Array.isArray(this.data.completedRequestIds) ? this.data.completedRequestIds : [];
        if (!list.includes(requestId)) {
            list.push(requestId);
            this.data.completedRequestIds = list;
            this.emitChange();
        }
    },

    hasCompletedRequest(requestId) {
        if (!requestId) return false;
        const list = Array.isArray(this.data.completedRequestIds) ? this.data.completedRequestIds : [];
        return list.includes(requestId);
    }
};

PlayerData.data = PlayerData._createDefaultData();
PlayerData.load();
PlayerData.init();
// Toss Native Storage가 주입된 경우, 네이티브 저장소에서 추가 로드 시도
try {
    if (typeof PlayerData.loadFromNative === 'function') {
        PlayerData.loadFromNative();
    }
} catch (_) {}
