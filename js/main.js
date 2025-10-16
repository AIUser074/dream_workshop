const Game = {
    // playerData 객체 제거
    currentRequest: '', // 현재 요청 텍스트 저장
    currentNpcId: 'thomas', // 현재 손님 NPC (추후 교체 가능)
    _dialogueWasTyping: false, // 대화 타이핑 중 일시정지 여부 플래그

    init() {
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

        // 커스텀 이벤트 리스너 등록
        document.addEventListener('drawing:finished', this.showResult.bind(this));

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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // 열려있는 모달을 닫기 (우선순위: 상점 > 강화 > 설정)
                const shopOverlay = document.getElementById('shop-overlay');
                const upgradeOverlay = document.getElementById('upgrade-overlay');
                const settingsOverlay = document.getElementById('settings-overlay');
                if (shopOverlay && !shopOverlay.classList.contains('hidden')) {
                    this.closeShop();
                } else if (upgradeOverlay && !upgradeOverlay.classList.contains('hidden')) {
                    this.closeUpgrade();
                } else if (settingsOverlay && !settingsOverlay.classList.contains('hidden')) {
                    this.closeSettings();
                }
            }
        });

        // 슬라이더 초기화 및 라벨 동기화
        this.initSettingsSliders();

        // 강화 패널 이벤트 바인딩
        const upgradeBtn = document.getElementById('btn-upgrade');
        if (upgradeBtn) upgradeBtn.addEventListener('click', () => this.openUpgrade());
        const upgradeCloseBtn = document.getElementById('upgrade-close');
        if (upgradeCloseBtn) upgradeCloseBtn.addEventListener('click', () => this.closeUpgrade());
        // 상점 패널 이벤트 바인딩
        const shopBtn = document.getElementById('btn-shop');
        if (shopBtn) shopBtn.addEventListener('click', () => this.openShop());
        const shopCloseBtn = document.getElementById('shop-close');
        if (shopCloseBtn) shopCloseBtn.addEventListener('click', () => this.closeShop());
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
            bgmRange.addEventListener('input', () => {
                this.settings.bgm = Number(bgmRange.value);
                bgmValue.textContent = `${this.settings.bgm}%`;
                this.persistSettings();
                // 실제 오디오 엔진이 붙으면 여기서 볼륨 적용
            });
        }
        if (sfxRange && sfxValue) {
            sfxRange.value = String(this.settings.sfx);
            sfxValue.textContent = `${this.settings.sfx}%`;
            sfxRange.addEventListener('input', () => {
                this.settings.sfx = Number(sfxRange.value);
                sfxValue.textContent = `${this.settings.sfx}%`;
                this.persistSettings();
                // 실제 사운드 엔진 적용 위치
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
            const isLocked = skill.reqLevel && playerLevel < skill.reqLevel;

            const groupContainer = document.querySelector(`.upgrade-tab-content[data-tab-content="${skill.group}"] [data-skill-group="${skill.group}"]`);
            if (!groupContainer) continue;

            let skillCard = groupContainer.querySelector(`[data-skill-id="${skillId}"]`);
            if (!skillCard) {
                skillCard = document.createElement('div');
                skillCard.className = 'skill-card';
                skillCard.dataset.skillId = skillId;
                groupContainer.appendChild(skillCard);
            }

            const currentEffect = currentLevel > 0 ? skill.levels[currentLevel - 1].effect : '없음';
            const nextLevel = currentLevel + 1;
            const isMaxLevel = currentLevel >= maxLevel;
            const nextEffect = !isMaxLevel ? skill.levels[currentLevel].effect : '최고 레벨 달성';
            const upgradeCost = !isMaxLevel ? skill.levels[currentLevel].cost : null;

            let upgradeButtonHTML;
            if (isLocked) {
                upgradeButtonHTML = `<button class="upgrade-btn" disabled><span>요구 레벨: ${skill.reqLevel}</span></button>`;
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
            
            skillCard.className = `skill-card ${isLocked ? 'locked' : ''}`;
            skillCard.innerHTML = `
                <div class="skill-media">
                    <div class="skill-icon-ph">${skill.icon}</div>
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
        
        // 현재 손님 NPC 지정 (추후 교체 로직 연결 가능)
        this.currentNpcId = 'thomas';
        
        // --- 랜덤 요청 선택 ---
        const npc = npcData[this.currentNpcId];
        const requests = npc && npc.requests ? npc.requests : [];
        this.currentRequest = requests.length > 0 ? requests[Math.floor(Math.random() * requests.length)] : '';
        console.log(`이번 요청: ${this.currentRequest}`);
        // --------------------

        // 타이틀 -> 메인: 페이드 효과
        this.changeScreen('.title-screen', '#main-container', 'fade');

        // NPC 생성 및 대화 시작
        setTimeout(() => {
            const spawned = NPCManager.spawnNPC(this.currentNpcId);
            if(spawned) {
                NPCManager.showNPC(this.currentNpcId);
                DialogueManager.startDialogue(this.currentNpcId, 'welcome', () => {
                    console.log('환영 대화가 종료되었습니다. 그림 그리기 모드로 전환합니다.');
                    // 메인 -> 그림: 슬라이드 효과
                    this.changeScreen('#main-container', '#drawing-mode-container', 'slide');
                    // NPCManager.hideNPC(this.currentNpcId); 
                });
            }
        }, 800);
    },

    showResult(evt) {
        const { score } = evt.detail;
        
        // --- 보상 및 이모티콘 결정 ---
        const baseGold = 50;
        const baseRep = 10;
        const baseXp = 20; // 기본 경험치 보상
        let goldReward = 0;
        let repReward = 0;
        let xpReward = 0; // 경험치 보상 변수
        let reactionKey, reactionIcon;

        if (score >= 95) {
            reactionKey = 'reaction_perfect';
            reactionIcon = 'assets/images/ui/icon/reaction/best_Icon.png';
            goldReward = Math.floor(baseGold * 1.5);
            repReward = Math.floor(baseRep * 1.5);
            xpReward = Math.floor(baseXp * 1.5); // 점수에 따른 XP 보상 계산
        } else if (score >= 80) {
            reactionKey = 'reaction_good';
            reactionIcon = 'assets/images/ui/icon/reaction/good_Icon.png';
            goldReward = baseGold;
            repReward = baseRep;
            xpReward = baseXp;
        } else if (score >= 60) {
            reactionKey = 'reaction_normal';
            reactionIcon = 'assets/images/ui/icon/reaction/normal_Icon.png';
            goldReward = Math.floor(baseGold * 0.7);
            repReward = Math.floor(baseRep * 0.7);
            xpReward = Math.floor(baseXp * 0.7);
        } else if (score >= 40) {
            reactionKey = 'reaction_bad';
            reactionIcon = 'assets/images/ui/icon/reaction/bad_Icon.png';
            goldReward = Math.floor(baseGold * 0.3);
            repReward = Math.floor(baseRep * 0.3);
            xpReward = Math.floor(baseXp * 0.3);
        } else {
            reactionKey = 'reaction_terrible';
            reactionIcon = 'assets/images/ui/icon/reaction/worst_Icon.png';
            goldReward = Math.floor(baseGold * 0.1);
            repReward = Math.floor(baseRep * 0.1);
            xpReward = Math.floor(baseXp * 0.1);
        }
        // ------------------

        // 그림 UI -> 메인 UI로 전환
        this.changeScreen('#drawing-mode-container', '#main-container', 'slide-back');

        // 그림 전달 애니메이션 시작
        const canvasItem = document.getElementById('finished-canvas-item');
        if (canvasItem) {
            canvasItem.classList.remove('hidden');
            setTimeout(() => canvasItem.classList.add('animate-give'), 50);

            // 그림 전달 애니메이션이 끝나면 보상 이펙트 표시
            canvasItem.addEventListener('animationend', () => {
                canvasItem.classList.add('hidden');
                canvasItem.classList.remove('animate-give');

                // 보상 이펙트 표시 및 데이터 업데이트
                this.showRewardEffect(goldReward, repReward, xpReward, reactionIcon, () => { // xpReward 전달
                    // 이펙트가 끝난 후 대사 시작
                    this.ensureNpcDialogBox(this.currentNpcId);
                    NPCManager.showNPC(this.currentNpcId);
                    DialogueManager.startDialogue(this.currentNpcId, reactionKey, () => {
                        console.log('반응 대화 종료');
                    });
                });
            }, { once: true });
        }
    },

    showRewardEffect(gold, rep, xp, reactionIconUrl, onComplete) { 
        const container = document.getElementById('reward-container');
        if (!container) return;
        container.innerHTML = '';

        const rewards = [];
        if (reactionIconUrl) {
            rewards.push({ type: 'reaction', icon: reactionIconUrl });
        }
        if (xp > 0) {
            rewards.push({ type: 'xp', value: xp }); // 아이콘 대신 텍스트로 표시하므로 icon 속성 제거
        }
        if (rep > 0) {
            rewards.push({ type: 'rep', value: rep, icon: 'assets/images/ui/icon/fame_Icon.png' });
        }
        if (gold > 0) {
            rewards.push({ type: 'gold', value: gold, icon: 'assets/images/ui/icon/money_Icon.png' });
        }

        if (rewards.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        rewards.forEach((reward, index) => {
            setTimeout(() => {
                const rewardEl = document.createElement('div');
                rewardEl.className = 'reward-item';
                
                if (reward.type === 'reaction') {
                    rewardEl.classList.add('reaction-icon');
                    rewardEl.innerHTML = `<img src="${reward.icon}" alt="reaction">`;
                    // 이모티콘 애니메이션이 끝나면 바로 콜백(대사 시작) 실행
                    rewardEl.addEventListener('animationend', () => {
                        if (onComplete) onComplete();
                    }, { once: true });
                } else {
                    // XP 타입일 경우 텍스트 라벨을, 아닐 경우 이미지 아이콘을 표시
                    if (reward.type === 'xp') {
                        rewardEl.innerHTML = `
                            <span class="reward-label">XP</span>
                            <span>+${reward.value}</span>
                        `;
                    } else {
                        rewardEl.innerHTML = `
                            <img src="${reward.icon}" alt="${reward.type}">
                            <span>+${reward.value}</span>
                        `;
                    }
                }
                container.appendChild(rewardEl);

                if (reward.type !== 'reaction') {
                    setTimeout(() => {
                        if (reward.type === 'gold') PlayerData.addGold(reward.value);
                        if (reward.type === 'rep') PlayerData.addReputation(reward.value);
                        if (reward.type === 'xp') PlayerData.addXp(reward.value);
                        // 증가 시각화 표시
                        this.showGain(reward.type, reward.value);
                        console.log(`[Effect Peak] ${reward.type}: +${reward.value}`);
                    }, 600);
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
            target = document.querySelector('.fame-badge');
        } else if (type === 'gold') {
            target = document.querySelector('.gold-badge');
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
        float.textContent = type === 'xp' ? `+${amount} XP` : `+${amount}`;
        target.appendChild(float);
        float.addEventListener('animationend', () => float.remove(), { once: true });

        // XP 바 펄스 효과
        if (type === 'xp') {
            const xpBar = document.querySelector('.xp-bar-fill');
            if (xpBar) {
                xpBar.classList.add('flash');
                xpBar.addEventListener('animationend', () => {
                    xpBar.classList.remove('flash');
                }, { once: true });
            }
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
            toScreen.classList.add('active-screen');
            this.updateBackground(toScreen); // 배경 업데이트

            // 그림 그리기 화면으로 전환 시 요청 텍스트 업데이트 및 타이머 시작
            if (toSelector === '#drawing-mode-container') {
                const requestTextEl = toScreen.querySelector('.request-text');
                if (requestTextEl) {
                    requestTextEl.textContent = this.currentRequest;
                }
                const DURATION = 60; // 60초
                TimerManager.start(DURATION, () => {
                    console.log('시간 초과! 자동 제출합니다.');
                    PaintEngine.submit();
                });
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
        if (repText) repText.textContent = `${data.reputation} / ${data.nextReputationGoal}`;
        if (goldText) goldText.textContent = data.gold;
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
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;

        this.renderShopPanel();
        this.updateShopStatus();

        overlay.classList.remove('hidden');
        overlay.setAttribute('aria-hidden', 'false');
        this.pauseGame();

        this.initShopTabs();
    },

    closeShop() {
        const overlay = document.getElementById('shop-overlay');
        if (!overlay) return;
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        this.resumeGame();
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

        // 1. 초보자용 팔레트는 항상 표시
        this.createShopItemCard(container, 'paints', 'beginnerPaletteSet', shopData.paints.beginnerPaletteSet, playerLevel, playerGold);

        // 2. 초보자용 팔레트를 구매했다면, 기본 팔레트 세트 표시
        if (purchased.beginnerPaletteSet) {
            this.createShopItemCard(container, 'paints', 'basicPaletteSet', shopData.paints.basicPaletteSet, playerLevel, playerGold);
        }

        // 3. 기본 팔레트 세트까지 구매했다면, 특수 색상들 표시
        if (purchased.basicPaletteSet) {
            Object.entries(shopData.paints).forEach(([itemId, item]) => {
                if (item.special) {
                    this.createShopItemCard(container, 'paints', itemId, item, playerLevel, playerGold);
                }
            });
        }
    },
    
    createShopItemCard(container, category, itemId, item, playerLevel, playerGold) {
        const purchased = PlayerData.get('purchasedItems');
        let isPurchased = false;
        if (itemId === 'beginnerPaletteSet') isPurchased = purchased.beginnerPaletteSet;
        else if (itemId === 'basicPaletteSet') isPurchased = purchased.basicPaletteSet;
        else if (category === 'paints') isPurchased = purchased.paints.includes(itemId);
        else if (category === 'tools') isPurchased = purchased.tools.includes(itemId);

        const isLocked = item.reqLevel && playerLevel < item.reqLevel;
        const canAfford = playerGold >= item.cost;
        const card = document.createElement('div');
        card.className = `shop-item-card ${isPurchased ? 'purchased' : ''} ${isLocked ? 'locked' : ''}`;
        card.dataset.itemId = itemId;

        const iconHTML = item.color
            ? `<div class="shop-item-icon paint-preview" style="background-color:${item.color};"></div>`
            : `<div class="shop-item-icon">${item.icon}</div>`;
        
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
                ${item.description ? `<p class="shop-item-desc">${item.description}</p>` : ''}
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
            const canAfford = playerGold >= item.cost;
            const card = document.createElement('div');
            card.className = `shop-item-card ${!canPurchase ? 'purchased' : ''}`;
            card.dataset.itemId = itemId;
            const buttonHTML = !canPurchase
                ? `<button class="shop-buy-btn" disabled>일일 한도 도달</button>`
                : `
                    <button class="shop-buy-btn ${!canAfford ? 'disabled' : ''}" ${!canAfford ? 'disabled' : ''} onclick="Game.purchaseItem('consumables','${itemId}')">
                        <img src="assets/images/ui/icon/money_Icon.png" class="cost-icon" alt="골드">
                        <span>${item.cost}</span>
                    </button>`;
            card.innerHTML = `
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-info">
                    <h5 class="shop-item-name">${item.name}</h5>
                    <p class="shop-item-desc">${item.description}</p>
                    <p class="shop-item-requirement">구매 제한: 하루 ${item.dailyLimit}개 (오늘: ${purchasedToday}/${item.dailyLimit})</p>
                </div>
                ${buttonHTML}
            `;
            container.appendChild(card);
        });
    },

    purchaseItem(category, itemId) {
        const playerGold = PlayerData.get('gold');
        const purchased = PlayerData.get('purchasedItems');
        const item = shopData[category]?.[itemId];
        if (!item) return;
        
        // 물감 구매 로직 수정
        if (category === 'paints') {
            const item = shopData.paints[itemId];
            if (!item) return;

            if (itemId === 'beginnerPaletteSet') {
                if (purchased.beginnerPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                purchased.beginnerPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
            } else if (itemId === 'basicPaletteSet') {
                if (purchased.basicPaletteSet) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                purchased.basicPaletteSet = true;
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
            } else { // 개별 물감 구매 (특수 색상)
                if (purchased.paints.includes(itemId)) { this.showNotification('이미 구매한 아이템입니다!'); return; }
                if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
                PlayerData.set('gold', playerGold - item.cost);
                purchased.paints.push(itemId);
                PlayerData.set('purchasedItems', purchased);
                this.showNotification(`${item.name}을(를) 구매했습니다!`);
            }
            this.renderShopPanel(); this.updateShopStatus();
            return;
        }

        // 일반 아이템 처리 (도구)
        if (purchased[category].includes(itemId)) { this.showNotification('이미 구매한 아이템입니다!'); return; }
        if (playerGold < item.cost) { this.showNotification('골드가 부족합니다!'); return; }
        PlayerData.set('gold', playerGold - item.cost);
        purchased[category].push(itemId); PlayerData.set('purchasedItems', purchased);
        this.showNotification(`${item.name}을(를) 구매했습니다!`);
        this.renderShopPanel(); this.updateShopStatus();
    },

    showNotification(message) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'notification-toast';
        toast.textContent = message;

        container.appendChild(toast);

        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    },
};

window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
