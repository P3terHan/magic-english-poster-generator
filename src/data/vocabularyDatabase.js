// 主题词汇数据库
// 基于常见儿童学习场景预设词汇

const vocabularyDatabase = {
  // 超市主题
  supermarket: {
    coreRoles: [
      { english: 'cashier', chinese: '收银员' },
      { english: 'shopper', chinese: '购物者' },
      { english: 'manager', chinese: '经理' },
      { english: 'customer', chinese: '顾客' },
      { english: 'clerk', chinese: '店员' },
    ],
    commonItems: [
      { english: 'apple', chinese: '苹果' },
      { english: 'banana', chinese: '香蕉' },
      { english: 'milk', chinese: '牛奶' },
      { english: 'bread', chinese: '面包' },
      { english: 'vegetables', chinese: '蔬菜' },
      { english: 'meat', chinese: '肉' },
      { english: 'eggs', chinese: '鸡蛋' },
      { english: 'cheese', chinese: '奶酪' },
      { english: 'juice', chinese: '果汁' },
      { english: 'cookies', chinese: '饼干' },
    ],
    environment: [
      { english: 'shelves', chinese: '货架' },
      { english: 'checkout', chinese: '收银台' },
      { english: 'cart', chinese: '购物车' },
      { english: 'basket', chinese: '购物篮' },
      { english: 'freezer', chinese: '冷冻柜' },
      { english: 'scale', chinese: '秤' },
      { english: 'price tag', chinese: '价格标签' },
    ],
  },

  // 医院主题
  hospital: {
    coreRoles: [
      { english: 'doctor', chinese: '医生' },
      { english: 'nurse', chinese: '护士' },
      { english: 'patient', chinese: '病人' },
      { english: 'surgeon', chinese: '外科医生' },
      { english: 'dentist', chinese: '牙医' },
    ],
    commonItems: [
      { english: 'stethoscope', chinese: '听诊器' },
      { english: 'medicine', chinese: '药品' },
      { english: 'syringe', chinese: '注射器' },
      { english: 'thermometer', chinese: '体温计' },
      { english: 'bandage', chinese: '绷带' },
      { english: 'pill', chinese: '药丸' },
      { english: 'wheelchair', chinese: '轮椅' },
      { english: 'ambulance', chinese: '救护车' },
      { english: 'x-ray', chinese: 'X光片' },
      { english: 'surgery table', chinese: '手术台' },
    ],
    environment: [
      { english: 'hospital bed', chinese: '病床' },
      { english: 'ward', chinese: '病房' },
      { english: 'reception', chinese: '接待处' },
      { english: 'waiting room', chinese: '候诊室' },
      { english: 'operation room', chinese: '手术室' },
      { english: 'medical chart', chinese: '病历表' },
    ],
  },

  // 公园主题
  park: {
    coreRoles: [
      { english: 'child', chinese: '孩子' },
      { english: 'parent', chinese: '家长' },
      { english: 'gardener', chinese: '园丁' },
      { english: 'dog walker', chinese: '遛狗者' },
      { english: 'tourist', chinese: '游客' },
    ],
    commonItems: [
      { english: 'tree', chinese: '树' },
      { english: 'flower', chinese: '花' },
      { english: 'grass', chinese: '草地' },
      { english: 'bench', chinese: '长椅' },
      { english: 'swing', chinese: '秋千' },
      { english: 'slide', chinese: '滑梯' },
      { english: 'seesaw', chinese: '跷跷板' },
      { english: 'fountain', chinese: '喷泉' },
      { english: 'bird', chinese: '鸟' },
      { english: 'butterfly', chinese: '蝴蝶' },
    ],
    environment: [
      { english: 'playground', chinese: '游乐场' },
      { english: 'path', chinese: '小路' },
      { english: 'pond', chinese: '池塘' },
      { english: 'bridge', chinese: '桥' },
      { english: 'statue', chinese: '雕像' },
      { english: 'lamp post', chinese: '路灯' },
    ],
  },

  // 学校主题
  school: {
    coreRoles: [
      { english: 'teacher', chinese: '老师' },
      { english: 'student', chinese: '学生' },
      { english: 'principal', chinese: '校长' },
      { english: 'librarian', chinese: '图书管理员' },
      { english: 'janitor', chinese: '清洁工' },
    ],
    commonItems: [
      { english: 'book', chinese: '书' },
      { english: 'pencil', chinese: '铅笔' },
      { english: 'eraser', chinese: '橡皮' },
      { english: 'notebook', chinese: '笔记本' },
      { english: 'backpack', chinese: '书包' },
      { english: 'desk', chinese: '书桌' },
      { english: 'chair', chinese: '椅子' },
      { english: 'blackboard', chinese: '黑板' },
      { english: 'chalk', chinese: '粉笔' },
      { english: 'globe', chinese: '地球仪' },
    ],
    environment: [
      { english: 'classroom', chinese: '教室' },
      { english: 'library', chinese: '图书馆' },
      { english: 'playground', chinese: '操场' },
      { english: 'cafeteria', chinese: '食堂' },
      { english: 'gym', chinese: '体育馆' },
      { english: 'office', chinese: '办公室' },
    ],
  },

  // 动物园主题
  zoo: {
    coreRoles: [
      { english: 'zookeeper', chinese: '动物园管理员' },
      { english: 'visitor', chinese: '游客' },
      { english: 'guide', chinese: '导游' },
      { english: 'child', chinese: '孩子' },
    ],
    commonItems: [
      { english: 'lion', chinese: '狮子' },
      { english: 'elephant', chinese: '大象' },
      { english: 'giraffe', chinese: '长颈鹿' },
      { english: 'monkey', chinese: '猴子' },
      { english: 'panda', chinese: '熊猫' },
      { english: 'tiger', chinese: '老虎' },
      { english: 'zebra', chinese: '斑马' },
      { english: 'bird', chinese: '鸟' },
      { english: 'snake', chinese: '蛇' },
      { english: 'penguin', chinese: '企鹅' },
    ],
    environment: [
      { english: 'cage', chinese: '笼子' },
      { english: 'enclosure', chinese: '围栏' },
      { english: 'habitat', chinese: '栖息地' },
      { english: 'sign', chinese: '指示牌' },
      { english: 'map', chinese: '地图' },
      { english: 'ticket booth', chinese: '售票亭' },
    ],
  },

  // 海滩主题
  beach: {
    coreRoles: [
      { english: 'swimmer', chinese: '游泳者' },
      { english: 'surfer', chinese: '冲浪者' },
      { english: 'lifeguard', chinese: '救生员' },
      { english: 'child', chinese: '孩子' },
      { english: 'tourist', chinese: '游客' },
    ],
    commonItems: [
      { english: 'sand', chinese: '沙子' },
      { english: 'sea', chinese: '大海' },
      { english: 'shell', chinese: '贝壳' },
      { english: 'starfish', chinese: '海星' },
      { english: 'wave', chinese: '海浪' },
      { english: 'umbrella', chinese: '太阳伞' },
      { english: 'towel', chinese: '毛巾' },
      { english: 'sunglasses', chinese: '太阳镜' },
      { english: 'sunscreen', chinese: '防晒霜' },
      { english: 'bucket', chinese: '水桶' },
    ],
    environment: [
      { english: 'shore', chinese: '海岸' },
      { english: 'pier', chinese: '码头' },
      { english: 'lifeguard tower', chinese: '救生员塔' },
      { english: 'palm tree', chinese: '棕榈树' },
      { english: 'horizon', chinese: '地平线' },
      { english: 'sun', chinese: '太阳' },
    ],
  },

  // 农场主题
  farm: {
    coreRoles: [
      { english: 'farmer', chinese: '农民' },
      { english: 'worker', chinese: '工人' },
      { english: 'child', chinese: '孩子' },
    ],
    commonItems: [
      { english: 'cow', chinese: '牛' },
      { english: 'pig', chinese: '猪' },
      { english: 'chicken', chinese: '鸡' },
      { english: 'duck', chinese: '鸭' },
      { english: 'horse', chinese: '马' },
      { english: 'sheep', chinese: '羊' },
      { english: 'goat', chinese: '山羊' },
      { english: 'tractor', chinese: '拖拉机' },
      { english: 'barn', chinese: '谷仓' },
      { english: 'hay', chinese: '干草' },
    ],
    environment: [
      { english: 'field', chinese: '田野' },
      { english: 'fence', chinese: '栅栏' },
      { english: 'farmhouse', chinese: '农舍' },
      { english: 'pond', chinese: '池塘' },
      { english: 'tree', chinese: '树' },
      { english: 'gate', chinese: '大门' },
    ],
  },

  // 餐厅主题
  restaurant: {
    coreRoles: [
      { english: 'waiter', chinese: '服务员' },
      { english: 'chef', chinese: '厨师' },
      { english: 'customer', chinese: '顾客' },
      { english: 'cashier', chinese: '收银员' },
      { english: 'manager', chinese: '经理' },
    ],
    commonItems: [
      { english: 'menu', chinese: '菜单' },
      { english: 'plate', chinese: '盘子' },
      { english: 'fork', chinese: '叉子' },
      { english: 'knife', chinese: '刀' },
      { english: 'spoon', chinese: '勺子' },
      { english: 'glass', chinese: '玻璃杯' },
      { english: 'napkin', chinese: '餐巾纸' },
      { english: 'food', chinese: '食物' },
      { english: 'drink', chinese: '饮料' },
      { english: 'bill', chinese: '账单' },
    ],
    environment: [
      { english: 'table', chinese: '桌子' },
      { english: 'chair', chinese: '椅子' },
      { english: 'kitchen', chinese: '厨房' },
      { english: 'counter', chinese: '柜台' },
      { english: 'sign', chinese: '招牌' },
      { english: 'window', chinese: '窗户' },
    ],
  },

  // 图书馆主题
  library: {
    coreRoles: [
      { english: 'librarian', chinese: '图书管理员' },
      { english: 'reader', chinese: '读者' },
      { english: 'student', chinese: '学生' },
      { english: 'researcher', chinese: '研究者' },
    ],
    commonItems: [
      { english: 'book', chinese: '书' },
      { english: 'shelf', chinese: '书架' },
      { english: 'magazine', chinese: '杂志' },
      { english: 'newspaper', chinese: '报纸' },
      { english: 'computer', chinese: '电脑' },
      { english: 'desk', chinese: '书桌' },
      { english: 'chair', chinese: '椅子' },
      { english: 'catalog', chinese: '目录' },
      { english: 'bookmark', chinese: '书签' },
      { english: 'reading lamp', chinese: '阅读灯' },
    ],
    environment: [
      { english: 'reading room', chinese: '阅览室' },
      { english: 'study area', chinese: '学习区' },
      { english: 'information desk', chinese: '咨询台' },
      { english: 'quiet zone', chinese: '安静区' },
      { english: 'entrance', chinese: '入口' },
      { english: 'exit', chinese: '出口' },
    ],
  },

  // 游乐园主题
  amusementpark: {
    coreRoles: [
      { english: 'child', chinese: '孩子' },
      { english: 'parent', chinese: '家长' },
      { english: 'clown', chinese: '小丑' },
      { english: 'operator', chinese: '操作员' },
      { english: 'visitor', chinese: '游客' },
    ],
    commonItems: [
      { english: 'roller coaster', chinese: '过山车' },
      { english: 'ferris wheel', chinese: '摩天轮' },
      { english: 'carousel', chinese: '旋转木马' },
      { english: 'swing ride', chinese: '摇摆 ride' },
      { english: 'bumper cars', chinese: '碰碰车' },
      { english: 'ticket', chinese: '门票' },
      { english: 'cotton candy', chinese: '棉花糖' },
      { english: 'popcorn', chinese: '爆米花' },
      { english: 'balloon', chinese: '气球' },
      { english: 'prize', chinese: '奖品' },
    ],
    environment: [
      { english: 'entrance gate', chinese: '入口大门' },
      { english: 'path', chinese: '小路' },
      { english: 'ride', chinese: '游乐设施' },
      { english: 'food stall', chinese: '食品摊' },
      { english: 'rest area', chinese: '休息区' },
      { english: 'map board', chinese: '地图板' },
    ],
  },
}

// 主题关键词映射（用于模糊匹配）
const themeKeywordMapping = {
  // 中文关键词映射
  '超市': 'supermarket',
  '市场': 'supermarket',
  '商店': 'supermarket',
  '医院': 'hospital',
  '诊所': 'hospital',
  '医疗': 'hospital',
  '公园': 'park',
  '花园': 'park',
  '绿地': 'park',
  '学校': 'school',
  '教室': 'school',
  '校园': 'school',
  '动物园': 'zoo',
  '动物': 'zoo',
  '海滩': 'beach',
  '海边': 'beach',
  '沙滩': 'beach',
  '农场': 'farm',
  '农田': 'farm',
  '养殖': 'farm',
  '餐厅': 'restaurant',
  '饭店': 'restaurant',
  '餐馆': 'restaurant',
  '图书馆': 'library',
  '书馆': 'library',
  '图书': 'library',
  '游乐园': 'amusementpark',
  '游乐场': 'amusementpark',
  '乐园': 'amusementpark',

  // 英文关键词映射
  'supermarket': 'supermarket',
  'market': 'supermarket',
  'shop': 'supermarket',
  'store': 'supermarket',
  'hospital': 'hospital',
  'clinic': 'hospital',
  'medical': 'hospital',
  'park': 'park',
  'garden': 'park',
  'school': 'school',
  'classroom': 'school',
  'zoo': 'zoo',
  'animal': 'zoo',
  'beach': 'beach',
  'seaside': 'beach',
  'farm': 'farm',
  'restaurant': 'restaurant',
  'cafe': 'restaurant',
  'library': 'library',
  'amusement park': 'amusementpark',
  'amusementpark': 'amusementpark',
  'playground': 'amusementpark',
}

// 默认词汇（当主题不匹配时使用）
const defaultVocabulary = {
  coreRoles: [
    { english: 'person', chinese: '人物' },
    { english: 'child', chinese: '孩子' },
    { english: 'adult', chinese: '成人' },
  ],
  commonItems: [
    { english: 'object', chinese: '物体' },
    { english: 'item', chinese: '物品' },
    { english: 'thing', chinese: '东西' },
  ],
  environment: [
    { english: 'background', chinese: '背景' },
    { english: 'environment', chinese: '环境' },
    { english: 'scene', chinese: '场景' },
  ],
}

export { vocabularyDatabase, themeKeywordMapping, defaultVocabulary }