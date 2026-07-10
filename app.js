const { STORAGE_KEYS, get, set } = require('./utils/storage')

App({
  globalData: {
    userInfo: null,
    userProfile: null,
    score: 0,
    unlockedBadges: [],
    levelProgress: {},
    wrongQuestions: []
  },

  onLaunch() {
    this.loadGlobalData()
  },

  loadGlobalData() {
    this.globalData.userInfo = get(STORAGE_KEYS.USER_INFO)
    this.globalData.userProfile = get(STORAGE_KEYS.USER_PROFILE)
    this.globalData.score = get(STORAGE_KEYS.SCORE) || 0
    this.globalData.unlockedBadges = get(STORAGE_KEYS.BADGES) || []
    this.globalData.levelProgress = get(STORAGE_KEYS.LEVEL_PROGRESS) || {}
    this.globalData.wrongQuestions = get(STORAGE_KEYS.WRONG_QUESTIONS) || []
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
  },

  unlockBadge(badgeId) {
    if (!this.globalData.unlockedBadges.includes(badgeId)) {
      this.globalData.unlockedBadges.push(badgeId)
      set(STORAGE_KEYS.BADGES, this.globalData.unlockedBadges)
      return true
    }
    return false
  }
})
