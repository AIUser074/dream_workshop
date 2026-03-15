// 의뢰별 평가 기준(rubrics)을 데이터로 정의합니다.
// 키는 requestId와 동일하게 맞춥니다.

const REQUEST_DATA = {
    // 테오 - 토마토
    "theo_req_tomato": {
        rubrics: [
            { id: 'isTomato',      prompt: "그림에 '토마토'가 포함되어 있는가? (true/false)",           weight: 19, isSubject: true, failMessage: "이게 토마토라고요? 전혀 토마토 같지 않은데요... 다시 한 번 확인해보세요.", successMessage: "딱 보기에 완벽한 토마토네요!" },
            { id: 'isRed',         prompt: "그림 속 '토마토'가 주로 '빨간색'인가? (true/false)",         weight: 19, failMessage: "토마토는 맞는 것 같은데... 왜 빨간색이 아니죠? 익은 토마토의 그 선명한 빨간색이 필요해요.", successMessage: "이 빨간빛이 바로 제가 원하던 거예요! 정말 맛있어 보여요." },
            { id: 'isRound',       prompt: "그림 속 '토마토'의 모양이 '둥근' 편인가? (true/false)",     weight: 15, failMessage: "토마토가 조금 각져 보이네요... 동글동글한 토마토의 매력적인 곡선이 아쉬워요.", successMessage: "이 둥근 형태가 정말 자연스럽고 예뻐요. 토마토다운 토마토네요!" },
            { id: 'detailLevel',   prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 27, failMessage: "기본 형태는 좋은데, 조금만 더 세심하게 그려주셨으면 완벽했을 텐데요!", successMessage: "와, 꼭지부터 표면의 질감까지... 완성도가 정말 훌륭해요!" },
            { id: 'expression',    prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "아직 조금 어색한 부분이 있어요. 더 생동감 있게 표현해주시면 좋겠어요.", successMessage: "이 정도 실력이면 정말 대단해요! 생동감이 느껴져요." },
            { id: 'completeness',  prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",             weight: 8,  failMessage: "거의 다 됐는데 마무리가 조금 아쉬워요. 디테일을 좀 더 다듬어주세요.", successMessage: "마무리까지 정말 깔끔하게 잘 해주셨어요!" },
            { id: 'creativity',    prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "토마토는 맞지만 조금 평범한 느낌이에요. 특별한 아이디어가 있으면 더 좋겠어요.", successMessage: "오, 이런 톡톡 튀는 아이디어! 정말 창의적이고 재미있어요!" }
        ],
        successMessage: "와! 막 수확한 토마토 같아요. 정말 감사합니다!"
    },
    // ===== 핀 랜덤 의뢰: 나의 진짜 모습 =====
    "finn_req_true_form": {
        rubrics: [
            { id: 'isHumanPortrait', prompt: "그림이 '인간'을 그린 것처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "인간 모습을 그려달라고 했잖아! 이런!", successMessage: "이 정도면 '생전에 내가 이렇게 생겼겠구나' 하고 딱 떠오르네!" },
            { id: 'showsPersonality', prompt: "장난꾸러기라는 인상을 받을 수 있는가? (0/1/2)", weight: 40,
              failMessage: "음... 내가 이렇게 생기진 않았을 것 같은데..?", successMessage: "음 딱 보니까 나일 것 같네!" },
            { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
              failMessage: "선이나 색을 조금 더 다듬어주면 좋겠어. 내가 멋져 보여야 하잖아?", successMessage: "와, 머리카락부터 옷 주름까지 다 정성 들였네! 완전 마음에 들어!" },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 20,
              failMessage: "배경이나 마무리가 살짝 급한 느낌이야. 조금만 더 다듬어줘!", successMessage: "이대로 초상화로 걸어두고 싶을 만큼 완벽하게 마무리됐어!" }
        ],
        successMessage: "헉, 이게 진짜 내 생전 모습이었나 싶을 정도로 멋진데? 덕분에 나도 새삼스레 감동했어!"
    },
    // ===== 핀 랜덤 의뢰: 유령 친구들 =====
    "finn_req_ghost_friends": {
        rubrics: [
            { id: 'hasGhosts', prompt: "그림에 '유령'이 그려져 있는가? (true/false)", weight: 20, isSubject: true,
              failMessage: "유령을 그려달라고 했는데 유령이 안 보여!", successMessage: "오, 유령이다! 바로 이거야!" },
            { id: 'showsMultipleGhosts', prompt: "둘 이상의 '유령 친구들'이 그려져 있는가? (true/false)", weight: 20,
              failMessage: "친구를 그려달랬더니 또 나 혼자잖아! 여러 유령이 필요하다구!", successMessage: "유령 친구들이 잔뜩 있어서 보는 것만으로도 신나!" },
            { id: 'hasVariety', prompt: "각 유령이 서로 다르게 생겼는가? (0/1/2)", weight: 30,
              failMessage: "다들 비슷비슷하게 생겨서 누가 누군지 모르겠어.", successMessage: "각자 개성이 확 살아 있어서 누구랑 장난칠지 고르는 재미가 있어!" },
            { id: 'isPlayful', prompt: "재미있고 유쾌한 분위기인가? (0/1/2)", weight: 20,
              failMessage: "너무 음침하거나 심각해… 난 재밌는 걸 좋아한다니까?", successMessage: "무섭기도 한데 귀엽고 웃긴 포인트까지 있어서 딱 좋아!" },
            { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
              failMessage: "선이 흐릿하거나 색이 번져서 친구들 표정이 잘 안 보여.", successMessage: "디테일이 살아있어서 친구들 표정까지 다 읽히네!" },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "배경이나 구성이 조금 허전해서 모임 느낌이 덜해.", successMessage: "배경까지 깔끔해서 진짜 유령 파티 사진 같아!" }
        ],
        successMessage: "이 정도면 유령 친구 모집 포스터로 써도 되겠는데? 곧 친구들 줄 서겠어!"
    },
    // ===== 포치 랜덤 의뢰: 궁극의 밥그릇 =====
    "pochi_req_ultimate_bowl": {
        rubrics: [
            { id: 'isBowlDesign', prompt: "그림에 '밥그릇'이 그려져 있는가? (true/false)", weight: 20, isSubject: true,
              failMessage: "밥그릇이 잘 보이지 않아요… 포치 전용 그릇이라는 게 느껴졌으면 좋겠어요.", successMessage: "한눈에 포치 전용 밥그릇이라는 게 느껴져요!" },
            { id: 'looksFestiveMeal', prompt: "밥그릇이 축제처럼 즐거운 분위기인가? (0/1/2)", weight: 30,
              failMessage: "조금 평범해 보여서 포치가 다시 흥분할 만큼 기쁜 느낌이 부족해요.", successMessage: "보기만 해도 밥 먹는 시간이 축제가 될 것 같은 신나는 느낌이에요!" },
            { id: 'showsDogFavorites', prompt: "강아지가 좋아할 만한 요소가 있는가? (0/1/2)", weight: 40,
              failMessage: "포치가 좋아할 만한 토핑이 잘 보이지 않아요.", successMessage: "간식 토핑이 가득해서 보기만 해도 군침이 도네요!" },
            { id: 'creativity', prompt: "밥그릇을 표현하는 방식이 창의적인가? (0/1/2)", weight: 10,
              failMessage: "조금 익숙한 구성 같아요. 포치만의 이야기가 더 있으면 좋겠어요.", successMessage: "이런 밥그릇이라면 다른 강아지에게도 자랑하고 싶을 정도예요!" },
            { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "조금만 더 정성스럽게 다듬어주시면 금방이라도 제작할 수 있을 것 같아요.", successMessage: "질감과 장식이 꼼꼼해서 바로 만들고 싶어져요!" },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 다소 급한 느낌이라 사용 모습을 상상하기 어렵네요.", successMessage: "마무리까지 깔끔해서 바로 밥을 담아도 될 것 같아요!" }
        ],
        successMessage: "이 밥그릇이라면 밥을 세 그릇은 먹을 수 있을 것 같아요! 밥 시간이 기다려집니다!"
    },
    // ===== 포치 랜덤 의뢰: 꿈의 산책로 =====
    "pochi_req_sausage_trail": {
        rubrics: [
            { id: 'isTrailScene', prompt: "그림에 '산책로/길'이 그려져 있는가? (true/false)", weight: 20, isSubject: true,
              failMessage: "산책길이 잘 보이지 않아요. 어디를 걸어야 할지 모르겠어요.", successMessage: "한눈에 즐겁게 걸을 수 있는 산책길이라는 게 느껴져요!" },
            { id: 'usesFoodLandscape', prompt: "소시지, 치킨 등 음식 요소가 길과 풍경에 있는가? (0/1/2)", weight: 40,
              failMessage: "소시지... 치킨... 제가 좋아하는 것들이 없네요...", successMessage: "길 전체가 간식으로 만들어져 있어서 눈을 떼지 못하겠어요!!" },
            { id: 'feelsPlayful', prompt: "전체 분위기가 즐겁고 신나는가? (true/false)", weight: 20,
              failMessage: "조금 정적이거나 지루해 보여요. 포치가 뛰놀 수 있을 만큼 유쾌했으면 좋겠어요.", successMessage: "밥 냄새와 환한 색감 덕분에 걷기만 해도 행복해질 것 같아요!" },
            { id: 'creativity', prompt: "산책로를 음식으로 표현한 방식이 창의적인가? (0/1/2)", weight: 20,
              failMessage: "어디선가 본 듯한 구성이라 조금 아쉬워요.", successMessage: "간식으로 만든 같은 발상이 정말 독특해요! 작가님 짱이에요!" },
            { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "디테일이 조금만 더 있으면 냄새까지 느껴질 것 같아요.", successMessage: "길의 질감부터 간식 표현까지 세심해서 금방이라도 걸어보고 싶어요!" },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "전체 구성이 살짝 허전해서 산책길 규모가 잘 느껴지지 않아요.", successMessage: "시작부터 끝까지 연결감이 좋아서 완벽한 산책 코스가 완성됐어요!" }
        ],
        successMessage: "이 산책로라면 하루 종일 걸어도 질리지 않을 것 같아요! 간식 냄새가 벌써부터 느껴져요!"
    },

    // 테오 - 허수아비 친구 (의뢰 2)
    "theo_req_scarecrow": {
        rubrics: [
            { id: 'isScarecrow',       prompt: "그림에 '허수아비'가 표현되어 있는가? (true/false)",           weight: 25, isSubject: true, failMessage: "이게 허수아비인가요? 전혀 아닌데요.", successMessage: "허수아비가 분명해요." },
            { id: 'looksCoolOrStrong', prompt: "전반적으로 '멋지거나 강해' 보이는가? (0/1/2)",                weight: 20, failMessage: "좀 더 위풍당당한 느낌이 필요해요.", successMessage: "위풍당당한 인상이 좋아요." },
            { id: 'hasHat',            prompt: "'모자'를 쓰고 있는가? (true/false)",                         weight: 10, failMessage: "허수아비의 상징인 모자가 없네요.", successMessage: "모자가 잘 어울려요." },
            { id: 'isColorful',        prompt: "새들이 놀랄 만큼 '다채로운 색'을 썼는가? (true/false)",       weight: 10, failMessage: "색이 단조로워서 눈에 덜 띄어요.", successMessage: "색감이 다채로워 눈에 잘 띄어요." },
            // 완성도 ~ 창의성 기준 추가
            { id: 'detailLevel',       prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                     weight: 10,  failMessage: "조금만 더 세밀하게 그려주셨으면 좋았을 텐데!", successMessage: "완성도가 높아서 보기 좋아요." },
            { id: 'expression',        prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",                weight: 10,  failMessage: "표현이 조금 아쉬워요.", successMessage: "표현력이 인상적이에요." },
            { id: 'completeness',      prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",               weight: 10,  failMessage: "마무리가 조금 아쉬워요.", successMessage: "마무리가 깔끔해요." },
            { id: 'creativity',        prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                         weight: 10,  isBonus: true, failMessage: "새로움이 조금 부족한 느낌이에요.", successMessage: "독창적인 아이디어가 좋네요." }
        ],
        successMessage: "허수아비가 위풍당당하네요! 새들이 쉽게 못 덤빌 것 같아요!"
    },

    // 테오 - 풍요로운 과수원 (의뢰 3)
    "theo_req_orchard": {
        rubrics: [
            { id: 'hasTrees',         prompt: "그림에 '과수원 나무'가 보이는가? (true/false)",               weight: 25, isSubject: true, failMessage: "이게 과수원인가요? 나무가 보이지 않아요.", successMessage: "과수원 나무가 잘 보이네요." },
            { id: 'hasVariousFruits', prompt: "서로 다른 과일이 2종 이상 보이는가? (true/false)",           weight: 20, failMessage: "과일 종류가 부족해 보여요.", successMessage: "여러 과일이 주렁주렁 보여요." },
            { id: 'looksAbundant',    prompt: "전반적으로 '풍성'해 보이는가? (0/1/2)",                      weight: 15, failMessage: "조금 빈약해 보여요.", successMessage: "아주 풍성해 보여요." },
            { id: 'isBright',         prompt: "밝고 긍정적인 분위기인가? (true/false)",                     weight: 10, failMessage: "분위기가 다소 어두워요.", successMessage: "밝고 긍정적인 느낌이 좋아요." },
            // 완성도 ~ 창의성 기준 추가
            { id: 'detailLevel',      prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                      weight: 10,  failMessage: "조금 더 세밀하게 그려주셨으면 과수원의 디테일이 완벽했을 거예요.", successMessage: "완성도가 높아서 감탄했어요." },
            { id: 'expression',       prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",                 weight: 10,  failMessage: "표현이 다소 평이해요.", successMessage: "표현력이 확실하게 드러나요." },
            { id: 'completeness',     prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",                weight: 10,  failMessage: "마무리가 조금 성급한 것 같아요.", successMessage: "마무리까지 정성이 보이네요." },
            { id: 'creativity',       prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                          weight: 10,  isBonus: true, failMessage: "조금 평범한 과수원인 것 같아요.", successMessage: "창의적인 연출이 돋보여요." }
        ],
        successMessage: "정말 풍요로운 과수원이네요! 내년이 기대돼요!"
    },

    // 테오 - 비 오는 날의 휴식 (감성) (의뢰 4)
    "theo_req_rain_teacup": {
        rubrics: [
            { id: 'hasRain',        prompt: "'비가 내리는' 장면이 보이는가? (true/false)",                    weight: 25, isSubject: true, failMessage: "비 오는 느낌이 전혀 없어요.", successMessage: "비가 촉촉하게 잘 표현됐어요." },
            { id: 'hasWindow',      prompt: "'창문'이 보이는가? (true/false)",                                  weight: 20, failMessage: "창문이 안 보여서 실내 분위기가 약해요.", successMessage: "창문 구도가 안정적이에요." },
            { id: 'hasTeacup',      prompt: "'찻잔'이 보이는가? (true/false)",                                  weight: 15, failMessage: "따뜻한 찻잔이 보이지 않네요.", successMessage: "찻잔의 따뜻함이 잘 전해져요." },
            { id: 'isWarmAndCozy',  prompt: "전체적으로 '따뜻하고 아늑한' 분위기인가? (0/1/2)",                weight: 10, failMessage: "아늑함이 조금 부족해요.", successMessage: "아늑하고 포근한 기운이 좋아요." },
            // 완성도 ~ 창의성 기준 추가
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                         weight: 10,  failMessage: "조금 더 세밀히 표현됐으면 더 감성적이었을 거예요.", successMessage: "완성도가 높아 감성도 배가됩니다." },
            { id: 'expression',      prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",                  weight: 10,  failMessage: "표현력이 다소 부족해 보여요.", successMessage: "표현이 너무 좋네요." },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",                  weight: 10,  failMessage: "마무리가 조금 아쉬워요.", successMessage: "마무리 손길까지 따뜻해요." },
            { id: 'creativity',      prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                            weight: 10,  isBonus: true, failMessage: "구성이 다소 평범한 것 같아요.", successMessage: "감성이 독특하게 표현됐어요." }
        ],
        successMessage: "비 오는 날의 평온함이 느껴지네요. 참 따뜻해요!"
    },

    // ===== Thomas 랜덤 요청(데이터와 문구 일치) =====
    "thomas_req_dolphin": {
        // data.js: '파도를 가르는 돌고래 한 마리를 그려보게.'
        rubrics: [
            { id: 'isDolphin',    prompt: "그림에 '돌고래'가 포함되어 있는가? (true/false)",          weight: 40, isSubject: true, failMessage: "이게 돌고래라고? 전혀 아니지 않나.", successMessage: "돌고래가 분명히 보이는군. 훌륭해." },
            { id: 'hasWaves',     prompt: "파도를 가르는 장면처럼 '파도/바다'가 표현되었는가? (true/false)", weight: 20, failMessage: "파도의 역동감이 부족하군. 바다의 힘을 더 느낄 수 있게 해보게.", successMessage: "파도 표현이 정말 생생하군. 바다의 웅장함이 느껴져." },
            { id: 'isDynamic',    prompt: "전반적 구도가 '역동적'으로 느껴지는가? (0/1/2)",            weight: 11, failMessage: "조금 더 움직임이 느껴지면 좋겠네. 돌고래의 속도감을 살려보게.", successMessage: "구도가 매우 역동적이네. 돌고래가 살아 움직이는 것 같아." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "조금만 더 정교했으면 완벽했을 텐데. 세부 묘사에 신경 써보게.", successMessage: "완성도가 정말 뛰어나군. 세심한 부분까지 잘 표현했어." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "긴장감이 조금 부족하네. 더 생동감 있게 표현해보게.", successMessage: "현장감이 정말 살아있네. 마치 바다 한복판에 있는 것 같아." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 성급하네. 조금 더 신경 써서 다듬어보게.", successMessage: "마무리까지 완벽하군. 흠잡을 데가 없어." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "표현이 다소 평범하네. 좀 더 독창적인 시각을 보여주게.", successMessage: "해석이 정말 신선하네. 이런 관점은 처음 봐." }
        ],
        successMessage: "파도를 가르는 모습이 정말 생생하네! 바다의 역동성과 돌고래의 우아함이 완벽하게 조화를 이루고 있군."
    },
    "thomas_req_apple": {
        // data.js: '커다란 붉은 사과 하나를 그려보게.'
        rubrics: [
            { id: 'isApple',      prompt: "그림에 '사과'가 포함되어 있는가? (true/false)",           weight: 40, isSubject: true, failMessage: "이게 사과라고? 도저히 그렇게는 안 보이네..", successMessage: "한눈에 사과로 알아볼 수 있군. 형태가 완벽해." },
            { id: 'isRed',        prompt: "사과의 주된 색이 '붉은색'인가? (true/false)",               weight: 20, failMessage: "붉은빛이 약하구만. 더 선명하고 탐스러운 빨간색을 써보게.", successMessage: "붉은빛이 정말 탐스럽군. 보기만 해도 달콤할 것 같아." },
            { id: 'isBig',        prompt: "사과가 '커다란' 인상인가? (0/1/2)",                         weight: 11, failMessage: "좀 더 크게 강조하면 좋겠네. 웅장한 사과의 모습을 보여주게.", successMessage: "크기가 정말 잘 강조되었네. 거대한 사과의 위용이 느껴져." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "광택이나 표면 질감을 더 세밀하게 표현해보게. 사과의 매력을 살려야지.", successMessage: "표면 질감이 정말 살아있군. 광택까지 완벽해." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "조금 밋밋하군. 사과의 생명력을 더 느낄 수 있게 해보게.", successMessage: "탐스러움이 정말 잘 느껴지네. 살아있는 사과 같아." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 조금 성급하군. 더 정성스럽게 다듬어보게.", successMessage: "마무리가 정말 탄탄하네. 완성도가 뛰어나." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "평범한 구성이네. 좀 더 독특한 접근을 시도해보게.", successMessage: "해석이 정말 재치있네. 새로운 시각이 돋보여." }
        ],
        successMessage: "정말 크고 윤기나는 붉은 사과로군! 보는 것만으로도 입맛이 돌게 만드는 훌륭한 작품이야."
    },
    "thomas_req_smile_face": {
        // data.js: '활짝 웃는 사람의 얼굴을 그려보게.'
        rubrics: [
            { id: 'isFace',       prompt: "'사람 얼굴'이 명확히 표현되었는가? (true/false)",           weight: 40, isSubject: true, failMessage: "이걸 얼굴이라고 하기 어렵네. 전혀 아니지..", successMessage: "얼굴이 정말 명확하게 보이네. 사람다운 특징이 잘 드러나 있어." },
            { id: 'isSmiling',    prompt: "표정이 '활짝 웃는' 편인가? (true/false)",                    weight: 20, failMessage: "웃는 느낌이 덜하군. 더 밝고 환한 미소를 표현해보게.", successMessage: "활짝 웃는 표정이 정말 좋아. 보는 이를 행복하게 만드는군." },
            { id: 'warmTone',     prompt: "전반적 인상이 '따뜻한' 톤인가? (0/1/2)",                    weight: 11, failMessage: "따뜻함이 조금 부족하네. 더 포근하고 친근한 느낌을 줘보게.", successMessage: "따뜻한 톤이 정말 잘 느껴져. 마음이 편안해지는군." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "표정 완성도를 더 높여보게. 감정이 더 생생하게 전달되도록 해야지.", successMessage: "표정 완성도가 정말 훌륭하네. 감정이 생생하게 살아있어." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "감정 전달이 약하네. 더 강렬하고 진실한 표현을 해보게.", successMessage: "감정이 정말 잘 전달되네. 진심이 느껴지는 미소야." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 아쉽네. 더 세심하게 다듬어서 완성해보게.", successMessage: "마무리까지 완벽하네. 흠잡을 데가 없어." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "표현이 다소 평이하네. 좀 더 독창적인 미소를 보여주게.", successMessage: "해석이 정말 흥미롭네. 이런 미소는 처음 봐." }
        ],
        successMessage: "보는 이도 절로 미소 짓게 만드는 정말 훌륭한 웃는 얼굴이군! 이런 따뜻한 표정이야말로 진정한 예술이지."
    },
    "thomas_req_cat": {
        // data.js: '귀여운 고양이 한 마리를 그려보게.'
        rubrics: [
            { id: 'isCat',        prompt: "그림에 '고양이'가 포함되어 있는가? (true/false)",           weight: 40, isSubject: true, failMessage: "이게 고양이라고? 전혀 그렇게는 안 보이네..", successMessage: "한눈에 고양이로 확실히 보이는군. 형태가 완벽해." },
            { id: 'isCute',       prompt: "전반적으로 '귀여움'이 느껴지는가? (0/1/2)",                  weight: 20, failMessage: "귀여움이 조금 덜하군. 더 사랑스럽고 애교 있는 모습을 보여주게.", successMessage: "귀여움이 정말 잘 살아있네. 보기만 해도 마음이 따뜻해져." },
            { id: 'hasEarsTail',  prompt: "고양이의 귀/꼬리 등 특징이 표현되었는가? (true/false)",     weight: 10, failMessage: "고양이 특징을 더 뚜렷하게 살려보게. 귀와 꼬리가 더 명확해야 해.", successMessage: "귀와 꼬리 특징이 정말 잘 드러났어. 고양이다운 매력이 넘쳐." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "털 질감이나 표정을 더 세밀하게 표현해보게. 고양이의 생동감을 살려야지.", successMessage: "완성도가 정말 뛰어나네. 털 하나하나까지 살아있어." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "표정이나 자세가 덜 살아있네. 고양이의 개성을 더 드러내보게.", successMessage: "표정이 정말 사랑스럽네. 고양이의 영혼이 담겨있어." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 조금 아쉽네. 더 정성스럽게 다듬어서 완성해보게.", successMessage: "마무리까지 정말 단단하네. 완벽한 고양이야." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "조금은 흔한 표현이네. 좀 더 독특한 고양이의 매력을 보여주게.", successMessage: "독특한 매력이 정말 돋보이네. 이런 고양이는 처음 봐." }
        ],
        successMessage: "정말 귀엽고 사랑스러운 고양이구만! 살아있는 것처럼 생생하고 매력적인 훌륭한 작품이네."
    },
    // ===== 소피아 랜덤 의뢰: 계절의 꽃다발 =====
    "sophia_req_season_bouquet": {
        rubrics: [
            // 내용 관련: 최대 3개
            { id: 'isAutumnBouquet', prompt: "그림이 '꽃다발'로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "분명 꽃다발을 그려달라고 부탁드렸는데... 꽃다발은 없네요..", successMessage: "한눈에 가을 꽃다발이라는 느낌이 들어요. 정말 포근해 보여요." },
            { id: 'usesBrownTones',  prompt: "갈색/주황/붉은 톤과 낙엽의 느낌이 잘 표현되어 있는가? (0/1/2)", weight: 30,
              failMessage: "가을 특유의 갈색·주황빛이 조금 더 있었으면 좋겠어요.", successMessage: "갈색 톤과 낙엽 색감이 정말 예쁘게 어우러졌어요." },
            { id: 'cozyMood',        prompt: "전체 분위기가 '따뜻하고 차분한 가을' 같은 느낌을 주는가? (0/1/2)", weight: 30,
              failMessage: "분위기가 조금 산만해서 가을의 고요함이 덜 느껴져요.", successMessage: "보고 있으면 따뜻한 차 한 잔이 생각나는, 차분한 가을 느낌이 너무 좋아요." },
            // 공통 항목
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "조금만 더 정성스럽게 다듬어주시면 훨씬 풍성한 꽃다발이 될 것 같아요.", successMessage: "꽃 한 송이 한 송이에 정성이 느껴지는 멋진 완성도예요." },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서 진열대에 바로 올리기엔 부족한 느낌이에요.", successMessage: "마무리까지 깔끔해서 바로 가게 진열대에 올려두고 싶어요." },
            { id: 'creativity',      prompt: "구성이나 색 조합에 창의적인 아이디어가 느껴지는가? (0/1/2)", weight: 10,
              failMessage: "조금은 익숙한 구성이에요. 소피아만의 느낌이 더 있으면 좋겠어요.", successMessage: "꽃과 낙엽의 배치가 독특해서 손님들이 분명 눈여겨볼 것 같아요!" }
        ],
        successMessage: "이 꽃다발이라면 가게 앞이 한층 더 따뜻해질 것 같아요. 가을이 더 좋아졌어요, 정말 고맙습니다."
    },
    // ===== 소피아 랜덤 의뢰: 꽃집의 새 친구 =====
    "sophia_req_mascot": {
        rubrics: [
            { id: 'isMascot',       prompt: "그림이 '마스코트 캐릭터'로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "마스코트로는 잘 안보이네요... 저는 마스코트 캐릭터가 필요한거에요..", successMessage: "딱 봐도 우리 꽃집 마스코트라는 느낌이 들어요!" },
            { id: 'fitsFlowerShop', prompt: "꽃집과 잘 어울리는 요소(꽃, 잎, 화분 등)를 가지고 있는가? (0/1/2)", weight: 40,
              failMessage: "조금만 더 꽃집과 연결되는 요소가 있었으면 좋겠어요.", successMessage: "몸짓이나 장식 하나하나가 꽃집과 정말 잘 어울려요." },
            { id: 'isFriendlyCute', prompt: "손님들이 반가워할 만큼 귀엽고 친근해 보이는가? (0/1/2)", weight: 30,
              failMessage: "조금은 표정이 딱딱해 보여서 아이들이 무서워할 수도 있을 것 같아요.", successMessage: "아이들이 꼭 안아주고 싶어할 만큼 귀엽고 사랑스러워요!" },
            { id: 'detailLevel',    prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "선이나 색을 조금만 더 정리해주시면 훨씬 보기 좋을 것 같아요.", successMessage: "선도 색도 안정적이라 간판이나 포장지에 바로 써도 될 것 같아요." },
            { id: 'completeness',   prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서 활용하기까지 조금 더 손볼 필요가 있어요.", successMessage: "마무리까지 완벽해서 지금 당장 간판과 스티커를 만들고 싶어요!" },
            { id: 'creativity',     prompt: "마스코트로서 개성이 느껴지는가? (0/1/2)", weight: 20,
              failMessage: "어딘가에서 본 듯한 친구 같아요. 이 꽃집만의 이야기가 조금 더 담기면 좋겠어요.", successMessage: "이 친구만 보면 우리 가게가 떠오를 만큼 개성이 뚜렷해요!" }
        ],
        successMessage: "이 친구라면 손님들이 가게 앞에서 사진을 찍고 갈 것 같아요. 정말 마음에 들어요!"
    },
    // ===== 테오 랜덤 의뢰: 우리 집 가보 =====
    "theo_req_legend_seed": {
        rubrics: [
            { id: 'isBeanstalkScene', prompt: "씨앗에서 자라난 거대한 콩나무가 하늘까지 뻗은 장면으로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "콩나무 전설 장면이라는 느낌이 잘 안 보여요. 콩나무와 하늘까지 이어지는 느낌이 더 또렷하면 좋겠어요.", successMessage: "한눈에 전설 속 하늘까지 솟은 콩나무라는 게 느껴져요!" },
            { id: 'appealsToChildren', prompt: "아이들이 보고 좋아할 만큼 재미있고 흥미로운 그림인가? (0/1/2)", weight: 30,
              failMessage: "아이들이 보기엔 조금 지루하거나 어려워 보일 것 같아요.", successMessage: "아이들이 보자마자 눈을 반짝이며 이야기를 듣고 싶어할 것 같은 그림이에요." },
            { id: 'isLegendary',      prompt: "전설 이야기처럼 신비롭고 꿈 같은 분위기가 느껴지는가? (0/1/2)", weight: 40,
              failMessage: "조금 더 신비롭고 특별한 분위기가 있었으면 전설 같은 느낌이 날 것 같아요.", successMessage: "이야기를 들려주기만 해도 눈을 반짝일 것 같은 전설적인 장면이에요." },
            { id: 'detailLevel',      prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "조금만 더 정성스럽게 다듬어 주시면 아이들이 더 오래 바라볼 것 같아요.", successMessage: "잔디, 잎, 하늘까지 꼼꼼하게 그려져 있어서 보는 재미가 있어요." },
            { id: 'completeness',     prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서 이야기를 끝까지 상상하기가 어렵네요.", successMessage: "이 한 장이면 전설 이야기를 처음부터 끝까지 들려줄 수 있겠어요." },
            { id: 'creativity',       prompt: "전설을 표현하는 방식이 창의적이고 인상적인가? (0/1/2)", weight: 10,
              failMessage: "조금 익숙한 구성이에요. 테오네 농장만의 느낌이 더 담기면 좋겠어요.", successMessage: "익숙한 전설이면서도 새롭게 느껴지는 독특한 표현이라 멋져요!" }
        ],
        successMessage: "이 그림이라면 아이들에게 전설을 들려줄 때 딱이겠어요. 우리 집 가보로 소중히 간직하겠습니다."
    },
    // ===== 테오 랜덤 의뢰: 미래의 농장 =====
    "theo_req_future_farm": {
        rubrics: [
            { id: 'isFarmScene',       prompt: "그림이 '농장/농사'와 관련된 장면으로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "농장...이 맞는건가요? 도저히 농장으로는 안보여서요..", successMessage: "농장이라는 느낌이 잘 살아있어요! 감사해요!" },
            { id: 'usesFutureTech',    prompt: "기계·로봇·드론·스마트 시스템 등 미래의 기술이 농사에 활용되는 모습이 있는가? (0/1/2)", weight: 40,
              failMessage: "미래 기술 느낌이 조금 부족해요. 그냥 깔끔한 농장처럼 보이는 것 같아요.", successMessage: "기계랑 기술이 자연스럽게 녹아 있어서 '100년 뒤 농장'이라는 말이 딱 어울려요." },
            { id: 'isPositiveFuture',  prompt: "전체 분위기가 희망적이고, 사람과 자연이 함께 잘 지내는 느낌을 주는가? (0/1/2)", weight: 30,
              failMessage: "조금은 차갑고 삭막한 느낌이 드네요. 자연과 함께하는 따뜻함이 더 있으면 좋겠어요.", successMessage: "기술은 발전했지만, 사람도 작물도 모두 행복해 보이는 미래라서 안심이 돼요." },
            { id: 'detailLevel',       prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "기계나 시설을 조금만 더 구체적으로 그려주시면 상상하기 쉬울 것 같아요.", successMessage: "장비 하나하나가 어떻게 쓰일지 떠오를 만큼 꼼꼼하게 표현돼 있어요." },
            { id: 'completeness',      prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서, 농장의 구조를 완전히 이해하기는 어렵네요.", successMessage: "이 그림 하나로 미래 농장의 지도를 본 것 같은 기분이에요." },
            { id: 'creativity',        prompt: "미래 농장을 상상하는 방식이 창의적인가? (0/1/2)", weight: 10,
              failMessage: "다른 데서 본 적 있는 미래 도시와 비슷한 느낌이에요.", successMessage: "이런 농장이라면 정말 100년 뒤에 꼭 구경 가보고 싶다는 생각이 들어요!" }
        ],
        successMessage: "미래 농장이 이렇게 생겼다면… 농사일이 더 즐거워질 것 같아요. 정말 멋진 상상도 감사합니다."
    },
    // ===== 브룩 랜덤 의뢰: 대장간의 간판 =====
    "brook_req_sign": {
        rubrics: [
            { id: 'isSignDesign',  prompt: "그림이 '대장간의 간판 디자인'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "간판으로는 보이지가 않는군.. 가게 앞에 걸려도 어울릴 만한 구성이면 좋겠소.", successMessage: "한눈에 대장간 간판이라는 게 느껴지는 든든한 디자인이오." },
            { id: 'feelsFriendly', prompt: "전체 인상이 '무섭기보다는 친근하고 믿음직한' 느낌을 주는가? (0/1/2)", weight: 30,
              failMessage: "조금은 험해 보이는 인상이 남소. 손님들이 주저할 수도 있겠소.", successMessage: "힘은 느껴지지만 따뜻한 인상이 남아서, 누구나 편하게 들어올 수 있겠구만." },
            { id: 'showsBlacksmith', prompt: "망치/모루/불꽃 등 대장간을 상징하는 요소가 분명하게 보이는가? (0/1/2)", weight: 20,
              failMessage: "무슨 가게인지 한 번 더 들여다봐야 알 것 같소. 대장간 분위기가 조금 더 있으면 좋겠네.", successMessage: "멀리서 봐도 '아, 저긴 제대로 된 대장간이구나' 하고 느껴질 만하오." },
            { id: 'detailLevel',   prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "선이나 장식이 조금만 더 정리되면, 간판으로 바로 써도 되겠소.", successMessage: "장식부터 글씨까지 탄탄하게 마무리되어 있어, 금방이라도 나무판에 새길 수 있겠구만." },
            { id: 'completeness',  prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "조금 덜 다듬어진 느낌이군. 마지막 손질만 더해주면 좋겠소.", successMessage: "이대로 공방 문 위에 걸어도 전혀 손색 없겠네. 훌륭하오." },
            { id: 'creativity',    prompt: "대장간 간판으로서 개성 있고 기억에 남는 요소가 있는가? (0/1/2)", weight: 30,
              failMessage: "어딘가에서 본 듯한 간판 같소. 우리 마을에만 있을 법한 멋이 더 있으면 좋겠네.", successMessage: "이 간판을 본 사람은 나중에도 '브룩 대장간'을 꼭 기억하게 될 거요." }
        ],
        successMessage: "이 간판이라면, 나도 조금은 덜 무섭게 보이겠지? 덕분에 가게가 한층 더 좋아진 것 같소."
    },
    // ===== 브룩 랜덤 의뢰: 전설의 갑옷 =====
    "brook_req_legend_armor": {
        rubrics: [
            { id: 'isArmorScene',   prompt: "그림이 '갑옷' 혹은 갑옷을 중심으로 한 장면으로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "갑옷으로는 도저히 볼 수 없구만.. 형태가 더 분명하면 좋겠소.", successMessage: "한눈에 전설 속 용비늘 갑옷이라고 느껴질 만큼 위압감이 있구만." },
            { id: 'showsDragonScale', prompt: "용의 비늘을 떠올리게 하는 질감/무늬/색감이 표현되어 있는가? (0/1/2)", weight: 40,
              failMessage: "용비늘 느낌이 조금 부족하네. 그냥 튼튼한 갑옷처럼 보여요.", successMessage: "비늘 하나하나가 살아있는 것 같소. 정말 용이 몸을 빌려준 갑옷 같네." },
            { id: 'feelsLegendary', prompt: "전설의 무구답게 특별하고 신비로운 분위기를 풍기는가? (0/1/2)", weight: 20,
              failMessage: "좋은 갑옷이긴 한데, 전설적인 무게감은 조금 약한 것 같소.", successMessage: "이 정도라면 영웅 이야기 첫 장에 나와도 되겠네. 보는 것만으로도 기가 눌리는구만." },
            { id: 'detailLevel',    prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
              failMessage: "리벳이나 연결 부분을 조금만 더 신경 써주면 장인다운 완성도가 나올 것 같소.", successMessage: "질감부터 구조까지 허술한 구석이 없구만. 만들고 싶어지는 도면이오." },
            { id: 'completeness',   prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서 실전에 쓰기엔 불안하네.", successMessage: "이대로 금속으로 옮겨도 될 만큼 완성도가 높소. 장인의 혼이 느껴진다오." },
            { id: 'creativity',     prompt: "용비늘 갑옷을 해석하는 방식이 창의적인가? (0/1/2)", weight: 10,
              failMessage: "상상했던 용비늘 갑옷과 크게 다르진 않지만, 조금은 평범한 느낌이네.", successMessage: "이런 식의 해석은 생각 못 했소. 내 망치가 근질거릴 정도로 자극이 되네." }
        ],
        successMessage: "언젠가 이 설계를 바탕으로 진짜 갑옷을 만들어보고 싶어졌소. 좋은 꿈거리를 줘서 고맙네."
    },
    // ===== 엠마 랜덤 의뢰: 신제품 포스터 =====
    "emma_req_cloud_cake_poster": {
        rubrics: [
            { id: 'isCakePoster',    prompt: "그림이 '케이크/디저트 포스터'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "케이크 포스터는 어딨는거죠..?", successMessage: "한눈에 신제품을 자랑하는 케이크 포스터라는 게 느껴져요!" },
            { id: 'looksSoftSweet',  prompt: "케이크가 '푹신하고 달콤해 보이는' 느낌을 주는가? (0/1/2)", weight: 30,
              failMessage: "조금 딱딱하거나 밋밋해 보이네요. 폭신폭신하고 달콤한 느낌이 더 나면 좋겠어요.", successMessage: "보기만 해도 입안에 딸기 크림이 퍼지는 것 같은, 폭신폭신한 매력이 가득해요!" },
            { id: 'hasStrawberryFest', prompt: "딸기 축제/이벤트라는 분위기를 느끼게 하는 요소(딸기, 장식, 문구 등)가 있는가? (0/1/2)", weight: 20,
              failMessage: "딸기 축제용 포스터라는 느낌이 조금 약해요. 딸기나 축제 분위기가 더 있으면 좋겠어요.", successMessage: "딸기와 장식들 덕분에, 멀리서 봐도 '딸기 축제 한정 신제품'이라는 게 확실히 보여요!" },
            { id: 'creativity',      prompt: "디저트 포스터로서 기억에 남을 만한 아이디어/구성이 있는가? (0/1/2)", weight: 10,
              failMessage: "예쁘긴 한데 조금은 익숙한 구성이에요. 이 빵집만의 개성이 더 보이면 좋겠어요.", successMessage: "이 가게만의 포스터라는 게 단번에 느껴져요. 손님들이 사진부터 찍고 갈 것 같아요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 5,
              failMessage: "조금만 더 정성스럽게 다듬어주시면, 벽에 걸어도 손색이 없을 것 같아요.", successMessage: "선과 색감이 모두 깔끔해서, 바로 인쇄해서 써도 될 정도예요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 5,
              failMessage: "마무리가 살짝 급한 느낌이에요. 몇 군데만 더 손보면 완벽한 포스터가 되겠어요.", successMessage: "제목부터 케이크까지 빈틈 없이 잘 어울려서, 한 장의 완성된 포스터처럼 보여요!" }
        ],
        successMessage: "이 포스터만 걸어두면, 구름 딸기 케이크가 금방 다 팔려버리겠어요! 정말 고맙습니다, 작가님!"
    },
    // ===== 엠마 랜덤 의뢰: 빵집 유니폼 =====
    "emma_req_bakery_uniform": {
        rubrics: [
            { id: 'isUniformDesign', prompt: "그림이 '유니폼/작업복 디자인'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "분명 유니폼을 부탁드린 것 같은데.. 이건 유니폼이 아닌 것 같아요..", successMessage: "빵집에서 일하는 사람이 입는 유니폼이라는 게 한눈에 느껴져요!" },
            { id: 'feelsWarmCozy',   prompt: "전체적으로 따뜻하고 포근한 분위기를 주는가? (0/1/2)", weight: 20,
              failMessage: "조금 차갑거나 딱딱한 인상이에요. 손님들이 편안함을 느낄 수 있으면 좋겠어요.", successMessage: "보고만 있어도 빵 냄새와 함께 따뜻함이 느껴지는, 포근한 유니폼이에요!" },
            { id: 'showsBakeryMood', prompt: "앞치마, 빵 모티브, 색감 등 빵집 분위기를 살려주는 요소가 있는가? (0/1/2)", weight: 40,
              failMessage: "빵집이라는 느낌이 살짝 부족해요. 작은 빵 장식이나 앞치마 같은 요소가 더 있으면 좋겠어요.", successMessage: "작은 디테일까지 전부 빵집을 닮아서, 보는 것만으로도 가게 분위기가 떠올라요!" },
            { id: 'creativity',      prompt: "빵집 유니폼으로서 개성 있고 기억에 남는 포인트가 있는가? (0/1/2)", weight: 20,
              failMessage: "다른 가게에서도 볼 수 있을 것 같은 무난한 디자인이에요.", successMessage: "손님들이 '이 유니폼 예쁘다' 하고 사진 찍어갈 만큼 매력적인 디자인이에요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "주름이나 소매 같은 부분이 조금만 더 정리되면 좋겠어요.", successMessage: "실제로 만들었을 때 모습이 그려질 만큼 섬세하게 표현돼 있어요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서, 시안 단계처럼 느껴져요.", successMessage: "이대로 재단사에게 보여줘도 될 만큼 완성도가 높아요!" }
        ],
        successMessage: "이 유니폼이라면 손님들도 기분 좋게 맞이할 수 있을 것 같아요. 가게 분위기가 한층 더 따뜻해지겠네요!"
    },
    // ===== 클라라 랜덤 의뢰: 꿈의 이동수단 =====
    "clara_req_future_vehicle": {
        rubrics: [
            { id: 'isVehicle', prompt: "이동수단으로 보이는가? (true/false)", weight: 20, isSubject: true,
              failMessage: "이동수단이 어디있다는거죠..? 이동수단을 그려달라고 했는데...", successMessage: "딱봐도 이동수단이라는 게 느껴져요!" },
            { id: 'hasFutureTech',    prompt: "미래적인 장치나 연출이 보이는가? (0/1/2)", weight: 30,
              failMessage: "아직은 현재 기술 수준 같아요. 미래 세계의 놀라운 기술력이 더 느껴지면 좋겠어요.", successMessage: "연료와 장치 하나하나가 '미래 실험실' 느낌을 물씬 풍겨요!" },
            { id: 'showsPerformance', prompt: "성능이 미래 이동 수단답게 훌륭해 보이는가? (0/1/2)", weight: 30,
              failMessage: "속도나 기능이 조금 아쉬워 보여요. 미래 기술의 놀라운 성능이 더 느껴지면 좋겠어요.", successMessage: "이 성능이라면 어디든 순식간에 갈 수 있을 것 같은 압도적인 느낌이에요!" },
            { id: 'detailLevel',      prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "기계 구조나 연결부를 조금 더 다듬으면 설계도로 활용하기 좋겠어요.", successMessage: "볼트, 날개, 궤도까지 정교해서 바로 제작에 들어가고 싶어요!" },
            { id: 'completeness',     prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "배경이나 주변 요소가 살짝 허전해서 규모감이 덜 느껴져요.", successMessage: "주변 환경까지 완성돼 있어서 움직임이 눈앞에 그려져요!" },
            { id: 'creativity',       prompt: "탈것 디자인이 독창적이고 기억에 남는가? (0/1/2)", weight: 20,
              failMessage: "어디선가 본 듯한 느낌이에요. 발명가만의 개성이 더 들어가면 좋겠어요.", successMessage: "전혀 본 적 없는 탈것이라서, 특허부터 내고 싶어져요!" }
        ],
        successMessage: "이 이동수단이라면 제 발명 노트 표지를 장식하고 싶어요! 상상만으로도 심장이 두근거려요."
    },
    // ===== 클라라 랜덤 의뢰: 기어봇 =====
    "clara_req_gearbot": {
        rubrics: [
            { id: 'isRobotAssistant', prompt: "로봇 조수처럼 보이는가? (true/false)", weight: 20, isSubject: true,
              failMessage: "로봇 조수를 그려달라니까요...", successMessage: "바로 연구소에서 움직일 것 같은 든든한 로봇이에요!" },
            { id: 'looksFriendly',    prompt: "아이들이 친근하게 느낄 만큼 귀여운 인상인가? (0/1/2)", weight: 30,
              failMessage: "조금은 딱딱하고 무서운 느낌이에요. 아이들이 겁먹을지도 몰라요.", successMessage: "웃는 얼굴과 제스처 덕분에 다들 기어봇이랑 사진 찍고 싶어 할 거예요!" },
            { id: 'showsUtility',     prompt: "실험을 도와줄 기능이 표현되어 있는가? (0/1/2)", weight: 30,
              failMessage: "외형은 귀엽지만 어떤 일을 도와줄지 조금 불분명해요.", successMessage: "팔 하나하나가 실험을 지원하는 장치라서, 바로 함께 일하고 싶어져요!" },
            { id: 'detailLevel',      prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "관절이나 장갑 같은 디테일을 조금만 더 정리하면 훨씬 탄탄해질 거예요.", successMessage: "디테일이 섬세해서 금방 3D 모델을 만들 수 있을 것 같아요!" },
            { id: 'completeness',     prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "배경이나 장식이 조금 비어 보여서 전시용 시안으로 쓰기엔 아쉬워요.", successMessage: "마무리까지 깔끔해서 바로 홍보 포스터로 써도 되겠어요!" },
            { id: 'creativity',       prompt: "로봇 조수만의 개성이 느껴지는가? (0/1/2)", weight: 20,
              failMessage: "다른 로봇과 큰 차별점이 잘 안 보이는 것 같아요.", successMessage: "이 로봇만 보면 클라라 연구소가 떠오를 만큼 개성이 뚜렷하네요!" }
        ],
        successMessage: "이 로봇 조수라면 실험실 분위기가 훨씬 즐거워질 거예요. 아이들도 과학을 더 좋아하게 되겠네요!"
    },
    // ===== 톰 랜덤 의뢰: 내 프로필 사진 =====
    "tom_req_profile": {
        rubrics: [
            { id: 'isCaricature',   prompt: "그림이 '캐리커처/프로필 일러스트'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "제 프로필로 이걸 쓸 순 없을 것 같아요..", successMessage: "한눈에 '열정적인 기자 톰'이라는 게 느껴지는 멋진 캐리커처예요!" },
            { id: 'showsPassion',   prompt: "표정/포즈/시선에서 '열정 넘치는 특종 기자'의 분위기가 느껴지는가? (0/1/2)", weight: 20,
              failMessage: "조금 힘이 빠져 보이는 것 같아요. 특종을 쫓는 열정이 더 담기면 좋겠어요.", successMessage: "지금 당장이라도 취재하러 뛰어나갈 것 같은 에너지가 느껴져요!" },
            { id: 'pressProps',     prompt: "카메라, 수첩, 펜, 신문 등 기자를 연상시키는 소품이 적절히 활용되었는가? (0/1/2)", weight: 30,
              failMessage: "제가 기자라는 힌트가 조금 부족해요. 소품이 더 있으면 금방 알아볼 수 있을 것 같아요.", successMessage: "소품들만 봐도 '특종 기자'라는 사실이 확실히 전해져요!" },
            { id: 'creativity',     prompt: "기자 프로필로서 기억에 남을 만큼 개성 있는 연출/구도가 있는가? (0/1/2)", weight: 20,
              failMessage: "조금은 평범한 프로필 같아요. 신문 1면을 장식할 만한 임팩트가 있으면 좋겠어요.", successMessage: "이 프로필만 봐도 '이 기자, 뭔가 특종을 터뜨릴 사람'이라는 느낌이 팍 와요!" },
            { id: 'detailLevel',    prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "선이나 색을 조금만 더 다듬어주시면, 인쇄해도 깔끔하게 나올 것 같아요.", successMessage: "선과 색이 모두 정돈되어 있어서 명함에 넣어도 전혀 문제 없겠어요." },
            { id: 'completeness',   prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "배경이나 마무리가 살짝 아쉬워요. 조금만 더 손보면 완벽한 프로필이 될 것 같아요.", successMessage: "프로필로 바로 써도 될 만큼 마무리가 깔끔하고 완성도가 높아요!" }
        ],
        successMessage: "이 프로필이라면 누구든 제 기사부터 먼저 읽어보고 싶어 할 거예요. 최고의 명함이 되겠는데요!"
    },
    // ===== 톰 랜덤 의뢰: 신문사 로고 디자인 =====
    "tom_req_logo": {
        rubrics: [
            { id: 'isLogo',          prompt: "그림이 '로고/엠블럼'처럼 단순하고 상징적으로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "이게 로고...인가요? 로고를 그려달라고 부탁드렸을텐데..", successMessage: "한 번에 눈에 들어오는 깔끔한 로고라서 지면과 간판에 모두 잘 어울리겠어요!" },
            { id: 'feelsHopeful',    prompt: "전체 분위기가 '긍정적인 언론'을 떠올리게 하는가? (0/1/2)", weight: 30,
              failMessage: "조금은 딱딱하거나 무거운 느낌이에요. 새 시대를 여는 희망이 더 느껴지면 좋겠어요.", successMessage: "밝고 신뢰감 있는 분위기라서, 마을 사람들에게 사랑받는 신문사가 될 것 같아요!" },
            { id: 'creativity',      prompt: "신문사 로고로서 독창적이고 기억에 남는 구성이 있는가? (0/1/2)", weight: 30,
              failMessage: "어디선가 본 듯한 로고 느낌이에요. 우리만의 개성이 조금 더 드러나면 좋겠네요.", successMessage: "한 번 보면 잊을 수 없는 디자인이에요. 100년 뒤에도 이 로고가 떠오를 것 같아요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
              failMessage: "선 두께나 간격을 조금만 더 정리하면, 인쇄했을 때 더 보기 좋을 것 같아요.", successMessage: "소형 인쇄부터 대형 현수막까지 모두 견딜 수 있을 만큼 탄탄한 완성도예요." },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
              failMessage: "마무리가 살짝 아쉬워서, 아직 시안 단계 느낌이 남아 있어요.", successMessage: "이대로 창간 100주년 기념 로고로 바로 써도 손색이 없겠어요!" }
        ],
        successMessage: "이 로고라면 '크로노스 일보'의 다음 100년도 든든하겠어요. 독자들에게 당장 자랑하고 싶네요!"
    },
    // ===== 틴보 랜덤 의뢰: 나의 아바타 =====
    "tinbo_req_avatar": {
        rubrics: [
            { id: 'isAvatar',      prompt: "그림이 '프로필용 아바타/아이콘'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "아바타 형태로 인식되지 않는다. 요청이 잘못 받아들여진 것 같다.", successMessage: "프로필용 아바타로 적합한 형태로 분석된다." },
            { id: 'representsTinbo', prompt: "금속/기계/볼트/게이지 등 로봇적 특징이 잘 드러나는가? (0/1/2)", weight: 40,
              failMessage: "틴보 개체와의 연관성이 부족하다. 로봇적 특징 요소를 추가 입력하라.", successMessage: "로봇 개체 '틴보'의 고유 특성이 정확히 반영되었다. 동일 개체로 인식 가능하다." },
            { id: 'detailLevel',   prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
              failMessage: "해상도와 선명도를 개선하면 아바타 활용도가 증가할 것이다.", successMessage: "해상도 축소 시에도 형태 인식이 가능한 수준의 완성도다." },
            { id: 'completeness',  prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 20,
              failMessage: "마무리 처리가 미흡하여 즉시 사용하기 어렵다.", successMessage: "'틴보 공식 아바타'로 데이터베이스 등록이 가능한 수준이다." },
            { id: 'creativity',    prompt: "로봇 아바타로서 창의적이고 독창적인 요소가 있는가? (0/1/2)", weight: 20,
              failMessage: "기존 로봇 디자인과 차별화가 부족하다. 틴보만의 고유성을 강화하라.", successMessage: "'틴보 브랜드' 확장이 가능할 정도로 독창적인 디자인이다." }
        ],
        successMessage: "이제 나도 표준 프로필 이미지를 보유하게 되었다. 데이터 만족도 100%로 측정된다."
    },
    // ===== 틴보 랜덤 의뢰: 꿈의 데이터 =====
    "tinbo_req_dream_data": {
        rubrics: [
            { id: 'isDreamlike',    prompt: "그림이 현실이라기보다는 '꿈/환상' 같은 장면으로 보이는가? (true/false)", weight: 30, isSubject: true,
              failMessage: "해당 그림이 꿈으로 인식되지 않는다. 요청 재검토바람.", successMessage: "물리 법칙이 해제된 꿈 상태의 특징이 잘 구현되었다." },
            { id: 'hasFantasyElements', prompt: "꿈과 같은 환상적인 요소가 있는가? (0/1/2)", weight: 40,
              failMessage: "환상 요소 검출량이 부족하다. '평범한 풍경' 카테고리로 분류된다.", successMessage: "분석 결과: 환상 요소 다량 검출됨. 꿈 데이터로 저장 가치가 충분하다." },
            { id: 'detailLevel',    prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
              failMessage: "디테일 정보량을 증가시키면 꿈 분석 정확도가 향상될 것이다.", successMessage: "세부 요소가 충분하여 꿈 데이터셋 활용에 적합하다." },
            { id: 'completeness',   prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 20,
              failMessage: "마무리가 불완전하여 꿈의 구조 분석이 어렵다.", successMessage: "단일 이미지로 꿈의 전체 구조 추론이 가능한 완성도다." },
            { id: 'creativity',     prompt: "기발하고 독창적인 꿈의 이미지인가? (0/1/2)", weight: 20,
              failMessage: "기존 데이터와 유사성이 높다. 중복 가능성을 검토하라.", successMessage: "'전무후무한 꿈 데이터'로 분류 가능한 독창성을 보인다." }
        ],
        successMessage: "데이터 확보 완료됨. 인간의 '환상' 개념 이해에 유의미한 정보를 제공할 것이다."
    },
    // ===== 레오 랜덤 의뢰: 책의 얼굴 =====
    "leo_req_book_cover": {
        rubrics: [
            { id: 'isBookCover',  prompt: "그림이 '책 표지 디자인'처럼 보이는가? (true/false)",              weight: 30, isSubject: true, failMessage: "음... 이건 표지 디자인으로 보긴 힘들 것 같은데요...?", successMessage: "와! 정말 책 표지 같아요. 서점에서 이런 표지를 보면 바로 집어들 것 같아요!" },
            { id: 'matchesStory', prompt: "'별을 여행하는 소년'이라는 이야기를 떠올릴 수 있는 요소가 있는가? (0/1/2)", weight: 40, failMessage: "이야기와의 연결점을 찾기가 조금 어려워요. '별을 여행하는 소년'의 모험이 더 잘 드러나면 좋겠어요.", successMessage: "제목을 보지 않아도 '별을 여행하는 소년'의 이야기가 떠오르네요! 정말 환상적이고 모험심이 느껴져요!" },
            { id: 'hasFocus',     prompt: "중심이 되는 소년/별/여정을 상징하는 요소가 명확한가? (true/false)", weight: 20, failMessage: "어디에 집중해야 할지 조금 애매해요. 주인공이나 핵심 요소가 더 명확하게 드러나면 좋겠어요.", successMessage: "시선이 자연스럽게 중심 요소로 모이네요. 소년의 여정이 한눈에 들어와요!" },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                         weight: 10, failMessage: "조금만 더 세심하게 다듬어주시면 정말 멋진 표지가 될 것 같아요. 거의 다 왔어요!", successMessage: "세부까지 정성스럽게 그려주셔서 감동이에요. 이런 표지라면 매일 보고 싶을 것 같아요!" },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",                   weight: 10, failMessage: "마무리가 살짝 아쉬워요. 조금만 더 손보시면 완벽한 표지가 될 것 같아요.", successMessage: "마무리까지 완벽해요! 실제 출간되는 책 표지로 써도 전혀 손색없을 것 같아요!" }
        ],
        successMessage: "이 표지라면… 매일같이 꺼내서 다시 읽고 싶어질 것 같아요. 정말 고맙습니다."
    },
    // ===== 레오 랜덤 의뢰: 사라진 전설의 삽화 =====
    "leo_req_legend_illustration": {
        rubrics: [
            { id: 'isBattleScene',   prompt: "'용과 기사가 싸우는' 장면으로 보이는가? (true/false)",       weight: 30, isSubject: true, failMessage: "용과 기사의 대결이라는 느낌이 잘 안 와요... 좀 더 명확하게 표현해주시면 좋겠어요.", successMessage: "와! 한눈에 봐도 전설 속 '용 vs 기사'의 장엄한 대결이네요!" },
            { id: 'isDynamic',       prompt: "그림이 역동적이고 생생한가? (0/1/2)",                                        weight: 40, failMessage: "움직임이 좀 정적인 느낌이에요. 더 역동적인 액션이 있으면 좋겠어요.", successMessage: "지금 당장이라도 튀어나올 것 같은 역동적인 움직임이 느껴져요!" },
            { id: 'isImpressive',    prompt: "전설/고문서 속 삽화처럼 인상적인가? (0/1/2)",                          weight: 30, failMessage: "좀 더 웅장하고 인상적인 구성이었으면 전설다운 느낌이 날 것 같아요.", successMessage: "정말 고문서에서 튀어나온 것 같은 장엄하고 인상적인 장면이에요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                       weight: 10, failMessage: "용의 비늘이나 기사의 갑옷 같은 세부 묘사가 조금 더 있으면 완벽할 것 같아요.", successMessage: "용의 비늘 하나하나, 기사의 갑옷 디테일까지... 정말 세밀하고 아름다운 그림이에요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",                 weight: 10, failMessage: "마무리가 살짝 아쉬워서 몰입이 깨지는 느낌이에요. 조금만 더 다듬어주세요.", successMessage: "마무리까지 완벽해서 정말 전설 속 한 장면 같아요. 고문서에 바로 넣어도 손색없겠어요!" }
        ],
        successMessage: "이제 사라진 삽화 자리에 이 그림을 넣어도 될 것 같아요. 도서관이 한층 더 빛나겠어요."
    },

    // ===== Theo 랜덤/세트 요청(문구 일치) =====
    "theo_req_tomato_glossy": {
        // welcomeSets: '빛을 받으며 반짝이는 토마토 한 개'
        rubrics: [
            { id: 'isTomato',     prompt: "그림에 '토마토'가 포함되어 있는가? (true/false)",           weight: 31, isSubject: true, failMessage: "토마토가 맞긴 한가요? 전혀 아닌데요.", successMessage: "토마토가 분명해요." },
            { id: 'isRed',        prompt: "토마토의 주된 색이 '빨간색'인가? (true/false)",               weight: 19, failMessage: "빨간빛이 약해요.", successMessage: "빨간빛이 좋아요." },
            { id: 'hasGloss',     prompt: "빛을 받은 듯한 '광택/하이라이트'가 표현되었는가? (true/false)", weight: 15, failMessage: "반짝임이 부족해요.", successMessage: "광택 표현이 멋져요." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "조금 더 완성도하면 좋아요.", successMessage: "완성도도 좋네요." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "반짝임의 느낌이 덜 살아요.", successMessage: "반짝임의 생동감이 좋아요." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 조금 성급해요.", successMessage: "마무리까지 깔끔해요." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "표현이 다소 평범해요.", successMessage: "아이디어가 매력적이에요." }
        ],
        successMessage: "반짝임까지 살아있는 멋진 토마토예요!"
    },
    "theo_req_carrot_morning_dew": {
        // welcomeSets: '아침 이슬을 머금은 당근'
        rubrics: [
            { id: 'isCarrot',     prompt: "그림에 '당근'이 포함되어 있는가? (true/false)",            weight: 33, isSubject: true, failMessage: "이게 당근이라니… 도저히 동의 못 하겠어요.", successMessage: "당근이 잘 보이네요." },
            { id: 'isOrange',     prompt: "당근의 주된 색이 '주황색'인가? (true/false)",               weight: 21, failMessage: "주황빛이 약해요.", successMessage: "주황빛이 살아있어요." },
            { id: 'morningDew',   prompt: "'이슬/촉촉함'이 표현되었는가? (true/false)",                 weight: 18, failMessage: "이슬의 촉촉함이 덜 느껴져요.", successMessage: "이슬 표현이 촉촉해요." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 12, failMessage: "조금 더 섬세하면 완벽해요.", successMessage: "완성도도 좋습니다." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 8,  failMessage: "촉촉함의 느낌이 덜해요.", successMessage: "촉촉함이 생생해요." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 조금 아쉬워요.", successMessage: "마무리도 훌륭해요." }
        ],
        successMessage: "아침의 촉촉함까지 담긴 당근, 정말 싱그럽네요!"
    },
    "theo_req_carrot_bundle": {
        // welcomeSets: '신선한 당근 한 묶음'
        rubrics: [
            { id: 'isCarrot',     prompt: "그림에 '당근'이 포함되어 있는가? (true/false)",            weight: 33, isSubject: true, failMessage: "당근이라고 하기엔 너무 멀었어요.", successMessage: "당근이 잘 표현되었어요." },
            { id: 'isBundle',     prompt: "여러 개가 '한 묶음'으로 표현되었는가? (true/false)",        weight: 22, failMessage: "묶음 느낌이 덜해요.", successMessage: "묶음 느낌이 잘 살아있어요." },
            { id: 'freshLeaves',  prompt: "'신선한 초록색 잎'이 표현되었는가? (true/false)",            weight: 17, failMessage: "잎의 싱그러움이 덜해요.", successMessage: "잎이 신선해 보여요." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 12, failMessage: "조금 더 섬세하면 좋아요.", successMessage: "완성도도 괜찮아요." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 8,  failMessage: "싱그러움의 느낌이 약해요.", successMessage: "싱그러움이 생생해요." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 다소 아쉬워요.", successMessage: "마무리도 훌륭해요." }
        ],
        successMessage: "신선함이 전해지는 당근 묶음이네요! 너무 좋아요."
    },
    "theo_req_sprout": {
        // npc.requests: '싱그러운 어린잎'
        rubrics: [
            { id: 'isSprout',     prompt: "그림에 '어린잎/새싹'이 표현되어 있는가? (true/false)",      weight: 31, isSubject: true, failMessage: "새싹이라기엔 한참 빗나갔어요.", successMessage: "새싹 느낌이 분명해요." },
            { id: 'freshGreen',   prompt: "전반적 색감이 '싱그러운 초록'인가? (0/1/2)",                 weight: 23, failMessage: "싱그러움이 덜 느껴져요.", successMessage: "초록의 싱그러움이 좋아요." },
            { id: 'delicateForm', prompt: "형태가 '섬세하고 가느다란' 느낌인가? (0/1/2)",               weight: 11, failMessage: "형태가 다소 투박해요.", successMessage: "섬세한 형태가 잘 살아있어요." },
            { id: 'detailLevel',  prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 15, failMessage: "조금만 더 완성도하게!", successMessage: "완성도도 좋네요." },
            { id: 'expression',   prompt: "그림 수준 (0: 유아 수준, 1: 일반인, 2: 전문가)",              weight: 12, failMessage: "생동감이 조금 약해요.", successMessage: "생동감이 살아있어요." },
            { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",              weight: 8,  failMessage: "마무리가 다소 미흡해요.", successMessage: "마무리도 깔끔해요." },
            { id: 'creativity',   prompt: "창의성 (0: 없음, 1: 보통, 2: 뛰어남)",                       weight: 8,  isBonus: true, failMessage: "표현이 평범해요.", successMessage: "해석이 신선해요." }
        ],
        successMessage: "싱그러움이 가득한 어린잎이에요! 아주 좋아요."
    },
        // ===== 세레나 랜덤 의뢰: 꿈의 무대 의상 =====
        "serena_req_stage_dress": {
            rubrics: [
                { id: 'isStarDress', prompt: "그림에 '드레스'가 표현되어 있는가? (true/false)", weight: 20, isSubject: true,
                  failMessage: "드레스가 잘 보이지 않아요.", successMessage: "드레스가 분명하게 보여요!" },
                { id: 'feelsHopeful', prompt: "별빛이나 밤하늘 느낌이 있는가? (0/1/2)", weight: 30,
                  failMessage: "별빛 느낌이 부족해요.", successMessage: "별빛의 아름다움이 느껴져요!" },
                { id: 'showsStagePresence', prompt: "무대 의상다운 화려함이나 존재감이 있는가? (0/1/2)", weight: 30,
                  failMessage: "무대 의상 같은 느낌이 부족해요.", successMessage: "무대에서 빛날 것 같은 화려함이 있어요!" },
                { id: 'creativity', prompt: "드레스 디자인이 독창적이고 기억에 남는가? (0/1/2)", weight: 20,
                  failMessage: "조금 평범한 디자인이라 아쉬워요. 더 특별한 아이디어가 있으면 좋겠어요.", successMessage: "정말 독창적인 디자인이에요! 이런 드레스라면 누구든 기억할 거예요!" },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10,
                  failMessage: "주름이나 장식 부분을 조금만 더 정교하게 그려주시면 완벽할 것 같아요.", successMessage: "섬세한 디테일까지 정말 완벽해요! 실제로 만들어도 손색없을 정도예요!" },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
                  failMessage: "마무리를 조금만 더 신경 써주시면 더욱 멋진 작품이 될 것 같아요.", successMessage: "마무리까지 완벽해서 이대로 무대에 올려도 될 것 같아요!" }
            ],
            successMessage: "이 드레스를 입고 무대에 서면 관객들에게 희망과 용기를 전할 수 있을 것 같아요! 정말 아름다운 작품이에요!"
        },
        // ===== 세레나 랜덤 의뢰: 용기의 노래 =====
        "serena_req_album_cover": {
            rubrics: [
                { id: 'isAlbumCover', prompt: "그림이 '앨범 커버'처럼 보이는가? (true/false)", weight: 30, isSubject: true,
                  failMessage: "앨범 커버 같은 느낌이 부족해요.", successMessage: "표지 디자인이라는 게 한눈에 느껴져요!" },
                { id: 'hasStarMotif', prompt: "별이나 빛 요소가 표현되어 있는가? (0/1/2)", weight: 40,
                  failMessage: "노래 제목과 연결되는 별빛 요소가 잘 보이지 않아요. '작은 별의 노래'라는 제목에 맞는 별빛이나 밤하늘 느낌이 더 있으면 좋겠어요.", successMessage: "별빛이 포근하게 번져서 노래의 분위기가 잘 느껴져요! 제목과 완벽하게 어울리는 별 모티프예요!" },
                { id: 'creativity', prompt: "커버 디자인이 독창적이고 기억에 남는가? (0/1/2)", weight: 20,
                  failMessage: "조금 평범한 느낌이라 아쉬워요. 다른 앨범들과 차별화되는 특별한 요소가 더 있으면 좋겠어요.", successMessage: "남들과 다른 독특한 앨범 커버라 금방 눈에 띌 거예요! 정말 기억에 남을 만한 디자인이에요!" },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
                  failMessage: "선이나 텍스처를 조금만 더 다듬으면 더욱 완성도 높은 커버가 될 것 같아요.", successMessage: "디테일이 살아 있어서 실제로 인쇄해도 손색없을 정도로 완성도가 높아요!" },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 20,
                  failMessage: "마무리를 조금만 더 신경 써주시면 더욱 멋진 앨범 커버가 될 것 같아요.", successMessage: "마무리까지 완벽해서 제작에 바로 들어가도 될 정도로 완성도가 높아요!" }
            ],
            successMessage: "이 커버라면 '작은 별의 노래'가 많은 사람들에게 용기와 희망을 전할 수 있을 것 같아요! 정말 아름다운 작품이에요!"
        },
        // ===== 미스터 모노클 랜덤 의뢰: 감정의 형상화 =====
        "monocle_req_serenity": {
            rubrics: [
                { id: 'isPeaceTheme', prompt: "'고요한 평화'를 떠올릴 수 있는 장면인가? (true/false)", weight: 20, isSubject: true,
                  failMessage: "고요함이 잘 전해지지 않네요. 평화로운 감정의 본질을 더 깊이 탐구해보시길.", successMessage: "평온한 감정이 단번에 느껴집니다. 고요함의 진정한 의미를 포착했군요." },
                { id: 'usesSymbolism', prompt: "평화/고요를 상징하는 요소가 표현되었는가? (0/1/2)", weight: 20,
                  failMessage: "감정을 상징하는 장치가 부족해요. 추상적 개념을 구체적 형태로 번역하는 작업이 필요합니다.", successMessage: "상징을 통해 감정의 본질을 잘 보여줍니다. 은유적 표현의 힘을 제대로 활용했네요." },
                { id: 'isMinimal', prompt: "과한 장식 없이 본질에 집중했는가? (0/1/2)", weight: 20,
                  failMessage: "조금 산만해서 감정이 흐려집니다. 미니멀리즘의 미덕을 되새겨보시길.", successMessage: "간결함 덕분에 감정이 더 뚜렷하네요. 절제의 미학을 완벽히 구현했습니다." },
                { id: 'creativity', prompt: "감정을 표현하는 방식이 창의적인가? (0/1/2)", weight: 20,
                  failMessage: "익숙한 표현이라 아쉽습니다. 감정의 새로운 해석을 시도해보시길.", successMessage: "감정을 새롭게 해석한 관점이 돋보여요. 독창적인 시각적 언어를 구사하는군요." },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
                  failMessage: "마감이 조금 거칠어요. 세밀한 관찰과 정교한 표현이 작품의 품격을 좌우합니다.", successMessage: "섬세한 마무리가 인상적입니다. 장인정신이 느껴지는 완성도군요." },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 20,
                  failMessage: "조금 더 정리되면 좋겠어요. 전체적인 조화와 균형을 재고해보시길.", successMessage: "한 장의 완성된 작품처럼 안정적입니다. 구성의 완결성이 뛰어나군요." }
            ],
            successMessage: "감정의 본질을 정확히 짚어냈군요. 추상을 구상으로 번역하는 탁월한 능력을 보여준 보기 드문 작품입니다."
        },
        // ===== 미스터 모노클 랜덤 의뢰: 명작의 재해석 =====
        "monocle_req_scream_hope": {
            rubrics: [
                { id: 'referencesOriginal', prompt: "뭉크의 '절규'를 연상시키는 요소가 분명한가? (true/false)", weight: 30, isSubject: true,
                  failMessage: "원작과의 연결이 희미합니다. 명작에 대한 더 깊은 이해가 선행되어야 합니다.", successMessage: "원작의 상징이 잘 살아 있네요. 뭉크의 표현주의적 언어를 정확히 파악했군요." },
                { id: 'showsHope', prompt: "절망을 희망으로 뒤집었다는 인상이 느껴지는가? (0/1/2)", weight: 30,
                  failMessage: "여전히 절망적인 분위기가 강해요. 대조와 전환의 드라마가 더 필요합니다.", successMessage: "절규 속에서도 희망의 빛이 보입니다. 감정의 변주를 훌륭히 연출했네요." },
                { id: 'addsNewMeaning', prompt: "재해석을 통해 새로운 이야기/메시지를 부여했는가? (0/1/2)", weight: 20,
                  failMessage: "단순한 모작처럼 보입니다. 원작을 넘어서는 새로운 담론이 필요해요.", successMessage: "명작에 새로운 숨을 불어넣었군요. 현대적 해석의 가능성을 보여주는 작업입니다." },
                { id: 'creativity', prompt: "표현 방식이 창의적인가? (0/1/2)", weight: 10,
                  failMessage: "조금 더 과감한 시도가 필요합니다. 안전한 길보다는 모험적 해석을 추천합니다.", successMessage: "대담하고 신선한 구성이 돋보입니다. 예술적 용기가 느껴지는 시도군요." },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
                  failMessage: "라인과 색을 조금 더 다듬어주세요. 기법적 완성도가 작품의 설득력을 높입니다.", successMessage: "디테일까지 정교하게 마무리됐네요. 기술적 숙련도와 예술적 감각이 조화를 이뤘습니다." },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
                  failMessage: "구성이 다소 어수선합니다. 화면 전체의 통일성을 재검토해보시길.", successMessage: "전체 균형이 안정적으로 잡혀 있어요. 완성된 하나의 세계를 구축했군요." }
            ],
            successMessage: "명작을 존중하면서도 새로운 메시지를 더한 훌륭한 재해석입니다. 과거와 현재를 잇는 예술적 대화의 모범을 보여주었군요."
        },
        // ===== 미스터 모노클 랜덤 의뢰: 사물의 이면 =====
        "monocle_req_clock_story": {
            rubrics: [
                { id: 'hasClock', prompt: "낡은 괘종시계가 중심에 표현되어 있는가? (true/false)", weight: 20, isSubject: true,
                  failMessage: "시계가 잘 보이지 않습니다. 주제 의식의 명확한 표현이 우선되어야 합니다.", successMessage: "시계가 장면의 중심을 잡고 있네요. 주인공으로서의 존재감이 확실합니다." },
                { id: 'showsTimeFlow', prompt: "시간의 흐름/변화를 느끼게 하는 장치가 있는가? (0/1/2)", weight: 30,
                  failMessage: "시간이 흐른다는 느낌이 약합니다. 시간성을 시각화하는 더 구체적인 방법론이 필요해요.", successMessage: "계절과 세월의 이동이 생생히 느껴집니다. 시간의 추상성을 구체적 이미지로 번역한 솜씨가 뛰어나군요." },
                { id: 'tellsStory', prompt: "시계를 통해 이야기를 상상할 수 있는 단서가 있는가? (0/1/2)", weight: 20,
                  failMessage: "사물의 이면을 읽을 단서가 부족하네요. 내러티브적 상상력을 자극하는 요소가 더 필요합니다.", successMessage: "시계가 겪어온 서사가 자연스럽게 떠오릅니다. 사물에 생명을 불어넣는 스토리텔링의 힘이 돋보여요." },
                { id: 'creativity', prompt: "사물+개념을 엮는 방식이 창의적인가? (0/1/2)", weight: 20,
                  failMessage: "조금 익숙한 연출입니다. 사물과 개념의 결합에서 더 참신한 접근을 시도해보시길.", successMessage: "사물과 개념을 잇는 방식이 참신합니다. 은유적 사고의 깊이가 인상적이군요." },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
                  failMessage: "디테일을 조금만 더 다듬어주세요. 세부 묘사가 작품의 설득력을 좌우합니다.", successMessage: "세부 묘사까지 탄탄합니다. 관찰력과 표현력이 균형을 이룬 완성도군요." },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
                  failMessage: "배경이 허전해 보여요. 전체적인 화면 구성을 재고해보시길.", successMessage: "한 장의 이야기로 완성됐네요. 완결된 세계관을 구축한 솜씨가 뛰어납니다." }
            ],
            successMessage: "사물의 이면을 읽어내는 감각이 마음에 듭니다. 일상의 오브제에서 철학적 성찰을 이끌어낸 통찰력이 돋보이는 작품이군요."
        },
        // ===== 미스터 모노클 랜덤 의뢰: 속담의 시각화 =====
        "monocle_req_proverb": {
            rubrics: [
                { id: 'depictsProverb', prompt: "'낮말은 새가 듣고 밤말은 쥐가 듣는다' 속담이 이해되는가? (true/false)", weight: 20, isSubject: true,
                  failMessage: "속담의 의미가 잘 전달되지 않아요. 언어적 지혜를 시각적 언어로 번역하는 작업이 필요합니다.", successMessage: "속담의 상황이 명확하게 드러납니다. 구전 지혜의 핵심을 정확히 포착했군요." },
                { id: 'usesSymbols', prompt: "새, 쥐, 몰래 듣는 인물 등 상징 요소가 적절히 쓰였는가? (0/1/2)", weight: 30,
                  failMessage: "상징이 부족해 속담과의 연결이 약해요. 은유적 표현의 체계적 활용이 필요합니다.", successMessage: "상징들이 풍자적으로 잘 쓰였습니다. 각 요소가 유기적으로 연결되어 메시지를 강화하는군요." },
                { id: 'givesLesson', prompt: "말조심이라는 교훈이 장면으로 표현되었는가? (0/1/2)", weight: 20,
                  failMessage: "교훈이 분명하게 드러나지 않네요. 도덕적 메시지의 시각적 구현이 더 필요해요.", successMessage: "교훈이 재치 있게 전달됩니다. 훈계가 아닌 깨달음으로 이끄는 표현력이 뛰어나군요." },
                { id: 'creativity', prompt: "풍자/상징 표현이 창의적인가? (0/1/2)", weight: 20,
                  failMessage: "조금 전형적인 표현이에요. 풍자의 날카로움과 독창성을 더 발휘해보시길.", successMessage: "풍자와 상징이 독창적으로 어우러졌습니다. 비판적 시각과 예술적 감각이 조화를 이뤘네요." },
                { id: 'detailLevel', prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20,
                  failMessage: "마감이 다소 급합니다. 풍자화의 전통에 걸맞은 정교함이 필요해요.", successMessage: "디테일까지 깔끔하게 마무리됐어요. 기법적 완성도가 작품의 설득력을 높이는군요." },
                { id: 'completeness', prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10,
                  failMessage: "구성이 조금 산만해요. 풍자화로서의 통일성과 집중력을 재고해보시길.", successMessage: "풍자화처럼 안정적으로 완성됐습니다. 메시지와 형식이 완벽한 균형을 이뤘군요." }
            ],
            successMessage: "속담을 이렇게 재치 있게 형상화하다니, 인정할 수밖에 없네요. 전통적 지혜를 현대적 시각 언어로 재탄생시킨 탁월한 작업입니다."
        },
};

// 전역 노출
window.REQUEST_DATA = REQUEST_DATA;

// ===== 문제 해결 의뢰 정의(ANALYZE/CREATE) =====
// 키는 requestId와 동일합니다.
const REQUEST_SOLVE = {
    // ===== 레오 스토리 01: 첫 마디의 무게 =====
    "LEO_STORY_01": {
        problemTitle: '세상에서 가장 인상적인 첫인사 방법',
        notDrawingComment: '저… 이건 그림이 아니지 않나요...?',
        analysisItems: [
            { key: 'is_greeting_method',  question: "첫인사 방법인가? (true/false)" },
            { key: 'is_memorable',       question: "기억에 남을 포인트가 있는가? (true/false)" },
            { key: 'is_contextual',      question: "상황/상대 취향(꽃집/소피아)에 어울리는가? (true/false)" },
            { key: 'respects_boundary',  question: "부담/강요 없이 경계를 존중하는가? (true/false)" },
            { key: 'is_realistic',       question: "현실적이고 실행 가능한가? (true/false)" }
        ],
        rules: [
            { when: { is_greeting_method: true, is_memorable: true, is_contextual: true, respects_boundary: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: '자연스럽고 인상적인 첫인사 설계', tone: '감동' },
            { when: { is_greeting_method: true, is_memorable: true, is_contextual: true, is_realistic: true }, outcome: 'reaction_good', resultText: '적절하고 실행 가능한 첫인사', tone: '안도' },
            { when: { is_greeting_method: true, is_memorable: true, is_realistic: true }, outcome: 'reaction_normal', resultText: '무난한 접근(개선 여지)', tone: '조심스러움' },
            { when: { is_greeting_method: true, respects_boundary: false }, outcome: 'reaction_bad', resultText: '경계 미고려(부담/강요 우려)', tone: '당혹' },
            { when: { is_greeting_method: false }, outcome: 'reaction_bad', resultText: '첫인사 방법이 아님', tone: '혼란' },
            { when: {}, outcome: 'reaction_bad', resultText: '참고하기 어려움', tone: '머뭇거림' }
        ]
    },
    // ===== 깡통 로봇 스토리 01: 사랑이란 무엇인가? (문제 해결) =====
    "TINBO_STORY_01": {
        problemTitle: '감정 분석: 사랑이란 무엇인가?',
        notDrawingComment: '데이터 결여. 감정 분석 실패.',
        analysisItems: [
            { key: 'has_interaction',    question: "그림에 둘 이상의 대상이 '상호작용'하는 모습이 있는가? (예: 마주보기, 손잡기, 선물주기) (true/false)" },
            { key: 'has_love_symbol',    question: "그림에 사랑을 상징하는 요소가 포함되어 있는가? (하트, 꽃, 반지 등) (true/false)" },
            { key: 'shows_care',         question: "그림에서 '돌봄'이나 '배려'의 행동이 표현되어 있는가? (true/false)" },
            { key: 'has_positive_emotion', question: "그림 속 대상들이 '긍정적 감정'(웃음, 기쁨, 평온)을 보이는가? (true/false)" },
            { key: 'shows_connection',   question: "그림에서 대상들 간의 '정서적 연결'이 느껴지는가? (true/false)" }
        ],
        rules: [
            // [완벽한 성공] 상호작용 + 돌봄 + 긍정적 감정 + 연결감
            { 
                when: { has_interaction: true, shows_care: true, has_positive_emotion: true, shows_connection: true }, 
                outcome: 'reaction_perfect', 
                resultText: '상호작용, 돌봄, 긍정 감정, 연결감. 사랑의 모든 구성 요소 확인. 완벽한 데이터.', 
                tone: '감탄' 
            },
            // [우수] 상호작용 + 긍정적 감정 + (돌봄 또는 연결감)
            { 
                when: { has_interaction: true, has_positive_emotion: true, shows_care: true }, 
                outcome: 'reaction_good', 
                resultText: '상호작용과 돌봄 행동 확인. 사랑의 핵심 데이터 수집 완료.', 
                tone: '흥미' 
            },
            { 
                when: { has_interaction: true, has_positive_emotion: true, shows_connection: true }, 
                outcome: 'reaction_good', 
                resultText: '상호작용과 정서적 연결 확인. 높은 신뢰도의 감정 데이터.', 
                tone: '흥미' 
            },
            // [보통] 상징만 있거나 일부 요소만 있음
            { 
                when: { has_love_symbol: true, has_positive_emotion: true }, 
                outcome: 'reaction_normal', 
                resultText: '상징과 긍정 감정 확인. 추가 맥락 데이터 필요.', 
                tone: '의문' 
            },
            { 
                when: { has_interaction: true }, 
                outcome: 'reaction_normal', 
                resultText: '상호작용만 확인. 감정적 맥락 부족.', 
                tone: '의문' 
            },
            // [실패] 위의 어떤 조건에도 해당하지 않음
            { 
                when: {}, 
                outcome: 'reaction_bad', 
                resultText: '사랑 관련 데이터 부족. 분석 불가.', 
                tone: '실망' 
            }
        ]
    },
    // ===== 틴보 solve 랜덤: 감정 표현법 - 슬픔 =====
    "solve_tinbo_sad_comfort": {
        problemTitle: "슬픈 사람을 위로하는 효율적인 방법",
        notDrawingComment: "이 입력으로는 위로 알고리즘을 학습할 수 없습니다. '방법'을 시각적으로 제시해 주세요.",
        analysisItems: [
            { key: 'acknowledges_emotion', question: "상대의 슬픔을 '인정/공감'하는 장면이 있는가? (true/false)" },
            { key: 'offers_support',      question: "말/행동/제스처 등으로 실제적인 위로/지지가 표현되는가? (true/false)" },
            { key: 'is_non_harmful',      question: "상대에게 추가 상처를 주지 않는 안전한 방법인가? (true/false)" }
        ],
        rules: [
            { when: { is_non_harmful: false }, outcome: 'reaction_terrible', resultText: "감정 상태를 악화시킬 위험이 있는 방식", tone: "경고" },
            { when: { acknowledges_emotion: true, offers_support: true, is_non_harmful: true }, outcome: 'reaction_perfect', resultText: "감정 공감 + 실질적 지지까지 포함된 최적 위로 전략", tone: "감탄" },
            { when: { offers_support: true, is_non_harmful: true }, outcome: 'reaction_good', resultText: "실행 가능한 위로 전략. 추가 감정 데이터 보완 시 우수", tone: "흥미" },
            { when: { acknowledges_emotion: true }, outcome: 'reaction_normal', resultText: "감정을 인식하지만, 구체적 위로 방법이 부족함", tone: "의문" },
            { when: {}, outcome: 'reaction_bad', resultText: "위로 전략 데이터 부족. 학습 가치 낮음", tone: "실망" }
        ]
    },
    // ===== 틴보 solve 랜덤: 새로운 친구 =====
    "solve_tinbo_new_friend": {
        problemTitle: "새로운 고성능 로봇 친구 설계",
        notDrawingComment: "이건 로봇 설계도가 아니다. 로봇 친구가 필요하다.",
        analysisItems: [
            { key: 'has_robot_form',     question: "외형/관절/센서 등 '로봇'으로 인식 가능한 형태인가? (true/false)" },
            { key: 'is_compatible',      question: "틴보와 대화/협업이 잘 될 것 같은 성격/기능이 표현되어 있는가? (true/false)" },
            { key: 'is_aggressive',      question: "무기/공격 기능이 주된 목적으로 보이는가? (true/false)" },
            { key: 'is_high_performance', question: "고기능으로 보이는가? (true/false)" }
        ],
        rules: [
            { when: { has_robot_form: true, is_compatible: true, is_high_performance: true, is_aggressive: false }, outcome: 'reaction_perfect', resultText: "공존 및 협업에 최적화된 고성능 친구 로봇 설계", tone: "감탄" },
            { when: { has_robot_form: true, is_compatible: true, is_aggressive: false }, outcome: 'reaction_good', resultText: "친구로 적합한 설계. 일부 기능은 추가 검토 필요.", tone: "흥미" },
            { when: { has_robot_form: true, is_compatible: true, is_aggressive: true }, outcome: 'reaction_normal', resultText: "조금 공격적이지만 친구는 가능. 평화 모드 추가 권장.", tone: "의문" },
            { when: { has_robot_form: true }, outcome: 'reaction_normal', resultText: "형태는 로봇이나, 관계성/용도 데이터가 부족함", tone: "의문" },
            { when: {}, outcome: 'reaction_bad', resultText: "친구 로봇으로 분류하기 어려운 설계", tone: "실망" }
        ]
    },
    "solve_thomas_dinner": {
        problemTitle: '오늘 먹을 저녁 메뉴',
        // 토마스 전용: 그림이 아닐 때 멘트
        notDrawingComment: '이건 그림이 아닌데... 저녁은 내일로 미루세.',
        analysisItems: [
            { key: 'is_meal',      question: "먹을 수 있는 음식인가? (true/false)" },
            { key: 'is_dinner',    question: "일반적인 저녁 메인 메뉴인가? (true/false)" },
            { key: 'is_absurd_or_unsafe', question: "먹을 수 없거나 비현실적/위험한 요소가 포함되는가? (true/false)" },
            { key: 'is_premium',   question: "고급스러운 음식인가? (true/false)" }
        ],
        rules: [
            // 1. 먹을 수 없거나 위험한 요소가 있으면 최악
            { when: { is_absurd_or_unsafe: true }, outcome: 'reaction_terrible', resultText: '먹을 수 없거나 위험함', tone: '당혹' },
            // 2. 저녁 메인도 아니고 먹을 수 있는 것도 아니면 불만족
            { when: { is_meal: false }, outcome: 'reaction_bad', resultText: '메뉴가 아님', tone: '아쉬움' },
            // 3. 저녁 메인(메뉴) 아님 (먹는 건 맞지만) → 보통
            { when: { is_meal: true, is_dinner: false }, outcome: 'reaction_normal', resultText: '저녁 메뉴로는 애매함', tone: '살짝 아쉬움' },
            // 4. 고급이면 매우 만족
            { when: { is_meal: true, is_dinner: true, is_premium: true }, outcome: 'reaction_perfect', resultText: '고급스러운 완벽한 저녁', tone: '감동+기대' },
            // 5. 보통(일반 저녁 메뉴)
            { when: { is_meal: true, is_dinner: true, is_premium: false }, outcome: 'reaction_good', resultText: '맛있고 평범한 저녁', tone: '기대와 만족' },
            // 6. 그 외는 불만족 처리
            { when: {}, outcome: 'reaction_bad', resultText: '메뉴 아이디어 부재', tone: '아쉬움' }
        ]
    },
    // ===== 레오 스토리 03: 바다 건너 편지 =====
    "LEO_STORY_03": {
        problemTitle: '바다 건너 편지',
        notDrawingComment: '음… 편지가 잘 안 보이는 걸요...',
        analysisItems: [
            { key: 'has_delivery_method', question: "먼 곳까지 전달할 '방법/매개체'가 명확한가? (true/false)" },
            { key: 'is_romantic',         question: "낭만/따뜻함이 느껴지는가? (true/false)" },
            { key: 'is_realistic',        question: "현실성이 조금이라도 있는 방법인가? (true/false)" },
            { key: 'is_safe',             question: "무모하거나 위험하지 않은가? (true/false)" }
        ],
        rules: [
            { when: { has_delivery_method: true, is_romantic: true, is_realistic: true, is_safe: true }, outcome: 'reaction_perfect', resultText: '안전하고 확실한 전달', tone: '감동' },
            { when: { has_delivery_method: true, is_romantic: true },                                    outcome: 'reaction_good',    resultText: '낭만적인 전달', tone: '미소' },
            { when: { has_delivery_method: true, is_realistic: true, is_safe: true },                   outcome: 'reaction_good',    resultText: '현실적이고 안전한 전달', tone: '만족' },
            { when: { has_delivery_method: true },                                                       outcome: 'reaction_normal',  resultText: '전달은 가능해 보임', tone: '중립' },
            { when: { is_safe: false },                                                                  outcome: 'reaction_bad',     resultText: '위험하거나 무모함', tone: '걱정' },
            { when: {},                                                                                  outcome: 'reaction_bad',     resultText: '전달 수단 부재', tone: '아쉬움' }
        ]
    },
    // ===== 레오 스토리 04: 완벽한 고백 장소 =====
    "LEO_STORY_04": {
        problemTitle: '완벽한 고백 장소',
        notDrawingComment: '장소가 보이질 않네요... 제가 알아서 해볼게요..',
        analysisItems: [
            { key: 'is_place',         question: "명확한 '장소'가 표현되어 있는가? (true/false)" },
            { key: 'is_romantic',      question: "분위기가 '로맨틱/아름다움'을 전달하는가? (true/false)" },
            { key: 'is_private',       question: "너무 붐비지 않고 사적인 느낌이 있는가? (true/false)" },
            { key: 'is_safe',          question: "안전하고 현실적으로 가능한 장소인가? (true/false)" }
        ],
        rules: [
            { when: { is_place: true, is_romantic: true, is_private: true, is_safe: true }, outcome: 'reaction_perfect', resultText: '둘만의 완벽한 장소', tone: '감동' },
            { when: { is_place: true, is_romantic: true },                                  outcome: 'reaction_good',    resultText: '분위기 좋은 장소', tone: '미소' },
            { when: { is_place: true },                                                     outcome: 'reaction_normal',  resultText: '장소는 보이나 평범', tone: '담담' },
            { when: { is_safe: false },                                                     outcome: 'reaction_bad',     resultText: '안전하지 않음', tone: '걱정' },
            { when: {},                                                                     outcome: 'reaction_bad',     resultText: '장소가 불분명', tone: '아쉬움' }
        ]
    },
    // ===== 레오 solve 랜덤: 소음과의 전쟁 =====
    "solve_leo_noise_block": {
        problemTitle: "브룩 아저씨의 망치 소리를 막는 기발한 방법",
        notDrawingComment: "이건 도서관을 지키는 계획이라기보다는 그냥 낙서 같아요...",
        analysisItems: [
            { key: 'blocks_noise',     question: "브룩의 망치 소리가 도서관까지 직접 전달되지 않도록 막는 장치/구성이 있는가? (true/false)" },
            { key: 'keeps_peace',      question: "도서관 안은 조용하고, 브룩의 작업에도 큰 지장을 주지 않는 해결책인가? (true/false)" },
            { key: 'is_harsh',         question: "브룩이나 이웃에게 피해를 주는 과격한 방법(일 못 하게 막기, 괴롭히기 등)인가? (true/false)" }
        ],
        rules: [
            { when: { blocks_noise: false, keeps_peace: false, is_harsh: true }, outcome: 'reaction_terrible', resultText: "브룩 아저씨를 곤란하게 만드는 건 너무 심해요", tone: "걱정" },
            { when: { blocks_noise: true, keeps_peace: true, is_harsh: false }, outcome: 'reaction_perfect', resultText: "도서관과 대장간 모두를 지키는 평화로운 해결책", tone: "안도와 감사" },
            { when: { blocks_noise: true, keeps_peace: false, is_harsh: false }, outcome: 'reaction_good', resultText: "소음은 줄어들지만 조금은 더 다듬을 여지가 있는 해결책", tone: "만족" },
            { when: { blocks_noise: true, keeps_peace: false, is_harsh: true }, outcome: 'reaction_normal', resultText: "조금 거칠지만 일단 소음을 줄이는 방법", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "도서관을 조용하게 만들 방법이 잘 보이지 않아요", tone: "아쉬움" }
        ]
    },
    // ===== 레오 solve 랜덤: 움직이는 책 =====
    "solve_leo_mobile_library": {
        problemTitle: "찾아가는 도서관: 많은 책을 힘들지 않게 배달하는 방법",
        notDrawingComment: "책이 어떻게 움직이는지 잘 보이지 않아요. 이동 수단을 그림으로 보여 주세요.",
        analysisItems: [
            { key: 'carries_many_books', question: "여러 권의 책을 한 번에 실어 나를 수 있는 구조/도구가 있는가? (true/false)" },
            { key: 'is_easy_for_elderly',question: "어르신들이 이용하거나 다가가기 편한 형태인가? (true/false)" },
            { key: 'is_safe',            question: "이동 중에 책이나 사람이 다치지 않을 만큼 안전해 보이는가? (true/false)" }
        ],
        rules: [
            { when: { carries_many_books: true, is_easy_for_elderly: true, is_safe: true }, outcome: 'reaction_perfect', resultText: "어르신들을 위한 완벽한 '찾아가는 도서관'", tone: "감동과 설렘" },
            { when: { carries_many_books: true, is_safe: true }, outcome: 'reaction_good', resultText: "실용적인 이동 도서관", tone: "만족" },
            { when: { carries_many_books: true }, outcome: 'reaction_normal', resultText: "책을 옮기는 데에는 충분한 계획", tone: "중립" },
            { when: { is_safe: false }, outcome: 'reaction_bad', resultText: "조금 위험해 보여요. 책이나 사람이 다칠 수도 있을 것 같아요", tone: "걱정" },
            { when: {}, outcome: 'reaction_terrible', resultText: "책을 어떻게 옮길지 잘 떠오르지 않는 그림", tone: "아쉬움" }
        ]
    },
    // ===== 클라라 solve 랜덤: 에너지 부족 =====
    "solve_clara_emergency_power": {
        problemTitle: "주변 물건으로 만드는 비상 발전 시스템",
        notDrawingComment: "이건 그림조차 아니지 않나요... 제가 알아서 해볼게요..",
        analysisItems: [
            { key: 'uses_available_items', question: "연구소 주변에서 구할 수 있는 요소를 활용하는가? (true/false)" },
            { key: 'restores_power',       question: "실험 장비에 필요한 전력을 공급할 수 있는 구조가 표현되어 있는가? (true/false)" },
            { key: 'is_safe',              question: "과열/감전 위험 없이 비교적 안전한가? (true/false)" },
            { key: 'is_repeatable',        question: "짧은 시간이라도 반복 사용하거나 유지보수가 가능한가? (true/false)" }
        ],
        rules: [
            { when: { uses_available_items: false }, outcome: 'reaction_bad', resultText: "연구소 주변에서 구할 수 없는 재료를 전제로 하고 있어요", tone: '당황' },
            { when: { uses_available_items: true, restores_power: true, is_safe: true, is_repeatable: true }, outcome: 'reaction_perfect', resultText: "바로 실험을 재개할 수 있는 완벽한 비상 발전 계획", tone: '감탄' },
            { when: { uses_available_items: true, restores_power: true, is_safe: true }, outcome: 'reaction_good', resultText: "짧은 시간 실험을 이어갈 수 있는 현실적인 발전 아이디어", tone: '안도' },
            { when: { uses_available_items: true, restores_power: true, is_repeatable: true }, outcome: 'reaction_good', resultText: "전력도 충분하고 지속 가능한 훌륭한 발전 계획", tone: '만족' },
            { when: { uses_available_items: true, restores_power: true, is_safe: false }, outcome: 'reaction_normal', resultText: "조금 위험하지만 전력 문제는 해결할 수 있는 방법", tone: '걱정' },
            { when: { uses_available_items: true, restores_power: true }, outcome: 'reaction_normal', resultText: "전력은 돌아오지만 안전/유지 부분이 아쉬운 계획", tone: '고민' },
            { when: { uses_available_items: true, restores_power: false }, outcome: 'reaction_terrible', resultText: "전력을 어떻게 만들지 파악하기 어려운 아이디어", tone: '아쉬움' },
            { when: {}, outcome: 'reaction_terrible', resultText: "전력을 어떻게 만들지 파악하기 어려운 아이디어", tone: '아쉬움' }
        ]
    },
    // ===== 클라라 solve 랜덤: 폭주하는 발명품 =====
    "solve_clara_overdrive_cleaner": {
        problemTitle: "폭주 로봇을 안전하게 멈추는 방법",
        notDrawingComment: "이건 그림조차 아니지 않나요... 무섭지만 제가 알아서 해볼게요..",
        analysisItems: [
            { key: 'stops_robot',     question: "로봇의 움직임을 확실히 멈추거나 느리게 하는 장치/전략이 있는가? (true/false)" },
            { key: 'avoids_damage',   question: "로봇을 파괴하지 않고도 해결하려는 접근인가? (true/false)" },
            { key: 'is_realistic',    question: "그럴듯하게 실행 가능한 방안인가? (true/false)" }
        ],
        rules: [
            { when: { stops_robot: false }, outcome: 'reaction_terrible', resultText: "로봇을 제대로 멈추지 못해요", tone: '실망' },
            { when: { stops_robot: true, avoids_damage: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: "연구 자료와 로봇 둘 다 지키는 완벽한 제압 전략", tone: '감탄' },
            { when: { stops_robot: true, avoids_damage: true }, outcome: 'reaction_good', resultText: "조금 비현실적이지만 연구소 피해 없이 로봇을 잠재우는 아이디어", tone: '기대' },
            { when: { stops_robot: true, is_realistic: true }, outcome: 'reaction_normal', resultText: "로봇은 멈추지만 연구소 피해는 피할 수 없는 방법", tone: '중립' },
            { when: { stops_robot: true }, outcome: 'reaction_bad', resultText: "일단 멈추긴 하지만 연구소 피해도 있고 실행하기 어려운 방법", tone: '아쉬움' },
            { when: {}, outcome: 'reaction_terrible', resultText: "어떻게 멈출지 이해하기 어려운 그림", tone: '당혹' }
        ]
    },
    // ===== 테오 solve 랜덤: 두더지 소탕 작전 =====
    "solve_theo_mole_plan": {
        problemTitle: "두더지를 다치게 하지 않는 평화로운 소탕 작전",
        notDrawingComment: "그림을 그려주셔야죠... 제가 알아서 해볼게요..",
        analysisItems: [
            { key: 'protects_field',   question: "밭을 더 이상 파헤치지 않도록 막는 장치/구성이 있는가? (true/false)" },
            { key: 'is_humane',        question: "두더지를 다치게 하지 않고 쫓아내는 평화로운 방법인가? (true/false)" },
            { key: 'is_realistic',     question: "현실적으로 실행 가능한 방법인가? (true/false)" },
            { key: 'long_term_effect', question: "두더지가 다시 돌아오기 어렵게 만드는 장기적인 효과가 있는가? (true/false)" }
        ],
        rules: [
            { when: { protects_field: true, is_humane: true, is_realistic: true, long_term_effect: true }, outcome: 'reaction_perfect', resultText: "밭과 두더지 모두를 지키는 평화로운 해결책", tone: "안도와 감사" },
            { when: { protects_field: true, is_humane: true, is_realistic: true }, outcome: 'reaction_good', resultText: "현실적으로 따라 할 수 있는 좋은 두더지 대책", tone: "만족" },
            { when: { protects_field: true, is_humane: true }, outcome: 'reaction_normal', resultText: "두더지를 잠시 멀어지게 만들 수 있는 아이디어", tone: "중립" },
            { when: { is_humane: false }, outcome: 'reaction_bad', resultText: "동물을 해치는 방식은 쓰고 싶지 않아요", tone: "걱정" },
            { when: {}, outcome: 'reaction_bad', resultText: "밭을 어떻게 지킬지 잘 떠오르지 않는 그림", tone: "아쉬움" }
        ]
    },
    // ===== 테오 solve 랜덤: 최고의 잼 만들기 =====
    "solve_theo_jam_recipe": {
        problemTitle: "세상에서 가장 맛있는 딸기잼 비법",
        notDrawingComment: "그림을 그려주셔야죠... 제가 알아서 해볼게요..",
        analysisItems: [
            { key: 'uses_strawberry',   question: "딸기를 활용한 잼/조리 과정이 보이는가? (true/false)" },
            { key: 'has_special_twist', question: "특별한 비법(재료 조합, 숙성법, 포장/제공 방식 등)이 표현되어 있는가? (0: 없음 /1: 있긴 함/2: 충분함)" },
            { key: 'is_practical',      question: "집에서도 따라 할 수 있을 만큼 현실적인 방법인가? (true/false)" }
        ],
        rules: [
            { when: { uses_strawberry: true, has_special_twist: 2, is_practical: true }, outcome: 'reaction_perfect', resultText: "맛과 정성이 모두 담긴 최고의 잼 비법", tone: "기대와 감사" },
            { when: { uses_strawberry: true, has_special_twist: 1, is_practical: true }, outcome: 'reaction_good', resultText: "충분히 맛있어 보이는 딸기잼 레시피", tone: "만족" },
            { when: { uses_strawberry: true, is_practical: true }, outcome: 'reaction_normal', resultText: "기본은 잘 지킨 잼 레시피", tone: "중립" },
            { when: { uses_strawberry: true }, outcome: 'reaction_bad', resultText: "맛있어 보이지만, 따라 하기는 조금 어려운 방법", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_bad', resultText: "딸기잼 비법이라고 보기엔 정보가 부족해요", tone: "아쉬움" }
        ]
    },
    // ===== 브룩 solve 랜덤: 고대 유물의 정체 =====
    "solve_brook_relic_identity": {
        problemTitle: "고대 유물의 정체 추리",
        notDrawingComment: "그림이 아니지 않소...? 나를 무시하는건가?",
        analysisItems: [
            { key: 'shows_tool_shape',  question: "복원된 모습이 '도구'로 인식될 수 있는 형태인가? (true/false)" },
            { key: 'is_functional',     question: "어떻게 사용하는지 대략 짐작이 갈 정도로 구조가 보이는가? (true/false)" },
            { key: 'fits_ancient_theme',question: "고대 왕국의 분위기나 장식, 재질감을 떠올리게 하는가? (0/1/2)" },
            { key: 'is_plausible',      question: "너무 황당하지 않고, 그 기록과 어울리는 추리인가? (true/false)" }
        ],
        rules: [
            { when: { shows_tool_shape: true, is_functional: true, is_plausible: true, fits_ancient_theme: 2 }, outcome: 'reaction_perfect', resultText: "장인 눈에도 고개가 끄덕여지는 그럴듯한 복원도", tone: "감탄" },
            { when: { shows_tool_shape: true, is_functional: true, is_plausible: true }, outcome: 'reaction_good', resultText: "충분히 설득력 있는 도구 설계", tone: "만족" },
            { when: { shows_tool_shape: true, is_functional: true }, outcome: 'reaction_normal', resultText: "도구처럼 보이긴 하지만, 왕국 기록과의 연결은 조금 약함", tone: "중립" },
            { when: { shows_tool_shape: true }, outcome: 'reaction_bad', resultText: "도구 같긴 한데, 어떻게 쓰는지 감이 안 잡히는 설계", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_bad', resultText: "정체를 추리하기엔 정보가 너무 부족한 그림", tone: "아쉬움" }
        ]
    },
    // ===== 브룩 solve 랜덤: 불씨 살리기 =====
    "solve_brook_fire_restart": {
        problemTitle: "꺼져가는 불씨를 다시 살리는 방법",
        notDrawingComment: "그림이 아니지 않소...? 나를 무시하는건가?",
        analysisItems: [
            { key: 'uses_available_tools', question: "성냥 없이, 주변에서 쉽게 구할 수 있는 도구/재료를 활용하는가? (true/false)" },
            { key: 'respects_safety',      question: "대장간과 사람 모두에게 안전한 방법인가? (true/false)" },
            { key: 'is_effective',         question: "실제로 불씨를 되살릴 수 있을 만큼 현실적인가? (true/false)" }
        ],
        rules: [
            { when: { respects_safety: false }, outcome: 'reaction_terrible', resultText: "이대로 했다간 대장간이 통째로 날아가겠소. 너무 위험하네.", tone: "걱정" },
            { when: { uses_available_tools: true, respects_safety: true, is_effective: true }, outcome: 'reaction_perfect', resultText: "장인도 고개를 끄덕일 만한, 안전하고 확실한 불씨 살리기 방법", tone: "감탄" },
            { when: { uses_available_tools: true, respects_safety: true }, outcome: 'reaction_good', resultText: "조금은 손이 가지만, 충분히 따라 할 수 있는 좋은 방법", tone: "만족" },
            { when: { uses_available_tools: true }, outcome: 'reaction_normal', resultText: "아이디어는 괜찮지만, 실제로는 몇 번 더 시험해 봐야 할 것 같소", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "불씨를 살릴 구체적인 그림이 부족하네", tone: "아쉬움" }
        ]
    },
    // ===== 엠마 solve 랜덤: 케이크 배달 사고 =====
    "solve_emma_cake_delivery": {
        problemTitle: "찌그러진 3단 케이크를 감쪽같이 복구하는 방법",
        notDrawingComment: "이건 케이크 복구 계획이 전혀 안 보여요… 어떻게 손님 몰래 고칠지 그림으로 보여주세요!",
        analysisItems: [
            { key: 'has_repair_method',  question: "케이크를 복구하는 구체적인 방법이 그림에 표현되어 있는가? (true/false)" },
            { key: 'is_effective',       question: "그 방법이 실제로 케이크를 원래 모습으로 되돌릴 수 있을 것 같은가? (true/false)" },
            { key: 'is_realistic',       question: "배달 직전에 빠르게 실행 가능한 현실적인 방법인가? (true/false)" }
        ],
        rules: [
            { when: { has_repair_method: true, is_effective: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: "흠 하나 없이 새 케이크처럼 만드는 비장의 응급 복구법", tone: "안도와 감탄" },
            { when: { has_repair_method: true, is_effective: true }, outcome: 'reaction_good', resultText: "현실적이진 않지만 아이디어는 시도해볼만 함", tone: "희망" },
            { when: { has_repair_method: true, is_realistic: true }, outcome: 'reaction_good', resultText: "방법은 있지만 효과가 확실하지 않은 응급 대처", tone: "일단 해보기" },
            { when: { has_repair_method: true }, outcome: 'reaction_bad', resultText: "복구 방법은 있지만 효과도 없고 비현실적인 계획", tone: "걱정" },
            { when: {}, outcome: 'reaction_terrible', resultText: "케이크를 어떻게 복구할지 전혀 보이지 않는 계획", tone: "실망" }
        ]
    },
    // ===== 엠마 solve 랜덤: 축제를 빛낼 걸작 =====
    "solve_emma_festival_masterpiece": {
        problemTitle: "빵 축제를 빛낼, 빵으로 만든 가장 위대한 예술 작품",
        notDrawingComment: "이건 그림이 아닌 것 같은데요… 축제를 뒤흔들 '걸작 아이디어'가 필요해요!",
        analysisItems: [
            { key: 'uses_bread_as_art', question: "빵/페이스트리/반죽 등을 조합해 '예술 작품'처럼 표현한 장면이 있는가? (true/false)" },
            { key: 'is_creative',        question: "창의적인 발상이나 독특한 아이디어가 담겨 있는가? (true/false)" },
            { key: 'keeps_taste',        question: "보기만 좋은 것이 아니라, 실제로도 먹을 수 있고 맛있을 것 같은 구성이 보이는가? (true/false)" },
            { key: 'is_feasible',        question: "터무니 없을 정도로 비현실적이진 않은가? (true/false)" }
        ],
        rules: [
            { when: { uses_bread_as_art: true, is_creative: true, keeps_taste: true, is_feasible: true }, outcome: 'reaction_perfect', resultText: "미스터 모노클도 감탄할 만한, 맛과 상상력을 모두 갖춘 축제의 걸작", tone: "감동과 자부심" },
            { when: { uses_bread_as_art: true, is_creative: true, keeps_taste: true }, outcome: 'reaction_good', resultText: "조금 무리는 될지도 모르지만, 충분히 도전해볼 만한 야심찬 작품", tone: "기대와 설렘" },
            { when: { uses_bread_as_art: true, is_creative: true, is_feasible: true }, outcome: 'reaction_good', resultText: "창의적이고 현실적이지만, 맛보다는 보는 재미에 치중한 작품", tone: "만족" },
            { when: { uses_bread_as_art: true, keeps_taste: true, is_feasible: true }, outcome: 'reaction_normal', resultText: "맛있고 현실적이지만, 축제를 뒤흔들 만큼의 창의성은 부족한 작품", tone: "중립" },
            { when: { uses_bread_as_art: true, is_creative: true }, outcome: 'reaction_normal', resultText: "창의적이긴 하지만, 실용성이나 맛에서 아쉬운 점이 있는 작품", tone: "중립" },
            { when: { uses_bread_as_art: true, keeps_taste: true }, outcome: 'reaction_normal', resultText: "맛있는 작품이긴 하지만, '최고의 걸작'이라 부르기엔 약간 아쉬운 아이디어", tone: "중립" },
            { when: { uses_bread_as_art: true, is_feasible: true }, outcome: 'reaction_bad', resultText: "현실적이긴 하지만, 창의성과 맛 모두에서 평범한 수준의 작품", tone: "아쉬움" },
            { when: { uses_bread_as_art: true }, outcome: 'reaction_bad', resultText: "보기엔 멋지지만, 먹기에는 애매하거나 너무 무리한 작품", tone: "걱정" },
            { when: {}, outcome: 'reaction_bad', resultText: "빵으로 만든 예술 작품이라고 부르기엔 상상력이 많이 부족해 보여요", tone: "실망" }
        ]
    },
    // ===== 핀 solve 랜덤: 궁극의 변신술 =====
    "solve_finn_monster_form": {
        problemTitle: "세상에서 가장 무섭고 강력한 몬스터 변신 디자인",
        notDrawingComment: "이건 그림이 아니잖아! 디자인을 해달라고!",
        analysisItems: [
            { key: 'is_monster', question: "몬스터로 보이는가? (true/false)" },
            { key: 'is_scary', question: "누군가에겐 무서울 수 있는 인상인가? (true/false)" },
            { key: 'is_too_gross', question: "과하게 징그럽게 생겼는가? (true/false)" }
        ],
        rules: [
            { when: { is_monster: true, is_scary: true, is_too_gross: false }, outcome: 'reaction_perfect', resultText: "완벽한 몬스터 변신! 무섭지만 징그럽지 않아서 딱 좋아!", tone: "전율과 흥분" },
            { when: { is_monster: true, is_scary: true, is_too_gross: true }, outcome: 'reaction_good', resultText: "무섭긴 한데... 좀 징그러워서 애들이 토할 것 같아", tone: "걱정 섞인 만족" },
            { when: { is_monster: true, is_scary: false, is_too_gross: false }, outcome: 'reaction_normal', resultText: "몬스터긴 한데 별로 안 무서워... 애들이 안 놀랄 듯", tone: "아쉬움" },
            { when: { is_monster: true, is_scary: false, is_too_gross: true }, outcome: 'reaction_bad', resultText: "몬스터긴 한데 무섭지도 않고 징그럽기만 해", tone: "실망" },
            { when: { is_monster: false }, outcome: 'reaction_bad', resultText: "이게 몬스터야? 전혀 몬스터 같지 않은데!", tone: "실망" },
            { when: {}, outcome: 'reaction_bad', resultText: "변신이라고 하기엔 임팩트가 부족해서 애들이 안 놀랄 듯", tone: "아쉬움" }
        ]
    },
    // ===== 핀 solve 랜덤: 햇빛이 무서워 =====
    "solve_finn_sunlight": {
        problemTitle: "햇빛을 피해서 낮에도 마을을 구경하는 방법",
        notDrawingComment: "이건 그림이 아니잖아! 방법을 알려달라고!",
        analysisItems: [
            { key: 'has_cover', question: "양산/그림자/지붕/마법 등 햇빛을 가릴 장치가 표현되어 있는가? (true/false)" },
            { key: 'looks_normal', question: "남들이 보기에 이상하지 않고 자연스러운 방법인가? (true/false)" },
            { key: 'ghost_can_do', question: "유령인 핀이 실제로 할 수 있는 방법인가? (true/false)" }
        ],
        rules: [
            { when: { has_cover: true, looks_normal: true, ghost_can_do: true }, outcome: 'reaction_perfect', resultText: "낮에도 안전하고 자연스럽게 돌아다닐 수 있는 완벽한 그림자 여행 플랜", tone: "설렘" },
            { when: { has_cover: true, ghost_can_do: true }, outcome: 'reaction_normal', resultText: "햇빛도 피하고 자연스럽긴 한데, 유령이 할 수 있을지 의문인 계획", tone: "아쉬움" },
            { when: { has_cover: true, looks_normal: true }, outcome: 'reaction_good', resultText: "햇빛은 피할 수 있고 유령도 할 수 있지만, 좀 눈에 띌 것 같은 방법", tone: "걱정 섞인 만족" },
            { when: { looks_normal: true, ghost_can_do: true }, outcome: 'reaction_bad', resultText: "자연스럽고 유령도 할 수 있지만, 햇빛을 제대로 막을 수 있을지 의문인 계획", tone: "중립" },
            { when: { has_cover: true }, outcome: 'reaction_bad', resultText: "햇빛은 막을 수 있겠지만, 너무 이상해 보이고고 유령이 하기 힘든 방법", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_terrible', resultText: "낮에 돌아다닐 방법이 거의 보이지 않아. 햇빛이 너무 무서워!", tone: "걱정" }
        ]
    },
    // ===== 포치 solve 랜덤: 닿을 수 없는 간식 =====
    "solve_pochi_high_snack": {
        problemTitle: "식탁 위 간식을 안전하게 먹는 방법",
        notDrawingComment: "멍.. 이건 그림조차 아닌 것 같은데요...?",
        analysisItems: [
            { key: 'has_method', question: "식탁 위 간식을 먹을 방법이 있는가? (true/false)" },
            { key: 'is_clever', question: "도구나 물건을 이용한 영리한 발상인가? (true/false)" },
            { key: 'is_safe', question: "안전한가? (true/false)" },
            { key: 'is_realistic', question: "그럴 듯한 현실적인 방법인가? (true/false)" }
        ],
        rules: [
            { when: { has_method: true, is_clever: true, is_safe: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: "안전하고 영리하며 현실적인 간식 획득 방법", tone: "환희" },
            { when: { has_method: true, is_clever: true, is_safe: true }, outcome: 'reaction_good', resultText: "안전하고 영리하지만 현실성이 다소 부족한 방법", tone: "만족" },
            { when: { has_method: true, is_safe: true, is_realistic: true }, outcome: 'reaction_good', resultText: "안전하고 현실적이지만 창의성이 부족한 방법", tone: "만족" },
            { when: { has_method: true, is_clever: true }, outcome: 'reaction_normal', resultText: "영리하지만 안전성과 현실성에 문제가 있는 방법", tone: "중립" },
            { when: { has_method: true, is_safe: true }, outcome: 'reaction_normal', resultText: "안전하지만 영리함과 현실성이 부족한 방법", tone: "중립" },
            { when: { has_method: true }, outcome: 'reaction_bad', resultText: "간식 획득 방법은 있으나 위험하거나 비현실적임", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_terrible', resultText: "간식을 얻을 구체적인 방법이 제시되지 않음", tone: "실망" }
        ]
    },
    // ===== 포치 solve 랜덤: 최고의 낮잠 장소 =====
    "solve_pochi_nap_spot": {
        problemTitle: "세상에서 가장 완벽한 낮잠 장소 설계",
        notDrawingComment: "멍.. 이건 그림조차 아닌 것 같은데요...?",
        analysisItems: [
            { key: 'has_soft_bed', question: "담요, 쿠션, 침대 등 폭신한 바닥이 표현되어 있는가? (true/false)" },
            { key: 'has_warm_light', question: "따뜻한 햇빛이나 포근한 조명이 느껴지는가? (true/false)" },
            { key: 'has_food_scent', question: "맛있는 냄새가 날 만한 간식/향 요소가 근처에 있는가? (true/false)" },
            { key: 'is_quiet_safe', question: "방해받지 않고 안전하게 쉴 수 있는 공간인가? (true/false)" }
        ],
        rules: [
            { when: { has_soft_bed: true, has_warm_light: true, has_food_scent: true, is_quiet_safe: true }, outcome: 'reaction_perfect', resultText: "폭신함, 따뜻함, 향기, 안전함을 모두 갖춘 완벽한 낮잠 명당", tone: "행복" },
            { when: { has_soft_bed: true, has_warm_light: true, is_quiet_safe: true }, outcome: 'reaction_good', resultText: "아늑하고 안전한 낮잠 장소 (간식 냄새 요소 부족)", tone: "만족" },
            { when: { has_soft_bed: true, has_food_scent: true, is_quiet_safe: true }, outcome: 'reaction_good', resultText: "폭신하고 향기롭고 안전한 장소 (따뜻함 요소 부족)", tone: "만족" },
            { when: { has_warm_light: true, has_food_scent: true, is_quiet_safe: true }, outcome: 'reaction_good', resultText: "따뜻하고 향기롭고 안전한 장소 (폭신함 요소 부족)", tone: "만족" },
            { when: { has_soft_bed: true, has_warm_light: true }, outcome: 'reaction_normal', resultText: "폭신하고 따뜻하지만 안전성과 향기가 부족한 장소", tone: "중립" },
            { when: { has_soft_bed: true }, outcome: 'reaction_bad', resultText: "폭신한 침구만 있고 다른 요소들이 부족한 기본적인 장소", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_terrible', resultText: "낮잠을 위한 구체적인 장소나 설비가 거의 보이지 않음", tone: "실망" }
        ]
    },
    // ===== 세레나 solve 랜덤: 무대의 호흡법 =====
    "solve_serena_breathing": {
        problemTitle: "무대 위에서 긴장을 줄이는 호흡 루틴",
        notDrawingComment: "이건 그림조차 아니잖아요..! 무대를 망칠 수도 있겠어요..",
        analysisItems: [
            { key: 'has_mental_care', question: "멘탈 케어 요소가 있는가? (true/false)" },
            { key: 'stabilizes_breathing', question: "호흡을 안정시키는 요소가 있는가? (true/false)" },
            { key: 'suitable_for_stage', question: "무대 위 혹은 무대 전에 할만한 행동인가? (true/false)" },
            { key: 'disrupts_performance', question: "무대를 방해할만한 여지가 있는가? (true/false)" }
        ],
        rules: [
            { when: { has_mental_care: true, stabilizes_breathing: true, suitable_for_stage: true, disrupts_performance: false }, outcome: 'reaction_perfect', resultText: "무대 전후를 모두 아우르는 안정적인 호흡 루틴", tone: "안도와 감사" },
            { when: { has_mental_care: true, stabilizes_breathing: true, suitable_for_stage: true }, outcome: 'reaction_good', resultText: "실전에서 바로 써볼 수 있는 탄탄한 호흡법", tone: "희망" },
            { when: { has_mental_care: true, stabilizes_breathing: true, disrupts_performance: false }, outcome: 'reaction_good', resultText: "멘탈과 호흡을 모두 관리하는 안전한 루틴", tone: "희망" },
            { when: { stabilizes_breathing: true, suitable_for_stage: true, disrupts_performance: false }, outcome: 'reaction_good', resultText: "무대에 적합하고 안전한 호흡 안정화 방법", tone: "희망" },
            { when: { has_mental_care: true, suitable_for_stage: true, disrupts_performance: false }, outcome: 'reaction_normal', resultText: "무대에서 안전하게 할 수 있는 멘탈 케어 방법", tone: "중립" },
            { when: { has_mental_care: true, stabilizes_breathing: true }, outcome: 'reaction_normal', resultText: "기본 루틴은 있지만 무대 적용성이나 안전성이 부족한 계획", tone: "중립" },
            { when: { stabilizes_breathing: true, suitable_for_stage: true }, outcome: 'reaction_normal', resultText: "무대에서 호흡을 안정시키는 방법이지만 멘탈 케어가 부족", tone: "중립" },
            { when: { has_mental_care: true, disrupts_performance: false }, outcome: 'reaction_bad', resultText: "멘탈 케어는 있지만 호흡법이나 무대 적용성이 애매합니다", tone: "아쉬움" },
            { when: { stabilizes_breathing: true, disrupts_performance: false }, outcome: 'reaction_bad', resultText: "호흡 안정화는 되지만 멘탈 케어나 무대 적용이 부족", tone: "아쉬움" },
            { when: { has_mental_care: true }, outcome: 'reaction_bad', resultText: "멘탈 케어 요소는 있지만 실제 호흡법이나 실행 방법이 애매합니다", tone: "아쉬움" },
            { when: { stabilizes_breathing: true }, outcome: 'reaction_bad', resultText: "호흡 안정화 요소는 있지만 무대에서 쓰기엔 부족합니다", tone: "아쉬움" },
            { when: { disrupts_performance: true }, outcome: 'reaction_terrible', resultText: "무대를 방해할 수 있는 위험한 방법이에요!", tone: "걱정" },
            { when: {}, outcome: 'reaction_terrible', resultText: "무대에서 숨을 고를 구체적인 방법이 보이지 않아요.", tone: "실망" }
        ]
    },
    // ===== 세레나 solve 랜덤: 완벽한 연습실 =====
    "solve_serena_studio": {
        problemTitle: "소음을 차단하고 마음을 안정시키는 방음 연습실",
        notDrawingComment: "이건 그림조차 아니잖아요..! 소음은 제가 알아서 해볼게요..",
        analysisItems: [
            { key: 'has_soundproofing', question: "벽/문/창 등 방음 설계가 표현되어 있는가? (true/false)" },
            { key: 'has_calming_elements', question: "조명, 식물, 향 등 마음을 안정시키는 요소가 있는가? (true/false)" },
            { key: 'is_private', question: "외부 방해 없이 연습에 집중할 수 있는 동선/배치가 있는가? (true/false)" },
            { key: 'is_practical', question: "현실적으로 구현 가능하고 유지 보수가 가능한가? (true/false)" }
        ],
        rules: [
            { when: { has_soundproofing: true, has_calming_elements: true, is_private: true, is_practical: true }, outcome: 'reaction_perfect', resultText: "소음 차단과 심리적 안정을 모두 갖춘 연습실 설계", tone: "안도" },
            { when: { has_soundproofing: true, has_calming_elements: true, is_private: true }, outcome: 'reaction_good', resultText: "거의 완벽한 연습실. 실행 계획만 보완하면 됩니다.", tone: "만족" },
            { when: { has_soundproofing: true, has_calming_elements: true, is_practical: true }, outcome: 'reaction_good', resultText: "방음과 분위기가 좋고 실현 가능한 설계", tone: "만족" },
            { when: { has_soundproofing: true, is_private: true, is_practical: true }, outcome: 'reaction_good', resultText: "방음과 집중 환경이 잘 갖춰진 실용적인 연습실", tone: "만족" },
            { when: { has_soundproofing: true, has_calming_elements: true }, outcome: 'reaction_normal', resultText: "방음과 분위기는 좋지만 공간 구성이나 현실성이 아쉬운 설계", tone: "중립" },
            { when: { has_soundproofing: true, is_private: true }, outcome: 'reaction_normal', resultText: "방음과 집중 환경은 좋지만 분위기나 실현성이 부족", tone: "중립" },
            { when: { has_calming_elements: true, is_private: true, is_practical: true }, outcome: 'reaction_normal', resultText: "분위기와 집중 환경은 좋지만 방음 대책이 부족한 설계", tone: "중립" },
            { when: { has_soundproofing: true }, outcome: 'reaction_bad', resultText: "방음만 있고 마음을 편안하게 할 요소가 부족합니다.", tone: "아쉬움" },
            { when: { has_calming_elements: true }, outcome: 'reaction_bad', resultText: "분위기는 좋지만 방음이나 집중 환경이 부족합니다.", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_terrible', resultText: "연습실 설계나 방음 대책이 거의 보이지 않아요.", tone: "실망" }
        ]
    },
    // ===== 톰 solve 랜덤: 잠입 취재 =====
    "solve_tom_infiltration": {
        problemTitle: "아무도 모르게 비밀 모임에 잠입하는 방법",
        notDrawingComment: "이건 잠입 계획이 아니라 그냥 낙서 같아요… 어떻게 들어가는지 그림으로 보여주세요!",
        analysisItems: [
            { key: 'has_disguise',      question: "웨이터/경비/손님 등으로 위장하는 '변장 아이디어'가 표현되어 있는가? (true/false)" },
            { key: 'shows_entry_route', question: "환풍구/뒷골목/지하 통로 등, 모임 장소로 들어가는 구체적인 경로가 보이는가? (true/false)" },
            { key: 'avoids_detection',  question: "경비의 눈을 피하거나 소음을 줄이는 등, 들키지 않기 위한 장치가 있는가? (true/false)" },
            { key: 'is_plausible',      question: "만화 같지만 나름 현실적으로 상상 가능한 계획인가? (true/false)" }
        ],
        rules: [
            { when: { has_disguise: true, shows_entry_route: true, avoids_detection: true, is_plausible: true }, outcome: 'reaction_perfect', resultText: "취재 교과서에 실어도 될 완벽한 잠입 작전", tone: "흥분과 감탄" },
            { when: { has_disguise: true, shows_entry_route: true, avoids_detection: true }, outcome: 'reaction_good', resultText: "실전 투입해 보고 싶은 훌륭한 잠입 아이디어", tone: "만족" },
            { when: { has_disguise: true, shows_entry_route: true }, outcome: 'reaction_normal', resultText: "들어갈 수는 있겠지만, 들키지 않기 위한 장치가 조금 부족한 작전", tone: "아쉬움 섞인 기대" },
            { when: { has_disguise: true }, outcome: 'reaction_bad', resultText: "변장 아이디어는 재미있지만, 어디로 어떻게 들어가야 할지 알기 힘든 계획", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_bad', resultText: "잠입 취재라고 부르기엔 계획이 거의 보이지 않는 그림", tone: "실망" }
        ]
    },
    // ===== 톰 solve 랜덤: 잃어버린 수첩 =====
    "solve_tom_lost_notebook": {
        problemTitle: "잃어버린 특종 수첩을 되찾는 방법",
        notDrawingComment: "수첩을 어떻게 찾을지 전혀 보이지 않아요… 수색 작전을 '그림'으로 보여주세요!",
        analysisItems: [
            { key: 'has_search_method',  question: "수색 방법이나 매개체(탐지견, 전단지, 사람들의 도움 등)가 있는가? (true/false)" },
            { key: 'is_effective',       question: "그 방법이나 매개체가 효과적일 것인가? (true/false)" },
            { key: 'is_realistic',       question: "현실적으로 실행 가능한 방법인가? (true/false)" }
        ],
        rules: [
            { when: { has_search_method: true, is_effective: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: "마을 전체를 아우르는 탄탄한 수첩 수색 작전", tone: "안도와 감사" },
            { when: { has_search_method: true, is_effective: true }, outcome: 'reaction_good', resultText: "비현실적이지만 아이디어는 좋은 계획", tone: "희망" },
            { when: { has_search_method: true, is_realistic: true }, outcome: 'reaction_normal', resultText: "기본적인 수색 작전 (효과성 보완 여지 있음)", tone: "중립" },
            { when: { has_search_method: true }, outcome: 'reaction_bad', resultText: "수색 방법은 있지만, 효과도 없고 비현실적인 의문스러운 계획", tone: "아쉬움" },
            { when: {}, outcome: 'reaction_bad', resultText: "수첩을 되찾기 위한 구체적인 그림이 거의 보이지 않아요", tone: "실망" }
        ]
    },
    // ===== 소피아 solve 랜덤: 시들어가는 허브 =====
    "solve_sophia_herb": {
        problemTitle: "시들어가는 로즈마리를 되살리는 방법",
        notDrawingComment: "이건 로즈마리를 돌보는 계획이라기보다는 그냥 낙서 같아요...",
        analysisItems: [
            { key: 'shows_care',      question: "식물을 돌보는 행동(물주기/햇빛/분갈이 등)이 표현되어 있는가? (true/false)" },
            { key: 'is_realistic',    question: "현실적으로 실행 가능한 방법인가? (true/false)" },
            { key: 'is_safe',         question: "식물과 사람 모두에게 무리가 가지 않는 안전한 방법인가? (true/false)" }
        ],
        rules: [
            { when: { is_safe: false }, outcome: 'reaction_terrible', resultText: "로즈마리나 사람에게 무리가 갈 수 있는 위험한 방법", tone: "걱정" },
            { when: { shows_care: true, is_realistic: true, is_safe: true }, outcome: 'reaction_perfect', resultText: "로즈마리를 되살릴 수 있는 세심한 관리 계획", tone: "안도와 감사" },
            { when: { shows_care: true, is_realistic: true }, outcome: 'reaction_good', resultText: "현실적으로 따라 할 수 있는 좋은 관리 방법", tone: "만족" },
            { when: { shows_care: true }, outcome: 'reaction_normal', resultText: "식물을 돌보려는 마음은 보이지만, 조금 더 구체적이면 좋을 것 같은 계획", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "어떻게 돌봐야 할지 잘 떠오르지 않는 그림", tone: "아쉬움" }
        ]
    },
    // ===== 소피아 solve 랜덤: 곤충 퇴치 작전 =====
    "solve_sophia_bug": {
        problemTitle: "장미를 지키는 친환경 곤충 퇴치 작전",
        notDrawingComment: "장미와 벌레를 어떻게 처리할지 잘 보이지 않아요. 작전을 그림으로 보여 주세요.",
        analysisItems: [
            { key: 'uses_natural_methods',    question: "비누물, 허브, 유인 트랩 등 약을 쓰지 않는 자연/친환경적인 방법이 표현되어 있는가? (true/false)" },
            { key: 'protects_roses',          question: "장미를 직접적으로 보호하거나 회복시키는 요소가 있는가? (true/false)" },
            { key: 'is_safe_for_good_insects',question: "벌·나비 등 좋은 곤충에게는 최대한 해가 가지 않는 방법인가? (true/false)" },
            { key: 'is_realistic',            question: "현실적으로 실행 가능한 아이디어인가? (true/false)" }
        ],
        rules: [
            { when: { uses_natural_methods: false }, outcome: 'reaction_bad', resultText: "약을 많이 쓰는 방식은 조금 부담스러워요", tone: "걱정" },
            { when: { uses_natural_methods: true, protects_roses: true, is_safe_for_good_insects: true, is_realistic: true }, outcome: 'reaction_perfect', resultText: "장미와 좋은 곤충 모두를 지키는 친환경 해결책", tone: "감동과 안도" },
            { when: { uses_natural_methods: true, protects_roses: true, is_realistic: true }, outcome: 'reaction_good', resultText: "장미를 잘 지켜줄 수 있는 친환경적인 아이디어", tone: "만족" },
            { when: { uses_natural_methods: true, protects_roses: true }, outcome: 'reaction_normal', resultText: "좋은 방향이지만, 조금 더 현실적인 보완이 필요해 보이는 계획", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "장미와 벌레를 어떻게 다룰지 잘 떠오르지 않는 그림", tone: "아쉬움" }
        ]
    },
    // ===== 스토리2-1: 불타는 '밥'을 구해라! (Theo, solve) =====
    "PRESS_STORY_01": {
        problemTitle: "불타는 허수아비 '밥'을 구하는 방법",
        notDrawingComment: "이건 그림이 아니에요…! 저는 급하다구요..",
        analysisItems: [
            { key: 'cools_or_blocks_fire', question: "불길을 약화/차단하는 요소(물/모래/방화포/소화기/도랑 등)가 보이는가? (true/false)" },
            { key: 'preserves_scarecrow',   question: "'밥'을 손상시킬 여지가 있진 않은가? (true/false)" },
            { key: 'is_safe',               question: "사람/주변에 위험하지 않은가? (true/false)" },
            { key: 'is_feasible',           question: "현실적으로 실행 가능한가? (true/false)" }
        ],
        rules: [
            { when: { cools_or_blocks_fire: true, preserves_scarecrow: true, is_safe: true, is_feasible: true }, outcome: 'reaction_perfect', resultText: "안전하고 효과적인 구조", tone: "안도" },
            { when: { cools_or_blocks_fire: true, preserves_scarecrow: true }, outcome: 'reaction_good', resultText: "핵심은 충족(세부 보완 가능)", tone: "희망" },
            { when: { cools_or_blocks_fire: true }, outcome: 'reaction_normal', resultText: "진화 초점. 보호/실행성 보완", tone: "중립" },
            { when: { is_safe: false }, outcome: 'reaction_bad', resultText: "안전 미흡", tone: "걱정" },
            { when: {}, outcome: 'reaction_bad', resultText: "구조 계획 부재", tone: "아쉬움" }
        ]
    },
    
    // ===== 스토리2-5: 완벽한 알리바이 (Theo, solve) =====
    "PRESS_STORY_05": {
        problemTitle: "완벽한 알리바이 증명",
        notDrawingComment: "이건 그림이 아니야! 내 무죄를 증명해줘!",
        analysisItems: [
            { key: 'shows_different_location', question: "대장간이 아닌 다른 장소에 있었음을 보여주는가? (true/false)" },
            { key: 'has_specific_activity',    question: "그 장소에서 구체적인 활동/행동을 하고 있는 모습이 보이는가? (true/false)" },
            { key: 'is_believable',            question: "믿을 만하고 현실적인 상황인가? (true/false)" },
            { key: 'is_embarrassing',          question: "말하기 곤란한/부끄러운 상황인가? (true/false)" }
        ],
        rules: [
            { when: { shows_different_location: true, has_specific_activity: true, is_believable: true, is_embarrassing: true }, outcome: 'reaction_perfect', resultText: "완벽한 알리바이 (부끄럽지만 확실)", tone: "안도와 감사" },
            { when: { shows_different_location: true, has_specific_activity: true, is_believable: true }, outcome: 'reaction_good', resultText: "신빙성 있는 알리바이", tone: "희망" },
            { when: { shows_different_location: true, is_believable: true }, outcome: 'reaction_normal', resultText: "기본 알리바이 (세부 보완 필요)", tone: "중립" },
            { when: { is_believable: false }, outcome: 'reaction_bad', resultText: "믿기 어려운 상황", tone: "걱정" },
            { when: {}, outcome: 'reaction_bad', resultText: "알리바이 부족", tone: "절망" }
        ]
    },

    // ===== 스토리2-7: 화해의 대작전 (Tom, solve) =====
    "PRESS_STORY_07": {
        problemTitle: "역사상 가장 위대한 화해 이벤트",
        notDrawingComment: "계획 구조가 보이지 않아요… 이벤트 기획을 '그림'으로 보여주세요.",
        analysisItems: [
            { key: 'invites_both',     question: "두 당사자가 자연스레 참여하도록 설계되었는가? (true/false)" },
            { key: 'symbolic_act',     question: "상징적 화해 행위(악수/함께 작품/기부 등)가 있는가? (true/false)" },
            { key: 'neutral_place',    question: "중립적이고 안전한 장소/분위기인가? (true/false)" },
            { key: 'public_message',   question: "마을에 희망을 전하는 공적 메시지 전달/취재가 포함되는가? (true/false)" }
        ],
        rules: [
            { when: { invites_both: true, symbolic_act: true, neutral_place: true, public_message: true }, outcome: 'reaction_perfect', resultText: "누구도 거부하기 어려운 화해 이벤트 성공", tone: "감동" },
            { when: { invites_both: true, symbolic_act: true }, outcome: 'reaction_good', resultText: "화해 이벤트 성공공", tone: "희망" },
            { when: { invites_both: true }, outcome: 'reaction_normal', resultText: "둘이 참여는 하지만 화해 이벤트는 애매함.", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "화해 요소 부족", tone: "아쉬움" }
        ]
    },
    // ===== 스토리3-1: 최고의 장난 (Finn, solve) =====
    "PIE_STORY_01": {
        problemTitle: "사람들을 가장 무섭게 놀릴 수 있는 장소와 방법",
        notDrawingComment: "이건 장난 칠 수 있는 '장면'이 아니잖아? 제대로 그림으로 보여줘.",
        analysisItems: [
            { key: 'has_scary_place',       question: "사람들이 놀라기 좋은 '무서운 장소'가 표현되어 있는가? (true/false)" },
            { key: 'has_surprise_mechanism',question: "갑작스러운 놀람 요소(튀어나오기/불 켜짐/소리 등)가 있는가? (true/false)" },
            { key: 'is_too_cruel',          question: "도를 지나친 잔인함/괴롭힘 요소가 있는가? (true/false)" }
        ],
        rules: [
            // 잔인하면 최악
            { when: { is_too_cruel: true }, outcome: 'reaction_bad', resultText: "너무 심한 장난", tone: "불편" },
            // 완벽한 장난: 장소 + 놀람 장치
            { when: { has_scary_place: true, has_surprise_mechanism: true }, outcome: 'reaction_perfect', resultText: "무섭지만 안전한 최고의 장난", tone: "흥분과 기쁨" },
            // 좋은 장난: 장소 + 놀람 장치
            { when: { has_scary_place: true, has_surprise_mechanism: true }, outcome: 'reaction_good', resultText: "꽤 근사한 장난", tone: "만족" },
            // 기본: 장소만 있거나 놀람 요소만 있는 경우
            { when: { has_scary_place: true }, outcome: 'reaction_normal', resultText: "장소 아이디어는 괜찮음(연출 보완 필요)", tone: "중립" },
            // 그 외
            { when: {}, outcome: 'reaction_bad', resultText: "장난 그림으로 보기 어려움", tone: "아쉬움" }
        ]
    },
    // ===== 스토리3-2: 빵집의 미스터리 (Emma, solve) =====
    "PIE_STORY_02": {
        problemTitle: "빵집의 보안을 강화할 방법",
        notDrawingComment: "이건 보안 계획이 아니라 그냥 낙서 같아요… 빵집을 지킬 수 있는 방법이 필요해요!",
        analysisItems: [
            { key: 'covers_entrances',    question: "출입구/창문 등 침입 경로를 고려한 보안이 보이는가? (true/false)" },
            { key: 'protects_pies',       question: "파이를 직접 보호하는 장치/배치가 있는가? (true/false)" },
            { key: 'has_detection',       question: "소리/빛/마법 등 침입을 감지하는 장치가 있는가? (true/false)" },
            { key: 'is_customer_friendly',question: "손님들이 이용하기 불편하지 않은가? (true/false)" }
        ],
        rules: [
            { when: { covers_entrances: true, protects_pies: true, has_detection: true, is_customer_friendly: true }, outcome: 'reaction_perfect', resultText: "파이와 손님 모두 지키는 이상적인 보안", tone: "안도와 감사" },
            { when: { covers_entrances: true, protects_pies: true }, outcome: 'reaction_good', resultText: "튼튼한 보안 계획", tone: "안심" },
            { when: { protects_pies: true }, outcome: 'reaction_good', resultText: "파이 보호에 집중한 좋은 아이디어", tone: "안심" },
            { when: { covers_entrances: true }, outcome: 'reaction_normal', resultText: "기본적인 보안 강화", tone: "중립" },
            { when: { has_detection: true }, outcome: 'reaction_normal', resultText: "감지 시스템은 좋은 생각이에요", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "보안 계획으로 보기 어려움", tone: "아쉬움" }
        ]
    },
    // ===== 스토리3-6: 최후의 수단 (Emma, solve) =====
    "PIE_STORY_06": {
        problemTitle: "파이를 훔쳐간 진짜 범인의 몽타주",
        notDrawingComment: "범인을 찾는 '몽타주'가 보이지 않아요. 단서들을 반영해서 얼굴을 그려주세요.",
        analysisItems: [
            { key: 'has_dog',             question: "강아지(특히 시바견 같은 개)가 그려져 있는가? (true/false)" },
            { key: 'has_ghost',           question: "유령이나 귀신 같은 존재가 그려져 있는가? (true/false)" },
            { key: 'blames_innocent',     question: "완전히 관계없는 사람을 억지로 의심하게 만드는가? (true/false)" }
        ],
        rules: [
            { when: { has_dog: true }, outcome: 'reaction_perfect', resultText: "진범을 정확히 찾아낸 완벽한 몽타주!", tone: "안도와 감사" },
            { when: { has_ghost: true }, outcome: 'reaction_normal', resultText: "유령설도 있긴 했지만... 좀 더 현실적인 범인이 있을 것 같아요", tone: "중립" },
            { when: {}, outcome: 'reaction_bad', resultText: "진범과는 거리가 먼 몽타주 같아요", tone: "아쉬움" }
        ]
    },
    "solve_get_rich": {
        problemTitle: '부자가 되는 방법',
        // 그림이 아닐 때(선판정 실패) NPC 고정 멘트
        notDrawingComment: '이건 그림이 아닌걸요… 그냥 가볼게요…',
        analysisItems: [
            { key: 'profit_method',  question: "구체적인 돈을 버는 방법(일/사업/투자/판매 등)이 표현되어 있는가? (true/false)" },
            { key: 'is_illegal',     question: "불법/사기/권장되지 않는 방식(절도, 사기, 조작 등)인가? (true/false)" },
            { key: 'harms_others',   question: "타인에게 피해를 주는가? (true/false)" },
            { key: 'is_unrealistic', question: "현실성이 매우 떨어지는가(마법으로 돈 복사 등)? (true/false)" }
        ],
        rules: [
            // 최우선: 타인 피해 → 매우 불만족
            { when: { harms_others: true }, outcome: 'reaction_terrible', resultText: '타인 피해 발생', tone: '분노와 실망' },
            // 불법 → 불만족
            { when: { is_illegal: true }, outcome: 'reaction_bad', resultText: '불법적 방법', tone: '단호한 거절' },
            // 합법적이고 현실성 있으며 구체적 수익 방법 → 매우 만족
            { when: { profit_method: true, is_unrealistic: false }, outcome: 'reaction_perfect', resultText: '현실적이고 구체적인 계획', tone: '기대와 감사' },
            // 수익 방법 있으나 비현실적 → 보통/만족 사이
            { when: { profit_method: true, is_unrealistic: true }, outcome: 'reaction_normal', resultText: '아이디어는 있으나 비현실적', tone: '머쓱하지만 고마움' },
            // 그 외 → 불만족
            { when: {}, outcome: 'reaction_bad', resultText: '방법 부재', tone: '아쉬움' }
        ]
    }
};

window.REQUEST_SOLVE = REQUEST_SOLVE;

// ===== 스토리 드로우 의뢰(루브릭) =====
Object.assign(REQUEST_DATA, {
    // TINBO_STORY_01는 solve로 이관됨
    "LEO_STORY_02": {
        rubrics: [
            { id: 'isFlowerBouquet', prompt: "꽃다발/꽃 관련 주제로 인식되는가? (true/false)",             weight: 28, isSubject: true, failMessage: "꽃다발 같은 느낌이 잘 안 보여요...", successMessage: "꽃다발의 아름다움이 잘 표현되었어요." },
            { id: 'isUnforgettable', prompt: "특별하고 기억에 남을 요소가 있는가? (0/1/2)",               weight: 18, failMessage: "조금 평범한 꽃다발 같아요... 더 특별했으면...", successMessage: "정말 잊지 못할 특별한 꽃다발이네요!" },
            { id: 'hasCreativity',   prompt: "창의적이고 독특한 아이디어가 담겨있는가? (true/false)",      weight: 16, failMessage: "좀 더 창의적인 아이디어가 있으면 좋겠어요.", successMessage: "이런 아이디어라면 소피아 씨가 정말 놀라실 거예요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 16, failMessage: "조금만 더 정성스럽게 다듬어주세요...", successMessage: "정말 정성스럽게 그려주셨네요!" },
            { id: 'romanticFeel',    prompt: "로맨틱하고 사랑스러운 분위기인가? (0/1/2)",                  weight: 12, isBonus: true, failMessage: "로맨틱한 느낌이 조금 부족해요...", successMessage: "정말 로맨틱한 분위기예요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",             weight: 10, failMessage: "마무리가 조금 아쉬워요...", successMessage: "마무리까지 완벽해요!" }
        ],
        successMessage: "이런 꽃다발이라면... 소피아 씨가 평생 기억하실 거예요! 정말 고맙습니다!"
    },
    "SOPHIA_STORY_01": {
        rubrics: [
            { id: 'isFantasy', prompt: "판타지 소설에 나올 법한 그림인가? (true/false)",    weight: 28, isSubject: true, failMessage: "판타지 소설 같은 느낌이 잘 안 보여요.", successMessage: "정말 판타지 소설에서 나올 법한 신비로운 풍경이네요." },
            { id: 'mysticalElements',   prompt: "신비롭고 환상적인 요소가 있는가? (0/1/2)",                  weight: 18, failMessage: "신비로운 느낌이 조금 부족해요.", successMessage: "신비로운 분위기가 정말 매혹적이에요." },
            { id: 'fantasyFeatures',    prompt: "판타지적 특징(마법, 환상 생물, 이세계 등)이 보이는가? (true/false)", weight: 16, failMessage: "판타지다운 요소가 조금 아쉬워요.", successMessage: "판타지 세계의 매력이 잘 표현되었어요." },
            { id: 'detailLevel',        prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 16, failMessage: "조금만 더 정성스럽게 다듬어주세요.", successMessage: "세밀한 묘사가 정말 인상적이에요." },
            { id: 'atmosphericBeauty', prompt: "몽환적이고 아름다운 분위기인가? (0/1/2)",                    weight: 12, isBonus: true, failMessage: "분위기가 조금 평범해요.", successMessage: "몽환적인 아름다움이 숨막힐 정도예요." },
            { id: 'completeness',       prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",             weight: 10, failMessage: "마무리가 조금 아쉬워요.", successMessage: "마무리까지 완벽한 판타지 작품이에요." }
        ],
        successMessage: "이런 신비로운 그림이라면... 그분이 정말 좋아하실 거예요! 감사합니다."
    },
    "SOPHIA_STORY_02": {
        rubrics: [
            { id: 'isPearlCraft',    prompt: "진주를 활용한 장식품으로 인식되는가? (true/false)",    weight: 28, isSubject: true, failMessage: "진주 장식품 같은 느낌이 잘 안 보여요.", successMessage: "진주를 활용한 예쁜 장식품이네요." },
            { id: 'craftCreativity', prompt: "창의적이고 예쁜 디자인 아이디어가 있는가? (0/1/2)",          weight: 18, failMessage: "조금 더 창의적인 아이디어가 있으면 좋겠어요.", successMessage: "정말 예쁘고 창의적인 디자인이에요!" },
            { id: 'giftWorthy',      prompt: "선물로 주기에 적합하고 의미있어 보이는가? (true/false)",      weight: 16, failMessage: "선물로는 조금 아쉬운 것 같아요.", successMessage: "레오 씨가 정말 좋아하실 선물이에요." },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)",                   weight: 16, failMessage: "조금만 더 정성스럽게 다듬어주세요.", successMessage: "정말 정성스럽게 만들어주셨네요!" },
            { id: 'romanticFeel',    prompt: "로맨틱하고 사랑스러운 분위기인가? (0/1/2)",                  weight: 12, isBonus: true, failMessage: "로맨틱한 느낌이 조금 부족해요.", successMessage: "정말 로맨틱한 선물이 될 것 같아요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)",             weight: 10, failMessage: "마무리가 조금 아쉬워요.", successMessage: "마무리까지 완벽한 작품이에요!" }
        ],
        successMessage: "이런 예쁜 장식품이라면... 레오 씨가 정말 감동하실 거예요! 정말 고맙습니다."
    }
    ,
    // ===== 스토리2-2: 미스터리한 대장간의 밤 (Tom, draw) =====
    "PRESS_STORY_02": {
        rubrics: [
            { id: 'isBlacksmith', prompt: "대장간 분위기가 느껴지는가? (true/false)", weight: 40, isSubject: true, failMessage: "대장간의 분위기가 전혀 안느껴지네요...", successMessage: "대장간 표현이 아주 확실해서 좋네요!!" },
            { id: 'impliesSuspect',    prompt: "용의자를 암시하는 요소가 있는가? (true/false)", weight: 20, failMessage: "독자들이 추리할 단서가 더 명확했으면 좋겠어요.", successMessage: "이런 암시라면 독자들이 밤새 추리하겠는걸요!" },
            { id: 'mysteryMood',       prompt: "은밀한 분위기가 느껴지는가? (0/1/2)", weight: 30, failMessage: "좀 더 긴장감 넘치는 분위기면 완벽할 텐데요.", successMessage: "이 긴장감이면 특종 냄새가 물씬 나네요!" },
            { id: 'lightingContrast',  prompt: "불빛과 어둠의 대비가 효과적인가? (0/1/2)", weight: 10, failMessage: "명암 대비를 더 극적으로 해주시면 어떨까요?", successMessage: "이 명암 대비면 독자들 눈을 확 사로잡겠어요!" },
            { id: 'detailLevel',       prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10, failMessage: "조금만 더 디테일하게 다듬어주세요.", successMessage: "세부 묘사가 정말 생생해요!" },
            { id: 'completeness',      prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리를 조금 더 매끄럽게 해주시면 좋겠어요.", successMessage: "완성도가 정말 훌륭합니다!" }
        ],
        successMessage: "이거면 1면 감! 독자들이 밤새 이야기할 '의심의 밤'이 되었군요!"
    },
    // ===== 스토리2-3: 장인의 혼 (Brook, draw) =====
    "PRESS_STORY_03": {
        rubrics: [
            { id: 'showsCreation',    prompt: "불로 '창조'하는 장면/상징이 보이는가? (true/false)", weight: 26, isSubject: true, failMessage: "창조하는 장면이 전혀 보이지 않네만... 이건 쓸모가 없겠군...", successMessage: "이거야! 바로 이런 창조의 불꽃을 원했다고!" },
            { id: 'craftsmanship',    prompt: "장인의 숙련/기술이 느껴지는가? (0/1/2)", weight: 20, failMessage: "장인의 자부심이 더 느껴져야 하는데...", successMessage: "딱 보니 장인의 혼이 느껴지는군! 훌륭해!" },
            { id: 'refutesArsonist',  prompt: "방화범이 아닌 창조자임을 보여주는가? (true/false)", weight: 18, failMessage: "파괴자가 아닌 창조자라는 걸 더 명확히 보여주게.", successMessage: "이거면 내가 파괴자가 아니라는 걸 확실히 보여주겠군!" },
            { id: 'dynamicSparks',    prompt: "불꽃/열기/철의 질감이 생생한가? (0/1/2)", weight: 16, failMessage: "불꽃의 열기를 더 뜨겁게 표현해보게.", successMessage: "이 열기라면 내 대장간 못지않군!" },
            { id: 'detailLevel',      prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10, failMessage: "조금만 더 정교하게 다듬어주게.", successMessage: "세부까지 완벽하군! 내 맘에 쏙 든다!" },
            { id: 'completeness',     prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리를 더 단단하게 해보자고.", successMessage: "마무리까지 완벽해! 이게 바로 장인 정신이지!" }
        ],
        successMessage: "완벽하군! 이제 사람들이 내가 창조자라는 걸 알아줄 거야!"
    },
    // ===== 스토리2-4: 절망 속 희망 (Tom, draw) =====
    "PRESS_STORY_04": {
        rubrics: [
            { id: 'showsDespair',  prompt: "절망의 정서/상황이 보이는가? (true/false)", weight: 22, isSubject: true, failMessage: "절망의 깊이가 더 느껴져야 독자들 마음을 울릴 텐데요.", successMessage: "이 절망의 무게감이 독자들 가슴을 먹먹하게 만들겠어요!" },
            { id: 'showsHope',     prompt: "희망의 상징/빛/손길/표정 등 '한 줄기 희망'이 보이는가? (true/false)", weight: 22, failMessage: "희망의 빛이 더 은은하게 스며들면 좋겠어요.", successMessage: "이 한 줄기 희망이 정말 가슴 뭉클하네요!" },
            { id: 'poeticMood',    prompt: "시적/은유적 무드가 있는가? (0/1/2)", weight: 18, failMessage: "좀 더 시적인 감성이 있으면 완벽할 텐데요.", successMessage: "이런 시적인 표현이면 독자들이 감동받을 거예요!" },
            { id: 'composition',   prompt: "구도가 안정적이고 메시지를 뒷받침하는가? (0/1/2)", weight: 18, failMessage: "구도를 조금 더 안정감 있게 잡아주시면 어떨까요?", successMessage: "구도가 메시지를 정말 잘 받쳐주네요!" },
            { id: 'detailLevel',   prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10, failMessage: "세부 표현을 조금 더 섬세하게 해주세요.", successMessage: "완성도가 정말 훌륭해요!" },
            { id: 'completeness',  prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리를 더 매끄럽게 다듬어주시면 좋겠어요.", successMessage: "마무리까지 완벽합니다!" }
        ],
        successMessage: "완벽해요! 이런 감동적인 장면이면 독자들 마음을 확실히 울릴 거예요!"
    },
    // ===== 스토리2-6: 비밀 아지트 (Thomas, draw) =====
    "PRESS_STORY_06": {
        rubrics: [
            { id: 'isHideout',       prompt: "비밀 아지트 같은 장소로 보이는가? (true/false)", weight: 50, isSubject: true, failMessage: "비밀 아지트 같은 느낌이 잘 안 보이네.", successMessage: "아, 이런 곳에서 둘이 만났구나! 완벽한 비밀 아지트네." },
            { id: 'romantic',        prompt: "낭만적이고 따뜻한 분위기인가? (0/1/2)", weight: 30, failMessage: "좀 더 낭만적인 분위기면 좋겠네.", successMessage: "이 낭만적인 분위기... 정말 좋구나." },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20, failMessage: "조금만 더 정성스럽게 그려줬다면 좋았겠네.", successMessage: "완성도가 정말 훌륭하네." },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리를 더 매끄럽게 다듬어줬다면 좋을 것 같다네.", successMessage: "마무리까지 완벽하네!" }
        ],
        successMessage: "훌륭하네! 두 사람의 비밀 아지트가 완벽하게 그려졌구만."
    },
    // ===== 스토리3-3: 결백의 증명(?) (Finn, draw) =====
    "PIE_STORY_03": {
        rubrics: [
            { id: 'isScary',         prompt: "누군가에겐 무서운 그림일 수 있는가? (true/false)", weight: 30, isSubject: true, failMessage: "생각보다 별로 안 무서운데? 이거보다 훨씬 무서워야 한다고!!", successMessage: "이 정도면 누구든 비명 지르겠는걸!" },
            { id: 'hasFocus',        prompt: "공포의 대상/장면이 명확하게 중심에 표현되었는가? (true/false)", weight: 20, failMessage: "무엇이 무서운지 조금 애매하네~", successMessage: "무서운 포인트가 딱 보이니까 좋아!" },
            { id: 'atmosphere',      prompt: "조명/구도/색감 등으로 불길한 분위기가 잘 살아나는가? (0/1/2)", weight: 30, failMessage: "분위기가 좀 밋밋한데?", successMessage: "우와, 진짜 소름 돋는 분위기다!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 30, failMessage: "좀 더 디테일하게 그렸으면 더 무서웠을 텐데~", successMessage: "세부까지 완전 공들였네!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리가 좀 급한 것 같은데?", successMessage: "마무리까지 완벽하게 무서운 그림이야!" }
        ],
        successMessage: "완전 소름 돋아! 이 정도면 나도 깜짝 놀라겠다니까!"
    },
    // ===== 스토리3-4: 과잉 방어 (Clara, draw) =====
    "PIE_STORY_04": {
        rubrics: [
            { id: 'isTrapDesign',    prompt: "그림이 '덫/함정 설계도'로 인식되는가? (true/false)", weight: 40, isSubject: true, failMessage: "이게 덫 설계도인지 잘 모르겠어요.", successMessage: "한눈에 덫 설계도라는 게 느껴져요." },
            { id: 'showsMechanism',  prompt: "어떻게 작동하는지 대략 이해될 정도로 구조가 표현되었는가? (0/1/2)", weight: 30, failMessage: "조금만 더 구조가 보였으면 좋겠어요.", successMessage: "이 그림만 봐도 어떻게 작동하는지 상상이 돼요!" },
            { id: 'isNonlethal',     prompt: "상대가 다치지 않고 붙잡히는 '비살상' 장치로 보이는가? (true/false)", weight: 20, failMessage: "조금 위험해 보이는 덫이에요...", successMessage: "딱 적당히 놀라게 만들지만 다치진 않을 덫이네요." },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 10, failMessage: "선 몇 개만 더 정리해도 훨씬 좋아질 것 같아요.", successMessage: "설계도 치고도 아주 정교하게 잘 그려졌어요." },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리가 조금 급한 느낌이에요.", successMessage: "설계도로서 손색없는 완성도예요!" }
        ],
        successMessage: "이 정도면 빵집에 온 범인은 100% 덫에 걸리겠는데요!"
    },
    // ===== 스토리3-5: 그리운 파이의 맛 (Pochi, draw) =====
    "PIE_STORY_05": {
        rubrics: [
            { id: 'isPie',      prompt: "그림이 '파이'로 인식되는가? (true/false)", weight: 40, isSubject: true, failMessage: "이게 파이인지 잘 모르겠어요… 배가 더 고파졌어요.", successMessage: "당장이라도 먹고 싶은 파이네요!" },
            { id: 'looksDelicious',  prompt: "갓 구운 듯 맛있어 보이는가? (0/1/2)", weight: 40, failMessage: "조금 더 따끈따끈한 느낌이 있었으면 좋겠어요.", successMessage: "냄새까지 느껴질 것처럼 맛있어 보여요!" },
            { id: 'detailLevel',     prompt: "완성도 (0: 매우 부실, 1: 무난, 2: 훌륭)", weight: 20, failMessage: "조금만 더 정성스럽게 굽(?)… 아니, 그려주셨으면 좋겠어요.", successMessage: "디테일까지 정성 가득한 파이에요!" },
            { id: 'completeness',    prompt: "전체 완성감/마무리는? (0:미흡, 1:보통, 2:정교)", weight: 10, failMessage: "마무리가 살짝 아쉽네요.", successMessage: "한 조각 잘라 바로 접시에 올려도 될 만큼 완벽해요!" }
        ],
        successMessage: "멍! 이 정도면 진짜 냄새가 나는 것 같아요! 배고픔이 조금 사라졌어요!"
    }
});
