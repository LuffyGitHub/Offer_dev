const { levels } = require('../../data/questions')
const app = getApp()

Page({
  data: {
    levelId: 1,
    levelName: '',
    levelSubtitle: '',
    currentIndex: 0,
    totalQuestions: 0,
    currentQuestion: {},
    selectedIndex: -1,
    correctIndex: -1,
    feedbackVisible: false,
    isCorrect: false,
    isLastQuestion: false,
    progressPercent: 0,
    score: 0
  },

  onLoad(options) {
    const levelId = parseInt(options.level) || 1
    const levelData = levels.find(l => l.id === levelId)
    if (!levelData) {
      wx.showToast({ title: '关卡不存在', icon: 'none' })
      return
    }

    this.levelData = levelData
    this.passScore = app.globalData.passScore
    this.correctCount = 0

    this.setData({
      levelId: levelId,
      levelName: levelData.name,
      levelSubtitle: levelData.subtitle,
      totalQuestions: levelData.questions.length,
      currentQuestion: levelData.questions[0]
    })
    this.updateProgress()
  },

  selectOption(e) {
    if (this.data.feedbackVisible) return

    const index = e.currentTarget.dataset.index
    const question = this.data.currentQuestion
    const correctIndex = question.answer

    this.setData({
      selectedIndex: index,
      correctIndex: correctIndex,
      feedbackVisible: true,
      isCorrect: index === correctIndex
    })

    if (index === correctIndex) {
      this.correctCount++
    }
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1
    const questions = this.levelData.questions

    if (nextIndex >= questions.length) {
      this.finishLevel()
      return
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: questions[nextIndex],
      selectedIndex: -1,
      correctIndex: -1,
      feedbackVisible: false,
      isCorrect: false,
      isLastQuestion: false
    })
    this.updateProgress()
  },

  updateProgress() {
    const total = this.data.totalQuestions
    const current = this.data.currentIndex
    const percent = total > 0 ? ((current) / total) * 100 : 0
    const isLast = current + 1 >= total

    this.setData({
      progressPercent: percent,
      isLastQuestion: isLast
    })
  },

  finishLevel() {
    const score = this.correctCount
    const passed = score >= this.passScore

    wx.redirectTo({
      url: `/pages/result/result?levelId=${this.data.levelId}&score=${score}&total=${this.data.totalQuestions}&passed=${passed}`
    })
  },

  optionClass(index) {
    const { selectedIndex, correctIndex, feedbackVisible } = this.data
    if (!feedbackVisible) return ''
    if (index === correctIndex) return 'correct'
    if (index === selectedIndex && index !== correctIndex) return 'wrong'
    return 'disabled'
  }
})
