const { levels } = require('../../data/questions')
const { CONSTANTS, getRankByScore } = require('../../data/constants')
const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const { todayStr } = require('../../utils/util')
const app = getApp()

Page({
  data: {
    loggedIn: false,
    userInfo: null,
    userProfile: null,
    score: 0,
    rank: CONSTANTS.RANKS[0],
    levelList: [],
    progressPercent: 0,
    currentLevel: 1,
    signedIn: false,
    dailyDone: false,
    resumeText: ''
  },

  onShow() {
    app.loadGlobalData()
    const loggedIn = app.isLoggedIn()

    if (!loggedIn) {
      wx.redirectTo({ url: '/pages/login/login' })
      return
    }

    if (!app.isOnboarded()) {
      wx.redirectTo({ url: '/pages/onboarding/onboarding' })
      return
    }

    this.initPage()
  },

  initPage() {
    const score = app.globalData.score
    const rank = getRankByScore(score)
    const userInfo = app.globalData.userInfo
    const userProfile = app.globalData.userProfile
    const progress = app.globalData.levelProgress
    const totalLevels = CONSTANTS.TOTAL_LEVELS

    const levelIds = Object.keys(progress).map(Number)
    const currentLevel = levelIds.length > 0 ? Math.min(Math.max(...levelIds) + 1, totalLevels) : 1
    const completed = levelIds.filter(id => progress[id] && progress[id].passed).length
    const progressPercent = totalLevels > 0 ? (completed / totalLevels) * 100 : 0

    const signInRecord = get(STORAGE_KEYS.SIGN_IN) || {}
    const signedIn = signInRecord.lastDate === todayStr()

    const levelList = Object.keys(levels).map(k => levels[k]).map(l => {
      const p = progress[l.id]
      return {
        id: l.id,
        name: l.name,
        desc: l.subtitle,
        status: p ? (p.passed ? 'completed' : 'failed') : 'locked',
        stars: p ? p.stars || 0 : 0
      }
    })

    levelList[0].status = 'available'
    for (let i = 0; i < levelList.length; i++) {
      if (i > 0 && levelList[i-1].status === 'completed') {
        levelList[i].status = 'available'
      }
    }

    const resumeText = completed > 0
      ? `你已完成 Lv.${currentLevel - 1}，继续闯关吧！`
      : '开始你的第一次闯关挑战吧！'

    this.setData({
      loggedIn: true,
      userInfo,
      userProfile,
      score,
      rank,
      levelList,
      progressPercent,
      currentLevel,
      signedIn,
      resumeText
    })
  },

  startGame() {
    wx.navigateTo({ url: `/pages/game/game?level=${this.data.currentLevel}` })
  },

  goProfile() { wx.navigateTo({ url: '/pages/profile/profile' }) },
  goRanking() { wx.navigateTo({ url: '/pages/ranking/ranking' }) },
  goWrongBook() { wx.navigateTo({ url: '/pages/wrong-book/wrong-book' }) },
  goBadges() { wx.navigateTo({ url: '/pages/badges/badges' }) },

  doSignIn() {
    const signInRecord = get(STORAGE_KEYS.SIGN_IN) || {}
    const today = todayStr()

    if (signInRecord.lastDate === today) {
      wx.showToast({ title: '今日已签到', icon: 'none' })
      return
    }

    let streak = signInRecord.streak || 0
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth()+1).padStart(2,'0')}-${String(yesterday.getDate()).padStart(2,'0')}`

    if (signInRecord.lastDate === yStr) {
      streak += 1
    } else {
      streak = 1
    }

    let bonus = CONSTANTS.SIGN_IN_DAILY
    if (streak >= 7) {
      bonus += CONSTANTS.SIGN_IN_7_EXTRA
      wx.showToast({ title: `连续签到7天！额外+${CONSTANTS.SIGN_IN_7_EXTRA}分`, icon: 'success' })
    }

    app.addScore(bonus)
    set(STORAGE_KEYS.SIGN_IN, { lastDate: today, streak })

    this.setData({
      signedIn: true,
      score: app.globalData.score,
      rank: getRankByScore(app.globalData.score)
    })

    wx.showToast({ title: `签到成功 +${bonus}分`, icon: 'success' })
  }
})
