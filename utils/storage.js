const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  USER_PROFILE: 'userProfile',
  SCORE: 'userScore',
  SIGN_IN: 'signInRecord',
  LEVEL_PROGRESS: 'levelProgress',
  WRONG_QUESTIONS: 'wrongQuestions',
  COLLECTIONS: 'collections',
  BADGES: 'unlockedBadges',
  COMBO_RECORD: 'comboRecord',
  SETTINGS: 'userSettings',
  RANK_DATA: 'rankData'
}

function get(key) {
  try {
    return wx.getStorageSync(key)
  } catch (e) {
    return null
  }
}

function set(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    return false
  }
}

module.exports = { STORAGE_KEYS, get, set }
