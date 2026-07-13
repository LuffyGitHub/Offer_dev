const { CONSTANTS, getRankByScore } = require('../../data/constants')
const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const api = require('../../utils/api')
const { getOpenid } = require('../../utils/openid')
const { todayStr } = require('../../utils/util')
const app = getApp()

Page({
  data: {
    loggedIn: false, userInfo: null, userProfile: null,
    score: 0, rank: CONSTANTS.RANKS[0],
    levelList: [], progressPercent: 0, currentLevel: 1,
    signedIn: false, resumeText: ''
  },

  onShow() {
    app.loadLocalData()
    const loggedIn = app.isLoggedIn()
    if (!loggedIn) { wx.redirectTo({ url: '/pages/login/login' }); return }
    if (!app.isOnboarded()) { wx.redirectTo({ url: '/pages/onboarding/onboarding' }); return }
    this.initPage()
    this.syncServer()
  },

  initPage() {
    const score = app.globalData.score
    const rank = getRankByScore(score)
    const progress = app.globalData.levelProgress || {}
    const totalLevels = CONSTANTS.TOTAL_LEVELS
    const completed = Object.values(progress).filter(p => p.passed).length
    const currentLevel = completed < totalLevels ? completed + 1 : totalLevels
    const signedIn = (app.globalData.signInData?.lastDate) === todayStr()

    const lvNames = ['职业探索期', '实习准备期', '冲刺求职期']
    const lvDescs = ['自我认知与行业入门', '简历面试与职场沟通', '大厂真题与权益保护']
    const levelList = [1, 2, 3].map((id, i) => {
      const p = progress[id]
      let status = id === 1 ? 'available' : 'locked'
      if (p?.passed) status = 'completed'
      else if (progress[id - 1]?.passed || id === 1) status = 'available'
      return { id, name: lvNames[i], desc: lvDescs[i], status, stars: p?.stars || 0 }
    })

    this.setData({
      loggedIn: true, userInfo: app.globalData.userInfo,
      userProfile: app.globalData.userProfile, score, rank,
      levelList, progressPercent: totalLevels > 0 ? (completed / totalLevels) * 100 : 0,
      signedIn,
      resumeText: completed > 0
        ? `你已完成 Lv.${currentLevel - 1}，继续闯关吧！`
        : '开始你的第一次闯关挑战吧！'
    })
  },

  async syncServer() {
    try {
      await app.syncFromServer()
      this.setData({ score: app.globalData.score, rank: getRankByScore(app.globalData.score) })
    } catch (e) { console.warn('服务器同步失败', e) }
  },

  startGame() { wx.navigateTo({ url: `/pages/game/game?level=${this.data.currentLevel}` }) },
  goProfile() { wx.navigateTo({ url: '/pages/profile/profile' }) },
  goRanking() { wx.navigateTo({ url: '/pages/ranking/ranking' }) },
  goWrongBook() { wx.navigateTo({ url: '/pages/wrong-book/wrong-book' }) },
  goBadges() { wx.navigateTo({ url: '/pages/badges/badges' }) },

  async doSignIn() {
    const today = todayStr()
    if (app.globalData.signInData?.lastDate === today) {
      wx.showToast({ title: '今日已签到', icon: 'none' }); return
    }

    try {
      const result = await api.score.signIn(getOpenid())
      const streak = result?.streak || 1
      let bonus = CONSTANTS.SIGN_IN_DAILY
      if (streak >= 7) {
        bonus += CONSTANTS.SIGN_IN_7_EXTRA
        wx.showToast({ title: `连续签到7天！额外+${CONSTANTS.SIGN_IN_7_EXTRA}分`, icon: 'success' })
      }
      app.addScore(bonus)
      app.globalData.signInData = { lastDate: today, streak }
      set(STORAGE_KEYS.SIGN_IN, app.globalData.signInData)
      this.setData({ signedIn: true, score: app.globalData.score, rank: getRankByScore(app.globalData.score) })
      wx.showToast({ title: `签到成功 +${bonus}分`, icon: 'success' })
    } catch (e) {
      if (e.message === '今日已签到') {
        app.globalData.signInData = { lastDate: today, streak: app.globalData.signInData?.streak || 1 }
        set(STORAGE_KEYS.SIGN_IN, app.globalData.signInData)
        this.setData({ signedIn: true })
      } else {
        wx.showToast({ title: '签到失败，本地模式可用', icon: 'none' })
        app.addScore(CONSTANTS.SIGN_IN_DAILY)
        app.globalData.signInData = { lastDate: today, streak: 1 }
        set(STORAGE_KEYS.SIGN_IN, app.globalData.signInData)
        this.setData({ signedIn: true, score: app.globalData.score })
      }
    }
  }
})
