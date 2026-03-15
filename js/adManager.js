class AdManager {
    constructor() {
        // 보상형 광고 테스트 ID
        this.adGroupId = 'ait.live.f7b0d3f99bdd404a'; 
        this.isLoaded = false;
        this.isLoading = false;
        this.useMock = false;
        this.lastError = null; // 디버깅용: 마지막 에러 저장
        this.isShow = false; // 광고 표시 중 여부 플래그
    }

    init() {
        // 이미 Adapter를 통해 GoogleAdMob이 window에 주입되었을 수 있습니다.
        // 주입되지 않았다면 Adapter 로딩 지연일 수 있으므로 잠시 대기합니다.
        this.waitForSdk(0);
    }

    waitForSdk(retryCount) {
        if (typeof GoogleAdMob !== 'undefined') {
            console.log('[AdManager] GoogleAdMob SDK found.');
            this.checkSupportAndPreload();
            return;
        }

        // 최대 10초(20회 * 500ms) 대기
        if (retryCount < 20) {
            setTimeout(() => this.waitForSdk(retryCount + 1), 500);
        } else {
            console.warn('[AdManager] GoogleAdMob SDK not found. Switching to Mock mode.');
            this.useMock = true;
            this.preloadAd();
        }
    }

    checkSupportAndPreload() {
        try {
            let isSupported = false;
            
            if (GoogleAdMob?.loadAppsInTossAdMob?.isSupported &&
                typeof GoogleAdMob.loadAppsInTossAdMob.isSupported === 'function') {
                isSupported = GoogleAdMob.loadAppsInTossAdMob.isSupported();
            }

            if (!isSupported) {
                console.warn('[AdManager] AdMob not supported on this device. Using Mock mode.');
                this.lastError = 'AdMob not supported';
                this.useMock = true;
            }
            
            this.preloadAd();
        } catch (e) {
            console.error('[AdManager] Init error:', e);
            this.lastError = `Init Exception: ${e.message}`;
            this.useMock = true;
            this.preloadAd();
        }
    }

    preloadAd() {
        if (this.isLoaded) {
            console.log('[AdManager] Preload skipped: Already loaded.');
            return;
        }
        if (this.isLoading) {
            console.log('[AdManager] Preload skipped: Already loading.');
            return;
        }

        console.log('[AdManager] Preloading ad...');
        this.isLoading = true;
        this.lastError = null; // 새로운 시도 시 에러 초기화
        
        // 30초 안전장치: 로딩이 너무 오래 걸리면 강제로 상태 초기화
        if (this.loadTimeout) clearTimeout(this.loadTimeout);
        this.loadTimeout = setTimeout(() => {
            if (this.isLoading) {
                console.warn('[AdManager] Load timeout (30s). Resetting loading state.');
                alert('[AdManager] Load timeout (30s). Resetting loading state.');
                this.isLoading = false;
                this.lastError = 'Timeout';
            }
        }, 30000);

        // Mock 모드이거나 SDK가 없으면 Mock으로 동작 (안전장치)
        if (this.useMock || typeof GoogleAdMob === 'undefined') {
            if (!this.useMock) {
                // SDK가 없어서 이곳에 도달했다면, 명시적으로 Mock 모드 활성화 알림
                console.warn('[AdManager] GoogleAdMob SDK missing in preload. Auto-switching to Mock.');
                this.useMock = true; 
            }
            
            setTimeout(() => {
                this.isLoaded = true;
                this.isLoading = false;
                console.log('[AdManager] Ad loaded (Mock)');
            }, 1000);
            return;
        }

        try {
            GoogleAdMob.loadAppsInTossAdMob({
                options: {
                    adGroupId: this.adGroupId,
                },
                onEvent: (event) => {
                    console.log('[AdManager] Load event:', event.type);
                    if (event.type === 'loaded') {
                        console.log('[AdManager] Ad loaded');
                        // alert('[AdManager] Ad loaded successfully'); // 테스트용 알림
                        this.isLoaded = true;
                        this.isLoading = false;
                        if (this.loadTimeout) clearTimeout(this.loadTimeout);
                    }
                },
                onError: (error) => {
                    console.error('[AdManager] Ad load failed', error);
                    alert('[AdManager] Ad load failed: ' + JSON.stringify(error)); // 테스트용 알림
                    this.isLoading = false;
                    this.lastError = error; // 에러 저장
                    if (this.loadTimeout) clearTimeout(this.loadTimeout);
                    
                    // 잠시 후 재시도
                    setTimeout(() => this.preloadAd(), 10000);
                },
            });
        } catch (e) {
            console.error('[AdManager] Exception during load', e);
            this.isLoading = false;
            this.lastError = e.message; // 예외 저장
            if (this.loadTimeout) clearTimeout(this.loadTimeout);
        }
    }

    showAd(onReward, onDismiss) {
        // 광고가 실제로 로드된 상태가 아니면 절대 show를 호출하지 않는다.
        // (!isLoaded && !isLoading) 상태에서 show를 호출하면 ADMOB_NOT_LOADED 가 발생할 수 있다.
        if (!this.isLoaded) {
            console.warn(
                '[AdManager] Ad not ready.',
                'isLoaded:', this.isLoaded,
                'isLoading:', this.isLoading,
                'lastError:', this.lastError
            );

            // 아직 로딩 중이 아니라면 새로 로드를 시도한다.
            if (!this.isLoading) {
                this.preloadAd();
            }

            alert('광고를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        // 광고 소비 처리: 이제 보여줄 것이므로 로드 상태 해제
        this.isLoaded = false;
        this.isShow = true; // 광고 표시 시작

        // 광고 시청 중 배경음악 일시정지 (바탕화면 나가도 재생 안되게)
        if (window.AudioManager && typeof AudioManager.pauseAll === 'function') {
            AudioManager.pauseAll();
        }

        if (this.useMock) {
            const confirmed = confirm('[Mock] 광고를 시청하시겠습니까? (확인을 누르면 보상 지급)');
            
            // Mock 모드에서도 즉시 다음 광고 로드 시도
            this.preloadAd();

            if (confirmed) {
                onReward();
            }
            if (onDismiss) onDismiss();

            // Mock 종료 후 오디오 및 상태 복구
            this.isShow = false;
            if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                AudioManager.resumeAll();
            }
            return;
        }

        try {
            GoogleAdMob.showAppsInTossAdMob({
                options: {
                    adGroupId: this.adGroupId,
                },
                onEvent: (event) => {
                    switch (event.type) {
                        case 'requested':
                            console.log('[AdManager] Ad requested');
                            break;
                        case 'userEarnedReward':
                            console.log('[AdManager] Reward earned');
                            if (onReward) onReward();
                            break;
                        case 'dismissed':
                            console.log('[AdManager] Ad dismissed');
                            this.isShow = false; // 광고 종료
                            if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                                AudioManager.resumeAll();
                            }
                            if (onDismiss) onDismiss();
                            // 안전장치: 혹시 impression에서 로드가 시작되지 않았다면 여기서라도 로드
                            this.preloadAd();
                            break;
                        case 'failedToShow':
                            console.error('[AdManager] Failed to show');
                            this.isShow = false; // 광고 종료 (실패)
                            if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                                AudioManager.resumeAll();
                            }
                            alert('광고 재생에 실패했습니다.');
                            // 실패했으므로 다시 로드 시도
                            this.preloadAd();
                            break;
                        case 'impression':
                            console.log('[AdManager] Ad impression');
                            // 테스트 ID 환경에서는 광고가 재생 중일 때 다음 광고 로드를 시도하면 충돌이 발생할 수 있습니다.
                            // 따라서 impression 시점의 로드는 비활성화하고, dismissed 시점에 로드하도록 변경합니다.
                            break;
                        case 'show':
                            console.log('[AdManager] Ad content shown');
                            // setTimeout(() => {
                            //     this.preloadAd();
                            // }, 500);
                            break;
                        case 'clicked':
                            console.log('[AdManager] Ad clicked');
                            break;
                    }
                },
                onError: (error) => {
                    console.error('[AdManager] Show error', error);
                    alert(`[ShowError] ${JSON.stringify(error)}`);
                    this.isShow = false; // 에러 시에도 상태 복구
                    if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                        AudioManager.resumeAll();
                    }
                    if (onDismiss) onDismiss(); // 에러 시에도 게임 진행을 위해 dismiss 콜백 호출
                    this.preloadAd();
                }
            });
        } catch (e) {
            console.error('[AdManager] Exception during show', e);
            alert(`[ShowException] ${e.message}`);
            this.isShow = false; // 예외 시에도 상태 복구
            if (window.AudioManager && typeof AudioManager.resumeAll === 'function') {
                AudioManager.resumeAll();
            }
            if (onDismiss) onDismiss(); // 예외 시에도 게임 진행을 위해 dismiss 콜백 호출
            this.preloadAd();
        }
    }
}

window.AdManager = new AdManager();
// 게임 시작 시점(스크립트 로드 직후)에 미리 광고 로드를 시작합니다.
window.AdManager.init();
