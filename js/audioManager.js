// 간단한 오디오 매니저 (BGM & SFX)
(function () {
    const clamp01 = (value) => Math.min(1, Math.max(0, value ?? 0));

    const BGM_TRACKS = {
        main: 'assets/audio/bgm/main_bgm.m4a',
    };

    const SFX_TRACKS = {
        click: 'assets/audio/sfx/click_button.m4a',
        close: 'assets/audio/sfx/close_button.m4a',
        buy: 'assets/audio/sfx/buy.m4a',
        success: 'assets/audio/sfx/success.m4a',
        failure: 'assets/audio/sfx/failure.m4a',
        good_situation: 'assets/audio/sfx/good_situation.m4a',
        erase: 'assets/audio/sfx/erase.m4a',
        open_paper: 'assets/audio/sfx/oepn_paper.m4a',
    };

    // 전역 에셋 리스트 등록 (프리로딩용, but 오디오는 main.js에서 제외 처리 권장)
    try {
        const audioList = [
            ...Object.values(BGM_TRACKS),
            ...Object.values(SFX_TRACKS)
        ];
        if (Array.isArray(audioList) && audioList.length) {
            window.ALL_AUDIO_ASSETS = Array.from(new Set(audioList));
        }
    } catch {}

    const AudioManager = {
        _initialized: false,
        _unlocked: false,
        _currentBgm: null,
        _wasPlayingBgm: false, // 백그라운드 전환 시 재생 상태 저장용
        bgmVolume: 0.7,
        sfxVolume: 0.7,
        _bgmNodes: {},
        _sfxPool: {},
        _sfxPoolSize: 3, // 각 SFX당 유지할 오디오 인스턴스 수

        init(options = {}) {
            const bgmVol = clamp01(options.bgmVolume);
            const sfxVol = clamp01(options.sfxVolume);

            if (this._initialized) {
                this.setBgmVolume(bgmVol);
                this.setSfxVolume(sfxVol);
                return;
            }

            this._initialized = true;
            this.bgmVolume = bgmVol;
            this.sfxVolume = sfxVol;
            
            // 모바일/iOS 대응: 초기화 시점에는 Audio 객체를 대량 생성하지 않음.
            // 대신 사용자 인터랙션(첫 터치) 시점에 unlock하면서 풀을 생성하거나,
            // 재생 요청 시점에 생성함.
            
            this._bindUiClickSounds();
            this._bindEraseListener();
            this._bindUnlockListener();
        },

        // 첫 사용자 입력 시 오디오 컨텍스트/태그를 활성화 (iOS 필수)
        _bindUnlockListener() {
            const unlock = () => {
                if (this._unlocked) return;
                this._unlocked = true;
                
                // 빈 오디오 재생 시도 (AudioContext Unlock 유사 효과)
                // 실제 로딩은 여기서 시작할 수도 있음.
                this._preloadAudio();
                
                document.removeEventListener('click', unlock);
                document.removeEventListener('touchstart', unlock);
                document.removeEventListener('keydown', unlock);
            };

            document.addEventListener('click', unlock, { capture: true, once: true });
            document.addEventListener('touchstart', unlock, { capture: true, once: true });
            document.addEventListener('keydown', unlock, { capture: true, once: true });
        },

        _preloadAudio() {
            // BGM 노드 생성
            Object.entries(BGM_TRACKS).forEach(([key, src]) => {
                if (!this._bgmNodes[key]) {
                    const audio = new Audio(src);
                    audio.loop = true;
                    audio.preload = 'metadata'; // auto 대신 metadata로 변경
                    audio.volume = this.bgmVolume;
                    this._bgmNodes[key] = audio;
                }
            });

            // SFX 풀 생성
            Object.entries(SFX_TRACKS).forEach(([key, src]) => {
                if (!this._sfxPool[key]) {
                    this._sfxPool[key] = [];
                    // 초기엔 1개만 생성, 필요시 확장
                    for (let i = 0; i < 1; i++) {
                        const audio = new Audio(src);
                        audio.preload = 'metadata';
                        this._sfxPool[key].push(audio);
                    }
                }
            });
        },

        playBgm(track = 'main') {
            // 아직 초기화 안됐으면 시도 (보통 첫 인터랙션 후)
            if (!this._unlocked) return; 
            if (!this._bgmNodes[track]) {
                // 없을 경우 생성 시도
                 const src = BGM_TRACKS[track];
                 if (src) {
                    const audio = new Audio(src);
                    audio.loop = true;
                    audio.preload = 'auto';
                    audio.volume = this.bgmVolume;
                    this._bgmNodes[track] = audio;
                 }
            }

            const target = this._bgmNodes?.[track];
            if (!target) return;

            if (this._currentBgm && this._currentBgm !== target) {
                this._currentBgm.pause();
                this._currentBgm.currentTime = 0;
            }

            this._currentBgm = target;
            target.volume = this.bgmVolume;
            target.play().catch(() => {
                // 자동 재생 정책 등으로 실패 시 조용히 무시하거나 추후 재시도 로직 추가 가능
            });
        },

        stopBgm() {
            if (!this._currentBgm) return;
            this._currentBgm.pause();
            this._currentBgm.currentTime = 0;
            this._currentBgm = null;
        },
        
        // 모든 오디오 일시 정지 (앱 백그라운드 진입 시)
        pauseAll() {
            // 이미 재생 중이라면 멈추고 플래그 설정
            if (this._currentBgm && !this._currentBgm.paused) {
                this._currentBgm.pause();
                this._wasPlayingBgm = true;
            } 
            // 이미 멈춰있지만 이전에 재생 중이었다고 마킹되어 있다면 유지 (중복 호출 방지)
            else if (this._wasPlayingBgm) {
                // 유지
            }
            // 그 외(아예 안 틀고 있었음)
            else {
                this._wasPlayingBgm = false;
            }
            
            // 재생 중인 모든 SFX 정지 (풀 전체 순회)
            Object.values(this._sfxPool).forEach(pool => {
                pool.forEach(audio => {
                    if (!audio.paused) {
                        audio.pause();
                    }
                });
            });
        },
        
        // 오디오 재개 (앱 포그라운드 복귀 시)
        resumeAll() {
            if (this._wasPlayingBgm && this._currentBgm) {
                this._currentBgm.play().catch(() => {});
            }
            this._wasPlayingBgm = false;
            // SFX는 보통 짧아서 재개하지 않고 끊긴 대로 둠
        },

        setBgmVolume(value) {
            this.bgmVolume = clamp01(value);
            if (this._currentBgm) {
                this._currentBgm.volume = this.bgmVolume;
            }
            // 모든 BGM 노드 업데이트
            if (this._bgmNodes) {
                Object.values(this._bgmNodes).forEach(audio => audio.volume = this.bgmVolume);
            }
        },

        setSfxVolume(value) {
            this.sfxVolume = clamp01(value);
        },

        playSfx(name, { volume, playbackRate = 1 } = {}) {
            // 페이지가 숨겨진 상태면 재생하지 않음
            if (document.hidden) return;
            
            if (this.sfxVolume <= 0 && (volume === undefined || volume <= 0)) return;
            
            // 풀 없으면 생성 (lazy init)
            if (!this._sfxPool[name]) {
                const src = SFX_TRACKS[name];
                if (!src) return;
                this._sfxPool[name] = [new Audio(src)];
            }

            const pool = this._sfxPool[name];
            // 사용 가능한(재생 중이 아닌/끝난) 오디오 찾기
            let audio = pool.find(a => a.paused || a.ended);
            
            if (!audio) {
                // 풀이 꽉 찼지만 모두 사용 중이면 (제한 범위 내에서) 새로 생성
                if (pool.length < this._sfxPoolSize) {
                    const src = SFX_TRACKS[name];
                    audio = new Audio(src);
                    pool.push(audio);
                } else {
                    // 풀이 꽉 찼으면 가장 오래된(혹은 첫번째) 놈을 강제 재사용 (끊김 감수)
                    audio = pool[0];
                    audio.currentTime = 0;
                }
            }

            // 볼륨 및 속도 설정
            audio.volume = clamp01(volume !== undefined ? volume : this.sfxVolume);
            try {
                audio.playbackRate = playbackRate;
            } catch {}

            // 재생
            audio.play().catch((e) => {
                console.warn(`SFX play failed [${name}]:`, e);
            });
        },

        _bindUiClickSounds() {
            if (this._uiClickBound) return;
            this._uiClickBound = true;
            document.addEventListener('click', (event) => {
                const btn = event.target?.closest('button');
                // sfx="none" 이거나 disabled인 경우 소리 안 남
                if (!btn || btn.disabled || btn.dataset?.sfx === 'none') return;
                
                const id = (btn.id || '').toLowerCase();
                const classStr = (btn.className || '').toLowerCase();
                const isClose = classStr.includes('close') || classStr.includes('cancel') || id.includes('close');
                const clip = isClose ? 'close' : 'click';
                this.playSfx(clip);
            });
        },

        _bindEraseListener() {
            if (this._eraseBound) return;
            this._eraseBound = true;
            document.addEventListener('canvas:clear', (event) => {
                if (event?.detail?.source === 'user') {
                    this.playSfx('erase');
                }
            });
        }
    };

    window.AudioManager = AudioManager;
})();
