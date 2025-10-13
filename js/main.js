const Game = {
    init() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', this.startGame.bind(this));
        }
        NPCManager.init();
        DialogueManager.init(NPCManager);
        
        // 초기 화면 상태 설정
        document.querySelector('.title-screen').classList.remove('fade-out');
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active-screen', 'exit-left');
        });
        
        this.adjustFontSize();
        window.addEventListener('resize', this.adjustFontSize);
    },

    startGame() {
        console.log('게임 시작!');
        // 타이틀 -> 메인: 페이드 효과
        this.changeScreen('.title-screen', '#main-container', 'fade');

        // NPC 생성 및 대화 시작
        setTimeout(() => {
            const thomas = NPCManager.spawnNPC('thomas');
            if(thomas) {
                NPCManager.showNPC('thomas');
                DialogueManager.startDialogue('thomas', 'welcome', () => {
                    console.log('환영 대화가 종료되었습니다. 그림 그리기 모드로 전환합니다.');
                    // 메인 -> 그림: 슬라이드 효과
                    this.changeScreen('#main-container', '#drawing-mode-container', 'slide');
                    // NPCManager.hideNPC('thomas'); 
                });
            }
        }, 800);
    },

    changeScreen(fromSelector, toSelector, transitionType) {
        const fromScreen = document.querySelector(fromSelector);
        const toScreen = document.querySelector(toSelector);
        
        if (fromScreen) {
            if (transitionType === 'fade') {
                fromScreen.classList.add('fade-out');
            } else if (transitionType === 'slide') {
                // 오버레이 전환 시에는 fromScreen을 변경하지 않고 그대로 둡니다.
                // fromScreen.classList.remove('active-screen');
            }
        }
        if (toScreen) {
            toScreen.classList.remove('exit-left');
            toScreen.classList.add('active-screen');
        }
    },

    adjustFontSize() {
        const viewport = document.getElementById('game-viewport');
        if (!viewport) return;

        const viewportWidth = viewport.clientWidth;
        const baseFontSize = viewportWidth * 0.055; 
        document.documentElement.style.fontSize = `${baseFontSize}px`;

        const titleElement = document.querySelector('.game-title');
        if (titleElement) {
            titleElement.style.fontSize = '4.0rem'; /* 전체적인 크기 축소 */
        }

        const buttonElement = document.querySelector('.start-button');
        if (buttonElement) {
            buttonElement.style.fontSize = '1.2rem';
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
