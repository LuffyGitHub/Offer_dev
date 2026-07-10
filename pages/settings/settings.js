const { STORAGE_KEYS, get, set } = require('../../utils/storage')

Page({
  data: {
    settings: {
      pushEnabled: true,
      pushTime: '08:00',
      showInRank: true,
      showProgress: true
    }
  },

  onShow() {
    const saved = get(STORAGE_KEYS.SETTINGS) || this.data.settings
    this.setData({ settings: saved })
  },

  save() {
    set(STORAGE_KEYS.SETTINGS, this.data.settings)
  },

  togglePush(e) {
    this.data.settings.pushEnabled = e.detail.value
    this.save()
  },

  onTimeChange(e) {
    this.data.settings.pushTime = e.detail.value
    this.save()
  },

  toggleRankVis(e) {
    this.data.settings.showInRank = e.detail.value
    this.save()
  },

  toggleProgressVis(e) {
    this.data.settings.showProgress = e.detail.value
    this.save()
  },

  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '清除所有数据后将回到初始状态，确定吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.reLaunch({ url: '/pages/login/login' })
          } catch (e) {
            wx.showToast({ title: '清除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
