const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const app = getApp()

Page({
  data: {
    activeFilter: 'all',
    wrongList: [],
    filteredList: []
  },

  onShow() {
    const wrongList = get(STORAGE_KEYS.WRONG_QUESTIONS) || []
    this.setData({ wrongList })
    this.applyFilter()
  },

  switchFilter(e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({ activeFilter: filter })
    this.applyFilter()
  },

  applyFilter() {
    const { wrongList, activeFilter } = this.data
    let filtered = wrongList

    if (activeFilter === 'unreviewed') {
      filtered = wrongList.filter(w => !w.status || w.status === 'unreviewed')
    } else if (activeFilter === 'reviewed') {
      filtered = wrongList.filter(w => w.status === 'reviewed')
    } else if (activeFilter === 'mastered') {
      filtered = wrongList.filter(w => w.status === 'mastered')
    }

    this.setData({ filteredList: filtered })
  },

  statusText(status) {
    const map = { unreviewed: '未复习', reviewed: '已复习', mastered: '已掌握' }
    return map[status] || '未复习'
  },

  startPractice() {
    wx.showToast({ title: '巩固练习功能开发中', icon: 'none' })
  }
})
