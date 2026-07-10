const { CONSTANTS, getRankByScore } = require('../../data/constants')
const { STORAGE_KEYS, get } = require('../../utils/storage')
const app = getApp()

Page({
  data: {
    activeTab: 'total',
    userInfo: null,
    myRank: { position: 1, score: 0, gap: 0 },
    rankList: []
  },

  onShow() {
    this.setData({ userInfo: app.globalData.userInfo })
    this.loadRankData()
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
    this.loadRankData()
  },

  loadRankData() {
    const score = app.globalData.score
    const userProfile = app.globalData.userProfile

    const mockData = [
      { position: 1, name: '求职达人', avatar: '', grade: '大四', score: 2580, rankName: '王者' },
      { position: 2, name: '面霸', avatar: '', grade: '已毕业', score: 2100, rankName: '王者' },
      { position: 3, name: 'Offer收割机', avatar: '', grade: '大四', score: 1850, rankName: '钻石' },
      { position: 4, name: '实习生', avatar: '', grade: '大三', score: 1200, rankName: '钻石' },
      { position: 5, name: '职场新人', avatar: '', grade: '大三', score: 900, rankName: '铂金' }
    ]

    const myPosition = score > 0
      ? mockData.findIndex(d => score > d.score)
      : mockData.length
    const pos = myPosition >= 0 ? myPosition + 1 : mockData.length + 1
    const rank = getRankByScore(score)
    const gap = pos <= mockData.length ? mockData[pos - 2]?.score - score || 0 : 0

    const rankList = mockData.map((item, i) => ({
      ...item,
      isMe: false,
      rankName: getRankByScore(item.score).name
    }))

    if (score > 0) {
      rankList.push({
        position: pos,
        name: app.globalData.userInfo?.nickName || '我',
        avatar: app.globalData.userInfo?.avatarUrl || '',
        grade: userProfile?.grade || '',
        score,
        rankName: rank.name,
        isMe: true
      })
      rankList.sort((a, b) => b.score - a.score)
      rankList.forEach((item, i) => { item.position = i + 1 })
    }

    const myItem = rankList.find(item => item.isMe)
    const myRank = myItem
      ? { position: myItem.position, score: myItem.score, gap: myItem.position > 1 ? rankList[myItem.position - 2].score - myItem.score : 0 }
      : { position: rankList.length + 1, score, gap: rankList[rankList.length - 1]?.score - score || 0 }

    this.setData({ rankList, myRank })
  }
})
