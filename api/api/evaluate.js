// Vercel serverless function: POST /api/evaluate
// Receives { imageDataUrl, meta } and returns { score, feedback, rubric }

import { buildPrompt } from './_prompt.js';
import { callGemini, callOpenAI, callGeminiText, callOpenAIText } from './_providers.js';

export default async function handler(req, res) {
    // CORS Headers: AIT 앱 번들 등 외부 도메인에서의 요청을 허용합니다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // CORS Preflight 요청 처리
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    console.log("Evaluation request received.");

    try {
        const { imageDataUrl, meta } = req.body || {};
        const mode = meta && meta.mode;
        if (mode !== 'CREATE') {
        if (!imageDataUrl || typeof imageDataUrl !== 'string') {
            return res.status(400).json({ error: 'imageDataUrl is required' });
            }
        }
        
        console.log("Image data URL received, meta:", meta);

        // 이미지 데이터 URL에서 base64 부분만 추출합니다. (CREATE 모드는 이미지 미사용)
        const base64 = imageDataUrl ? (imageDataUrl.split(',')[1] || imageDataUrl) : '';
        
        console.log("Building prompt...");
        const prompt = buildPrompt(meta);

        // 사용할 LLM 프로바이더 순서를 Vercel 환경변수에서만 읽어옵니다.
        const orderStr = process.env.LLM_PROVIDER_ORDER;
        const providerOrder = (orderStr ? orderStr.split(',') : ['openai', 'gemini']).map(s => s.trim());
        console.log("Provider order (from server env):", providerOrder);

        const callers = [];
        for (const p of providerOrder) {
            if (mode === 'CREATE') {
                if (p === 'gemini') callers.push(() => callGeminiText({ prompt }));
                if (p === 'openai') callers.push(() => callOpenAIText({ prompt }));
            } else {
            if (p === 'gemini') callers.push(() => callGemini({ base64, prompt }));
            if (p === 'openai') callers.push(() => callOpenAI({ base64, prompt }));
            }
        }

        let lastErr = null;
        for (const call of callers) {
            try {
                console.log(`Attempting to call provider: ${callers.indexOf(call)}`);
                const out = await call();
                console.log("Provider call successful. Sending response.");
                return res.status(200).json(out);
            } catch (err) {
                lastErr = err;
                console.warn(`Provider failed: ${err.message}. Trying next provider...`);
            }
        }

        if (lastErr) {
            console.error('All providers failed. Last error:', lastErr);
        }

        // 모든 프로바이더 호출에 실패했을 경우의 최종 폴백 응답입니다.
        console.log("All providers failed. Sending fallback response.");
        return res.status(200).json({
            score: 75,
            feedback: '현재 평가 시스템에 문제가 있어 임시 점수가 부여되었습니다.',
            rubric: { color: 0.75, composition: 0.75, creativity: 0.75, completeness: 0.75 }
        });

    } catch (err) {
        console.error('Evaluation handler error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

// buildPrompt는 ./_prompt.js에서 import 합니다.


