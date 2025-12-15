# 魔法英文小报提示词生成器

基于React的Web应用，用于生成儿童识字小报的AI绘图提示词，并集成Nano Banana Pro API进行图像生成。

## 功能特点

1. **完整工作流**：主题输入 → 词汇联想 → 提示词生成 → API调用 → 结果展示
2. **智能词汇联想**：基于主题自动联想15-20个相关英文词汇（含中文翻译）
3. **专业提示词生成**：基于`prompt.md`模板生成优化的AI绘图提示词
4. **API集成**：集成Nano Banana Pro API进行图像生成
5. **响应式设计**：适配桌面、平板和移动设备

## 项目结构

```
magic-english-poster-generator/
├── public/                 # 静态资源
├── src/
│   ├── components/         # React组件
│   │   ├── ThemeInput.jsx  # 主题输入
│   │   ├── TitleInput.jsx  # 标题输入
│   │   ├── VocabularyAssociation.jsx  # 词汇联想
│   │   ├── PromptPreview.jsx          # 提示词预览
│   │   ├── GenerationStatus.jsx       # 生成状态
│   │   └── WorkflowStepper.jsx        # 工作流导航
│   ├── services/          # 业务逻辑
│   │   ├── api.js         # Nano Banana Pro API集成
│   │   ├── vocabularyService.js  # 词汇联想服务
│   │   └── promptGenerator.js    # 提示词生成器
│   ├── data/              # 静态数据
│   │   └── vocabularyDatabase.js # 主题词汇库
│   ├── store/             # 状态管理
│   │   ├── index.js       # Context提供者
│   │   ├── actions.js     # Action定义
│   │   └── reducers.js    # Reducer逻辑
│   ├── hooks/             # 自定义Hook
│   │   ├── useVocabulary.js
│   │   ├── usePrompt.js
│   │   └── useApi.js
│   ├── App.jsx           # 主应用组件
│   ├── App.css           # 全局样式
│   └── index.js          # 应用入口
├── PROJECT-PLAN.md       # 项目计划文档
├── package.json          # 依赖配置
└── README.md            # 本文件
```

## 快速开始

### 前提条件

- Node.js 18+ 和 npm/yarn/pnpm
- Nano Banana Pro API密钥（可选，用于实际图像生成）

### 安装依赖

```bash
cd magic-english-poster-generator
npm install
```

### 开发模式运行

```bash
npm run dev
```

应用将在 http://localhost:3000 启动。

### 生产构建

```bash
npm run build
```

构建产物位于 `dist/` 目录。

## 使用指南

### 1. 选择主题
输入或选择场景主题（如：超市、医院、公园）。系统支持以下主题：
- 超市、医院、公园、学校、动物园、海滩、农场、餐厅、图书馆、游乐园

### 2. 输入标题
输入小报标题，或使用系统基于主题生成的建议标题。

### 3. 词汇联想
系统基于主题自动联想相关英文词汇，分为三类：
- **核心角色与设施**（3-5个）：如 cashier 收银员
- **常见物品/工具**（5-8个）：如 apple 苹果
- **环境与装饰**（3-5个）：如 shelves 货架

### 4. 提示词生成
生成完整的AI绘图提示词，包含：
- 小报标题区设置
- 主体画面描述
- 必画物体清单
- 识字标注规则
- 画风参数（Mary GrandPré style）

### 5. 图像生成
使用Nano Banana Pro API生成图像（需要API密钥）：
1. 输入API密钥
2. 配置参数（宽高比、分辨率、输出格式）
3. 开始生成
4. 查看结果并下载

## API集成

### Nano Banana Pro API
应用集成了Nano Banana Pro图像生成API：
- **API端点**: https://api.kie.ai/api/v1/jobs
- **认证方式**: Bearer Token
- **获取API密钥**: https://kie.ai/api-key

### 配置API密钥
1. 在生成步骤的API设置中输入您的API密钥
2. 点击"验证API密钥"确认有效性
3. 配置生成参数后开始生成

## 自定义和扩展

### 添加新主题
编辑 `src/data/vocabularyDatabase.js`，按照现有格式添加新主题：
```javascript
const vocabularyDatabase = {
  // 现有主题...
  yourNewTheme: {
    coreRoles: [ /* 词汇 */ ],
    commonItems: [ /* 词汇 */ ],
    environment: [ /* 词汇 */ ],
  },
}
```

### 修改提示词模板
编辑 `src/services/promptGenerator.js` 中的 `generatePrompt` 方法。

### 集成其他AI API
修改 `src/services/api.js` 或创建新的API服务类。

## 技术栈

- **前端框架**: React 18 + Vite
- **样式**: TailwindCSS
- **状态管理**: React Context + useReducer
- **HTTP客户端**: Fetch API
- **UI组件**: 原生实现
- **图标**: React Icons
- **通知**: React Hot Toast

## 开发说明

### 代码规范
- 使用ESLint进行代码检查
- 使用Prettier进行代码格式化
- 组件使用JSX语法
- 函数使用箭头函数

### 运行检查
```bash
# 代码检查
npm run lint

# 代码格式化
npm run format
```

## 故障排除

### 依赖安装失败
确保使用正确的Node.js版本（18+）并清理npm缓存：
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

### API调用失败
1. 检查API密钥是否正确
2. 确认账户余额充足
3. 检查网络连接
4. 查看浏览器控制台错误信息

### 应用无法启动
1. 检查端口3000是否被占用
2. 确认所有依赖已安装
3. 检查Node.js和npm版本

## 部署

### 静态托管
构建后可将 `dist/` 目录部署到：
- Vercel
- Netlify
- GitHub Pages
- 任何静态文件服务器

### 环境变量
创建 `.env.local` 文件（可选）：
```env
VITE_API_BASE_URL=https://api.kie.ai/api/v1/jobs
```

## 许可证

本项目基于现有文档创建，供学习和参考使用。

## 致谢

- 提示词模板来自：儿童识字小报提示词生成专家 (`prompt.md`)
- API文档来自：Nano Banana Pro API (`nanobanana.md`)
- 图标：React Icons
- 字体：Google Fonts (Caveat, Fredoka One)