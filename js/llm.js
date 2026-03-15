// Lightweight client for calling the Vercel LLM evaluation API
// Usage: await LLMService.evaluateDrawing({ dataUrl, meta })

const LLMService = {
  async evaluateDrawing({ dataUrl, meta = {} }) {
    // config.js에 설정된 API URL을 가져오되, 마지막에 '/'가 있으면 제거합니다.
    const base = ((window.APP_CONFIG && window.APP_CONFIG.apiBaseUrl) || '').replace(/\/$/, '');
    const url = `${base}/api/evaluate`;

    // 서버가 환경변수를 통해 순서를 결정하도록 클라이언트에서는 순서 정보를 보내지 않습니다.
    const payload = { imageDataUrl: dataUrl, meta };
    
    console.log(`Sending evaluation request to: ${url}`); // 디버깅용 로그 추가
    console.log('Payload meta (client-side):', meta); // 보내는 메타 확인

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`LLM evaluate API failed: ${resp.status} ${text}`);
    }
    return await resp.json();
  }
};

window.LLMService = LLMService;


