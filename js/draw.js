const DrawUIManager = {
    init() {
        this.state = {
            currentColor: drawConfig.colors[0] || '#000000',
            brushSize: drawConfig.brushSizes[0] || 4,
            eraserActive: false,
        };
        this.openPanelType = null; // 'color' | 'brush' | null

        this.cacheElements();
        this.bindEvents();
        this.reflectSelectedColor();
    },

    cacheElements() {
        this.viewport = document.getElementById('game-viewport');
        this.currentColorBtn = document.getElementById('current-color-btn');
        this.btnBrushSize = document.getElementById('btn-brush-size');
        this.btnEraser = document.getElementById('btn-eraser');
        this.btnReset = document.getElementById('btn-reset-canvas');
        this.btnFinish = document.getElementById('btn-finish-drawing');

        // 패널/모달 컨테이너 동적 생성
        this.overlay = document.createElement('div');
        this.overlay.className = 'draw-overlay hidden';
        this.overlay.addEventListener('click', (e) => {
            if (e.target !== this.overlay) return;
            // 모달이 열려 있으면 모달 닫기, 아니면 패널 닫기
            if (this.modal && !this.modal.classList.contains('hidden')) {
                this.closeModal();
            } else {
                this.closeAllPanels();
            }
        });

        this.panel = document.createElement('div');
        this.panel.className = 'draw-panel hidden';

        this.modal = document.createElement('div');
        this.modal.className = 'draw-modal hidden';
        this.modal.innerHTML = `
            <div class="modal-card">
                <div class="modal-message"></div>
                <div class="modal-actions">
                    <button class="modal-btn confirm">확인</button>
                    <button class="modal-btn cancel">취소</button>
                </div>
            </div>
        `;
        this.modalMessage = this.modal.querySelector('.modal-message');
        this.modalConfirm = this.modal.querySelector('.modal-btn.confirm');
        this.modalCancel = this.modal.querySelector('.modal-btn.cancel');

        // 모달 배경 클릭 시 닫기 (카드 외부 클릭)
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        document.body.appendChild(this.overlay);
        document.body.appendChild(this.panel);
        document.body.appendChild(this.modal);
    },

    bindEvents() {
        if (this.currentColorBtn) {
            this.currentColorBtn.addEventListener('click', () => this.openColorPanel());
        }
        if (this.btnBrushSize) {
            this.btnBrushSize.addEventListener('click', (e) => this.openBrushPanel(e.currentTarget));
        }
        if (this.btnEraser) {
            this.btnEraser.addEventListener('click', () => this.toggleEraser());
        }
        if (this.btnReset) {
            this.btnReset.addEventListener('click', () => this.openConfirm('캔버스를 모두 지우시겠습니까?', () => {
                this.emit('canvas:clear');
            }));
        }
        if (this.btnFinish) {
            this.btnFinish.addEventListener('click', () => this.openConfirm('그림을 제출하시겠습니까?', () => {
                this.emit('canvas:submit');
            }));
        }

        this.modalCancel.addEventListener('click', () => this.closeModal());
        this.modalConfirm.addEventListener('click', () => {
            if (this._onConfirm) this._onConfirm();
            this.closeModal();
        });

        // ESC 키로 패널/모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.modal && !this.modal.classList.contains('hidden')) {
                    this.closeModal();
                } else {
                    this.closeAllPanels();
                }
            }
        });
    },

    // Event emitter (간단 버전)
    emit(eventName, detail = {}) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    },

    // UI helpers
    reflectSelectedColor() {
        if (this.currentColorBtn) this.currentColorBtn.style.backgroundColor = this.state.currentColor;
        this.emit('brush:color', { color: this.state.currentColor });
    },

    closeAllPanels() {
        this.overlay.classList.add('hidden');
        this.panel.classList.add('hidden');
        this.panel.innerHTML = '';
        this.openPanelType = null;
        if (this._outsideClickHandler) {
            document.removeEventListener('mousedown', this._outsideClickHandler, true);
            this._outsideClickHandler = null;
        }
    },

    openOverlay() {
        this.overlay.classList.remove('hidden');
    },

    // Panels
    openColorPanel() {
        // 토글: 같은 버튼을 다시 누르면 닫기
        if (this.openPanelType === 'color' && !this.panel.classList.contains('hidden')) {
            this.closeAllPanels();
            return;
        }

        // this.openOverlay(); // 오버레이(배경 흐림) 제거
        this.panel.classList.remove('hidden');
        this.panel.innerHTML = `
            <div class="panel-header">색상 선택</div>
            <div class="panel-grid">
                ${drawConfig.colors.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
        `;
        this.panel.querySelectorAll('.color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.state.currentColor = color;
                this.reflectSelectedColor();
                this.closeAllPanels();
            });
        });

        // 색상 버튼 기준으로 패널 위치 지정 (버튼 주변)
        this.positionPanelAbove(this.currentColorBtn);
        this.openPanelType = 'color';

        // 바깥 영역 클릭 시 닫기
        this._outsideClickHandler = (e) => {
            const clickedInsidePanel = this.panel.contains(e.target);
            const clickedAnchor = this.currentColorBtn.contains(e.target);
            if (!clickedInsidePanel && !clickedAnchor) {
                this.closeAllPanels();
                document.removeEventListener('mousedown', this._outsideClickHandler, true);
                this._outsideClickHandler = null;
            }
        };
        document.addEventListener('mousedown', this._outsideClickHandler, true);
    },

    openBrushPanel(anchorEl) {
        // 토글: 같은 버튼을 다시 누르면 닫기
        if (this.openPanelType === 'brush' && !this.panel.classList.contains('hidden')) {
            this.closeAllPanels();
            return;
        }

        // 오버레이는 사용하지 않음 (배경 흐림 없음)
        this.panel.classList.remove('hidden');

        if (drawConfig.useSlider) {
            this.panel.innerHTML = `
                <div class="panel-header">붓 크기</div>
                <div class="slider-row">
                    <input type="range" min="1" max="40" value="${this.state.brushSize}" class="brush-slider" />
                    <span class="size-label">${this.state.brushSize}px</span>
                </div>
            `;
            const slider = this.panel.querySelector('.brush-slider');
            const label = this.panel.querySelector('.size-label');
            slider.addEventListener('input', () => {
                this.state.brushSize = parseInt(slider.value, 10);
                label.textContent = `${this.state.brushSize}px`;
                this.emit('brush:size', { size: this.state.brushSize });
            });
        } else {
            this.panel.innerHTML = `
                <div class="panel-header">붓 크기</div>
                <div class="panel-grid brush-grid">
                    ${drawConfig.brushSizes.map(s => `
                        <button class="size-chip ${this.state.brushSize === s ? 'active' : ''}" data-size="${s}" aria-label="${s}px">
                            <span class="size-dot" style="width:${Math.max(6, s)}px;height:${Math.max(6, s)}px;background:${this.state.currentColor}"></span>
                        </button>
                    `).join('')}
                </div>
            `;
            this.panel.querySelectorAll('.size-chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    const size = parseInt(btn.getAttribute('data-size'), 10);
                    this.state.brushSize = size;
                    this.emit('brush:size', { size });
                    this.closeAllPanels();
                });
            });
        }

        // 패널을 앵커 바로 위에 표시하고 화면 밖으로 나가지 않게 클램프
        this.positionPanelAbove(anchorEl);
        this.openPanelType = 'brush';

        // 바깥 영역 클릭 시 닫기 (오버레이가 없으므로 수동 처리)
        this._outsideClickHandler = (e) => {
            const clickedInsidePanel = this.panel.contains(e.target);
            const clickedAnchor = anchorEl.contains(e.target);
            if (!clickedInsidePanel && !clickedAnchor) {
                this.closeAllPanels();
                document.removeEventListener('mousedown', this._outsideClickHandler, true);
                this._outsideClickHandler = null;
            }
        };
        document.addEventListener('mousedown', this._outsideClickHandler, true);
    },

    positionPanelAbove(anchorEl, gap = 8) {
        // 패널 위치 계산을 위한 초기화
        this.panel.style.transform = 'none';
        this.panel.style.left = '0px';
        this.panel.style.top = '0px';

        const rect = anchorEl.getBoundingClientRect();
        const panelWidth = this.panel.offsetWidth;
        const panelHeight = this.panel.offsetHeight;

        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        let left = rect.left + rect.width / 2 - panelWidth / 2;
        let top = rect.top - panelHeight - gap;

        // 공간이 부족하면 아래로 배치
        if (top < 8) {
            top = Math.min(rect.bottom + gap, viewportH - panelHeight - 8);
        }

        // 좌우 클램프
        left = Math.max(8, Math.min(left, viewportW - panelWidth - 8));

        this.panel.style.left = `${left}px`;
        this.panel.style.top = `${top}px`;
    },

    toggleEraser() {
        this.state.eraserActive = !this.state.eraserActive;
        this.btnEraser.classList.toggle('active', this.state.eraserActive);
        this.emit('eraser:toggle', { active: this.state.eraserActive });
    },

    openConfirm(message, onConfirm) {
        this._onConfirm = onConfirm;
        this.modalMessage.textContent = message;
        this.modal.classList.remove('hidden');
        this.openOverlay();
    },

    closeModal() {
        this.modal.classList.add('hidden');
        this._onConfirm = null;
        this.closeAllPanels();
    }
};

window.addEventListener('DOMContentLoaded', () => {
    // 그림 모드가 열릴 때 초기화되도록 안전장치
    if (document.getElementById('drawing-mode-container')) {
        DrawUIManager.init();
        PaintEngine.init();
    }
});

const PaintEngine = {
    init() {
        this.canvas = document.getElementById('paint-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.dpr = window.devicePixelRatio || 1;
        this.isDrawing = false;
        this.pendingFrame = false; // rAF 중복 호출 방지 플래그
        this.currentPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };

        this.color = drawConfig.colors[0] || '#000000';
        this.size = drawConfig.brushSizes[0] || 4;
        this.eraserActive = false;
        this.strokeCap = 'round';
        this.strokeJoin = 'round';

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 이벤트 연동
        document.addEventListener('brush:color', (e) => {
            this.color = e.detail.color;
        });
        document.addEventListener('brush:size', (e) => {
            this.size = e.detail.size;
        });
        document.addEventListener('eraser:toggle', (e) => {
            this.eraserActive = e.detail.active;
        });
        document.addEventListener('canvas:clear', () => this.clear());
        document.addEventListener('canvas:submit', () => this.submit());

        // 포인터 입력
        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));
    },

    resizeCanvas() {
        // CSS 크기
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width * this.dpr));
        const height = Math.max(1, Math.floor(rect.height * this.dpr));
        // 캔버스 버퍼 크기 설정
        if (this.canvas.width !== width || this.canvas.height !== height) {
            // 이전 내용을 유지하려면 임시 버퍼 사용
            const prev = document.createElement('canvas');
            prev.width = this.canvas.width;
            prev.height = this.canvas.height;
            const pctx = prev.getContext('2d');
            pctx.drawImage(this.canvas, 0, 0);

            this.canvas.width = width;
            this.canvas.height = height;

            // 스케일 적용
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpr, this.dpr);
            this.ctx.lineCap = this.strokeCap;
            this.ctx.lineJoin = this.strokeJoin;

            // 이전 내용 복원 (해상도 변경 보정)
            if (prev.width && prev.height) {
                this.ctx.drawImage(prev, 0, 0, prev.width, prev.height, 0, 0, width, height);
            }
        }
    },

    getPos(evt) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left),
            y: (evt.clientY - rect.top)
        };
    },

    onPointerDown(evt) {
        evt.preventDefault();
        this.isDrawing = true;
        this.lastPos = this.getPos(evt);
        this.drawPoint(this.lastPos.x, this.lastPos.y, true);
    },

    onPointerMove(evt) {
        if (!this.isDrawing) return;
        this.currentPos = this.getPos(evt);

        // rAF를 통해 그리기를 요청합니다.
        if (!this.pendingFrame) {
            this.pendingFrame = true;
            requestAnimationFrame(this.drawLoop.bind(this));
        }
    },

    onPointerUp() {
        this.isDrawing = false;
    },

    drawLoop() {
        if (!this.pendingFrame) return;

        this.drawLine(this.lastPos.x, this.lastPos.y, this.currentPos.x, this.currentPos.y);
        this.lastPos = this.currentPos;

        this.pendingFrame = false;
    },

    drawPoint(x, y, start = false) {
        const ctx = this.ctx;
        const currentSize = this.eraserActive ? drawConfig.eraserSizes[0] : this.size;
        ctx.save();
        if (this.eraserActive) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0,0,0,1)';
            ctx.beginPath();
            ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    },

    drawLine(x1, y1, x2, y2) {
        const ctx = this.ctx;
        const currentSize = this.eraserActive ? drawConfig.eraserSizes[0] : this.size;
        ctx.save();
        if (this.eraserActive) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = this.color;
        }
        ctx.lineWidth = currentSize;
        ctx.lineCap = this.strokeCap;
        ctx.lineJoin = this.strokeJoin;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    },

    clear() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
    },

    submit() {
        try {
            const dataUrl = this.canvas.toDataURL('image/png');
            this.emit('canvas:submitted', { dataUrl });
            // 임시: 저장 동작 대신 로그
            console.log('canvas submitted (dataUrl length):', dataUrl.length);
        } catch (e) {
            console.error('submit failed', e);
        }
    },

    emit(name, detail) {
        document.dispatchEvent(new CustomEvent(name, { detail }));
    }
};
