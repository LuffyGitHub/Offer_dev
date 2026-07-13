const { CONSTANTS, getRankByScore } = require('../../data/constants')
const { game: gameApi } = require('../../utils/cloud')
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

  async loadRankData() {
    const score = app.globalData.score
    const userProfile = app.globalData.userProfile

    try {
      const cloudData = await gameApi.getRanking(this.data.activeTab, 50)
      if (cloudData && cloudData.length > 0) {
        const rankList = cloudData.map((item, i) => ({
          position: i + 1,
          name: item.name,
          avatar: item.avatar,
          grade: '',
          score: item.score,
          rankName: item.rankName,
          isMe: item.openid === 'local'
        }))

        const myScore = score
        const myPos = cloudData.findIndex(d => myScore >= d.score) + 1 || cloudData.length + 1
        const myItem = {
          position: myPos > cloudData.length ? cloudData.length + 1 : myPos,
          name: app.globalData.userInfo?.nickName || '我',
          avatar: app.globalData.userInfo?.avatarUrl || '',
          grade: userProfile?.grade || '',
          score: myScore,
          rankName: getRankByScore(myScore).name,
          isMe: true
        }

        rankList.push(myItem)
        rankList.sort((a, b) => b.score - a.score)
        rankList.forEach((item, i) => { item.position = i + 1 })

        const myRankItem = rankList.find(r => r.isMe)
        const gap = myRankItem && myRankItem.position > 1
          ? rankList[myRankItem.position - 2].score - myRankItem.score : 0

        this.setData({
          rankList,
          myRank: {
            position: myRankItem?.position || rankList.length,
            score: myScore, gap: Math.max(0, gap)
          }
        })
        return
      }
    } catch (e) { console.warn('云排行榜失败，使用模拟数据', e) }

    const mockData = [
      { position: 1, name: '求职达人', avatar: '', grade: '大四', score: 2580, rankName: '王者', isMe: false },
      { position: 2, name: '面霸', avatar: '', grade: '已毕业', score: 2100, rankName: '王者', isMe: false },
      { position: 3, name: 'Offer收割机', avatar: '', grade: '大四', score: 1850, rankName: '钻石', isMe: false },
      { position: 4, name: '实习生', avatar: '', grade: '大三', score: 1200, rankName: '钻石', isMe: false },
      { position: 5, name: '职场新人', avatar: '', grade: '大三', score: 900, rankName: '铂金', isMe: false }
    ]

    const myPos = score > 0
      ? mockData.findIndex(d => score > d.score) + 1
      : mockData.length + 1
    const gap = myPos <= mockData.length
      ? mockData[myPos - 2]?.score - score || 0 : 0

    const rankList = [...mockData]
    if (score > 0) {
      rankList.push({
        position: myPos, name: app.globalData.userInfo?.nickName || '我',
        avatar: app.globalData.userInfo?.avatarUrl || '',
        grade: userProfile?.grade || '', score, rankName: getRankByScore(score).name, isMe: true
      })
      rankList.sort((a, b) => b.score - a.score)
      rankList.forEach((item, i) => { item.position = i + 1 })
    }

    this.setData({ rankList, myRank: { position: myPos, score, gap: Math.max(0, gap) } })
  }
})
