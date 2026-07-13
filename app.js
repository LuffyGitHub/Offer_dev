const { STORAGE_KEYS, get, set } = require('./utils/storage')
const { ENV } = require('./utils/cloud')

App({
  globalData: {
    userInfo: null,
    userProfile: null,
    score: 0,
    rankName: '青铜',
    unlockedBadges: [],
    levelProgress: {},
    wrongQuestions: [],
    signInData: null,
    settings: null,
    cloudReady: false
  },

  onLaunch() {
    wx.cloud.init({
      env: ENV,
      traceUser: true
    })

    this.globalData.cloudReady = true
    this.loadLocalData()

    if (this.isLoggedIn()) {
      this.syncFromCloud()
    }
  },

  loadLocalData() {
    this.globalData.userInfo = get(STORAGE_KEYS.USER_INFO) || null
    this.globalData.userProfile = get(STORAGE_KEYS.USER_PROFILE) || null
    this.globalData.score = get(STORAGE_KEYS.SCORE) || 0
    this.globalData.unlockedBadges = get(STORAGE_KEYS.BADGES) || []
    this.globalData.levelProgress = get(STORAGE_KEYS.LEVEL_PROGRESS) || {}
    this.globalData.wrongQuestions = get(STORAGE_KEYS.WRONG_QUESTIONS) || []
    this.globalData.signInData = get(STORAGE_KEYS.SIGN_IN) || null
    this.globalData.settings = get(STORAGE_KEYS.SETTINGS) || null
  },

  async syncFromCloud() {
    try {
      const { user } = require('./utils/cloud')
      const cloudData = await user.getUserData()
      if (cloudData) {
        if (cloudData.user) {
          this.globalData.score = cloudData.user.score || 0
          this.globalData.rankName = cloudData.user.rankName || '青铜'
        }
        if (cloudData.profile) this.globalData.userProfile = cloudData.profile
        if (cloudData.settings) this.globalData.settings = cloudData.settings
        if (cloudData.signIn) this.globalData.signInData = cloudData.signIn

        const progress = {}
        if (cloudData.progress) {
          cloudData.progress.forEach(p => { progress[p.levelId] = p })
        }
        this.globalData.levelProgress = progress

        if (cloudData.badges) {
          this.globalData.unlockedBadges = cloudData.badges.map(b => b.badgeId)
        }

        this.globalData.wrongQuestions = cloudData.wrongQuestions || []
      }
    } catch (e) {
      console.warn('云同步失败，使用本地数据', e)
    }
  },

  isLoggedIn() {
    return !!this.globalData.userInfo
  },

  isOnboarded() {
    return !!this.globalData.userProfile
  },

  addScore(amount) {
    this.globalData.score += amount
    set(STORAGE_KEYS.SCORE, this.globalData.score)

    const { score } = require('./utils/cloud')
    score.addScore(amount).catch(() => {})
  },

  unlockBadge(badgeId) {
    if (!this.globalData.unlockedBadges.includes(badgeId)) {
      this.globalData.unlockedBadges.push(badgeId)
      set(STORAGE_KEYS.BADGES, this.globalData.unlockedBadges)

      const { score } = require('./utils/cloud')
      score.unlockBadge(badgeId).catch(() => {})
      return true
    }
    return false
  }
})
