// 출석체크 데이터 관리
const AttendanceData = {
    // 일별 보상 목록 (16일 사이클)
    rewards: [
        { day: 1, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 2, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 3, type: 'reputation', amount: 5, icon: 'assets/images/ui/icon/fame_Icon.png' },
        { day: 4, type: 'gold', amount: 200, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 5, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 6, type: 'gold', amount: 200, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 7, type: 'reputation', amount: 15, icon: 'assets/images/ui/icon/fame_Icon.png' },
        { day: 8, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 9, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 10, type: 'reputation', amount: 15, icon: 'assets/images/ui/icon/fame_Icon.png' },
        { day: 11, type: 'reputation', amount: 5, icon: 'assets/images/ui/icon/fame_Icon.png' },
        { day: 12, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 13, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 14, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 15, type: 'gold', amount: 100, icon: 'assets/images/ui/icon/money_Icon.png' },
        { day: 16, type: 'reputation', amount: 20, icon: 'assets/images/ui/icon/fame_Icon.png' }
    ],

    // 현재 출석 상태 (PlayerData와 통합 예정)
    getCurrentDay() {
        return PlayerData.data.attendance?.currentDay || 1;
    },

    getAttendedDays() {
        return PlayerData.data.attendance?.attendedDays || [];
    },

    getLastAttendanceDate() {
        return PlayerData.data.attendance?.lastDate || null;
    },

    // 오늘 출석 가능 여부 확인
    canAttendToday() {
        const today = new Date().toDateString();
        const lastDate = this.getLastAttendanceDate();
        return today !== lastDate;
    },

    // 출석 처리
    attend() {
        if (!this.canAttendToday()) {
            return { success: false, message: '오늘은 이미 출석했습니다!' };
        }

        const currentDay = this.getCurrentDay();
        const reward = this.rewards[currentDay - 1];
        
        // PlayerData에 출석 정보 저장
        if (!PlayerData.data.attendance) {
            PlayerData.data.attendance = {
                currentDay: 1,
                attendedDays: [],
                lastDate: null
            };
        }

        PlayerData.data.attendance.attendedDays.push(currentDay);
        PlayerData.data.attendance.lastDate = new Date().toDateString();
        PlayerData.data.attendance.currentDay = currentDay >= 16 ? 1 : currentDay + 1;

        // 보상 지급
        let rewardMessage = '';
        switch (reward.type) {
            case 'gold':
                PlayerData.addGold(reward.amount);
                rewardMessage = `${reward.amount} 골드를 획득했습니다!`;
                break;
            case 'reputation':
                PlayerData.addReputation(reward.amount);
                rewardMessage = `명성 +${reward.amount}을 획득했습니다!`;
                break;
        }

        return { 
            success: true, 
            message: rewardMessage,
            reward: reward,
            day: currentDay
        };
    },

    // 출석부 초기화 (테스트용)
    reset() {
        if (PlayerData.data.attendance) {
            PlayerData.data.attendance = {
                currentDay: 1,
                attendedDays: [],
                lastDate: null
            };
            PlayerData.emitChange();
        }
    }
};

