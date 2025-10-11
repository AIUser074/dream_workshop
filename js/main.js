const Game = {
    init() {
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', this.startGame);
        }
        this.adjustFontSize();
        window.addEventListener('resize', this.adjustFontSize);
    },

    startGame() {
        console.log('게임 시작!');
        const titleScreen = document.querySelector('.title-screen');
        const mainContainer = document.getElementById('main-container');
        if (titleScreen) titleScreen.classList.add('hidden');
        if (mainContainer) mainContainer.classList.remove('hidden');
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
            buttonElement.style.fontSize = '1.8rem';
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
