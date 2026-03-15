// Prompt builder – easy to maintain and extend

export function buildPrompt(meta = {}) {
  const {
    customerId,
    customerName,
    customerPersona,
    requestText,
    requestId,
    likes = [],
    dislikes = [],
    exampleUtterances = [],
    language = 'ko'
  } = meta;

  // --- SOLVE: ANALYZE 모드 (이미지 포함) ---
  if (meta && meta.mode === 'ANALYZE') {
    const problemTitle = meta.problemTitle || meta.requestText || '문제 해결';
    const items = Array.isArray(meta.analysisItems) ? meta.analysisItems : [];
    const lines = items.map(i => `${i.key}: ${i.question}`).join('\n');
    const jsonKeys = items.map(i => `"${i.key}": ...`).join(', ');
    return [
      `너는 그림을 여러 카테고리로 분석하는 AI 분석가다. 아래 그림은 '**${problemTitle}**'이라는 문제 상황에 대한 해결책으로 그려졌다.`,
      '다음 질문들에 대해 분석하고, 답변은 반드시 지정된 JSON 형식으로만 출력해라. 다른 설명은 절대 추가하지 마라.',
      '',
      '[분석 항목]',
      lines,
      '',
      '[출력 형식]',
      `{"analysis": { ${jsonKeys} }, "description": "...(그림의 모습을 20자 이내로 설명)"}`
    ].join('\n');
  }

  // --- SOLVE: CREATE 모드 (텍스트 전용) ---
  if (meta && meta.mode === 'CREATE') {
    const npcName = meta.npcName || customerName || '고객';
    const persona = meta.persona || customerPersona || '';
    const problemTitle = meta.problemTitle || '문제 해결';
    const imageDescription = meta.imageDescription || '';
    const storyResult = meta.storyResult || '';
    const toneHint = meta.toneHint || '';
    const speechStyle = meta.speechStyle || '';
    const expectedReaction = meta.expectedReaction || '';
    return [
      `[ROLE] 당신은 '${npcName}'다. ${persona}`,
      `[SITUATION] 당신은 '${problemTitle}'을/를 해결해달라고 의뢰했다. 디자이너는 방금 당신에게 '${imageDescription}' 그림을 그려주었고, 그 결과 '${storyResult}' 상황이 되었다.`,
      expectedReaction ? `[REACTION] 당신은 '${expectedReaction}'에 해당하는 반응을 보여야 한다.` : '',
      `[TONE] 당신의 성격과 현재 상황에 맞춰, 한 문장의 코멘트를 생성해라.` + (toneHint ? ` (참고 톤: ${toneHint})` : ''),
      speechStyle ? `[STYLE] 반드시 '${speechStyle}' 말투를 사용해라.` : '',
      `[TASK] 위 모든 정보를 바탕으로 최종 코멘트를 생성해라. 결과는 { "comment": "..." } 형태의 JSON으로만 출력해라.`
    ].filter(Boolean).join('\n');
  }

  // rubrics 모드: 기준 기반의 단답 JSON만 요청
  if (Array.isArray(meta.rubrics) && meta.rubrics.length > 0) {
    const tasks = meta.rubrics.map((r, i) => `${i + 1}. ${r.prompt}`).join('\n');
    const keys = meta.rubrics.map(r => `"${r.id}": [답변]`).join(', ');
    const header = [
      `[ROLE] 당신은 그림을 분석하는 평가관입니다.`,
    requestText ? `[REQUEST] 의뢰 내용: ${requestText}` : '',
    ].filter(Boolean).join('\n');

    return [
      header,
    '',
      '[TASKS] 아래 질문들에 대해 이미지를 보고 답하세요.',
      tasks,
      '',
      '[ANSWER FORMAT]',
      '- 각 질문의 답은 boolean(true/false) 또는 0,1,2 중 하나로만 응답합니다.',
      '- true/false가 요구된 질문은 반드시 소문자 boolean으로, 0/1/2가 요구된 질문은 해당 숫자로만 응답합니다.',
      `- 반드시 다음 JSON 형식으로만 응답합니다: { ${keys} }`,
      '- 추가 설명, 코멘트, 다른 키는 절대 포함하지 마세요.'
    ].join('\n');
  }

  // Legacy general evaluation prompt removed.
  // All callers must use one of:
  // - mode: 'ANALYZE' (solve 1단계)
  // - mode: 'CREATE'  (solve 코멘트 생성)
  // - rubrics         (draw 평가 기준)
  throw new Error('Legacy prompt removed: use ANALYZE, CREATE, or rubrics mode.');
}


