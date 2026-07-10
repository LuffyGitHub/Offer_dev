const { CONSTANTS } = require('../../data/constants')
const app = getApp()

Page({
  data: {
    badges: []
  },

  onShow() {
    const unlocked = app.globalData.unlockedBadges || []
    const badges = CONSTANTS.BADGES.map(b => ({
      ...b,
      unlocked: unlocked.includes(b.id)
    }))
    this.setData({ badges })
  }
})
