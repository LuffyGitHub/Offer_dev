const { STORAGE_KEYS, get } = require('../../utils/storage')
const { wrongbook } = require('../../utils/cloud')
const app = getApp()

Page({
  data: {
    activeFilter: 'all',
    wrongList: [],
    filteredList: []
  },

  onShow() {
    this.loadWrongQuestions()
  },

  async loadWrongQuestions() {
    const localData = get(STORAGE_KEYS.WRONG_QUESTIONS) || []
    let wrongList = localData.map(w => ({ ...w, status: w.status || 'unreviewed' }))

    try {
      const cloudData = await wrongbook.list()
      if (cloudData && cloudData.length > 0) {
        wrongList = cloudData.map(w => ({
          id: w.questionId, text: w.text, options: w.options,
          answer: w.answer, module: w.module, explain: w.explain,
          status: w.status || 'unreviewed',
          selectedAnswer: w.selectedAnswer
        }))
      }
    } catch (e) { console.warn('云错题本失败，使用本地数据', e) }

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
    if (activeFilter === 'unreviewed') filtered = wrongList.filter(w => !w.status || w.status === 'unreviewed')
    else if (activeFilter === 'reviewed') filtered = wrongList.filter(w => w.status === 'reviewed')
    else if (activeFilter === 'mastered') filtered = wrongList.filter(w => w.status === 'mastered')
    this.setData({ filteredList: filtered })
  },

  statusText(status) {
    return { unreviewed: '未复习', reviewed: '已复习', mastered: '已掌握' }[status] || '未复习'
  },

  startPractice() {
    wx.showToast({ title: '巩固练习功能开发中', icon: 'none' })
  }
})
