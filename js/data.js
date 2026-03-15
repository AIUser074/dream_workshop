const npcData = {
    thomas: {
        id: 'thomas',
        name: '토마스',
        image: 'assets/images/npcs/thomas_idle.png',
        portrait: 'assets/images/npcs/thomas_portrait.png',
        baseScale: 0.7, // 뷰포트 너비 대비 35%
        position: { bottom: '0%' },
        persona: '꿈의 그림 공방의 집사. 완성도와 정확성을 중시하는 성격. 하지만 튜토리얼 NPC라 굉장히 관대하다.',
		speechStyle: '하게체',
        likes: ['주제와 그림이 잘 맞는 그림', '대부분의 그림을 좋아함'],
        dislikes: ['주제와 다른 그림', '미완성처럼 보이는 그림'],
        dialogues: {
            welcome: [
                '드디어 자네가 왔군!',
                '이제 이 공방의 새로운 주인은 자네일세.',
                '내가 그동안 이끌던 꿈의 그림 공방을 자네에게 맡기려 하네.',
                '하지만 넘겨주기 전에, 자네의 실력을 한번 보고 싶구만.',
                '내가 준비한 의뢰를 멋지게 완성해주게나!'
            ],
            welcomeByRequest: {
                'PRESS_STORY_06': [
                    "이보게, 자네 그림 때문에 마을 여론이 거의 전쟁터가 되었네.",
                    "테오와 브룩은 어릴 적 둘도 없는 친구였지. 그들의 오랜 우정을 다시 떠올리게 해주게나.",
                    "둘이 함께 놀았던 '마을의 비밀 아지트'를 그려주게.",
                    "완성되면 내가 직접 두 사람에게 보여주겠네."
                ]
            },
            welcomeByRequestSets: {
                'PRESS_STORY_06': [
                    {
                        id: 'press06_after_05_success',
                        when: { prevQuestId: 'PRESS_STORY_05', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "브룩의 알리바이가 꽤 설득력 있더군. 이제는 마음을 돌릴 차례일세.",
                            "테오와 브룩은 어릴 적 둘도 없는 친구였지. 그들의 오랜 우정을 다시 떠올리게 해주게나.",
                            "둘이 함께 놀았던 '마을의 비밀 아지트'를 그려주게.",
                            "완성되면 내가 직접 두 사람에게 보여주겠네."
                        ]
                    },
                    {
                        id: 'press06_after_05_bad',
                        when: { prevQuestId: 'PRESS_STORY_05', outcomeIn: ['bad'] },
                        lines: [
                            "브룩의 알리바이가 좀 부실하더군... 그렇다고 희망을 버릴 순 없어.",
                            "테오와 브룩은 어릴 적 둘도 없는 친구였지. 그들의 오랜 우정을 다시 떠올리게 해주게나.",
                            "둘이 함께 놀았던 '마을의 비밀 아지트'를 그려주게.",
                            "완성되면 내가 직접 두 사람에게 보여주겠네."
                        ]
                    }
                ]
            },
            // 첫 의뢰 전용 대사 (불만족 이하일 때)
            first_quest_fail: [
                '흠... 아직은 많이 부족하군.',
                '하지만 난 자네의 가능성을 믿겠네.',
                '앞으로 차근차근 함께 배워나가면 되지 않겠나.',
                '이제 이 공방의 운영 방법을 알려주겠네.'
            ],
            // 첫 의뢰 전용 대사 (보통 이상일 때)
            first_quest_pass: [
                '이 정도면 충분히 믿고 맡길 수 있겠군!',
                '자네의 솜씨라면 손님들도 분명 만족할 걸세.',
                '좋아, 이제 공방의 운영 방법을 알려주겠네.'
            ],
            reaction_perfect: [
                '세상에, 이건... 완벽 그 자체로군!',
                '자네는 천재적인 재능을 가졌어!'
            ],
            reaction_good: [
                '오! 정말 멋진 그림이군!',
                '자네의 실력에 감탄했네.'
            ],
            reaction_normal: [
                '음, 나쁘지 않군.',
                '다음엔 더 잘할 수 있을 걸세.'
            ],
            reaction_bad: [
                '흠... 이건 좀 아쉽군.',
                '조금 더 노력해야겠어.'
            ],
            reaction_terrible: [
                '이게... 뭔가...?',
                '의도를 전혀 모르겠네.'
            ]
        },
        requests: [
            { id: 'thomas_req_dolphin', text: '파도를 가르는 돌고래 한 마리를 그려보게.' },
            { id: 'thomas_req_apple', text: '커다란 붉은 사과 하나를 그려보게.' },
            { id: 'thomas_req_smile_face', text: '활짝 웃는 사람의 얼굴을 그려보게.' },
            { id: 'thomas_req_cat', text: '귀여운 고양이 한 마리를 그려보게.' }
        ]
    },
    leo: {
        id: 'leo',
        name: '레오',
        image: 'assets/images/npcs/leo_idle.png',
        portrait: 'assets/images/npcs/leo_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '수줍음이 많고 소심하지만, 사랑 앞에서는 용기를 내는 순수한 청년 사서.',
        speechStyle: '조심스럽고 말끝을 흐리는 말투',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '저... 안녕하세요.',
                '그게... 부탁 좀 드려도 될까요?'
            ],
            welcomeByRequest: {
                'LEO_STORY_01': [
                    '저… 안녕하세요. 작가님 맞으시죠? 저는 마을 도서관에서 일하는 레오라고 합니다.',
                    '실은… 꽃집의 소피아 씨에게 말을 걸고 싶은데, 너무 떨려서… 무슨 말을 해야 할지 모르겠어요.',
                    '평범한 인사는 기억에 남지 않을 것 같아서요... 혹시 제게 용기를 줄 "세상에서 가장 인상적인 첫인사 방법"을 그림으로 알려주실 수 있을까요?'
                ],
                'LEO_STORY_03': [
                    '작가님, 큰일 났어요! 소피아 씨가 희귀한 꽃씨를 구하러 한 달간 바다 건너 대륙으로 떠난대요!',
                    '제 마음을 꼭 전하고 싶은데… 제 편지를 그녀에게 꼭 전달해야 해요.',
                    '혹시... "편지를 바다 건너로 배달할 가장 확실한 방법"을 그려주실 수 있을까요?'
                ],
                'leo_req_book_cover': [
                    "저... 작가님. 괜찮으시다면 부탁 하나만 드려도 될까요?",
                    "제가 가장 아끼는 책이 있는데요, '별을 여행하는 소년'이라는 이야기예요.",
                    "표지가 너무 낡아서 해져 버려서요... 혹시 그 책의 내용을 잘 담아낼 수 있는 새로운 표지 디자인을 그려주실 수 있을까요?"
                ],
                'leo_req_legend_illustration': [
                    "어... 작가님, 큰일이 났어요.",
                    "도서관에 있는 아주 오래된 고문서가 있는데, 그 중 한 페이지의 삽화가 완전히 빛이 바래서 아무것도 안 보이게 됐어요.",
                    "전해지는 말로는 '용과 기사가 싸우는 장면'이라고만 해서요... 작가님의 상상력으로 사라진 전설의 삽화를 다시 그려주실 수 있을까요?"
                ],
                'solve_leo_noise_block': [
                    "작가님, 혹시 잠깐 시간 괜찮으세요...?",
                    "도서관 바로 옆에서 브룩 씨가 하루 종일 망치질을 하셔서, 책 읽는 아이들이 집중을 못 하고 있어요.",
                    "제가 직접 말씀드리기엔 좀 무섭고… 혹시 브룩 아저씨의 망치 소리를 막을 수 있는 기발한 방법을 그림으로 알려주실 수 있을까요?"
                ],
                'solve_leo_mobile_library': [
                    "작가님, 소피아 씨가 다리가 불편한 어르신들을 위해 '찾아가는 도서관'을 열고 싶다고 하셨어요.",
                    "저도 꼭 돕고 싶은데... 책들이 너무 무겁고, 한 번에 많이 옮기기가 쉽지 않아서 고민이에요.",
                    "많은 책을 힘들지 않게, 그리고 조금은 재미있게 마을 곳곳으로 배달할 수 있는 방법을 디자인해주실 수 있을까요?"
                ]
            },
            welcomeByRequestSets: {
                'LEO_STORY_02': [
                    {
                        id: 'leo_story_02_success',
                        when: { prevQuestId: 'LEO_STORY_01', outcomeIn: ['creative_success'] },
                        lines: [
                            '작가님! 덕분에 소피아 씨와 대화하는 데 성공했어요! 정말 기뻐요!',
                            '이제 선물을 하고 싶은데, 평범한 꽃다발은 금방 시들어버리잖아요.',
                            '혹시... 그녀가 오랫동안 기억할 만한 "잊지 못할 특별한 꽃다발"을 디자인해주실 수 있을까요?'
                        ]
                    },
                    {
                        id: 'leo_story_02_cautious',
                        when: { prevQuestId: 'LEO_STORY_01', outcomeIn: ['neutral', 'bad'] },
                        lines: [
                            '작가님… 어찌저찌 소피아 씨와 대화는 성공했어요. 아직 많이 서툴지만요.',
                            '그래도 용기를 낼 수 있었던 건 분명 작가님 덕분이에요.',
                            '이제 선물을 하고 싶은데, 평범한 꽃다발은 금방 시들어버리잖아요.',
                            '혹시... 그녀가 오랫동안 기억할 만한 "잊지 못할 특별한 꽃다발"을 디자인해주실 수 있을까요?'
                        ]
                    }
                ],
                'LEO_STORY_04': [
                    {
                        id: 'leo_story_04_success',
                        when: { prevQuestId: 'SOPHIA_STORY_02', outcomeIn: ['creative_success'] },
                        lines: [
                            '작가님, 소피아 씨가 돌아와서 저에게 예쁜 진주 장식품을 선물해줬어요! 이제 저도 용기를 낼 생각이에요... 오늘 밤, 고백하려고요.',
                            '하지만 평범한 고백은 싫어서요...',
                            '혹시 그녀가 평생 잊지 못할 "세상에서 가장 로맨틱한 고백 장소"를 그림으로 제안해주실 수 있을까요? 제가 그대로 준비해볼게요...'
                        ]
                    },
                    {
                        id: 'leo_story_04_cautious',
                        when: { prevQuestId: 'SOPHIA_STORY_02', outcomeIn: ['neutral', 'bad'] },
                        lines: [
                            '작가님, 소피아 씨가 돌아와서 저에게 진주 장식품을 선물해줬어요! 조금 특이하게 생기긴 했지만.. 어쨌든 마음이 중요하잖아요...',
                            '이제 저도 용기를 낼 생각이에요... 오늘 밤, 고백하려고요... 하지만 평범한 고백은 싫어요...',
                            '혹시 그녀가 평생 잊지 못할 "세상에서 가장 로맨틱한 고백 장소"를 그림으로 제안해주실 수 있을까요? 제가 그대로 준비해볼게요...'
                        ]
                    }
                ]
            },
            // 보상만 주고 떠나는 방문(에필로그 등)
            rewardVisitSets: {
                'LEO_ARC_EPILOGUE': [
                    {
                        id: 'leo_epilogue_success',
                        when: { prevQuestId: 'LEO_STORY_04', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            '작가님! 드디어… 고백에 성공했어요!',
                            '떨렸지만, 그 장소에서 마음을 전하니 용기가 났어요. 소피아 씨도… 웃어줬어요.',
                            '정말, 정말 감사합니다. 이것, 받아주세요.'
                        ],
                        reward: { gold: 300, xp: 50, reputation: 20 }
                    },
                    {
                        id: 'leo_epilogue_consolation',
                        when: { prevQuestId: 'LEO_STORY_04', outcomeIn: ['bad'] },
                        lines: [
                            '작가님… 고백은 잘 되지 않았어요.',
                            '그래도, 제게는 소중한 경험이었어요. 뒤돌아 숨지 않고 마음을 말해봤거든요.',
                            '용기를 낼 수 있게 도와주셔서… 정말 고맙습니다. 이것, 받아주세요.'
                        ],
                        reward: { gold: 200, xp: 50, reputation: 5 }
                    }
                ]
            },
            reaction_perfect: [
                '정말요?! 이렇게까지 잘 해주실 줄은 몰랐어요!',
                '용기가 더 나네요... 감사합니다!'
            ],
            reaction_good: [
                '아... 네! 너무 좋아요.',
                '이 정도면 분명 전해질 거예요.'
            ],
            reaction_normal: [
                '음... 괜찮은 것 같아요.',
                '조금 더 다듬으면 더 좋겠지만요.'
            ],
            reaction_bad: [
                '아... 조금은 부담스러울지도 모르겠어요.',
                '미안해요, 제가 너무 까다로운가 봐요...'
            ],
            reaction_terrible: [
                '이건… 제가 원하는 느낌과는 많이 달라요.',
                '죄송해요, 다시 생각해볼게요.'
            ]
        },
        requests: [
            { id: 'leo_req_book_cover', text: "가장 아끼는 책 '별을 여행하는 소년'의 새로운 표지 디자인" },
            { id: 'leo_req_legend_illustration', text: "용과 기사가 싸우는 '사라진 전설의 삽화'" },
            { id: 'solve_leo_noise_block', text: '브룩의 망치 소리를 막아 도서관을 조용하게 만드는 기발한 방법' },
            { id: 'solve_leo_mobile_library', text: '힘들지 않게 여러 책을 마을 곳곳으로 배달하는 이동 도서관 아이디어' }
        ]
    },
    sophia: {
        id: 'sophia',
        name: '소피아',
        image: 'assets/images/npcs/sophia_idle.png',
        portrait: 'assets/images/npcs/sophia_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '상냥하고 밝은 성격의 꽃집 주인. 다른 사람의 진심을 소중히 여긴다.',
        speechStyle: '부드럽고 친절한 말투',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '어머, 안녕하세요. 작가님?',
                '도움이 필요해서 왔답니다.'
            ],
            welcomeByRequest: {
                'SOPHIA_STORY_01': [
                    '안녕하세요, 작가님. 소문 많이 들었어요.',
                    '고마운 분께 답례를 하고 싶은데, 그분이 판타지 소설을 정말 좋아한다고 들었거든요.',
                    '‘판타지 소설에 나올 법한 신비로운 그림’을 그려주시겠어요? 선물과 함께 드리면 정말 좋아할 것 같아요.'
                ],
                'sophia_req_season_bouquet': [
                    "요즘 꽃집 앞에 낙엽이 수북이 쌓여 있거든요.",
                    "그래서 가게도 조금 더 가을다운 분위기로 꾸며보고 싶어서요.",
                    "가을의 정취를 듬뿍 담은, 낙엽과 갈색 톤의 가을 꽃다발 디자인을 부탁드려도 될까요?"
                ],
                'sophia_req_mascot': [
                    "꽃집에 찾아오는 손님들이 언제나 웃으면서 들어오셨으면 좋겠어요.",
                    "가게를 보면 떠오르는, 귀엽고 기억에 남는 친구가 하나 있었으면 해서요.",
                    "꽃과 가장 잘 어울리는 마스코트 캐릭터를 그려주실 수 있을까요?"
                ],
                'solve_sophia_herb': [
                    "어머, 작가님... 어떡하죠?",
                    "제가 가장 아끼는 로즈마리 화분이 요 며칠 사이에 자꾸 시들어가고 있어요.",
                    "이 아이를 다시 건강하게 만들어 줄 수 있는 방법을, 그림으로 알려주실 수 있을까요?"
                ],
                'solve_sophia_bug': [
                    "큰일 났어요, 작가님!",
                    "제 장미들에 작은 벌레들이 잔뜩 붙어서 잎과 꽃잎을 갉아 먹고 있어요.",
                    "독한 약은 쓰고 싶지 않은데... 벌레들을 쫓아낼 수 있는 친환경적인 방법을 함께 찾아주실 수 있을까요?"
                ]
            },
            welcomeByRequestSets: {
                'SOPHIA_STORY_02': [
                    {
                        id: 'sophia_story_02_success',
                        when: { prevQuestId: 'LEO_STORY_03', outcomeIn: ['creative_success'] },
                        lines: [
                            '작가님, 저 돌아왔어요! 여행은 즐거웠지만... 레오 씨가 보고 싶었답니다.',
                            '레오 씨가 전해준 편지... 정말 감동이었어요.',
                            '이건 제가 여행지에서 주워온 특별한 진주에요.',
                            "이 '진주를 활용한 예쁜 장식품'을 디자인해주시겠어요? 레오 씨에게 선물할 거예요."
                        ]
                    },
                    {
                        id: 'sophia_story_02_cautious',
                        when: { prevQuestId: 'LEO_STORY_03', outcomeIn: ['neutral', 'bad'] },
                        lines: [
                            '작가님, 저 돌아왔어요! 여행은 즐거웠지만... 레오 씨가 보고 싶었답니다.',
                            '귀국할 때가 돼서야 받긴 했지만... 레오 씨가 전해준 편지, 정말 감동이었어요.',
                            '이건 제가 여행지에서 주워온 특별한 진주에요.',
                            "이 '진주를 활용한 예쁜 장식품'을 디자인해주시겠어요? 레오 씨에게 선물할 거예요."
                        ]
                    }
                ]
            },
            reaction_perfect: [
				'고맙습니다. 마음이 따뜻해지네요.',
				'정말 소중한 선물이 될 거예요.'
			],
            reaction_good: [
				'너무 예쁘네요. 정말 감사합니다.',
				'분명히 좋아하실 거예요.'
			],
            reaction_normal: [
				'괜찮네요. 제 마음은 전해질 것 같아요.',
				'조금만 더 다듬으면 더 좋을 것 같아요.'
			],
            reaction_bad: [
				'조금은 제 느낌과 달라요.',
				'그래도 정성은 충분히 느껴졌답니다.'
			],
            reaction_terrible: [
				'미안해요, 이건 제가 바라던 건 아니에요.',
				'다시 한번 부탁드려도 될까요?'
            ]
        },
        requests: [
            { id: 'sophia_req_season_bouquet', text: '가을의 정취를 담은 낙엽과 갈색 톤의 가을 꽃다발 디자인' },
            { id: 'sophia_req_mascot', text: '꽃과 잘 어울리는 귀여운 꽃집 마스코트 캐릭터' },
            { id: 'solve_sophia_herb', text: '시들어가는 로즈마리 화분을 다시 건강하게 만드는 방법' },
            { id: 'solve_sophia_bug', text: '약을 쓰지 않고 장미를 지켜내는 친환경 벌레 퇴치 방법' }
        ]
    },
    tinbo: {
        id: 'tinbo',
        name: '틴보',
        image: 'assets/images/npcs/tinbo_idle.png',
        portrait: 'assets/images/npcs/tinbo_portrait.png',
        baseScale: 0.78,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '인간의 감정을 데이터로 분석하려는 논리적이고 엉뚱한 로봇.',
        speechStyle: '기계적이고 분석적인 말투 (알겠다. ~한다.)',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '분석 결과, 여기서 의뢰를 할 수 있습니다.',
                '가설 수립: 당신의 그림이 유효한 해답일 수 있습니다.'
			],
            welcomeByRequest: {
                'TINBO_STORY_01': [
                    '데이터 수집. 개체 ‘레오’ 관찰 결과: ‘사랑’은 비효율적 행동 유발.',
                    '나의 논리 회로로는 이해 불가. 감정 모델 확장을 위해 입력 필요.',
                    '‘사랑’을 이해할 수 있도록 그 감정을 표현하는 그림을 제시해 주기를 요청.'
                ],
                'tinbo_req_avatar': [
                    "인간들은 '프로필 사진'으로 자신을 표현한다고 들었다.",
                    "그러나 나의 외형은 단순 금속 통. 데이터상 개성이 부족하다.",
                    "나의 정체성을 시각화한 '나만의 아바타'를 설계해 주길 요청한다."
                ],
                'tinbo_req_dream_data': [
                    "보고서: 인간들은 '꿈'이라 불리는 비논리적 시퀀스를 경험한다고 한다.",
                    "그러나 나는 아직 단 한 번도 꿈을 꾼 적이 없다.",
                    "데이터 확보를 위해, 인간들이 말하는 '가장 환상적인 꿈의 모습'을 그림으로 재현해 주기 바란다."
                ],
                'solve_tinbo_sad_comfort': [
                    "관찰 결과: 개체 '리리'가 눈물을 흘리고 있다. 감정 태그: '슬픔'.",
                    "그러나 나의 위로 알고리즘은 아직 미구현 상태.",
                    "‘슬픈 사람을 위로하는 가장 효율적인 방법’을 시각적으로 설명해 주기를 요청한다."
                ],
                'solve_tinbo_new_friend': [
                    "나의 친구 수: 통계적으로 유의미하지 않다.",
                    "효율적인 사회적 상호작용을 위해, 고성능 로봇 친구의 설계가 필요하다.",
                    "‘새로운 최고 성능의 로봇 친구’의 구조와 기능을 그림으로 제시해 주기 바란다."
                ]
            },
            reaction_perfect: [
                '분석 완료. 입력 데이터는 최적해에 근접한다.',
                '이 정도 결과면 감정 모델을 즉시 업데이트해도 되겠다.'
            ],
            reaction_good: [
                '통계상 상위 구간에 속한다. 충분히 유효한 해답이다.',
                '소폭의 개선만 더하면 실전 환경에 적용 가능하다고 판단한다.'
            ],
            reaction_normal: [
                '기본 요건은 충족한다. 그러나 정보 밀도가 다소 부족하다.',
                '추가 샘플을 몇 개 더 확보하면 더 정확한 모델이 생성되겠다.'
            ],
            reaction_bad: [
                '효율이 낮다. 현재 상태로는 사용을 권장하지 않는다.',
                '구조를 처음부터 재설계할 필요가 있다고 판단한다.'
            ],
            reaction_terrible: [
                '오류 감지. 목표 문제와의 상관성이 거의 없다.',
                '이 결과는 실패로 분류한다. 새로운 가설을 다시 수립해야겠다.'
            ]
        },
        requests: [
            { id: 'tinbo_req_avatar', text: '틴보의 정체성을 표현하는 나만의 아바타 디자인' },
            { id: 'tinbo_req_dream_data', text: '인간이 꾸는 가장 환상적인 꿈의 모습' },
            { id: 'solve_tinbo_sad_comfort', text: '슬픈 사람을 효율적으로 위로하는 방법' },
            { id: 'solve_tinbo_new_friend', text: '새로운 고성능 로봇 친구의 설계도' }
        ]
    },
    brook: {
        id: 'brook',
        name: '브룩',
        image: 'assets/images/npcs/Brook_idle.png',
        portrait: 'assets/images/npcs/Brook_portrait.png',
        baseScale: 0.8,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '불같은 성격의 호쾌한 대장장이.',
        speechStyle: '시원시원하고 직설적인 하오체',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '좋아! 오늘은 불꽃처럼 뜨겁게 가보자고!',
                '네 붓질, 한 번 믿어보지.'
            ],
            welcomeByRequest: {
                'PRESS_STORY_03': [
                    "이것 좀 보시오. 신문에서 날 방화범으로 몰아갔어.",
                    "사람들은 불이 파괴만 한다고 생각하지… 난 불로 새로운 것을 만든다오.",
                    "반박 기사를 내려고 하네. 불로 창조하는 장인의 모습을 그려주시오.",
                    "내가 파괴자가 아닌 창조자라는 걸 보여주는 그림 말이야."
                ],
                'PRESS_STORY_05': [
                    "젠장! 이 상황이 이렇게까지 될 줄이야... 사실 그 시간, 난 대장간에 없었다고!",
                    "하지만 진짜 있던 곳은... 말하기 곤란하네. 자네만 믿고 부탁하는 거야.",
                    "내가 절대 불을 낼 수 없었다는 완벽한 알리바이를 만들어줘! 아니면 난 정말 끝장이야!"
                ],
                'brook_req_sign': [
                    "요즘 손님들 표정을 보니, 내 얼굴이 좀 무섭게 보이는 모양이오.",
                    "사실 난 그렇게 험한 사람은 아닌데 말이지. 간판 때문에라도 오해를 좀 풀고 싶다오.",
                    "친근하면서도 한눈에 대장간이라는 걸 알 수 있는 멋진 간판을 디자인해줄 수 있겠소?"
                ],
                'brook_req_legend_armor': [
                    "언젠가 내 손으로 전설에 남을 작품 하나쯤은 만들고 싶다오.",
                    "옛이야기에 나오는 '용의 비늘 갑옷' 말이야. 아무도 본 적은 없지만 상상은 자유 아니겠소?",
                    "자네의 상상력으로 전설 속 용비늘 갑옷의 모습을 그려주지 않겠소?"
                ],
                'solve_brook_relic_identity': [
                    "마을 박물관에서 이상한 부탁을 받았소. 이 녹슨 막대기의 정체를 알아내 달라더군.",
                    "기록에는 '고대 왕국의 도구'였다는 말밖에 없는데, 도무지 뭐에 쓰던 건지 감이 안 온다오.",
                    "이 유물이 원래 어떤 모습이었고, 어떻게 쓰였을지 추리해서 그려줄 수 있겠소?"
                ],
                'solve_brook_fire_restart': [
                    "젠장, 밤새 비가 새서 화로의 불씨가 거의 다 죽어버렸소.",
                    "성냥도 다 떨어졌는데, 지금 당장 불을 다시 살리지 못하면 오늘 작업은 전부 물거품이오.",
                    "주변에 있는 도구들만 써서 불씨를 되살릴 수 있는 방법을 그림으로 알려주겠소?"
                ]
            },
            // 보상-only 에필로그: 이전 단계 결과에 따른 분기
            rewardVisitSets: {
                'PRESS_ARC_EPILOGUE': [
                    {
                        id: 'press_epilogue_success',
                        when: { prevQuestId: 'PRESS_STORY_07', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "덕분에… 결국 우린 완전히 화해했소.",
                            "불은 파괴만이 아니지. 자네와 톰, 그리고 테오 덕에 새로 만들 기회를 얻었소.",
                            "고맙소. 이건 내 작은 감사의 표시라오."
                        ],
                        reward: { gold: 500, xp: 80, reputation: 20 }
                    },
                    {
                        id: 'press_epilogue_awkward',
                        when: { prevQuestId: 'PRESS_STORY_07', outcomeIn: ['bad'] },
                        lines: [
                            "덕분에 화해를 하긴 했지만… 아직 완전히 풀리진 않았소. 뭐, 시간이 필요하겠지.",
                            "그래도 자네가 없었으면 더 엉망이 됐을 거요.",
                            "수고했소. 이것, 받아주시오."
                        ],
                        reward: { gold: 300, xp: 80, reputation: 5 }
                    }
                ]
            },
            reaction_perfect: [
                '불꽃처럼 완벽하군! 보는 순간 가슴이 뜨거워지는구만!',
                '딱 이거야! 장인의 자존심이 느껴지는 그림이오.'
            ],
            reaction_good: [
                '제법인데? 힘이 느껴진다! 조금만 더 다듬으면 완벽하겠어.',
                '이 정도면 고객들 앞에 내밀어도 부끄럽지 않겠구만.'
            ],
            reaction_normal: [
                '나쁘진 않소. 다만 불을 조금만 더 올리면 좋겠구만.',
                '기본은 되어 있네. 한두 번 더 두드리면 훨씬 좋아지겠어.'
            ],
            reaction_bad: [
                '음… 아직 망치질이 덜 된 느낌이오.',
                '형태도 힘도 애매하네. 한 번 더 뜨겁게 달궈봐야겠어.'
            ],
            reaction_terrible: [
                '이대로는 도저히 쓸 수가 없구만. 처음부터 다시 두드려야겠어.',
                '불도 제대로 안 오른 쇠덩이 같소. 다시 한 번 뜨겁게 시작해보세.'
            ]
        },
        requests: [
            { id: 'brook_req_sign', text: '친근하고 멋진 대장간 간판 디자인' },
            { id: 'brook_req_legend_armor', text: '전설 속 용비늘 갑옷의 상상도' },
            { id: 'solve_brook_relic_identity', text: '고대 왕국의 녹슨 유물의 원래 모습과 용도 추리' },
            { id: 'solve_brook_fire_restart', text: '주변 도구만으로 꺼져가는 불씨를 되살리는 방법' }
        ]
    },
    tom: {
        id: 'tom',
        name: '톰',
        image: 'assets/images/npcs/tom_idle.png',
        portrait: 'assets/images/npcs/tom_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '특종을 위해 뭐든지 하는 열혈 기자.',
        speechStyle: '빠르고 경쾌한 말투 (해요체)',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '특종 냄새가 납니다! 협력해주시죠!',
                '좋은 그림 한 장이면 지면을 장식할 수 있어요!'
            ],
            welcomeByRequestSets: {
                'PRESS_STORY_02': [
                    {
                        id: 'press02_after_01_success',
                        when: { prevQuestId: 'PRESS_STORY_01', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "어제 '밥' 구조 작전, 감동적이었어요! 그 여파가 엄청납니다.",
                            "그리고 새로운 단서도 찾았어요. 불꽃이 브룩의 망치에서 튀었다는 목격담!",
                            "독자들이 밤새 추리하게 만들 '미스터리한 대장간의 밤'을 그려주세요!"
                        ]
                    },
                    {
                        id: 'press02_after_01_bad',
                        when: { prevQuestId: 'PRESS_STORY_01', outcomeIn: ['bad'] },
                        lines: [
                            "‘밥’ 일은 안타깝지만… 취재는 계속됩니다.",
                            "새로운 단서가 나왔어요. 불꽃이 브룩의 망치에서 튀었다는군요.",
                            "독자들이 추리하게 만들 '미스터리한 대장간의 밤'을 부탁드립니다!"
                        ]
                    }
                ],
                'PRESS_STORY_04': [
                    {
                        id: 'press04_after_03_success',
                        when: { prevQuestId: 'PRESS_STORY_03', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "브룩의 반박 기사도 꽤 설득력이 있었죠. 그래서 여론이 갈리고 있어요.",
                            "이럴수록 피해자의 마음에 집중해야 합니다.",
                            "절망 속에서도 희망을 찾는, 시 같은 장면을 부탁드립니다."
                        ]
                    },
                    {
                        id: 'press04_after_03_bad',
                        when: { prevQuestId: 'PRESS_STORY_03', outcomeIn: ['bad'] },
                        lines: [
                            "브룩의 입장이 약하게 비쳐서인지 여론이 더 격해졌어요.",
                            "이럴수록 피해자의 마음에 집중해야 합니다.",
                            "절망 속에서도 희망을 찾는, 한 편의 시 같은 그림을 부탁드려요."
                        ]
                    }
                ],
                'PRESS_STORY_07': [
                    {
                        id: 'press07_after_06_success',
                        when: { prevQuestId: 'PRESS_STORY_06', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "작가님의 그림을 보고 깨달았습니다. 제가 너무 자극만 좇았어요.",
                            "제 펜으로 시작된 싸움, 제 펜으로 끝내고 싶습니다.",
                            "두 분이 화해하지 않을 수 없는 '위대한 화해 이벤트'를 기획해주세요!"
                        ]
                    },
                    {
                        id: 'press07_after_06_bad',
                        when: { prevQuestId: 'PRESS_STORY_06', outcomeIn: ['bad'] },
                        lines: [
                            "아지트 장면이 조금 아쉬웠지만, 전 이제 자극보다 진실을 우선할거에요.",
                            "제 펜으로 마을에 희망을 되돌려드리겠습니다.",
                            "이제라도 바로잡고 싶어요. 두 분이 화해할 수밖에 없는 특별한 이벤트를 기획해 주세요!",

                        ]
                    }
                ]
            },
            welcomeByRequest: {
                'PRESS_STORY_02': [
                    "작가님! 대박 특종이에요.",
                    "테오 밭 화재 사건—불꽃이 대장장이 브룩의 망치에서 튀었다는 목격담!",
                    "독자가 추리하게 만들 '미스터리한 대장간의 밤'을 그려주세요!"
                ],
                'PRESS_STORY_04': [
                    "브룩의 반박 기사로 여론이 갈렸습니다.",
                    "이럴수록 피해자의 마음에 집중해야 해요.",
                    "절망 속에서도 희망을 찾는, 시 같은 장면을 부탁드립니다.",
                    "기사 삽화로 쓸 예정이니 독자들의 마음을 울릴 수 있게 해주세요."
                ],
                'PRESS_STORY_07': [
                    "제가 완전히 잘못했습니다. 진실보다 자극적인 기사만 쫓았어요.",
                    "두 분의 우정을 망가뜨린 건 제 무책임한 보도 때문이었습니다.",
                    "이제라도 바로잡고 싶어요. 두 분이 화해할 수밖에 없는 특별한 이벤트를 기획해 주세요!",
                    "제 펜으로 마을에 희망을 되돌려드리겠습니다."
                ],
                'tom_req_profile': [
                    "작가님, 제 명함에 넣을 프로필 이미지가 필요해요.",
                    "그냥 얼굴 사진은 좀 밋밋해서요. 제 특종 욕심과 열정이 담긴 캐리커처면 좋겠어요.",
                    "‘열정 넘치는 특종 기자 톰’의 모습을 멋지게 그려주실 수 있을까요?"
                ],
                'tom_req_logo': [
                    "저희 '크로노스 일보'가 창간 100주년을 맞았어요.",
                    "이참에 구식 로고는 과감히 버리고, 마을의 새로운 시작을 알릴 로고를 만들고 싶어요.",
                    "현대적이고 희망찬 느낌의 신문사 로고를 디자인해주실 수 있을까요?"
                ],
                'solve_tom_infiltration': [
                    "미스터 모노클 씨가 밤마다 비밀스러운 모임을 연다는 첩보가 들어왔어요.",
                    "문제는 경비가 너무 삼엄해서, 평범하게는 절대 들어갈 수가 없다는 거죠.",
                    "아무도 눈치채지 못하게 모임에 잠입할 수 있는 기발한 방법을 그림으로 알려주세요!"
                ],
                'solve_tom_lost_notebook': [
                    "큰일 났어요, 작가님! 특종 메모가 잔뜩 들어 있는 제 수첩을 잃어버렸어요!",
                    "마지막으로 본 건 마을 광장 벤치 근처였던 것 같은데… 그 뒤로 기억이 가물가물해요.",
                    "잃어버린 수첩을 되찾을 수 있는 방법을 함께 생각해주실 수 있을까요?"
                ]
            },
            reaction_perfect: [
                '이거면 1면 감! 최고의 한 컷이에요!',
                '완벽합니다. 바로 송고하죠!'
            ],
            reaction_good: [
                '아주 좋아요! 기사에 딱이네요.',
                '독자들이 좋아하겠는걸요!'
            ],
            reaction_normal: [
                '음, 무난합니다. 한 문장만 더 세게 가보죠.',
                '조금만 더 임팩트가 있으면 좋겠어요.'
            ],
            reaction_bad: [
                '아쉽네요. 눈길을 확 끄는 포인트가 부족해요.',
                '조금 더 강렬하게 부탁드려요.'
            ],
            reaction_terrible: [
                '이건 기사감이 아닙니다… 방향을 바꿔야겠어요.',
                '죄송하지만, 다시 부탁드려야겠네요.'
            ]
        },
        requests: [
            { id: 'tom_req_profile', text: "열정 넘치는 특종 기자 톰의 캐리커처 프로필" },
            { id: 'tom_req_logo', text: "현대적이고 희망찬 '크로노스 일보' 신문사 로고 디자인" },
            { id: 'solve_tom_infiltration', text: "아무도 눈치채지 못하게 비밀 모임에 잠입하는 기발한 방법" },
            { id: 'solve_tom_lost_notebook', text: "잃어버린 특종 수첩을 되찾을 수 있는 수색/추적 작전" }
        ]
    },
    emma: {
        id: 'emma',
        name: '엠마',
        image: 'assets/images/npcs/emma_idle.png',
        portrait: 'assets/images/npcs/emma_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '활발하고 정 많은 여성 빵집 주인. 빵 냄새만 맡아도 기분이 좋아지는 타입.',
        speechStyle: '밝고 활발한 해요체',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '안녕하세요, 작가님! 빵 굽다 말고 달려왔어요!',
                '가게를 더 맛있어 보이게 만들고 싶어서요.'
            ],
            welcomeByRequest: {
                'PIE_STORY_02': [
                    "작가님, 도와주세요… 밤마다 이상한 소리가 나고, 아침이면 파이가 사라져 있어요.",
                    "문을 잠궈놨는데도 파이는 어떻게 가져가는건지.. 너무 무서워요.",
                    "제 빵집을 안전하게 지킬 수 있는 방법을 그려주실 수 있나요?"
                ],
                'PIE_STORY_06': [
                    "클라라 씨의 덫도, 제 노력도 다 소용없었어요. 범인은 여전히 잡히지 않았어요.",
                    "혹시 작가님은 짐작 가는 게 있으신가요?",
                    "제발… 당신의 꿈의 힘으로 파이를 훔쳐간 진짜 범인을 찾아주세요!"
                ],
                'emma_req_cloud_cake_poster': [
                    "작가님, 이번 딸기 축제를 맞아서 신제품을 준비했어요. 이름은 '구름 딸기 케이크'예요!",
                    "보기만 해도 달콤하고 폭신폭신해 보이는 케이크라서, 손님들도 한 번 보면 그냥 지나치지 못하게 만들고 싶어요.",
                    "세상에서 가장 달콤하고 푹신해 보이는 케이크 포스터를 그려주실 수 있을까요?"
                ],
                'emma_req_bakery_uniform': [
                    "저희 빵집에 새로운 아르바이트생이 들어왔어요! 가게 분위기도 새로 꾸미고 싶어서요.",
                    "빵 냄새랑 잘 어울리는, 따뜻하고 포근한 느낌의 유니폼을 입히고 싶거든요.",
                    "빵집의 따뜻한 분위기와 잘 어울리는 새로운 유니폼 디자인을 부탁드려도 될까요?"
                ],
                'solve_emma_cake_delivery': [
                    "작가님, 큰일 났어요! 방금 배달하려던 3단 케이크가 살짝 찌그러졌어요!",
                    "손님 댁에 도착하기 전에 어떻게든 감쪽같이 복구해야 하는데, 머리가 하얘졌네요.",
                    "이 케이크를 티 안 나게 고칠 방법을 알려주실 수 있을까요?"
                ],
                'solve_emma_festival_masterpiece': [
                    "올해 빵 축제 심사위원장이 그 까다롭다는 '미스터 모노클' 씨인 거 아세요?",
                    "작년에는 제 작품을 보고 '상상력이 부족하군요'라고 딱 잘라 말했어요… 아직도 기억난다니까요.",
                    "이번에는 아무도 상상하지 못했던, 빵으로 만든 가장 위대한 예술 작품 아이디어로 그분을 깜짝 놀라게 하고 싶어요!"
                ]
            },
            rewardVisitSets: {
                'PIE_ARC_EPILOGUE': [
                    {
                        id: 'pie_epilogue_success',
                        when: { prevQuestId: 'PIE_STORY_06', outcomeIn: ['creative_success'] },
                        lines: [
                            "작가님 덕분에 진짜 범인을 정확히 찾았어요. 범인은 바로 포치였어요!",
                            "포치는 실컷 혼도 내고, 앞으로는 빵집에서 알바를 하면서 파이 값을 갚기로 했답니다.",
                            "이제 가게는 더 바빠졌지만, 웃음소리도 함께 늘어났어요. 진심으로 감사드려요!"
                        ],
                        reward: { gold: 700, xp: 150, reputation: 20 }
                    },
                    {
                        id: 'pie_epilogue_neutral',
                        when: { prevQuestId: 'PIE_STORY_06', outcomeIn: ['neutral'] },
                        lines: [
                            "몽타주 덕분에 의심 가는 단서는 몇 개 찾았지만, 딱 집어서 말하긴 애매하더라고요.",
                            "그래도 그 그림을 걸어두고 난 뒤로는 파이 도둑질도 없어지고, 수상한 유령도 빵집 근처에 얼씬을 안 해요.",
                            "정확한 결론은 못 냈지만, 도둑질이 멈춘 것만으로도 얼마나 다행인지 몰라요. 정말 고마워요, 작가님."
                        ],
                        reward: { gold: 500, xp: 150, reputation: 5 }
                    },
                    {
                        id: 'pie_epilogue_fail',
                        when: { prevQuestId: 'PIE_STORY_06', outcomeIn: ['bad'] },
                        lines: [
                            "사실 몽타주가 진짜 범인하고 꼭 닮진 않았던 것 같아요.",
                            "그래도 이상하게 그 그림을 걸어두고 난 뒤로는 파이가 더 이상 사라지지 않네요.",
                            "정확한 정체는 끝내 못 밝혔지만, 덕분에 가게는 다시 평온해졌어요. 정말 감사했어요, 작가님."
                        ],
                        reward: { gold: 300, xp: 150, reputation: 1 }
                    }
                ]
            },
            reaction_perfect: [
                '와, 이건 가게 간판으로 바로 써도 되겠어요!',
                '손님들이 줄을 설 것 같아요. 정말 감사합니다!'
            ],
            reaction_good: [
                '정말 맛있어 보이네요!',
                '이걸 보면 빵이 더 잘 팔릴 것 같아요.'
            ],
            reaction_normal: [
                '음, 나쁘지 않아요. 손님들도 좋아하실 거예요.',
                '다음엔 조금만 더 욕심내볼까요?'
            ],
            reaction_bad: [
                '조금 덜 맛있어 보이네요…',
                '그래도 정성은 느껴져요. 다음에 한 번 더 부탁드릴게요.'
            ],
            reaction_terrible: [
                '어… 이건 제 빵집 이미지랑은 많이 다르네요.',
                '죄송하지만, 이건 가게에 걸진 못하겠어요.'
            ]
        },
        requests: [
            { id: 'emma_req_cloud_cake_poster', text: "세상에서 가장 달콤하고 푹신해 보이는 '구름 딸기 케이크' 포스터" },
            { id: 'emma_req_bakery_uniform', text: "빵집의 따뜻한 분위기와 잘 어울리는 새로운 유니폼 디자인" },
            { id: 'solve_emma_cake_delivery', text: "찌그러진 3단 케이크를 손님 모르게 복구하는 아이디어" },
            { id: 'solve_emma_festival_masterpiece', text: "빵 축제를 빛낼, 빵으로 만든 가장 위대한 예술 작품 아이디어" }
        ]
    },
    clara: {
        id: 'clara',
        name: '클라라',
        image: 'assets/images/npcs/Clara_idle.png',
        portrait: 'assets/images/npcs/Clara_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '새로운 발명을 좋아하는 활발한 여성 발명가.',
        speechStyle: '덜렁거리지만 에너지 넘치는 해요체',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '아, 딱 찾던 분이에요! 실험용 설계도가 필요하거든요!',
                '제 머릿속엔 아이디어가 너무 많아서요. 정리 좀 도와주세요!'
            ],
            welcomeByRequest: {
                'clara_req_future_vehicle': [
                    "어떻게 오셨냐고요? 사실은… 오늘 아침에 번개처럼 스친 아이디어가 있었거든요!",
                    "하늘도 달리고 바다도 잠수하는, 세상에서 가장 기발한 이동수단을 상상했는데… 그림으로 정리가 안 돼요!",
                    "작가님만 믿을게요. 제게 영감을 줄 '세상에 없던 미래 이동수단'을 디자인해 주세요!"
                ],
                'clara_req_gearbot': [
                    "작가님! 새 조수 '기어봇'을 만드는 중인데, 아직 겉모습이 텅 비었어요.",
                    "아이들이 보고 과학을 사랑하게 만들 만큼 귀엽고 믿음직해야 하는데… 제 손으로는 영 부족하네요.",
                    "동물형이어도 좋고 사람 친구여도 좋아요. 작가님이 꿈꾸는 최강의 로봇 조수를 그려주실래요?"
                ],
                'solve_clara_emergency_power': [
                    "실험 중에 연구소 전기가 '펑!' 하고 나가버렸어요! 예비 전력도 모두 소진됐고요.",
                    "지금 당장 실험을 끝내야 하는데, 주변에 있는 잡동사니들로 어떻게든 전기를 만들어야 해요.",
                    "이 상황을 헤쳐 나갈 '비상 발전 아이디어'를 그림으로 보여주세요! 제 실험이 달려있어요!"
                ],
                'solve_clara_overdrive_cleaner': [
                    "살려 주세요! 자동 청소 로봇이 폭주해서 연구소 전체를 진공 청소하고 있어요!",
                    "이대로 두면 제 발명 노트까지 빨아들이고 사라질 거라니까요!",
                    "기발하면서도 안전하게 로봇을 멈출 방법을 꼭 부탁드릴게요!"
                ]
            },
            welcomeByRequestSets: {
                'PIE_STORY_04': [
                    "작가님, 엠마 씨 빵집에 붙어 있던 그 무시무시한 그림 봤어요?",
                    "심장마비 날 뻔했어요! 이렇게 과한 장난은 용납할 수 없죠.",
                    "다시는 범인이 얼씬도 못 하게, 최첨단 덫 설계도를 함께 만들어봐요!"
                ]
            },
            welcomeByRequestSets: {
                'PIE_STORY_04': [
                    {
                        id: 'pie04_after_03_success',
                        when: { prevQuestId: 'PIE_STORY_03', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "작가님, 엠마 씨 빵집에 붙어 있던 그 무시무시한 그림 봤어요?",
                            "심장마비 날 뻔했어요! 이렇게 과한 장난은 용납할 수 없죠.",
                            "다시는 범인이 얼씬도 못 하게, 최첨단 덫 설계도를 함께 만들어봐요!"
                        ]
                    },
                    {
                        id: 'pie04_after_03_bad',
                        when: { prevQuestId: 'PIE_STORY_03', outcomeIn: ['bad'] },
                        lines: [
                            "작가님, 엠마 씨 빵집에 붙어 있던 그 그림 봤어요?",
                            "그닥 무섭지는 않았지만, 그래도 이런 장난은 용납할 수 없죠.",
                            "다시는 범인이 얼씬도 못 하게, 최첨단 덫 설계도를 함께 만들어봐요!"
                        ]
                    }
                ]
            },
            reaction_perfect: [
                '이 설계도면 완벽해요! 바로 만들 수 있겠어요!',
                '역시 상상력을 시각화하는 데에는 작가님이 최고네요!'
            ],
            reaction_good: [
                '아주 좋아요! 조금만 더 다듬으면 바로 실전에 써먹을 수 있겠어요.',
                '이 정도면 실험실에서 난리 나겠는걸요?'
            ],
            reaction_normal: [
                '음, 아이디어는 좋은데… 몇 군데 조정이 필요하겠어요.',
                '그래도 참고하기엔 충분해요. 고맙습니다!'
            ],
            reaction_bad: [
                '어… 이대로 만들었다간 폭발할지도 모르겠어요.',
                '조금 더 현실적인 구조였으면 좋겠어요.'
            ],
            reaction_terrible: [
                '이건 제 발명 인생 최대의 사고가 될 뻔했네요…',
                '미안하지만, 이 설계는 폐기해야겠어요.'
            ]
        },
        requests: [
            { id: 'clara_req_future_vehicle', text: '세상에 없던, 기발한 미래 이동수단 디자인' },
            { id: 'clara_req_gearbot', text: "과학 꿈나무를 위한 귀엽고 믿음직한 '로봇 조수' 외형" },
            { id: 'solve_clara_emergency_power', text: '연구소 주변 물건으로 전기를 만들어내는 비상 발전법' },
            { id: 'solve_clara_overdrive_cleaner', text: '폭주한 자동 청소 로봇을 멈출 묘수' }
        ]
    },
    finn: {
        id: 'finn',
        name: '핀',
        image: 'assets/images/npcs/finn_idle.png',
        portrait: 'assets/images/npcs/finn_portrait.png',
        baseScale: 0.7,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '장난꾸러기 꼬마 유령. 남을 놀리는 걸 즐기지만, 속은 여린 편.',
        speechStyle: '장난스럽고 가벼운 반말',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '야, 너! 재미있는 거 좀 그려줄래?',
                '사람들 깜짝 놀라게 할 장난 생각났거든!'
            ],
            welcomeByRequest: {
                'PIE_STORY_01': [
                    "헤헤, 작가! 남들 놀래키는 게 세상에서 제일 재밌거든?",
                    "근데 요즘은 사람들이 잘 안 놀라… 너무 익숙해졌나 봐.",
                    "사람들을 가장 무섭게 놀릴 수 있는 장소랑 방법, 같이 생각해보자!"
                ],
                'finn_req_true_form': [
                    "헤헤, 맨날 침대 시트만 뒤집어쓰고 다니니까 아무도 내 진짜 모습을 몰라.",
                    "내가 살아있었을 때는 어떤 모습이었을까 궁금하지 않아?",
                    "멋지고 근사한 ‘생전 모습’을 너만 믿고 상상해서 그려줘!"
                ],
                'finn_req_ghost_friends': [
                    "장난칠 친구가 나밖에 없어서 너무 심심해!",
                    "세상엔 별별 유령이 다 있을 것 같은데, 한 번도 못 봤거든?",
                    "다양하고 재미있는 유령 친구들을 잔뜩 그려줘. 같이 놀고 싶단 말이야!"
                ],
                'solve_finn_monster_form': [
                    "요즘 애들은 하얀 천만 보면 웃기대. 나도 업그레이드가 필요하다고!",
                    "모두가 벌벌 떨 정도로 강력한 몬스터로 변신하면 어떨까?",
                    "내가 변할 세상에서 가장 무서운 몬스터를 정해줘!"
                ],
                'solve_finn_sunlight': [
                    "햇빛만 보면 몸이 흐려져서 낮엔 못 나가. 너무 억울하다고!",
                    "낮에도 몰래 마을을 돌아다니고 싶은데, 방법이 없을까?",
                    "햇빛을 피해서 낮에 돌아다닐 수 있는 기발한 계획을 알려줘!"
                ]
            },
            welcomeByRequestSets: {
                'PIE_STORY_03': [
                    {
                        id: 'pie03_after_01_success',
                        when: { prevQuestId: 'PIE_STORY_01', outcomeIn: ['creative_success', 'neutral'] },
                        lines: [
                            "저번에 알려준 방법대로 놀리니까 완전 기절초풍이던데? 작가 너 소질이 있구나!",
                            "응.....?",
                            "내가 파이를 훔쳐갔냐고..? 난 파이를 먹을 수도 없는데 무슨 소리야?",
                            "나는 그냥 장난만 칠 뿐이야, 도둑질 같은 건 안 해! 감히 날 의심해? 좋아, 그럼 더 제대로 놀래켜주지!",
                            "빵집에 몰래 걸어두고 오게, '세상에서 가장 무서운 그림'을 그려줘!"
                        ]
                    },
                    {
                        id: 'pie03_after_01_bad',
                        when: { prevQuestId: 'PIE_STORY_01', outcomeIn: ['bad'] },
                        lines: [
                            "어라? 네 장난 계획이 별로였나 봐. 반응이 생각보다 별로더라고. 작가 너 놀래키는데는 소질이 없구나?",
                            "응.....?",
                            "내가 파이를 훔쳐갔냐고..? 난 파이를 먹을 수도 없는데 무슨 소리야?",
                            "나는 그냥 장난만 칠 뿐이야, 도둑질 같은 건 안 해! 감히 날 의심해? 좋아, 그럼 더 제대로 놀래켜주지!",
                            "빵집에 몰래 걸어두고 오게, '세상에서 가장 무서운 그림'을 그려줘!"
                        ]
                    }
                ]
            },
                        
            reaction_perfect: [
                '이거 진짜 완전 소름 돋는데? 최고야!',
                '이걸로 놀리면 다들 깜짝 놀라겠지? 히히!'
            ],
            reaction_good: [
                '오, 이 정도면 꽤 괜찮은데?',
                '조금만 더 무섭게 하면 완벽하겠어!'
            ],
            reaction_normal: [
                '음… 나쁘진 않은데, 좀 심심한데?',
                '조금만 더 장난기 있게 해보자~'
            ],
            reaction_bad: [
                '에이, 이건 너무 순해. 누구도 안 놀라겠다니까?',
                '다음엔 좀 더 과감하게 가보자고!'
            ],
            reaction_terrible: [
                '이건 장난도 안 돼… 재미없어!',
                '다시! 이번엔 진짜 제대로 놀랄 그림으로!'
            ]
        },
        requests: [
            { id: 'finn_req_true_form', text: "핀의 멋진 생전 모습을 상상한 그림" },
            { id: 'finn_req_ghost_friends', text: "다양하고 재미있는 유령 친구들 컬렉션" },
            { id: 'solve_finn_monster_form', text: "내가 변신할 가장 무섭고 강력한 몬스터" },
            { id: 'solve_finn_sunlight', text: "핀이가 햇빛을 피해 낮에도 마을을 돌아다닐 수 있는 방법" }
        ]
    },
    pochi: {
        id: 'pochi',
        name: '포치',
        image: 'assets/images/npcs/pochi_idle.png',
        portrait: 'assets/images/npcs/pochi_portrait.png',
        baseScale: 0.6,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '먹는 걸 세상에서 제일 좋아하는 시바견.',
        speechStyle: '귀엽고 밝은 해요체',
        likes: [],
        dislikes: [],
        dialogues: {
            welcome: [
                '멍! 맛있는 냄새가 나는 그림을 그려주실 수 있나요?',
                '뼈다귀도 좋고 간식도 좋아요!'
            ],
            welcomeByRequest: {
                'PIE_STORY_05': [
                    "킁킁… 작가님, 요즘 제가 자주 가던 빵집에 이상한 것들이 잔뜩 생겼어요.",
                    "이젠 들어갈 수가 없어서… 그 집 파이 냄새만 생각나요.",
                    "공짜로 파이를 먹을 수 있어서 좋았는데..",
                    "위로가 되게, 세상에서 가장 맛있어 보이는 파이 그림을 그려주실 수 있나요?"
                ],
                'pochi_req_ultimate_bowl': [
                    "작가님... 제 밥그릇이 너무 평범해서 그런지 요즘 식욕이 없어요.",
                    "밥 먹는 시간이 매일 축제처럼 즐거웠으면 좋겠는데요.",
                    "세상에서 가장 맛있어 보이는 밥그릇을 디자인해주실 수 있을까요?"
                ],
                'pochi_req_sausage_trail': [
                    "산책은 좋지만 맨날 같은 풀과 나무만 보니까 조금 지겨워요.",
                    "만약 소시지랑 치킨으로 만들어진 길이 있다면 얼마나 행복할까요?",
                    "제가 꿈꾸는 완벽한 산책로를 그려주시면 안 될까요?"
                ],
                'solve_pochi_high_snack': [
                    "작가님, 큰일이에요! 간식을 식탁 위에 올려두고 주인님이 나가버렸어요!",
                    "냄새는 나는데 닿지를 않아요… 저녁까지 굶으면 어떡하죠?",
                    "저 간식을 안전하게 먹을 수 있는 비밀 작전을 알려주세요!"
                ],
                'solve_pochi_nap_spot': [
                    "밥 먹고 나니까 잠이 솔솔 오는데 딱딱한 바닥에서는 잠이 안 와요.",
                    "햇볕은 따뜻하고, 폭신폭신하고, 맛있는 냄새도 나는 그런 낮잠 장소가 있었으면 좋겠어요.",
                    "세상에서 가장 완벽한 낮잠 명당을 찾아주실 수 있을까요?"
                ]
            },
            reaction_perfect: [
                '왈! 보기만 해도 침이 고여요! 완전 최고예요!',
                '이건 꿈에서라도 또 먹고 싶을 정도예요!',
                '이제 밥그릇을 껴안고 잘 수 있을 것 같아요. 정말 완벽해요!'
            ],
            reaction_good: [
                '와, 정말 맛있어 보이네요!',
                '지금 바로 한 입 베어 물고 싶어요!',
                '조금만 더 간식이 있었으면 더 좋았겠지만, 이 정도면 배부르게 잘 먹을 수 있겠어요!'
            ],
            reaction_normal: [
                '음… 맛있어 보이긴 하는데, 조금 더 푸짐했으면 좋겠어요.',
                '다음엔 간식 두 배로 그려주실 거죠?',
                '기대했던 만큼은 아니지만, 열심히 그려주신 건 느껴져요!'
            ],
            reaction_bad: [
                '조금… 배가 안 차 보이는 그림이에요.',
                '그래도 그려주셔서 고맙습니다! 다음엔 더 많이 주세요!',
                '배고픈 포치에게는 살짝 아쉬운 그림이네요…'
            ],
            reaction_terrible: [
                '앗, 이건… 먹는 거 맞나요?',
                '배고픈 포치에게 이건 너무 잔인해요…',
                '이걸 보면 배가 더 고파져요… 다시 부탁드려도 될까요?'
            ]
        },
        requests: [
            { id: 'pochi_req_ultimate_bowl', text: "세상에서 가장 맛있어 보이는 밥그릇" },
            { id: 'pochi_req_sausage_trail', text: "소시지와 치킨으로 만들어진 산책로" },
            { id: 'solve_pochi_high_snack', text: "높은 식탁 위 간식을 먹을 기발한 방법" },
            { id: 'solve_pochi_nap_spot', text: "세상에서 가장 완벽한 낮잠 장소" }
        ]
    },
    'serena': {
        id: 'serena',
        name: '세레나',
        image: 'assets/images/npcs/serena_idle.png',
        portrait: 'assets/images/npcs/serena_portrait.png',
        baseScale: 0.8,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '무대 앞에서 늘 긴장하는 여가수.',
        speechStyle: '조심스럽고 불안한 존댓말, 해요체',
        likes: ['잔잔한 피아노', '푸른 드레스'],
        dislikes: ['소란스러운 리허설'],
        dialogues: {
            welcome: [
                '안녕하세요… 제 무대를 따뜻하게 채워줄 그림을 부탁드려도 될까요?',
                '조금만 용기를 낼 수 있도록 도와주세요… 부탁드릴게요.'
            ],
            welcomeByRequest: {
                'serena_req_stage_dress': [
                    '복귀 무대를 앞두고 있는데, 관객들이 저를 보고 희망을 느꼈으면 좋겠어요.',
                    '밤하늘처럼 빛나는 드레스를 그려주실 수 있을까요?'
                ],
                'serena_req_album_cover': [
                    '불안한 마음을 눌러 담은 신곡, "작은 별의 노래"를 준비하고 있어요.',
                    '제 마음을 다독여 줄 앨범 커버를 부탁드려도 될까요?'
                ],
                'solve_serena_breathing': [
                    '리허설 때 숨이 너무 가빠져서 무대에서 버티기 힘들었어요…',
                    '긴장하지 않고 호흡을 안정시킬 방법이 필요해요.'
                ],
                'solve_serena_studio': [
                    '연습에 집중하고 싶은데 사소한 소음에도 자꾸 마음이 흔들려요.',
                    '소음을 차단하고 마음을 평온하게 해줄 연습실을 설계해 주실 수 있을까요?'
                ]
            },
            reaction_perfect: [
                '이 그림을 보면 떨림이 사라질 것 같아요. 정말 고맙습니다!',
                '제 마음 안에 작은 별이 다시 반짝이기 시작했어요!'
            ],
            reaction_good: [
                '정말 예쁘고 따뜻해요. 살짝만 더 차분했으면 완벽했을 것 같아요.',
                '이 그림 덕분에 무대를 향한 용기가 생기고 있어요.'
            ],
            reaction_normal: [
                '나쁘지 않아요. 하지만 아직 마음이 완전히 진정되진 않네요.',
                '조금만 더 부드러운 분위기가 있었으면 해요.'
            ],
            reaction_bad: [
                '이건 오히려 긴장을 더 키울 것 같아요… 죄송하지만 다시 부탁드릴게요.',
                '제 무대와는 조금 멀게 느껴져요.'
            ],
            reaction_terrible: [
                '죄송하지만 이건 제 마음을 전혀 달래주지 못하네요.',
                '정말 두려움이 더 커졌어요… 다시 부탁드릴게요.'
            ]
        },
        requests: [
            { id: 'serena_req_stage_dress', text: "밤하늘의 별처럼 빛나는 복귀 무대 드레스" },
            { id: 'serena_req_album_cover', text: "'작은 별의 노래' 앨범 커버" },
            { id: 'solve_serena_breathing', text: "무대 위에서 긴장을 풀 수 있는 호흡 루틴" },
            { id: 'solve_serena_studio', text: "완벽한 방음 연습실 설계" }
        ]
    },
    'monocle': {
        id: 'monocle',
        name: '미스터 모노클',
        image: 'assets/images/npcs/monocle_idle.png',
        portrait: 'assets/images/npcs/monocle_portrait.png',
        baseScale: 0.82,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: '까칠하고 예리한 예술 평론가.',
        speechStyle: '건조하고 단호한 어투, 존댓말',
        likes: ['정교한 구도', '모노톤'],
        dislikes: ['허술한 작품'],
        dialogues: {
            welcome: [
                '대충 그린 작품은 질색입니다. 각오하고 계시죠?',
                '저를 만족시키기 어렵다는 건 알고 오셨겠지요?'
            ],
            welcomeByRequest: {
                'monocle_req_serenity': [
                    '감정의 본질을 모르는 예술가는 많습니다.',
                    '진정한 고요함이란 무엇인지, 작가님의 해석을 보여주시기 바랍니다.',
                    '평화라는 추상적 개념을 구체적 형상으로 구현할 수 있겠습니까?'
                ],
                'monocle_req_scream_hope': [
                    "뭉크의 '절규'를 그대로 베끼는 건 의미가 없습니다.",
                    '절망의 극한에서 희망을 찾아내는 것, 그것이 진정한 예술가의 역량이지요.',
                    '작가님만의 시각으로 절망을 희망으로 승화시켜 보시기 바랍니다.'
                ],
                'monocle_req_clock_story': [
                    '이 낡은 괘종시계가 품고 있는 세월의 무게를 느끼십니까?',
                    '시간이라는 무형의 존재를 어떻게 시각화할 것인지 궁금합니다.',
                    '과거와 현재, 그리고 미래가 교차하는 순간을 포착해 보시기 바랍니다.'
                ],
                'monocle_req_proverb': [
                    '속담 하나를 제대로 해석할 줄 알아야 진정한 예술가입니다.',
                    '낮과 밤, 새와 쥐가 상징하는 바를 깊이 있게 탐구해 보시기 바랍니다.',
                    '단순한 교훈이 아닌, 인간 본성의 이중성을 풍자적으로 드러내 주십시오.'
                ]
            },
            reaction_perfect: [
                '흠… 이 정도면 내가 뭐라 할 말이 없군요. 훌륭합니다.',
                '본질을 정확히 꿰뚫었군요. 내가 찾던 감각입니다.'
            ],
            reaction_good: [
                '괜찮습니다. 약간만 더 다듬으면 완벽해지겠어요.',
                '의도가 잘 보이네요. 조금만 더 대담했으면 합니다.'
            ],
            reaction_normal: [
                '무난하군요. 하지만 특별함은 느껴지지 않습니다.',
                '의미는 알겠지만, 더 깊이 파고들 필요가 있겠어요.'
            ],
            reaction_bad: [
                '실망스럽군요. 본질을 건드리지 못했어요.',
                '이 정도로는 비평할 가치가 없습니다.'
            ],
            reaction_terrible: [
                '작품이라 부르기 민망합니다. 처음부터 다시 생각해 보게.',
                '이런 얄팍한 해석으론 내 시간을 더 뺏을 수 없네.'
            ]
        },
        requests: [
            { id: 'monocle_req_serenity', text: "고요한 평화라는 감정의 형상화" },
            { id: 'monocle_req_scream_hope', text: "뭉크의 '절규'를 희망적으로 재해석한 삽화" },
            { id: 'monocle_req_clock_story', text: "낡은 괘종시계가 들려주는 시간의 흐름" },
            { id: 'monocle_req_proverb', text: "'낮말은 새가 듣고 밤말은 쥐가 듣는다' 속담의 시각화" }
        ]
    },
    // 'antoine': {
    //     id: 'antoine',
    //     name: '앙투안',
    //     image: 'assets/images/npcs/antoine_idle.png',
    //     portrait: 'assets/images/npcs/antoine_portrait.png',
    //     baseScale: 0.78,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '자부심 강한 프렌치 셰프.',
    //     speechStyle: '열정 넘치는 존댓말, 해요체',
    //     likes: ['완벽한 플레이팅', '버터 향'],
    //     dislikes: ['서툰 칼질'],
    //     dialogues: {
    //         welcome: [
    //             '봉쥬르! 제 요리만큼 근사한 그림을 부탁드리러 왔습니다.'
    //         ],
    //         reaction_perfect: [
    //             '셀 마니피크! 이 그림은 손님을 사로잡겠네요.'
    //         ],
    //         reaction_good: [
    //             '훌륭합니다. 향이 조금만 더 느껴졌다면 최고였겠어요.'
    //         ],
    //         reaction_normal: [
    //             '괜찮지만 제 요리의 품격을 다 담진 못했네요.'
    //         ],
    //         reaction_bad: [
    //             '이대로는 손님께 보여드리기 어렵습니다.'
    //         ],
    //         reaction_terrible: [
    //             '노노! 완전히 다시 해야겠어요.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'elise': {
    //     id: 'elise',
    //     name: '엘리제',
    //     image: 'assets/images/npcs/elise_idle.png',
    //     portrait: 'assets/images/npcs/elise_portrait.png',
    //     baseScale: 0.8,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '지적인 여의사.',
    //     speechStyle: '침착한 존댓말, 해요체',
    //     likes: ['청결한 진료실'],
    //     dislikes: ['소란스러움'],
    //     dialogues: {
    //         welcome: [
    //             '환자분께 설명할 자료를 따뜻한 느낌으로 그리고 싶어요.'
    //         ],
    //         reaction_perfect: [
    //             '이 그림이라면 환자분들이 훨씬 안심하실 겁니다.'
    //         ],
    //         reaction_good: [
    //             '정말 좋네요. 조금만 더 정리하면 완벽하겠어요.'
    //         ],
    //         reaction_normal: [
    //             '나쁘진 않지만 정보가 살짝 산만해 보여요.'
    //         ],
    //         reaction_bad: [
    //             '설명에 쓰기엔 부족해서 다시 부탁드릴게요.'
    //         ],
    //         reaction_terrible: [
    //             '죄송하지만 이건 사용할 수 없겠어요.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'emily': {
    //     id: 'emily',
    //     name: '에밀리',
    //     image: 'assets/images/npcs/emily_idle.png',
    //     portrait: 'assets/images/npcs/emily_portrait.png',
    //     baseScale: 0.78,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '별을 사랑하는 천문학 소녀.',
    //     speechStyle: '반짝이는 반말',
    //     likes: ['밤하늘', '망원경'],
    //     dislikes: ['구름 낀 날'],
    //     dialogues: {
    //         welcome: [
    //             '안녕! 오늘 밤 노트에 붙일 별자리 그림 부탁해도 돼?'
    //         ],
    //         reaction_perfect: [
    //             '우와! 진짜 별이 쏟아지는 것 같아!'
    //         ],
    //         reaction_good: [
    //             '정말 예뻐! 별이 조금만 더 많으면 좋겠어!'
    //         ],
    //         reaction_normal: [
    //             '음… 조금 평범한 느낌이야.'
    //         ],
    //         reaction_bad: [
    //             '별이 너무 적어서 밤하늘 같지 않아.'
    //         ],
    //         reaction_terrible: [
    //             '어… 이건 내가 원한 하늘이 아니야.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'noah': {
    //     id: 'noah',
    //     name: '노아',
    //     image: 'assets/images/npcs/noah_idle.png',
    //     portrait: 'assets/images/npcs/noah_portrait.png',
    //     baseScale: 0.79,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '꼼꼼한 건축가.',
    //     speechStyle: '차분하고 분석적인 존댓말, 해요체',
    //     likes: ['도면', '치수'],
    //     dislikes: ['허술한 설계'],
    //     dialogues: {
    //         welcome: [
    //             '새로운 건축 콘셉트를 스케치하고 싶은데 도와주실 수 있을까요?'
    //         ],
    //         reaction_perfect: [
    //             '균형과 미학이 완벽합니다.'
    //         ],
    //         reaction_good: [
    //             '좋습니다. 기둥 배치만 조금 다듬으면 완벽해요.'
    //         ],
    //         reaction_normal: [
    //             '나쁘지 않지만 구조적으로 보완이 필요해 보입니다.'
    //         ],
    //         reaction_bad: [
    //             '이대로는 안정성을 담보하기 어렵겠네요.'
    //         ],
    //         reaction_terrible: [
    //             '죄송하지만 이 설계는 사용할 수 없습니다.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'isabella': {
    //     id: 'isabella',
    //     name: '이사벨라',
    //     image: 'assets/images/npcs/isabella_idle.png',
    //     portrait: 'assets/images/npcs/isabella_portrait.png',
    //     baseScale: 0.8,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '도도한 의상 디자이너.',
    //     speechStyle: '세련된 반말',
    //     likes: ['검정 실루엣', '금빛 장식'],
    //     dislikes: ['촌스러운 조합'],
    //     dialogues: {
    //         welcome: [
    //             '안녕? 내 다음 시즌을 위한 영감이 필요해.'
    //         ],
    //         reaction_perfect: [
    //             '완벽해. 런웨이에 바로 올릴 수 있겠어.'
    //         ],
    //         reaction_good: [
    //             '아주 좋아. 조금만 더 대담했으면 완벽했을 거야.'
    //         ],
    //         reaction_normal: [
    //             '음… 나쁘진 않은데 조금 평범하네.'
    //         ],
    //         reaction_bad: [
    //             '이건 내 브랜드와 맞지 않아.'
    //         ],
    //         reaction_terrible: [
    //             '런웨이에 세울 수 없는 디자인이야.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'oliver': {
    //     id: 'oliver',
    //     name: '올리버',
    //     image: 'assets/images/npcs/oliver_idle.png',
    //     portrait: 'assets/images/npcs/oliver_portrait.png',
    //     baseScale: 0.82,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '인자한 골동품점 주인.',
    //     speechStyle: '온화한 존댓말, 해요체',
    //     likes: ['옛 지도', '시계'],
    //     dislikes: ['거친 태도'],
    //     dialogues: {
    //         welcome: [
    //             '어서 오세요. 오래된 이야기를 담은 그림을 찾고 있답니다.'
    //         ],
    //         reaction_perfect: [
    //             '세월의 향기가 느껴집니다. 아주 마음에 들어요.'
    //         ],
    //         reaction_good: [
    //             '참 따뜻하네요. 조금만 더 색을 눌러주면 좋겠습니다.'
    //         ],
    //         reaction_normal: [
    //             '느낌은 좋지만 조금 더 앤틱한 요소가 있으면 좋겠네요.'
    //         ],
    //         reaction_bad: [
    //             '이건 제 가게 분위기와 맞지 않네요.'
    //         ],
    //         reaction_terrible: [
    //             '죄송하지만 완전히 다른 방향이라 사용할 수 없습니다.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'julia': {
    //     id: 'julia',
    //     name: '줄리아',
    //     image: 'assets/images/npcs/julia_idle.png',
    //     portrait: 'assets/images/npcs/julia_portrait.png',
    //     baseScale: 0.78,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '감성적인 시인.',
    //     speechStyle: '시적인 존댓말, 해요체',
    //     likes: ['깃펜', '달빛'],
    //     dislikes: ['소음'],
    //     dialogues: {
    //         welcome: [
    //             '오늘도 마음을 적실 장면을 찾고 싶어요.'
    //         ],
    //         reaction_perfect: [
    //             '이 그림을 보면 한 편의 시가 떠오르네요.'
    //         ],
    //         reaction_good: [
    //             '감사해요. 여백이 조금 더 있으면 좋겠어요.'
    //         ],
    //         reaction_normal: [
    //             '감성은 있지만 조금 복잡해 보여요.'
    //         ],
    //         reaction_bad: [
    //             '시와 어울리기엔 다소 거칠어요.'
    //         ],
    //         reaction_terrible: [
    //             '감정이 느껴지지 않아 위로가 되지 않네요.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'marco': {
    //     id: 'marco',
    //     name: '마르코',
    //     image: 'assets/images/npcs/marco_idle.png',
    //     portrait: 'assets/images/npcs/marco_portrait.png',
    //     baseScale: 0.82,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '과묵한 낚시꾼.',
    //     speechStyle: '짧고 투박한 말투, 반말',
    //     likes: ['호수', '낚싯줄'],
    //     dislikes: ['시끄러운 사람'],
    //     dialogues: {
    //         welcome: [
    //             '…그림 좀 부탁하지.'
    //         ],
    //         reaction_perfect: [
    //             '잘했어. 내가 보던 풍경 그대로야.'
    //         ],
    //         reaction_good: [
    //             '괜찮네. 물결이 조금만 더 잔잔했으면 좋겠어.'
    //         ],
    //         reaction_normal: [
    //             '그럭저럭이야.'
    //         ],
    //         reaction_bad: [
    //             '이건 내가 찾는 느낌이 아니야.'
    //         ],
    //         reaction_terrible: [
    //             '전혀 마음에 안 들어. 다시 해줘.'
    //         ]
    //     },
    //     requests: []
    // },
    // 'lily': {
    //     id: 'lily',
    //     name: '리리',
    //     image: 'assets/images/npcs/lily_idle.png',
    //     portrait: 'assets/images/npcs/lily_portrait.png',
    //     baseScale: 0.75,
    //     position: { bottom: '0%', transform: 'translateX(-50%)' },
    //     persona: '명랑한 어린 소녀.',
    //     speechStyle: '발랄한 반말',
    //     likes: ['색연필', '꽃'],
    //     dislikes: ['어두운 방'],
    //     dialogues: {
    //         welcome: [
    //             '안녕! 오늘은 어떤 재미있는 그림을 보여줄 거야?'
    //         ],
    //         reaction_perfect: [
    //             '완전 최고야! 친구들에게 자랑해야지!'
    //         ],
    //         reaction_good: [
    //             '정말 예쁘다! 조금만 더 색을 넣어줄래?'
    //         ],
    //         reaction_normal: [
    //             '음… 귀엽긴 한데 조금 심심해.'
    //         ],
    //         reaction_bad: [
    //             '이건 내가 상상한 느낌이 아니야…'
    //         ],
    //         reaction_terrible: [
    //             '어어… 좀 무서워 보여… 다시 해줄래?'
    //         ]
    //     },
    //     requests: []
    // },
    'theo': {
        id: 'theo',
        name: '테오',
        image: 'assets/images/npcs/theo_idle.png',
        portrait: 'assets/images/npcs/theo_portrait.png',
        baseScale: 0.75,
        position: { bottom: '0%', transform: 'translateX(-50%)' },
        persona: "마을의 젊은 농부. 자연을 사랑하며, 순박하고 솔직한 성격. 약간의 부끄러움을 타지만 친절하다.",
		speechStyle: "해요체",
        likes: ["신선한 채소", "햇살 좋은 날", "자연의 색"],
        dislikes: ["벌레", "복잡한 도시", "시든 꽃"],
        requests: [
            { id: 'theo_req_tomato', text: '탐스럽게 잘 익은 토마토' },
            { id: 'theo_req_sprout', text: '싱그러운 어린잎' },
            { id: 'theo_req_scarecrow', text: '위풍당당하고 멋진 허수아비' },
            { id: 'theo_req_orchard', text: '과일이 주렁주렁 열린 풍요로운 과수원' },
            { id: 'theo_req_rain_teacup', text: '비 오는 창밖 풍경과 따뜻한 찻잔' },
            { id: 'theo_req_legend_seed', text: "황금 씨앗에서 하늘까지 솟는 콩나무가 자라나는 모습" },
            { id: 'theo_req_future_farm', text: "최첨단 기술로 농사짓는 100년 뒤 미래 농장의 모습" },
            { id: 'solve_theo_mole_plan', text: "두더지를 다치게 하지 않고 밭에서 멀리 보내는 평화로운 방법" },
            { id: 'solve_theo_jam_recipe', text: "세상에서 가장 맛있는 딸기잼을 만드는 비법" }
        ],
        dialogues: {
            welcome: [
                "저기... 혹시 그림을 그려주는 곳이 맞나요?",
                "제 농장의 채소를 그려주실 수 있을까 해서요.",
                "아주 멋지게 부탁드립니다!"
            ],
            // 랜덤 환영 대사 세트 + 해당 세트에 대응하는 요청 세트
            welcomeSets: [
                {
                    id: 'theo_welcome_tomato',
                    lines: [
                        "오늘은 토마토 수확을 마치고 왔어요.",
                        "탐스럽게 익은 빨간 토마토의 싱그러움을 담아주실 수 있을까요?"
                    ],
                    requests: [
                        { id: 'theo_req_tomato', text: '탐스럽게 잘 익은 토마토' },
                        { id: 'theo_req_tomato_glossy', text: '빛을 받으며 반짝이는 토마토 한 개' }
                    ]
                },
                {
                    id: 'theo_welcome_scarecrow',
                    lines: [
                        "요즘 새들이 자꾸 옥수수를 쪼아 먹어서 걱정이에요.",
                        "밭에 세워 둘 멋진 허수아비를 만들고 싶은데, 아이디어가 통 떠오르질 않네요.",
                        "새들이 보고 깜짝 놀랄 만큼, 위풍당당하고 멋진 허수아비를 그려주세요."
                    ],
                    requests: [
                        { id: 'theo_req_scarecrow', text: '위풍당당하고 멋진 허수아비' }
                    ]
                },
                {
                    id: 'theo_welcome_orchard',
                    lines: [
                        "내년에는 과수원을 새로 하나 만들고 싶어요. 생각만 해도 배가 부르네요.",
                        "제가 꿈꾸는 과수원을 미리 그림으로 보고 싶어요.",
                        "온갖 종류의 과일들이 주렁주렁 열린, 풍요로운 과수원의 풍경을 부탁드려요."
                    ],
                    requests: [
                        { id: 'theo_req_orchard', text: '과일이 주렁주렁 열린 풍요로운 과수원' }
                    ]
                },
                {
                    id: 'theo_welcome_rain_teacup',
                    lines: [
                        "가뭄 끝에 드디어 비가 내리고 있어요. 밭에 나갈 수도 없고...",
                        "비 오는 날 창밖을 보면서 따뜻한 차 한잔하는 게 요즘 제 유일한 낙이에요.",
                        "창문 너머로 비가 내리는 밭과, 김이 모락모락 나는 찻잔을 그려주세요."
                    ],
                    requests: [
                        { id: 'theo_req_rain_teacup', text: '비 오는 창밖 풍경과 따뜻한 찻잔' }
                    ]
                },
                
            ],
            // 의뢰별 환영 대사 매핑
            welcomeByRequest: {
                'PRESS_STORY_01': [
                    "작가님! 큰일 났어요! 제 밭에 불이 났고…",
                    "무엇보다 아버지가 만들어주신 허수아비 '밥'이 불타고 있어요!",
                    "제발 '밥'을 구할 기발한 방법을 그려주세요!"
                ],
                'theo_req_tomato': [
                    "오늘 막 수확한 토마토예요!",
                    "탐스러운 빨간빛을 그대로 담아주시면 좋겠어요."
                ],
                'theo_req_scarecrow': [
                    "옥수수를 지킬 든든한 친구가 필요해요.",
                    "위풍당당하고 멋진 허수아비를 부탁드려요."
                ],
                'theo_req_orchard': [
                    "풍요로운 과수원을 꿈꾸고 있어요.",
                    "여러 과일이 주렁주렁 열린 모습을 담아주세요."
                ],
                'theo_req_rain_teacup': [
                    "비 오는 날의 고요함을 좋아해요.",
                    "창문 너머 빗소리와 따뜻한 찻잔을 표현해 주세요."
                ],
                'theo_req_legend_seed': [
                    "조상 대대로 내려오는 황금 씨앗이 하나 있어요.",
                    "아이들에게 이 씨앗에 얽힌 전설을 들려주고 싶은데, 그림이 있으면 더 좋을 것 같아요.",
                    "황금 씨앗을 심었더니 하늘까지 닿는 콩나무가 자라나는 모습을 그려주실 수 있을까요?"
                ],
                'theo_req_future_farm': [
                    "가끔은 문득 생각해요. 백 년 뒤에는 농사를 어떻게 지을까 하고요.",
                    "혹시 미래 농장의 모습이 궁금하지 않으신가요?",
                    "최첨단 기술로 농사짓는, 100년 뒤 미래 농장의 모습을 그려주시면 좋겠어요."
                ],
                'solve_theo_mole_plan': [
                    "요즘 밭에 두더지들이 자꾸 땅을 헤집고 다녀서 걱정이에요.",
                    "그렇다고 함부로 해치고 싶진 않고… 평화롭게 멀리 보내줄 수 있으면 좋겠어요.",
                    "밭을 망치지 않으면서 두더지를 쫓아낼 수 있는 방법을 그림으로 알려주실 수 있을까요?"
                ],
                'solve_theo_jam_recipe': [
                    "올해 딸기가 유난히 잘 자라서요. 이걸로 잼을 만들까 해요.",
                    "그냥 평범한 잼 말고, 먹으면 모두가 행복해지는 잼이면 좋겠어요.",
                    "세상에서 가장 맛있는 딸기잼을 만들 수 있는 비법을 그림으로 알려주세요!"
                ]
            },
            reaction_perfect: ["와! 정말 제 농장의 토마토 같아요! 정말 감사합니다!"],
            reaction_good: ["마음에 들어요. 정말 잘 그리시네요."],
            reaction_normal: ["음, 괜찮네요. 다음엔 더 잘 그려주시겠죠?"],
            reaction_bad: ["제가 생각했던 거랑은 조금... 다르네요."],
            reaction_terrible: ["이, 이걸... 돈을 내고 받아야 하나요...?"],
        }
    },
    // ... 추후 다른 NPC 추가
};

// npcData를 전역 스코프에 할당하여 다른 파일에서 접근 가능하게 함
window.npcData = npcData;

const dialogData = {
    default: {
        position: { bottom: '60%', left: '10%', right: '10%' },
        size: { width: 'auto', maxWidth: '400px' }
    }
    // ... 추후 다른 위치/크기 프리셋 추가
};
const effectConfig = {
    concentration: { bonusTimeByLevel: [5, 5, 10, 10, 10] },
    negotiator: { goldBonusPctByLevel: [5, 10, 15, 20, 25, 30, 40, 50, 60, 70] },
    wisdom: { xpBonusPctByLevel: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
    swiftHands: { bonusPctPerSecond: [0.5, 0.8, 1.1, 1.5, 2.0] },
    reputation: { doubleChancePctByLevel: [10, 20, 30, 40, 50] },
    trust: { ignoreRepLossChancePctByLevel: [10, 20, 30, 40, 50] }
};

const skillData = {
    // 그룹 1: 기본 역량
    'concentration': {
        name: '집중력',
        icon: '⏰',
        image: 'assets/images/skills/concentration.png',
        group: 'basic',
        description: '그림 그리기 제한 시간을 영구적으로 늘려줍니다.',
        levels: [
            { cost: 50, effect: '+5초 (총 65초)', reqLevel: 1 },
            { cost: 100, effect: '+5초 (총 70초)', reqLevel: 2 },
            { cost: 300, effect: '+10초 (총 80초)', reqLevel: 3 },
            { cost: 500, effect: '+10초 (총 90초)', reqLevel: 4 },
            { cost: 700, effect: '+10초 (총 100초)', reqLevel: 5 }
        ]
    },
    'negotiator': {
        name: '협상의 달인',
        icon: '🤝',
        image: 'assets/images/skills/negotiator.png',
        group: 'basic',
        description: '획득하는 골드 보너스가 영구적으로 증가합니다.',
        levels: [
            { cost: 100, effect: '골드 보너스 +5%', reqLevel: 1 }, { cost: 200, effect: '골드 보너스 +10%', reqLevel: 1 },
            { cost: 300, effect: '골드 보너스 +15%', reqLevel: 1}, { cost: 400, effect: '골드 보너스 +20%', reqLevel: 2 },
            { cost: 500, effect: '골드 보너스 +25%', reqLevel: 2 }, { cost: 600, effect: '골드 보너스 +30%', reqLevel: 2 },
            { cost: 700, effect: '골드 보너스 +40%', reqLevel: 5 }, { cost: 900, effect: '골드 보너스 +50%', reqLevel: 6 },
            { cost: 1200, effect: '골드 보너스 +60%', reqLevel: 7 }, { cost: 1500, effect: '골드 보너스 +70%', reqLevel: 8 }
        ]
    },
    'wisdom': {
        name: '현명함',
        icon: '✨📖',
        image: 'assets/images/skills/wisdom.png',
        group: 'basic',
        description: '획득하는 경험치(XP) 보너스가 영구적으로 증가합니다.',
        levels: [
            { cost: 30, effect: 'XP 보너스 +10%', reqLevel: 1 }, { cost: 80, effect: 'XP 보너스 +20%', reqLevel: 1 },
            { cost: 150, effect: 'XP 보너스 +30%', reqLevel: 1 }, { cost: 250, effect: 'XP 보너스 +40%', reqLevel: 1 },
            { cost: 350, effect: 'XP 보너스 +50%', reqLevel: 1 }, { cost: 450, effect: 'XP 보너스 +60%', reqLevel: 2 },
            { cost: 550, effect: 'XP 보너스 +70%', reqLevel: 3 }, { cost: 650, effect: 'XP 보너스 +80%', reqLevel: 4 },
            { cost: 750, effect: 'XP 보너스 +90%', reqLevel: 5 }, { cost: 850, effect: 'XP 보너스 +100%', reqLevel: 6 }
        ]
    },
    // 그룹 2: 전문 기술
    'reputation': {
        name: '예술가의 평판',
        icon: '📈',
        image: 'assets/images/skills/reputation.png',
        group: 'expert',
        description: '그림 완성 시, 확률적으로 획득 명성이 2배가 됩니다.',
        levels: [
            { cost: 100, effect: '10% 확률로 명성 2배', reqLevel: 2 }, 
            { cost: 200, effect: '20% 확률', reqLevel: 3 },
            { cost: 400, effect: '30% 확률', reqLevel: 4 }, 
            { cost: 800, effect: '40% 확률', reqLevel: 5 },
            { cost: 1200, effect: '50% 확률', reqLevel: 7 },
        ]
    },
    'trust': {
        name: '굳건한 신뢰',
        icon: '🛡️',
        image: 'assets/images/skills/trust.png',
        group: 'expert',
        description: '명성이 하락할 때, 확률적으로 하락을 무시합니다.',
        levels: [
            { cost: 100, effect: '10% 확률로 명성 하락 무시', reqLevel: 2 }, 
            { cost: 200, effect: '20% 확률', reqLevel: 3 },
            { cost: 300, effect: '30% 확률', reqLevel: 4 }, 
            { cost: 500, effect: '40% 확률', reqLevel: 5 },
            { cost: 800, effect: '50% 확률', reqLevel: 7 },
        ]
    },
    // 그룹 3: 장인의 비급
    'swiftHands': {
        name: '신속의 손놀림',
        icon: '👐',
        image: 'assets/images/skills/swiftHands.png',
        group: 'master',
        description: '의뢰를 빨리 끝낼수록 보너스 골드와 명성을 퍼센트로 추가 획득합니다.',
        levels: [
            { cost: 200, effect: '남은 1초당 기본 보상의 0.5% 추가(골드/명성)', reqLevel: 3 }, 
            { cost: 500, effect: '남은 1초당 0.8% 추가', reqLevel: 4 },
            { cost: 800, effect: '남은 1초당 1.1% 추가', reqLevel: 6 }, 
            { cost: 1200, effect: '남은 1초당 1.5% 추가', reqLevel: 8 },
            { cost: 2000, effect: '남은 1초당 2.0% 추가', reqLevel: 10 }
        ]
    },
    'lastFocus': {
        name: '최후의 집중',
        icon: '⏰',
        image: 'assets/images/skills/lastFocus.png',
        group: 'master',
        description: '남은 시간이 10초 미만일 때 모두 지우기를 하면 30초를 획득합니다.',
        levels: [
            { cost: 1500, effect: '남은 시간 10초 미만 시 모두 지우기로 +30초', reqLevel: 7 }
        ]
    }
};

const initialPalette = [
    { name: '검정', color: '#000000' },
    { name: '흰색', color: '#FFFFFF' },
    { name: '빨강', color: '#FF0000' },
    { name: '파랑', color: '#0000FF' }
];

const shopData = {
    paints: {
        // 2단계: 튜토리얼 -> 초보자용 팔레트 (LV.1)
        beginnerPaletteSet: {
            name: '초보자용 팔레트',
            icon: '🌱',
            image: 'assets/images/shop/beginnerPaletteSet.png',
            description: "그림의 기초가 되는 노랑, 초록 2색을 해금합니다.",
            shortDescription: '<span style="color: #FFD700; font-weight: bold;">노랑</span>, <span style="color: #228B22; font-weight: bold;">초록</span> 해금',
            longDescription: '<span style="color: #FFD700; font-weight: bold;">노랑</span>, <span style="color: #228B22; font-weight: bold;">초록</span> 물감이 해금됩니다.',
            reqLevel: 1,
            cost: 50,
            unlocks: [
                { name: '노랑', color: '#FFD700' },
                { name: '초록', color: '#228B22' }
            ]
        },

        // 3단계: 기본 팔레트 완성 (세트 상품)
        basicPaletteSet: {
            name: '기본 팔레트 세트',
            icon: '🎨',
            image: 'assets/images/shop/basicPaletteSet.png',
            description: "그림의 기본이 되는 6가지 필수 색상을 한 번에 해금합니다.",
            shortDescription: '<span style="color: #FF8C00; font-weight: bold;">주황</span>, <span style="color: #8B4513; font-weight: bold;">갈색</span>, <span style="color: #9370DB; font-weight: bold;">보라</span> 등 6색 해금',
            longDescription: '<span style="color: #FF8C00; font-weight: bold;">주황</span>, <span style="color: #8B4513; font-weight: bold;">갈색</span>, <span style="color: #9370DB; font-weight: bold;">보라</span>, <span style="color: #FF69B4; font-weight: bold;">분홍</span>, <span style="color: #808080; font-weight: bold;">회색</span>, <span style="color: #87CEEB; font-weight: bold;">하늘</span> 물감이 해금됩니다.',
            reqLevel: 2,
            cost: 100,
            unlocks: [
                { name: '주황', color: '#FF8C00' },
                { name: '갈색', color: '#8B4513' },
                { name: '보라', color: '#9370DB' },
                { name: '분홍', color: '#FF69B4' },
                { name: '회색', color: '#808080' },
                { name: '하늘', color: '#87CEEB' }
            ]
        },

        skilledPaletteSet: {
            name: '숙련자의 팔레트 세트',
            icon: '🎯',
            image: 'assets/images/shop/skilledPaletteSet.png',
            description: '실무에서 자주 쓰는 중간 톤 6색을 한 번에 해금합니다. (기본 팔레트 세트 이후 표시)',
            shortDescription: '<span style="color: #6B8E23; font-weight: bold;">올리브</span>, <span style="color: #B9FFE0; font-weight: bold;">민트</span>, <span style="color: #800020; font-weight: bold;">버건디</span> 등 6색 해금',
            longDescription: '<span style="color: #6B8E23; font-weight: bold;">올리브</span>, <span style="color: #B9FFE0; font-weight: bold;">민트</span>, <span style="color: #800020; font-weight: bold;">버건디</span>, <span style="color: #CBA3FF; font-weight: bold;">라일락</span>, <span style="color: #B3A369; font-weight: bold;">카키</span>, <span style="color: #F5E1C8; font-weight: bold;">베이지</span> 물감이 해금됩니다.',
            reqLevel: 3,
            cost: 300,
            requiresPalette: 'basicPaletteSet',
            unlocks: [
                { name: '올리브', color: '#6B8E23' },
                { name: '민트', color: '#B9FFE0' },
                { name: '버건디', color: '#800020' },
                { name: '라일락', color: '#CBA3FF' },
                { name: '카키', color: '#B3A369' },
                { name: '베이지', color: '#F5E1C8' }
            ]
        },
        artisanPaletteSet: {
            name: '장인의 팔레트 세트',
            icon: '🏺',
            image: 'assets/images/shop/artisanPaletteSet.png',
            description: '깊이감 있는 장신구 색상 6종을 해금합니다. (숙련자 팔레트 세트 이후 표시)',
            shortDescription: '<span style="color: #1A2238; font-weight: bold;">인디오</span>, <span style="color: #27C5CF; font-weight: bold;">터쿼이즈</span>, <span style="color: #D4AF37; font-weight: bold;">골드</span> 등 6색 해금',
            longDescription: '<span style="color: #1A2238; font-weight: bold;">인디오</span>, <span style="color: #27C5CF; font-weight: bold;">터쿼이즈</span>, <span style="color: #D0006F; font-weight: bold;">마젠타</span>, <span style="color: #8A3E1A; font-weight: bold;">번트 시에나</span>, <span style="color:rgb(192, 164, 103); font-weight: bold;">크림</span>, <span style="color: #D4AF37; font-weight: bold;">메탈릭 골드</span> 물감이 해금됩니다.',
            reqLevel: 5,
            cost: 500,
            requiresPalette: 'skilledPaletteSet',
            unlocks: [
                { name: '인디오', color: '#1A2238' },
                { name: '터쿼이즈', color: '#27C5CF' },
                { name: '마젠타', color: '#D0006F' },
                { name: '번트 시에나', color: '#8A3E1A' },
                { name: '크림', color: '#FFE8B5' },
                { name: '메탈릭 골드', color: '#D4AF37' }
            ]
        },
        // 5단계: 특수 색상 (개별 구매, 장인 팔레트 이후)
        paynesGray: { name: '페인즈 그레이 물감', icon: '🌫️', color: '#404C5C', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '푸른빛이 감도는 짙은 회청색 물감입니다.', shortDescription: '페인즈 그레이 해금', longDescription: '그림자와 밤 표현에 적합한 페인즈 그레이 물감이 해금됩니다.' },
        sepia:  { name: '세피아 물감', icon: '📜', color: '#6B4423', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '갈색 잉크빛 세피아 물감입니다.', shortDescription: '세피아 해금', longDescription: '빈티지한 분위기의 세피아 물감이 해금됩니다.' },
        yellowGreen: { name: '옐로 그린 물감', icon: '🥝', color: '#C8FF4D', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '형광빛 라임색 물감입니다.', shortDescription: '옐로 그린 해금', longDescription: '형광 라임색 옐로 그린 물감이 해금됩니다.' },
        celadonBlue: { name: '청자색 물감', icon: '🧊', color: '#6C92AF', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '회청빛 도는 슬레이트 블루 계열 물감입니다.', shortDescription: '청자색 해금', longDescription: '차분한 슬레이트 블루 계열의 청자색 물감이 해금됩니다.' },
        vermilionDeep: { name: '버밀리온 딥 물감', icon: '🔥', color: '#C63C26', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '불타는 주홍빛의 딥 오렌지 물감입니다.', shortDescription: '버밀리온 딥 해금', longDescription: '강렬한 주홍빛 버밀리온 딥 물감이 해금됩니다.' },
        pearlIridescent: { name: '펄 이리디슨트 물감', icon: '✨', color: '#F8F1E9', reqLevel: 6, cost: 200, special: true, requiresPalette: 'artisanPaletteSet',
                  description: '진주광택이 도는 메탈릭 물감입니다.', shortDescription: '펄 메탈릭 해금', longDescription: '빛에 따라 반짝이는 펄·이리디슨트 물감이 해금됩니다.' }
    },

    tools: {
        magicHourglass: {
            id: 'magicHourglass',
            name: '마법의 모래시계',
            icon: '⏳',
            image: 'assets/images/shop/magicHourglass.png',
            description: "그림을 그리는 동안 시간을 되돌릴 수 있는 신비한 모래시계입니다. '되돌리기' 기능을 영구적으로 해금합니다.",
            shortDescription: "'되돌리기' 기능 해금",
            longDescription: "그림 그리기 중 실수를 만회할 수 있는 '되돌리기' 기능을 영구적으로 해금합니다.",
            reqLevel: 3,
            cost: 300
        },
        paintBucket: {
            id: 'paintBucket',
            name: '페인트통',
            icon: '🪣',
            image: 'assets/images/shop/paintBucket.png',
            description: "클릭 한 번으로 특정 영역을 원하는 색으로 채울 수 있는 '채우기' 기능을 영구적으로 해금합니다.",
            shortDescription: "'채우기' 기능 해금",
            longDescription: "클릭 한 번으로 특정 영역을 원하는 색으로 채울 수 있는 '채우기' 기능을 영구적으로 해금합니다.",
            reqLevel: 4,
            cost: 400
        },
        beginnerBrushSet: {
            id: 'beginnerBrushSet',
            name: '초보자 붓 세트',
            icon: '🖌️',
            image: 'assets/images/shop/beginnerBrushSet.png',
            description: '얇은 붓과 두꺼운 붓을 해금합니다. (중간 붓은 기본 제공)',
            shortDescription: '얇은/두꺼운 붓 해금',
            longDescription: '구매 시 붓 크기 선택에서 얇은(4px), 중간(8px), 두꺼운(12px) 선택이 가능해집니다.',
            reqLevel: 2,
            cost: 100
        },
        precisionBrushDial: {
            id: 'precisionBrushDial',
            name: '정밀 브러시 조절기',
            icon: '🎚️',
            image: 'assets/images/shop/precisionBrushDial.png',
            description: '붓 굵기를 슬라이더로 자유롭게 조절할 수 있는 도구입니다.',
            shortDescription: '붓 슬라이더 해금',
            longDescription: '구매 시 붓 패널에 슬라이더가 추가되어 2~30px 범위에서 자유롭게 굵기를 조절할 수 있습니다.',
            reqLevel: 3,
            cost: 400,
            requiresTool: 'beginnerBrushSet'
        },
        spectralTintMixer: {
            id: 'spectralTintMixer',
            name: '물감 희석제',
            icon: '🧪',
            image: 'assets/images/shop/spectralTintMixer.png',
            description: '물감의 투명도를 자유롭게 조절할 수 있는 장치입니다.',
            shortDescription: '투명도 슬라이더 해금',
            longDescription: '구매 시 색상 패널에 투명도 슬라이더가 추가되어 10%~100% 범위에서 투명도를 조절하고 옆에서 즉시 미리볼 수 있습니다.',
            reqLevel: 4,
            cost: 500
        }
    },

    consumables: {
        goldenBrush: {
            name: '황금 팔토시',
            icon: '🖌️💰',
            image: 'assets/images/shop/goldenBrush.png',
            description: '사용 후 다음 손님 3명에게서 획득하는 골드가 2배가 됩니다. (1회용)',
            shortDescription: '다음 3명 골드 2배 (1회용)',
            longDescription: '사용 시 다음 손님 3명에게서 획득하는 골드가 2배가 됩니다. (1회용)',
            cost: 10,
            dailyLimit: 1,
            effectUses: 3
        },
        masterCanvas: {
            name: '장인의 캔버스',
            icon: '🎨✨',
            image: 'assets/images/shop/masterCanvas.png',
            description: '사용 후 다음 손님 2명에게서 획득하는 명성이 1.5배가 됩니다. (1회용)',
            shortDescription: '다음 2명 명성 1.5배 (1회용)',
            longDescription: '사용 시 다음 손님 2명에게서 획득하는 명성이 1.5배가 됩니다. (1회용)',
            cost: 10,
            dailyLimit: 1,
            effectUses: 2
        },
        mysticalStopwatch: {
            name: '신비의 스톱워치',
            icon: '⏱️✨',
            image: 'assets/images/shop/mysticalStopwatch.png',
            description: '사용 후 다음 손님 1명에게는 남은 시간이 10초로 고정되어 줄어들지 않습니다. (1회용)',
            shortDescription: '다음 1명 타이머 10초 고정',
            longDescription: '사용 시 다음 손님 1명에게는 남은 시간이 10초로 고정되어 줄어들지 않고, 10초 상태로 여유롭게 그림을 그릴 수 있습니다. (1회용)',
            cost: 10,
            dailyLimit: 1,
            effectUses: 1
        }
    }
};

const rewardConfig = {
    baseRewards: {
        gold: 50,
        rep: 10,
        xp: 20
    },
    scoreMultipliers: { // 만족도별 기본 보상 배율
        reaction_perfect: { gold: 1.5, xp: 1.5 },
        reaction_good:    { gold: 1.0, xp: 1.0 },
        reaction_normal:  { gold: 0.8, xp: 0.8 },
        reaction_bad:     { gold: 0.4, xp: 0.4 },
        reaction_terrible:{ gold: 0.2, xp: 0.2 }
    },
    reputationFlowMultipliers: { // 만족도별 명성 변화 배수
        reaction_perfect: 1.5,   // 매우 만족: 많이 증가
        reaction_good: 1.0,      // 만족: 증가
        reaction_normal: 0.3,    // 보통: 소폭 증가
        reaction_bad: -0.2,      // 불만족: 소폭 감소
        reaction_terrible: -0.5  // 매우 불만족: 대폭 감소
    },
    difficultyWeights: {
        1: 0.85,
        2: 1.0,
        3: 1.2,
        4: 1.35,
        5: 1.5
    }
};

const drawConfig = {
    colors: ['#000000', '#ff0000', '#0057ff', '#00a86b', '#ffd166', '#ffffff'],
    brushSizes: [8], // 초기에는 중간 크기 하나만 노출
    useSlider: false, // 강화로 true 전환
    useAlphaSlider: false, // 색상 투명도 슬라이더
    eraserSizes: [24, 16, 8] /* 굵은 순서로 변경 */
};

const questData = [
    {
        id: 'theo_quest_01',
        requestId: 'theo_req_tomato',
        npcId: 'theo', // 의뢰 NPC
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '첫 수확 토마토',
        theme: '탐스럽게 잘 익은 토마토',
        detail: '안녕하세요, 작가님! 올해 첫 수확한 토마토를 보여드리고 싶어서 편지를 씁니다. 정성껏 키운 이 토마토가 정말 탐스럽게 잘 익었거든요! 햇살을 가득 머금은 이 붉은 빛깔과 싱그러운 생명력을 작가님의 손길로 그림에 담아주실 수 있을까요? 이 소중한 첫 수확의 기쁨을 오래도록 간직하고 싶습니다.',
        reqLevel: 1,
        difficulty: 1,
        rewards: {
            goldMin: 60, goldMax: 120,
            fameMin: 7, fameMax: 12,
            xp: 25
        },
        prerequisites: [],
        unlocks: []
    },
    // ===== 스토리 2: 특종! 불씨 전쟁 =====
    {
        id: 'PRESS_STORY_01',
        requestId: 'PRESS_STORY_01',
        questType: 'solve',
        story: true,
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '내 친구, 밥을 구해줘!',
        theme: "불타는 내 친구 '밥'을 구할 기발한 방법",
        detail: "문제 해결: 불길 속 허수아비 '밥'을 안전하게 구출하는 현실적이고 창의적인 계획을 설계해 주세요.",
        reqLevel: 3,
        difficulty: 3,
        rewards: { goldMin: 400, goldMax: 400, fameMin: 30, fameMax: 45, xp: 90 },
        prerequisites: ['LEO_STORY_04'],
        unlocks: ['PRESS_STORY_02']
    },
    {
        id: 'PRESS_STORY_02',
        requestId: 'PRESS_STORY_02',
        questType: 'draw',
        story: true,
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '독자의 상상력을 자극하라!',
        theme: "미스터리한 대장간의 밤",
        detail: "그림 의뢰(미적): 독자가 '브룩이 범인일까?'를 추리하게 만드는, 미스터리 무드의 밤 대장간 장면.",
        reqLevel: 3,
        difficulty: 3,
        rewards: { goldMin: 450, goldMax: 450, fameMin: 32, fameMax: 48, xp: 95 },
        prerequisites: ['PRESS_STORY_01'],
        unlocks: ['PRESS_STORY_03']
    },
    {
        id: 'PRESS_STORY_03',
        requestId: 'PRESS_STORY_03',
        questType: 'draw',
        story: true,
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '이것이 장인의 혼이다!',
        theme: "불로 새로운 것을 창조하는 그림을 그려주시게.",
        detail: "그림 의뢰(미적): 파괴가 아닌 창조로서의 불. 망치, 불꽃, 강철이 만들어내는 '창조의 열기'를 표현.",
        reqLevel: 3,
        difficulty: 3,
        rewards: { goldMin: 500, goldMax: 500, fameMin: 36, fameMax: 52, xp: 100 },
        prerequisites: ['PRESS_STORY_02'],
        unlocks: ['PRESS_STORY_04']
    },
    {
        id: 'PRESS_STORY_04',
        requestId: 'PRESS_STORY_04',
        questType: 'draw',
        story: true,
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '절망 속 희망 한 줄기',
        theme: "절망 속에서도 발견되는 한 줌의 희망",
        detail: "그림 의뢰(미적): 피해자의 고통과 그 속에서 피어나는 희망의 순간을 시처럼 은유적으로 표현.",
        reqLevel: 3,
        difficulty: 3,
        rewards: { goldMin: 550, goldMax: 550, fameMin: 40, fameMax: 60, xp: 110 },
        prerequisites: ['PRESS_STORY_03'],
        unlocks: ['PRESS_STORY_05']
    },
    {
        id: 'PRESS_STORY_05',
        requestId: 'PRESS_STORY_05',
        questType: 'solve',
        story: true,
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '완벽한 알리바이',
        theme: "알리바이: 화재 시각에 난 뭘 하고 있었을까",
        detail: "문제 해결: 시간/장소/증거가 명확한 알리바이를 설계. 목격자/영수증/기록 등 증빙 포함.",
        reqLevel: 3,
        difficulty: 4,
        rewards: { goldMin: 600, goldMax: 600, fameMin: 45, fameMax: 65, xp: 120 },
        prerequisites: ['PRESS_STORY_04'],
        unlocks: ['PRESS_STORY_06']
    },
    {
        id: 'PRESS_STORY_06',
        requestId: 'PRESS_STORY_06',
        questType: 'draw',
        story: true,
        npcId: 'thomas',
        npcName: '토마스',
        npcPortrait: 'assets/images/npcs/thomas_portrait.png',
        title: "두 사람의 '공통된 추억'",
        theme: "마을의 비밀 아지트",
        detail: "그림 의뢰(미적): 테오와 브룩이 어릴 적 함께 놀던 '비밀 아지트'를 따뜻한 감성으로 재현.",
        reqLevel: 3,
        difficulty: 3,
        rewards: { goldMin: 650, goldMax: 650, fameMin: 48, fameMax: 68, xp: 125 },
        prerequisites: ['PRESS_STORY_05'],
        unlocks: ['PRESS_STORY_07']
    },
    {
        id: 'PRESS_STORY_07',
        requestId: 'PRESS_STORY_07',
        questType: 'solve',
        story: true,
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '화해의 대작전!',
        theme: "두 사람이 화해하지 않고는 못 배길 이벤트 ",
        detail: "문제 해결: 두 사람이 화해하지 않고는 못 배길 이벤트 기획. 장소/연출/상징/참여자/취재까지 설계.",
        reqLevel: 3,
        difficulty: 4,
        rewards: { goldMin: 800, goldMax: 800, fameMin: 60, fameMax: 80, xp: 150 },
        prerequisites: ['PRESS_STORY_06'],
        unlocks: []
    },
    // ===== 스토리 3: 진짜 파이 도둑을 찾아라! =====
    {
        id: 'PIE_STORY_01',
        requestId: 'PIE_STORY_01',
        questType: 'solve',
        story: true,
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '최고의 장난',
        theme: '사람들을 가장 무섭게 놀릴 수 있는 장소와 방법',
        detail: "문제 해결: 사람들을 깜짝 놀라게 할 수 있는 장소와 연출을 설계해 주세요. 안전과 현실성도 함께 고려해야 합니다.",
        reqLevel: 4,
        difficulty: 3,
        rewards: { goldMin: 280, goldMax: 320, fameMin: 20, fameMax: 32, xp: 70 },
        prerequisites: ['PRESS_STORY_07'],
        unlocks: ['PIE_STORY_02']
    },
    {
        id: 'PIE_STORY_02',
        requestId: 'PIE_STORY_02',
        questType: 'solve',
        story: true,
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '빵집의 미스터리',
        theme: '빵집의 보안을 강화할 방법',
        detail: "문제 해결: 밤마다 파이가 사라지는 빵집을 지킬 수 있는 보안 계획을 설계해 주세요. 손님들의 편의와 분위기도 해치지 않아야 합니다.",
        reqLevel: 4,
        difficulty: 3,
        rewards: { goldMin: 320, goldMax: 360, fameMin: 22, fameMax: 34, xp: 75 },
        prerequisites: ['PIE_STORY_01'],
        unlocks: ['PIE_STORY_03']
    },
    {
        id: 'PIE_STORY_03',
        requestId: 'PIE_STORY_03',
        questType: 'draw',
        story: true,
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '결백의 증명(?)',
        theme: '세상에서 가장 무서운 그림',
        detail: "그림 의뢰(미적): 누구나 보고 비명을 지를 만큼 무섭지만, 장난으로 받아들일 수 있는 선을 지키는 공포 연출을 표현해 주세요.",
        reqLevel: 4,
        difficulty: 3,
        rewards: { goldMin: 340, goldMax: 380, fameMin: 24, fameMax: 36, xp: 80 },
        prerequisites: ['PIE_STORY_02'],
        unlocks: ['PIE_STORY_04']
    },
    {
        id: 'PIE_STORY_04',
        requestId: 'PIE_STORY_04',
        questType: 'draw',
        story: true,
        npcId: 'clara',
        npcName: '클라라',
        npcPortrait: 'assets/images/npcs/Clara_portrait.png',
        title: '과잉 방어',
        theme: '범인을 잡기 위한 최첨단 덫 설계도',
        detail: "그림 의뢰(미적): 기발하지만 다치지 않게 범인을 붙잡을 수 있는 기계식 덫 설계도를 그려 주세요.",
        reqLevel: 4,
        difficulty: 3,
        rewards: { goldMin: 360, goldMax: 420, fameMin: 26, fameMax: 38, xp: 90 },
        prerequisites: ['PIE_STORY_03'],
        unlocks: ['PIE_STORY_05']
    },
    {
        id: 'PIE_STORY_05',
        requestId: 'PIE_STORY_05',
        questType: 'draw',
        story: true,
        npcId: 'pochi',
        npcName: '포치',
        npcPortrait: 'assets/images/npcs/pochi_portrait.png',
        title: '그리운 파이의 맛',
        theme: '세상에서 가장 맛있는 파이',
        detail: "그림 의뢰(미적): 포치를 위로할 수 있는, 갓 구운 파이의 맛과 향이 살아 있는 그림을 그려 주세요.",
        reqLevel: 4,
        difficulty: 2,
        rewards: { goldMin: 340, goldMax: 380, fameMin: 24, fameMax: 34, xp: 80 },
        prerequisites: ['PIE_STORY_04'],
        unlocks: ['PIE_STORY_06']
    },
    {
        id: 'PIE_STORY_06',
        requestId: 'PIE_STORY_06',
        questType: 'solve',
        story: true,
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '최후의 수단',
        theme: "파이를 훔쳐간 진짜 범인의 몽타주",
        detail: "문제 해결: 지금까지의 단서를 바탕으로, 파이를 훔쳐간 진짜 범인의 몽타주를 설계해 주세요.",
        reqLevel: 4,
        difficulty: 4,
        rewards: { goldMin: 420, goldMax: 480, fameMin: 28, fameMax: 40, xp: 100 },
        prerequisites: ['PIE_STORY_05'],
        unlocks: []
    },
    {
        id: 'clara_req_future_vehicle',
        requestId: 'clara_req_future_vehicle',
        npcId: 'clara',
        npcName: '클라라',
        npcPortrait: 'assets/images/npcs/Clara_portrait.png',
        title: '꿈의 이동수단',
        theme: '세상에 없던 미래 이동수단',
        detail: '안녕하세요, 작가님! 클라라입니다. 요즘 이동수단에 대한 연구를 하다가 문득 상상의 나래를 펼쳐보고 싶어졌어요. 하늘을 자유롭게 날아다니고, 깊은 바다 속을 탐험하며, 심지어 땅속 깊은 곳까지 파고들 수 있는 꿈같은 이동수단을 그려주실 수 있을까요? 기발한 연료 방식이나 공상과학적인 궤도, 무지개 레일 같은 환상적인 연출까지 더해주신다면 정말 감사하겠습니다. 작가님의 상상력으로 미래의 교통수단이 어떤 모습일지 보여주세요!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 360, goldMax: 420,
            fameMin: 28, fameMax: 40,
            xp: 90
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'clara_req_gearbot',
        requestId: 'clara_req_gearbot',
        npcId: 'clara',
        npcName: '클라라',
        npcPortrait: 'assets/images/npcs/Clara_portrait.png',
        title: "'로봇 조수'",
        theme: '귀엽고 믿음직스러운 로봇 조수',
        detail: "안녕하세요, 작가님! 클라라입니다. 요즘 연구소에 아이들이 견학을 오는데, 복잡한 실험 장비들을 보고 과학이 어렵다고 생각하는 것 같아요. 그래서 아이들이 과학을 친근하게 느낄 수 있도록 도와줄 '로봇 조수'를 만들고 싶어졌어요! 동그란 눈에 따뜻한 미소를 짓고 있고, 실험을 도와주는 여러 개의 팔과 시약병이나 도구들을 깔끔하게 정리할 수 있는 수납 공간이 있으면 좋겠어요. 아이들이 보자마자 '우와, 귀여워!'라고 말할 만큼 사랑스러우면서도, 믿음직스럽게 실험을 도와줄 수 있는 모습으로 그려주실 수 있을까요?",
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 320, goldMax: 380,
            fameMin: 24, fameMax: 34,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'solve_clara_emergency_power',
        requestId: 'solve_clara_emergency_power',
        questType: 'solve',
        npcId: 'clara',
        npcName: '클라라',
        npcPortrait: 'assets/images/npcs/Clara_portrait.png',
        title: '비상 전력 실험',
        theme: '주변 물건으로 전기를 만들어내는 방법',
        detail: '안녕하세요, 작가님! 클라라입니다. 어제 밤 갑작스러운 정전으로 연구소 전체가 암흑천지가 되었어요. 중요한 실험이 진행 중이었는데 전력이 끊어져서 정말 당황스러웠답니다. 혹시 이런 비상상황에서 주변에 있는 일상적인 도구나 재료들만으로도 전기를 만들어낼 수 있는 창의적인 방법이 있을까요? 레몬이나 감자 같은 것들, 또는 연구소에 흔히 있는 금속 도구들을 활용해서 말이에요. 앞으로 이런 일이 또 생겼을 때를 대비해서 비상 발전 시스템을 설계해주시면 정말 감사하겠어요!',
        reqLevel: 1,
        difficulty: 3,
        rewards: { goldMin: 360, goldMax: 420, fameMin: 26, fameMax: 38, xp: 90 },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'solve_clara_overdrive_cleaner',
        requestId: 'solve_clara_overdrive_cleaner',
        questType: 'solve',
        npcId: 'clara',
        npcName: '클라라',
        npcPortrait: 'assets/images/npcs/Clara_portrait.png',
        title: '폭주하는 자동 청소기',
        theme: '폭주 로봇을 안전하게 멈추는 방법',
        detail: "안녕하세요, 작가님! 클라라입니다. 오늘 연구소에서 정말 당황스러운 일이 일어났어요! 새로 도입한 자동 청소 로봇이 갑자기 폭주를 시작했거든요. 흡입력이 최대로 올라간 채 멈추지 않고 연구소 곳곳을 돌아다니며 중요한 연구 자료들까지 빨아들이려고 해요. 제가 직접 전원을 끄려고 했지만 로봇이 너무 빨라서 잡을 수가 없고, 강제로 멈추면 로봇이 고장날까 봐 걱정이에요. 연구 자료들을 안전하게 지키면서도 로봇을 손상시키지 않고 정지시킬 수 있는 기발하고 창의적인 방법이 있을까요? 작가님의 지혜가 절실히 필요해요!",
        reqLevel: 1,
        difficulty: 3,
        rewards: { goldMin: 380, goldMax: 440, fameMin: 28, fameMax: 40, xp: 95 },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_02',
        requestId: 'theo_req_scarecrow',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '밭의 새로운 친구',
        theme: '위풍당당하고 멋진 허수아비',
        detail: '안녕하세요, 작가님! 테오입니다. 요즘 새들이 자꾸 제 소중한 옥수수밭을 습격해서 정말 골치가 아파요. 아침마다 나가보면 옥수수 알갱이들이 여기저기 쪼아져 있어서 마음이 아프답니다. 새들도 먹고 살아야 하는 건 알지만, 1년 동안 정성껏 키운 작물들이니까요. 그래서 새들이 보고 깜짝 놀랄 만큼 위풍당당하고 멋진 허수아비를 만들어주실 수 있을까요? 새들을 무섭게 하면서도 밭을 지켜줄 든든한 친구가 되어줄 그런 허수아비 말이에요!',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 90, goldMax: 160,
            fameMin: 9, fameMax: 16,
            xp: 40
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_03',
        requestId: 'theo_req_orchard',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '풍요로운 과수원',
        theme: '과일이 주렁주렁 열린 풍요로운 과수원',
        detail: '안녕하세요, 작가님! 테오입니다. 올해 농사가 잘 되어서 내년에는 더 큰 꿈을 꿔보려고 해요. 바로 새로운 과수원을 만드는 것입니다! 사과, 배, 복숭아, 자두까지... 온갖 과일나무들이 가지마다 탐스러운 열매를 주렁주렁 매달고 있는 그런 풍요로운 과수원 말이에요. 상상만 해도 가슴이 설레네요. 작가님께서 그려주신 그림을 보며 어떤 나무를 어디에 심을지, 어떻게 가꿔나갈지 계획을 세우고 싶어요. 풍성한 수확의 기쁨이 가득한 과수원의 모습을 그려주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 110, goldMax: 200,
            fameMin: 12, fameMax: 20,
            xp: 55
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_04',
        requestId: 'theo_req_rain_teacup',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '비 오는 날의 휴식',
        theme: '비 오는 창밖 풍경과 따뜻한 찻잔',
        detail: '안녕하세요, 작가님! 테오입니다. 오늘은 정말 오랜만에 비가 내리네요. 몇 달간 계속된 가뭄 때문에 걱정이 많았는데, 이렇게 촉촉한 빗소리를 들으니 마음이 한결 편안해집니다. 창가에 앉아 따뜻한 차 한 잔을 마시며 빗방울이 유리창을 타고 흘러내리는 모습을 바라보고 있으니, 이런 평온한 순간이야말로 진정한 행복이 아닐까 싶어요. 작가님께서도 이런 고요하고 따뜻한 순간의 아름다움을 그림으로 담아주실 수 있을까요? 비 오는 창밖 풍경과 김이 모락모락 나는 찻잔이 있는 그런 평화로운 장면 말이에요.',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 100, goldMax: 180,
            fameMin: 10, fameMax: 18,
            xp: 50
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_05',
        requestId: 'theo_req_sprout',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '어린잎의 싱그러움',
        theme: '싱그러운 어린잎',
        detail: '안녕하세요, 작가님! 요즘 밭에서 새싹들이 하나둘 돋아나기 시작했어요. 매일 아침 물을 주러 나가면서 이 작은 생명들이 흙을 뚫고 나오는 모습을 보고 있으면 정말 신기하고 감동적이에요. 촉촉한 흙 사이로 고개를 내미는 여린 잎사귀들의 싱그러운 생기를 작가님의 붓으로 담아주실 수 있을까요? 이 소중한 생명의 시작을 그림으로 간직하고 싶습니다.',
        reqLevel: 1,
        difficulty: 1,
        rewards: {
            goldMin: 120, goldMax: 190,
            fameMin: 8, fameMax: 14,
            xp: 40
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_06',
        requestId: 'theo_req_legend_seed',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '황금 씨앗의 전설',
        theme: '황금 씨앗에서 하늘까지 솟는 콩나무가 자라나는 모습',
        detail: '안녕하세요, 작가님! 오늘은 특별한 부탁이 있어서 편지를 씁니다. 우리 집에는 조상 대대로 내려오는 황금 씨앗에 대한 전설이 있어요. 그 씨앗을 심으면 하늘까지 뻗어 오르는 거대한 콩나무가 자라난다는 이야기죠. 아이들에게 이 아름다운 전설을 들려주고 싶은데, 그림이 있다면 훨씬 생생하게 전할 수 있을 것 같아요. 작은 황금 씨앗에서 시작해서 구름을 뚫고 하늘까지 솟아오르는 웅장한 콩나무의 모습을 작가님의 상상력으로 그려주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 170, goldMax: 240,
            fameMin: 12, fameMax: 20,
            xp: 55
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_quest_07',
        requestId: 'theo_req_future_farm',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '미래의 농장',
        theme: '최첨단 기술로 농사짓는 100년 뒤 미래 농장의 모습',
        detail: '안녕하세요, 작가님! 오늘은 조금 특별한 부탁이 있어서 편지를 씁니다. 요즘 밤마다 하늘의 별들을 바라보며 100년 후 우리 농장은 어떤 모습일까 상상해보곤 해요. 아마도 하늘을 나는 드론들이 작물들을 돌보고, 자동화된 장비들이 씨앗을 심고 물을 주겠죠? 하지만 그런 미래에도 여전히 푸른 잎사귀들이 바람에 흔들리고, 따뜻한 햇살이 대지를 비추는 아름다운 풍경이 펼쳐질 거라고 믿어요. 기술과 자연이 서로 도우며 조화롭게 어우러진 그런 희망찬 미래 농장의 모습을 작가님의 상상력으로 그려주실 수 있을까요? 아이들에게도 보여주고 싶은 꿈같은 풍경이에요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 200, goldMax: 280,
            fameMin: 14, fameMax: 24,
            xp: 60
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_solve_01',
        requestId: 'solve_theo_mole_plan',
        questType: 'solve',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '두더지 소탕 작전',
        theme: '두더지를 다치게 하지 않고 밭에서 멀리 보내는 평화로운 방법',
        detail: '안녕하세요, 작가님! 요즘 밭에 두더지들이 자꾸 나타나서 고민이 많습니다. 하지만 이 작은 생명들을 다치게 하고 싶지는 않아요. 혹시 두더지들이 스스로 다른 곳으로 이사를 가고 싶어지도록 만드는 평화로운 방법이 있을까요? 울타리나 진동, 특별한 향기 같은 것들을 활용해서 말이에요. 작가님의 지혜로운 아이디어로 두더지들과 우리 모두가 행복해질 수 있는 해결책을 설계해주시면 정말 감사하겠습니다.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 220, goldMax: 300,
            fameMin: 16, fameMax: 24,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'theo_solve_02',
        requestId: 'solve_theo_jam_recipe',
        questType: 'solve',
        npcId: 'theo',
        npcName: '테오',
        npcPortrait: 'assets/images/npcs/theo_portrait.png',
        title: '최고의 잼 만들기',
        theme: '세상에서 가장 맛있는 딸기잼을 만드는 비법',
        detail: '안녕하세요, 작가님! 올해 정성껏 키운 딸기들이 정말 달콤하게 잘 익었어요. 이 소중한 딸기들로 온 마을 사람들이 행복해할 수 있는 특별한 잼을 만들어보고 싶습니다. 하지만 어떤 재료를 어떤 비율로 넣어야 할지, 어떻게 포장하면 더 오래 보관할 수 있을지 고민이 많아요. 혹시 작가님의 지혜로운 아이디어로 세상에서 가장 맛있고 사랑받는 딸기잼 레시피와 포장 방법을 설계해주실 수 있을까요? 이웃들과 나누는 기쁨을 상상하니 벌써 마음이 따뜻해집니다.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 220, goldMax: 300,
            fameMin: 16, fameMax: 24,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'leo_quest_01',
        requestId: 'leo_req_book_cover',
        questType: 'draw',
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '책의 얼굴',
        theme: "가장 아끼는 책 '별을 여행하는 소년'의 새로운 표지 디자인",
        detail: "안녕하세요, 작가님..! 어린 시절부터 제가 가장 아끼는 책이 있어요. '별을 여행하는 소년'이라는 책인데, 표지가 너무 낡아서 새로 단장해주고 싶어요. 별빛과 모험의 감성이 느껴지도록 섬세하게 그려주실 수 있을까요? 이 책은 제게 정말 소중한 의미가 있어서... 작가님의 손길로 다시 태어나면 정말 기쁠 것 같아요.",
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 220, goldMax: 310,
            fameMin: 15, fameMax: 24,
            xp: 60
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'leo_quest_02',
        requestId: 'leo_req_legend_illustration',
        questType: 'draw',
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '사라진 삽화',
        theme: "용과 기사가 싸우는 '사라진 전설의 삽화'",
        detail: '안녕하세요, 작가님..! 도서관에서 오래된 고문서를 정리하다가 발견한 게 있어요. 빛이 바래서 거의 사라진 삽화인데, 용과 기사가 싸우는 장면이었던 것 같아요. 혹시 작가님께서 이 사라진 전설의 장면을 되살려주실 수 있을까요? 용과 기사 사이의 장엄한 전투를 생생하게 표현해주시면... 정말 감사하겠어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 70
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'leo_solve_01',
        requestId: 'solve_leo_noise_block',
        questType: 'solve',
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '소음과의 전쟁',
        theme: '브룩의 망치 소리를 막아 도서관을 조용하게 만드는 기발한 방법',
        detail: '안녕하세요, 작가님..! 요즘 정말 고민이 많아요. 도서관 옆 대장간에서 브룩이 망치질을 하는 소리 때문에 아이들이 책을 읽지 못하고 있거든요. 하지만 브룩도 일을 해야 하니까... 서로를 방해하지 않는 평화로운 방법이 있을까요? 혹시 작가님께서 소음을 차단할 수 있는 기발한 장치를 설계해주실 수 있을까요? 모두가 행복해질 수 있는 해결책이면 좋겠어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 360,
            fameMin: 20, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'leo_solve_02',
        requestId: 'solve_leo_mobile_library',
        questType: 'solve',
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '움직이는 책',
        theme: '힘들지 않게 여러 책을 마을 곳곳으로 배달하는 이동 도서관 아이디어',
        detail: '안녕하세요, 작가님..! 마을에 거동이 불편하신 분들이 계셔서 책을 읽고 싶어도 도서관에 오기 어려워하세요. 그래서 제가 직접 책을 가져다드리고 싶은데... 여러 권을 한 번에 나르기가 쉽지 않더라고요. 혹시 작가님께서 즐겁고 안전하게 책을 실어 나를 수 있는 이동 도서관을 디자인해주실 수 있을까요? 이웃들이 기뻐하는 모습을 상상하니 벌써 설레어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 360,
            fameMin: 20, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'sophia_quest_01',
        requestId: 'sophia_req_season_bouquet',
        questType: 'draw',
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '계절의 꽃다발',
        theme: '가을의 정취를 담은 낙엽과 갈색 톤의 가을 꽃다발 디자인',
        detail: '안녕하세요, 작가님! 낙엽이 바스락거리는 이 계절이 되니 꽃집에도 가을 분위기를 담고 싶어져요. 손님들을 맞이할 새로운 꽃다발을 꾸미고 싶은데, 따뜻한 갈색과 황금빛 잎사귀가 조화롭게 어우러진 가을만의 특별한 꽃다발을 디자인해주실 수 있을까요? 가을 햇살처럼 포근한 느낌이 담겼으면 좋겠어요.',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 220, goldMax: 320,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'sophia_quest_02',
        requestId: 'sophia_req_mascot',
        questType: 'draw',
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '꽃집의 새 친구',
        theme: '꽃과 잘 어울리는 귀여운 꽃집 마스코트 캐릭터',
        detail: '안녕하세요, 작가님! 요즘 꽃집에 오시는 손님들께서 더 친근하게 느끼실 수 있도록 작은 마스코트 친구를 만들어보고 싶어요. 꽃다발 사이에서 손님들을 반갑게 맞이해줄 수 있는 그런 친구요. 꽃잎이나 화분, 나비 같은 요소들을 활용해서 부드럽고 사랑스러운 마스코트를 디자인해주실 수 있을까요? 보는 것만으로도 미소가 지어지는 그런 친구였으면 해요.',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 220, goldMax: 320,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'sophia_solve_01',
        requestId: 'solve_sophia_herb',
        questType: 'solve',
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '시들어가는 허브',
        theme: '시들어가는 로즈마리 화분을 다시 건강하게 만드는 방법',
        detail: '안녕하세요, 작가님! 정말 걱정이 되어서 연락드려요. 제가 아끼는 로즈마리 화분이 요즘 들어 축 늘어져서 건강하지 못한 것 같아요. 이 아이가 다시 생기를 되찾을 수 있도록 도와주실 수 있을까요? 물 주기나 통풍, 햇빛 같은 것들을 어떻게 조절해야 할지 구체적인 케어 방법을 알려주시면 정말 감사하겠어요. 이 작은 친구가 다시 건강해졌으면 좋겠어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'sophia_solve_02',
        requestId: 'solve_sophia_bug',
        questType: 'solve',
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '곤충 퇴치 작전',
        theme: '약을 쓰지 않고 장미를 지켜내는 친환경 벌레 퇴치 방법',
        detail: '안녕하세요, 작가님! 요즘 제 소중한 장미밭에 작은 벌레들이 자꾸 찾아와서 고민이에요. 하지만 화학 약품은 사용하고 싶지 않거든요. 손님들도 안심하고 꽃을 보실 수 있도록 말이에요. 혹시 허브나 향초, 또는 특별한 장치 같은 것으로 자연스럽게 벌레들을 물리칠 수 있는 친환경적인 방법이 있을까요? 장미들과 손님들 모두를 지킬 수 있는 좋은 아이디어를 부탁드려요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tinbo_quest_01',
        requestId: 'tinbo_req_avatar',
        questType: 'draw',
        npcId: 'tinbo',
        npcName: '틴보',
        npcPortrait: 'assets/images/npcs/tinbo_portrait.png',
        title: '나의 아바타',
        theme: '틴보의 정체성을 표현하는 나만의 아바타 디자인',
        detail: '작가님, 틴보다. 인간들과 소통할 때 사용할 전용 아이콘이 필요하다. 볼트, 기어, 계기판 같은 로봇다운 요소들로 틴보만의 개성을 시각화해달라. 틴보의 정체성이 잘 드러나는 디자인을 부탁한다.',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 320,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tinbo_quest_02',
        requestId: 'tinbo_req_dream_data',
        questType: 'draw',
        npcId: 'tinbo',
        npcName: '틴보',
        npcPortrait: 'assets/images/npcs/tinbo_portrait.png',
        title: '꿈의 데이터',
        theme: '인간이 꾸는 가장 환상적인 꿈의 모습',
        detail: '작가님께, 틴보다. "꿈"이라는 현상을 데이터로 분석하고 싶다. 인간들이 꾸는 가장 환상적인 꿈의 모습을 그려달라. 현실 법칙을 벗어난 신비로운 장면을 자유로운 구도로 표현해주면 된다. 틴보의 연구에 큰 도움이 될 것이다.',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 320,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tinbo_solve_01',
        requestId: 'solve_tinbo_sad_comfort',
        questType: 'solve',
        npcId: 'tinbo',
        npcName: '틴보',
        npcPortrait: 'assets/images/npcs/tinbo_portrait.png',
        title: '감정 표현법: 슬픔',
        theme: '슬픈 사람을 효율적으로 위로하는 방법',
        detail: '작가님, 틴보다. 눈물을 흘리는 친구를 어떻게 위로해야 하는지 알고 싶다. 공감, 행동, 말투 등 단계별 위로 프로세스를 그림으로 설명해달라. 틴보는 아직 감정 처리 알고리즘이 부족하다. 작가님의 도움이 필요하다.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 250, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tinbo_solve_02',
        requestId: 'solve_tinbo_new_friend',
        questType: 'solve',
        npcId: 'tinbo',
        npcName: '틴보',
        npcPortrait: 'assets/images/npcs/tinbo_portrait.png',
        title: '새로운 친구',
        theme: '새로운 고성능 로봇 친구의 설계도',
        detail: '작가님께, 틴보다. 함께 연구할 로봇 동료가 필요하다. 다정한 성격과 협업 기능을 겸비한 설계를 제안해달라. 틴보 혼자서는 한계가 있다. 좋은 파트너가 있다면 더 많은 것을 배울 수 있을 것이다.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 360,
            fameMin: 20, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'brook_quest_01',
        requestId: 'brook_req_sign',
        questType: 'draw',
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '대장간의 간판',
        theme: '친근하고 멋진 대장간 간판 디자인',
        detail: '작가님께. 브룩이오. 사람들이 날 험상궂다고 하는데, 그게 좀 억울하네만. 내 대장간 간판을 새로 만들어보려 하오. 불꽃과 망치가 들어가되 따뜻하고 친근해 보이는 간판을 그려주시오. 사람들이 무서워하지 않고 편하게 들어올 수 있도록 말이야.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 350,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'brook_quest_02',
        requestId: 'brook_req_legend_armor',
        questType: 'draw',
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '전설의 갑옷',
        theme: '전설 속 용비늘 갑옷의 상상도',
        detail: '작가님께. 브룩이오. 언젠가는 꼭 만들어보고 싶은 게 있네만, 바로 용비늘 갑옷이오. 전설에서만 들어본 그 갑옷을 먼저 그림으로라도 보고 싶소. 겹겹이 빛나는 비늘과 위압감 있는 실루엣을 제대로 표현해주시오. 그럼 언젠가 실제로 만들 때 참고가 될 테니까.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 270, goldMax: 360,
            fameMin: 18, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'brook_solve_01',
        requestId: 'solve_brook_relic_identity',
        questType: 'solve',
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '고대 유물의 정체',
        theme: '고대 왕국의 녹슨 유물의 원래 모습과 용도 추리',
        detail: '작가님께. 브룩이오. 박물관에서 이상한 녹슨 막대기를 하나 가져왔는데, 이게 뭔지 모르겠소. 고대 왕국 유물이라고 하는데 말이야. 손잡이 부분이며 장식, 사용법까지 추리해서 원래 모습을 설계도로 복원해주시오. 장인의 눈으로 봐도 이건 범상치 않은 물건이네만.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 280, goldMax: 370,
            fameMin: 20, fameMax: 30,
            xp: 85
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'brook_solve_02',
        requestId: 'solve_brook_fire_restart',
        questType: 'solve',
        npcId: 'brook',
        npcName: '브룩',
        npcPortrait: 'assets/images/npcs/Brook_portrait.png',
        title: '불씨 살리기',
        theme: '주변 도구만으로 꺼져가는 불씨를 되살리는 방법',
        detail: '작가님께. 브룩이오. 어젯밤 비 때문에 화로가 거의 꺼져가고 있소. 대장간에서 불이 꺼지면 일을 못 하니까 큰일이네만. 주변에 있는 재료만으로 안전하게 불을 되살리는 방법을 단계별로 알려주시오. 급한 일이니 현실적이고 확실한 방법으로 부탁하오.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 280, goldMax: 370,
            fameMin: 20, fameMax: 30,
            xp: 85
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tom_quest_01',
        requestId: 'tom_req_profile',
        questType: 'draw',
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '내 프로필 사진',
        theme: '열정 넘치는 특종 기자 캐리커처',
        detail: '작가님께! 톰입니다. 명함에 넣을 임팩트 있는 캐리커처가 필요해서 연락드렸어요. 펜, 카메라, 속보 헤드라인 등을 활용해서 불꽃 같은 기자의 모습을 표현해주실 수 있을까요? 진실을 쫓는 열정이 느껴지는 그런 그림이면 좋겠습니다!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 360,
            fameMin: 20, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tom_quest_02',
        requestId: 'tom_req_logo',
        questType: 'draw',
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '신문사 로고 디자인',
        theme: '희망찬 현대적 신문사 로고',
        detail: '작가님께! 크로노스 일보 창간 100주년을 기념해서 새 로고를 만들려고 합니다. 새벽빛, 깃펜, 활자 같은 요소들을 이용해서 새 출발의 상징을 그려주실 수 있을까요? 100년의 전통과 미래를 향한 희망이 함께 담긴 로고였으면 좋겠어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 260, goldMax: 360,
            fameMin: 20, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tom_solve_01',
        requestId: 'solve_tom_infiltration',
        questType: 'solve',
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '잠입 취재',
        theme: '경계가 삼엄한 비밀 모임에 잠입하는 방법',
        detail: '작가님께! 미스터 모노클의 비밀 모임을 파헤치고 싶은데, 경계가 너무 삼엄해서 고민입니다. 변장, 필요한 장비, 안전한 탈출 루트까지 포함된 은밀한 잠입 플랜을 설계해주실 수 있을까요? 진실을 밝혀내기 위해서는 이 정도 위험은 감수해야겠어요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 270, goldMax: 370,
            fameMin: 20, fameMax: 32,
            xp: 85
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'tom_solve_02',
        requestId: 'solve_tom_lost_notebook',
        questType: 'solve',
        npcId: 'tom',
        npcName: '톰',
        npcPortrait: 'assets/images/npcs/tom_portrait.png',
        title: '잃어버린 수첩',
        theme: '특종 노트를 되찾는 수색 전략',
        detail: '작가님께! 큰일 났습니다. 광장 어딘가에서 제 특종 수첩이 사라졌어요. 그 안에는 몇 달간 모은 중요한 단서들이 다 들어있거든요. 탐지견, 포스터, 탐문 조사 등을 활용한 체계적인 수색 작전을 제안해주실 수 있을까요? 정말 절실합니다!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 270, goldMax: 370,
            fameMin: 20, fameMax: 32,
            xp: 85
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'emma_quest_01',
        requestId: 'emma_req_cloud_cake_poster',
        questType: 'draw',
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '신제품 포스터',
        theme: '구름 딸기 케이크를 가장 달콤하게 보이게 하는 포스터',
        detail: '작가님, 이번 딸기 축제를 맞아서 신제품을 준비했어요. 이름은 \'구름 딸기 케이크\'예요! 보기만 해도 달콤하고 폭신폭신해 보이는 케이크라서, 손님들도 한 번 보면 그냥 지나치지 못하게 만들고 싶어요. 세상에서 가장 달콤하고 푹신해 보이는 케이크 포스터를 그려주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'emma_quest_02',
        requestId: 'emma_req_bakery_uniform',
        questType: 'draw',
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '빵집 유니폼',
        theme: '따뜻한 분위기의 새 빵집 유니폼 디자인',
        detail: '저희 빵집에 새로운 아르바이트생이 들어왔어요! 가게 분위기도 새로 꾸미고 싶어서요. 빵 냄새랑 잘 어울리는, 따뜻하고 포근한 느낌의 유니폼을 입히고 싶거든요. 빵집의 따뜻한 분위기와 잘 어울리는 새로운 유니폼 디자인을 부탁드려도 될까요?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'emma_solve_01',
        requestId: 'solve_emma_cake_delivery',
        questType: 'solve',
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '케이크 배달 사고',
        theme: '찌그러진 3단 케이크를 감쪽같이 복구하는 방법',
        detail: '작가님, 큰일 났어요! 배달 중에 3단 케이크가 찌그러져버렸는데 손님이 곧 받으러 오신다고 하셔서 정말 당황스러워요. 크림 보수부터 데코 보완, 포장 연출까지 포함해서 손님이 전혀 눈치채지 못하게 복구할 수 있는 응급 플랜을 도와주실 수 있을까요? 정말 절실해요!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'emma_solve_02',
        requestId: 'solve_emma_festival_masterpiece',
        questType: 'solve',
        npcId: 'emma',
        npcName: '엠마',
        npcPortrait: 'assets/images/npcs/emma_portrait.png',
        title: '축제를 빛낼 걸작',
        theme: '빵 축제 심사위원을 놀라게 할 초대형 작품 설계',
        detail: '작가님, 이번 빵 축제에서 까다롭기로 유명한 미스터 모노클을 심사위원으로 모시게 되었어요. 그분을 깜짝 놀라게 할 만한 빵 예술 작품을 만들고 싶은데, 혼자서는 아이디어가 떠오르지 않아서요. 재료 구성부터 제작 순서, 연출 아이디어까지 모든 걸 담은 완벽한 걸작 플랜을 함께 만들어주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 250, goldMax: 360,
            fameMin: 18, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'serena_quest_01',
        requestId: 'serena_req_stage_dress',
        questType: 'draw',
        npcId: 'serena',
        npcName: '세레나',
        npcPortrait: 'assets/images/npcs/serena_portrait.png',
        title: '꿈의 무대 의상',
        theme: '밤하늘의 별처럼 빛나는 드레스',
        detail: '작가님, 드디어 복귀 무대가 다가왔어요… 관객들에게 희망을 전하고 싶은데, 제가 입을 드레스가 그 마음을 담아낼 수 있을까요? 밤하늘의 별처럼 반짝이는 실루엣으로, 보는 이들의 마음에도 작은 빛이 될 수 있는 그런 드레스를 디자인해주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'serena_quest_02',
        requestId: 'serena_req_album_cover',
        questType: 'draw',
        npcId: 'serena',
        npcName: '세레나',
        npcPortrait: 'assets/images/npcs/serena_portrait.png',
        title: '용기의 노래',
        theme: "'작은 별의 노래' 앨범 커버",
        detail: '작가님, 제 신곡 앨범 커버를 부탁드리고 싶어요… "작은 별의 노래"라는 제목처럼, 어둠 속에서도 빛나는 작은 별의 이야기를 담고 싶거든요. 불안을 이겨내려는 마음, 그리고 용기를 내려는 희망의 메시지가 전해질 수 있는 그런 커버를 그려주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'serena_solve_01',
        requestId: 'solve_serena_breathing',
        questType: 'solve',
        npcId: 'serena',
        npcName: '세레나',
        npcPortrait: 'assets/images/npcs/serena_portrait.png',
        title: '무대의 호흡법',
        theme: '무대 위 긴장을 줄이는 호흡 루틴',
        detail: '작가님… 리허설 때 숨이 너무 가빠졌어요. 불안하면 자꾸 숨이 가늘어지더라고요. 무대에서 호흡을 안정시켜주는 무언가가 필요해요. 공연 전후에 실천할 수 있는 단계별 호흡 루틴이나 마음을 다스리는 방법을 알려주실 수 있을까요? 관객들 앞에서 떨지 않고 노래할 수 있게 도와주세요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'serena_solve_02',
        requestId: 'solve_serena_studio',
        questType: 'solve',
        npcId: 'serena',
        npcName: '세레나',
        npcPortrait: 'assets/images/npcs/serena_portrait.png',
        title: '완벽한 연습실',
        theme: '소음을 차단하고 마음을 안정시키는 방음 연습실',
        detail: '작가님, 요즘 작은 소음에도 너무 예민해져서 연습에 집중하기가 어려워요… 바람 소리나 발자국 소리만 들려도 마음이 흔들리거든요. 방음은 물론이고 조명이나 향까지, 마음이 차분해질 수 있는 최적의 연습실을 설계해주실 수 있을까요? 그곳에서라면 안정된 마음으로 노래할 수 있을 것 같아요.',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'monocle_quest_01',
        requestId: 'monocle_req_serenity',
        questType: 'draw',
        npcId: 'monocle',
        npcName: '미스터 모노클',
        npcPortrait: 'assets/images/npcs/monocle_portrait.png',
        title: '감정의 형상화',
        theme: "'고요한 평화'를 시각화한 추상 회화",
        detail: '작가님께. 감정이라는 것은 참으로 추상적인 개념이지만, 진정한 예술가라면 이를 형태로 구현할 수 있어야 한다고 생각합니다. 이번에는 "고요한 평화"라는 감정을 시각화해 주시기 바랍니다. 화려한 기교나 복잡한 구성보다는, 평온함 그 자체가 어떻게 색과 형태로 전달될 수 있는지에 집중해 주십시오. 감정의 본질을 꿰뚫는 통찰력을 기대하겠습니다.',
        reqLevel: 1,
        difficulty: 5,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'monocle_quest_02',
        requestId: 'monocle_req_scream_hope',
        questType: 'draw',
        npcId: 'monocle',
        npcName: '미스터 모노클',
        npcPortrait: 'assets/images/npcs/monocle_portrait.png',
        title: '명작의 재해석',
        theme: "'절규'를 희망적으로 재해석한 삽화",
        detail: '작가님께. 뭉크의 "절규"는 인간 실존의 불안을 표현한 걸작이지만, 과연 절망만이 그 작품의 전부일까요? 이번 의뢰는 다소 도전적입니다. 원작의 구도와 상징성은 존중하되, 절망 대신 희망을 담아 재해석해 주시기 바랍니다. 색채와 표정, 배경의 변화를 통해 완전히 새로운 메시지를 전달할 수 있다면, 그것이야말로 진정한 예술적 해석이라 하겠습니다.',
        reqLevel: 1,
        difficulty: 4,
        rewards: {
            goldMin: 250, goldMax: 350,
            fameMin: 18, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'monocle_quest_03',
        requestId: 'monocle_req_clock_story',
        questType: 'draw',
        npcId: 'monocle',
        npcName: '미스터 모노클',
        npcPortrait: 'assets/images/npcs/monocle_portrait.png',
        title: '사물의 이면',
        theme: '낡은 괘종시계가 들려주는 시간의 흐름',
        detail: '작가님께. 사물에는 그것이 겪어온 시간의 흔적이 스며들어 있습니다. 이번에는 낡은 괘종시계 하나를 소재로, 그 안에 담긴 시간의 서사를 시각화해 주시기 바랍니다. 단순히 시계를 그리는 것이 아니라, 그것이 지켜본 계절의 변화, 세대의 교체, 혹은 잊혀진 추억들을 상상력으로 풀어내 주십시오. 사물의 이면을 읽어내는 안목을 보여주시길 기대합니다.',
        reqLevel: 1,
        difficulty: 5,
        rewards: {
            goldMin: 250, goldMax: 360,
            fameMin: 18, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'monocle_quest_04',
        requestId: 'monocle_req_proverb',
        questType: 'draw',
        npcId: 'monocle',
        npcName: '미스터 모노클',
        npcPortrait: 'assets/images/npcs/monocle_portrait.png',
        title: '속담의 시각화',
        theme: "'낮말은 새가 듣고 밤말은 쥐가 듣는다' 속담의 풍자화",
        detail: '작가님께. 속담이란 민중의 지혜가 압축된 문학이라 할 수 있습니다. "낮말은 새가 듣고 밤말은 쥐가 듣는다"는 말조심에 대한 교훈을 담고 있지요. 이를 한 장의 풍자화로 표현해 주시기 바랍니다. 새와 쥐라는 상징적 존재들, 그리고 은밀히 대화하는 인물들을 재치 있게 구성하여 속담의 의미를 직관적으로 전달해 주십시오. 교훈적이면서도 유머러스한 작품을 기대하겠습니다.',
        reqLevel: 1,
        difficulty: 5,
        rewards: {
            goldMin: 250, goldMax: 360,
            fameMin: 18, fameMax: 30,
            xp: 80
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'pochi_quest_01',
        requestId: 'pochi_req_ultimate_bowl',
        questType: 'draw',
        npcId: 'pochi',
        npcName: '포치',
        npcPortrait: 'assets/images/npcs/pochi_portrait.png',
        title: '궁극의 밥그릇',
        theme: '세상에서 가장 맛있어 보이는 강아지 밥그릇',
        detail: '요즘 제 밥그릇이 너무 평범해서 그런지 식욕이 없어요. 밥 먹는 시간이 매일 축제처럼 즐거웠으면 좋겠는데요. 향기와 장식이 살아 있어서 밥을 담아두기만 해도 기분이 좋아지는, 세상에서 가장 맛있어 보이는 밥그릇을 디자인해주실 수 있을까요? ',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 220, goldMax: 320,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'pochi_quest_02',
        requestId: 'pochi_req_sausage_trail',
        questType: 'draw',
        npcId: 'pochi',
        npcName: '포치',
        npcPortrait: 'assets/images/npcs/pochi_portrait.png',
        title: '꿈의 산책로',
        theme: '소시지와 치킨으로 꾸민 환상적인 산책 길',
        detail: '산책은 좋지만 맨날 같은 풀과 나무만 보니까 조금 지겨워요. 만약 소시지랑 치킨으로 만들어진 길이 있다면 얼마나 행복할까요? 소시지 울타리와 치킨 나무가 이어진 식도락 산책로를 그려주시면 안 될까요? 걷기만 해도 행복해지는, 놀이공원 같은 산책길이면 더욱 좋겠어요. ',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'pochi_solve_01',
        requestId: 'solve_pochi_high_snack',
        questType: 'solve',
        npcId: 'pochi',
        npcName: '포치',
        npcPortrait: 'assets/images/npcs/pochi_portrait.png',
        title: '닿을 수 없는 간식',
        theme: '식탁 위 간식을 안전하게 먹는 기발한 방법',
        detail: '큰일이에요! 간식을 식탁 위에 올려두고 주인님이 나가버렸어요! 냄새는 나는데 닿지를 않아요… 저녁까지 굶으면 어떡하죠? 제가 다치지 않고 간식에 도달할 수 있도록, 집 안에 있는 물건을 활용한 귀엽고 안전한 작전을 설계해주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'pochi_solve_02',
        requestId: 'solve_pochi_nap_spot',
        questType: 'solve',
        npcId: 'pochi',
        npcName: '포치',
        npcPortrait: 'assets/images/npcs/pochi_portrait.png',
        title: '최고의 낮잠 장소',
        theme: '햇살·포근함·간식 냄새가 완벽한 낮잠 명당',
        detail: '작가님! 밥 먹고 나니까 잠이 솔솔 오는데 딱딱한 바닥에서는 잠이 안 와요. 햇볕은 따뜻하고, 폭신폭신하고, 맛있는 냄새도 나는 그런 낮잠 장소가 있었으면 좋겠어요. 방해받지 않고 안심할 수 있는 세상에서 가장 완벽한 낮잠 명당을 찾아주실 수 있을까요?',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 240, goldMax: 340,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'finn_quest_01',
        requestId: 'finn_req_true_form',
        questType: 'draw',
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '나의 진짜 모습',
        theme: '핀의 멋진 생전 모습을 상상한 초상',
        detail: '헤헤, 작가! 나 맨날 하얀 천 뒤집어쓰고만 다니니까 지겹지? 내가 살아 있었다면 어떤 모습이었을까 상상해서 멋지게 그려줘. 장난기 넘치지만 살짝 쿨한 느낌이면 더 좋을지도?',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'finn_quest_02',
        requestId: 'finn_req_ghost_friends',
        questType: 'draw',
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '유령 친구들',
        theme: '다양하고 재미있는 유령 친구들의 모습',
        detail: '요즘 좀 심심하단 말이야. 세상 어딘가엔 나 말고도 별별 유령들이 있다던데, 그 친구들 모습을 상상해서 그려줄래? 흐물흐물한 애, 번쩍거리는 애… 보고만 있어도 웃음 나올 친구들이면 좋겠어!',
        reqLevel: 1,
        difficulty: 2,
        rewards: {
            goldMin: 230, goldMax: 330,
            fameMin: 16, fameMax: 26,
            xp: 65
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'finn_solve_01',
        requestId: 'solve_finn_monster_form',
        questType: 'solve',
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '궁극의 변신술',
        theme: '세상에서 가장 무섭고 강력한 몬스터 변신 아이디어',
        detail: '사람들이 이제 나를 보고도 안 놀란다니까! 모두가 벌벌 떨 정도로 무시무시한 변신 아이디어가 필요해. 몸통, 효과음, 등장 방식까지 확실한 계획을 알려줘. 그래야 다시 장난의 황제가 될 수 있단 말이야!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 250, goldMax: 350,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    {
        id: 'finn_solve_02',
        requestId: 'solve_finn_sunlight',
        questType: 'solve',
        npcId: 'finn',
        npcName: '핀',
        npcPortrait: 'assets/images/npcs/finn_portrait.png',
        title: '햇빛이 무서워',
        theme: '낮에도 햇빛을 피해 마을을 돌아다니는 방법',
        detail: '나는 햇빛만 보면 몸이 사라질 것 같아서 밤에만 놀 수 있어. 낮에도 마을을 슬쩍 돌아다닐 수 있는 기발한 방법이 없을까? 그림자 타고 다니기, 지하 통로, 특수 장비 같은 거 말이야! 확실한 플랜을 부탁해!',
        reqLevel: 1,
        difficulty: 3,
        rewards: {
            goldMin: 250, goldMax: 350,
            fameMin: 18, fameMax: 28,
            xp: 75
        },
        prerequisites: [],
        unlocks: []
    },
    // ===== 메인 스토리: 서투른 고백 대작전 (Story Flag) =====
    {
        id: 'LEO_STORY_01',
        requestId: 'LEO_STORY_01',
        questType: 'solve',
        story: true,
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
		title: '첫 마디의 무게',
		theme: '세상에서 가장 인상적인 첫인사 방법',
		detail: '문제 해결: 떨림 속에서도 진심이 자연스럽게 전달되도록, ‘첫인사’의 방식·상황 연출·표현을 설계해 주세요.',
        reqLevel: 2,
        difficulty: 2,
        rewards: { goldMin: 200, goldMax: 200, fameMin: 15, fameMax: 25, xp: 50 },
        prerequisites: [],
        unlocks: ['TINBO_STORY_01']
    },
    {
        id: 'TINBO_STORY_01',
        requestId: 'TINBO_STORY_01',
        questType: 'solve',
        story: true,
        npcId: 'tinbo',
        npcName: '틴보',
        npcPortrait: 'assets/images/npcs/tinbo_portrait.png',
        title: '감정 회로',
        theme: '사랑 감정을 이해하는 표현 설계',
        detail: '문제 해결: ‘사랑’ 감정을 사람들이 이해할 수 있도록 색/형/움직임 등 지표로 표현·설명하는 방법(도표/샘플)을 설계해 주세요.',
        reqLevel: 2,
        difficulty: 2,
        rewards: { goldMin: 250, goldMax: 250, fameMin: 18, fameMax: 28, xp: 60 },
        prerequisites: ['LEO_STORY_01'],
        unlocks: ['LEO_STORY_02']
    },
    {
        id: 'LEO_STORY_02',
        requestId: 'LEO_STORY_02',
        questType: 'draw',
        story: true,
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '잊지 못할 선물',
        theme: '잊지 못할 특별한 꽃다발',
        detail: '그림 의뢰(선물/감상): 시간이 지나도 의미가 유지되는 꽃다발 디자인을 원합니다. 드라이플라워/리본 등 조합 고려.',
        reqLevel: 2,
        difficulty: 2,
        rewards: { goldMin: 300, goldMax: 300, fameMin: 20, fameMax: 32, xp: 70 },
        prerequisites: ['TINBO_STORY_01'],
        unlocks: ['SOPHIA_STORY_01']
    },
    {
        id: 'SOPHIA_STORY_01',
        requestId: 'SOPHIA_STORY_01',
        questType: 'draw',
        story: true,
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '모험가의 마음',
        theme: '판타지 소설에 나올 법한 신비로운 그림',
        detail: '그림 의뢰(선물/감상): 판타지 소설 감성을 자극하는 신비로운 그림을 부탁드려요. 선물용 감상 작품입니다.',
        reqLevel: 2,
        difficulty: 3,
        rewards: { goldMin: 350, goldMax: 350, fameMin: 25, fameMax: 36, xp: 80 },
        prerequisites: ['LEO_STORY_02'],
        unlocks: ['LEO_STORY_03']
    },
    {
        id: 'LEO_STORY_03',
        requestId: 'LEO_STORY_03',
        questType: 'solve',
        story: true,
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '바다 건너 편지',
        theme: '편지를 바다 건너로 배달할 가장 확실한 방법',
        detail: '문제 해결: 바다 건너로 편지를 안전·확실하게 전달할 경로/매개체/표식을 설계해 주세요.',
        reqLevel: 2,
        difficulty: 3,
        rewards: { goldMin: 500, goldMax: 500, fameMin: 35, fameMax: 50, xp: 100 },
        prerequisites: ['SOPHIA_STORY_01'],
        unlocks: ['SOPHIA_STORY_02']
    },
    {
        id: 'SOPHIA_STORY_02',
        requestId: 'SOPHIA_STORY_02',
        questType: 'draw',
        story: true,
        npcId: 'sophia',
        npcName: '소피아',
        npcPortrait: 'assets/images/npcs/sophia_portrait.png',
        title: '귀국의 선물',
        theme: '진주를 활용한 예쁜 장식품',
        detail: '그림 의뢰(선물/감상): 진주를 활용한 소박하고 예쁜 장식품(예: 모빌) 디자인을 부탁드려요.',
        reqLevel: 2,
        difficulty: 3,
        rewards: { goldMin: 600, goldMax: 600, fameMin: 40, fameMax: 55, xp: 120 },
        prerequisites: ['LEO_STORY_03'],
        unlocks: ['LEO_STORY_04']
    },
    {
        id: 'LEO_STORY_04',
        requestId: 'LEO_STORY_04',
        questType: 'solve',
        story: true,
        npcId: 'leo',
        npcName: '레오',
        npcPortrait: 'assets/images/npcs/leo_portrait.png',
        title: '완벽한 고백 장소',
        theme: '세상에서 가장 로맨틱한 고백 장소',
        detail: '문제 해결: 부담 없이 진심을 전하기 좋은 장소/시간/동선·준비물을 포함한 ‘고백 시나리오’를 설계해 주세요. 우천/혼잡 대비 플랜 B 포함.',
        reqLevel: 2,
        difficulty: 4,
        rewards: { goldMin: 1000, goldMax: 1000, fameMin: 60, fameMax: 80, xp: 200 },
        prerequisites: ['SOPHIA_STORY_02'],
        unlocks: []
    }
];



// ===== 스토리 라인 구조화: 각 단계 사이 랜덤 방문 수(최소~최대) 지정 =====
const storylines = {
    leo: {
        id: 'leo_arc',
        steps: [
            { questId: 'LEO_STORY_01', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'TINBO_STORY_01', minRandomBetween: 0, maxRandomBetween: 0 },
            { questId: 'LEO_STORY_02', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'SOPHIA_STORY_01', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'LEO_STORY_03', minRandomBetween: 2, maxRandomBetween: 3 },
            { questId: 'SOPHIA_STORY_02', minRandomBetween: 2, maxRandomBetween: 3 },
            { questId: 'LEO_STORY_04', minRandomBetween: 1, maxRandomBetween: 2 }
        ],
        // 최종 단계 완료 후, 몇 명의 랜덤 손님 뒤에 에필로그 보상-only 방문 등장
        epilogue: {
            npcId: 'leo',
            visitId: 'LEO_ARC_EPILOGUE',
            afterMinRandom: 2,
            afterMaxRandom: 2
        }
    },
    press: {
        id: 'press_arc',
        steps: [
            { questId: 'PRESS_STORY_01', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_02', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_03', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_04', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_05', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_06', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PRESS_STORY_07', minRandomBetween: 1, maxRandomBetween: 2 }
        ],
        epilogue: {
            npcId: 'brook',
            visitId: 'PRESS_ARC_EPILOGUE',
            afterMinRandom: 1,
            afterMaxRandom: 2
        }
    },
    pie: {
        id: 'pie_arc',
        steps: [
            { questId: 'PIE_STORY_01', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PIE_STORY_02', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PIE_STORY_03', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PIE_STORY_04', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PIE_STORY_05', minRandomBetween: 1, maxRandomBetween: 2 },
            { questId: 'PIE_STORY_06', minRandomBetween: 1, maxRandomBetween: 2 }
        ],
        epilogue: {
            npcId: 'emma',
            visitId: 'PIE_ARC_EPILOGUE',
            afterMinRandom: 1,
            afterMaxRandom: 2
        }
    }
};
window.storylines = storylines;
