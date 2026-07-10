const { STORAGE_KEYS, set } = require('../../utils/storage')
const app = getApp()

Page({
  onLogin(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      set(STORAGE_KEYS.USER_INFO, userInfo)

      if (!app.isOnboarded()) {
        wx.redirectTo({ url: '/pages/onboarding/onboarding' })
      } else {
        wx.switchTab({ url: '/pages/index/index' })
      }
    } else {
      wx.showToast({ title: '需要授权才能使用', icon: 'none' })
    }
  }
})
