import axios from 'axios';

// --- Gemini (Google) ---
// Gemini 1.5 Flash 모델을 사용하여 이미지와 프롬프트를 보내고, 평가 결과를 JSON으로 받습니다.
export async function callGemini({ base64, prompt }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set in Vercel environment variables');

    const modelName = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: 'image/png',
                                data: base64
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                response_mime_type: "application/json",
                thinkingConfig: {
                    thinkingBudget: 0,
                  },
            }
        }, { timeout: 10000 });

        const usage = response.data.usageMetadata || {};
        console.log(`[Gemini] model=${modelName} promptChars=${prompt?.length || 0} imageBase64Chars=${base64?.length || 0}`);
        if (usage) console.log(`[Gemini] tokens prompt=${usage.promptTokenCount} candidates=${usage.candidatesTokenCount} total=${usage.totalTokenCount}`);

        const resultText = response.data.candidates[0].content.parts[0].text;
        const parsed = parseLLMResponse(resultText, 'Gemini');

        return normalizeResponse(parsed, {
            provider: 'Gemini',
            model: modelName,
            prompt,
            raw: resultText,
            tokens: {
                prompt: usage.promptTokenCount ?? null,
                completion: usage.candidatesTokenCount ?? null,
                total: usage.totalTokenCount ?? null,
            }
        });

    } catch (error) {
        console.error("Gemini API call failed:", error.response ? error.response.data : error.message);
        throw new Error("Gemini API request failed");
    }
}

// --- Gemini (text-only) ---
export async function callGeminiText({ prompt }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set in Vercel environment variables');

    const modelName = 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [ { parts: [ { text: prompt } ] } ],
            generationConfig: {
                response_mime_type: "application/json",
                thinkingConfig: { thinkingBudget: 0 }
            }
        }, { timeout: 10000 });

        const usage = response.data.usageMetadata || {};
        console.log(`[GeminiText] model=${modelName} promptChars=${prompt?.length || 0}`);
        if (usage) console.log(`[GeminiText] tokens prompt=${usage.promptTokenCount} candidates=${usage.candidatesTokenCount} total=${usage.totalTokenCount}`);

        const resultText = response.data.candidates[0].content.parts[0].text;
        try {
            const parsed = parseLLMResponse(resultText, 'GeminiText');
            return normalizeResponse(parsed, {
                provider: 'GeminiText',
                model: modelName,
                prompt,
                raw: resultText,
                tokens: {
                    prompt: usage.promptTokenCount ?? null,
                    completion: usage.candidatesTokenCount ?? null,
                    total: usage.totalTokenCount ?? null,
                }
            });
        } catch (e) {
            // 관대한 폴백: JSON 재시도 및 키 추출
            let textOnly = (resultText || '').toString().trim();
            textOnly = textOnly.replace(/```json|```/gi, '').trim();
            let comment = null;
            try {
                const obj = JSON.parse(textOnly);
                if (obj && typeof obj.comment === 'string') comment = obj.comment;
            } catch {}
            if (!comment) {
                const m = textOnly.match(/"comment"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);
                if (m) comment = m[1];
            }
            if (!comment) {
                comment = textOnly.replace(/^\{\s*"comment"\s*:\s*"|"\s*\}$/g, '').replace(/^"|"$/g, '');
            }
            return {
                comment: comment || textOnly,
                provider: 'GeminiText',
                model: modelName,
                prompt,
                raw: resultText,
                tokens: {
                    prompt: usage.promptTokenCount ?? null,
                    completion: usage.candidatesTokenCount ?? null,
                    total: usage.totalTokenCount ?? null,
                }
            };
        }
    } catch (error) {
        console.error("GeminiText API call failed:", error.response ? error.response.data : error.message);
        throw new Error("GeminiText API request failed");
    }
}

// --- OpenAI (ChatGPT) ---
export async function callOpenAI({ base64, prompt }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set in Vercel environment variables');

    const modelName = 'gpt-5-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(url, {
            model: modelName,
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${base64}`,
                                detail: "low"
                            }
                        }
                    ]
                }
            ],
            reasoning_effort: "low"
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            timeout: 10000
        });

        const usage = response.data.usage || {};
        console.log(`[OpenAI] model=${modelName} promptChars=${prompt?.length || 0} imageBase64Chars=${base64?.length || 0}`);
        if (usage) console.log(`[OpenAI] tokens prompt=${usage.prompt_tokens} completion=${usage.completion_tokens} total=${usage.total_tokens}`);

        const resultText = response.data.choices[0].message.content;
        const parsed = parseLLMResponse(resultText, 'OpenAI');

        return normalizeResponse(parsed, {
            provider: 'OpenAI',
            model: modelName,
            prompt,
            raw: resultText,
            tokens: {
                prompt: usage.prompt_tokens ?? null,
                completion: usage.completion_tokens ?? null,
                total: usage.total_tokens ?? null,
            }
        });

    } catch (error) {
        console.error("OpenAI API call failed:", error.response ? error.response.data : error.message);
        throw new Error("OpenAI API request failed");
    }
}

// --- OpenAI (text-only) ---
export async function callOpenAIText({ prompt }) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY is not set in Vercel environment variables');

    const modelName = 'gpt-5-mini';
    const url = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(url, {
            model: modelName,
            response_format: { type: "json_object" },
            messages: [ { role: 'user', content: [ { type: 'text', text: prompt } ] } ],
            reasoning_effort: "low"
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
            timeout: 10000
        });

        const usage = response.data.usage || {};
        console.log(`[OpenAIText] model=${modelName} promptChars=${prompt?.length || 0}`);
        if (usage) console.log(`[OpenAIText] tokens prompt=${usage.prompt_tokens} completion=${usage.completion_tokens} total=${usage.total_tokens}`);

        const resultText = response.data.choices[0].message.content;
        try {
            const parsed = parseLLMResponse(resultText, 'OpenAIText');
            return normalizeResponse(parsed, {
                provider: 'OpenAIText',
                model: modelName,
                prompt,
                raw: resultText,
                tokens: {
                    prompt: usage.prompt_tokens ?? null,
                    completion: usage.completion_tokens ?? null,
                    total: usage.total_tokens ?? null,
                }
            });
        } catch (e) {
            let textOnly = (resultText || '').toString().trim();
            textOnly = textOnly.replace(/```json|```/gi, '').trim();
            let comment = null;
            try {
                const obj = JSON.parse(textOnly);
                if (obj && typeof obj.comment === 'string') comment = obj.comment;
            } catch {}
            if (!comment) {
                const m = textOnly.match(/"comment"\s*:\s*"([\s\S]*?)"\s*\}?\s*$/);
                if (m) comment = m[1];
            }
            if (!comment) {
                comment = textOnly.replace(/^\{\s*"comment"\s*:\s*"|"\s*\}$/g, '').replace(/^"|"$/g, '');
            }
            return {
                comment: comment || textOnly,
                provider: 'OpenAIText',
                model: modelName,
                prompt,
                raw: resultText,
                tokens: {
                    prompt: usage.prompt_tokens ?? null,
                    completion: usage.completion_tokens ?? null,
                    total: usage.total_tokens ?? null,
                }
            };
        }
    } catch (error) {
        console.error("OpenAIText API call failed:", error.response ? error.response.data : error.message);
        throw new Error("OpenAIText API request failed");
    }
}

function parseLLMResponse(text, provider) {
    // 1) 코드펜스/잡텍스트 제거 + BOM 제거
    const stripCodeFences = (s) => s
        .replace(/^\uFEFF/, '')
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();

    // 2) 첫 JSON 객체/배열 블록만 추출 (중간 설명 텍스트 보호)
    const extractFirstJsonBlock = (s) => {
        let start = s.indexOf('{');
        let startArr = s.indexOf('[');
        if (start === -1 || (startArr !== -1 && startArr < start)) {
            start = startArr; // 배열이 먼저 나오면 배열부터 파싱
        }
        if (start === -1) return s; // 포기하고 원문 시도

        let depth = 0;
        let end = -1;
        const open = s[start];
        const close = open === '{' ? '}' : ']';

        for (let i = start; i < s.length; i++) {
            const ch = s[i];
            if (ch === '"') {
                // 문자열 건너뛰기
                i++;
                while (i < s.length) {
                    if (s[i] === '"' && s[i - 1] !== '\\') break;
                    i++;
                }
                continue;
            }
            if (ch === open) depth++;
            else if (ch === close) depth--;
            if (depth === 0) { end = i + 1; break; }
        }
        if (end !== -1) return s.slice(start, end);
        return s; // 균형 못 맞추면 원문 시도
    };

    // 3) 일반적인 JSON 오류 보정: 스마트 따옴표, 트레일링 콤마 제거, 문자열 내 개행 이스케이프
    const sanitizeJson = (s) => {
        let out = s
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'");
        // 문자열 리터럴 내부 줄바꿈 -> \n
        let inStr = false;
        let acc = '';
        for (let i = 0; i < out.length; i++) {
            const c = out[i];
            if (c === '"' && out[i - 1] !== '\\') inStr = !inStr;
            acc += (inStr && c === '\n') ? '\\n' : c;
        }
        // 객체/배열의 마지막 요소 뒤 콤마 제거
        acc = acc.replace(/,(\s*[}\]])/g, '$1');
        return acc.trim();
    };

    // 4) 파싱 시도: 원문→블록추출→보정 순차 시도
    const attempts = [];
    attempts.push(stripCodeFences(text));
    attempts.push(extractFirstJsonBlock(attempts[0]));
    attempts.push(sanitizeJson(attempts[1]));

    for (const candidate of attempts) {
        try {
            const parsed = JSON.parse(candidate);
            // 두 가지 모드 지원: (A) 기존 score/comment JSON, (B) rubrics 결과 JSON
            const hasScore = typeof parsed.score !== 'undefined';
            const hasComment = typeof parsed.comment === 'string' || typeof parsed.feedback === 'string';
            const looksLikeRubric = !hasScore && !hasComment; // 키들이 전부 커스텀일 수 있음

            if (!looksLikeRubric) {
                // (A) 기존 포맷 정규화
                if (typeof parsed.score !== 'number') {
                    const maybe = Number(parsed.score);
                    if (!Number.isFinite(maybe)) throw new Error('score is not numeric');
                    parsed.score = maybe;
                }
            }
            console.log(`[${provider}] Parsed response:`, JSON.stringify(parsed));
            return parsed;
        } catch (err) {
            // 다음 시도
        }
    }

    console.error(`Failed to parse LLM JSON response from ${provider}:`, text);
    throw new Error('LLM response was not valid JSON.');
}

function normalizeResponse(parsed, meta) {
    const hasScore = typeof parsed.score === 'number';
    const hasComment = typeof parsed.comment === 'string' || typeof parsed.feedback === 'string';
    const hasAnalysis = parsed && typeof parsed === 'object' && parsed.analysis && typeof parsed.description === 'string';
    if (hasAnalysis) {
        return { analysis: parsed.analysis, description: parsed.description, ...meta };
    }
    if (hasScore || hasComment) {
        const comment = typeof parsed.comment === 'string' ? parsed.comment : parsed.feedback;
        return {
            score: hasScore ? parsed.score : null,
            comment: comment || null,
            ...meta
        };
    }
    // rubrics 모드: 결과를 그대로 반환
    return {
        rubricResults: parsed,
        ...meta
    };
}


