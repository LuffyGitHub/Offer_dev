const { STORAGE_KEYS, get } = require('../../utils/storage')
const api = require('../../utils/api')
const { getOpenid } = require('../../utils/openid')
const app = getApp()

Page({
  data: { activeFilter: 'all', wrongList: [], filteredList: [] },

  onShow() { this.loadWrongQuestions() },

  async loadWrongQuestions() {
    const localData = get(STORAGE_KEYS.WRONG_QUESTIONS) || []
    let wrongList = localData.map(w => ({ ...w, status: w.status || 'unreviewed' }))
    try {
      const cloudData = await api.wrongbook.list(getOpenid())
      if (cloudData && cloudData.length > 0) {
        wrongList = cloudData.map(w => ({
          id: w.question_id || w.questionId,
          text: w.text, options: typeof w.options === 'string' ? JSON.parse(w.options) : (w.options || []),
          answer: w.answer, module: w.module, explain: w.explain_text || w.explain,
          status: w.status || 'unreviewed'
        }))
      }
    } catch (e) { console.warn('服务器错题本失败，使用本地数据', e) }
    this.setData({ wrongList })
    this.applyFilter()
  },

  switchFilter(e) {
    this.setData({ activeFilter: e.currentTarget.dataset.filter })
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

  statusText(s) { return { unreviewed: '未复习', reviewed: '已复习', mastered: '已掌握' }[s] || '未复习' },
  startPractice() { wx.showToast({ title: '巩固练习功能开发中', icon: 'none' }) }
})
