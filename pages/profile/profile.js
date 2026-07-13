const { CONSTANTS, getRankByScore } = require('../../data/constants')
const app = getApp()

Page({
  data: {
    userInfo: null, userProfile: null, score: 0, rank: null,
    dimensions: [], wrongCount: 0, completedLevels: 0, badgeCount: 0
  },

  onShow() {
    const userInfo = app.globalData.userInfo
    const userProfile = app.globalData.userProfile
    const score = app.globalData.score
    const rank = getRankByScore(score)
    const wrongQuestions = app.globalData.wrongQuestions || []
    const progress = app.globalData.levelProgress || {}
    const badges = app.globalData.unlockedBadges || []
    const completedLevels = Object.values(progress).filter(p => p.passed).length

    const dimData = [
      { name: '简历力', value: this.calcModuleAbility('简历', wrongQuestions) },
      { name: '面试力', value: this.calcModuleAbility('面试', wrongQuestions) },
      { name: '行业认知力', value: this.calcModuleAbility('行业认知', wrongQuestions) },
      { name: '法律常识力', value: this.calcModuleAbility('劳动法', wrongQuestions) },
      { name: '沟通表达力', value: this.calcModuleAbility('职场常识', wrongQuestions) }
    ]

    this.setData({
      userInfo, userProfile, score, rank, dimensions: dimData,
      wrongCount: wrongQuestions.length, completedLevels, badgeCount: badges.length
    })
  },

  calcModuleAbility(module, wrongQuestions) {
    const { questions } = require('../../data/questions')
    const total = questions.filter(q => q.module === module).length || 1
    const wrong = wrongQuestions.filter(w => w.module === module).length
    return Math.min(100, Math.round(((total - wrong) / total) * 100))
  },

  goWrongBook() { wx.navigateTo({ url: '/pages/wrong-book/wrong-book' }) },
  goBadges() { wx.navigateTo({ url: '/pages/badges/badges' }) },
  goSettings() { wx.navigateTo({ url: '/pages/settings/settings' }) }
})
