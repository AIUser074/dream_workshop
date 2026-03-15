const NPCManager = {
    init() {
        this.npcs = {};
        this.typingTimer = null; // 타이핑 애니메이션 타이머 참조
        this.typingState = null; // 타이핑 상태 저장을 위한 객체
    },

    spawnNPC(npcId, preset = 'default') {
        const data = npcData[npcId];
        if (!data) return;

        // 현재 활성 손님을 전역 Game 상태에 기록
        try { if (window.Game) window.Game.currentCustomer = npcId; } catch {}

        const viewport = document.getElementById('game-viewport');
        const npcWrapper = document.createElement('div');
        npcWrapper.id = `npc-${data.id}`;
        npcWrapper.className = 'npc-wrapper';
        
        const npcImage = document.createElement('img');
        npcImage.src = data.image;
        npcImage.alt = data.name;
        
        Object.assign(npcWrapper.style, data.position);

        const dialogBox = document.createElement('div');
        dialogBox.className = 'dialog-box';
        // '다음' 화살표 요소를 추가합니다.
        dialogBox.innerHTML = `
            <span class="dialog-speaker-name"></span>
            <p class="dialog-text"></p>
            <span class="next-arrow">▼</span>
        `;

        // preset에 따라 대화 상자 스타일 설정
        const presetData = dialogData[preset];
        if (presetData) {
            const { position, size } = presetData;
            Object.assign(dialogBox.style, position, size);
        }

        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.appendChild(dialogBox);
        }

        npcWrapper.appendChild(npcImage);
        
        npcWrapper.style.width = `${data.baseScale * viewport.clientWidth}px`;

        if (mainContainer) {
            mainContainer.appendChild(npcWrapper);
        }

        this.npcs[npcId] = {
            element: npcWrapper,
            dialogBox: dialogBox,
            data: data
        };
        
        return this.npcs[npcId];
    },

    showNPC(npcId) {
        const npc = this.npcs[npcId];
        if (npc && npc.element) {
            // 토마스: 기존 팝업, 그 외: 좌측에서 슬라이드 인
            if (npcId === 'thomas') {
                npc.element.classList.add('animate-enter');
                npc.dialogBox.classList.add('animate-enter');
            } else {
                npc.element.classList.add('enter-left', 'animate-enter');
                npc.dialogBox.classList.add('animate-enter');
            }

            const npcImage = npc.element.querySelector('img');
            npcImage.addEventListener('animationend', () => {
                npc.element.classList.add('npc-idle');
            }, { once: true });
        }
    },
    
    hideNPC(npcId) {
        const npc = this.npcs[npcId];
        if (npc && npc.element) {
            npc.element.classList.remove('animate-enter', 'npc-idle');
            npc.dialogBox.classList.remove('animate-enter');
            // 필요하다면 퇴장 애니메이션 추가
        }
    },

    dismissNPC(npcId, onDone) {
        const npc = this.npcs[npcId];
        if (!npc || !npc.element) { if (onDone) onDone(); return; }

        // 대사 상자 페이드아웃
        if (npc.dialogBox) {
            npc.dialogBox.classList.add('dialog-exit');
        }

        // 현재 유휴 애니메이션 제거 후 리플로우로 애니메이션 트리거 보장
        npc.element.classList.remove('npc-idle');
        void npc.element.offsetWidth;

        // 토마스는 아래로, 그 외는 오른쪽으로 퇴장
        if (npcId === 'thomas') {
            npc.element.classList.add('exit-down');
        } else {
            npc.element.classList.add('exit-right');
        }

        const img = npc.element.querySelector('img');
        const finalize = () => {
            try {
                if (npc.element) npc.element.remove();
                if (npc.dialogBox) npc.dialogBox.remove();
                delete this.npcs[npcId];
            } catch {}
            if (onDone) onDone();
        };

        let fallbackId = setTimeout(finalize, 800); // 애니메이션 미발화 대비 안전장치
        if (img) {
            img.addEventListener('animationend', () => { clearTimeout(fallbackId); finalize(); }, { once: true });
        } else {
            clearTimeout(fallbackId);
            finalize();
        }
    },

    getNPC(npcId) {
        return this.npcs[npcId];
    },

    typeText(element, text, speed = 50, onComplete = null) {
        // 기존 타이핑 애니메이션이 있다면 중지
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
        }
        if (!element || typeof text === 'undefined') {
            if (typeof onComplete === 'function') onComplete();
            return;
        }

        element.innerHTML = '';
        element.classList.add('typing');

        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            element.appendChild(span);
        });

        // 타이핑 상태 저장
        this.typingState = {
            element,
            text,
            i: 0,
            speed,
            onComplete
        };
        
        this.resumeTyping(); // 타이핑 시작
    },

    pauseTyping() {
        if (this.typingTimer) {
            clearInterval(this.typingTimer);
            this.typingTimer = null;
            return true; // 타이핑 중이었음을 반환
        }
        return false;
    },

    resumeTyping() {
        if (!this.typingState) return;

        const { element, text, speed, onComplete } = this.typingState;
        
        // 이미 보이는 글자들은 그대로 둠
        element.classList.add('typing');
        
        this.typingTimer = setInterval(() => {
            const span = element.querySelectorAll('span')[this.typingState.i];
            if (span) {
                span.classList.add('visible');
                this.typingState.i++;
            }
            if (this.typingState.i === text.length) {
                clearInterval(this.typingTimer);
                this.typingTimer = null;
                element.classList.remove('typing');
                if (typeof onComplete === 'function') {
                    onComplete();
                }
                this.typingState = null; // 상태 초기화
            }
        }, speed);
    }
};
