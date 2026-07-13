const { STORAGE_KEYS, set } = require('../../utils/storage')
const { user } = require('../../utils/cloud')
const app = getApp()

Page({
  onLogin(e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      const userInfo = e.detail.userInfo
      app.globalData.userInfo = userInfo
      set(STORAGE_KEYS.USER_INFO, userInfo)

      wx.showLoading({ title: '登录中...' })

      user.login(userInfo).then(cloudUser => {
        wx.hideLoading()
        if (cloudUser) {
          app.globalData.score = cloudUser.score || 0
          app.globalData.rankName = cloudUser.rankName || '青铜'
        }

        if (!app.isOnboarded()) {
          wx.redirectTo({ url: '/pages/onboarding/onboarding' })
        } else {
          app.syncFromCloud().then(() => {
            wx.reLaunch({ url: '/pages/index/index' })
          })
        }
      }).catch(err => {
        wx.hideLoading()
        wx.showToast({ title: '登录失败', icon: 'none' })
        console.error(err)
      })
    } else {
      wx.showToast({ title: '需要授权才能使用', icon: 'none' })
    }
  }
})
