const { CONSTANTS } = require('../../data/constants')
const app = getApp()

Page({
  data: {
    levelId: 1,
    levelName: '',
    score: 0,
    total: 0,
    passed: false,
    totalScore: 0,
    combo: 0,
    hasNextLevel: false,
    rank: null
  },

  onLoad(options) {
    const levelId = parseInt(options.levelId) || 1
    const score = parseInt(options.score) || 0
    const total = parseInt(options.total) || 0
    const passed = options.passed === 'true'
    const totalScore = parseInt(options.totalScore) || 0
    const combo = parseInt(options.combo) || 0
    const levelName = decodeURIComponent(options.levelName || '')
    const hasNextLevel = levelId < CONSTANTS.TOTAL_LEVELS

    const { getRankByScore } = require('../../data/constants')
    const rank = getRankByScore(app.globalData.score)

    this.setData({
      levelId, levelName, score, total, passed, totalScore, combo,
      hasNextLevel, rank
    })
  },

  nextLevel() {
    wx.redirectTo({ url: `/pages/game/game?level=${this.data.levelId + 1}` })
  },

  retryLevel() {
    wx.redirectTo({ url: `/pages/game/game?level=${this.data.levelId}` })
  },

  backHome() {
    wx.reLaunch({ url: '/pages/index/index' })
  }
})
