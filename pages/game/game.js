const { CONSTANTS } = require('../../data/constants')
const { STORAGE_KEYS, get, set } = require('../../utils/storage')
const app = getApp()

Page({
  data: {
    levelId: 1,
    levelName: '',
    levelSubtitle: '',
    questions: [],
    currentIndex: 0,
    currentQuestion: {},
    selectedIndex: -1,
    correctIndex: -1,
    feedbackVisible: false,
    isCorrect: false,
    isLastQuestion: false,
    progressPercent: 0,
    score: 0,
    correctCount: 0,
    combo: 0,
    maxCombo: 0,
    comboEffect: '',
    comboText: '',
    timerSeconds: CONSTANTS.TIMER_SECONDS,
    timerRunning: false,
    ticketCount: 0,
    ticketUsed: false,
    optionsDisabled: false,
    eliminatedIndexes: []
  },

  onLoad(options) {
    const levelId = parseInt(options.level) || 1
    const { levels } = require('../../data/questions')
    const levelData = Object.values(levels).find(l => l.id === levelId)

    if (!levelData) {
      wx.showToast({ title: '关卡不存在', icon: 'none' })
      return
    }

    const questions = levelData.questions
    this.levelData = levelData
    this.correctCount = 0
    this.combo = 0
    this.maxCombo = 0
    this.ticketCount = 0

    this.setData({
      levelId,
      levelName: levelData.name,
      levelSubtitle: levelData.subtitle,
      questions,
      currentQuestion: questions[0],
      ticketCount: get('ticketCount') || 3
    })
    this.updateProgress()
    this.startTimer()
  },

  onUnload() {
    this.clearTimer()
  },

  startTimer() {
    this.setData({ timerRunning: true, timerSeconds: CONSTANTS.TIMER_SECONDS })
    this.timer = setInterval(() => {
      const sec = this.data.timerSeconds - 1
      if (sec <= 0) {
        this.clearTimer()
        this.handleTimeout()
      } else {
        this.setData({ timerSeconds: sec })
      }
    }, 1000)
  },

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    this.setData({ timerRunning: false })
  },

  handleTimeout() {
    if (this.data.feedbackVisible) return
    const q = this.data.currentQuestion
    this.setData({
      selectedIndex: -1,
      correctIndex: q.answer,
      feedbackVisible: true,
      isCorrect: false,
      optionsDisabled: true,
      combo: 0
    })
  },

  selectOption(e) {
    if (this.data.feedbackVisible || this.data.optionsDisabled) return

    const index = e.currentTarget.dataset.index
    if (this.data.eliminatedIndexes.includes(index)) return

    this.clearTimer()
    const q = this.data.currentQuestion
    const correct = index === q.answer
    let combo = this.data.combo
    let maxCombo = this.data.maxCombo
    let comboText = ''
    let comboEffect = ''

    if (correct) {
      this.correctCount++
      combo++
      if (combo > maxCombo) maxCombo = combo

      if (combo >= 5) {
        comboText = `Super Combo x${combo}！额外+${CONSTANTS.SCORE_PER_COMBO_5}分`
        comboEffect = 'super'
      } else if (combo >= 3) {
        comboText = `Combo x${combo}！额外+${CONSTANTS.SCORE_PER_COMBO_3}分`
        comboEffect = 'combo'
      } else if (combo >= 2) {
        comboEffect = 'combo'
      }
    } else {
      combo = 0
      this.addWrongQuestion(q)
    }

    this.setData({
      selectedIndex: index,
      correctIndex: q.answer,
      feedbackVisible: true,
      isCorrect: correct,
      optionsDisabled: true,
      combo,
      maxCombo,
      comboText,
      comboEffect
    })
  },

  useTicket() {
    if (this.data.feedbackVisible || this.data.ticketUsed) return
    if (this.data.ticketCount <= 0) {
      wx.showToast({ title: '提示券不足，可用积分兑换', icon: 'none' })
      return
    }

    const q = this.data.currentQuestion
    const wrongIndexes = q.options.map((_, i) => i).filter(i => i !== q.answer)
    const eliminated = wrongIndexes.slice(0, 2)
    const ticketCount = this.data.ticketCount - 1

    set('ticketCount', ticketCount)
    this.setData({ eliminatedIndexes: eliminated, ticketUsed: true, ticketCount })
    wx.showToast({ title: '已排除2个错误选项', icon: 'success' })
  },

  addWrongQuestion(q) {
    const wrong = app.globalData.wrongQuestions || []
    if (!wrong.find(w => w.id === q.id)) {
      wrong.push({ id: q.id, text: q.text, options: q.options, answer: q.answer, explain: q.explain, module: q.module })
      app.globalData.wrongQuestions = wrong
      set(STORAGE_KEYS.WRONG_QUESTIONS, wrong)
    }
  },

  nextQuestion() {
    const nextIndex = this.data.currentIndex + 1
    const questions = this.data.questions

    if (nextIndex >= questions.length) {
      this.finishLevel()
      return
    }

    const comboScore = this.getComboScore()
    if (comboScore > 0) {
      app.addScore(comboScore)
    }

    this.setData({
      currentIndex: nextIndex,
      currentQuestion: questions[nextIndex],
      selectedIndex: -1,
      correctIndex: -1,
      feedbackVisible: false,
      isCorrect: false,
      isLastQuestion: false,
      optionsDisabled: false,
      ticketUsed: false,
      eliminatedIndexes: [],
      comboText: ''
    })
    this.updateProgress()
    this.startTimer()
  },

  getComboScore() {
    const combo = this.data.combo
    if (combo >= 5) return CONSTANTS.SCORE_PER_COMBO_5
    if (combo >= 3) return CONSTANTS.SCORE_PER_COMBO_3
    return 0
  },

  updateProgress() {
    const total = this.data.questions.length
    const current = this.data.currentIndex
    const percent = total > 0 ? (current / total) * 100 : 0
    this.setData({
      progressPercent: percent,
      isLastQuestion: current + 1 >= total
    })
  },

  finishLevel() {
    this.clearTimer()
    const passed = this.correctCount >= CONSTANTS.PASS_SCORE
    const baseScore = this.correctCount * CONSTANTS.SCORE_PER_CORRECT
    const bonusScore = passed ? CONSTANTS.LEVEL_COMPLETE_BONUS : 0
    const comboScore = this.getComboScore()
    const totalScore = baseScore + bonusScore + comboScore

    app.addScore(totalScore)

    const progress = app.globalData.levelProgress || {}
    progress[this.data.levelId] = {
      passed,
      score: this.correctCount,
      total: this.data.questions.length,
      stars: this.correctCount,
      combo: this.maxCombo
    }
    app.globalData.levelProgress = progress
    set(STORAGE_KEYS.LEVEL_PROGRESS, progress)

    if (this.data.levelId === 1) {
      app.unlockBadge('first_level')
    }

    wx.redirectTo({
      url: `/pages/result/result?levelId=${this.data.levelId}&levelName=${encodeURIComponent(this.data.levelName)}&score=${this.correctCount}&total=${this.data.questions.length}&passed=${passed}&totalScore=${totalScore}&combo=${this.maxCombo}`
    })
  },

  formatTime(s) {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec < 10 ? '0' + sec : sec}`
  },

  optionClass(index) {
    const { selectedIndex, correctIndex, feedbackVisible, eliminatedIndexes } = this.data
    if (eliminatedIndexes.includes(index)) return 'eliminated'
    if (!feedbackVisible) return ''
    if (index === correctIndex) return 'correct'
    if (index === selectedIndex && index !== correctIndex) return 'wrong'
    return 'faded'
  }
})
