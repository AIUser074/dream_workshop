// 튜토리얼 매니저: 드로잉 첫 사용 튜토리얼 전용
const TutorialManager = {
    active: false,
    stepIndex: 0,
    steps: [],
    overlay: null,
    dims: null,
    highlight: null,
    tooltip: null,
    currentTarget: null,
    _awaitClickResolver: null,
    resizeHandler: null,
    overlayClicksAdvance: true,

    startDrawingTutorial() {
        if (this.active) return;
        // 이미 완료했다면 실행하지 않음
        try {
            if (PlayerData.get('drawingTutorialCompleted')) return;
        } catch {}

        // 타이머 일시정지
        if (typeof TimerManager.pause === 'function') TimerManager.pause();

        this.active = true;
        this.stepIndex = 0;
        this.buildOverlay();

        // 단계 정의 (순서 중요)
        this.steps = [
            {
                selector: '.request-text',
                message: '여기에서 의뢰 내용을 확인할 수 있게 했네. \n손님의 요청을 잘 읽어주게나.',
            },
            {
                selector: '.timer-container',
                message: '남은 시간이 이곳에 표시되는군. \n시간이 모두 지나면 자동으로 제출되니 주의하라고!',
            },
            {
                selector: '#paint-canvas',
                message: '이곳이 바로 그림을 그릴 수 있는 곳이네. \n자유롭게 그려보게.',
            },
            {
                selector: '#current-color-btn',
                message: '여기서 지금 선택된 색을 볼 수 있군. \n눌러서 팔레트를 열고 색을 바꿀 수 있다네.',
            },
            {
                selector: '#btn-brush-size',
                message: '이 버튼으로 붓 크기를 조절해서 선의 두께를 바꿀 수 있네.',
            },
            {
                selector: '#btn-eraser',
                message: '실수하면 지우개를 써서 깔끔하게 지우면 되니 걱정하지 말게나.',
            },
            {
                selector: '#btn-reset-canvas',
                message: '모두 지우기는 캔버스를 통째로 초기화하는 기능이네. \n신중하게 눌러야 하겠구만!',
            },
            {
                selector: '#btn-finish-drawing',
                message: '그림이 다 완성되면 이 버튼을 눌러 제출하게.',
            },
        ];

        this.next();
    },

    buildOverlay() {
        // 루트 오버레이
        const overlay = document.createElement('div');
        overlay.id = 'tutorial-overlay';
        overlay.className = 'tutorial-overlay';
        // 어두운 영역을 4개 분할로 구성해 하이라이트 영역을 비워둠
        const dims = {
            top: document.createElement('div'),
            left: document.createElement('div'),
            right: document.createElement('div'),
            bottom: document.createElement('div'),
        };
        Object.values(dims).forEach(el => {
            el.className = 'tutorial-dim';
            overlay.appendChild(el);
        });

        // 하이라이트 링
        const highlight = document.createElement('div');
        highlight.className = 'tutorial-highlight';
        overlay.appendChild(highlight);

        // 안내 말풍선
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.innerHTML = '<div class="tutorial-tooltip-inner"></div>';
        overlay.appendChild(tooltip);

        // 클릭으로 다음 단계 진행 (모드에 따라 비활성화 가능)
        overlay.addEventListener('click', (e) => {

            if (this.overlayClicksAdvance) {
                this.next();
            } else if (this.currentTarget) {
                const rect = this.currentTarget.getBoundingClientRect();
                const within = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
                if (within) {
                    try {
                        // 네이티브 click 우선 (더 호환성 좋음)
                        this.currentTarget.click();
                    } catch {
                        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: e.clientX, clientY: e.clientY });
                        this.currentTarget.dispatchEvent(clickEvent);
                    }
                    // 튜토리얼 대기 해제 (버튼 클릭 감지가 실패하더라도 진행되도록 보조 처리)
                    if (this._awaitClickResolver) {
                        const resolve = this._awaitClickResolver;
                        this._awaitClickResolver = null;
                        resolve(true);
                    }
                }
            }
            e.stopPropagation();
            e.preventDefault();
        });

        document.body.appendChild(overlay);
        this.overlay = overlay;
        this.dims = dims;
        this.highlight = highlight;
        this.tooltip = tooltip;
        // 기본 커서는 기본값
        this.overlay.style.cursor = 'default';

        // 하이라이트 내부에서만 포인터 커서 표시
        const updateCursor = (e) => {
            if (!this.currentTarget) { this.overlay.style.cursor = 'default'; return; }
            const rect = this.currentTarget.getBoundingClientRect();
            const within = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
            this.overlay.style.cursor = within ? 'pointer' : 'default';
        };
        overlay.addEventListener('mousemove', updateCursor);

        // 리사이즈 대응
        this.resizeHandler = () => this.positionCurrent();
        window.addEventListener('resize', this.resizeHandler);
        window.addEventListener('orientationchange', this.resizeHandler);
    },

    next() {
        if (!this.active) return;
        if (this.stepIndex >= this.steps.length) {
            this.end();
            return;
        }

        const step = this.steps[this.stepIndex];
        const el = document.querySelector(step.selector);
        // 대상이 없으면 자동으로 스킵
        if (!el || (el.classList && el.classList.contains('hidden'))) {
            this.stepIndex++;
            this.next();
            return;
        }
        this.currentTarget = el;
        const messageEl = this.tooltip.querySelector('.tutorial-tooltip-inner');
        if (messageEl) messageEl.textContent = step.message;
        this.positionFor(el);
        this.stepIndex++;
    },

    positionCurrent() {
        if (!this.currentTarget) return;
        this.positionFor(this.currentTarget);
    },

    positionFor(targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const pad = 10; // 기본 하이라이트 패딩

        // 캔버스 단계: clip-path(inset(8.3% 5% 17.5% 5% round 10px))에 맞춘 내부 영역 강조
        let x, y, w, h;
        if (targetEl.id === 'paint-canvas') {
            const topPct = 8.3 / 100;
            const rightPct = 5 / 100;
            const bottomPct = 17.5 / 100;
            const leftPct = 5 / 100;
            const innerX = rect.left + rect.width * leftPct;
            const innerY = rect.top + rect.height * topPct;
            const innerW = rect.width * (1 - leftPct - rightPct);
            const innerH = rect.height * (1 - topPct - bottomPct);
            // 캔버스는 패딩 없이 딱 맞게 표시
            x = Math.max(0, innerX);
            y = Math.max(0, innerY);
            w = Math.min(window.innerWidth - x, innerW);
            h = Math.min(window.innerHeight - y, innerH);
            // clip-path 라운드와 동일하게
            this.highlight.style.borderRadius = '10px';
        } else {
            x = Math.max(0, rect.left - pad);
            y = Math.max(0, rect.top - pad);
            w = Math.min(window.innerWidth - x, rect.width + pad * 2);
            h = Math.min(window.innerHeight - y, rect.height + pad * 2);
            this.highlight.style.borderRadius = '14px';
        }

        // 하이라이트 위치
        this.highlight.style.left = x + 'px';
        this.highlight.style.top = y + 'px';
        this.highlight.style.width = w + 'px';
        this.highlight.style.height = h + 'px';

        // 4개 dim을 재배치하여 나머지 영역 덮기
        this.dims.top.style.left = '0px';
        this.dims.top.style.top = '0px';
        this.dims.top.style.width = '100vw';
        this.dims.top.style.height = y + 'px';

        this.dims.bottom.style.left = '0px';
        this.dims.bottom.style.top = (y + h) + 'px';
        this.dims.bottom.style.width = '100vw';
        this.dims.bottom.style.height = Math.max(0, window.innerHeight - (y + h)) + 'px';

        this.dims.left.style.left = '0px';
        this.dims.left.style.top = y + 'px';
        this.dims.left.style.width = x + 'px';
        this.dims.left.style.height = h + 'px';

        this.dims.right.style.left = (x + w) + 'px';
        this.dims.right.style.top = y + 'px';
        this.dims.right.style.width = Math.max(0, window.innerWidth - (x + w)) + 'px';
        this.dims.right.style.height = h + 'px';

        // 툴팁 위치 규칙
        const tip = this.tooltip;
        const tipMargin = 10;
        tip.style.maxWidth = Math.min(360, Math.floor(window.innerWidth * 0.8)) + 'px';

        const isCanvas = targetEl.id === 'paint-canvas';
        const isButton = (
            targetEl.matches('#current-color-btn, #btn-brush-size, #btn-fill, #btn-eraser, #btn-undo, #btn-reset-canvas, #btn-finish-drawing') ||
            targetEl.tagName === 'BUTTON' ||
            targetEl.classList.contains('tool-btn')
        );

		let placedInside = false;

		if (isCanvas) {
            // 캔버스 설명은 캔버스 강조 영역 중앙에 표시
            const centerLeft = x + w / 2 - tip.offsetWidth / 2;
            const centerTop = y + h / 2 - tip.offsetHeight / 2;
            tip.style.top = Math.max(8, centerTop) + 'px';
            tip.style.left = Math.min(
                Math.max(8, centerLeft),
                window.innerWidth - tip.offsetWidth - 8
            ) + 'px';
        } else if (isButton) {
            // 버튼 설명은 항상 버튼 위쪽에 표시
            const aboveTop = y - tip.offsetHeight - tipMargin;
            tip.style.top = Math.max(8, aboveTop) + 'px';
            tip.style.left = Math.min(
                Math.max(8, x + w / 2 - tip.offsetWidth / 2),
                window.innerWidth - tip.offsetWidth - 8
            ) + 'px';
		} else {
			// 가용 공간 기반 동적 배치: 아래 선호 → 위 → 내부(패널/하이라이트) 배치
			const tipH = tip.offsetHeight;
			const spaceBelow = Math.max(0, window.innerHeight - (y + h) - tipMargin);
			const spaceAbove = Math.max(0, y - tipMargin);

			if (spaceBelow >= tipH + 8) {
				// 아래 배치
				tip.style.top = (y + h + tipMargin) + 'px';
				tip.style.left = Math.min(
					Math.max(8, x + w / 2 - tip.offsetWidth / 2),
					window.innerWidth - tip.offsetWidth - 8
				) + 'px';
			} else if (spaceAbove >= tipH + 8) {
				// 위 배치
				tip.style.top = Math.max(8, y - tipH - tipMargin) + 'px';
				tip.style.left = Math.min(
					Math.max(8, x + w / 2 - tip.offsetWidth / 2),
					window.innerWidth - tip.offsetWidth - 8
				) + 'px';
			} else {
				// 내부 배치(패널이 화면 하단에 가까워 외부 배치가 불가한 경우)
				placedInside = true;
				const insideTop = Math.min(
					Math.max(8, y + 12), // 패널 내부 상단 근처에 배치
					Math.max(8, window.innerHeight - tipH - 8)
				);
				tip.style.top = insideTop + 'px';
				tip.style.left = Math.min(
					Math.max(8, x + w / 2 - tip.offsetWidth / 2),
					window.innerWidth - tip.offsetWidth - 8
				) + 'px';
			}
		}

		// 타깃과 툴팁이 겹치면 대체 위치로 재배치(아래 → 왼쪽 → 오른쪽)
		const targetBox = { left: x, top: y, right: x + w, bottom: y + h };
		const overlaps = () => {
			const r = tip.getBoundingClientRect();
			return !(r.right < targetBox.left || r.left > targetBox.right || r.bottom < targetBox.top || r.top > targetBox.bottom);
		};
		if (!placedInside && overlaps()) {
			const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
			const maxTop = Math.max(8, window.innerHeight - tip.offsetHeight - 8);
			const maxLeft = Math.max(8, window.innerWidth - tip.offsetWidth - 8);

			// 1) 아래
			let candTop = clamp(y + h + tipMargin, 8, maxTop);
			let candLeft = clamp(x + w / 2 - tip.offsetWidth / 2, 8, maxLeft);
			tip.style.top = candTop + 'px';
			tip.style.left = candLeft + 'px';
			if (!overlaps()) {
				// settled
			} else {
				// 2) 왼쪽
				candTop = clamp(y + h / 2 - tip.offsetHeight / 2, 8, maxTop);
				candLeft = clamp(x - tip.offsetWidth - tipMargin, 8, maxLeft);
				tip.style.top = candTop + 'px';
				tip.style.left = candLeft + 'px';
				if (overlaps()) {
					// 3) 오른쪽
					candTop = clamp(y + h / 2 - tip.offsetHeight / 2, 8, maxTop);
					candLeft = clamp(x + w + tipMargin, 8, maxLeft);
					tip.style.top = candTop + 'px';
					tip.style.left = candLeft + 'px';
				}
			}
		}

		// 최종 화면 경계 클램핑(툴팁이 화면 밖으로 나가지 않도록 보정)
		const tipRect = tip.getBoundingClientRect();
		let finalTop = parseFloat(tip.style.top) || 8;
		let finalLeft = parseFloat(tip.style.left) || 8;
		const maxTop = Math.max(8, window.innerHeight - tipRect.height - 8);
		const maxLeft = Math.max(8, window.innerWidth - tipRect.width - 8);
		if (finalTop < 8) finalTop = 8; else if (finalTop > maxTop) finalTop = maxTop;
		if (finalLeft < 8) finalLeft = 8; else if (finalLeft > maxLeft) finalLeft = maxLeft;
		tip.style.top = finalTop + 'px';
		tip.style.left = finalLeft + 'px';
    },

    end() {
        if (!this.active) return;
        this.active = false;
        // 오버레이 제거 및 리스너 해제
        if (this.overlay) this.overlay.remove();
        this.overlay = null;
        this.dims = null;
        this.highlight = null;
        this.tooltip = null;
        this.currentTarget = null;
        if (this.resizeHandler) {
            window.removeEventListener('resize', this.resizeHandler);
            window.removeEventListener('orientationchange', this.resizeHandler);
            this.resizeHandler = null;
        }

        // 완료 플래그 저장
        try {
            PlayerData.set('drawingTutorialCompleted', true);
        } catch {}

        // 타이머 재개
        if (typeof TimerManager.resume === 'function') TimerManager.resume();
    }
};

// 전역 노출
window.TutorialManager = TutorialManager;

// ===== 메인 UI 튜토리얼 =====
TutorialManager.startMainTutorial = async function() {
    if (this.active) return;
    try { if (PlayerData.get('tutorialCompleted')) return; } catch {}

    // 게임 일시정지(애니메이션/타자 등), 하지만 UI 동작은 가능
    try { if (typeof Game.pauseGame === 'function') Game.pauseGame(); } catch {}

    this.active = true;
    this.overlayClicksAdvance = false; // 메인 튜토리얼은 명시적 액션으로 진행
    this.buildOverlay();

    const highlight = async (selectorOrElement, message) => {
        const el = (typeof selectorOrElement === 'string')
            ? document.querySelector(selectorOrElement)
            : selectorOrElement;
        if (!el) return;
        const messageEl = this.tooltip.querySelector('.tutorial-tooltip-inner');
        if (messageEl) messageEl.textContent = message;
        this.currentTarget = el;
        this.positionFor(el);
    };
    const waitOverlayTap = () => new Promise((resolve) => {
        const handler = () => {
            this.overlay.removeEventListener('click', handler);
            resolve(true);
        };
        this.overlay.addEventListener('click', handler, { once: true });
    });
    const waitClick = (selector) => new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (!el) return resolve(false);
        const handler = () => { el.removeEventListener('click', handler); if (this._awaitClickResolver) { this._awaitClickResolver = null; } resolve(true); };
        el.addEventListener('click', handler, { once: true });
        // 오버레이 클릭으로도 진행되도록 대기 리졸버 보관
        this._awaitClickResolver = resolve;
    });
    const waitVisible = (selector) => new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (el && !el.classList.contains('hidden')) return resolve(true);
        const iv = setInterval(() => {
            const el2 = document.querySelector(selector);
            if (el2 && !el2.classList.contains('hidden')) { clearInterval(iv); resolve(true); }
        }, 100);
    });
    const waitHidden = (selector) => new Promise((resolve) => {
        const el = document.querySelector(selector);
        if (!el || el.classList.contains('hidden')) return resolve(true);
        const iv = setInterval(() => {
            const el2 = document.querySelector(selector);
            if (!el2 || el2.classList.contains('hidden')) { clearInterval(iv); resolve(true); }
        }, 100);
    });
    const waitPlayerData = (predicate) => new Promise((resolve) => {
        const check = () => { try { if (predicate(PlayerData.data)) return true; } catch {} return false; };
        if (check()) return resolve(true);
        const listener = (data) => { if (predicate(data)) { PlayerData._listeners = PlayerData._listeners.filter(fn => fn !== listener); resolve(true); } };
        PlayerData.onChange(listener);
    });
    const waitExists = (selector) => new Promise((resolve) => {
        const found = document.querySelector(selector);
        if (found) return resolve(found);
        const iv = setInterval(() => {
            const el = document.querySelector(selector);
            if (el) { clearInterval(iv); resolve(el); }
        }, 100);
    });

    try {


        // 0단계: 상단 재화 UI 설명
        await highlight('.status-bar', '여기가 상단 상태 표시줄일세. 레벨, 명성, 골드를 확인할 수 있지.');
        await waitOverlayTap();

        // 1단계: 강화
        await highlight('#btn-upgrade', "우선 '강화' 버튼을 눌러 역량을 키워보게.");
        await waitClick('#btn-upgrade');
        await waitVisible('#upgrade-overlay');
        // 강화 UI 개요 먼저 안내
        await highlight('.upgrade-panel', '여기가 강화 UI일세. 스킬을 확인하고 강화할 수 있지.');
        await waitOverlayTap();
        await highlight('#upgrade-close', "이제는 닫아보세.");
        await waitClick('#upgrade-close');
        await waitHidden('#upgrade-overlay');

        // 2단계: 상점 및 팔레트 구매
        await highlight('#btn-shop', "다음은 '상점'일세. 필요한 도구와 물감을 살 수 있지.");
        await waitClick('#btn-shop');
        await waitVisible('#shop-overlay');
        // 상점 UI 개요 먼저 안내
        await highlight('.shop-panel', "여기가 상점이네. 물감과 도구를 살 수 있지.");
        await waitOverlayTap();

        await highlight('.shop-item-card[data-item-id="beginnerPaletteSet"] .shop-buy-btn', "'초보자용 팔레트 세트'를 구매해보게.");
        await waitPlayerData(d => d.purchasedItems && d.purchasedItems.beginnerPaletteSet === true);
        await highlight('#shop-close', '좋네! 이제 상점을 닫아보세.');
        await waitClick('#shop-close');
        await waitHidden('#shop-overlay');

        // 3단계: 의뢰 + 예약
        await highlight('#btn-quest', "이제 '의뢰' 게시판에서 손님을 받아보세.");
        await waitClick('#btn-quest');
        await waitVisible('#quest-overlay');
        // 의뢰 UI 개요 먼저 안내
        await highlight('.quest-panel', "여기가 의뢰 게시판일세. 손님들의 요청을 보고 수락할 수 있지.");
        await waitOverlayTap();
        // 테오 의뢰 수락 버튼 강조
        const theoCard = Array.from(document.querySelectorAll('.quest-card')).find(c => c.querySelector('.quest-npc-name')?.textContent?.includes('테오'));
        if (theoCard) {
            const acceptBtn = theoCard.querySelector('.quest-accept-btn');
            await highlight(acceptBtn, "'수락'을 눌러보게. 편지를 눌러 상세도 볼 수 있네.");
        }
        // 수락 이후 예약 확인 모달에서 예약 버튼 강조
        await waitVisible('#detail-modal-overlay');
        const yesBtn = await waitExists('#confirm-yes');
        await highlight(yesBtn, '예약을 확정하세. 다음 손님으로 오게 될 걸세.');
        await waitClick('#confirm-yes');
        await waitHidden('#detail-modal-overlay');
        
        // 예약 완료된 카드 확인
        const reservedCard = Array.from(document.querySelectorAll('.quest-card')).find(c => c.querySelector('.quest-npc-name')?.textContent?.includes('테오'));
        if (reservedCard) {
            await highlight(reservedCard, '좋아. 이제 다음 손님으로 예약되었네.');
            await waitOverlayTap();
        }

        // 의뢰 오버레이는 자동으로 닫히지 않을 수 있으므로 닫기 유도
        await highlight('.quest-close', '좋네. 이제 의뢰 창을 닫아보세.');
        await waitClick('.quest-close');
        await waitHidden('#quest-overlay');

        // 4단계: 기록
        await highlight('#btn-log', "마지막으로 '기록'에서 완성한 작품들을 볼 수 있지.");
        await waitClick('#btn-log');
        await waitVisible('#album-overlay');
        // 기록(앨범) UI 개요 먼저 안내
        await highlight('.album-panel', '여기는 그동안의 작품을 모아보는 기록이네.');
        await waitOverlayTap();
        await highlight('#album-close', '이제 닫아보세.');
        await waitClick('#album-close');
        await waitHidden('#album-overlay');

        // 5단계: 종료 후 토마스와의 대화로 종료
    } finally {
        // 종료 처리
        try { PlayerData.set('tutorialCompleted', true); } catch {}
        this.end();
        // 게임 재개 후 토마스의 짧은 작별 대사 → 퇴장
        try { if (typeof Game.resumeGame === 'function') Game.resumeGame(); } catch {}
        try {
            const npcId = (typeof Game !== 'undefined' && Game.currentCustomer) ? Game.currentCustomer : 'thomas';
            if (typeof DialogueManager !== 'undefined' && typeof DialogueManager.startDialogue === 'function') {
                const lines = [
                    '설명은 여기까지!',
                    '이제 공방을 잘 운영해주게. 기대하고 있겠네.'
                ];
                DialogueManager.startDialogue(npcId, 'welcome', lines, () => {
                    try {
                        if (typeof Game !== 'undefined' && typeof Game.finishCustomerSession === 'function') {
                            Game.finishCustomerSession();
                        } else if (typeof NPCManager !== 'undefined' && typeof NPCManager.dismissNPC === 'function') {
                            NPCManager.dismissNPC(npcId, () => {});
                        }
                    } catch {}
                    // 다음 예약 의뢰(테오) 완료 후 문제 해결 튜토리얼을 진행하도록 플래그만 세팅
                    try { PlayerData.set('pendingSolveTutorial', true); } catch {}
                });
            }
        } catch {}
    }
};

// ===== 문제 해결 튜토리얼(2단계) =====
TutorialManager.startSolveTutorial = function() {
    if (this.active) return;
    try {
        if (PlayerData.get('solveTutorialCompleted')) return;
    } catch {}
    if (typeof TimerManager.pause === 'function') TimerManager.pause();
    this.active = true;
    this.stepIndex = 0;
    this.overlayClicksAdvance = true; // 화면 아무 곳이나 터치로 진행
    this.buildOverlay();
    this.steps = [
        {
            selector: '.quest-type-icon',
            message: "문제 해결 의뢰는 전구(💡) 아이콘이 있다네. 이런 의뢰는 그림 솜씨보다 '어떤 아이디어'로 해결하는지가 더 중요하네!"
        }
    ];
    this.next();
    // end 시 solveTutorialCompleted 저장
    const originalEnd = this.end.bind(this);
    this.end = () => {
        this.end = originalEnd;
        try { PlayerData.set('solveTutorialCompleted', true); } catch {}
        try {
            if (typeof Game !== 'undefined' && typeof Game.renderQuestPanel === 'function') {
                Game.renderQuestPanel();
            }
        } catch {}
        originalEnd();
    };
};

