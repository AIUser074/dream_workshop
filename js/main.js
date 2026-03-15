const Game = {
    // playerData 객체 제거
    currentRequest: '', // 현재 요청 텍스트 저장
    currentNpcId: 'thomas', // 현재 손님 NPC (추후 교체 가능)
    currentCustomer: null, // 현재 공방 방문 손님 ID
    nextReservedCustomer: null, // 다음 방문 예약 손님 ID (UI 표시용)
    nextReserved: null, // { npcId, questId, requestId }
    activeQuest: null, // 현재 진행 중인 의뢰 객체
    _visitorTimerId: null,
    activeAdhocRequest: null, // 랜덤 방문 시 환영 세트에 따른 임시 요청
    activeConsumables: {},
    _dismissedQuestIds: new Set(),
    _currentQuestBoardIds: [],
    _pendingRandomRequestFilterContext: null,
    _questByIdCache: null,
    _questsByRequestIdCache: null,
    _dialogueWasTyping: false, // 대화 타이핑 중 일시정지 여부 플래그
    _lastFocusTriggered: false,
    _mysticTimerActive: false,

    init() {
        this.preventBrowserDefaults();
        this.loadSettings();

        // 부트로더 표시 및 에셋 프리로딩
        this.showBootLoader();
        this.backgroundEl = document.getElementById('game-background');

        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', this.startGame.bind(this));
        }
        NPCManager.init();
        DialogueManager.init(NPCManager);
        
        // 타이머 초기화 추가
        TimerManager.init();

        // PlayerData 변경 시 UI 업데이트하도록 리스너 등록
        PlayerData.onChange(this.updateStatusUI.bind(this));
        
        // 게임 시작 시 초기 UI 상태를 즉시 반영
        this.updateStatusUI(PlayerData.data);

        // PlayerData에서 보드/예약/현재 NPC 상태 복원
        try {
            const storedBoardIds = PlayerData.get('questBoardIds');
            if (Array.isArray(storedBoardIds) && storedBoardIds.length) {
                this._currentQuestBoardIds = storedBoardIds.slice();
            }
            const storedNextReserved = PlayerData.get('nextReserved');
            const storedNextReservedCustomer = PlayerData.get('nextReservedCustomer');
            if (storedNextReserved && typeof storedNextReserved === 'object' && storedNextReserved.npcId) {
                this.nextReserved = { ...storedNextReserved };
            }
            if (typeof storedNextReservedCustomer === 'string' && storedNextReservedCustomer) {
                this.nextReservedCustomer = storedNextReservedCustomer;
            }
            const storedCurrentNpcId = PlayerData.get('currentNpcId');
            if (typeof storedCurrentNpcId === 'string' && storedCurrentNpcId) {
                this.currentNpcId = storedCurrentNpcId;
            }
        } catch {}

        // 초기 화면 상태 및 배경 설정
        const titleScreenContainer = document.getElementById('game-container');
        const titleScreen = document.querySelector('.title-screen');
        if (titleScreen) titleScreen.classList.remove('fade-out');
        this.updateBackground(titleScreenContainer); // titleScreen 대신 game-container의 배경을 사용

        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active-screen', 'exit-left');
        });
        
        this.adjustFontSize();
        window.addEventListener('resize', this.adjustFontSize);

        // 핵심 리소스 프리로드 후 로더 종료
        this.preloadCoreAssets().then(() => this.hideBootLoader());

        // 커스텀 이벤트 리스너 등록
        document.addEventListener('drawing:finished', this.showResult.bind(this));
        this._handleCanvasClearBound = this.handleCanvasClear.bind(this);
        document.addEventListener('canvas:clear', this._handleCanvasClearBound);
        document.addEventListener('player:levelUp', (event) => this.handleLevelUpToast(event?.detail));

        // 설정 패널 이벤트 바인딩
        const settingsBtn = document.querySelector('.settings-button');
        if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettings());
        const overlay = document.getElementById('settings-overlay');
        // 오버레이 클릭 시 닫기 비활성화 (주석 처리)
        // if (overlay) overlay.addEventListener('click', (e) => {
        //     if (e.target === overlay) this.closeSettings();
        // });
        const closeBtn = document.getElementById('settings-close');
        if (closeBtn) closeBtn.addEventListener('click', () => this.closeSettings());
        const resetBtn = document.getElementById('btn-reset-game');
        if (resetBtn) resetBtn.addEventListener('click', () => this.promptGameReset());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // 열려있는 모달을 닫기 (우선순위: 상세정보 > 작품상세 > 의뢰상세 > 앨범 > 의뢰 > 상점 > 강화 > 출석 > 설정)
                const detailModalOverlay = document.getElementById('detail-modal-overlay');
                const logDetailOverlay = document.getElementById('log-detail-overlay');
                const questDetailOverlay = document.getElementById('quest-detail-overlay');
                const albumOverlay = document.getElementById('album-overlay');
                const questOverlay = document.getElementById('quest-overlay');
                const shopOverlay = document.getElementById('shop-overlay');
                const upgradeOverlay = document.getElementById('upgrade-overlay');
                const attendanceOverlay = document.getElementById('attendance-overlay');
                const settingsOverlay = document.getElementById('settings-overlay');
                if (detailModalOverlay && !detailModalOverlay.classList.contains('hidden')) {
                    this.closeDetailModal();
                } else if (logDetailOverlay && !logDetailOverlay.classList.contains('hidden')) {
                    this.closeLogDetail();
                } else if (questDetailOverlay && !questDetailOverlay.classList.contains('hidden')) {
                    this.closeQuestDetail();
                } else if (albumOverlay && !albumOverlay.classList.contains('hidden')) {
                    this.closeAlbum();
                } else if (questOverlay && !questOverlay.classList.contains('hidden')) {
                    this.closeQuest();
                } else if (shopOverlay && !shopOverlay.classList.contains('hidden')) {
                    this.closeShop();
                } else if (upgradeOverlay && !upgradeOverlay.classList.contains('hidden')) {
                    this.closeUpgrade();
                } else if (attendanceOverlay && !attendanceOverlay.classList.contains('hidden')) {
                    this.closeAttendance();
                } else if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
                    this.closeSettings();
                }
            }
        });

        // 슬라이더 초기화 및 라벨 동기화
        this.initSettingsSliders();

        const fameBadge = document.querySelector('.fame-badge');
        if (fameBadge) {
            fameBadge.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleReputationTooltip();
            });
        }
        document.addEventListener('click', (event) => {
            const tooltip = document.getElementById('reputation-tooltip');
            if (!tooltip || tooltip.classList.contains('hidden')) return;
            if (!event.target.closest('.fame-badge') && !tooltip.contains(event.target)) {
                this.hideReputationTooltip();
            }
        });

        if (window.AudioManager) {
            const bgmVol = typeof this.settings?.bgm === 'number' ? this.settings.bgm : 70;
            const sfxVol = typeof this.settings?.sfx === 'number' ? this.settings.sfx : 70;
            AudioManager.init({
                bgmVolume: bgmVol / 100,
                sfxVolume: sfxVol / 100,
            });
        }

        // 자동 손님 방문 스케줄 시작
        this.scheduleNextVisitor();

        // 강화 패널 이벤트 바인딩
        const upgradeBtn = document.getElementById('btn-upgrade');
        if (upgradeBtn) upgradeBtn.addEventListener('click', () => this.openUpgrade());
        const upgradeCloseBtn = document.getElementById('upgrade-close');
        if (upgradeCloseBtn) upgradeCloseBtn.addEventListener('click', () => this.closeUpgrade());

        // 강화 버튼 이벤트 위임
        const upgradeOverlay = document.getElementById('upgrade-overlay');
        if (upgradeOverlay) {
            upgradeOverlay.addEventListener('click', (e) => {
                const upgradeBtn = e.target.closest('.upgrade-btn');
                if (!upgradeBtn || upgradeBtn.disabled) return;

                const skillCard = upgradeBtn.closest('.skill-card');
                if (skillCard && skillCard.dataset.skillId) {
                    this.upgradeSkill(skillCard.dataset.skillId);
                }
            });
        }

        // 상점 패널 이벤트 바인딩
        const shopBtn = document.getElementById('btn-shop');
        if (shopBtn) shopBtn.addEventListener('click', () => this.openShop());
        const shopCloseBtn = document.getElementById('shop-close');
        if (shopCloseBtn) shopCloseBtn.addEventListener('click', () => this.closeShop());

        // 의뢰 패널 이벤트 바인딩
        const questBtn = document.getElementById('btn-quest');
        if (questBtn) questBtn.addEventListener('click', () => this.openQuest());
        const questCloseBtn = document.querySelector('.quest-close');
        if (questCloseBtn) questCloseBtn.addEventListener('click', () => this.closeQuest());

        // 의뢰 상세 정보(편지) UI 닫기 버튼 이벤트 바인딩
        const questDetailCloseBtn = document.getElementById('quest-detail-close');
        if (questDetailCloseBtn) questDetailCloseBtn.addEventListener('click', () => this.closeQuestDetail());

        // 편지지 바깥 영역 클릭 시 닫기
        const questDetailOverlay = document.getElementById('quest-detail-overlay');
        if (questDetailOverlay) {
            questDetailOverlay.addEventListener('click', (e) => {
                if (e.target === questDetailOverlay) {
                    this.closeQuestDetail();
                }
            });
        }

        // 기록(앨범) 패널 이벤트 바인딩
        const albumBtn = document.getElementById('btn-log');
        if (albumBtn) albumBtn.addEventListener('click', () => this.openAlbum());
        const albumCloseBtn = document.getElementById('album-close');
        if (albumCloseBtn) albumCloseBtn.addEventListener('click', () => this.closeAlbum());

        // 앨범 바깥 영역 클릭 시 닫기
        const albumOverlay = document.getElementById('album-overlay');
        if (albumOverlay) {
            albumOverlay.addEventListener('click', (e) => {
                if (e.target === albumOverlay) {
                    this.closeAlbum();
                }
            });
        }

        // 작품 상세 정보 팝업 이벤트 바인딩
        const logDetailCloseBtn = document.getElementById('log-detail-close');
        if (logDetailCloseBtn) logDetailCloseBtn.addEventListener('click', () => this.closeLogDetail());

        // 작품 상세 정보 바깥 영역 클릭 시 닫기
        const logDetailOverlay = document.getElementById('log-detail-overlay');
        if (logDetailOverlay) {
            logDetailOverlay.addEventListener('click', (e) => {
                if (e.target === logDetailOverlay) {
                    this.closeLogDetail();
                }
            });
        }

        // 출석체크 UI 이벤트 바인딩
        const attendanceIconBtn = document.querySelector('.attendance-icon-button');
        if (attendanceIconBtn) attendanceIconBtn.addEventListener('click', () => this.openAttendance());
        const attendanceCloseBtn = document.getElementById('attendance-close');
        if (attendanceCloseBtn) attendanceCloseBtn.addEventListener('click', () => this.closeAttendance());
        const attendanceClaimBtn = document.getElementById('attendance-claim-btn');
        if (attendanceClaimBtn) attendanceClaimBtn.addEventListener('click', () => this.claimAttendance());

        // 출석체크 바깥 영역 클릭 시 닫기
        const attendanceOverlay = document.getElementById('attendance-overlay');
        if (attendanceOverlay) {
            attendanceOverlay.addEventListener('click', (e) => {
                if (e.target === attendanceOverlay) {
                    this.closeAttendance();
                }
            });
        }

        // 상세 정보 모달 이벤트 바인딩
        const detailModalCloseBtn = document.getElementById('detail-modal-close');
        if (detailModalCloseBtn) detailModalCloseBtn.addEventListener('click', () => this.closeDetailModal());

        const detailModalOverlay = document.getElementById('detail-modal-overlay');
        if (detailModalOverlay) {
            detailModalOverlay.addEventListener('click', (e) => {
                if (detailModalOverlay.dataset.preventClose === 'true') return;
                if (e.target === detailModalOverlay) {
                    this.closeDetailModal();
                }
            });
        }

        // 강화/상점 카드 클릭 이벤트 위임 (상세 모달 열기)
        const upgradeBody = document.querySelector('.upgrade-body');
        if (upgradeBody) {
            upgradeBody.addEventListener('click', (e) => {
                const skillCard = e.target.closest('.skill-card');
                if (skillCard && skillCard.dataset.skillId) {
                    // 강화 버튼 클릭이 아닌 경우에만 모달 열기
                    if (!e.target.closest('.upgrade-btn')) {
                        this.openDetailModal('skill', skillCard.dataset.skillId);
                    }
                }
            });
        }

        const shopBody = document.querySelector('.shop-body');
        if (shopBody) {
            shopBody.addEventListener('click', (e) => {
                const itemCard = e.target.closest('.shop-item-card');
                if (itemCard && itemCard.dataset.itemId) {
                     // 구매 버튼 클릭이 아닌 경우에만 모달 열기
                    if (!e.target.closest('.shop-buy-btn')) {
                        const category = itemCard.closest('.shop-tab-content').dataset.tabContent;
                        this.openDetailModal('item', { category, itemId: itemCard.dataset.itemId });
                    }
                }
            });
        }
    },
    // 진행 중인 스토리 라인에 포함된 NPC id 집합
    getActiveStoryNpcIds() {
        const result = new Set();
        try {
            const sl = window.storylines || {};
            const sp = PlayerData.get('storyProgress') || {};
            const allQuests = questData || [];
            Object.keys(sl).forEach(arcKey => {
                const steps = Array.isArray(sl[arcKey]?.steps) ? sl[arcKey].steps : [];
                const progress = sp[arcKey] || 0;
                if (progress < steps.length) {
                    const nextStep = steps[progress];
                    if (nextStep && nextStep.questId) {
                        const q = allQuests.find(x => x.id === nextStep.questId);
                        if (q && q.npcId) result.add(q.npcId);
                    }
                }
            });
        } catch {}
        return result;
    },

    // 스토리 결과 기반 환영 대사 선택기
    getWelcomeLinesForRequest(npcId, requestId) {
        try {
            const npc = (window.npcData || {})[npcId];
            if (!npc) return null;
            const dialogues = npc.dialogues || {};
            const setsByReq = (dialogues.welcomeByRequestSets || {})[requestId];
            // 조건부 세트가 있으면 우선 평가
            if (Array.isArray(setsByReq) && setsByReq.length) {
                const outcomeMap = PlayerData.get('storyOutcomes') || {};
                for (const set of setsByReq) {
                    const when = set.when || {};
                    let match = true;
                    if (when.prevQuestId) {
                        const prev = outcomeMap[when.prevQuestId];
                        const allow = Array.isArray(when.outcomeIn) ? when.outcomeIn : [];
                        if (allow.length && !allow.includes(prev)) match = false;
                    }
                    if (match) {
                        const lines = set.lines;
                        if (Array.isArray(lines) && lines.length) return lines;
                    }
                }
            }
            // 기본 환영 대사로 폴백
            const base = dialogues.welcomeByRequest && dialogues.welcomeByRequest[requestId];
            return (Array.isArray(base) && base.length) ? base : null;
        } catch {
            return null;
        }
    },

    // 보상-only 방문(에필로그 등) 데이터 선택기
    getRewardVisitForEvent(npcId, visitId) {
        try {
            const npc = (window.npcData || {})[npcId];
            if (!npc) return null;
            const dialogues = npc.dialogues || {};
            const sets = (dialogues.rewardVisitSets || {})[visitId];
            if (Array.isArray(sets) && sets.length) {
                const outcomeMap = PlayerData.get('storyOutcomes') || {};
                for (const set of sets) {
                    const when = set.when || {};
                    let match = true;
                    if (when.prevQuestId) {
                        const prev = outcomeMap[when.prevQuestId];
                        const allow = Array.isArray(when.outcomeIn) ? when.outcomeIn : [];
                        if (allow.length && !allow.includes(prev)) match = false;
                    }
                    if (match) {
                        const lines = Array.isArray(set.lines) ? set.lines : [];
                        const reward = set.reward || {};
                        return { lines, reward };
                    }
                }
            }
            return null;
        } catch {
            return null;
        }
    },

    // 보상-only 방문 소환 및 처리
    spawnRewardVisit(npcId, visitId) {
        const data = this.getRewardVisitForEvent(npcId, visitId);
        const lines = data && Array.isArray(data.lines) ? data.lines : null;
        const reward = (data && data.reward) || {};
        const spawned = NPCManager.spawnNPC(npcId);
        if (!spawned) { this.scheduleNextVisitor(); return; }
        this.currentCustomer = npcId;
        this.currentNpcId = npcId;
        try {
            PlayerData.set('currentNpcId', npcId);
        } catch {}
        NPCManager.showNPC(npcId);
        const afterWelcome = () => {
            try {
                // 에필로그 완료 안내
                if (visitId === 'LEO_ARC_EPILOGUE') {
                    this.showNotification('스토리 완료: 레오의 고백');
                }
                else if (visitId === 'PRESS_ARC_EPILOGUE') {
                    this.showNotification('스토리 완료: 특종! 불씨 전쟁');
                }
                else if (visitId === 'PIE_ARC_EPILOGUE') {
                    this.showNotification('스토리 완료: 진짜 파이 도둑을 찾아라!');
                }
                const gold = Number(reward.gold || 0);
                const xp = Number(reward.xp || 0);
                const rep = Number(reward.reputation || 0);
                // 리워드 풍선으로 지급
                this.showRewardEffect(gold, rep, xp, null, () => {
                    // 지급 완료 후 세션 종료
                    this.finishCustomerSession();
                });
            } catch {
                this.finishCustomerSession();
            }
        };
        if (lines && lines.length) {
            DialogueManager.startDialogue(npcId, 'welcome', lines, afterWelcome);
        } else {
            DialogueManager.startDialogue(npcId, 'welcome', afterWelcome);
        }
    },

    // ===== 간단 확인 모달 =====
    openConfirm(message, onConfirm, { confirmLabel = '확인', cancelLabel = '취소' } = {}) {
        const overlay = document.getElementById('detail-modal-overlay');
        const contentEl = document.getElementById('detail-modal-content');
        if (!overlay || !contentEl) return;
        contentEl.innerHTML = `
            <div style="text-align:center">
                <p style="font-family:'Amsterdam','GeumEunBoHwa',cursive;font-weight:700;color:#5a3d2f;white-space:pre-wrap;">${message}</p>
                <div class="detail-modal-action confirm-actions" style="display:flex;justify-content:center">
                    <button class="shop-buy-btn btn-positive" id="confirm-yes">${confirmLabel}</button>
                    <button class="upgrade-btn btn-negative" id="confirm-no">${cancelLabel}</button>
                </div>
            </div>`;
        overlay.classList.remove('hidden');
        const yes = document.getElementById('confirm-yes');
        const no = document.getElementById('confirm-no');
        const cleanup = () => this.closeDetailModal();
        if (yes) yes.onclick = () => {
            cleanup();
            try {
                if (onConfirm) onConfirm();
            } catch (e) {
                console.error(e);
            }
        };
        if (no) no.onclick = cleanup;
    },

    promptGameReset() {
        if (this._resetInProgress) return;
        this.openConfirm(
            '게임 데이터를 초기화하시겠습니까?\n레벨, 골드, 스토리 진행 등이 모두 삭제됩니다.',
            () => {
                this.openConfirm(
                    '정말로 초기화를 진행할까요?\n이 작업은 되돌릴 수 없습니다.',
                    () => this.performGameReset(),
                    { confirmLabel: '초기화', cancelLabel: '취소' }
                );
            },
            { confirmLabel: '확인', cancelLabel: '취소' }
        );
    },

    async performGameReset() {
        if (this._resetInProgress) return;
        this._resetInProgress = true;
        try {
            if (typeof PlayerData.resetAsync === 'function') {
                await PlayerData.resetAsync();
            } else {
                PlayerData.reset();
            }
        } catch (e) {
            console.warn('PlayerData reset failed', e);
        }

        try {
            if (window.AudioManager && typeof AudioManager.stopBgm === 'function') {
                AudioManager.stopBgm();
            }
        } catch {}

        if (typeof window !== 'undefined' && window.location) {
            // 약간의 지연 후 페이지 전체를 새로 고쳐 초기 로딩부터 다시 진행
            setTimeout(() => {
                try {
                    window.location.reload();
                } catch (err) {
                    console.warn('window.location.reload failed', err);
                }
            }, 500);
            return;
        }

        if (this._visitorTimerId) {
            clearTimeout(this._visitorTimerId);
            this._visitorTimerId = null;
        }

        try {
            const npcIds = Object.keys(NPCManager.npcs || {});
            npcIds.forEach(id => NPCManager.dismissNPC(id));
        } catch {}

        const closeSafely = (fnName) => {
            try {
                if (typeof this[fnName] === 'function') this[fnName]();
            } catch {}
        };
        ['closeSettings', 'closeShop', 'closeUpgrade', 'closeQuest', 'closeQuestDetail', 'closeLogDetail', 'closeAlbum', 'closeAttendance', 'closeDetailModal'].forEach(closeSafely);

        this.currentCustomer = null;
        this.currentNpcId = 'thomas';
        this.currentRequest = '';
        this.activeQuest = null;
        this.activeAdhocRequest = null;
        this.activeConsumables = {};
        this.nextReserved = null;
        this.nextReservedCustomer = null;
        this._dismissedQuestIds = new Set();
        this._currentQuestBoardIds = [];
        this._pendingRandomRequestFilterContext = null;
        this._lastSpawnWasStory = false;
        this._armedSolveAfterReserved = false;

        this.updateStatusUI(PlayerData.data);
        this.returnToTitleScreen();

        // 시작 버튼이 다시 눌릴 때까지 방문 스케줄 정지
        this._resetInProgress = false;
    },

    returnToTitleScreen() {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active-screen', 'exit-left', 'exit-right', 'fade-out');
        });
        const drawing = document.getElementById('drawing-mode-container');
        if (drawing) {
            drawing.classList.remove('active-screen', 'exit-left', 'exit-right');
        }
        const title = document.querySelector('.title-screen');
        if (title) {
            title.classList.remove('fade-out');
            title.classList.add('active-screen');
        }
        const main = document.getElementById('main-container');
        if (main) {
            main.classList.remove('active-screen', 'exit-left', 'exit-right');
        }
        if (window.AudioManager && typeof AudioManager.stopBgm === 'function') {
            try { AudioManager.stopBgm(); } catch {}
        }
    },

    // ===== 자동 방문 스케줄링 =====
    scheduleNextVisitor() {
        if (this._visitorTimerId) {
            clearTimeout(this._visitorTimerId);
            this._visitorTimerId = null;
        }
        // 일시정지 중에는 방문 스케줄을 보류
        if (this.settings && this.settings.paused) {
            this._visitorTimerId = setTimeout(() => this.scheduleNextVisitor(), 3000);
            return;
        }
        const main = document.getElementById('main-container');
        const isMainActive = main && main.classList.contains('active-screen');
        if (!isMainActive) {
            this._visitorTimerId = setTimeout(() => this.scheduleNextVisitor(), 3000);
            return;
        }
        if (this.currentCustomer) {
            this._visitorTimerId = setTimeout(() => this.scheduleNextVisitor(), 5000);
            return;
        }
        const delay = 3000; // 3초
        this._visitorTimerId = setTimeout(() => this.trySpawnVisitor(), delay);
    },

    trySpawnVisitor() {
        if (this.settings && this.settings.paused) { this.scheduleNextVisitor(); return; }
        const main = document.getElementById('main-container');
        const isMainActive = main && main.classList.contains('active-screen');
        if (!isMainActive || this.currentCustomer) { this.scheduleNextVisitor(); return; }
        // 보상-only 방문(에필로그 등) 우선 처리
        try {
            const pending = PlayerData.get('pendingRewardVisits') || [];
            if (pending.length > 0) {
                const ev = pending.shift();
                PlayerData.set('pendingRewardVisits', pending);
                this._lastSpawnWasStory = false;
                this.spawnRewardVisit(ev.npcId, ev.visitId);
                // spawnRewardVisit 내부에서 종료 후 스케줄 호출
                return;
            }
            // 스토리 에필로그 조건 충족 시 즉시 스폰
            const ep = PlayerData.get('epiloguePending') || {};
            const slAll = window.storylines || {};
            const afterRandom = PlayerData.get('randomSinceLastStory') || 0;
            const targets = PlayerData.get('storyRandomTarget') || {};
            for (const arcKey of Object.keys(ep)) {
                if (!ep[arcKey]) continue;
                const sl = slAll[arcKey];
                if (!sl || !sl.epilogue) continue;
                const target = typeof targets[arcKey] === 'number' ? targets[arcKey] : 0;
                if (afterRandom >= target) {
                    ep[arcKey] = false;
                    PlayerData.set('epiloguePending', ep);
                    this._lastSpawnWasStory = false;
                    this.spawnRewardVisit(sl.epilogue.npcId, sl.epilogue.visitId);
                    return;
                }
            }
        } catch {}
        let npcId;
        let welcomeLines = null;
        // 스토리 우선 소환 체크
        const storyQuest = this.getEligibleStoryQuest && this.getEligibleStoryQuest();
        if (this.nextReserved && this.nextReserved.npcId) {
            npcId = this.nextReserved.npcId;
            // 예약된 의뢰 활성화
            const reservedQuest = (questData || []).find(q => q.id === this.nextReserved.questId);
            this.activeQuest = reservedQuest || null;
            // 메인 튜토리얼에서 예약된 의뢰를 소화하면 이후 solve 튜토리얼을 진행할 수 있도록 암시적 플래그 가동
            this._armedSolveAfterReserved = true;
            // 퀘스트별 환영 대사 매핑
            try {
                welcomeLines = this.getWelcomeLinesForRequest(npcId, this.nextReserved.requestId);
            } catch {}
            // 예약자 호출: 해당 NPC의 의뢰 카드를 제거
            this.removeQuestsByNpc(npcId);
            this.renderQuestPanel();
            this.nextReservedCustomer = null;
            this.nextReserved = null;
            try {
                PlayerData.set('nextReserved', null);
                PlayerData.set('nextReservedCustomer', null);
            } catch {}
            this._lastSpawnWasStory = !!(this.activeQuest && this.activeQuest.story);
        } else if (storyQuest) {
            // 스토리 슬롯: 다음 방문은 무조건 스토리 NPC
            npcId = storyQuest.npcId;
            this.activeQuest = storyQuest;
            // 스토리 환영 대사(있으면) 매핑
            try {
                welcomeLines = this.getWelcomeLinesForRequest(npcId, storyQuest.requestId);
            } catch {}
            this._lastSpawnWasStory = true;
        } else {
            // 랜덤 방문: 진행 중인 스토리 라인에 속한 NPC들과 토마스는 제외
            const excludeSet = this.getActiveStoryNpcIds ? this.getActiveStoryNpcIds() : new Set();
            excludeSet.add('thomas');
            const requestFilterContext = this._buildRequestFilterContext();
            const recent = (PlayerData.get('recentCustomers') || []).slice(-3);
            const allNonStory = Object.keys(npcData || {}).filter(id => !excludeSet.has(id));
            let ids = allNonStory
                .filter(id => !recent.includes(id))
                .filter(id => this._npcHasAvailableRequests(id, requestFilterContext));
            if (ids.length === 0) {
                // 최근 제외 시 풀이 비면 완화: 최근 제외 해제 (단, 의뢰 가능 NPC만)
                ids = allNonStory.filter(id => this._npcHasAvailableRequests(id, requestFilterContext));
            }
            npcId = ids.length ? ids[Math.floor(Math.random() * ids.length)] : null;
            if (!npcId) { this.scheduleNextVisitor(); return; }
            this.activeQuest = null; // 자유 방문
            // 랜덤 방문 시에는 solve 튜토리얼 대기 상태를 해제
            this._armedSolveAfterReserved = false;
            // 환영 세트/요청 세트에서 랜덤 선택
            try {
                const npc = npcData[npcId];
                const sets = npc?.dialogues?.welcomeSets;
                if (Array.isArray(sets) && sets.length) {
                    const sel = sets[Math.floor(Math.random() * sets.length)];
                    welcomeLines = sel.lines;
                    const reqs = Array.isArray(sel.requests) ? sel.requests : [];
                    const filteredReqs = this._filterRequestsForRandom(reqs, requestFilterContext);
                    const pool = filteredReqs.length ? filteredReqs : [];
                    const picked = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
                    if (picked) {
                        if (typeof picked === 'object') {
                            const reqId = picked.id || null;
                            const reqText = picked.text || '';
                            const reqDifficulty = reqId ? this.getDifficultyForRequest(reqId) : (picked.difficulty || 1);
                            this.activeAdhocRequest = {
                                npcId,
                                welcomeSetId: sel.id,
                                requestId: reqId,
                                requestText: reqText,
                                difficulty: reqDifficulty
                            };
                        } else {
                            this.activeAdhocRequest = { npcId, welcomeSetId: sel.id, requestText: picked, difficulty: 1 };
                        }
                    } else {
                        this.activeAdhocRequest = null;
                    }
                } else {
                    this.activeAdhocRequest = null;
                }
            } catch {
                this.activeAdhocRequest = null;
            }
            this._lastSpawnWasStory = false;
            this._pendingRandomRequestFilterContext = requestFilterContext;
        }
        // 의뢰/의뢰 상세 오버레이가 열려있다면 닫기
        try { this.closeQuestDetail(); } catch {}
        try { this.closeQuest(); } catch {}
        this.spawnVisitor(npcId, welcomeLines);
        this.scheduleNextVisitor();
    },

    spawnVisitor(npcId, welcomeLines = null) {
        const spawned = NPCManager.spawnNPC(npcId);
        if (spawned) {
            this.currentCustomer = npcId;
            this.currentNpcId = npcId;
            try {
                PlayerData.set('currentNpcId', npcId);
            } catch {}
            NPCManager.showNPC(npcId);

            // 랜덤 방문의 경우: 의뢰 ID에 맞는 welcomeByRequest 대사를 우선적으로 사용
            try {
                const pendingFilterContext = this._pendingRandomRequestFilterContext;
                this._pendingRandomRequestFilterContext = null;
                // 스토리/예약 방문은 이미 적절한 welcomeLines가 전달되므로 건드리지 않는다.
                if (!this.activeQuest) {
                    // 아직 선택된 임시 의뢰가 없다면, NPC의 requests에서 하나 선택
                    if (!this.activeAdhocRequest) {
                        const npc = (typeof npcData !== 'undefined') ? npcData[npcId] : null;
                        const reqs = npc && Array.isArray(npc.requests) ? npc.requests : [];
                        if (reqs.length) {
                            const filteredReqs = this._filterRequestsForRandom(reqs, pendingFilterContext);
                            const pool = filteredReqs.length ? filteredReqs : reqs;
                            const picked = pool[Math.floor(Math.random() * pool.length)];
                            if (picked && typeof picked === 'object') {
                                const reqId = picked.id || null;
                                const reqText = picked.text || '자유 주제';
                                const reqDifficulty = reqId ? this.getDifficultyForRequest(reqId) : (picked.difficulty || 1);
                                this.activeAdhocRequest = { npcId, requestId: reqId, requestText: reqText, difficulty: reqDifficulty };
                            } else {
                                const reqText = picked || '자유 주제';
                                this.activeAdhocRequest = { npcId, requestId: null, requestText: reqText, difficulty: 1 };
                            }
                        }
                    }
                    // 의뢰 ID에 대응하는 환영 대사가 있다면 사용
                    if (!welcomeLines && this.activeAdhocRequest && this.activeAdhocRequest.requestId && typeof this.getWelcomeLinesForRequest === 'function') {
                        const lines = this.getWelcomeLinesForRequest(npcId, this.activeAdhocRequest.requestId);
                        if (Array.isArray(lines) && lines.length) {
                            welcomeLines = lines;
                        }
                    }
                }
            } catch {}

            this.persistCurrentRequestMeta();

            const afterWelcome = () => {
                try {
                    if (this.activeQuest && this.activeQuest.theme) {
                        this.currentRequest = this.activeQuest.theme;
                    } else if (this.activeAdhocRequest && this.activeAdhocRequest.requestText) {
                        this.currentRequest = this.activeAdhocRequest.requestText;
                    } else {
                        const npc = (typeof npcData !== 'undefined') ? npcData[npcId] : null;
                        const reqs = npc && Array.isArray(npc.requests) ? npc.requests : [];
                        if (reqs.length) {
                            const filteredReqs = this._filterRequestsForRandom(reqs, pendingFilterContext);
                            const pool = filteredReqs.length ? filteredReqs : reqs;
                            const picked = pool[Math.floor(Math.random() * pool.length)];
                            if (picked && typeof picked === 'object') {
                                this.currentRequest = picked.text || '자유 주제';
                                const reqId = picked.id || null;
                                const reqDifficulty = reqId ? this.getDifficultyForRequest(reqId) : (picked.difficulty || 1);
                                this.activeAdhocRequest = { npcId, requestId: reqId, requestText: this.currentRequest, difficulty: reqDifficulty };
                            } else {
                                this.currentRequest = picked || '자유 주제';
                            }
                        } else {
                            // 스토리 NPC가 비스토리 경로로 들어온 경우 '자유 주제' 방지
                            const storyNpcIds = this.getActiveStoryNpcIds ? this.getActiveStoryNpcIds() : new Set();
                            if (storyNpcIds.has(npcId) && typeof this.getEligibleStoryQuest === 'function') {
                                const sq = this.getEligibleStoryQuest();
                                if (sq && sq.npcId === npcId) {
                                    this.activeQuest = sq;
                                    this.currentRequest = sq.theme;
                                } else {
                                    // 방어적 기본값: 스토리 진행 대기 메시지
                                    this.currentRequest = `${npcData[npcId]?.name || npcId}의 스토리 진행 중`;
                                }
                            } else {
                                this.currentRequest = '자유 주제';
                    }
                        }
                    }

                    // afterWelcome에서도 한 번 더 저장 (요청 텍스트가 바뀐 경우 대비)
                    this.persistCurrentRequestMeta();
                } catch {}
                // 대화 종료 후 드로잉 화면으로 전환
                this.changeScreen('#main-container', '#drawing-mode-container', 'slide');
            };
            if (welcomeLines && Array.isArray(welcomeLines)) {
                DialogueManager.startDialogue(npcId, 'welcome', welcomeLines, afterWelcome);
            } else {
                DialogueManager.startDialogue(npcId, 'welcome', afterWelcome);
            }
        }
    },

    persistCurrentRequestMeta() {
        try {
            let questId = null;
            let requestId = null;
            if (this.activeQuest) {
                questId = this.activeQuest.id || null;
                requestId = this.activeQuest.requestId || null;
            } else if (this.activeAdhocRequest) {
                requestId = this.activeAdhocRequest.requestId || null;
            }
            PlayerData.set('currentQuestId', questId);
            PlayerData.set('currentRequestId', requestId);
        } catch {}
    },

    finishCustomerSession() {
        const npcId = this.currentCustomer;
        if (!npcId) { this.scheduleNextVisitor(); return; }
        NPCManager.dismissNPC(npcId, () => {
            this.currentCustomer = null;
            try {
                PlayerData.set('currentNpcId', null);
                PlayerData.set('currentQuestId', null);
                PlayerData.set('currentRequestId', null);
            } catch {}
            this.activeQuest = null;
            this.activeAdhocRequest = null;
            // 최근 방문 갱신 (중복 방지 큐는 최신 3개 유지)
            try {
                const q = PlayerData.get('recentCustomers') || [];
                q.push(npcId);
                while (q.length > 3) q.shift();
                PlayerData.set('recentCustomers', q);
            } catch {}
            // 랜덤 방문 카운트 관리
            try {
                if (this._lastSpawnWasStory) {
                    PlayerData.set('randomSinceLastStory', 0);
                } else {
                    const n = (PlayerData.get('randomSinceLastStory') || 0) + 1;
                    PlayerData.set('randomSinceLastStory', n);
                }
            } catch {}
            // 메인 UI 튜토리얼 이후 예약 의뢰 완료 시 solve 튜토리얼 예약이 있다면 즉시 트리거
            try {
                if (PlayerData.get('pendingSolveTutorial') && this._armedSolveAfterReserved) {
                    PlayerData.set('pendingSolveTutorial', false);
                    this._armedSolveAfterReserved = false;
                    // 토마스 문제 해결 튜토리얼로 전환
                    if (typeof this.triggerThomasSolveTutorial === 'function') {
                        this.triggerThomasSolveTutorial();
                        return; // 즉시 트리거했으므로 다음 방문 스케줄 보류
                    }
                }
            } catch {}
            this.scheduleNextVisitor();
        });
    },
    // 다음 스토리 의뢰 자격 검사: 모든 스토리라인에서 자격 충족하는 '다음 스텝'을 찾아 반환
    getEligibleStoryQuest() {
        try {
            const level = PlayerData.get('level') || 1;
            const afterRandom = PlayerData.get('randomSinceLastStory') || 0;
            const slAll = window.storylines || {};
            const epiloguePending = PlayerData.get('epiloguePending') || {};
            const hasPendingEpilogue = Object.values(epiloguePending).some(Boolean);
            if (hasPendingEpilogue) {
                return null;
            }
            const storyProgress = PlayerData.get('storyProgress') || {};
            const targets = PlayerData.get('storyRandomTarget') || {};
            const allQuests = questData || [];
            // 순서는 storylines 선언 순서를 따름
            for (const arcKey of Object.keys(slAll)) {
                const sl = slAll[arcKey];
                const steps = Array.isArray(sl.steps) ? sl.steps : [];
                const progress = storyProgress[arcKey] || 0;
                const step = steps[progress];
                if (!step) continue;
                const q = allQuests.find(x => x.id === step.questId);
                if (!q) continue;
                // 레벨 조건
                if (level < (q.reqLevel || 1)) continue;
                // 랜덤 목표 규칙: 목표가 미설정이면 현재 스텝의 min~max로 초기화
                let target = typeof targets[arcKey] === 'number' ? targets[arcKey] : undefined;
                if (typeof target !== 'number') {
                    const min = typeof step.minRandomBetween === 'number' ? step.minRandomBetween : 0;
                    const max = typeof step.maxRandomBetween === 'number' ? step.maxRandomBetween : min;
                    const initTarget = Math.max(min, Math.min(max, Math.floor(Math.random() * (max - min + 1)) + min));
                    const tNew = { ...(PlayerData.get('storyRandomTarget') || {}), [arcKey]: initTarget };
                    PlayerData.set('storyRandomTarget', tNew);
                    target = initTarget;
                }
                if (afterRandom < target) continue;
                // 선행 퀘스트 완료 체크 (아크 전체가 아닌, 모든 스토리라인의 완료 퀘스트를 전역 집합으로 구성)
                const prereq = Array.isArray(q.prerequisites) ? q.prerequisites : [];
                if (prereq.length > 0) {
                    const completedGlobal = new Set();
                    try {
                        Object.keys(slAll).forEach(k => {
                            const st = Array.isArray(slAll[k]?.steps) ? slAll[k].steps : [];
                            const p = storyProgress[k] || 0;
                            st.slice(0, p).forEach(s => completedGlobal.add(s.questId));
                        });
                    } catch {}
                    let prereqOk = true;
                    for (const pid of prereq) {
                        if (!completedGlobal.has(pid)) { prereqOk = false; break; }
                    }
                    if (!prereqOk) continue;
                }
                return q;
            }
            return null;
        } catch {
            return null;
        }
    },

    _ensureQuestCaches() {
        if (this._questByIdCache && this._questsByRequestIdCache) return;
        this._questByIdCache = {};
        this._questsByRequestIdCache = {};
        const list = Array.isArray(questData) ? questData : [];
        list.forEach(q => {
            if (!q || !q.id) return;
            this._questByIdCache[q.id] = q;
            if (q.requestId) {
                if (!this._questsByRequestIdCache[q.requestId]) {
                    this._questsByRequestIdCache[q.requestId] = [];
                }
                this._questsByRequestIdCache[q.requestId].push(q);
            }
        });
    },

    getQuestById(id) {
        if (!id) return null;
        this._ensureQuestCaches();
        return this._questByIdCache[id] || null;
    },

    getQuestsByRequestId(requestId) {
        if (!requestId) return [];
        this._ensureQuestCaches();
        return this._questsByRequestIdCache[requestId] || [];
    },

    getActiveBoardRequestIds() {
        const active = new Set();
        if (Array.isArray(this._currentQuestBoardIds)) {
            this._currentQuestBoardIds.forEach(id => {
                const quest = this.getQuestById(id);
                if (quest && quest.requestId) {
                    active.add(quest.requestId);
                }
            });
        }
        return active;
    },

    _buildRequestFilterContext() {
        return {
            boardSet: this.getActiveBoardRequestIds(),
            completedQuestIds: new Set(PlayerData.get('completedQuestIds') || []),
            completedRequestIds: new Set(PlayerData.get('completedRequestIds') || [])
        };
    },

    _filterRequestsForRandom(requests = [], context = null) {
        const reqs = Array.isArray(requests) ? requests : [];
        const ctx = context || this._buildRequestFilterContext();
        const boardSet = ctx.boardSet || new Set();
        const completedQuestIds = ctx.completedQuestIds || new Set();
        const completedRequestIds = ctx.completedRequestIds || new Set();
        return reqs.filter(entry => {
            if (!entry) return false;
            if (typeof entry !== 'object') {
                // 문자열 기반 의뢰(자유 주제 등)는 항상 허용
                return true;
            }
            const reqId = entry.id;
            if (!reqId) return true;
            if (boardSet.has(reqId)) return false;
            if (completedRequestIds.has(reqId)) return false;
            const linked = this.getQuestsByRequestId(reqId);
            if (linked && linked.some(q => completedQuestIds.has(q.id))) return false;
            return true;
        });
    },

    _npcHasAvailableRequests(npcId, context = null) {
        const npc = (typeof npcData !== 'undefined') ? npcData[npcId] : null;
        if (!npc) return false;
        if (Array.isArray(npc.requests) && npc.requests.length > 0) {
            const filtered = this._filterRequestsForRandom(npc.requests, context);
            if (filtered.length > 0) return true;
        }
        const sets = npc?.dialogues?.welcomeSets;
        if (Array.isArray(sets)) {
            for (const set of sets) {
                const reqs = Array.isArray(set?.requests) ? set.requests : [];
                if (reqs.length && this._filterRequestsForRandom(reqs, context).length > 0) {
                    return true;
                }
            }
        }
        return false;
    },

    getDifficultyForRequest(requestId) {
        if (!requestId) return 1;
        const questMatch = (questData || []).find(q => q && q.requestId === requestId);
        if (questMatch && typeof questMatch.difficulty === 'number') {
            return questMatch.difficulty;
        }
        let reqDict = null;
        if (typeof window !== 'undefined' && window.REQUEST_DATA) {
            reqDict = window.REQUEST_DATA;
        } else if (typeof REQUEST_DATA !== 'undefined') {
            reqDict = REQUEST_DATA;
        }
        const reqDef = reqDict ? reqDict[requestId] : null;
        if (reqDef && typeof reqDef.difficulty === 'number') {
            return reqDef.difficulty;
        }
        return 1;
    },

    getDifficultyWeight(source = null) {
        const rc = window.rewardConfig || rewardConfig;
        const weights = rc.difficultyWeights || {};
        let difficulty = 1;
        if (source && typeof source === 'object' && typeof source.difficulty === 'number') {
            difficulty = source.difficulty;
        } else if (typeof source === 'number') {
            difficulty = source;
        }
        return weights[difficulty] || 1;
    },

    getDisplayRewardsForQuest(quest) {
        const rc = window.rewardConfig || rewardConfig;
        const weight = this.getDifficultyWeight(quest);
        const gold = Math.round((rc.baseRewards.gold || 0) * weight);
        const rep = Math.round((rc.baseRewards.rep || 0) * weight);
        const xp = Math.round((rc.baseRewards.xp || 0) * weight);
        return { gold, rep, xp };
    },

    removeQuestsByNpc(npcId) {
        try {
            (questData || []).forEach(q => {
                if (q.npcId === npcId) this._dismissedQuestIds.add(q.id);
            });
        } catch {}
    },

    preventBrowserDefaults() {
        // 1. 뒤로가기 방지
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', () => {
            history.pushState(null, '', location.href);
        });

        // 2. 새로고침 단축키 방지 (F5, Ctrl+R, Cmd+R)
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || 
                (e.ctrlKey && e.key === 'r') || 
                (e.metaKey && e.key === 'r')) {
                e.preventDefault();
            }
        });

        // 3. 우클릭 메뉴 방지
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },

    loadSettings() {
        const savedSettings = localStorage.getItem('dream_workshop_settings');
        if (savedSettings) {
            try {
                const settings = JSON.parse(savedSettings);
                this.settings = settings;
            } catch (e) {
                console.warn('Failed to parse settings:', e);
            }
        }
    },

    // === 부트 로더 ===
    showBootLoader() {
        const el = document.getElementById('boot-loader');
        if (!el) return;
        el.classList.remove('hidden');
        el.setAttribute('aria-hidden', 'false');
        // 최소 노출 시간 시작
        this._bootShownAt = performance.now();
        this.updateBootProgress(10);
    },

    hideBootLoader() {
        const el = document.getElementById('boot-loader');
        const gameContainer = document.getElementById('game-container');
        if (!el) return;
        const minDuration = 500; // 최소 0.5초 노출
        const elapsed = performance.now() - (this._bootShownAt || 0);
        const delay = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
            // 게임 컨테이너 표시 시작
            if (gameContainer) {
                gameContainer.classList.add('loaded');
            }
            
            el.classList.add('fade-out');
            el.addEventListener('transitionend', () => {
                el.classList.add('hidden');
                el.setAttribute('aria-hidden', 'true');
                el.classList.remove('fade-out');
            }, { once: true });
        }, delay);
    },

    updateBootProgress(pct) {
        const bar = document.querySelector('.boot-progress-bar');
        if (!bar) return;
        const clamped = Math.max(0, Math.min(100, pct));
        bar.style.width = clamped + '%';
    },

    async preloadCoreAssets() {
        // 자동 생성된 에셋 목록을 사용 (없으면 빈 배열로 fallback)
        const imageAssets = window.ALL_IMAGE_ASSETS || [];
        const audioAssets = window.ALL_AUDIO_ASSETS || [];
        
        // 1. 이미지 프리로딩 프로미스 생성
        const imagePromises = imageAssets.map(src => new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false); // 실패해도 진행은 되도록
            img.src = src;
        }));

        // 2. 폰트 로딩 프로미스 생성 (두 폰트를 명시적으로 로드)
        const fontFaces = [
            new FontFace('Amsterdam', `url(assets/font/나눔손글씨 암스테르담.ttf)`),
            new FontFace('GeumEunBoHwa', `url(assets/font/나눔손글씨 금은보화.ttf)`)
        ];

        const fontPromises = fontFaces.map(ff => ff.load().then(loaded => {
            try { document.fonts.add(loaded); } catch (_) {}
            return true;
        }).catch(err => {
            console.warn('Font load failed:', err);
            return true;
        }));

        // document.fonts.ready도 함께 대기(스타일시트 선언 기반 사용 준비)
        const fontsReady = document.fonts.ready.catch(() => true);

        // 3. 오디오 로딩 (iOS/모바일 이슈로 인해 블로킹 프리로딩 제외)
        // 오디오는 AudioManager에서 지연 로딩(Lazy Loading) 처리함
        const audioPromises = []; 
        
        /* 기존 오디오 프리로딩 로직 주석 처리
        const audioPromises = audioAssets.map(src => new Promise((resolve) => {
            const audio = new Audio();
            const done = () => resolve(true);
            audio.addEventListener('canplaythrough', done, { once: true });
            audio.addEventListener('error', done, { once: true });
            audio.preload = 'auto';
            audio.src = src;
        }));
        */

        // 진행률 업데이트를 위한 로직
        const totalAssets = imageAssets.length + fontPromises.length + audioPromises.length + 1; // 이미지 + 개별 폰트 + 오디오 + fonts.ready
        let loadedCount = 0;
        const updateProgress = () => {
            loadedCount++;
            const progress = 10 + (loadedCount / totalAssets) * 90; // 10%에서 시작
            this.updateBootProgress(progress);
        };

        imagePromises.forEach(p => p.then(updateProgress));
        fontPromises.forEach(p => p.then(updateProgress));
        audioPromises.forEach(p => p.then(updateProgress));
        fontsReady.then(updateProgress);

        // 3. 이미지와 폰트 로딩이 모두 끝날 때까지 기다림
        await Promise.all([...imagePromises, ...fontPromises, ...audioPromises, fontsReady]);

        // 모든 로딩이 완료되면 최종적으로 100%로 설정
        this.updateBootProgress(100);
    },

    // 설정값 보관
    settings: {
        bgm: 70,
        sfx: 70,
        paused: false,
    },

    initSettingsSliders() {
        const bgmRange = document.getElementById('bgm-range');
        const sfxRange = document.getElementById('sfx-range');
        const bgmValue = document.getElementById('bgm-value');
        const sfxValue = document.getElementById('sfx-value');

        // 저장된 값 로드
        try {
            const saved = JSON.parse(localStorage.getItem('settings') || '{}');
            if (typeof saved.bgm === 'number') this.settings.bgm = saved.bgm;
            if (typeof saved.sfx === 'number') this.settings.sfx = saved.sfx;
        } catch {}

        if (bgmRange && bgmValue) {
            bgmRange.value = String(this.settings.bgm);
            bgmValue.textContent = `${this.settings.bgm}%`;
            if (window.AudioManager) {
                bgmRange.addEventListener('pointerdown', () => AudioManager.playSfx('click'));
            }
            bgmRange.addEventListener('input', () => {
                this.settings.bgm = Number(bgmRange.value);
                bgmValue.textContent = `${this.settings.bgm}%`;
                this.persistSettings();
                if (window.AudioManager) {
                    AudioManager.setBgmVolume(this.settings.bgm / 100);
                }
            });
        }
        if (sfxRange && sfxValue) {
            sfxRange.value = String(this.settings.sfx);
            sfxValue.textContent = `${this.settings.sfx}%`;
            if (window.AudioManager) {
                sfxRange.addEventListener('pointerdown', () => AudioManager.playSfx('click'));
            }
            sfxRange.addEventListener('input', () => {
                this.settings.sfx = Number(sfxRange.value);
                sfxValue.textContent = `${this.settings.sfx}%`;
                this.persistSettings();
                if (window.AudioManager) {
                    AudioManager.setSfxVolume(this.settings.sfx / 100);
                }
            });
        }
    },

    persistSettings() {
        try { localStorage.setItem('settings', JSON.stringify({ bgm: this.settings.bgm, sfx: this.settings.sfx })); } catch {}
    },

    openSettings() {
        const overlay = document.getElementById('settings-overlay');
        if (!overlay) return;
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        this.pauseGame();
    },

    closeSettings() {
        const overlay = document.getElementById('settings-overlay');
        if (!overlay) return;
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        this.resumeGame();
    },

    openUpgrade() {
        try { if (!PlayerData.get('tutorialCompleted') && !(typeof TutorialManager !== 'undefined' && TutorialManager.active)) return; } catch {}
        const overlay = document.getElementById('upgrade-overlay');
        if (!overlay) return;

        this.renderUpgradePanel(); // 강화 패널 동적 렌더링
        this.updateUpgradeStatus(); // 상태 바 정보 업데이트

        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        this.pauseGame();

        // 탭 전환 이벤트 바인딩
        this.initUpgradeTabs();
    },

    initUpgradeTabs() {
        const tabs = document.querySelectorAll('.upgrade-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                
                // 활성 탭 변경
                tabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                
                // 탭 콘텐츠 변경
                document.querySelectorAll('.upgrade-tab-content').forEach(content => {
                    content.classList.toggle('hidden', content.dataset.tabContent !== targetTab);
                });
            });
        });
    },

    renderUpgradePanel() {
        const playerSkills = PlayerData.get('skills');
        const playerLevel = PlayerData.get('level');
        const playerGold = PlayerData.get('gold');

        for (const skillId in skillData) {
            const skill = skillData[skillId];
            const currentLevel = playerSkills[skillId] || 0;
            const maxLevel = skill.levels.length;
            const isMaxLevel = currentLevel >= maxLevel;

            // 다음 레벨의 요구 레벨 확인
            const nextLevelInfo = !isMaxLevel ? skill.levels[currentLevel] : null;
            const reqLevelForNext = nextLevelInfo ? nextLevelInfo.reqLevel : null;
            const isLocked = reqLevelForNext && playerLevel < reqLevelForNext;

            const groupContainer = document.querySelector(`.upgrade-tab-content[data-tab-content="${skill.group}"] [data-skill-group="${skill.group}"]`);
            if (!groupContainer) continue;

            let skillCard = groupContainer.querySelector(`[data-skill-id="${skillId}"]`);
            if (!skillCard) {
                skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                skillCard.dataset.skillId = skillId;
                groupContainer.appendChild(skillCard);
            }

            let currentEffect = '없음';
            if (currentLevel > 0) {
                const currentLevelInfo = skill.levels[currentLevel - 1];
                currentEffect = currentLevelInfo.effect;
                if (currentLevelInfo.reqLevel && currentLevelInfo.reqLevel > 1) {
                    currentEffect += ` (요구 레벨: ${currentLevelInfo.reqLevel})`;
                }
            }

            const nextLevel = currentLevel + 1;
            
            let nextEffect = '최고 레벨 달성';
            if (!isMaxLevel) {
                const nextLevelInfo = skill.levels[currentLevel];
                nextEffect = nextLevelInfo.effect;
                if (nextLevelInfo.reqLevel && nextLevelInfo.reqLevel > 1) {
                    nextEffect += ` (요구 레벨: ${nextLevelInfo.reqLevel})`;
                }
            }

            const upgradeCost = !isMaxLevel ? skill.levels[currentLevel].cost : null;

            let upgradeButtonHTML;
            if (isLocked) {
                upgradeButtonHTML = `<button class="upgrade-btn" disabled><span>요구 레벨: ${reqLevelForNext}</span></button>`;
            } else if (isMaxLevel) {
                upgradeButtonHTML = `<button class="upgrade-btn" disabled><span>MAX</span></button>`;
            } else {
                const canAfford = playerGold >= upgradeCost;
                upgradeButtonHTML = `
                    <button class="upgrade-btn" ${!canAfford ? 'disabled' : ''}>
                        <img src="assets/images/ui/icon/money_Icon.png" class="cost-icon" alt="골드">
                        <span>${upgradeCost}</span>
                    </button>`;
            }
            
            const iconContent = skill.image
                ? `<img src="${skill.image}" alt="${skill.name}">`
                : (skill.icon || '');
            
            skillCard.className = `skill-card ${isLocked ? 'locked' : ''}`;
            skillCard.innerHTML = `
                <div class="skill-media">
                    <div class="skill-icon-ph">${iconContent}</div>
                    <div class="level-dots">
                        ${[...Array(maxLevel)].map((_, i) => `<span class="dot ${i < currentLevel ? 'filled' : ''}"></span>`).join('')}
                    </div>
                </div>
                <div class="skill-content">
                    <div class="skill-title-row">
                        <div class="skill-name-wrapper">
                            <h5 class="skill-name">${skill.name}</h5>
                            <span class="skill-level">(Lv.${currentLevel})</span>
                        </div>
                        ${upgradeButtonHTML}
                    </div>
                    <div class="skill-effects">
                        <p class="effect-row current"><span class="effect-label">현재:</span><span class="effect-desc">${currentEffect}</span></p>
                        <p class="effect-row next"><span class="effect-label">다음:</span><span class="effect-desc">${nextEffect}</span></p>
                    </div>
                </div>
            `;
        }
    },

    upgradeSkill(skillId) {
        const skill = skillData[skillId];
        const playerSkills = PlayerData.get('skills');
        const currentLevel = playerSkills[skillId] || 0;
        const maxLevel = skill.levels.length;
        const playerLevel = PlayerData.get('level');

        if (currentLevel >= maxLevel) {
            this.showNotification('이미 최고 레벨입니다!');
            return;
        }

        // 다음 레벨의 요구 레벨과 비용 확인
        const nextLevelInfo = skill.levels[currentLevel];
        const reqLevelForNext = nextLevelInfo.reqLevel;
        const upgradeCost = nextLevelInfo.cost;

        if (reqLevelForNext && playerLevel < reqLevelForNext) {
            this.showNotification(`요구 레벨(${reqLevelForNext})을 충족하지 못했습니다!`);
            return;
        }
        
        const playerGold = PlayerData.get('gold');

        if (playerGold < upgradeCost) {
            this.showNotification('골드가 부족합니다!');
            return;
        }

        // 강화 실행
        PlayerData.set('gold', playerGold - upgradeCost);
        // 골드 소모 이펙트 (오버레이 배지 기준)
        this.showGain('gold', -upgradeCost);
        playerSkills[skillId] = currentLevel + 1;
        PlayerData.set('skills', playerSkills);

        // 알림 표시
        this.showNotification(`${skill.name}이(가) LV.${currentLevel + 1}이(가) 되었습니다!`);
        this.playPurchaseSound();

        // UI 갱신
        this.renderUpgradePanel();
        this.updateUpgradeStatus();
    },

    updateUpgradeStatus() {
        const statusBar = document.querySelector('.player-status-bar');
        if (!statusBar) return;

        const data = PlayerData.data;
        const levelText = statusBar.querySelector('.level .badge-text');
        const fameText = statusBar.querySelector('.fame .badge-text');
        const goldText = statusBar.querySelector('.gold .badge-text');

        if (levelText) levelText.textContent = `LV. ${data.level}`;
        if (fameText) fameText.textContent = `${data.reputation}/${data.nextReputationGoal}`;
        if (goldText) goldText.textContent = data.gold;
    },

    // updateUpgradeButtons 함수는 renderUpgradePanel에 통합되었으므로 제거

    closeUpgrade() {
        const overlay = document.getElementById('upgrade-overlay');
        if (!overlay) return;
        
        // 떠다니는 숫자 풍선(gain-float)이 있다면 제거
        overlay.querySelectorAll('.gain-float').forEach(el => el.remove());

        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        this.resumeGame();
    },

    pauseGame() {
        if (this.settings.paused) return;
        this.settings.paused = true;
        
        // 타이머 일시정지
        if (typeof TimerManager.pause === 'function') TimerManager.pause();
        
        // 대화 일시정지 로직
        if (DialogueManager.isDialogueActive) {
            this._dialogueWasTyping = NPCManager.pauseTyping();
            DialogueManager.pause(); // 첫 대사 지연 타이머 일시정지
        }
        
        // CSS 애니메이션 일시정지
        const root = document.getElementById('main-container');
        if (root) root.classList.add('paused');
    },

    resumeGame() {
        if (!this.settings.paused) return;
        this.settings.paused = false;
        
        // 타이머 재개
        if (typeof TimerManager.resume === 'function') TimerManager.resume();

        // 대화 재개 로직
        if (DialogueManager.isDialogueActive) {
            DialogueManager.resume(); // 첫 대사 지연 타이머 재개
            if (this._dialogueWasTyping) {
                NPCManager.resumeTyping();
            }
        }
        
        // CSS 애니메이션 재개
        const root = document.getElementById('main-container');
        if (root) root.classList.remove('paused');
    },

    startGame() {
        console.log('게임 시작!');
        if (window.AudioManager) {
            AudioManager.playBgm('main');
        }
        // 디버그/스킵: 튜토리얼 완료 상태거나 스토리 진행이 설정된 경우, 초기 토마스 연출을 생략하고 바로 방문 스케줄 시작
        try {
            const tutDone = !!PlayerData.get('tutorialCompleted');
            const sp = PlayerData.get('storyProgress') || {};
            const anyStoryConfigured = Object.keys(window.storylines || {}).some(k => (sp[k] || 0) > 0);
            if (tutDone || anyStoryConfigured) {
                this.changeScreen('.title-screen', '#main-container', 'fade');
                // 초기 상태 정리
                this.currentCustomer = null;
                this.activeQuest = null;
                this.activeAdhocRequest = null;
                // 이전 세션에서 방문 중이던 손님/의뢰가 있다면 우선 그 상태를 최대한 복원
                let unfinishedNpcId = null;
                let savedQuestId = null;
                let savedRequestId = null;
                try {
                    const storedNpcId = PlayerData.get('currentNpcId');
                    if (typeof storedNpcId === 'string' && storedNpcId && npcData && npcData[storedNpcId]) {
                        unfinishedNpcId = storedNpcId;
                        savedQuestId = PlayerData.get('currentQuestId') || null;
                        savedRequestId = PlayerData.get('currentRequestId') || null;
                    }
                } catch {}

                if (unfinishedNpcId) {
                    let restored = false;

                    // 1) questId가 있으면 우선 questData에서 복원 (게시판/스토리 의뢰)
                    if (savedQuestId) {
                        try {
                            const q = (questData || []).find(x => x && x.id === savedQuestId && x.npcId === unfinishedNpcId);
                            if (q) {
                                this.activeQuest = q;
                                this.activeAdhocRequest = null;
                                restored = true;
                            }
                        } catch {}
                    }

                    // 2) questId로 못 찾았으면 requestId 기준으로 한 번 더 시도
                    if (!restored && savedRequestId) {
                        try {
                            // (a) 해당 requestId를 가진 quest를 우선 탐색
                            const qByReq = (questData || []).find(x => x && x.requestId === savedRequestId && x.npcId === unfinishedNpcId);
                            if (qByReq) {
                                this.activeQuest = qByReq;
                                this.activeAdhocRequest = null;
                                restored = true;
                            } else {
                                // (b) quest가 아니라면 NPC의 requests(랜덤/아드혹 의뢰)에서 복원
                                const npc = (typeof npcData !== 'undefined') ? npcData[unfinishedNpcId] : null;
                                const reqs = npc && Array.isArray(npc.requests) ? npc.requests : [];
                                const picked = reqs.find(r => typeof r === 'object' && r.id === savedRequestId);
                                if (picked) {
                                    const reqText = picked.text || '자유 주제';
                                    const reqDifficulty = this.getDifficultyForRequest(savedRequestId);
                                    this.activeQuest = null;
                                    this.activeAdhocRequest = {
                                        npcId: unfinishedNpcId,
                                        requestId: savedRequestId,
                                        requestText: reqText,
                                        difficulty: reqDifficulty
                                    };
                                    this.currentRequest = reqText;
                                    restored = true;
                                }
                            }
                        } catch {}
                    }

                    // 3) 위에서 의뢰를 복원했다면, 해당 의뢰 기준으로 방문 재개
                    if (restored) {
                        // currentRequest 정리 (spawnVisitor의 afterWelcome에서도 다시 한 번 정리됨)
                        try {
                            if (this.activeQuest && this.activeQuest.theme) {
                                this.currentRequest = this.activeQuest.theme;
                            } else if (this.activeAdhocRequest && this.activeAdhocRequest.requestText) {
                                this.currentRequest = this.activeAdhocRequest.requestText;
                            }
                        } catch {}

                        // requestId에 맞는 welcome 대사가 있으면 사용
                        let welcomeLines = null;
                        try {
                            const reqIdForWelcome = this.activeQuest
                                ? this.activeQuest.requestId
                                : (this.activeAdhocRequest && this.activeAdhocRequest.requestId);
                            if (reqIdForWelcome && typeof this.getWelcomeLinesForRequest === 'function') {
                                const lines = this.getWelcomeLinesForRequest(unfinishedNpcId, reqIdForWelcome);
                                if (Array.isArray(lines) && lines.length) {
                                    welcomeLines = lines;
                                }
                            }
                        } catch {}

                        this.spawnVisitor(unfinishedNpcId, welcomeLines);
                        this.scheduleNextVisitor();
                    } else {
                        // 복원 실패 시에는 동일 NPC를 새 방문으로 소환 (요청은 새로 뽑힘)
                        this.spawnVisitor(unfinishedNpcId);
                        this.scheduleNextVisitor();
                    }
                } else {
                    // 바로 다음 방문 스케줄
                    this.scheduleNextVisitor();
                }
                return;
            }
        } catch {}

        // 기본 온보딩: 토마스가 첫 손님으로 등장
        this.currentNpcId = 'thomas';
        const npc = npcData[this.currentNpcId];
        const requests = npc && npc.requests ? npc.requests : [];
        if (requests.length > 0) {
            const picked = requests[Math.floor(Math.random() * requests.length)];
            if (picked && typeof picked === 'object') {
                this.currentRequest = picked.text || '';
                this.activeAdhocRequest = {
                    npcId: this.currentNpcId,
                    requestId: picked.id || null,
                    requestText: picked.text || '',
                    difficulty: this.getDifficultyForRequest(picked.id || null)
                };
            } else {
                this.currentRequest = picked || '';
            }
        } else {
            this.currentRequest = '';
        }
        this.persistCurrentRequestMeta();
        console.log(`이번 요청: ${this.currentRequest}`);
        this.changeScreen('.title-screen', '#main-container', 'fade');
        setTimeout(() => {
            const spawned = NPCManager.spawnNPC(this.currentNpcId);
            if (spawned) {
                try {
                    PlayerData.set('currentNpcId', this.currentNpcId);
                } catch {}
                NPCManager.showNPC(this.currentNpcId);
                DialogueManager.startDialogue(this.currentNpcId, 'welcome', () => {
                    console.log('환영 대화가 종료되었습니다. 그림 그리기 모드로 전환합니다.');
                    this.changeScreen('#main-container', '#drawing-mode-container', 'slide');
                });
            }
        }, 800);
    },

    // 강화 효과 조회 헬퍼
    getEffect() {
        const skills = PlayerData.get('skills');
        const getLevel = (id) => Math.max(0, Math.min((skills[id] || 0), (skillData[id]?.levels?.length || 0)));
        const lvl = {
            concentration: getLevel('concentration'),
            negotiator: getLevel('negotiator'),
            wisdom: getLevel('wisdom'),
            swiftHands: getLevel('swiftHands'),
            reputation: getLevel('reputation'),
            trust: getLevel('trust'),
            lastFocus: getLevel('lastFocus')
        };
        const ec = window.effectConfig || effectConfig; // 안전 참조
        // 집중력: 누적합 적용
        let addTime = 0;
        if (lvl.concentration > 0) {
            const arr = ec.concentration.bonusTimeByLevel || [];
            for (let i = 0; i < Math.min(lvl.concentration, arr.length); i++) {
                addTime += (arr[i] || 0);
            }
        }
        const swiftSecs = ec.swiftHands.bonusPctPerSecond || [];
        const swiftPerSecPct = lvl.swiftHands > 0 ? (swiftSecs[lvl.swiftHands - 1] || 0) : 0;
        return {
            addTime,
            goldBonusPct: lvl.negotiator > 0 ? (ec.negotiator.goldBonusPctByLevel[lvl.negotiator - 1] || 0) : 0,
            xpBonusPct: lvl.wisdom > 0 ? (ec.wisdom.xpBonusPctByLevel[lvl.wisdom - 1] || 0) : 0,
            swiftBonusPctPerSecond: swiftPerSecPct,
            doubleRepChancePct: lvl.reputation > 0 ? (ec.reputation.doubleChancePctByLevel[lvl.reputation - 1] || 0) : 0,
            ignoreRepLossPct: lvl.trust > 0 ? (ec.trust.ignoreRepLossChancePctByLevel[lvl.trust - 1] || 0) : 0,
            lastFocusEnabled: lvl.lastFocus > 0
        };
    },

    getReputationBonusInfo(value) {
        const rep = typeof value === 'number' ? value : (PlayerData.get('reputation') || 0);
        if (rep >= 90) {
            return { tier: 'A', bonusPct: 50, color: '#4f8ad9', range: '90~100' };
        }
        if (rep >= 70) {
            return { tier: 'B', bonusPct: 20, color: '#3bb4c5', range: '70~89' };
        }
        if (rep >= 31) {
            return { tier: 'C', bonusPct: 0, color: '#f7c325', range: '31~69' };
        }
        if (rep >= 10) {
            return { tier: 'D', bonusPct: -20, color: '#f48b2a', range: '10~30' };
        }
        return { tier: 'E', bonusPct: -40, color: '#d93025', range: '0~9' };
    },

    showResult({ detail }) {
        let score = detail.score;
        let computedComment = null;
        let isRubricMode = false;

        try {
            PlayerData.set('_declineCooldownActive', false);
            PlayerData.set('declinedQuestIds', []);
        } catch {}

        // rubrics 모드 결과 처리 (요청별 평가 기준이 있고 서버에서 rubricResults가 온 경우)
        if (detail.rubricResults) {
            try {
                const reqId =
                    (this.activeQuest && this.activeQuest.requestId)
                    || (this.activeAdhocRequest && this.activeAdhocRequest.requestId)
                    || this.resolveRequestIdFromText(this.currentRequest)
                    || null;
                const reqDef = (window.REQUEST_DATA && reqId) ? window.REQUEST_DATA[reqId] : null;
                if (reqDef) {
                    isRubricMode = true;
                    const out = this.processEvaluation(reqDef, detail.rubricResults);
                    if (out && typeof out.score === 'number') score = out.score;
                    if (out && typeof out.comment === 'string') computedComment = out.comment;
                }
            } catch (e) {
                console.error("Error processing rubrics:", e);
            }
        }

        // --- 로그 추가 ---
        if (detail) {
            const { provider, model, prompt, tokens } = detail;
            const comment = computedComment || (typeof detail.comment === 'string' ? detail.comment : detail.feedback);
            const isSolveMode = !!(detail.analysis || detail.story || detail.analyzePrompt || detail.analyzeRaw);
            console.groupCollapsed('LLM Evaluation Result');
            if (isSolveMode) {
                // ANALYZE 섹션
                console.group('ANALYZE');
                if (detail.analyzeProvider || detail.analyzeModel) console.log('Model:', detail.analyzeProvider || 'unknown', detail.analyzeModel ? `(${detail.analyzeModel})` : '');
                if (typeof detail.analyzePrompt === 'string') {
                    console.log('Prompt length (chars):', detail.analyzePrompt.length);
                    console.log('Prompt:\n', detail.analyzePrompt);
                }
                if (detail.analyzeTokens) console.log('Tokens:', detail.analyzeTokens);
                if (detail.analyzeRaw) {
                    console.log('Raw LLM Response (as received):');
                    console.log(detail.analyzeRaw);
                }
                if (detail.analysis) console.log('Analysis:', detail.analysis);
                console.groupEnd();
                // CREATE 섹션
                console.group('CREATE');
            if (provider || model) console.log('Model:', provider || 'unknown', model ? `(${model})` : '');
            if (typeof prompt === 'string') {
                console.log('Prompt length (chars):', prompt.length);
                console.log('Prompt:\n', prompt);
            }
            if (tokens) console.log('Tokens:', tokens);
            if (detail.raw) {
                console.log('Raw LLM Response (as received):');
                console.log(detail.raw);
            }
                console.groupEnd();
                console.log('Story Decision:', detail.story || null);
                console.log('Mapped Score:', score);
                if (comment) console.log('Comment:', comment);
            } else {
                if (provider || model) console.log('Model:', provider || 'unknown', model ? `(${model})` : '');
                if (typeof prompt === 'string') {
                    console.log('Prompt length (chars):', prompt.length);
                    console.log('Prompt:\n', prompt);
                }
                if (tokens) console.log('Tokens:', tokens);
                if (detail.raw) {
                    console.log('Raw LLM Response (as received):');
                    console.log(detail.raw);
                }
                if (isRubricMode) {
                    console.log('Rubric Results:', detail.rubricResults);
                    console.log('Computed Score:', score);
                } else {
            console.log('Score:', score);
                }
            if (comment) console.log('Comment:', comment);
            }
            console.groupEnd();
        }
        
        // --- 보상 설정값 참조 ---
        const multipliers = rewardConfig.reputationFlowMultipliers;
        const rc = window.rewardConfig || rewardConfig;
        const ec = window.effectConfig || effectConfig;
        const difficultySource = this.activeQuest || (this.activeAdhocRequest ? { difficulty: this.activeAdhocRequest.difficulty || 1 } : null);
        const difficultyWeight = this.getDifficultyWeight(difficultySource);
        const baseGold = rc.baseRewards.gold * difficultyWeight;
        const baseRep = rc.baseRewards.rep * difficultyWeight;
        const baseXp = rc.baseRewards.xp * difficultyWeight;

        // --- 만족도(반응) 결정 ---
        let reactionKey, reactionIcon;
        if (detail && (detail.solveReactionKey || (typeof detail.solveOutcome === 'string' && detail.solveOutcome.startsWith('reaction_')))) {
            // solve의 커스텀 5단계 반응 키를 그대로 사용
            const key = detail.solveReactionKey || detail.solveOutcome;
            const iconByKey = {
                reaction_perfect: 'assets/images/ui/icon/reaction/best_Icon.png',
                reaction_good: 'assets/images/ui/icon/reaction/good_Icon.png',
                reaction_normal: 'assets/images/ui/icon/reaction/normal_Icon.png',
                reaction_bad: 'assets/images/ui/icon/reaction/bad_Icon.png',
                reaction_terrible: 'assets/images/ui/icon/reaction/worst_Icon.png'
            };
            reactionKey = key;
            reactionIcon = iconByKey[key] || iconByKey.reaction_normal;
        } else {
        if (score >= 80) {
            reactionKey = 'reaction_perfect';
            reactionIcon = 'assets/images/ui/icon/reaction/best_Icon.png';
        } else if (score >= 60) {
            reactionKey = 'reaction_good';
            reactionIcon = 'assets/images/ui/icon/reaction/good_Icon.png';
        } else if (score >= 40) {
            reactionKey = 'reaction_normal';
            reactionIcon = 'assets/images/ui/icon/reaction/normal_Icon.png';
        } else if (score >= 20) {
            reactionKey = 'reaction_bad';
            reactionIcon = 'assets/images/ui/icon/reaction/bad_Icon.png';
        } else {
            reactionKey = 'reaction_terrible';
            reactionIcon = 'assets/images/ui/icon/reaction/worst_Icon.png';
            }
        }

        let reactionSoundKey = null;
        if (reactionKey === 'reaction_perfect' || reactionKey === 'reaction_good') {
            reactionSoundKey = 'success';
        } else if (reactionKey === 'reaction_normal') {
            reactionSoundKey = 'good_situation';
        } else if (reactionKey === 'reaction_bad' || reactionKey === 'reaction_terrible') {
            reactionSoundKey = 'failure';
        }

        // --- 기본 보상 계산 ---
        const scoreMult = (rc.scoreMultipliers && rc.scoreMultipliers[reactionKey]) || { gold: 0, xp: 0 };
        let goldReward = Math.floor(baseGold * scoreMult.gold);
        let xpReward = Math.floor(baseXp * scoreMult.xp);
        
        const repMult = (rc.reputationFlowMultipliers && rc.reputationFlowMultipliers[reactionKey]) || 0;
        let repReward = Math.floor(baseRep * repMult);
        const triggeredSkillIcons = [];

        // --- 스킬 보너스 적용 ---
        const eff = this.getEffect();
        if (eff.goldBonusPct) goldReward = Math.floor(goldReward * (1 + eff.goldBonusPct / 100));
        if (eff.xpBonusPct) xpReward = Math.floor(xpReward * (1 + eff.xpBonusPct / 100));
        
        try {
            const remaining = TimerManager.remaining || 0;
            if (remaining > 0 && eff.swiftBonusPctPerSecond) {
                const rate = eff.swiftBonusPctPerSecond / 100;
                const extraGold = Math.floor(goldReward * rate * remaining);
                const extraRep = repReward > 0 ? Math.floor(repReward * rate * remaining) : 0;
                goldReward += extraGold;
                repReward += extraRep;
            }
        } catch {}

        const repBonusInfo = this.getReputationBonusInfo(PlayerData.get('reputation'));
        if (repBonusInfo && repBonusInfo.bonusPct !== 0) {
            const factor = 1 + (repBonusInfo.bonusPct / 100);
            goldReward = Math.max(0, Math.floor(goldReward * factor));
        }

        // 소비형 아이템 보너스
        try {
            if (this.getActiveConsumableCount('goldenBrush') > 0) {
                goldReward = Math.floor(goldReward * 2);
                this.consumeActiveConsumable('goldenBrush');
            }
            if (this.getActiveConsumableCount('masterCanvas') > 0) {
                if (repReward > 0) {
                    repReward = Math.floor(repReward * 1.5);
                }
                this.consumeActiveConsumable('masterCanvas');
            }
        } catch {}

        if (repReward > 0 && eff.doubleRepChancePct && (Math.random() * 100 < eff.doubleRepChancePct)) {
            repReward *= 2;
            const repSkill = skillData.reputation || {};
            triggeredSkillIcons.push({
                icon: repSkill.image || 'assets/images/skills/reputation.png',
                label: `${repSkill.name || '예술가의 평판'} 발동!`
            });
        }
        if (repReward < 0 && eff.ignoreRepLossPct && (Math.random() * 100 < eff.ignoreRepLossPct)) {
            repReward = 0;
            const trustSkill = skillData.trust || {};
            triggeredSkillIcons.push({
                icon: trustSkill.image || 'assets/images/skills/trust.png',
                label: `${trustSkill.name || '굳건한 신뢰'} 발동!`
            });
        }

        // --- 스토리 진행/결과 기록 ---
        try {
            const quest = this.activeQuest;
            if (quest && quest.story) {
                // 진행도 증가 (현재 퀘스트가 속한 스토리 라인)
                const arcKey = (function findArcKeyForQuest(id) {
                    try {
                        const slAll = window.storylines || {};
                        for (const k of Object.keys(slAll)) {
                            const steps = Array.isArray(slAll[k].steps) ? slAll[k].steps : [];
                            if (steps.some(s => s.questId === id)) return k;
                        }
                    } catch {}
                    return 'leo';
                })(quest.id);
                const sp = PlayerData.get('storyProgress') || {};
                const current = sp[arcKey] || 0;
                sp[arcKey] = current + 1;
                PlayerData.set('storyProgress', sp);
                // 다음 단계 랜덤 목표 설정 (스토리라인 규칙에 따름)
                try {
                    const slAll = window.storylines || {};
                    const sl = slAll[arcKey] || null;
                    if (sl && Array.isArray(sl.steps)) {
                        const nextStep = sl.steps[sp[arcKey]];
                        if (nextStep) {
                            const min = typeof nextStep.minRandomBetween === 'number' ? nextStep.minRandomBetween : 1;
                            const max = typeof nextStep.maxRandomBetween === 'number' ? nextStep.maxRandomBetween : 3;
                            const target = Math.max(min, Math.min(max, Math.floor(Math.random() * (max - min + 1)) + min));
                            const t = PlayerData.get('storyRandomTarget') || {};
                            t[arcKey] = target;
                            PlayerData.set('storyRandomTarget', t);
                        } else if (sl.epilogue) {
                            // 스토리 마지막을 완료했고 에필로그가 설정된 경우: 에필로그 대기 세팅
                            const eMin = typeof sl.epilogue.afterMinRandom === 'number' ? sl.epilogue.afterMinRandom : 0;
                            const eMax = typeof sl.epilogue.afterMaxRandom === 'number' ? sl.epilogue.afterMaxRandom : eMin;
                            const eTarget = Math.max(eMin, Math.min(eMax, Math.floor(Math.random() * (eMax - eMin + 1)) + eMin));
                            const t = PlayerData.get('storyRandomTarget') || {};
                            t[arcKey] = eTarget;
                            PlayerData.set('storyRandomTarget', t);
                            const ep = PlayerData.get('epiloguePending') || {};
                            ep[arcKey] = true;
                            PlayerData.set('epiloguePending', ep);
                        }
                    }
                } catch {}
                // 결과 매핑 저장
                const outcomes = PlayerData.get('storyOutcomes') || {};
                const outcomeMap = {
                    reaction_perfect: 'creative_success',
                    reaction_good: 'creative_success',
                    reaction_normal: 'neutral',
                    reaction_bad: 'bad',
                    reaction_terrible: 'bad'
                };
                outcomes[quest.id] = outcomeMap[reactionKey] || 'neutral';
                PlayerData.set('storyOutcomes', outcomes);
                // 소피아 호감도 가산 (성공시)
                if (quest.npcId === 'sofia' && (reactionKey === 'reaction_perfect' || reactionKey === 'reaction_good')) {
                    const rel = PlayerData.get('relationships') || {};
                    const cur = rel.sofia_romance_points || 0;
                    rel.sofia_romance_points = cur + 1;
                    PlayerData.set('relationships', rel);
                }
                // 다음 스토리까지 랜덤 방문 카운트 초기화
                PlayerData.set('randomSinceLastStory', 0);
            }
        } catch {}

        // --- 완료 의뢰 기록 ---
        try {
            const completedQuestId = this.activeQuest?.id || null;
            if (completedQuestId && typeof PlayerData.markQuestCompleted === 'function') {
                PlayerData.markQuestCompleted(completedQuestId);
            }
            const completedRequestId =
                (this.activeQuest && this.activeQuest.requestId) ||
                (this.activeAdhocRequest && this.activeAdhocRequest.requestId) ||
                this.resolveRequestIdFromText(this.currentRequest) ||
                null;
            if (completedRequestId && typeof PlayerData.markRequestCompleted === 'function') {
                PlayerData.markRequestCompleted(completedRequestId);
            }
        } catch {}

        // --- 갤러리에 작품 기록 ---
        try {
            const llmComment = (typeof computedComment === 'string' && computedComment)
                ? computedComment
                : (typeof detail.comment === 'string' ? detail.comment : detail.feedback);
            const artworkData = {
                questTitle: this.currentRequest, // '의뢰'
                npcName: npcData[this.currentNpcId]?.name || 'Unknown',
                theme: this.currentRequest, // '그림 주제'를 의뢰 내용으로 통일
                imageUrl: detail.imageDataUrl, // 그림 이미지
                completionDate: new Date().toLocaleDateString('ko-KR'),
                evaluation: reactionKey, // 'reaction_perfect', 'reaction_good' 등
                comment: llmComment ? llmComment.replace(/\\n/g, ' ') : '코멘트 없음', // 한줄평(줄바꿈을 공백으로)
                rewards: {
                    gold: goldReward,
                    xp: xpReward,
                    reputation: repReward
                },
                // 명성 복구를 위해 변경 전 현재 명성 저장
                previousReputation: PlayerData.get('reputation')
            };
            PlayerData.addArtwork(artworkData);
        } catch (e) {
            console.error("Failed to save artwork:", e);
        }

        // --- 화면 전환 및 애니메이션 ---
        this.changeScreen('#drawing-mode-container', '#main-container', 'slide-back');
        // 다음 그림을 위해 캔버스 초기화 (이전 그림 잔존 방지)
        try { document.dispatchEvent(new CustomEvent('canvas:clear', { detail: { source: 'system' } })); } catch {}
        if (this._mysticTimerActive) {
            this.consumeActiveConsumable('mysticalStopwatch');
            this._mysticTimerActive = false;
        }
        
        const canvasItem = document.getElementById('finished-canvas-item');
        if (canvasItem) {
            canvasItem.classList.remove('hidden');
            setTimeout(() => canvasItem.classList.add('animate-give'), 50);
            canvasItem.addEventListener('animationend', () => {
                canvasItem.classList.add('hidden');
                canvasItem.classList.remove('animate-give');
                this.showRewardEffect(goldReward, repReward, xpReward, reactionIcon, () => {
                    this.ensureNpcDialogBox(this.currentNpcId);
                    NPCManager.showNPC(this.currentNpcId);

                    // --- NPC 반응 대사 시작 ---
                    const llmComment = (typeof computedComment === 'string' && computedComment)
                        ? computedComment
                        : (typeof detail.comment === 'string' ? detail.comment : detail.feedback);
                    let extraDialogue = [];
                    if (llmComment) {
                        const lines = llmComment.split('\n').map(s => s.trim()).filter(Boolean);
                        for (const ln of lines) {
                            const conj = ' 그리고 ';
                            const idx = ln.indexOf(conj);
                            if (idx >= 0) {
                                const first = ln.slice(0, idx).trim();
                                const secondRaw = ln.slice(idx + conj.length).trim();
                                if (first) extraDialogue.push(first);
                                if (secondRaw) extraDialogue.push('그리고 ' + secondRaw);
                            } else {
                                extraDialogue.push(ln);
                            }
                        }
                    }
                    
                    // npcId는 현재 반응 대상 손님 id를 사용
                    const npcId = this.currentNpcId;
                    
                    // 첫 의뢰 특별 처리
                    this.handleFirstQuestDialogue(npcId, reactionKey, extraDialogue);
                    // --- NPC 반응 대사 끝 ---
                }, triggeredSkillIcons, reactionSoundKey);
            }, { once: true });
        }
    },

    showRewardEffect(gold, rep, xp, reactionIconUrl, onComplete, skillIcons = [], reactionSoundKey = null) { 
        const container = document.getElementById('reward-container');
        if (!container) return;
        container.innerHTML = '';

        const rewards = [];
        let reactionSoundPlayed = false;
        if (reactionIconUrl) {
            rewards.push({ type: 'reaction', icon: reactionIconUrl });
        }
        if (Array.isArray(skillIcons) && skillIcons.length) {
            skillIcons.forEach(skill => {
                if (!skill || !skill.icon) return;
                rewards.push({ type: 'skill', icon: skill.icon, label: skill.label || '' });
            });
        }
        if (xp !== 0) {
            rewards.push({ type: 'xp', value: xp });
        }
        if (rep !== 0) {
            rewards.push({ type: 'rep', value: rep, icon: 'assets/images/ui/icon/fame_Icon.png' });
        }
        if (gold !== 0) {
            rewards.push({ type: 'gold', value: gold, icon: 'assets/images/ui/icon/money_Icon.png' });
        }

        if (rewards.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        // non-reaction 완료 추적 변수
        const hasReaction = rewards.some(r => r.type === 'reaction');
        const nonReactionTotal = rewards.filter(r => r.type !== 'reaction').length;
        let nonReactionDone = 0;
        let completeCalled = false;
        const tryComplete = () => {
            if (!completeCalled && !hasReaction && nonReactionDone >= nonReactionTotal) {
                completeCalled = true;
                if (onComplete) onComplete();
            }
        };
        // 안전망: 어떤 이유로든 애니메이션 콜백이 누락되면 일정 시간 후 강제 완료
        setTimeout(() => {
            if (!completeCalled) {
                completeCalled = true;
                if (onComplete) onComplete();
            }
        }, 5000);

        rewards.forEach((reward, index) => {
            setTimeout(() => {
                const rewardEl = document.createElement('div');
                rewardEl.className = 'reward-item';
                
                if (reward.type === 'reaction') {
                    rewardEl.classList.add('reaction-icon');
                    rewardEl.innerHTML = `<img src="${reward.icon}" alt="reaction">`;
                    if (!reactionSoundPlayed && reactionSoundKey && window.AudioManager) {
                        AudioManager.playSfx(reactionSoundKey);
                        reactionSoundPlayed = true;
                    }
                    // 이모티콘 애니메이션이 끝나면 바로 콜백(대사 시작) 실행
                    rewardEl.addEventListener('animationend', () => {
                        if (!completeCalled) {
                            completeCalled = true;
                        if (onComplete) onComplete();
                        }
                    }, { once: true });
                } else {
                    // XP 텍스트, 그 외는 이미지 아이콘
                    if (reward.type === 'skill') {
                        rewardEl.classList.add('skill-icon');
                        rewardEl.innerHTML = `
                            <img src="${reward.icon}" alt="${reward.label || 'skill'}">
                            ${reward.label ? `<span class="skill-name">${reward.label}</span>` : ''}
                        `;
                    } else if (reward.type === 'xp') {
                        rewardEl.innerHTML = `
                            <span class="reward-label">XP</span>
                            <span>${reward.value > 0 ? `+${reward.value}` : `${reward.value}`}</span>
                        `;
                    } else {
                        rewardEl.innerHTML = `
                            <img src="${reward.icon}" alt="${reward.type}">
                            <span>${reward.value > 0 ? `+${reward.value}` : `${reward.value}`}</span>
                        `;
                    }
                }
                container.appendChild(rewardEl);

                if (reward.type !== 'reaction') {
                    setTimeout(() => {
                        if (reward.type === 'gold') {
                            PlayerData.addGold(reward.value);
                            this.showGain('gold', reward.value);
                        } else if (reward.type === 'rep') {
                            PlayerData.addReputation(reward.value);
                            this.showGain('rep', reward.value);
                        } else if (reward.type === 'xp') {
                            PlayerData.addXp(reward.value);
                            this.showGain('xp', reward.value);
                        } else if (reward.type === 'skill') {
                            // 스킬 발동 표시는 보상 변화 없이 시각 효과만
                            this.showNotification(reward.label || '스킬 발동!', 'info');
                        }
                        if (reward.type !== 'skill') {
                        console.log(`[Effect Peak] ${reward.type}: ${reward.value > 0 ? '+' : ''}${reward.value}`);
                        }
                        // non-reaction 보상 완료 카운트
                        nonReactionDone += 1;
                        tryComplete();
                    }, reward.type === 'skill' ? 800 : 600);
                }
            }, index * 400);
        });
    },

    // 증가 시각화: 배지에 +값 떠오름, 배지 bump, XP바 펄스
    showGain(type, amount) {
        let target = null;
        if (type === 'xp') {
            target = document.querySelector('.level-badge-main');
        } else if (type === 'rep') {
            // 우선 오버레이(업그레이드/상점) 내 배지 탐색은 필요 시 확장
            target = document.querySelector('.fame-badge');
        } else if (type === 'gold') {
            // 오버레이 내 골드 배지 우선 타겟팅
            const upgradeOverlay = document.getElementById('upgrade-overlay');
            const shopOverlay = document.getElementById('shop-overlay');
            if (upgradeOverlay && !upgradeOverlay.classList.contains('hidden')) {
                target = upgradeOverlay.querySelector('.player-status-bar .status-badge-small.gold');
            }
            if (!target && shopOverlay && !shopOverlay.classList.contains('hidden')) {
                target = shopOverlay.querySelector('.player-status-bar .status-badge-small.gold');
            }
            if (!target) {
                target = document.querySelector('.gold-badge');
            }
        }
        if (!target) return;

        // 배지 bump 효과
        target.classList.add('badge-bump');
        target.addEventListener('animationend', () => {
            target.classList.remove('badge-bump');
        }, { once: true });

        // 떠오르는 +값
        const float = document.createElement('div');
        float.className = `gain-float gain-${type}`;
        if (amount < 0) {
            float.classList.add('negative');
        }
        float.textContent = `${amount > 0 ? '+' : ''}${amount}`;
        target.appendChild(float);
        float.addEventListener('animationend', () => float.remove(), { once: true });

        // XP 바 펄스 효과 (획득 시에만)
        if (type === 'xp' && amount > 0) {
            const xpBar = document.querySelector('.xp-bar-fill');
            if (xpBar) {
                xpBar.classList.add('flash');
                xpBar.addEventListener('animationend', () => {
                    xpBar.classList.remove('flash');
                }, { once: true });
            }
        }
    },

    handleLevelUpToast(detail = {}) {
        const level = detail && typeof detail.level === 'number'
            ? detail.level
            : (PlayerData.get('level') || 1);
        this.showNotification(`레벨 업! Lv.${level} 달성!`);
        const badge = document.querySelector('.level-badge-main');
        if (badge) {
            badge.classList.add('level-up-glow');
            const cleanup = () => badge.classList.remove('level-up-glow');
            badge.addEventListener('animationend', cleanup, { once: true });
            setTimeout(cleanup, 1500);
        }
    },

    changeScreen(fromSelector, toSelector, transitionType) {
        const fromScreen = document.querySelector(fromSelector);
        const toScreen = document.querySelector(toSelector);
        
        // 화면 전환 시 대사 말풍선 및 대화 상태 정리
        this.clearDialogueUI();
        
        if (fromScreen) {
            if (transitionType === 'fade') {
                fromScreen.classList.add('fade-out');
            } else if (transitionType === 'slide') {
                fromScreen.classList.add('exit-left'); // 왼쪽으로 슬라이드 아웃
            } else if (transitionType === 'slide-back') {
                fromScreen.classList.add('exit-right'); // 오른쪽으로 슬라이드 아웃
            }
        }
        if (toScreen) {
            if (transitionType === 'slide-back') {
                toScreen.classList.remove('exit-left');
            } else {
                toScreen.classList.remove('exit-right');
            }
            toScreen.addEventListener('transitionend', () => {}, { once: true });
            toScreen.classList.add('active-screen');
            this.updateBackground(toScreen); // 배경 업데이트

            // 그림 그리기 화면으로 전환 시 요청 텍스트 업데이트 및 타이머 시작
            if (toSelector === '#drawing-mode-container') {
                if (window.AudioManager) {
                    AudioManager.playSfx('open_paper');
                }
                // 상점 연동 팔레트/브러시/기능 동기화
                this.syncPaletteWithShop();
                this.syncBrushesWithShop();
                this.syncBrushSliderWithShop();
                this.syncColorSliderWithShop();
                this.syncUndoButtonWithShop();
                this.syncFillButtonWithShop(); // 채우기 버튼 동기화 추가
                this._mysticTimerActive = false;
                this._lastFocusTriggered = false;
                const requestTextEl = toScreen.querySelector('.request-text');
                if (requestTextEl) {
                    requestTextEl.textContent = this.currentRequest;
                }
                // 초상화(포트레이트) 업데이트
                try {
                    const portraitEl = toScreen.querySelector('.customer-portrait');
                    if (portraitEl) {
                        // 우선 activeQuest의 명시적 초상화 → 없으면 npcData의 portrait → 없으면 기본 이미지
                        let portraitSrc = (this.activeQuest && this.activeQuest.npcPortrait) || '';
                        if (!portraitSrc) {
                            const npc = (typeof npcData !== 'undefined') ? npcData[this.currentNpcId] : null;
                            portraitSrc = (npc && (npc.portrait || npc.image)) || portraitEl.getAttribute('src');
                        }
                        if (portraitSrc) {
                            portraitEl.src = portraitSrc;
                            portraitEl.alt = (npcData[this.currentNpcId]?.name || '손님') + ' Portrait';
                        }
                    }
                } catch {}
                // 의뢰 유형 아이콘 설정 (그림/문제 해결)
                try {
                    const info = this.getCurrentQuestInfo();
                    const iconEl = toScreen.querySelector('#quest-type-icon');
                    if (iconEl) {
                        const isSolve = info && info.questType === 'solve';
                        iconEl.src = isSolve 
                            ? 'assets/images/ui/icon/solve_Icon.png' 
                            : 'assets/images/ui/icon/draw_Icon.png';
                        iconEl.alt = isSolve ? '문제 해결' : '그림';
                        iconEl.title = isSolve ? '문제 해결' : '그림';
                    }
                } catch {}
                // 기본 시간 + 강화 시간 보너스 적용
                const BASE = 60;
                const eff = this.getEffect();
                const DURATION = BASE + (eff.addTime || 0);
                TimerManager.start(DURATION, () => {
                    console.log('시간 초과! 자동 제출합니다.');
                    PaintEngine.submit();
                });
                const mysticCount = this.getActiveConsumableCount('mysticalStopwatch');
                if (mysticCount > 0 && typeof TimerManager.lockAt === 'function') {
                    this._mysticTimerActive = true;
                    TimerManager.lockAt(10);
                }

                // 첫 드로잉 진입 시 튜토리얼 시작 (이미 완료했다면 스킵)
                try {
                    if (window.TutorialManager && !PlayerData.get('drawingTutorialCompleted')) {
                        // 드로잉 UI 렌더 및 레이아웃 안정화까지 기다렸다가 시작
                        setTimeout(() => TutorialManager.startDrawingTutorial(), 600);
                    } else if (window.TutorialManager && !PlayerData.get('solveTutorialCompleted')) {
                        const info = this.getCurrentQuestInfo();
                        if (info && info.questType === 'solve') {
                            setTimeout(() => TutorialManager.startSolveTutorial(), 600);
                        }
                    }
                } catch {}
            } else {
                TimerManager.stop(); // 다른 화면으로 갈 땐 타이머 정지
            }
        }
    },

    ensureNpcDialogBox(npcId) {
        let npc = NPCManager.getNPC(npcId);
        if (!npc) {
            npc = NPCManager.spawnNPC(npcId);
            return; // spawnNPC가 말풍선까지 생성함
        }
        if (!npc.dialogBox || !npc.dialogBox.isConnected) {
            const dialogBox = document.createElement('div');
            dialogBox.className = 'dialog-box';
            dialogBox.innerHTML = `
                <span class="dialog-speaker-name"></span>
                <p class="dialog-text"></p>
                <span class="next-arrow">▼</span>
            `;
            const presetData = dialogData['default'];
            if (presetData) {
                const { position, size } = presetData;
                Object.assign(dialogBox.style, position, size);
            }
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) mainContainer.appendChild(dialogBox);
            npc.dialogBox = dialogBox;
        }
    },

    clearDialogueUI() {
        try {
            // 진행 중인 대화 종료
            if (DialogueManager && typeof DialogueManager.endDialogue === 'function') {
                DialogueManager.endDialogue();
            }
            // NPC 타이핑 타이머 정리
            if (NPCManager && NPCManager.typingTimer) {
                clearInterval(NPCManager.typingTimer);
                NPCManager.typingTimer = null;
            }
            // 문서 내 말풍선 제거
            document.querySelectorAll('.dialog-box').forEach(el => el.remove());
        } catch (e) {
            console.warn('clearDialogueUI error:', e);
        }
    },

    updateBackground(screenElement) {
        if (this.backgroundEl && screenElement) {
            // getComputedStyle을 사용하여 실제 적용된 배경 이미지 URL을 가져옵니다.
            const style = window.getComputedStyle(screenElement);
            const bgImage = style.backgroundImage;
            this.backgroundEl.style.backgroundImage = bgImage;
        }
    },

    updateStatusUI(data) {
        const levelText = document.querySelector('.level-badge-main .badge-text');
        const xpBar = document.querySelector('.xp-bar-fill');
        const repText = document.querySelector('.fame-badge .badge-text');
        const goldText = document.querySelector('.gold-badge .badge-text');

        if (levelText) levelText.textContent = `LV. ${data.level}`;
        if (xpBar) {
            const xpPercent = data.nextLevelXp > 0 ? (data.xp / data.nextLevelXp) * 100 : 0;
            xpBar.style.width = `${xpPercent}%`;
        }
        if (repText) {
            const repInfo = this.getReputationBonusInfo(data.reputation);
            repText.textContent = `${data.reputation} / ${data.nextReputationGoal}`;
            repText.style.color = repInfo.color;
            this._lastReputationInfo = { ...repInfo, value: data.reputation };
            this.updateReputationTooltipContent();
        }
        if (goldText) goldText.textContent = data.gold;

        this.renderActiveConsumableBuffs(data?.activeConsumables || {});
    },

    renderActiveConsumableBuffs(activeMap) {
        const bar = document.getElementById('consumable-buff-bar');
        if (!bar) return;

        const list = Object.entries(activeMap || {}).filter(([, uses]) => uses > 0);
        if (!list.length) {
            bar.innerHTML = '';
            bar.classList.add('hidden');
            return;
        }

        const store = (typeof shopData !== 'undefined' && shopData)
            ? shopData
            : (window.shopData || null);
        const consumables = store?.consumables || {};
        const shopOrder = Object.keys(consumables);

        const getOrder = (id) => {
            const idx = shopOrder.indexOf(id);
            return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
        };

        list.sort((a, b) => getOrder(a[0]) - getOrder(b[0]));

        bar.innerHTML = '';
        list.forEach(([id, uses]) => {
            const meta = consumables[id] || null;
            const icon = meta?.image || meta?.icon || 'assets/images/ui/icon/shop_Icon.png';
            const label = meta?.name || id;
            const item = document.createElement('div');
            item.className = 'consumable-buff';
            item.dataset.consumableId = id;
            item.title = `${label} · 남은 손님 ${uses}명`;
            item.innerHTML = `
                <img src="${icon}" alt="${label}" class="consumable-buff-icon">
                <span class="consumable-buff-count">${uses}</span>
            `;
            bar.appendChild(item);
        });

        bar.classList.remove('hidden');
    },

    adjustFontSize() {
        const viewport = document.getElementById('game-viewport');
        if (!viewport) return;

        const viewportWidth = viewport.clientWidth;
        const baseFontSize = viewportWidth * 0.055; 
        document.documentElement.style.fontSize = `${baseFontSize}px`;

        const titleElement = document.querySelector('.game-title');
        if (titleElement) {
            titleElement.style.fontSize = '3.6rem'; /* 전체적인 크기 축소 */
        }

        const buttonElement = document.querySelector('.start-button');
        if (buttonElement) {
            buttonElement.style.fontSize = '1.2rem';
        }
    },

    openShop() {
        try { if (!PlayerData.get('tutorialCompleted') && !(typeof TutorialManager !== 'undefined' && TutorialManager.active)) return; } catch {}
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;

        this.renderShopPanel();
        this.updateShopStatus();
        this.syncUndoButtonWithShop(); // 상점 열 때 버튼 상태 동기화

        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        this.pauseGame();

        this.initShopTabs();
    },

    closeShop() {
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;

        // 떠다니는 숫자 풍선(gain-float)이 있다면 제거
        overlay.querySelectorAll('.gain-float').forEach(el => el.remove());

        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        this.resumeGame();
    },

    // ===== 의뢰 UI =====
    openQuest() {
        try { if (!PlayerData.get('tutorialCompleted') && !(typeof TutorialManager !== 'undefined' && TutorialManager.active)) return; } catch {}
        const overlay = document.getElementById('quest-overlay');
        if (!overlay) return;

        this.renderQuestPanel({ keepExisting: true });
        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        this.pauseGame();
    },

    closeQuest() {
        const overlay = document.getElementById('quest-overlay');
        if (!overlay) return;
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        this.resumeGame();
    },

    openQuestDetail(questId) {
        const quest = questData.find(q => q.id === questId);
        if (!quest) return;

        const detailOverlay = document.getElementById('quest-detail-overlay');
        const detailContent = document.getElementById('quest-detail-content');
        if (!detailOverlay || !detailContent) return;

        detailContent.innerHTML = `
            <p class="quest-letter-greeting">친애하는 작가님께,</p>
            <p class="quest-letter-body">${quest.detail}</p>
            <p class="quest-letter-closing">마음을 담아,<br>${quest.npcName}</p>
        `;

        detailOverlay.classList.remove('hidden');
        if (window.AudioManager) {
            AudioManager.playSfx('open_paper');
        }

        // 편지 읽음 처리 및 의뢰 목록 UI 갱신
        try {
            PlayerData.markLetterRead(questId);
            const questCard = document.querySelector(`.quest-card[data-quest-id="${questId}"]`);
            if (questCard) {
                questCard.querySelectorAll('.icon-badge-exclaim').forEach(el => el.remove());
            }
        } catch {}
    },

    closeQuestDetail() {
        const detailOverlay = document.getElementById('quest-detail-overlay');
        if (detailOverlay) {
            detailOverlay.classList.add('hidden');
        }
    },

    animateQuestCardRemoval(questId, onComplete) {
        const card = document.querySelector(`.quest-card[data-quest-id="${questId}"]`);
        if (!card) {
            if (typeof onComplete === 'function') onComplete();
            return;
        }

        const initialHeight = card.offsetHeight;
        card.style.height = `${initialHeight}px`;
        card.style.overflow = 'hidden';
        const computedStyles = window.getComputedStyle(card);
        const initialMarginBottom = computedStyles.marginBottom || '0px';
        card.style.marginBottom = initialMarginBottom;

        const handleTransitionEnd = (event) => {
            if (event.propertyName !== 'height') return;
            card.removeEventListener('transitionend', handleTransitionEnd);
            if (typeof onComplete === 'function') onComplete();
        };

        requestAnimationFrame(() => {
            card.classList.add('quest-card-removing');
            requestAnimationFrame(() => {
                card.style.height = '0px';
                card.style.marginBottom = '0px';
            });
        });

        card.addEventListener('transitionend', handleTransitionEnd);
    },

    animateQuestCardEntries(previousIds = []) {
        const questBody = document.querySelector('.quest-body');
        if (!questBody) return;

        const prevSet = Array.isArray(previousIds) ? new Set(previousIds) : new Set();
        questBody.querySelectorAll('.quest-card').forEach(card => {
            const questId = card.dataset.questId;
            if (!questId || prevSet.has(questId)) return;
            card.classList.add('quest-card-enter-up');
            card.addEventListener('animationend', () => {
                card.classList.remove('quest-card-enter-up');
            }, { once: true });
        });
    },

    renderQuestPanel(options = {}) {
        const { keepExisting = false, removeQuestId = null } = options || {};
        const questBody = document.querySelector('.quest-body');
        if (!questBody) return;

        const previousIds = Array.isArray(this._currentQuestBoardIds)
            ? [...this._currentQuestBoardIds]
            : [];

        questBody.innerHTML = '';

        const playerLevel = PlayerData.get('level') || 1;
        const solveTutorialCompleted = !!PlayerData.get('solveTutorialCompleted');
        const pendingSolveTutorial = !!PlayerData.get('pendingSolveTutorial');
        const desiredSlots = solveTutorialCompleted ? 5 : 1;
        const tutorialQuestId = 'theo_quest_01';

        const addCardToDom = (questList) => {
            if (!questList || questList.length === 0) {
                const empty = document.createElement('p');
                empty.className = 'quest-empty';
                empty.textContent = '현재 게시판에 등록된 의뢰가 없습니다.';
                questBody.appendChild(empty);
                return;
            }
            questList.forEach(quest => {
                questBody.appendChild(this.createQuestCard(quest, playerLevel));
            });
        };

        if (!solveTutorialCompleted) {
            if (pendingSolveTutorial) {
                this._currentQuestBoardIds = [];
                try { PlayerData.set('questBoardIds', []); } catch {}
                const notice = document.createElement('p');
                notice.className = 'quest-empty';
                notice.textContent = '토마스의 문제 해결 튜토리얼을 진행하면 새로운 의뢰가 열립니다.';
                questBody.appendChild(notice);
                return;
            }
            const tutorialQuest = (questData || []).find(q => q.id === tutorialQuestId);
            const tutorialList = tutorialQuest ? [tutorialQuest] : [];
            this._currentQuestBoardIds = tutorialList.map(q => q.id);
            try { PlayerData.set('questBoardIds', this._currentQuestBoardIds.slice()); } catch {}
            addCardToDom(tutorialList);
            return;
        }

        const completedQuestSet = new Set(PlayerData.get('completedQuestIds') || []);
        const completedRequestSet = new Set(PlayerData.get('completedRequestIds') || []);

        const availableQuests = (questData || []).filter(q => {
            if (!q) return false;
            if (q.story) return false;
            if (this._dismissedQuestIds.has(q.id)) return false;
            if (completedQuestSet.has(q.id)) return false;
            if (q.requestId && completedRequestSet.has(q.requestId)) return false;
            return true;
        });

        const storedBoardIds = Array.isArray(PlayerData.get('questBoardIds')) ? PlayerData.get('questBoardIds') : [];
        let baseIdSource = [];
        if (Array.isArray(this._currentQuestBoardIds) && this._currentQuestBoardIds.length) {
            baseIdSource = this._currentQuestBoardIds.slice();
        } else if (storedBoardIds.length) {
            baseIdSource = storedBoardIds.slice();
            this._currentQuestBoardIds = baseIdSource.slice();
        }

        const deriveBaseQuests = (ids = []) => {
            return ids
                .filter(id => !removeQuestId || id !== removeQuestId)
                .map(id => questData.find(q => q && q.id === id))
                .filter(q => q && !q.story && !this._dismissedQuestIds.has(q.id))
                .filter(q => !completedQuestSet.has(q.id) && !(q.requestId && completedRequestSet.has(q.requestId)));
        };

        let baseQuests = deriveBaseQuests(baseIdSource);

        let selectedQuests;
        if (
            keepExisting &&
            solveTutorialCompleted &&
            Array.isArray(baseIdSource) &&
            baseIdSource.length
        ) {
            selectedQuests = this._buildQuestBoardFromCache({
                baseIds: baseIdSource,
                availableQuests,
                desiredSlots,
                playerLevel,
                removeQuestId,
                completedQuestSet,
                completedRequestSet
            });
        } else {
            selectedQuests = this._selectQuestBoardEntries({
                availableQuests,
                desiredSlots,
                playerLevel,
                baseQuests,
                completedQuestSet,
                completedRequestSet
            });
        }

        this._currentQuestBoardIds = selectedQuests.map(q => q.id);
        try { PlayerData.set('questBoardIds', this._currentQuestBoardIds.slice()); } catch {}
        addCardToDom(selectedQuests);
        this.animateQuestCardEntries(previousIds);
    },

    _buildQuestBoardFromCache({
        baseIds = [],
        availableQuests = [],
        desiredSlots = 5,
        playerLevel = 1,
        removeQuestId = null,
        completedQuestSet = new Set(),
        completedRequestSet = new Set()
    }) {
        const filteredIds = baseIds.filter(id => id && id !== removeQuestId);
        const selected = [];
        const selectedIds = new Set();
        const tryAdd = (quest, { forceFront = false, replaceSameNpc = false } = {}) => {
            if (!quest || quest.story) return;
            if (this._dismissedQuestIds.has(quest.id)) return;
            if (completedQuestSet.has(quest.id)) return;
            if (quest.requestId && completedRequestSet.has(quest.requestId)) return;
            const existingIdx = selected.findIndex(q => q.npcId === quest.npcId);
            if (existingIdx >= 0) {
                if (!replaceSameNpc) return;
                selectedIds.delete(selected[existingIdx].id);
                selected.splice(existingIdx, 1);
            }
            if (selectedIds.has(quest.id)) return;
            if (forceFront) selected.unshift(quest);
            else selected.push(quest);
            selectedIds.add(quest.id);
        };

        filteredIds.forEach(id => {
            const quest = (questData || []).find(q => q && q.id === id);
            tryAdd(quest);
        });

        const reservedQuestId = this.nextReserved?.questId;
        if (reservedQuestId && !selectedIds.has(reservedQuestId)) {
            const reservedQuest = (questData || []).find(q => q && q.id === reservedQuestId);
            if (reservedQuest) {
                tryAdd(reservedQuest, { forceFront: true, replaceSameNpc: true });
            }
        }

        const eligiblePool = availableQuests.filter(q => q && !selectedIds.has(q.id));
        const unlockedPool = eligiblePool.filter(q => playerLevel >= q.reqLevel);
        let pool = unlockedPool.length ? unlockedPool.slice() : eligiblePool.slice();

        const prunePool = () => {
            pool = pool.filter(q => q && !selectedIds.has(q.id) && !selected.some(sel => sel.npcId === q.npcId));
        };
        prunePool();

        while (selected.length < desiredSlots && pool.length) {
            const idx = Math.floor(Math.random() * pool.length);
            const quest = pool.splice(idx, 1)[0];
            tryAdd(quest);
            prunePool();
        }

        return selected.slice(0, desiredSlots);
    },

    _selectQuestBoardEntries({
        availableQuests,
        desiredSlots,
        playerLevel,
        baseQuests = [],
        completedQuestSet = new Set(),
        completedRequestSet = new Set()
    }) {
        const selectedIds = new Set();
        const selectedQuests = [];
        const tryAdd = (quest, { forceFront = false, replaceSameNpc = false } = {}) => {
            if (!quest || quest.story) return;
            if (this._dismissedQuestIds.has(quest.id)) return;
            if (completedQuestSet.has(quest.id)) return;
            if (quest.requestId && completedRequestSet.has(quest.requestId)) return;
            const existingIdx = selectedQuests.findIndex(q => q.npcId === quest.npcId);
            if (existingIdx >= 0) {
                if (!replaceSameNpc) return;
                selectedIds.delete(selectedQuests[existingIdx].id);
                selectedQuests.splice(existingIdx, 1);
            }
            if (selectedIds.has(quest.id)) return;
            if (forceFront) selectedQuests.unshift(quest);
            else selectedQuests.push(quest);
            selectedIds.add(quest.id);
        };

        baseQuests.forEach(q => tryAdd(q));

        // 예약된 의뢰 우선 배치
        if (this.nextReserved && this.nextReserved.questId) {
            const reservedQuest = (questData || []).find(q => q.id === this.nextReserved.questId);
            if (reservedQuest) {
                tryAdd(reservedQuest, { forceFront: true, replaceSameNpc: true });
            }
        }

        const groupedByNpc = {};
        availableQuests.forEach(q => {
            if (!q) return;
            if (selectedIds.has(q.id)) return;
            if (completedQuestSet.has(q.id)) return;
            if (q.requestId && completedRequestSet.has(q.requestId)) return;
            if (this._dismissedQuestIds.has(q.id)) return;
            groupedByNpc[q.npcId] = groupedByNpc[q.npcId] || [];
            groupedByNpc[q.npcId].push(q);
        });

        Object.keys(groupedByNpc).forEach(npcId => {
            if (selectedQuests.some(q => q.npcId === npcId)) return;
            const list = groupedByNpc[npcId];
            if (!Array.isArray(list) || list.length === 0) return;
            const unlocked = list.filter(q => playerLevel >= q.reqLevel);
            const pool = unlocked.length ? unlocked : list;
            const pick = pool[Math.floor(Math.random() * pool.length)];
            tryAdd(pick);
        });

        let remainingPool = availableQuests.filter(q => q && !selectedIds.has(q.id));
        const prunePool = () => {
            remainingPool = remainingPool.filter(q => q && !selectedIds.has(q.id) && !selectedQuests.some(sel => sel.npcId === q.npcId));
        };
        prunePool();

        while (selectedQuests.length < desiredSlots && remainingPool.length) {
            const idx = Math.floor(Math.random() * remainingPool.length);
            const quest = remainingPool.splice(idx, 1)[0];
            tryAdd(quest);
            prunePool();
        }

        if (selectedQuests.length > desiredSlots) {
            const reservedQuestId = this.nextReserved?.questId;
            let reservedQuest = null;
            if (reservedQuestId) {
                reservedQuest = selectedQuests.find(q => q.id === reservedQuestId) || null;
            }
            let rest = selectedQuests.filter(q => (!reservedQuest || q.id !== reservedQuest.id));
            for (let i = rest.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [rest[i], rest[j]] = [rest[j], rest[i]];
            }
            rest = rest.slice(0, desiredSlots - (reservedQuest ? 1 : 0));
            selectedQuests.length = 0;
            if (reservedQuest) selectedQuests.push(reservedQuest);
            selectedQuests.push(...rest);
        }

        return selectedQuests.slice(0, desiredSlots);
    },

    createQuestCard(quest, playerLevel, { storyBadge = false } = {}) {
        const card = document.createElement('div');
        card.className = 'quest-card';
        card.dataset.questId = quest.id;

        const isLocked = playerLevel < quest.reqLevel;
        const isReserved = !!(this.nextReserved && this.nextReserved.npcId === quest.npcId);
        const stars = '★'.repeat(quest.difficulty) + '☆'.repeat(5 - quest.difficulty);

        const isUnread = !PlayerData.isLetterRead(quest.id);

        const questType = quest.questType || 'draw';
        const questTypeIcon = questType === 'solve'
            ? 'assets/images/ui/icon/solve_Icon.png'
            : 'assets/images/ui/icon/draw_Icon.png';
        const questTypeAlt = questType === 'solve' ? '문제 해결 의뢰' : '미적 의뢰';

        const displayRewards = this.getDisplayRewardsForQuest(quest);

        card.innerHTML = `
            <div class="quest-card-header" onclick="Game.openQuestDetail('${quest.id}')">
                <img src="${quest.npcPortrait}" alt="${quest.npcName}" class="quest-npc-icon">
                <span class="quest-npc-name">${quest.npcName}</span>
                <button class="quest-info-btn" onclick="event.stopPropagation(); Game.openQuestDetail('${quest.id}')">
                    <img src="assets/images/ui/icon/letter_Icon.png" alt="정보">
                    ${isUnread ? '<span class="icon-badge-exclaim">!</span>' : ''}
                </button>
                ${storyBadge || quest.story ? '<span class="story-badge">✒️ 스토리</span>' : (isReserved ? '<span class="quest-reserved-badge">예약됨</span>' : '')}
            </div>
            <div class="quest-card-body">
                <div class="quest-card-title-row">
                <h3 class="quest-card-title">${quest.title}</h3>
                    <img src="${questTypeIcon}" alt="${questTypeAlt}" class="quest-type-badge">
                </div>
                <p class="quest-card-theme">${quest.theme}</p>
                <div class="quest-card-info-row">
                    <div class="quest-card-difficulty">
                        <span class="info-label">난이도</span>
                        <span class="stars">${stars}</span>
                    </div>
                    <div class="quest-card-rewards-compact">
                        <span class="info-label">보상</span>
                        <span class="reward-compact-item">
                            <img src="assets/images/ui/icon/money_Icon.png" class="reward-icon-small" alt="골드">
                            +${displayRewards.gold}
                        </span>
                        <span class="reward-compact-item">
                            <img src="assets/images/ui/icon/fame_Icon.png" class="reward-icon-small" alt="명성">
                            +${displayRewards.rep}
                        </span>
                    </div>
                </div>
            </div>
            <div class="quest-card-footer">
                <button class="quest-action-btn quest-decline-btn" ${isReserved ? 'disabled' : ''} onclick="Game.declineQuest('${quest.id}')">거절</button>
                <button class="quest-action-btn quest-accept-btn" ${(isLocked || isReserved) ? 'disabled' : ''} onclick="Game.acceptQuest('${quest.id}')">
                    ${isReserved ? '예약됨' : (isLocked ? `요구 레벨: ${quest.reqLevel}` : '수락')}
                </button>
            </div>
        `;

        if (isLocked) {
            const acceptBtn = card.querySelector('.quest-accept-btn');
            acceptBtn.style.background = '#aaa';
            acceptBtn.style.borderColor = '#888';
            acceptBtn.style.color = '#555';
            acceptBtn.style.cursor = 'not-allowed';
            acceptBtn.style.boxShadow = `0 3px 0 0 #888`;
        }

        if (isReserved) {
            card.classList.add('reserved');
            const acceptBtn = card.querySelector('.quest-accept-btn');
            const declineBtn = card.querySelector('.quest-decline-btn');
            [acceptBtn, declineBtn].forEach(btn => {
                if (btn) {
                    btn.disabled = true;
                    btn.style.background = '#ccc';
                    btn.style.borderColor = '#aaa';
                    btn.style.color = '#666';
                    btn.style.cursor = 'not-allowed';
                    btn.style.boxShadow = `0 3px 0 0 #aaa`;
                }
            });
        }

        return card;
    },

    acceptQuest(questId) {
        const quest = questData.find(q => q.id === questId);
        if (!quest) return;
        const playerLevel = PlayerData.get('level');
        if (playerLevel < quest.reqLevel) {
            this.showNotification(`레벨 ${quest.reqLevel} 이상이 필요합니다.`);
            return;
        }

        // 이미 다음 예약자가 있는 경우
        if (this.currentCustomer && (this.nextReserved && this.nextReserved.npcId)) {
            this.openConfirm('이미 다음 예약자가 존재합니다.', null, { confirmLabel: '확인', cancelLabel: '닫기' });
            return;
        }

        // 손님이 공방에 있을 때: 예약 확인
        if (this.currentCustomer) {
            this.openConfirm(
                '이미 손님이 공방에 와있습니다.\n해당 의뢰를 다음에 예약하시겠습니까?',
                () => {
                    this.nextReserved = { npcId: quest.npcId, questId: quest.id, requestId: quest.requestId };
                    this.nextReservedCustomer = quest.npcId; // 보드 표시용
                    try {
                        PlayerData.set('nextReserved', this.nextReserved);
                        PlayerData.set('nextReservedCustomer', this.nextReservedCustomer);
                    } catch {}
                    this.showNotification(`다음 손님 예약: ${npcData[quest.npcId]?.name || quest.npcId}`);
                    // 예약 시 UI에 표시되도록 새로고침
                    this.renderQuestPanel({ keepExisting: true });
                },
                { confirmLabel: '예약', cancelLabel: '취소' }
            );
            return;
        }

        // 손님이 없을 때: 초대 확인
        this.openConfirm(
            '해당 의뢰자를 공방으로 초대하시겠습니까?',
            () => {
                this.closeQuest();
                // 즉시 현재 의뢰 활성화
                this.activeQuest = quest;
                // 퀘스트별 환영 대사 준비
                let welcomeLines = null;
                try {
                    welcomeLines = this.getWelcomeLinesForRequest(quest.npcId, quest.requestId);
                } catch {}
                this.spawnVisitor(quest.npcId, welcomeLines);
                this.showNotification(`의뢰자 초대: ${npcData[quest.npcId]?.name || quest.npcId}`);
                // 초대 즉시 해당 의뢰 카드는 제거
                this._dismissedQuestIds.add(quest.id);
                this.renderQuestPanel({ keepExisting: true, removeQuestId: quest.id });
            },
            { confirmLabel: '초대', cancelLabel: '취소' }
        );
    },

    declineQuest(questId) {
        const quest = questData.find(q => q.id === questId);
        if (!quest) return;
        if (this.nextReserved && this.nextReserved.questId === questId) return; // 예약 의뢰는 거절 불가
        try {
            if (PlayerData.get('_declineCooldownActive')) {
                this.showNotification('의뢰를 한 번 진행한 후에 거절할 수 있습니다.');
                return;
            }
        } catch {}
        this.openConfirm(
            '해당 의뢰를 거절하시겠습니까?',
            () => {
                const finalizeDecline = () => {
                    try {
                        PlayerData.set('_declineCooldownActive', true);
                    } catch {}
                    this._dismissedQuestIds.add(quest.id);
                    const questTitle = quest.title ? `'${quest.title}'` : '해당';
                    this.showNotification(`${questTitle} 의뢰를 거절했습니다.`);
                    this.renderQuestPanel({ keepExisting: true, removeQuestId: quest.id });
                };
                this.animateQuestCardRemoval(quest.id, finalizeDecline);
            },
            { confirmLabel: '거절', cancelLabel: '취소' }
        );
    },

    initShopTabs() {
        const tabs = document.querySelectorAll('.shop-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.currentTarget.dataset.tab;
                tabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                document.querySelectorAll('.shop-tab-content').forEach(content => {
                    content.classList.toggle('hidden', content.dataset.tabContent !== targetTab);
                });
            });
        });
    },

    updateShopStatus() {
        const statusBar = document.querySelector('#shop-overlay .player-status-bar');
        if (!statusBar) return;
        const data = PlayerData.data;
        const levelText = statusBar.querySelector('.level .badge-text');
        const fameText = statusBar.querySelector('.fame .badge-text');
        const goldText = statusBar.querySelector('.gold .badge-text');
        if (levelText) levelText.textContent = `LV. ${data.level}`;
        if (fameText) fameText.textContent = `${data.reputation}/${data.nextReputationGoal}`;
        if (goldText) goldText.textContent = data.gold;
    },

    renderShopPanel() {
        const playerLevel = PlayerData.get('level');
        const playerGold = PlayerData.get('gold');
        const purchased = PlayerData.get('purchasedItems');
        this.renderPaintsTab(playerLevel, playerGold, purchased);
        this.renderToolsTab(playerLevel, playerGold, purchased);
        this.renderConsumablesTab(playerLevel, playerGold, purchased);
    },

    renderPaintsTab(playerLevel, playerGold, purchased) {
        const container = document.querySelector('[data-tab-content="paints"]');
        if (!container) return;
        container.innerHTML = '';

        // "나의 팔레트" UI 생성
        this.renderMyPalette(container, purchased);

        // 1. 초보자용 팔레트는 항상 표시
        this.createShopItemCard(container, 'paints', 'beginnerPaletteSet', shopData.paints.beginnerPaletteSet, playerLevel, playerGold);

        // 2. 초보자용 팔레트를 구매했다면, 기본 팔레트 세트 표시
        if (purchased.beginnerPaletteSet) {
            this.createShopItemCard(container, 'paints', 'basicPaletteSet', shopData.paints.basicPaletteSet, playerLevel, playerGold);
        }

        // 3. 기본 팔레트 이후 숙련자/장인 팔레트 표시
        if (purchased.basicPaletteSet) {
            this.createShopItemCard(container, 'paints', 'skilledPaletteSet', shopData.paints.skilledPaletteSet, playerLevel, playerGold);
        }
        if (purchased.skilledPaletteSet) {
            this.createShopItemCard(container, 'paints', 'artisanPaletteSet', shopData.paints.artisanPaletteSet, playerLevel, playerGold);
        }

        // 4. 장인 팔레트 구매 후에만 특수 색상 개별 판매
        if (purchased.artisanPaletteSet) {
            Object.entries(shopData.paints).forEach(([itemId, item]) => {
                if (item.special) {
                    this.createShopItemCard(container, 'paints', itemId, item, playerLevel, playerGold);
                }
            });
        }
    },

    // 현재 보유 팔레트(초기 + 구매분)를 통합 생성
    buildOwnedPalette() {
        const purchased = PlayerData.get('purchasedItems');
        const palette = [...initialPalette];
        if (purchased.beginnerPaletteSet) palette.push(...shopData.paints.beginnerPaletteSet.unlocks);
        if (purchased.basicPaletteSet) palette.push(...shopData.paints.basicPaletteSet.unlocks);
        if (purchased.skilledPaletteSet && shopData.paints.skilledPaletteSet) palette.push(...shopData.paints.skilledPaletteSet.unlocks);
        if (purchased.artisanPaletteSet && shopData.paints.artisanPaletteSet) palette.push(...shopData.paints.artisanPaletteSet.unlocks);
        purchased.paints.forEach(paintId => {
            const paintData = shopData.paints[paintId];
            if (paintData && paintData.special) {
                palette.push({ name: paintData.name.replace(' 물감', ''), color: paintData.color });
            }
        });
        // 중복 색상 제거 (같은 color 코드 기준)
        const seen = new Set();
        return palette.filter(p => {
            if (seen.has(p.color)) return false;
            seen.add(p.color);
            return true;
        });
    },

    // 보유 팔레트를 그리기 엔진 설정에 반영
    syncPaletteWithShop() {
        try {
            const owned = this.buildOwnedPalette();
            const colors = owned.map(p => p.color);
            if (Array.isArray(colors) && colors.length > 0) {
                drawConfig.colors = colors;
                // DrawUIManager 동기화 (현재 선택 색상이 팔레트에 없으면 첫 색으로 설정)
                if (window.DrawUIManager && DrawUIManager.state) {
                    const current = DrawUIManager.state.currentColor;
                    if (!colors.includes(current)) {
                        DrawUIManager.state.currentColor = colors[0];
                    }
                    DrawUIManager.reflectSelectedColor();
                }
            }
        } catch (e) {
            console.warn('syncPaletteWithShop failed', e);
        }
    },

    renderMyPalette(container, purchased) {
        const currentPalette = this.buildOwnedPalette();

        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'my-palette-container';

        const swatchesHTML = currentPalette.map(paint => 
            `<div class="my-palette-swatch" style="background-color: ${paint.color};" title="${paint.name}"></div>`
        ).join('');

        paletteContainer.innerHTML = `
            <h5 class="my-palette-title">나의 팔레트 (${currentPalette.length}색)</h5>
            <div class="my-palette-grid">${swatchesHTML}</div>
        `;

        container.appendChild(paletteContainer);
    },

    createShopItemCard(container, category, itemId, item, playerLevel, playerGold) {
        const purchased = PlayerData.get('purchasedItems');
        let isPurchased = false;
        if (itemId === 'beginnerPaletteSet') isPurchased = purchased.beginnerPaletteSet;
        else if (itemId === 'basicPaletteSet') isPurchased = purchased.basicPaletteSet;
        else if (itemId === 'skilledPaletteSet') isPurchased = purchased.skilledPaletteSet;
        else if (itemId === 'artisanPaletteSet') isPurchased = purchased.artisanPaletteSet;
        else if (category === 'paints') isPurchased = purchased.paints.includes(itemId);
        else if (category === 'tools') isPurchased = purchased.tools.includes(itemId);

        const isLocked = item.reqLevel && playerLevel < item.reqLevel;
        const canAfford = playerGold >= item.cost;
        const card = document.createElement('div');
        card.className = `shop-item-card ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}`;
        card.dataset.itemId = itemId;

        let iconHTML;
        if (item.unlocks && Array.isArray(item.unlocks)) {
            // 팔레트 세트 미리보기 생성
            const swatches = item.unlocks.map(paint => 
                `<div class="palette-set-swatch" style="background-color: ${paint.color};"></div>`
            ).join('');
            iconHTML = item.image
                ? `<div class="shop-item-icon"><img src="${item.image}" alt="${item.name}"></div>`
                : `<div class="shop-item-icon"><div class="palette-set-preview">${swatches}</div></div>`;
        } else if (item.color) {
            // 개별 물감 색상 미리보기
            iconHTML = `<div class="shop-item-icon paint-preview" style="background-color:${item.color};"></div>`;
        } else if (item.image) {
            iconHTML = `<div class="shop-item-icon"><img src="${item.image}" alt="${item.name}"></div>`;
        } else {
            // 일반 이모티콘 아이콘
            iconHTML = `<div class="shop-item-icon">${item.icon}</div>`;
        }
        
        let buttonHTML;
        if (isPurchased) {
            buttonHTML = `<button class="shop-buy-btn purchased-label" disabled>구매 완료 ✓</button>`;
        } else if (isLocked) {
            buttonHTML = `<button class="shop-buy-btn" disabled>요구 레벨: ${item.reqLevel}</button>`;
        } else {
            buttonHTML = `
                <button class="shop-buy-btn ${!canAfford ? 'disabled' : ''}" ${!canAfford ? 'disabled' : ''} onclick="Game.purchaseItem('${category}','${itemId}')">
                    <img src="assets/images/ui/icon/money_Icon.png" class="cost-icon" alt="골드">
                    <span>${item.cost}</span>
                </button>`;
        }

        card.innerHTML = `
            ${iconHTML}
            <div class="shop-item-info">
                <h5 class="shop-item-name">${item.name}</h5>
                ${item.shortDescription ? `<p class="shop-item-desc">${item.shortDescription}</p>` : (item.description ? `<p class="shop-item-desc">${item.description}</p>` : '')}
                ${item.reqLevel ? `<p class="shop-item-requirement">요구 레벨: ${item.reqLevel}</p>` : ''}
            </div>
            ${buttonHTML}
        `;
        container.appendChild(card);
    },

    renderToolsTab(playerLevel, playerGold, purchased) {
        const container = document.querySelector('[data-tab-content="tools"]');
        if (!container) return;
        container.innerHTML = '';
        Object.entries(shopData.tools).forEach(([itemId, item]) => {
            if (item.requiresTool && !(purchased.tools || []).includes(item.requiresTool)) {
                return;
            }
            this.createShopItemCard(container, 'tools', itemId, item, playerLevel, playerGold);
        });
    },

    renderConsumablesTab(playerLevel, playerGold, purchased) {
        const container = document.querySelector('[data-tab-content="consumables"]');
        if (!container) return;
        container.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];
        Object.entries(shopData.consumables).forEach(([itemId, item]) => {
            const itemData = purchased.consumables[itemId];
            const purchasedToday = itemData && itemData.date === today ? itemData.count : 0;
            const canPurchase = purchasedToday < item.dailyLimit;
            
            const card = document.createElement('div');
            card.className = `shop-item-card ${!canPurchase ? 'purchased' : ''}`;
            card.dataset.itemId = itemId;
            
            // 광고 시청 버튼 (골드 구매 대체)
            const buttonHTML = !canPurchase
                ? `<button class="shop-buy-btn" disabled>일일 한도 도달</button>`
                : `
                    <button class="shop-buy-btn ad-purchase-btn" onclick="Game.watchAdAndGetConsumable('${itemId}')">
                        <img src="assets/images/ui/icon/ad_Icon.png" class="ad-icon-full" alt="광고">
                    </button>`;
            
            let iconHTML = `<div class="shop-item-icon">${item.icon}</div>`;
            if (item.image) {
                iconHTML = `<div class="shop-item-icon"><img src="${item.image}" alt="${item.name}"></div>`;
            }
            card.innerHTML = `
                ${iconHTML}
                <div class="shop-item-info">
                    <h5 class="shop-item-name">${item.name}</h5>
                    <p class="shop-item-desc">${item.description}</p>
                    <p class="shop-item-requirement">구매 제한: 하루 ${item.dailyLimit}개<br>(오늘: ${purchasedToday}/${item.dailyLimit})</p>
                </div>
                ${buttonHTML}
            `;
            container.appendChild(card);
        });
    },

    watchAdAndGetConsumable(itemId) {
        const purchased = PlayerData.get('purchasedItems');
        const item = shopData.consumables[itemId];
        if (!item) return;

        const today = new Date().toISOString().split('T')[0];
        const itemData = purchased.consumables[itemId] || { date: today, count: 0 };

        if (itemData.date !== today) {
            itemData.date = today;
            itemData.count = 0;
        }

        if (itemData.count >= item.dailyLimit) {
            this.showNotification('오늘의 구매 한도에 도달했습니다!');
            return;
        }

        // 광고 시청 요청
        if (window.AdManager && typeof window.AdManager.showAd === 'function') {
            let hasEarnedReward = false;
            window.AdManager.showAd(
                // Reward Callback
                () => {
                    // 데이터 갱신 (보상 지급 시점에 다시 읽기)
                    hasEarnedReward = true;
                    const currentPurchased = PlayerData.get('purchasedItems');
                    const currentItemData = currentPurchased.consumables[itemId] || { date: today, count: 0 };
                    
                    currentItemData.count++;
                    currentPurchased.consumables[itemId] = currentItemData;
                    PlayerData.set('purchasedItems', currentPurchased);
                    
                    if (item.effectUses) {
                        PlayerData.addActiveConsumable(itemId, item.effectUses);
                    }
                },
                // Dismiss Callback
                () => {
                    if (hasEarnedReward) {
                        this.showNotification(`${item.name}을(를) 획득했습니다!`);
                        this.playPurchaseSound();
                        this.renderShopPanel();
                        this.updateShopStatus();
                    }
                    console.log('Ad dismissed');
                }
            );
        } else {
            console.warn('AdManager not found or showAd is not a function');
            this.showNotification('광고 시스템을 불러올 수 없습니다. (AdManager Missing)');
            
            // Fallback: 임시로 AdManager 재로드 시도 (비상용)
            if (!window.AdManager) {
                 console.log('Attempting to reload AdManager...');
                 try {
                     const script = document.createElement('script');
                     script.src = 'js/adManager.js';
                     script.onload = () => { 
                         if(window.AdManager) window.AdManager.init(); 
                         this.showNotification('광고 시스템을 재로딩했습니다. 다시 시도해주세요.');
                     };
                     document.body.appendChild(script);
                 } catch(e) {
                     console.error('AdManager reload failed', e);
                 }
            }
        }
    },

    purchaseItem(category, itemId) {
        const playerGold = PlayerData.get('gold');
        const purchased = PlayerData.get('purchasedItems');
        const item = shopData[category]?.[itemId];
        if (!item) return;
        
        // 소모품 구매 로직
        if (category === 'consumables') {
            const today = new Date().toISOString().split('T')[0];
            const itemData = purchased.consumables[itemId] || { date: today, count: 0 };

            if (itemData.date !== today) {
                itemData.date = today;
                itemData.count = 0;
            }

            if (itemData.count >= item.dailyLimit) {
                this.showNotification('오늘의 구매 한도에 도달했습니다!');
                return;
            }
            if (playerGold < item.cost) {
                this.showNotification('골드가 부족합니다!');
                return;
            }

            PlayerData.set('gold', playerGold - item.cost);
            // 골드 소모 이펙트 (상점 배지 기준)
            this.showGain('gold', -item.cost);
            itemData.count++;
            purchased.consumables[itemId] = itemData;
            PlayerData.set('purchasedItems', purchased);
            if (item.effectUses) {
                PlayerData.addActiveConsumable(itemId, item.effectUses);
            }
            this.showNotification(`${item.name}을(를) 구매했습니다!`);
            this.playPurchaseSound();
            this.renderShopPanel();
            this.updateShopStatus();
            return; // 소모품 처리 후 함수 종료
        }

        // 물감 구매 로직
        if (category === 'paints') {
            const item = shopData.paints[itemId];
            if (!item) return;
            if (item.requiresPalette && !purchased[item.requiresPalette]) {
                const reqName = shopData.paints[item.requiresPalette]?.name || '필수 팔레트';
                this.showNotification(`${reqName}을(를) 먼저 구매해야 합니다.`);
                return;
            }

            if (itemId === 'beginnerPaletteSet') {
                if (purchased.beginnerPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                this.showGain('gold', -item.cost);
                purchased.beginnerPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
                this.playPurchaseSound();
            } else if (itemId === 'basicPaletteSet') {
                if (purchased.basicPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                this.showGain('gold', -item.cost);
                purchased.basicPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
                this.playPurchaseSound();
            } else if (itemId === 'skilledPaletteSet') {
                if (purchased.skilledPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                this.showGain('gold', -item.cost);
                purchased.skilledPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
                this.playPurchaseSound();
            } else if (itemId === 'artisanPaletteSet') {
                if (purchased.artisanPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                this.showGain('gold', -item.cost);
                purchased.artisanPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
                this.playPurchaseSound();
            } else { // 개별 물감 구매 (특수 색상)
                if (purchased.paints.includes(itemId)) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                this.showGain('gold', -item.cost);
                purchased.paints.push(itemId);
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
                this.playPurchaseSound();
            }
            // 구매 후 팔레트 동기화 및 UI 갱신
            this.syncPaletteWithShop();
            this.renderShopPanel(); this.updateShopStatus();
            return;
        }

        // 일반 아이템 처리 (도구)
        if (purchased[category].includes(itemId)) { this.showNotification('이미 구매한 아이템입니다!'); return; }
        if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
        PlayerData.set('gold', playerGold - item.cost);
        this.showGain('gold', -item.cost);
        purchased[category].push(itemId); PlayerData.set('purchasedItems', purchased);
        this.showNotification(`${item.name}을(를) 구매했습니다!`);
        this.playPurchaseSound();
        // 도구 구매 후 브러시 및 기타 기능 동기화
        if (category === 'tools') {
            this.syncBrushesWithShop();
            this.syncBrushSliderWithShop();
            this.syncColorSliderWithShop();
            this.syncUndoButtonWithShop();
            this.syncFillButtonWithShop(); // 채우기 버튼 상태 갱신
        }
        this.renderShopPanel(); this.updateShopStatus();
    },

    showNotification(message) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;

        container.appendChild(toast);

        // 일정 시간 후 'removing' 클래스를 추가하여 사라지는 애니메이션 시작
        setTimeout(() => {
            toast.classList.add('removing');
        }, 1900); // CSS 애니메이션(2.2s)보다 약간 짧게

        // transition 애니메이션이 끝난 후 DOM에서 요소 제거
        toast.addEventListener('transitionend', (e) => {
            if (e.propertyName === 'height' && toast.classList.contains('removing')) {
                toast.remove();
            }
        });
    },

    playPurchaseSound() {
        if (window.AudioManager) {
            AudioManager.playSfx('buy');
        }
    },

    updateReputationTooltipContent() {
        const tooltip = document.getElementById('reputation-tooltip');
        if (!tooltip) return;
        const info = this._lastReputationInfo || this.getReputationBonusInfo();
        const currentValue = typeof info.value === 'number' ? info.value : (PlayerData.get('reputation') || 0);
        const tiers = [
            { tier: 'A', range: '90~100', bonus: '+50%', color: '#4f8ad9' },
            { tier: 'B', range: '70~89', bonus: '+20%', color: '#3bb4c5' },
            { tier: 'C', range: '31~69', bonus: '0%', color: '#f7c325' },
            { tier: 'D', range: '10~30', bonus: '-20%', color: '#f48b2a' },
            { tier: 'E', range: '0~9', bonus: '-40%', color: '#d93025' }
        ];
        const rows = tiers.map(row => `
            <tr class="${row.tier === info.tier ? 'active' : ''}">
                <th class="rep-tier" style="color:${row.color};">${row.tier}</th>
                <td>${row.range}</td>
                <td>${row.bonus}</td>
            </tr>
        `).join('');
        const bonusText = `${info.bonusPct >= 0 ? '+' : ''}${info.bonusPct}%`;
        tooltip.innerHTML = `
            <h4>명성 등급 : ${info.tier}</h4>
            <p>현재 명성: ${currentValue}</p>
            <p>골드 보너스: ${bonusText}</p>
            <table>
                <thead>
                    <tr><th>등급</th><th>범위</th><th>골드 보정</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    },

    toggleReputationTooltip() {
        const tooltip = document.getElementById('reputation-tooltip');
        if (!tooltip) return;
        if (tooltip.classList.contains('hidden')) {
            this.showReputationTooltip();
        } else {
            this.hideReputationTooltip();
        }
    },

    showReputationTooltip() {
        const tooltip = document.getElementById('reputation-tooltip');
        if (!tooltip) return;
        this.updateReputationTooltipContent();
        tooltip.classList.remove('hidden');
    },

    hideReputationTooltip() {
        const tooltip = document.getElementById('reputation-tooltip');
        if (!tooltip) return;
        tooltip.classList.add('hidden');
    },

    // ===== 기록(앨범) UI 관련 함수 =====
    openAlbum() {
        try { if (!PlayerData.get('tutorialCompleted') && !(typeof TutorialManager !== 'undefined' && TutorialManager.active)) return; } catch {}
        this.pauseGame();
        const overlay = document.getElementById('album-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.renderAlbumGrid();
        }
    },

    closeAlbum() {
        const overlay = document.getElementById('album-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.resumeGame();
    },

    renderAlbumGrid() {
        const gridContainer = document.getElementById('album-grid');
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        // PlayerData에서 완성된 작품 기록을 가져옴 (최신순)
        const artworks = PlayerData.data.artworks || [];
        
        if (artworks.length === 0) {
            gridContainer.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#777; font-family:\'GeumEunBoHwa\',cursive; margin-top:50px;">아직 완성한 작품이 없습니다.</p>';
            return;
        }

        // PlayerData에서 완성된 작품 기록을 가져옴 (이미 최신순으로 저장됨)
        const sortedArtworks = artworks;

        sortedArtworks.forEach((artwork, index) => {
            const polaroid = document.createElement('div');
            polaroid.className = 'polaroid';
            
            // 랜덤한 회전 각도 적용 (-5도 ~ +5도)
            const randomRotation = (Math.random() * 10 - 5).toFixed(2);
            polaroid.style.setProperty('--rot', randomRotation);

            polaroid.innerHTML = `
                <img src="${artwork.imageUrl || 'assets/images/ui/placeholder.png'}" alt="${artwork.questTitle}">
                <p>${artwork.questTitle}</p>
            `;

            polaroid.addEventListener('click', () => {
                this.openLogDetail(artwork);
            });

            gridContainer.appendChild(polaroid);
        });
    },

    openLogDetail(artwork) {
        const overlay = document.getElementById('log-detail-overlay');
        const imgEl = document.getElementById('log-detail-img');
        const infoEl = document.getElementById('log-detail-info');

        if (!overlay || !imgEl || !infoEl) return;

        if (window.AudioManager) {
            AudioManager.playSfx('open_paper');
        }

        // 이미지 설정
        imgEl.src = artwork.imageUrl || 'assets/images/ui/placeholder.png';

        // 평가 키를 한글로 변환
        const evaluationMap = {
            'reaction_perfect': '매우 만족',
            'reaction_good': '만족',
            'reaction_normal': '보통',
            'reaction_bad': '불만족',
            'reaction_terrible': '매우 불만족'
        };
        const evaluationText = evaluationMap[artwork.evaluation] || artwork.evaluation;

        // 정보 설정
        infoEl.innerHTML = `
            <h3>${artwork.questTitle}</h3>
            <p><strong>의뢰자:</strong>${artwork.npcName}</p>
            <p><strong>의뢰 내용:</strong>"${artwork.theme}"</p>
            <p><strong>완성일:</strong>${artwork.completionDate}</p>
            <p><strong>최종 평가:</strong>${evaluationText}</p>
            <div class="ai-comment">
                <strong>한줄평:</strong><br>
                "${artwork.comment}"
            </div>
            <p><strong>획득 보상:</strong></p>
            <div class="log-rewards">
                <div class="log-reward-item">
                    <img src="assets/images/ui/icon/money_Icon.png" alt="골드" class="reward-icon-small">
                    <span>${artwork.rewards.gold > 0 ? '+' : ''}${artwork.rewards.gold}</span>
                </div>
                <div class="log-reward-item">
                    <span class="reward-text-icon">XP</span>
                    <span>${artwork.rewards.xp > 0 ? '+' : ''}${artwork.rewards.xp}</span>
                </div>
                <div class="log-reward-item">
                    <img src="assets/images/ui/icon/fame_Icon.png" alt="명성" class="reward-icon-small">
                    <span>${artwork.rewards.reputation > 0 ? '+' : ''}${artwork.rewards.reputation}</span>
                </div>
            </div>
        `;

        overlay.classList.remove('hidden');
    },

    closeLogDetail() {
        const overlay = document.getElementById('log-detail-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    // ===== 출석체크 UI 관련 함수 =====
    openAttendance() {
        this.pauseGame();
        const overlay = document.getElementById('attendance-overlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.renderAttendanceGrid();
        }
    },

    closeAttendance() {
        const overlay = document.getElementById('attendance-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
        this.resumeGame();
    },

    renderAttendanceGrid() {
        const gridContainer = document.getElementById('attendance-grid');
        const claimBtn = document.getElementById('attendance-claim-btn');
        const daysLeftSpan = document.getElementById('attendance-days-left');
        
        if (!gridContainer) return;

        gridContainer.innerHTML = '';

        const currentDay = AttendanceData.getCurrentDay();
        const attendedDays = AttendanceData.getAttendedDays();
        const canAttend = AttendanceData.canAttendToday();

        // 남은 일수 표시
        const daysLeft = 16 - attendedDays.length;
        if (daysLeftSpan) {
            daysLeftSpan.textContent = `${daysLeft}일`;
        }

        // 16일치 출석 칸 생성
        AttendanceData.rewards.forEach((reward) => {
            const cell = document.createElement('div');
            cell.className = 'attendance-cell';
            cell.dataset.day = reward.day;

            // 출석 완료 여부 확인
            const isAttended = attendedDays.includes(reward.day);
            
            // 오늘 출석 가능한 날인지 확인
            const isToday = reward.day === currentDay && canAttend;

            if (isAttended) {
                cell.classList.add('attended');
            }
            if (isToday) {
                cell.classList.add('today');
            }

            // 보상 표시: 아이콘과 숫자만
            cell.innerHTML = `
                <div class="attendance-cell-day">D${reward.day}</div>
                <div class="attendance-cell-reward">
                    <img src="${reward.icon}" alt="보상" class="attendance-cell-icon">
                    <div class="attendance-cell-amount">${reward.amount}</div>
                </div>
            `;

            // 출석 완료된 칸에 도장 추가
            if (isAttended) {
                const stamp = document.createElement('div');
                stamp.className = 'attendance-stamp';
                stamp.textContent = '출석';
                cell.appendChild(stamp);
            }

            gridContainer.appendChild(cell);
        });

        // 보상받기 버튼 활성화/비활성화
        if (claimBtn) {
            claimBtn.disabled = !canAttend;
        }
    },

    claimAttendance() {
        const result = AttendanceData.attend();
        
        if (!result.success) {
            this.showNotification(result.message, 'info');
            return;
        }

        // 보상 메시지 표시
        this.showNotification(result.message, 'success');

        // UI 다시 렌더링 (도장 추가)
        this.renderAttendanceGrid();
    },

    // ===== 상세 정보 모달 (범용) =====
    openDetailModal(type, data) {
        const overlay = document.getElementById('detail-modal-overlay');
        const contentEl = document.getElementById('detail-modal-content');
        if (!overlay || !contentEl) return;

        if (type === 'skill') {
            this.renderSkillDetail(contentEl, data); // data는 skillId
        } else if (type === 'item') {
            this.renderItemDetail(contentEl, data); // data는 { category, itemId }
        }

        overlay.classList.remove('hidden');
    },

    closeDetailModal() {
        const overlay = document.getElementById('detail-modal-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    },

    renderSkillDetail(container, skillId) {
        const skill = skillData[skillId];
        const playerSkills = PlayerData.get('skills');
        const currentLevel = playerSkills[skillId] || 0;
        const playerGold = PlayerData.get('gold');
        const playerLevel = PlayerData.get('level'); // 플레이어 레벨 가져오기

        const levelsHtml = skill.levels.map((level, index) => {
            const levelNum = index + 1;
            let className = 'skill-detail-level-item';
            if (levelNum === currentLevel) {
                className += ' current';
            } else if (levelNum === currentLevel + 1) {
                className += ' next';
            }

            let effectText = level.effect;
            if (level.reqLevel && level.reqLevel > 1) {
                effectText += ` (요구 레벨: ${level.reqLevel})`;
            }

            return `<li class="${className}"><strong>Lv.${levelNum}:</strong> ${effectText}</li>`;
        }).join('');

        const isMaxLevel = currentLevel >= skill.levels.length;
        
        // 다음 레벨 정보 및 요구 레벨 확인
        const nextLevelInfo = !isMaxLevel ? skill.levels[currentLevel] : null;
        const reqLevelForNext = nextLevelInfo ? nextLevelInfo.reqLevel : null;
        const isLocked = reqLevelForNext && playerLevel < reqLevelForNext;

        let actionButtonHtml = '';

        if (isLocked) {
            actionButtonHtml = `<button class="upgrade-btn" disabled>요구 레벨: ${reqLevelForNext}</button>`;
        } else if (!isMaxLevel) {
            const nextLevelCost = nextLevelInfo.cost;
            const canAfford = playerGold >= nextLevelCost;
            // 강화 UI의 .upgrade-btn 스타일을 재사용합니다.
            actionButtonHtml = `
                <button class="upgrade-btn" ${!canAfford ? 'disabled' : ''} onclick="Game.upgradeSkillFromModal('${skillId}')">
                    <img src="assets/images/ui/icon/money_Icon.png" class="cost-icon" alt="골드">
                    <span>${nextLevelCost}</span>
                </button>
            `;
        } else {
             actionButtonHtml = `<button class="upgrade-btn" disabled>MAX</button>`;
        }


        const iconMarkup = skill.image
            ? `<img src="${skill.image}" alt="${skill.name}">`
            : (skill.icon || '');

        container.innerHTML = `
            <div class="skill-detail-header">
                <div class="skill-detail-icon">${iconMarkup}</div>
                <h3 class="skill-detail-title">${skill.name}</h3>
            </div>
            <p class="skill-detail-flavor-text">${skill.description}</p>
            <ul class="skill-detail-levels">
                ${levelsHtml}
            </ul>
            <div class="detail-modal-action">
                ${actionButtonHtml}
            </div>
        `;
    },

    renderItemDetail(container, itemData) {
        const { category, itemId } = itemData;
        const item = shopData[category]?.[itemId];
        if (!item) return;

        const purchased = PlayerData.get('purchasedItems');
        const playerGold = PlayerData.get('gold');
        const playerLevel = PlayerData.get('level');
        let isPurchased = false;
        if (category === 'paints') {
        if (itemId === 'beginnerPaletteSet') isPurchased = purchased.beginnerPaletteSet;
        else if (itemId === 'basicPaletteSet') isPurchased = purchased.basicPaletteSet;
            else if (itemId === 'skilledPaletteSet') isPurchased = purchased.skilledPaletteSet;
            else if (itemId === 'artisanPaletteSet') isPurchased = purchased.artisanPaletteSet;
            else isPurchased = purchased.paints.includes(itemId);
        } else if (category === 'tools') {
            isPurchased = purchased.tools.includes(itemId);
        } else if (category === 'consumables') {
            const today = new Date().toISOString().split('T')[0];
            const itemData = purchased.consumables[itemId];
            isPurchased = itemData && itemData.date === today && itemData.count >= (shopData.consumables[itemId]?.dailyLimit || 0);
        }

        let lockReason = '';
        if (!isPurchased) {
            if (item.reqLevel && playerLevel < item.reqLevel) {
                lockReason = `요구 레벨: ${item.reqLevel}`;
            } else if (category === 'paints' && item.requiresPalette && !purchased[item.requiresPalette]) {
                const reqName = shopData.paints[item.requiresPalette]?.name || '필수 팔레트';
                lockReason = `${reqName} 필요`;
            } else if (category === 'tools' && item.requiresTool && !(purchased.tools || []).includes(item.requiresTool)) {
                const reqName = shopData.tools[item.requiresTool]?.name || '필수 도구';
                lockReason = `${reqName} 필요`;
            }
        }

        // 상점 UI의 .shop-buy-btn 스타일을 재사용합니다.
        let actionButtonHtml = '';
        if (isPurchased) {
             actionButtonHtml = `<button class="shop-buy-btn purchased-label" disabled>구매 완료 ✓</button>`;
        } else if (lockReason) {
            actionButtonHtml = `<button class="shop-buy-btn" disabled>${lockReason}</button>`;
        } else {
            if (category === 'consumables') {
                // 소모품은 광고 시청 버튼
                actionButtonHtml = `
                     <button class="shop-buy-btn ad-purchase-btn" onclick="Game.watchAdAndGetConsumableFromModal('${itemId}')">
                        <img src="assets/images/ui/icon/ad_Icon.png" class="ad-icon-full" alt="광고">
                    </button>
                `;
            } else {
                // 그 외는 골드 구매 버튼
            const canAfford = playerGold >= item.cost;
            actionButtonHtml = `
                 <button class="shop-buy-btn" ${!canAfford ? 'disabled' : ''} onclick="Game.purchaseItemFromModal('${category}', '${itemId}')">
                    <img src="assets/images/ui/icon/money_Icon.png" class="cost-icon" alt="골드">
                    <span>${item.cost}</span>
                </button>
            `;
            }
        }
        
        const iconSegments = [];
        if (item.image) {
            iconSegments.push(`<div class="item-detail-hero"><img src="${item.image}" alt="${item.name}"></div>`);
        }
        if (item.unlocks && Array.isArray(item.unlocks)) {
            const swatches = item.unlocks.map(p => `<div class="palette-set-swatch" style="background-color: ${p.color};" title="${p.name}"></div>`).join('');
            iconSegments.push(`<div class="palette-set-preview">${swatches}</div>`);
        } else if (item.color) {
            iconSegments.push(`<div class="paint-preview paint-preview-large" style="background-color:${item.color};" title="${item.name}"></div>`);
        } else if (!item.image) {
            iconSegments.push(`<span>${item.icon}</span>`);
        }
        const iconHTML = iconSegments.join('');

        container.innerHTML = `
            <div class="item-detail-header">
                 <div class="item-detail-image">${iconHTML}</div>
                <h3 class="item-detail-title">${item.name}</h3>
            </div>
            <div class="item-detail-body">
                <p><strong>효과:</strong> ${item.longDescription || item.description}</p>
                ${item.reqLevel ? `<p><strong>요구 레벨:</strong> ${item.reqLevel}</p>`: ''}
                ${item.type ? `<p><strong>타입:</strong> ${item.type}</p>`: ''}
            </div>
            <div class="detail-modal-action">
                ${actionButtonHtml}
            </div>
        `;
    },

    upgradeSkillFromModal(skillId) {
        this.upgradeSkill(skillId); // 기존 강화 함수 재사용
        // this.closeDetailModal(); // 모달 닫기 제거

        // 모달 내용 새로고침
        const contentEl = document.getElementById('detail-modal-content');
        if (contentEl) {
            this.renderSkillDetail(contentEl, skillId);
        }
    },

    purchaseItemFromModal(category, itemId) {
        this.purchaseItem(category, itemId); // 기존 구매 함수 재사용
        this.closeDetailModal(); // 모달 닫기
    },

    watchAdAndGetConsumableFromModal(itemId) {
        this.watchAdAndGetConsumable(itemId);
        this.closeDetailModal();
    },

    consumeActiveConsumable(id) {
        if (!id) return;
        if (typeof PlayerData.consumeActiveConsumable === 'function') {
            PlayerData.consumeActiveConsumable(id);
        } else {
            const map = { ...(PlayerData.get('activeConsumables') || {}) };
            if (!map[id]) return;
            map[id] -= 1;
            if (map[id] <= 0) delete map[id];
            PlayerData.set('activeConsumables', map);
        }
    },

    getActiveConsumableCount(id) {
        if (typeof PlayerData.getActiveConsumableCount === 'function') {
            return PlayerData.getActiveConsumableCount(id);
        }
        const map = PlayerData.get('activeConsumables') || {};
        return map[id] || 0;
    },

    handleCanvasClear() {
        try {
            const eff = this.getEffect();
            if (!eff.lastFocusEnabled) return;
            if (this._lastFocusTriggered) return;
            if (!TimerManager || typeof TimerManager.remaining !== 'number') return;
            const remain = TimerManager.remaining;
            if (remain > 0 && remain < 10 && typeof TimerManager.addTime === 'function') {
                TimerManager.addTime(30);
                this._lastFocusTriggered = true;
                this.showNotification('최후의 집중! +30초 확보', 'success');
            }
        } catch (e) {
            console.warn('handleCanvasClear failed', e);
        }
    },

    // 현재 보유 브러시 사이즈 생성 (기본: 중간 8px, 세트 구매 시: 4, 8, 12px)
    buildOwnedBrushSizes() {
        const purchased = PlayerData.get('purchasedItems');
        const base = drawConfig.brushSizes;
        if (
            purchased &&
            Array.isArray(purchased.tools) &&
            purchased.tools.includes('beginnerBrushSet')
        ) {
            // 4, 12 추가 (+ 기존에 없는 값만)
            const set = new Set(base);
            set.add(4);
            set.add(12);
            // 정렬: 4,8,12 등 오름차순
            return Array.from(set).sort((a, b) => a - b);
        }
        return base;
    },

    // 보유 브러시 사이즈를 그리기 엔진 설정에 반영
    syncBrushesWithShop() {
        try {
            const sizes = this.buildOwnedBrushSizes();
            if (Array.isArray(sizes) && sizes.length > 0) {
                drawConfig.brushSizes = sizes;
                // 현재 선택된 붓 크기가 유효하지 않다면 첫 값으로 교정
                if (window.DrawUIManager && DrawUIManager.state) {
                    const current = DrawUIManager.state.brushSize;
                    if (!sizes.includes(current)) {
                        DrawUIManager.state.brushSize = sizes[0];
                        // 선택된 점 크기 반영 (색상점은 reflectSelectedColor에서 처리)
                        DrawUIManager.emit('brush:size', { size: DrawUIManager.state.brushSize });
                    }
                }
            }
        } catch (e) {
            console.warn('syncBrushesWithShop failed', e);
        }
    },

    // 붓 슬라이더 해금 여부 동기화
    syncBrushSliderWithShop() {
        try {
            const purchased = PlayerData.get('purchasedItems');
            const hasSlider = purchased && Array.isArray(purchased.tools) && purchased.tools.includes('precisionBrushDial');
            drawConfig.useSlider = !!hasSlider;
        } catch (e) {
            console.warn('syncBrushSliderWithShop failed', e);
        }
    },

    // 색상 투명도 슬라이더 해금 여부 동기화
    syncColorSliderWithShop() {
        try {
            const purchased = PlayerData.get('purchasedItems');
            const hasAlphaSlider = purchased && Array.isArray(purchased.tools) && purchased.tools.includes('spectralTintMixer');
            drawConfig.useAlphaSlider = !!hasAlphaSlider;
            if (window.DrawUIManager && DrawUIManager.state) {
                if (!hasAlphaSlider) {
                    DrawUIManager.state.currentAlpha = 1;
                }
                DrawUIManager.reflectSelectedColor();
            }
        } catch (e) {
            console.warn('syncColorSliderWithShop failed', e);
        }
    },

    // 보유 아이템에 따라 되돌리기 버튼 표시/숨김
    syncUndoButtonWithShop() {
        try {
            const purchased = PlayerData.get('purchasedItems');
            const hasUndo = purchased && Array.isArray(purchased.tools) && purchased.tools.includes('magicHourglass');
            const undoBtn = document.getElementById('btn-undo');
            if (undoBtn) {
                undoBtn.classList.toggle('hidden', !hasUndo);
            }
        } catch (e) {
            console.warn('syncUndoButtonWithShop failed', e);
        }
    },

    // 보유 아이템에 따라 채우기 버튼 표시/숨김
    syncFillButtonWithShop() {
        try {
            const purchased = PlayerData.get('purchasedItems');
            const hasFill = purchased && Array.isArray(purchased.tools) && purchased.tools.includes('paintBucket');
            const fillBtn = document.getElementById('btn-fill');
            if (fillBtn) {
                fillBtn.classList.toggle('hidden', !hasFill);
            }
        } catch (e) {
            console.warn('syncFillButtonWithShop failed', e);
        }
    },

    // 재도전 UI 표시 (기존 확인 모달 재사용)
    promptRetry(context) {
        const overlay = document.getElementById('detail-modal-overlay');
        const contentEl = document.getElementById('detail-modal-content');
        if (!overlay || !contentEl) return;

        // 게임 일시정지
        if (typeof this.pauseGame === 'function') {
            this.pauseGame();
        }

        // 모달 내용 설정 (우측 상단 닫기 버튼을 가리기 위해 close-btn 스타일 조정 또는 새로운 HTML 구조 사용)
        // 기존 detail-modal 구조를 덮어쓰므로, 닫기 버튼이 detail-modal-content 외부에 있다면 CSS로 처리 필요
        // 확인 결과: detail-modal-content 내부에 닫기 버튼이 있는 것이 아니라 overlay 자체에 있거나 별도 요소일 수 있음.
        // 하지만 여기서는 contentEl.innerHTML을 덮어쓰므로 contentEl 내부의 닫기 버튼은 사라짐.
        // 만약 detail-modal-close 버튼이 contentEl 외부에 있다면 숨겨야 함.
        const closeBtn = document.getElementById('detail-modal-close');
        if (closeBtn) closeBtn.style.display = 'none';

        contentEl.innerHTML = `
            <div style="text-align:center">
                <h3 style="font-family:'Amsterdam'; margin-bottom:15px; font-size: 30px;">결과가 아쉽나요?</h3>
                <p style="font-family:'Amsterdam','GeumEunBoHwa',cursive;font-weight:700;color:#5a3d2f;white-space:pre-wrap; font-size: 18px; line-height: 1.5; margin-bottom: 20px;">광고를 보고 이 의뢰를 다시 도전할 수 있습니다.<br><span style="color:#d93025; font-size:0.9em;">(현재의 불만족 기록은 삭제됩니다)</span></p>
                <div class="detail-modal-action confirm-actions" style="display:flex;justify-content:center; gap: 10px;">
                    <button class="shop-buy-btn btn-positive" id="retry-yes" style="display:flex; align-items:center; justify-content:center; gap:5px; padding: 10px 20px;">
                        <img src="assets/images/ui/icon/ad_Icon.png" style="width:30px; height:30px; vertical-align:middle;">
                        <span>다시 도전</span>
                    </button>
                    <button class="upgrade-btn btn-negative" id="retry-no" style="padding: 10px 20px;">그냥 끝내기</button>
                </div>
            </div>`;
        
        overlay.classList.remove('hidden');
        // 배경 클릭 닫기 방지 플래그 설정
        overlay.dataset.preventClose = 'true';

        // 팝업 오픈 사운드
        if (window.AudioManager) {
            AudioManager.playSfx('click');
        }

        const yes = document.getElementById('retry-yes');
        const no = document.getElementById('retry-no');
        
        // 정리 함수
        const cleanup = () => {
            // 방지 플래그 해제
            delete overlay.dataset.preventClose;
            this.closeDetailModal();
            // 일시정지 해제
            if (typeof this.resumeGame === 'function') {
                this.resumeGame();
            }
            // 닫기 버튼 복구
            if (closeBtn) closeBtn.style.display = '';
        };

        // overlay 클릭 이벤트 덮어쓰기 (초기화 코드에서 preventClose 체크하므로 여기선 stopPropagation만)
        overlay.onclick = (e) => {
            e.stopPropagation();
        };

        if (yes) yes.onclick = () => {
             // 긍정 버튼 사운드
             if (window.AudioManager) {
                 AudioManager.playSfx('buy');
             }

             if (window.AdManager) {
                 let hasEarnedReward = false;
                 window.AdManager.showAd(
                     () => { 
                         // Reward Callback
                         hasEarnedReward = true; 
                     },
                     () => {
                         // Dismiss Callback
                         if (hasEarnedReward) {
                             cleanup();
                             this.startRetry(context);
                         } else {
                             // 광고를 봤지만 보상을 못 받은 경우 등
                             // 여기서는 아무 동작 안하거나 닫지 않음으로 재시도 유도
                         }
                     }
                 );
             } else {
                 // AdManager 없는 경우 바로 실행 (테스트/예외)
                 cleanup();
                 this.startRetry(context);
             }
        };

        if (no) no.onclick = () => {
            // 부정/닫기 버튼 사운드
            if (window.AudioManager) {
                AudioManager.playSfx('close');
            }
            cleanup();
            // 재도전을 포기했으므로 세션 종료 (NPC 퇴장 및 다음 손님 스케줄링)
            this.finishCustomerSession();
        };
    },

    // 재도전 시작 처리
    startRetry(context) {
        // 1. 마지막 기록 및 보상 제거
        if (PlayerData.data.artworks && PlayerData.data.artworks.length > 0) {
            // 최신 기록 가져오기
            const lastArtwork = PlayerData.data.artworks[0];
            
            // 보상 회수 (골드, 명성, 경험치)
            if (lastArtwork.rewards) {
                const { gold, reputation, xp } = lastArtwork.rewards;
                
                // 골드 회수
                if (gold > 0) {
                    PlayerData.data.gold = Math.max(0, PlayerData.data.gold - gold);
                }
                
                // 명성 회수: 저장된 이전 명성 값으로 정확히 복구
                if (typeof lastArtwork.previousReputation === 'number') {
                    PlayerData.data.reputation = lastArtwork.previousReputation;
                    console.log(`[Retry] Reputation restored to ${PlayerData.data.reputation}`);
                } else if (reputation !== 0) {
                    // Fallback: 저장된 값이 없을 경우 역연산 (불완전할 수 있음)
                    // reputation이 양수(획득)면 빼고, 음수(차감)면 더함
                    let newRep = PlayerData.data.reputation - reputation;
                    PlayerData.data.reputation = Math.max(0, Math.min(100, newRep));
                }
                
                // 경험치 회수 및 레벨 다운 처리
                if (xp > 0) {
                    PlayerData.data.xp -= xp;
                    // 레벨 다운 루프 (경험치가 음수가 된 경우)
                    while (PlayerData.data.xp < 0 && PlayerData.data.level > 1) {
                        // 이전 레벨 요구 경험치 역산 (approximation: next / 1.5)
                        const prevNextXp = Math.ceil(PlayerData.data.nextLevelXp / 1.5);
                        PlayerData.data.nextLevelXp = prevNextXp;
                        PlayerData.data.level--;
                        PlayerData.data.xp += prevNextXp;
                        console.log(`[Retry] Leveled down to ${PlayerData.data.level}`);
                    }
                    if (PlayerData.data.xp < 0) PlayerData.data.xp = 0; // 최소 0 보장
                }
                console.log(`[Retry] Rewards reverted: Gold -${gold}, Rep -${reputation}, XP -${xp}`);
            }

            // 기록 삭제
            PlayerData.data.artworks.shift();
            console.log("Last artwork removed for retry.");
        }

        // 2. 완료된 의뢰 ID 제거 (다시 수행해야 하므로)
        if (context.activeQuest && context.activeQuest.id) {
            const qIdx = PlayerData.data.completedQuestIds.indexOf(context.activeQuest.id);
            if (qIdx > -1) {
                PlayerData.data.completedQuestIds.splice(qIdx, 1);
                console.log(`[Retry] Quest ${context.activeQuest.id} unmarked.`);
            }
        }
        if (context.activeAdhocRequest && context.activeAdhocRequest.requestId) {
            const rIdx = PlayerData.data.completedRequestIds.indexOf(context.activeAdhocRequest.requestId);
            if (rIdx > -1) {
                PlayerData.data.completedRequestIds.splice(rIdx, 1);
                console.log(`[Retry] Request ${context.activeAdhocRequest.requestId} unmarked.`);
            }
        }
        
        // 변경 사항 저장
        PlayerData.emitChange();

        // 3. 의뢰 맥락 복구
        this.activeQuest = context.activeQuest;
        this.activeAdhocRequest = context.activeAdhocRequest;
        this.currentRequest = context.currentRequest;
        this.currentCustomer = context.npcId;
        this.currentNpcId = context.npcId;

        // 4. PlayerData 동기화
        try {
            PlayerData.set('currentNpcId', context.npcId);
            if (context.activeQuest) PlayerData.set('currentQuestId', context.activeQuest.id);
            if (context.activeAdhocRequest) PlayerData.set('currentRequestId', context.activeAdhocRequest.requestId);
        } catch (e) {
            console.warn("Retry sync error:", e);
        }

        // 4. 다음 방문 예약 취소 (즉시 재시작이므로)
        if (this._nextVisitorTimer) {
            clearTimeout(this._nextVisitorTimer);
            this._nextVisitorTimer = null;
        }

        // 재도전 중 다른 NPC 방문 방지
        // 현재 세션이 진행 중임을 보장하기 위해 currentCustomer 설정 (이미 위에서 복구함)
        // 추가로 scheduleNextVisitor가 실수로 호출되지 않도록 확인 필요하지만, 
        // startRetry가 finishCustomerSession 이후에 불리므로, finishCustomerSession 내부의 스케줄링이 이미 돌고 있을 수 있음.
        // 따라서 여기서 _nextVisitorTimer를 확실히 제거하고, 진행 중 상태를 유지해야 함.

        // 5. NPC 다시 소환 및 화면 전환
        // 기존 NPC 요소가 남아있다면 모두 제거 (재도전 시 중복 생성 방지)
        const npcId = context.npcId;
        // ID로 제거
        const existingNpc = document.getElementById(`npc-${npcId}`);
        if (existingNpc) {
            existingNpc.remove();
        }
        // 클래스로도 한번 더 확인하여 제거 (혹시 ID가 다를 경우 대비)
        const wrappers = document.querySelectorAll('.npc-wrapper');
        wrappers.forEach(el => el.remove());

        // NPCManager 내부 참조도 제거해야 안전함 (dismissNPC 로직 일부 차용)
        if (NPCManager.npcs && NPCManager.npcs[npcId]) {
            const npcData = NPCManager.npcs[npcId];
            if (npcData.dialogBox) npcData.dialogBox.remove();
            if (npcData.element && npcData.element.parentNode) npcData.element.remove();
            delete NPCManager.npcs[npcId];
        }

        NPCManager.spawnNPC(context.npcId);
        NPCManager.showNPC(context.npcId);
        
        // 재도전 횟수 차감 등을 위해 플래그 설정
        this._isRetrySession = true;

        this.changeScreen('#main-container', '#drawing-mode-container', 'slide');
        this.showNotification('의뢰에 다시 도전합니다!', 'info');
    },

    // 첫 의뢰 특별 대사 처리
    handleFirstQuestDialogue(npcId, reactionKey, extraDialogue) {
        // 튜토리얼 상태 미리 캡처 (Dialogue callback에서 해제되기 전)
        const isTutorialMode = !!this._solveTutorialActive;

        // 첫 의뢰가 아니거나, 토마스가 아닌 경우 일반 대사로 진행
        if (PlayerData.get('hasCompletedFirstQuest') || npcId !== 'thomas') {
            // solve 튜토리얼 중이면 마무리 멘트를 덧붙임
            let lines = Array.isArray(extraDialogue) ? extraDialogue.slice() : [];
            try {
                if (isTutorialMode && npcId === 'thomas' && this.activeAdhocRequest && this.activeAdhocRequest.requestId === 'solve_thomas_dinner') {
                    lines.push('이제 알려줄 건 다 알려준 것 같네.');
                    lines.push('이제부터는 자네가 이 꿈의 공방을 운영하며 마을을 풍요롭게 만들어주게나!');
                }
            } catch {}
            DialogueManager.startDialogue(npcId, reactionKey, lines, () => {
                // solve 튜토리얼 플래그 해제
                this._solveTutorialActive = false;

                // 나쁜 결과(reaction_bad, reaction_terrible)인 경우 재도전 기회 제공
                // 단, 이미 재도전한 세션(_isRetrySession)이거나 solve 튜토리얼인 경우 제외
                // 요구사항: 한 의뢰 당 1회만 가능 -> this._isRetrySession 체크
                const canRetry = !this._isRetrySession && !isTutorialMode && (reactionKey === 'reaction_bad' || reactionKey === 'reaction_terrible');
                
                if (canRetry) {
                    // 현재 의뢰 맥락 저장
                    const retryContext = {
                        npcId: this.currentCustomer || npcId,
                        activeQuest: this.activeQuest,
                        activeAdhocRequest: this.activeAdhocRequest,
                        currentRequest: this.currentRequest
                    };

                    // 재도전 팝업 표시
                    // 주의: finishCustomerSession을 아직 호출하지 않음으로써 NPC가 떠나지 않도록 유지.
                    // 팝업에서 '그냥 끝내기' 선택 시 finishCustomerSession 호출됨.
                    // '다시 도전' 선택 시 startRetry 호출됨 (startRetry 내부에서 상태 복구).
                    this.promptRetry(retryContext);
                } else {
                    // 재도전 기회가 없거나 성공한 경우
                    this._isRetrySession = false; // 플래그 초기화
                    this.finishCustomerSession();
                }
            });
            return;
        }

        // 첫 의뢰 완료 플래그 설정
        PlayerData.set('hasCompletedFirstQuest', true);

        // 평가 결과에 따라 대사 분기
        // reaction_normal(보통, 40~59점) 이상이면 pass, 그 미만이면 fail
        const isPass = (reactionKey === 'reaction_perfect' || 
                       reactionKey === 'reaction_good' || 
                       reactionKey === 'reaction_normal');
        
        const firstQuestDialogueKey = isPass ? 'first_quest_pass' : 'first_quest_fail';
        
        // 전역 npcData에서 첫 의뢰 전용 대사 가져오기
        const rawFirstQuestLines = window.npcData?.[npcId]?.dialogues?.[firstQuestDialogueKey] || [];
        
        // 보통 등급일 때 첫 줄 앞에 '그래도 ' 접두어 추가 (토마스 튜토리얼 한정)
        let firstQuestLines = rawFirstQuestLines.slice();
        if (isPass && reactionKey === 'reaction_normal' && firstQuestLines.length > 0) {
            const firstLine = firstQuestLines[0] || '';
            if (typeof firstLine === 'string' && !firstLine.startsWith('그래도 ')) {
                firstQuestLines[0] = '그래도 ' + firstLine;
            }
        }
        
        console.log('[First Quest] Combining dialogues:', {
            extraDialogue: extraDialogue,
            firstQuestLines: firstQuestLines,
            combined: [...extraDialogue, ...firstQuestLines]
        });
        
        // extraDialogue(LLM 한줄평) 뒤에 첫 의뢰 대사를 붙임
        const combinedDialogue = [...extraDialogue, ...firstQuestLines];
        
        DialogueManager.startDialogue(npcId, reactionKey, combinedDialogue, () => {
            // 모든 대사가 끝나면 방문 종료 및 다음 스케줄링
            console.log('[First Quest] Tutorial will start here...');
            // 토마스는 유지한 채 메인 UI 튜토리얼 시작
            try { if (window.TutorialManager && typeof TutorialManager.startMainTutorial === 'function') TutorialManager.startMainTutorial(); } catch {}
        });
    },

    getCurrentQuestInfo() {
        const npcId = this.currentCustomer || 'guest';

        // 기본값
        let customerName = '자유 주제';
        let customerPersona = '자유롭게 그림을 그리는 상황';
        let requestText = this.currentRequest || '자유 주제';
        let requestId = null;
        let questType = null; // 'draw' | 'solve' (solve: ANALYZE/CREATE 흐름)
        let analysisItems = null;
        let createMeta = null;
        let likes = [];
        let dislikes = [];
        let exampleUtterances = [];
        let speechStyle = '';

        // 의뢰가 활성화되어 있으면 우선 반영
        if (this.activeQuest) {
            try {
                requestText = this.activeQuest.theme || requestText;
                
                requestId = this.activeQuest.requestId || requestId;
                questType = this.activeQuest.questType || questType;
                if (Array.isArray(this.activeQuest.analysisItems)) analysisItems = this.activeQuest.analysisItems;
                if (this.activeQuest.createMeta) createMeta = this.activeQuest.createMeta;
            } catch {}
        }

        // 랜덤 방문 임시 요청이 있으면 반영(제약/가이드는 없음)
        if (!this.activeQuest && this.activeAdhocRequest && this.activeAdhocRequest.requestText) {
            requestText = this.activeAdhocRequest.requestText;
            // 랜덤 요청은 activeAdhocRequest에 실린 id 우선 사용
            if (this.activeAdhocRequest.requestId) {
                requestId = this.activeAdhocRequest.requestId;
            } else {
                // 최후 수단: 텍스트 기반 유추
                try { requestId = requestId || this.resolveRequestIdFromText(requestText); } catch {}
            }
        }

        // solve 자동 판별: requestId가 solve 정의에 있으면 questType 부여
        try {
            if (!questType && requestId && window.REQUEST_SOLVE && window.REQUEST_SOLVE[requestId]) {
                questType = 'solve';
            }
        } catch {}

        // npcData 기반 정보 적용
        try {
            if (typeof npcData !== 'undefined' && npcData[npcId]) {
                const npc = npcData[npcId];
                customerName = npc.name || customerName;
                customerPersona = npc.persona || customerPersona;
                speechStyle = npc.speechStyle || speechStyle;
                likes = Array.isArray(npc.likes) ? npc.likes : likes;
                dislikes = Array.isArray(npc.dislikes) ? npc.dislikes : dislikes;
                // 예시 대사 수집
                if (npc.dialogues) {
                    ['reaction_perfect','reaction_good','reaction_normal','reaction_bad','reaction_terrible'].forEach(key => {
                        const arr = npc.dialogues[key];
                        if (Array.isArray(arr) && arr.length) exampleUtterances.push(arr[0]);
                    });
                }
            }
        } catch {}

        // customers/quests가 존재할 때만 보강
        try {
            if (this.customers && this.quests && this.customers[npcId]) {
                const customer = this.customers[npcId];
                const quest = this.quests[customer.questId];
                if (quest) {
                    requestText = quest.description || requestText;
                }
            }
        } catch {}

        return {
            customerId: npcId,
            customerName,
            customerPersona,
            requestText,
            requestId,
            questType,
            likes,
            dislikes,
            exampleUtterances,
            language: 'ko',
            analysisItems,
            createMeta,
            speechStyle
        };
    },

    // 요청 텍스트로부터 사전 정의된 rubric requestId를 추론
    resolveRequestIdFromText(text) {
        if (!text || typeof text !== 'string') return null;
        const t = text.toLowerCase();
        // Thomas 고정 문구 우선 매칭 (정확 매칭 우선)
        if (t.includes('저녁') && t.includes('메뉴')) return 'solve_thomas_dinner';
        if (t.includes('파도를 가르는 돌고래 한 마리')) return 'thomas_req_dolphin';
        if (t.includes('커다란 붉은 사과 하나')) return 'thomas_req_apple';
        if (t.includes('활짝 웃는 사람의 얼굴')) return 'thomas_req_smile_face';
        if (t.includes('귀여운 고양이 한 마리')) return 'thomas_req_cat';
        // Theo 세부 문구 우선 매칭 (welcomeSets/requests)
        if (t.includes('탐스럽게 잘 익은 토마토')) return 'theo_req_tomato';
        if (t.includes('빛을 받으며 반짝이는 토마토 한 개')) return 'theo_req_tomato_glossy';
        if (t.includes('위풍당당하고 멋진 허수아비')) return 'theo_req_scarecrow';
        if (t.includes('과일이 주렁주렁 열린 풍요로운 과수원')) return 'theo_req_orchard';
        if (t.includes('비 오는 창밖 풍경과 따뜻한 찻잔')) return 'theo_req_rain_teacup';
        if (t.includes('싱그러운 어린잎')) return 'theo_req_sprout';
        if (t.includes('불난 집을 구해줘')) return 'solve_house_fire';
        if (t.includes('부자가 되고 싶어요')) return 'solve_get_rich';
        // 포괄적 키워드 매칭 제거(공통 루브릭 제거 방침)
        // 마지막 폴백 없음: 매칭 실패 시 null
        return null;
    },

    // rubrics 기반 평가 처리: LLM 결과를 이용해 점수/코멘트 결정
    processEvaluation(requestDef, llmResults) {
        if (!requestDef || !Array.isArray(requestDef.rubrics)) {
            return { score: 0, comment: '' };
        }

        const rubrics = requestDef.rubrics;
        let finalScore = 0;       // base 100점
        let bonusScore = 0;       // 가산점 (예: 창의성)
        const passedSuccesses = []; // { w, msg }
        const failedFails = [];     // { w, msg, isSubject }
        let subjectFailMessage = null;

        for (const rule of rubrics) {
            const res = llmResults ? llmResults[rule.id] : null;
            const isNumber = typeof res === 'number' && isFinite(res);

            let factor = 0; // 0~1
            if (res === true) {
                factor = 1;
            } else if (isNumber) {
                const clamped = Math.max(0, Math.min(2, res));
                factor = clamped / 2; // 0->0, 1->0.5, 2->1
            }

            const weight = rule.weight || 0;
            const isBonus = !!rule.isBonus;
            if (factor > 0) {
                if (isBonus) {
                    bonusScore += weight * factor;
                } else {
                    finalScore += weight * factor;
                }
                if (rule.successMessage) passedSuccesses.push({ w: weight, msg: rule.successMessage });
            } else {
                const isSubject = !!rule.isSubject;
                // 보너스 항목 실패는 실패 대사에 포함하지 않음
                if (!isBonus && rule.failMessage) failedFails.push({ w: weight, msg: rule.failMessage, isSubject });
                if (isSubject && rule.failMessage && !subjectFailMessage) {
                    subjectFailMessage = rule.failMessage;
                }
            }
        }

        // 주제가 틀린 경우: 해당 대사만 단독 출력
        if (subjectFailMessage) {
            return { score: finalScore + bonusScore, comment: subjectFailMessage };
        }

        let finalMessage = '';
        const totalScore = finalScore + bonusScore;
        if (finalScore >= 60) {
            passedSuccesses.sort((a, b) => (a.w - b.w));
            const msgs = passedSuccesses.map(x => x.msg).filter(Boolean);
            if (msgs.length >= 2) {
                finalMessage = `${msgs[0]} 그리고 ${msgs[1]}`;
            } else if (msgs.length === 1) {
                finalMessage = msgs[0];
            } else {
                finalMessage = requestDef.successMessage || '';
            }
        } else {
            // '보통(40~59)' 구간: 부족한 점 + '그래도' + 좋은 점
            if (totalScore >= 40 && totalScore < 60) {
                const failTop = failedFails.slice().sort((a, b) => (b.w - a.w))[0]?.msg || '';
                const successTop = passedSuccesses.slice().sort((a, b) => (b.w - a.w))[0]?.msg || '';
                if (failTop && successTop) {
                    finalMessage = `${failTop} 그래도 ${successTop}`;
                } else if (failTop) {
                    finalMessage = failTop;
                } else if (successTop) {
                    finalMessage = successTop;
                } else {
                    finalMessage = '';
                }
            } else {
                // 그 외(40 미만): 기존처럼 부족한 점 2개를 '그리고'로 연결
                failedFails.sort((a, b) => (b.w - a.w));
                const msgs = failedFails.map(x => x.msg).filter(Boolean);
                if (msgs.length >= 2) {
                    finalMessage = `${msgs[0]} 그리고 ${msgs[1]}`;
                } else if (msgs.length === 1) {
                    finalMessage = msgs[0];
                } else {
                    finalMessage = '';
                }
            }
        }

        return { score: totalScore, comment: finalMessage };
    },
};

// 전역 노출: draw.js 등에서 window.Game으로 접근
window.Game = Game;

window.addEventListener('DOMContentLoaded', () => {
    Game.init();

    // 모바일 백그라운드 진입/복귀 시 오디오 및 게임 상태 일시정지 처리
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // 백그라운드 진입
            if (window.AudioManager && typeof AudioManager.pauseAll === 'function') {
                AudioManager.pauseAll();
            }
            // 필요 시 게임 타이머나 애니메이션도 여기서 일시정지 처리 가능
        } else {
            // 포그라운드 복귀
            // 광고 시청 중이라면 음악을 재개하지 않음 (AdManager가 닫힐 때 처리함)
            if (window.AdManager && window.AdManager.isShow) {
                console.log('[main.js] Ad is showing, deferring audio resume.');
                return;
            }

            if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                console.log('[main.js] Resuming audio on foreground.');
                AudioManager.resumeAll();
            }
            // 일시정지된 게임 로직 재개
        }
    });
});

// ===== 토마스 재등장: 문제 해결 튜토리얼 트리거 =====
Game.triggerThomasSolveTutorial = function() {
    const npcId = 'thomas';
    const spawned = NPCManager.spawnNPC(npcId);
    if (spawned) {
        Game.currentCustomer = npcId;
        Game.currentNpcId = npcId;
        try {
            PlayerData.set('currentNpcId', npcId);
        } catch {}
        NPCManager.showNPC(npcId);
        const lines = [
            '미처 말하지 못한 게 있네.',
            '이 꿈의 공방에는 신비한 힘이 있어.',
            '우리가 그린 그림이 현실에서 누군가의 문제를 해결하기도 하지.',
            '오늘은 특별 의뢰를 해보세. 내 저녁 메뉴를 정해줄 수 있겠나?'
        ];
        DialogueManager.startDialogue(npcId, 'welcome', lines, () => {
            // 문제 해결 튜토리얼 활성화 플래그
            Game._solveTutorialActive = true;
            Game.activeQuest = null;
            Game.activeAdhocRequest = {
                npcId,
                requestId: 'solve_thomas_dinner',
                requestText: '맛있는 저녁 메뉴를 그려주게!',
                difficulty: Game.getDifficultyForRequest('solve_thomas_dinner')
            };
            // 드로잉 화면의 의뢰 텍스트는 this.currentRequest를 표시하므로 즉시 갱신
            Game.currentRequest = Game.activeAdhocRequest.requestText;
            Game.changeScreen('#main-container', '#drawing-mode-container', 'slide');
        });
    }
};
