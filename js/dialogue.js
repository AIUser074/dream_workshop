const DialogueManager = {
    init(npcManager) {
        this.npcManager = npcManager;
        this.currentNpc = null;
        this.dialogueQueue = [];
        this.currentDialogueIndex = 0;
        this.isDialogueActive = false;
        this.onDialogueEnd = null;
        this.canProceedToNext = false; // 다음으로 진행 가능한지 여부
        this.clickListenerTarget = document.getElementById('game-viewport'); // 클릭 이벤트 리스너 타겟
    },

    startDialogue(npcId, dialogueKey, onEndCallback) {
        const npc = this.npcManager.getNPC(npcId);
        if (!npc || !npc.data.dialogues[dialogueKey]) {
            console.error(`대화를 찾을 수 없습니다: ${npcId}, ${dialogueKey}`);
            return;
        }

        if (this.isDialogueActive) return;

        this.currentNpc = npc;
        this.dialogueQueue = [...npc.data.dialogues[dialogueKey]];
        this.currentDialogueIndex = 0;
        this.isDialogueActive = true;
        this.onDialogueEnd = onEndCallback;
        
        this.currentNpc.dialogBox.classList.add('active');

        // 대화 상자 애니메이션(1.2초)이 끝난 후 첫 대사를 시작합니다.
        setTimeout(() => {
            this.showNextDialogue();
        }, 1200);

        // 화면 전체에 클릭 이벤트 리스너 추가
        this.boundShowNextDialogue = this.showNextDialogue.bind(this);
        this.clickListenerTarget.addEventListener('click', this.boundShowNextDialogue);
    },

    showNextDialogue(event) {
        // 클릭 이벤트가 UI 요소(버튼 등)에서 발생했는지 확인
        if (event) {
            const target = event.target;
            // 클릭된 요소가 버튼이거나, 특정 UI 컨테이너의 자식 요소인 경우 대화를 진행하지 않음
            if (target.closest('button, .status-bar')) {
                return;
            }
        }

        if (!this.isDialogueActive) return;

        // 첫 대사가 아니면서 타이핑 중일 때는 다음으로 넘어가지 않음
        if (!this.canProceedToNext && this.currentDialogueIndex > 0) return;

        if (this.currentDialogueIndex < this.dialogueQueue.length) {
            this.canProceedToNext = false; // 다음 대사 시작 시 진행 불가 상태로 변경
            
            const dialogTextElement = this.currentNpc.dialogBox.querySelector('.dialog-text');
            const nextArrowElement = this.currentNpc.dialogBox.querySelector('.next-arrow');
            
            // 화살표 숨기기
            if (nextArrowElement) nextArrowElement.classList.remove('visible');

            const text = this.dialogueQueue[this.currentDialogueIndex];
            
            this.npcManager.typeText(dialogTextElement, text, 50, () => {
                // 타이핑 완료 후 진행 가능 상태로 변경하고 화살표 표시
                this.canProceedToNext = true;
                if (nextArrowElement) nextArrowElement.classList.add('visible');
            });

            this.currentDialogueIndex++;
        } else {
            this.endDialogue();
        }
    },

    endDialogue() {
        if (!this.isDialogueActive) return;

        this.isDialogueActive = false;
        
        if (this.currentNpc && this.currentNpc.dialogBox) {
            this.currentNpc.dialogBox.classList.remove('active');
            const nextArrowElement = this.currentNpc.dialogBox.querySelector('.next-arrow');
            if (nextArrowElement) nextArrowElement.classList.remove('visible');
            
            // 이벤트 리스너 제거
            this.clickListenerTarget.removeEventListener('click', this.boundShowNextDialogue);
        }

        if (typeof this.onDialogueEnd === 'function') {
            this.onDialogueEnd();
        }

        // 초기화
        this.currentNpc = null;
        this.dialogueQueue = [];
        this.currentDialogueIndex = 0;
        this.onDialogueEnd = null;
        this.canProceedToNext = false;
    }
};
