const CONSTANTS = {
  TOTAL_LEVELS: 3,
  PASS_SCORE: 2,
  QUESTIONS_PER_LEVEL: 3,
  TIMER_SECONDS: 60,
  SCORE_PER_CORRECT: 10,
  SCORE_PER_COMBO_3: 5,
  SCORE_PER_COMBO_5: 15,
  SIGN_IN_DAILY: 10,
  SIGN_IN_7_EXTRA: 50,
  PK_WIN: 20,
  PK_LOSE: 5,
  PK_TIE: 10,
  LEVEL_COMPLETE_BONUS: 20,
  SHARE_BONUS: 15,
  INVITE_BONUS: 100,
  PROMPT_TICKET_COST: 10,
  SKIP_TICKET_COST: 15,
  REVIVE_COST: 20,

  RANK_TOTAL: 'total',
  RANK_WEEKLY: 'weekly',
  RANK_DAILY: 'daily',

  RANKS: [
    { name: '青铜', minScore: 0, maxScore: 99, icon: '🥉', color: '#CD7F32' },
    { name: '白银', minScore: 100, maxScore: 299, icon: '🥈', color: '#C0C0C0' },
    { name: '黄金', minScore: 300, maxScore: 599, icon: '🥇', color: '#FFD700' },
    { name: '铂金', minScore: 600, maxScore: 999, icon: '💎', color: '#E5E4E2' },
    { name: '钻石', minScore: 1000, maxScore: 1999, icon: '👑', color: '#B9F2FF' },
    { name: '王者', minScore: 2000, maxScore: Infinity, icon: '🏆', color: '#FF4500' }
  ],

  BADGES: [
    { id: 'first_level', name: '初入职场', desc: '完成 Lv.1 全部关卡', icon: '🎯', reward: 10 },
    { id: 'resume_master', name: '简历达人', desc: '简历模块正确率达80%', icon: '📝', reward: 20 },
    { id: 'interview_pro', name: '面试高手', desc: '累计完成10次AI模拟面试', icon: '🎤', reward: 50 },
    { id: 'pk_king', name: 'PK之王', desc: 'PK胜率>70%且场次≥20', icon: '⚔️', reward: 100 },
    { id: 'checkin_7', name: '连续打卡', desc: '连续7天每日至少完成1关', icon: '📅', reward: 50 },
    { id: 'sharer', name: '知识分享家', desc: '累计分享海报10次', icon: '📣', reward: 30 },
    { id: 'contributor', name: '真题贡献者', desc: '提交5道真题被采纳', icon: '💡', reward: 150 }
  ],

  DIMENSIONS: ['简历力', '面试力', '行业认知力', '法律常识力', '沟通表达力']
}

function getRankByScore(score) {
  for (let i = CONSTANTS.RANKS.length - 1; i >= 0; i--) {
    if (score >= CONSTANTS.RANKS[i].minScore) return CONSTANTS.RANKS[i]
  }
  return CONSTANTS.RANKS[0]
}

module.exports = { CONSTANTS, getRankByScore }
