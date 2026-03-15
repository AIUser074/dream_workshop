// granite.config.ts

import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'dreamart',
  brand: {
    displayName: '꿈의 그림 공방', // <-- 게임 이름 수정
    primaryColor: '#8B4513',    // <-- 테마 색상 수정
    icon: 'https://i.imgur.com/KqAUcl6.png', // <-- 아이콘 경로 (반드시 실제 파일 경로로!)
    bridgeColorMode: 'inverted',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'live-server', // <-- 실제 사용하는 개발 서버 명령어로 변경 (예: live-server)
      
      // --- 이 부분을 수정합니다 ---
      build: 'npm run build:files', // <-- "비워둡니다."
      // -------------------------
    },
  },
  webViewProps: {
    type: 'game', // <-- 전체 화면을 사용하는 게임 콘텐츠용
  },
  permissions: [],
  outdir: 'dist',
});