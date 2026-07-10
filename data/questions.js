const questions = [
  {
    id: 1, levelId: 1, text: '在面试中做自我介绍时，以下哪种方式最合适？',
    options: ['背诵长篇个人简历', '结合岗位需求突出自身优势', '只介绍姓名和毕业院校', '详细讲述个人成长经历'],
    answer: 1, difficulty: '★', module: '面试', type: '单选', grade: '通用', explain: '自我介绍应紧扣岗位要求，突出与职位匹配的优势和经历。'
  },
  {
    id: 2, levelId: 1, text: '"SWOT分析"中的"T"代表什么？',
    options: ['趋势 (Trend)', '团队 (Team)', '威胁 (Threat)', '测试 (Test)'],
    answer: 2, difficulty: '★', module: '职场常识', type: '单选', grade: '通用', explain: 'SWOT 分别代表优势(S)、劣势(W)、机会(O)、威胁(T)。'
  },
  {
    id: 3, levelId: 1, text: '编写简历时应遵守的原则是？',
    options: ['越长越好展示所有经历', '针对目标岗位定制化内容', '使用统一模板不做修改', '使用夸张词汇吸引注意'],
    answer: 1, difficulty: '★', module: '简历', type: '单选', grade: '通用', explain: '优秀简历需针对不同岗位定制，突出相关经历和技能。'
  },
  {
    id: 4, levelId: 1, text: '第一次实习面试，穿着打扮应该？',
    options: ['穿自己最时尚的衣服', '穿正装或商务休闲装', '穿运动服显得有活力', '无所谓随便穿'],
    answer: 1, difficulty: '★', module: '面试', type: '单选', grade: '大一', explain: '面试着装应整洁得体，正装或商务休闲装是最安全的选择。'
  },
  {
    id: 5, levelId: 1, text: '以下哪个不是常见的行业分类？',
    options: ['互联网/科技', '金融/保险', '娱乐/自媒体', '幻想/魔法'],
    answer: 3, difficulty: '★', module: '行业认知', type: '单选', grade: '大一', explain: '幻想/魔法不属于真实存在的行业分类。'
  },
  {
    id: 6, levelId: 1, text: '霍兰德职业兴趣理论将人分为几种类型？',
    options: ['4种', '5种', '6种', '7种'],
    answer: 2, difficulty: '★', module: '行业认知', type: '单选', grade: '大一', explain: '霍兰德六种类型：现实型、研究型、艺术型、社会型、企业型、常规型。'
  },
  {
    id: 7, levelId: 1, text: '产品经理的核心职责是？',
    options: ['写代码', '设计产品方案并推动落地', '负责招聘', '管理财务'],
    answer: 1, difficulty: '★', module: '行业认知', type: '单选', grade: '通用', explain: '产品经理负责需求分析、产品规划、跨部门协作推动产品落地。'
  },
  {
    id: 8, levelId: 1, text: '运营岗位的核心指标不包括？',
    options: ['用户增长', '留存率', '代码质量', '转化率'],
    answer: 2, difficulty: '★', module: '行业认知', type: '单选', grade: '通用', explain: '代码质量是技术岗位关注指标，运营关注用户增长、留存和转化。'
  },
  {
    id: 9, levelId: 1, text: '以下哪些属于有效的工作内容描述？',
    options: ['参与了一些项目', '负责公众号运营，3个月涨粉5000+', '做各种各样的工作', '帮助同事完成任务'],
    answer: 1, difficulty: '★', module: '简历', type: '单选', grade: '通用', explain: '简历应使用量化的成果描述，如"涨粉5000+"比模糊描述更有说服力。'
  },
  {
    id: 10, levelId: 1, text: '接到面试通知后，第一步应该做什么？',
    options: ['直接去面试', '了解公司背景和岗位要求', '问朋友该不该去', '先买新衣服'],
    answer: 1, difficulty: '★', module: '面试', type: '单选', grade: '通用', explain: '充分了解公司和岗位信息是面试准备的关键第一步。'
  },
  {
    id: 11, levelId: 2, text: '面试官问"你最大的缺点是什么？"较好的回答是？',
    options: ['说自己没有缺点', '说一个无关紧要的缺点', '承认真实缺点并说明改进措施', '反问面试官觉得你有什么缺点'],
    answer: 2, difficulty: '★★', module: '面试', type: '单选', grade: '通用', explain: '诚实地承认缺点并展示改进措施，体现自我认知和成长心态。'
  },
  {
    id: 12, levelId: 2, text: 'STAR法则中的"A"代表什么？',
    options: ['态度 (Attitude)', '行动 (Action)', '能力 (Ability)', '评估 (Assessment)'],
    answer: 1, difficulty: '★★', module: '简历', type: '单选', grade: '通用', explain: 'STAR：情境(S)、任务(T)、行动(A)、结果(R)，行动是核心部分。'
  },
  {
    id: 13, levelId: 2, text: '群面中哪种做法最容易脱颖而出？',
    options: ['一直沉默倾听', '强行主导讨论进程', '适时总结观点推动讨论', '与组员争论不休'],
    answer: 2, difficulty: '★★', module: '面试', type: '单选', grade: '大二', explain: '群面看重团队协作，适时总结观点、推动讨论进程最能体现领导力。'
  },
  {
    id: 14, levelId: 2, text: '写邮件给上级时，以下做法错误的是？',
    options: ['标题简明扼要', '正文分段清晰', '使用表情符号增加亲切感', '附件提前检查'],
    answer: 2, difficulty: '★★', module: '职场常识', type: '单选', grade: '大三', explain: '正式工作邮件应避免使用表情符号，保持专业和规范。'
  },
  {
    id: 15, levelId: 2, text: '会议中如果有不同意见，最恰当的做法是？',
    options: ['当场大声反驳', '会后私下沟通', '保持沉默不表达', '在群里公开讨论'],
    answer: 1, difficulty: '★★', module: '职场常识', type: '单选', grade: '通用', explain: '有不同意见时，选择合适的场合和方式表达，体现职业素养。'
  },
  {
    id: 16, levelId: 2, text: '以下哪项不属于有效简历关键词？',
    options: ['项目管理', '数据分析', '打篮球', '用户增长'],
    answer: 2, difficulty: '★★', module: '简历', type: '单选', grade: '通用', explain: '简历关键词应与岗位技能相关，"打篮球"与求职无直接关联。'
  },
  {
    id: 17, levelId: 2, text: '接到offer后，以下哪项需要确认？',
    options: ['薪资福利', '工作内容和考核标准', '试用期条款', '以上都需要'],
    answer: 3, difficulty: '★★', module: '职场常识', type: '单选', grade: '大三', explain: '接受offer前应全面确认薪资、工作内容、试用期等关键条款。'
  },
  {
    id: 18, levelId: 2, text: '与同事协作时遇到分歧，最优解是？',
    options: ['坚持己见到底', '以目标为导向寻求共识', '找领导评理', '放弃合作'],
    answer: 1, difficulty: '★★', module: '职场常识', type: '单选', grade: '通用', explain: '职场协作应聚焦共同目标，求同存异推进工作。'
  },
  {
    id: 19, levelId: 2, text: '商务场合交换名片时，正确的是？',
    options: ['单手接名片', '双手接并认真看一眼后收好', '直接放进口袋', '在名片上写字'],
    answer: 1, difficulty: '★★', module: '职场常识', type: '单选', grade: '通用', explain: '双手接名片体现尊重，认真阅读后妥善收纳展示专业素养。'
  },
  {
    id: 20, levelId: 2, text: '以下哪个是OKR中"O"的含义？',
    options: ['目标 (Objective)', '产出 (Output)', '结果 (Outcome)', '机会 (Opportunity)'],
    answer: 0, difficulty: '★★', module: '职场常识', type: '单选', grade: '大三', explain: 'OKR = Objectives and Key Results，即目标与关键结果。'
  },
  {
    id: 21, levelId: 3, text: '薪资谈判时，以下哪种策略最合理？',
    options: ['直接报期望薪资不松口', '先了解市场行情再给出合理范围', '说"薪资无所谓"', '要求远高于市场价'],
    answer: 1, difficulty: '★★★', module: '面试', type: '单选', grade: '大四', explain: '了解市场行情后给出合理的薪资范围，展现专业和诚意。'
  },
  {
    id: 22, levelId: 3, text: '收到多个offer后的最佳决策方式是？',
    options: ['选薪资最高的', '选公司名气最大的', '综合考量发展空间文化匹配薪酬', '选离家最近的'],
    answer: 2, difficulty: '★★★', module: '职场常识', type: '单选', grade: '大四', explain: '选offer应多维度考量，包括发展空间、文化匹配和薪酬福利。'
  },
  {
    id: 23, levelId: 3, text: '五险一金中的"一金"是指？',
    options: ['奖金', '住房公积金', '公益金', '保障金'],
    answer: 1, difficulty: '★★★', module: '劳动法', type: '单选', grade: '大四', explain: '五险一金：养老、医疗、失业、工伤、生育保险 + 住房公积金。'
  },
  {
    id: 24, levelId: 3, text: '试用期最长不得超过多久？',
    options: ['3个月', '6个月', '12个月', '1个月'],
    answer: 1, difficulty: '★★★', module: '劳动法', type: '单选', grade: '大四', explain: '劳动合同法规定，试用期最长不得超过6个月，且与合同期限挂钩。'
  },
  {
    id: 25, levelId: 3, text: '面试官问"你期望薪资是多少？"以下回答最好的是？',
    options: ['你们能给多少', '结合市场行情我期望在X-Y之间', '越多越好', '随便'],
    answer: 1, difficulty: '★★★', module: '面试', type: '单选', grade: '大四', explain: '给出基于市场调研的薪资范围，展现准备充分和理性态度。'
  },
  {
    id: 26, levelId: 3, text: '劳动合同中必须包含的条款是？',
    options: ['公司食堂菜谱', '工作地点和内容', '同事名单', '团建计划'],
    answer: 1, difficulty: '★★★', module: '劳动法', type: '单选', grade: '大四', explain: '劳动合同必备条款包括工作内容、工作地点、劳动报酬、工作时间等。'
  },
  {
    id: 27, levelId: 3, text: '以下哪种情形公司可以合法解除劳动合同？',
    options: ['员工怀孕', '员工严重违反规章制度', '员工生病', '员工拒绝加班'],
    answer: 1, difficulty: '★★★', module: '劳动法', type: '单选', grade: '大四', explain: '严重违反规章制度属于法定解除情形，其他选项受法律保护。'
  },
  {
    id: 28, levelId: 3, text: '年终奖属于法定福利吗？',
    options: ['是，必须发放', '不是，视公司规定', '必须按最低标准发', '入职满一年才有'],
    answer: 1, difficulty: '★★★', module: '劳动法', type: '单选', grade: '大四', explain: '年终奖不属于法定福利，取决于公司薪酬制度和劳动合同约定。'
  },
  {
    id: 29, levelId: 3, text: '压力面试中，面试官质疑你的能力，正确的应对是？',
    options: ['情绪激动反驳', '冷静倾听并举例证明能力', '承认自己不行', '反问面试官'],
    answer: 1, difficulty: '★★★', module: '面试', type: '单选', grade: '大四', explain: '压力面考察抗压能力，保持冷静、用事实和实例回应质疑。'
  },
  {
    id: 30, levelId: 3, text: '入职新公司后快速融入的最好方式是？',
    options: ['默默做事不与同事交流', '主动了解团队文化积极请教', '立即提出改进意见', '只和自己部门的人交流'],
    answer: 1, difficulty: '★★★', module: '职场常识', type: '单选', grade: '大四', explain: '主动融入团队文化，积极请教和沟通，是新人快速适应的关键。'
  }
]

const levels = {
  1: { id: 1, name: '职业探索期', subtitle: '自我认知与行业入门', questions: questions.filter(q => q.levelId === 1) },
  2: { id: 2, name: '实习准备期', subtitle: '简历面试与职场沟通', questions: questions.filter(q => q.levelId === 2) },
  3: { id: 3, name: '冲刺求职期', subtitle: '大厂真题与权益保护', questions: questions.filter(q => q.levelId === 3) }
}

module.exports = { questions, levels }
