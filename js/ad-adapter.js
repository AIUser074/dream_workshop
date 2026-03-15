import { GoogleAdMob } from '@apps-in-toss/web-framework';

// GoogleAdMob을 전역 변수(window)에 할당하여, 
// 다른 일반 JS 파일(adManager.js 등)에서도 접근할 수 있게 합니다.
if (typeof window !== 'undefined') {
    window.GoogleAdMob = GoogleAdMob;
    console.log('[AdAdapter] GoogleAdMob loaded via adapter.');
}

