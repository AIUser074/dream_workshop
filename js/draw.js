const DrawUIManager = {
    init() {
        this.state = {
            currentColor: drawConfig.colors[0] || '#000000',
            currentAlpha: 1,
            brushSize: drawConfig.brushSizes[0] || 4,
            eraserActive: false,
            fillActive: false,
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
        this.btnFill = document.getElementById('btn-fill'); // 채우기 버튼 추가
        this.btnEraser = document.getElementById('btn-eraser');
        this.btnUndo = document.getElementById('btn-undo'); // 되돌리기 버튼 추가
        this.btnReset = document.getElementById('btn-reset-canvas');
        this.btnFinish = document.getElementById('btn-finish-drawing');
        this.toolButtonsContainer = document.querySelector('.tool-buttons');

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
            this.currentColorBtn.addEventListener('click', () => { this.deactivateFillMode(); this.openColorPanel(); });
        }
        if (this.btnBrushSize) {
            this.btnBrushSize.addEventListener('click', (e) => { this.deactivateFillMode(); this.openBrushPanel(e.currentTarget); });
        }
        if (this.btnFill) { // 채우기 버튼 토글
            this.btnFill.addEventListener('click', () => this.toggleFillMode());
        }
        if (this.btnEraser) {
            this.btnEraser.addEventListener('click', () => this.toggleEraser());
        }
        if (this.btnUndo) { // 되돌리기 버튼 이벤트 추가
            this.btnUndo.addEventListener('click', () => this.emit('canvas:undo'));
        }
        if (this.btnReset) {
            this.btnReset.addEventListener('click', () => this.openConfirm('캔버스를 모두 지우시겠습니까?', () => {
                this.emit('canvas:clear', { source: 'user' });
            }));
        }
        if (this.btnFinish) {
            this.btnFinish.addEventListener('click', () => this.openConfirm('그림을 제출하시겠습니까?', () => {
                const currentCount = PlayerData.get('submissionCount') || 0;
                const nextCount = currentCount + 1;

                if (nextCount > 0 && nextCount % 7 === 0) {
                    if (window.AdManager) {
                        // 1. 광고 시청 시작과 동시에 백그라운드 제출 시작 (silent: true)
                        //    로딩 화면 없이 API 호출만 먼저 보냄
                        this.emit('canvas:submit', { silent: true });

                        let hasEarnedReward = false;

                        window.AdManager.showAd(
                            () => {
                                // [Reward] 보상 획득 시:
                                // 플래그만 세우고 실제 UI는 dismiss 시점에 처리 (광고창 뒤에 가려짐 방지)
                                hasEarnedReward = true;
                                PlayerData.set('submissionCount', nextCount);
                            },
                            () => {
                                // [Dismiss] 광고가 닫힐 때 (보상 획득 여부에 따라 분기)
                                if (hasEarnedReward) {
                                    // 보상을 받고 닫았으므로 결과 공개
                                    PaintEngine.revealPendingResult();
                                } else {
                                    // 보상 없이 닫았으므로 취소
                                    PaintEngine.cancelPendingResult();
                                }
                            }
                        );
                    } else {
                        PlayerData.set('submissionCount', nextCount);
                this.emit('canvas:submit');
                    }
                } else {
                    PlayerData.set('submissionCount', nextCount);
                    this.emit('canvas:submit');
                }
            }));
        }

        // 가시 버튼 수 변화에 따른 자동 스케일링 초기화
        this.updateToolScale();
        // MutationObserver로 hidden 클래스 변화 감지
        if (this.toolButtonsContainer) {
            const observer = new MutationObserver(() => this.updateToolScale());
            observer.observe(this.toolButtonsContainer, { attributes: true, subtree: true, attributeFilter: ['class'] });
            this._toolObserver = observer;
        }

        this.modalCancel.addEventListener('click', () => this.closeModal());
        this.modalConfirm.addEventListener('click', () => {
            if (this._onConfirm) this._onConfirm();
            this.closeModal();
        });

        // 외부에서 fill 비활성화 신호가 오면 UI 동기화
        document.addEventListener('fill:deactivate', () => this.deactivateFillMode());

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

    isPanelOpen() {
        return this.openPanelType !== null;
    },

    // Event emitter (간단 버전)
    emit(eventName, detail = {}) {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
    },

    // UI helpers
    reflectSelectedColor() {
        const colorWithAlpha = this.getColorWithAlpha();
        if (this.currentColorBtn) this.currentColorBtn.style.backgroundColor = colorWithAlpha;
        this.emit('brush:color', { color: colorWithAlpha, baseColor: this.state.currentColor, alpha: this.state.currentAlpha });
    },

    getColorWithAlpha() {
        return this._toRgbaString(this.state.currentColor, this.state.currentAlpha);
    },

    _toRgbaString(color, alpha = 1) {
        if (!color) return `rgba(0,0,0,${alpha})`;
        const rgbaMatch = color.match(/rgba?\(([^)]+)\)/i);
        if (rgbaMatch) {
            const parts = rgbaMatch[1].split(',').map(v => parseFloat(v.trim()));
            const [r = 0, g = 0, b = 0] = parts;
            return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
        }
        let hex = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }
        const num = parseInt(hex, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
        this.deactivateEraser(); // 지우개 비활성화

        // 토글: 같은 버튼을 다시 누르면 닫기
        if (this.openPanelType === 'color' && !this.panel.classList.contains('hidden')) {
            this.closeAllPanels();
            return;
        }

        this.panel.classList.remove('hidden');

        let panelHtml = `
            <div class="panel-header">색상 선택</div>
            <div class="panel-grid">
                ${drawConfig.colors.map(c => `<button class="color-swatch" data-color="${c}" style="background:${c}"></button>`).join('')}
            </div>
        `;

        if (drawConfig.useAlphaSlider) {
            const alphaPercent = Math.round(this.state.currentAlpha * 100);
            const previewColor = this.getColorWithAlpha();
            panelHtml += `
                <div class="slider-row alpha-slider-row" style="margin-top:8px;gap:8px;align-items:center;">
                    <span class="alpha-label-text">투명도</span>
                    <input type="range" min="10" max="100" value="${alphaPercent}" class="alpha-slider" />
                    <span class="alpha-value">${alphaPercent}%</span>
                    <span class="alpha-preview-dot" style="display:inline-block;border-radius:999px;background:${previewColor};width:20px;height:20px;"></span>
                </div>
            `;
        }

        this.panel.innerHTML = panelHtml;

        this.panel.querySelectorAll('.color-swatch').forEach(btn => {
            btn.addEventListener('click', () => {
                const color = btn.getAttribute('data-color');
                this.state.currentColor = color;
                this.reflectSelectedColor();
                this.closeAllPanels();
            });
        });

        if (drawConfig.useAlphaSlider) {
            const alphaSlider = this.panel.querySelector('.alpha-slider');
            const alphaValue = this.panel.querySelector('.alpha-value');
            const alphaPreview = this.panel.querySelector('.alpha-preview-dot');
            const updateAlphaPreview = () => {
                const previewColor = this.getColorWithAlpha();
                if (alphaPreview) alphaPreview.style.background = previewColor;
            };
            if (alphaSlider && alphaValue) {
                alphaSlider.addEventListener('input', () => {
                    const percent = parseInt(alphaSlider.value, 10);
                    this.state.currentAlpha = Math.max(0.1, percent / 100);
                    alphaValue.textContent = `${percent}%`;
                    updateAlphaPreview();
                    this.reflectSelectedColor();
                });
            }
            updateAlphaPreview();
        }

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
        this.deactivateEraser(); // 지우개 비활성화

        // 토글: 같은 버튼을 다시 누르면 닫기
        if (this.openPanelType === 'brush' && !this.panel.classList.contains('hidden')) {
            this.closeAllPanels();
            return;
        }

        // 오버레이는 사용하지 않음 (배경 흐림 없음)
        this.panel.classList.remove('hidden');

        if (drawConfig.useSlider) {
            const previewSize = Math.max(2, this.state.brushSize);
            const brushColor = this.getColorWithAlpha();
            this.panel.innerHTML = `
                <div class="panel-header">붓 크기</div>
                <div class="slider-row">
                    <input type="range" min="2" max="30" value="${this.state.brushSize}" class="brush-slider" />
                    <span class="size-label">${this.state.brushSize}px</span>
                    <span class="preview-dot" style="display:inline-block;border-radius:999px;background:${brushColor};width:${previewSize}px;height:${previewSize}px;margin-left:8px;"></span>
                </div>
            `;
            const slider = this.panel.querySelector('.brush-slider');
            const label = this.panel.querySelector('.size-label');
            const previewDot = this.panel.querySelector('.preview-dot');
            const updatePreview = () => {
                const sizePx = Math.max(6, this.state.brushSize);
                previewDot.style.width = `${sizePx}px`;
                previewDot.style.height = `${sizePx}px`;
                previewDot.style.background = this.getColorWithAlpha();
            };
            slider.addEventListener('input', () => {
                this.state.brushSize = parseInt(slider.value, 10);
                label.textContent = `${this.state.brushSize}px`;
                updatePreview();
                this.emit('brush:size', { size: this.state.brushSize });
            });
            updatePreview();
        } else {
            const brushColor = this.getColorWithAlpha();
            this.panel.innerHTML = `
                <div class="panel-header">붓 크기</div>
                <div class="panel-grid brush-grid">
                    ${drawConfig.brushSizes.map(s => `
                        <button class="size-chip ${this.state.brushSize === s ? 'active' : ''}" data-size="${s}" aria-label="${s}px">
                            <span class="size-dot" style="width:${Math.max(6, s)}px;height:${Math.max(6, s)}px;background:${brushColor}"></span>
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

    toggleFillMode() {
        if (this.state.fillActive) {
            this.deactivateFillMode();
            return;
        }
        // 활성화
        this.deactivateEraser(); // 지우개와 상호 배타
        this.state.fillActive = true;
        if (this.btnFill) this.btnFill.classList.add('active');
        const canvas = document.getElementById('paint-canvas');
        if (canvas) canvas.classList.add('fill-cursor');
        this.emit('fill:activate');
    },

    deactivateFillMode() {
        if (!this.state.fillActive) return;
        this.state.fillActive = false;
        if (this.btnFill) this.btnFill.classList.remove('active');
        const canvas = document.getElementById('paint-canvas');
        if (canvas) canvas.classList.remove('fill-cursor');
        // 엔진에도 비활성화 신호
        this.emit('fill:deactivate');
    },

    toggleEraser() {
        this.state.eraserActive = !this.state.eraserActive;
        this.btnEraser.classList.toggle('active', this.state.eraserActive);
        this.emit('eraser:toggle', { active: this.state.eraserActive });
        if (this.state.eraserActive) {
            // 지우개 켤 때 채우기 끔
            this.deactivateFillMode();
        }
    },

    deactivateEraser() {
        if (this.state.eraserActive) {
            this.state.eraserActive = false;
            this.btnEraser.classList.remove('active');
            this.emit('eraser:toggle', { active: false });
        }
    },

    activateFillMode() {
        // 더 이상 단발성 모드가 아니라 toggleFillMode를 사용
        this.toggleFillMode();
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
    },

    updateToolScale() {
        if (!this.toolButtonsContainer) return;
        const buttons = Array.from(this.toolButtonsContainer.querySelectorAll('.tool-btn'))
            .filter(btn => !btn.classList.contains('hidden'));
        const count = buttons.length;
        // 7개 미만: 1.0, 7~8: 0.9, 9~10: 0.8, 11+: 0.7
        let scale = 1;
        if (count >= 8) scale = 0.7;
        else if (count >= 7) scale = 0.8;
        else if (count >= 6) scale = 0.9;
        this.toolButtonsContainer.style.setProperty('--tool-scale', String(scale));
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
        this.useStrokePreview = false;
        this.strokeSnapshot = null;
        this.strokePoints = null;
        this.strokeColorCache = null;
        this.strokeSizeCache = null;
        this.strokeEraser = false;
        this.pendingFrame = false; // rAF 중복 호출 방지 플래그
        
        // 백그라운드 제출(Silent Submit)용 상태 변수
        this.pendingResult = null;
        this.silentMode = false;
        this.forceReveal = false;

        this.currentPos = { x: 0, y: 0 };
        this.lastPos = { x: 0, y: 0 };
        this.history = []; // 작업 내역 저장 배열
        this.maxHistory = 30; // 최대 저장 횟수

        this.color = drawConfig.colors[0] || '#000000';
        this.baseColor = this.color;
        this.currentAlpha = 1;
        this.size = drawConfig.brushSizes[0] || 4;
        this.eraserActive = false;
        this.fillActive = false; // 채우기 모드 상태
        this.strokeCap = 'round';
        this.strokeJoin = 'round';

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // 이벤트 연동
        document.addEventListener('brush:color', (e) => {
            this.color = e.detail.color;
            this.baseColor = e.detail.baseColor || e.detail.color;
            this.currentAlpha = (typeof e.detail.alpha === 'number') ? e.detail.alpha : 1;
        });
        document.addEventListener('brush:size', (e) => {
            this.size = e.detail.size;
        });
        document.addEventListener('eraser:toggle', (e) => {
            this.eraserActive = e.detail.active;
        });
        document.addEventListener('fill:activate', () => { // 채우기 모드 활성화
            this.fillActive = true;
        });
        document.addEventListener('fill:deactivate', () => { // 채우기 모드 비활성화
            this.fillActive = false;
        });
        document.addEventListener('canvas:undo', () => this.undo()); // 되돌리기 이벤트 리스너 추가
        document.addEventListener('canvas:clear', () => this.clear());
        document.addEventListener('canvas:submit', (e) => this.submit(e.detail)); // 옵션 전달 받도록 수정

        // 포인터 입력
        this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));

        this._saveState(); // 초기 상태 저장
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
            
            // 리사이즈 후에는 히스토리의 마지막 상태를 복원
            this._restoreState();
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
        // 패널이 열려있다면, 패널을 닫고 그리기는 시작하지 않습니다.
        if (DrawUIManager.isPanelOpen()) {
            DrawUIManager.closeAllPanels();
            return;
        }

        // 채우기 모드가 활성화 상태이면 채우기 실행(유지)
        if (this.fillActive) {
            const pos = this.getPos(evt);
            const sx = Math.floor(pos.x * this.dpr);
            const sy = Math.floor(pos.y * this.dpr);
            this._floodFill(sx, sy);
            return;
        }
        
        evt.preventDefault();
        this.isDrawing = true;
        this.lastPos = this.getPos(evt);
        this.currentPos = this.lastPos;

        const previewActive = this.startStrokePreview();
        if (previewActive && this.strokePoints) {
            this.strokePoints.push({ x: this.lastPos.x, y: this.lastPos.y });
            this.renderStrokePreview();
        } else {
            this.releaseStrokePreview();
        this.drawPoint(this.lastPos.x, this.lastPos.y, true);
        }
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
        if (!this.isDrawing) return;
        this.isDrawing = false;
        
        // 마지막 포인터 이동으로 인해 그리기가 예약되었을 수 있습니다.
        // 상태를 저장하기 전에 마지막 선 조각을 동기적으로 그려서
        // 저장 후 그려지는 현상(되돌리기 시 문제 발생)을 방지합니다.
        if (this.pendingFrame) {
            this.drawLoop();
        }

        if (this.useStrokePreview && this.strokePoints) {
            // 마지막 좌표까지 확정 렌더링
            if (this.strokePoints.length === 0 || (this.strokePoints[this.strokePoints.length - 1].x !== this.currentPos.x || this.strokePoints[this.strokePoints.length - 1].y !== this.currentPos.y)) {
                this.strokePoints.push({ x: this.currentPos.x, y: this.currentPos.y });
            }
            this.renderStrokePreview();
            this.releaseStrokePreview();
        }

        this._saveState(); // 그리기가 끝나면 상태 저장
    },

    drawLoop() {
        if (!this.pendingFrame) return;

        try {
            if (this.useStrokePreview && this.strokePoints) {
                this.strokePoints.push({ x: this.currentPos.x, y: this.currentPos.y });
                this.renderStrokePreview();
            } else {
                this.drawLine(this.lastPos.x, this.lastPos.y, this.currentPos.x, this.currentPos.y);
            }
            this.lastPos = this.currentPos;
        } catch (e) {
            console.error('[PaintEngine] drawLoop error:', e);
            // 에러 발생 시에도 플래그를 초기화하여 다음 프레임에 다시 시도할 수 있게 함
            this.isDrawing = false; 
        } finally {
            this.pendingFrame = false;
        }
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

    startStrokePreview() {
        if (!drawConfig.useAlphaSlider) return false;
        try {
            const snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.strokeSnapshot = snapshot;
            this.strokePoints = [];
            this.useStrokePreview = true;
            this.strokeColorCache = this.color;
            this.strokeSizeCache = this.eraserActive ? drawConfig.eraserSizes[0] : this.size;
            this.strokeEraser = this.eraserActive;
            return true;
        } catch (err) {
            console.warn('Stroke preview capture failed', err);
            this.strokeSnapshot = null;
            this.strokePoints = null;
            this.useStrokePreview = false;
            return false;
        }
    },

    renderStrokePreview() {
        if (!this.strokeSnapshot || !this.strokePoints || this.strokePoints.length === 0) return;
        try {
            this.ctx.putImageData(this.strokeSnapshot, 0, 0);
        } catch (err) {
            console.warn('Stroke preview restore failed', err);
            this.releaseStrokePreview();
            return;
        }
        this.drawStrokePath(this.strokePoints, this.strokeSizeCache, this.strokeColorCache, this.strokeEraser);
    },

    drawStrokePath(points, size, color, isEraser) {
        if (!points || points.length === 0) return;
        const ctx = this.ctx;
        ctx.save();
        if (isEraser) {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            ctx.fillStyle = 'rgba(0,0,0,1)';
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.strokeStyle = color;
            ctx.fillStyle = color;
        }
        ctx.lineWidth = size;
        ctx.lineCap = this.strokeCap;
        ctx.lineJoin = this.strokeJoin;
        if (points.length === 1) {
            const pt = points[0];
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                ctx.lineTo(points[i].x, points[i].y);
            }
            ctx.stroke();
        }
        ctx.restore();
    },

    releaseStrokePreview() {
        this.strokeSnapshot = null;
        this.strokePoints = null;
        this.useStrokePreview = false;
    },

    clear() {
        const rect = this.canvas.getBoundingClientRect();
        this.ctx.clearRect(0, 0, rect.width, rect.height);
        // 히스토리 초기화 및 빈 캔버스 상태 저장
        this.history = [];
        this._saveState();
    },
    
    // ===== 작업 내역 관리 =====
    _saveState() {
        if (this.history.length >= this.maxHistory) {
            this.history.shift(); // 가장 오래된 내역 제거
        }
        this.history.push(this.canvas.toDataURL());
    },

    _restoreState() {
        if (this.history.length === 0) return;
        const lastState = this.history[this.history.length - 1];
        const img = new Image();
        img.onload = () => {
            const rect = this.canvas.getBoundingClientRect();
            this.ctx.clearRect(0, 0, rect.width, rect.height);
            this.ctx.drawImage(img, 0, 0, this.canvas.width / this.dpr, this.canvas.height / this.dpr);
        };
        img.src = lastState;
    },
    
    undo() {
        if (this.history.length > 1) { // 초기 상태는 남겨둠
            this.history.pop(); // 현재 상태 제거
            this._restoreState();
        }
    },

    // ===== 채우기(Fill) 관련 함수 =====
    _floodFill(startX, startY, tolerance = 48) {
        const ctx = this.ctx;
        const w = this.canvas.width;   // 버퍼 폭 (dpr 반영됨)
        const h = this.canvas.height;  // 버퍼 높이

        if (startX < 0 || startX >= w || startY < 0 || startY >= h) return;

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data; // Uint8ClampedArray

        const fillRGBA = this._hexToRgba(this.color);

        const startIdx = (startY * w + startX) * 4;
        const target = [
            data[startIdx],
            data[startIdx + 1],
            data[startIdx + 2],
            data[startIdx + 3]
        ];
        // 시작색과 채우기색이 사실상 같으면 불필요한 처리 생략
        if (this._colorsMatch(target, fillRGBA, tolerance)) return;

        // 최적화: 빈 캔버스 또는 단색 캔버스 감지
        if (this._isUniformCanvas(data, target, tolerance)) {
            // 전체를 즉시 채우기
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 0, w, h);
            this._saveState();
            return;
        }

        const stack = [startX, startY];
        const visited = new Uint8Array(w * h);
        const filled = new Uint8Array(w * h); // 채워진 영역 마스크

        while (stack.length) {
            const y = stack.pop();
            const x = stack.pop();
            const idx = (y * w + x) * 4;

            if (visited[y * w + x]) continue;
            if (!this._pixelMatches(data, idx, target, tolerance)) continue;
            visited[y * w + x] = 1;
            filled[y * w + x] = 1;

            // 채우기 색 적용
            data[idx] = fillRGBA[0];
            data[idx + 1] = fillRGBA[1];
            data[idx + 2] = fillRGBA[2];
            data[idx + 3] = fillRGBA[3];

            // 4방향 이웃만 푸시 (대각선 통과 방지: 얇은 선 경계 보존)
            if (x > 0) { stack.push(x - 1, y); }
            if (x < w - 1) { stack.push(x + 1, y); }
            if (y > 0) { stack.push(x, y - 1); }
            if (y < h - 1) { stack.push(x, y + 1); }
        }

        // 경계 미세 틈 보정: 채워진 영역의 경계만 불투명 픽셀 방향으로 1px 확장
        const dirs = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [1, -1], [-1, 1], [1, 1]
        ];

        // 경계 픽셀 목록 추출 (최적화)
        let boundary = [];
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const pos = y * w + x;
                if (!filled[pos]) continue;
                // 8방향 중 하나라도 채워지지 않은 이웃이 있으면 경계
                let isBoundary = false;
                for (let k = 0; k < dirs.length; k++) {
                    const nx = x + dirs[k][0];
                    const ny = y + dirs[k][1];
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h || !filled[ny * w + nx]) {
                        isBoundary = true;
                        break;
                    }
                }
                if (isBoundary) boundary.push(x, y);
            }
        }

        // 불투명 픽셀로만 1px 겹치게 확장 (배경 투명 영역으로는 퍼지지 않음)
        const overlapPx = 2;
        for (let iter = 0; iter < overlapPx; iter++) {
            const toAdd = [];
            for (let i = 0; i < boundary.length; i += 2) {
                const x = boundary[i];
                const y = boundary[i + 1];
                for (let k = 0; k < dirs.length; k++) {
                    const nx = x + dirs[k][0];
                    const ny = y + dirs[k][1];
                    if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
                    const nPos = ny * w + nx;
                    if (filled[nPos]) continue;
                    const ni = nPos * 4;
                    const a = data[ni + 3];
                    // 라인/도형 등 불투명한 픽셀로 한 픽셀만 덮어 겹치기
                    if (a > 0) {
                        toAdd.push(nPos);
                        filled[nPos] = 1;
                    }
                }
            }
            if (toAdd.length === 0) break;
            // 새로 추가된 픽셀을 채우고 다음 경계로 설정
            boundary = [];
            for (let i = 0; i < toAdd.length; i++) {
                const pos = toAdd[i];
                const bi = pos * 4;
                data[bi] = fillRGBA[0];
                data[bi + 1] = fillRGBA[1];
                data[bi + 2] = fillRGBA[2];
                data[bi + 3] = fillRGBA[3];
                const bx = pos % w;
                const by = Math.floor(pos / w);
                boundary.push(bx, by);
            }
        }

        ctx.putImageData(imageData, 0, 0);
        this._saveState(); // 채우기 완료 후 상태 저장
    },

    _isUniformCanvas(data, targetColor, tolerance) {
        // 캔버스가 단색인지 샘플링으로 빠르게 확인
        const w = this.canvas.width;
        const h = this.canvas.height;
        const totalPixels = w * h;
        
        // 샘플링: 100개 픽셀만 체크 (대각선 및 랜덤)
        const sampleSize = Math.min(100, totalPixels);
        const step = Math.floor(totalPixels / sampleSize);
        
        for (let i = 0; i < totalPixels; i += step) {
            const idx = i * 4;
            if (!this._colorsMatch(
                [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]],
                targetColor,
                tolerance
            )) {
                return false; // 다른 색 발견
            }
        }
        return true; // 모든 샘플이 같은 색
    },

    _hexToRgba(color) {
        if (!color) return [0,0,0,255];
        const rgbaMatch = color.match(/rgba?\(([^)]+)\)/i);
        if (rgbaMatch) {
            const parts = rgbaMatch[1].split(',').map(v => parseFloat(v.trim()));
            const [r = 0, g = 0, b = 0, a = 1] = parts;
            return [
                Math.max(0, Math.min(255, Math.round(r))),
                Math.max(0, Math.min(255, Math.round(g))),
                Math.max(0, Math.min(255, Math.round(b))),
                Math.max(0, Math.min(255, Math.round((isNaN(a) ? 1 : a) * 255)))
            ];
        }
        let hex = color.replace('#', '');
        if (hex.length === 3) {
            hex = hex.split('').map(ch => ch + ch).join('');
        }
        const result = /^([a-f\d]{6})$/i.exec(hex);
        if (!result) return [0,0,0,255];
        return [
            parseInt(result[1].substr(0, 2), 16),
            parseInt(result[1].substr(2, 2), 16),
            parseInt(result[1].substr(4, 2), 16),
            255
        ];
    },

    _pixelMatches(buf, idx, target, tolerance) {
        const a = buf[idx + 3];
        // 배경(투명/흰색)을 채우는 경우: 얇은 선(저알파)도 경계로 취급하기 위해 엄격
        const isBackgroundTarget =
            target[3] < 12 ||
            (target[0] > 240 && target[1] > 240 && target[2] > 240 && target[3] > 240);

        if (isBackgroundTarget) {
            // 알파가 아주 조금이라도 있으면 배경과 다르다고 본다 (선/가장자리 포함)
            if (a > 2) return false;
            const tol = Math.min(6, tolerance);
            return Math.abs(buf[idx] - target[0]) <= tol &&
                   Math.abs(buf[idx + 1] - target[1]) <= tol &&
                   Math.abs(buf[idx + 2] - target[2]) <= tol &&
                   Math.abs(a - target[3]) <= 6;
        }

        // 일반 색상 채우기: 안티앨리어싱 경계 픽셀(alpha가 낮음)에 대해 동적 허용오차
        const dynamicTol = tolerance + Math.floor((255 - a) / 10);
        return Math.abs(buf[idx] - target[0]) <= dynamicTol &&
               Math.abs(buf[idx + 1] - target[1]) <= dynamicTol &&
               Math.abs(buf[idx + 2] - target[2]) <= dynamicTol &&
               Math.abs(a - target[3]) <= dynamicTol;
    },

    _colorsMatch(c1, c2, tolerance = 0) {
        return Math.abs(c1[0] - c2[0]) <= tolerance &&
               Math.abs(c1[1] - c2[1]) <= tolerance &&
               Math.abs(c1[2] - c2[2]) <= tolerance &&
               Math.abs(c1[3] - c2[3]) <= tolerance;
    },

    async submit(options = {}) {
        if (this.isSubmitted) return; // 중복 제출 방지
        this.isSubmitted = true;
        TimerManager.stop(); // 타이머 정지

        // Silent Mode 설정 (광고 시청 중 백그라운드 처리)
        this.silentMode = !!options.silent;
        this.forceReveal = false;
        this.pendingResult = null; // 이전 대기 결과 초기화

        try {
            // --- 이미지 최적화 및 크롭 (수정됨) ---
            // 상하단 테이블에 가려지지 않은 '유효 캔버스 영역' 전체를 캡처합니다.
            const tableTop = document.querySelector('.drawing-table-top');
            const tableBottom = document.querySelector('.drawing-table-bottom');
            
            // CSS 픽셀 단위 높이
            const topH = tableTop ? tableTop.offsetHeight : 0;
            const bottomH = tableBottom ? tableBottom.offsetHeight : 0;
            
            // 캔버스 버퍼 크기 대비 CSS 크기 비율 (DPR)
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            // 실제 캔버스 버퍼에서 잘라낼 영역 계산
            // 상단바 바로 아래부터, 하단바 바로 위까지
            const cropX = 0;
            const cropY = topH * scaleY;
            const cropW = this.canvas.width;
            const cropH = this.canvas.height - (topH + bottomH) * scaleY;

            // 유효성 검사
            const finalCropH = Math.max(1, cropH);

            // 1. 캔버스 최대 크기를 1024x1024로 제한하여 리사이징 (성능 및 비용 최적화)
            const MAX_DIMENSION = 1024;
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            const ratio = Math.min(MAX_DIMENSION / cropW, MAX_DIMENSION / finalCropH, 1);
            tempCanvas.width = cropW * ratio;
            tempCanvas.height = finalCropH * ratio;
            
            // 배경을 종이 색상(#ebe7dd)으로 채움
            tempCtx.save();
            tempCtx.fillStyle = '#ebe7dd';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.restore();

            // 원본 캔버스의 계산된 영역을 그 위에 그리기
            tempCtx.drawImage(
                this.canvas,
                cropX, // 원본에서 자를 X 시작점
                cropY, // 원본에서 자를 Y 시작점 (상단 테이블 아래)
                cropW, // 원본에서 자를 너비
                finalCropH, // 원본에서 자를 높이 (유효 높이)
                0, // 새 캔버스에 그릴 X 시작점
                0, // 새 캔버스에 그릴 Y 시작점
                tempCanvas.width, // 새 캔버스에 그릴 너비
                tempCanvas.height // 새 캔버스에 그릴 높이
            );

            // 2. 가벼운 JPEG 형식으로 변환 (품질 80%)
            const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.8);
            
            this.emit('canvas:submitted', { dataUrl });

            // 로딩 UI 표시 (Silent 모드일 땐 표시 안 함)
            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner && !this.silentMode) loadingSpinner.classList.remove('hidden');

            // 실제 LLM API 호출 (Vercel)
            const useLLM = true; // 필요 시 설정으로 노출 가능
            
            // --- 평가 컨텍스트(Meta) 전달 ---
            // Game 객체에서 현재 의뢰 정보를 가져와 meta 객체에 담습니다.
            const meta = window.Game ? window.Game.getCurrentQuestInfo() : {};
            // rubrics 동적 주입 (solve 유형은 제외)
            try {
                if (!(meta && meta.questType === 'solve')) {
                    const reqId = meta && meta.requestId;
                    const reqDef = (window.REQUEST_DATA && reqId) ? window.REQUEST_DATA[reqId] : null;
                    if (reqDef && Array.isArray(reqDef.rubrics)) {
                        meta.rubrics = reqDef.rubrics;
                    } else if (reqId) {
                        console.warn('No rubric found for requestId:', reqId, '— skipping rubric mode.');
                    }
                }
            } catch {}
            console.log('LLM meta payload:', meta);

            if (useLLM && window.LLMService) {
                // solve 유형: ANALYZE -> 스토리 결정 -> CREATE(코멘트)
                if (meta && meta.questType === 'solve') {
                    // 요청 정의 우선: requests.js의 REQUEST_SOLVE 활용
                    const solveDef = (window.REQUEST_SOLVE && meta.requestId && window.REQUEST_SOLVE[meta.requestId]) || null;
                    // 공통 0번 항목: '그림인가?' 선판단
                    const commonAnalyzeItems = [
                        { key: 'is_drawing', question: "이 입력이 명확한 '그림'인가? (true/false). 사진/텍스트/빈 캔버스/낙서 수준(의미 불명)은 false" }
                    ];
                    const analyzeMeta = {
                        mode: 'ANALYZE',
                        problemTitle: (solveDef && solveDef.problemTitle) || meta.requestText || meta.theme || '문제 해결',
                        analysisItems: [
                            ...commonAnalyzeItems,
                            ...((solveDef && Array.isArray(solveDef.analysisItems)) ? solveDef.analysisItems : (Array.isArray(meta.analysisItems) ? meta.analysisItems : []))
                        ]
                    };
                    try {
                        const analyzeRes = await window.LLMService.evaluateDrawing({ dataUrl, meta: analyzeMeta });
                        const analysis = analyzeRes.analysis || {};
                        const description = analyzeRes.description || '';
                        console.debug('ANALYZE →', analysis);
                        const analyzeDebug = {
                            analyzeProvider: analyzeRes.provider,
                            analyzeModel: analyzeRes.model,
                            analyzePrompt: analyzeRes.prompt,
                            analyzeTokens: analyzeRes.tokens,
                            analyzeRaw: analyzeRes.raw
                        };

                        // 공통 선판정: '그림인가?'가 false면 CREATE 생략, 최악 반응으로 즉시 종료
                        const normalizeBool = (v) => (v === true || v === 'true' || v === 1);
                        if (normalizeBool(analysis.is_drawing) === false) {
                            const outcomeKey = 'reaction_terrible';
                            const story = { result: '그림 아님', tone: '실망과 당혹', outcome: outcomeKey };
                            const mappedScore = 12;
                            // 요청 정의에 저장된 NPC별 고정 멘트 사용 (없으면 기본 문구)
                            const notDrawingComment = (solveDef && solveDef.notDrawingComment) || '이건 그림이 아니잖아요....';
                            
                            this._handleSubmissionResult({
                                score: mappedScore,
                                comment: notDrawingComment,
                                analysis,
                                story,
                                imageDataUrl: dataUrl,
                                // ANALYZE 호출 디버그만 기록
                                ...analyzeDebug,
                                solveOutcome: outcomeKey,
                                solveReactionKey: outcomeKey
                            });
                            return;
                        }

                        // 간단한 스토리 판정 (요청별 규칙)
                        // 규칙 기반 스토리 결정 (REQUEST_SOLVE.rules 우선)
                        const story = (() => {
                            const rules = (solveDef && Array.isArray(solveDef.rules)) ? solveDef.rules : [];
                            for (const rule of rules) {
                                const cond = rule.when || {};
                                let ok = true;
                                for (const k in cond) {
                                    const want = cond[k];
                                    const got = normalizeBool(analysis[k]);
                                    if (typeof want === 'boolean') {
                                        if (got !== want) { ok = false; break; }
                                    } else {
                                        // 숫자/문자 등은 느슨 비교 (필요시 확장)
                                        if ((analysis[k] ?? null) !== want) { ok = false; break; }
                                    }
                                }
                                if (ok) return { result: rule.resultText || '결과', tone: rule.tone || '', outcome: rule.outcome || 'partial' };
                            }
                            return { result: '결과 미정', tone: '중립', outcome: 'partial' };
                        })();
                        console.debug('STORY    →', story);

                        // --- PIE_STORY_06 전용: 몽타주 내용에 따른 고정 반응 분기 ---
                        const isPieMontage = meta && meta.requestId === 'PIE_STORY_06';
                        const hasDog = isPieMontage ? normalizeBool(analysis.has_dog) : false;
                        const hasGhost = isPieMontage ? normalizeBool(analysis.has_ghost) : false;

                        // 5단계 반응 키(quest별 커스텀)를 그대로 사용하고, 점수는 대략 매핑
                        const outcomeKey = story.outcome || 'reaction_normal';
                        let mappedScore = 55;
                        if (outcomeKey === 'reaction_perfect') mappedScore = 92;
                        else if (outcomeKey === 'reaction_good') mappedScore = 75;
                        else if (outcomeKey === 'reaction_normal') mappedScore = 55;
                        else if (outcomeKey === 'reaction_bad') mappedScore = 30;
                        else if (outcomeKey === 'reaction_terrible') mappedScore = 12;

                        // PIE_STORY_06 특수 케이스: CREATE 호출 대신 고정 대사 사용
                        if (isPieMontage && hasDog) {
                            const finalComment = "우리 마을 귀염둥이 포치가 범인이었다구요..? 어쩐지.. 요새 살이 좀 찐 것 같더라구요.. 충격이네요.. 그래도 범인을 밝혀주셔서 정말 감사해요!";
                            
                            this._handleSubmissionResult({
                                score: mappedScore,
                                comment: finalComment,
                                analysis,
                                story,
                                imageDataUrl: dataUrl,
                                // ANALYZE 호출 디버그만 기록
                                ...analyzeDebug,
                                // solve 결과(5단계 반응 키)
                                solveOutcome: outcomeKey,
                                solveReactionKey: outcomeKey
                            });
                            return;
                        }

                        if (isPieMontage && !hasDog && hasGhost) {
                            const finalComment = "그런가요..? 유령이 범인이라니 뭔가 찝찝하지만.. 작가님이 그렇다면 그런거겠죠.";
                            
                            this._handleSubmissionResult({
                                score: mappedScore,
                                comment: finalComment,
                                analysis,
                                story,
                                imageDataUrl: dataUrl,
                                ...analyzeDebug,
                                solveOutcome: outcomeKey,
                                solveReactionKey: outcomeKey
                            });
                            return;
                        }

                        const npc = (window.npcData && meta.customerId && window.npcData[meta.customerId]) ? window.npcData[meta.customerId] : null;
                        // 스토리 결과에 따른 기대 반응(라벨) 매핑
                        const reactionLabelMap = {
                            reaction_perfect: '매우 만족',
                            reaction_good: '만족',
                            reaction_normal: '보통',
                            reaction_bad: '불만족',
                            reaction_terrible: '매우 불만족'
                        };
                        const expectedReaction = reactionLabelMap[story.outcome] || '보통';
                        const createMeta = {
                            mode: 'CREATE',
                            npcName: (npc && npc.name) || meta.customerName || meta.customerId || '고객',
                            persona: (npc && npc.persona) || meta.customerPersona || '',
                            problemTitle: analyzeMeta.problemTitle,
                            imageDescription: description,
                            storyResult: story.result,
                            toneHint: story.tone,
                            expectedReaction,
                            // 말투: npcData에 정의된 말투(meta.speechStyle)를 전달
                            speechStyle: meta.speechStyle || ''
                        };
                        const createRes = await window.LLMService.evaluateDrawing({ dataUrl, meta: createMeta });
                        const finalComment = (createRes && createRes.comment) ? createRes.comment : '';
                        console.debug('COMMENT  →', finalComment);

                        this._handleSubmissionResult({
                            score: mappedScore,
                            comment: finalComment,
                            analysis,
                            story,
                            imageDataUrl: dataUrl,
                            // CREATE 호출 디버그
                            provider: createRes.provider,
                            model: createRes.model,
                            prompt: createRes.prompt,
                            tokens: createRes.tokens,
                            raw: createRes.raw,
                            // ANALYZE 호출 디버그
                            ...analyzeDebug,
                            // solve 결과(5단계 반응 키)
                            solveOutcome: outcomeKey,
                            solveReactionKey: outcomeKey
                        });
                    } catch (err) {
                        console.warn('LLM solve-mode failed, fallback to simulation:', err);
                        const score = 0;
                        
                        this._handleSubmissionResult({ 
                            score, 
                            comment: '임시 결과(오프라인 폴백)', 
                            imageDataUrl: dataUrl, 
                            provider: 'fallback', 
                            model: 'simulation' 
                        });
                    }
                } else {
                    // 기존 루브릭/레거시 평가
                window.LLMService.evaluateDrawing({ dataUrl, meta })
                    .then((res) => {
                        const score = typeof res.score === 'number' ? res.score : 0;
                            this._handleSubmissionResult({ ...res, score, imageDataUrl: dataUrl });
                    })
                    .catch((err) => {
                        console.warn('LLM evaluate failed, fallback to simulation:', err);
                        const score = 0;
                            
                            this._handleSubmissionResult({
                            score,
                            feedback: '임시 평가(오프라인 폴백)',
                                imageDataUrl: dataUrl,
                            provider: 'fallback',
                            model: 'simulation',
                            prompt: typeof meta === 'string' ? meta : undefined,
                            tokens: null
                        });
                    });
                }
            } else {
                // 폴백 시뮬레이션
                setTimeout(() => {
                    const score = 0;
                    
                    this._handleSubmissionResult({
                        score,
                        feedback: '임시 평가(시뮬레이션)',
                        imageDataUrl: dataUrl, // 폴백 시에도 이미지 데이터 전달
                        provider: 'fallback',
                        model: 'simulation',
                        prompt: typeof meta === 'string' ? meta : undefined,
                        tokens: null
                    });
                }, 1500);
            }
        } catch (e) {
            console.error('submit failed', e);
            this.isSubmitted = false; // 실패 시 다시 제출 가능하도록
            
            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
        }
    },

    _getDrawingBounds() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        
        let minX = w, minY = h, maxX = 0, maxY = 0;
        let foundPixel = false;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                const alpha = data[(y * w + x) * 4 + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                    foundPixel = true;
                }
            }
        }
        
        if (!foundPixel) {
            return { x: 0, y: 0, width: w, height: h };
        }

        // 약간의 여백(padding) 추가
        const padding = 10;
        minX = Math.max(0, minX - padding);
        minY = Math.max(0, minY - padding);
        maxX = Math.min(w, maxX + padding);
        maxY = Math.min(h, maxY + padding);

        return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    },

    // 제출 결과 처리 (Silent 모드 지원)
    _handleSubmissionResult(resultData) {
        const loadingSpinner = document.getElementById('loading-spinner');
        
        if (this.silentMode && !this.forceReveal) {
            // 조용히 저장만 해둠 (광고 시청 중)
            this.pendingResult = resultData;
            console.log('[PaintEngine] Result pending (Silent Mode)');
        } else {
            // 즉시 표시
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            this.emit('drawing:finished', resultData);
        }
        // 제출 상태 해제 (중복 방지 해제)
        this.isSubmitted = false;
    },

    // 대기 중인 결과 공개 (광고 시청 완료 시 호출)
    revealPendingResult() {
        console.log('[PaintEngine] Reveal requested');
        this.forceReveal = true; // 이후 도착하는 결과는 즉시 표시

        if (this.pendingResult) {
            // 이미 결과가 와 있다면 즉시 표시
            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner) loadingSpinner.classList.add('hidden');
            
            this.emit('drawing:finished', this.pendingResult);
            this.pendingResult = null;
            this.silentMode = false;
        } else {
            // 아직 결과가 안 왔다면 로딩 표시하고 대기 (도착하면 _handleSubmissionResult가 forceReveal 보고 처리함)
            const loadingSpinner = document.getElementById('loading-spinner');
            if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        }
    },

    // 대기 중인 결과 취소 (광고 시청 실패/중단 시 호출)
    cancelPendingResult() {
        console.log('[PaintEngine] Pending result cancelled');
        this.pendingResult = null;
        this.silentMode = false;
        this.forceReveal = false;
        this.isSubmitted = false; // 다시 제출 가능하도록 해제
        
        const loadingSpinner = document.getElementById('loading-spinner');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    },

    emit(name, detail) {
        document.dispatchEvent(new CustomEvent(name, { detail }));
    }
};

const TimerManager = {
    init() {
        this.progressEl = document.querySelector('.timer-progress');
        this.textEl = document.querySelector('.timer-text');
        if (!this.progressEl) return;

        this.radius = this.progressEl.r.baseVal.value;
        this.circumference = 2 * Math.PI * this.radius;
        this.progressEl.style.strokeDasharray = this.circumference;
        
        this.duration = 0;
        this.remaining = 0;
        this.timerId = null;
        this.onEndCallback = null;
        this.locked = false;
        this.lockedValue = null;
    },

    start(duration, onEnd) {
        this.duration = duration;
        this.remaining = duration;
        this.onEndCallback = onEnd;
        this.paused = false;
        this.locked = false;
        this.lockedValue = null;

        if (this.timerId) clearInterval(this.timerId);
        this.updateVisuals();

        this.timerId = setInterval(() => {
            if (this.paused || this.locked) return; // 일시정지/고정 중에는 진행하지 않음
            this.remaining--;
            this.updateVisuals();
            if (this.remaining <= 0) {
                this.stop();
                if (this.onEndCallback) this.onEndCallback();
            }
        }, 1000);
    },

    pause() {
        this.paused = true;
    },

    resume() {
        this.paused = false;
    },

    stop() {
        clearInterval(this.timerId);
        this.timerId = null;
        this.paused = false;
        this.locked = false;
        this.lockedValue = null;
    },

    addTime(seconds) {
        if (!this.timerId || !seconds || seconds <= 0) return;
        this.duration += seconds;
        this.remaining += seconds;
        this.updateVisuals();
    },

    lockAt(seconds = 10) {
        if (!this.timerId) return;
        this.locked = true;
        this.lockedValue = Math.max(0, Math.floor(seconds));
        this.remaining = this.lockedValue;
        this.updateVisuals();
    },

    updateVisuals() {
        if (!this.progressEl || !this.textEl) return;
        if (this.locked) {
            this.textEl.textContent = String(this.lockedValue ?? this.remaining);
            this.progressEl.style.strokeDashoffset = 0;
            const containerLocked = this.progressEl.closest('.timer-container');
            if (containerLocked) containerLocked.classList.remove('warning', 'critical');
            return;
        }
        const offset = this.circumference * (1 - this.remaining / this.duration);
        this.progressEl.style.strokeDashoffset = offset;
        this.textEl.textContent = this.remaining;

        // 시간대별 클래스 변경
        const container = this.progressEl.closest('.timer-container');
        if (!container) return;

        if (this.remaining <= 10) {
            container.classList.add('critical');
            this.progressEl.classList.add('critical');
            container.classList.remove('warning');
            this.progressEl.classList.remove('warning');
        } else if (this.remaining <= 20) {
            container.classList.add('warning');
            this.progressEl.classList.add('warning');
            container.classList.remove('critical');
            this.progressEl.classList.remove('critical');
        } else {
            container.classList.remove('warning', 'critical');
            this.progressEl.classList.remove('warning', 'critical');
        }
    }
};
