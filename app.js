const { STORAGE_KEYS, get, set } = require('./utils/storage')
const api = require('./utils/api')
const { getOpenid } = require('./utils/openid')

App({
  globalData: {
    openid: '',
    userInfo: null,
    userProfile: null,
    score: 0,
    rankName: '青铜',
    unlockedBadges: [],
    levelProgress: {},
    wrongQuestions: [],
    signInData: null,
    settings: null
  },

  onLaunch() {
    this.globalData.openid = getOpenid()
    this.loadLocalData()

    if (this.isLoggedIn()) {
      this.syncFromServer()
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

  async syncFromServer() {
    try {
      const openid = this.globalData.openid
      const cloudData = await api.user.getUserData(openid)
      if (cloudData) {
        if (cloudData.user) {
          this.globalData.score = cloudData.user.score || 0
          this.globalData.rankName = cloudData.user.rankName || '青铜'
          set(STORAGE_KEYS.SCORE, this.globalData.score)
        }
        if (cloudData.profile) {
          this.globalData.userProfile = cloudData.profile
          set(STORAGE_KEYS.USER_PROFILE, cloudData.profile)
        }
        if (cloudData.settings) {
          this.globalData.settings = cloudData.settings
          set(STORAGE_KEYS.SETTINGS, cloudData.settings)
        }
        if (cloudData.signIn) {
          this.globalData.signInData = cloudData.signIn
          set(STORAGE_KEYS.SIGN_IN, cloudData.signIn)
        }

        const progress = {}
        if (cloudData.progress && cloudData.progress.length) {
          cloudData.progress.forEach(p => { progress[p.level_id] = p })
        }
        this.globalData.levelProgress = progress
        set(STORAGE_KEYS.LEVEL_PROGRESS, progress)

        if (cloudData.badges && cloudData.badges.length) {
          this.globalData.unlockedBadges = cloudData.badges.map(b => b.badge_id || b.badgeId)
          set(STORAGE_KEYS.BADGES, this.globalData.unlockedBadges)
        }

        this.globalData.wrongQuestions = cloudData.wrongQuestions || []
        set(STORAGE_KEYS.WRONG_QUESTIONS, this.globalData.wrongQuestions)
      }
    } catch (e) {
      console.warn('服务器同步失败，使用本地数据', e)
    }
  },

  isLoggedIn() {
    return !!this.globalData.userInfo
  },

  isOnboarded() {
    return !!this.globalData.userProfile
  },

  async addScore(amount) {
    this.globalData.score += amount
    set(STORAGE_KEYS.SCORE, this.globalData.score)
    try {
      await api.score.addScore(this.globalData.openid, amount)
    } catch (e) {
      console.warn('积分同步失败', e)
    }
  },

  async unlockBadge(badgeId) {
    if (!this.globalData.unlockedBadges.includes(badgeId)) {
      this.globalData.unlockedBadges.push(badgeId)
      set(STORAGE_KEYS.BADGES, this.globalData.unlockedBadges)
      try {
        await api.score.unlockBadge(this.globalData.openid, badgeId)
      } catch (e) {
        console.warn('勋章同步失败', e)
      }
      return true
    }
    return false
  }
})
