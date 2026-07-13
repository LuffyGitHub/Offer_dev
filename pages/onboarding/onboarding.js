const { STORAGE_KEYS, set } = require('../../utils/storage')
const { pickRandom } = require('../../utils/util')
const { questions } = require('../../data/questions')
const api = require('../../utils/api')
const { getOpenid } = require('../../utils/openid')
const app = getApp()

Page({
  data: {
    step: 1,
    stepTitles: ['填写基本信息', '初始能力测评', '玩法说明'],
    grades: ['大一', '大二', '大三', '大四', '已毕业'],
    majors: ['理工', '文史', '艺术', '经管', '医学', '其他'],
    targets: ['技术', '产品', '运营', '销售', '人力资源', '其他'],
    gradeIndex: -1, majorIndex: -1, targetIndex: -1,
    quizQuestions: [], quizIndex: 0, currentQuiz: {},
    quizSelected: -1, quizAnswers: []
  },

  onLoad() {
    const quizQuestions = pickRandom(questions, 5)
    this.setData({ quizQuestions, currentQuiz: quizQuestions[0] || {}, quizIndex: 0 })
  },

  onGradeChange(e) { this.setData({ gradeIndex: parseInt(e.detail.value) }) },
  onMajorChange(e) { this.setData({ majorIndex: parseInt(e.detail.value) }) },
  onTargetChange(e) { this.setData({ targetIndex: parseInt(e.detail.value) }) },

  selectQuiz(e) {
    this.setData({ quizSelected: parseInt(e.currentTarget.dataset.idx) })
  },

  async nextStep() {
    if (this.data.step === 1) {
      if (this.data.gradeIndex < 0 || this.data.majorIndex < 0 || this.data.targetIndex < 0) {
        wx.showToast({ title: '请完善所有信息', icon: 'none' }); return
      }
      this.setData({ step: 2 })
    } else if (this.data.step === 2) {
      if (this.data.quizSelected < 0) {
        wx.showToast({ title: '请选择答案', icon: 'none' }); return
      }
      const answers = [...this.data.quizAnswers, this.data.quizSelected]
      const nextIndex = this.data.quizIndex + 1

      if (nextIndex >= this.data.quizQuestions.length) {
        const correctCount = answers.filter((a, i) => a === this.data.quizQuestions[i].answer).length
        const suggestedLevel = correctCount <= 2 ? 1 : correctCount <= 4 ? 2 : 3

        const profile = {
          grade: this.data.grades[this.data.gradeIndex],
          major: this.data.majors[this.data.majorIndex],
          target: this.data.targets[this.data.targetIndex],
          initialLevel: suggestedLevel, quizScore: correctCount
        }
        app.globalData.userProfile = { ...profile, onboarded: true }
        set(STORAGE_KEYS.USER_PROFILE, app.globalData.userProfile)

        try {
          await api.user.saveProfile(getOpenid(), profile)
        } catch (e) { console.warn('服务器保存失败', e) }

        this.setData({ step: 3 })
      } else {
        this.setData({
          quizIndex: nextIndex, currentQuiz: this.data.quizQuestions[nextIndex],
          quizSelected: -1, quizAnswers: answers
        })
      }
    } else {
      wx.reLaunch({ url: '/pages/index/index' })
    }
  }
})
