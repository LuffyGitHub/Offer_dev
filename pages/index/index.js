const { CONSTANTS, getRankByScore } = require('../../data/constants')
const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const { score: scoreApi, game: gameApi } = require('../../utils/cloud')
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
    this.syncCloud()
  },

  initPage() {
    const score = app.globalData.score
    const rank = getRankByScore(score)
    const userInfo = app.globalData.userInfo
    const userProfile = app.globalData.userProfile
    const progress = app.globalData.levelProgress || {}
    const totalLevels = CONSTANTS.TOTAL_LEVELS

    const completed = Object.values(progress).filter(p => p.passed).length
    const currentLevel = completed < totalLevels ? completed + 1 : totalLevels
    const progressPercent = totalLevels > 0 ? (completed / totalLevels) * 100 : 0

    const signInRecord = app.globalData.signInData || {}
    const signedIn = signInRecord.lastDate === todayStr()

    const levelList = [1, 2, 3].map(id => {
      const p = progress[id]
      const status = !p ? (id === 1 ? 'available' : (progress[id-1]?.passed ? 'available' : 'locked'))
        : (p.passed ? 'completed' : 'failed')
      return { id, name: CONSTANTS.BADGES[id-1]?.name || '', desc: '', status, stars: p?.stars || 0 }
    })

    levelList[0].status = 'available'
    for (let i = 0; i < levelList.length; i++) {
      if (i > 0 && levelList[i-1].status === 'completed' && levelList[i].status === 'locked') {
        levelList[i].status = 'available'
      }
    }

    const lvNames = ['职业探索期', '实习准备期', '冲刺求职期']
    const lvDescs = ['自我认知与行业入门', '简历面试与职场沟通', '大厂真题与权益保护']
    levelList.forEach((l, i) => { l.name = lvNames[i]; l.desc = lvDescs[i] })

    this.setData({
      loggedIn: true, userInfo, userProfile, score, rank,
      levelList, progressPercent, signedIn,
      resumeText: completed > 0 ? `你已完成 Lv.${currentLevel - 1}，继续闯关吧！` : '开始你的第一次闯关挑战吧！'
    })
  },

  async syncCloud() {
    try {
      await app.syncFromCloud()
      const score = app.globalData.score
      this.setData({ score, rank: getRankByScore(score) })
    } catch (e) { console.warn('云同步失败', e) }
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
      const result = await scoreApi.signIn()
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
        wx.showToast({ title: '今日已签到', icon: 'none' })
      } else {
        wx.showToast({ title: '签到失败', icon: 'none' })
      }
    }
  }
})
