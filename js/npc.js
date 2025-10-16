const NPCManager = {
    init() {
        this.npcs = {};
        this.typingTimer = null; // 타이핑 애니메이션 타이머 참조
        this.typingState = null; // 타이핑 상태 저장을 위한 객체
    },

    spawnNPC(npcId, preset = 'default') {
        const data = npcData[npcId];
        if (!data) return;

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
            npc.element.classList.add('animate-enter');
            npc.dialogBox.classList.add('animate-enter');

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
