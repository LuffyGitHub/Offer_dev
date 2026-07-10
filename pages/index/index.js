const { levels } = require('../../data/questions')

Page({
  data: {
    levels: []
  },

  onLoad() {
    const levelList = levels.map(l => ({
      id: l.id,
      name: l.name,
      desc: l.subtitle
    }))
    this.setData({ levels: levelList })
  },

  startGame() {
    wx.navigateTo({
      url: '/pages/game/game?level=1'
    })
  }
})
