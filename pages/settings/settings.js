const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const { user } = require('../../utils/cloud')
const app = getApp()

Page({
  data: {
    settings: {
      pushEnabled: true, pushTime: '08:00',
      showInRank: true, showProgress: true
    }
  },

  onShow() {
    const saved = app.globalData.settings || get(STORAGE_KEYS.SETTINGS) || this.data.settings
    this.setData({ settings: saved })
  },

  async saveToCloud() {
    try {
      await user.saveSettings(this.data.settings)
      app.globalData.settings = this.data.settings
      set(STORAGE_KEYS.SETTINGS, this.data.settings)
    } catch (e) { console.warn('云保存设置失败', e) }
  },

  togglePush(e) { this.data.settings.pushEnabled = e.detail.value; this.saveToCloud() },
  onTimeChange(e) { this.data.settings.pushTime = e.detail.value; this.saveToCloud() },
  toggleRankVis(e) { this.data.settings.showInRank = e.detail.value; this.saveToCloud() },
  toggleProgressVis(e) { this.data.settings.showProgress = e.detail.value; this.saveToCloud() },

  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '清除所有本地数据后回到初始状态，云数据不受影响，确定吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            app.globalData.userInfo = null
            app.globalData.userProfile = null
            wx.reLaunch({ url: '/pages/login/login' })
          } catch (e) {
            wx.showToast({ title: '清除失败', icon: 'none' })
          }
        }
      }
    })
  }
})
