const { levels } = require('../../data/questions')
const app = getApp()

Page({
  data: {
    levelId: 1,
    levelName: '',
    score: 0,
    total: 0,
    passed: false,
    hasNextLevel: false
  },

  onLoad(options) {
    const levelId = parseInt(options.levelId) || 1
    const score = parseInt(options.score) || 0
    const total = parseInt(options.total) || 0
    const passed = options.passed === 'true'
    const levelData = levels.find(l => l.id === levelId)
    const totalLevels = app.globalData.totalLevels
    const hasNextLevel = levelId < totalLevels

    this.setData({
      levelId,
      levelName: levelData ? levelData.name : '',
      score,
      total,
      passed,
      hasNextLevel
    })
  },

  nextLevel() {
    const nextId = this.data.levelId + 1
    wx.redirectTo({
      url: `/pages/game/game?level=${nextId}`
    })
  },

  retryLevel() {
    wx.redirectTo({
      url: `/pages/game/game?level=${this.data.levelId}`
    })
  },

  backHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})
