# HTML版魔法英文小报提示词生成器 - 实施计划

## 项目概述
基于两个现有文档创建完整的Web应用：
1. `D:\VIBE\xiaobao\ai-docs\prompt.md` - 儿童识字小报提示词生成专家角色定义
2. `D:\VIBE\xiaobao\ai-docs\nanobanana.md` - Nano Banana Pro API文档

## 用户需求确认
- **功能范围**：完整工作流（主题联想→提示词生成→API调用→结果展示）
- **技术栈**：React框架
- **词汇联想**：简单规则匹配（预设词汇库）

## 核心功能
1. 主题/场景和标题输入
2. 基于主题的词汇联想（15-20个相关英文单词+中文翻译）
3. 自动填充提示词模板（基于prompt.md模板）
4. 调用Nano Banana Pro API生成图像（基于nanobanana.md文档）
5. 结果展示和下载

## 技术架构
- **前端框架**：React + Vite + TailwindCSS
- **状态管理**：React Context + useReducer
- **API集成**：Fetch API + 轮询机制
- **部署**：静态站点（Vercel/Netlify/GitHub Pages）

## 关键文件与目录结构
```
D:\VIBE\xiaobao\magic-english-poster-generator\
├── public/
├── src/
│   ├── components/          # React组件
│   │   ├── ThemeInput.jsx   # 主题输入
│   │   ├── TitleInput.jsx   # 标题输入
│   │   ├── VocabularyAssociation.jsx  # 词汇联想展示/编辑
│   │   ├── PromptPreview.jsx # 提示词预览
│   │   ├── ApiSettings.jsx  # API设置
│   │   ├── GenerationStatus.jsx # 生成状态
│   │   ├── ResultDisplay.jsx # 结果展示
│   │   └── WorkflowStepper.jsx # 工作流导航
│   ├── services/           # 业务逻辑
│   │   ├── api.js          # Nano Banana Pro API调用
│   │   ├── vocabularyService.js # 词汇联想服务
│   │   └── promptGenerator.js # 提示词生成（基于prompt.md模板）
│   ├── data/               # 静态数据
│   │   ├── vocabularyDatabase.js # 主题词汇库
│   │   └── themes.js       # 主题配置
│   ├── store/              # 状态管理
│   │   ├── index.js        # Context提供者
│   │   ├── actions.js      # Action定义
│   │   └── reducers.js     # Reducer逻辑
│   ├── App.jsx            # 主应用组件
│   ├── App.css            # 全局样式
│   └── index.js           # 应用入口
├── package.json
├── vite.config.js
└── .env.local             # 环境变量
```

## 核心实现逻辑

### 1. 词汇联想服务 (`src/services/vocabularyService.js`)
- 基于主题关键词匹配预设词汇库
- 支持超市、医院、公园等常见主题
- 提供核心角色、常见物品、环境装饰三类词汇
- 允许用户编辑和自定义词汇

### 2. 提示词生成器 (`src/services/promptGenerator.js`)
- 基于`prompt.md`模板生成完整提示词
- 动态填充：`{{主题/场景}}`、`{{标题}}`、`{{词汇列表}}`
- 输出格式化的Markdown提示词

### 3. API集成服务 (`src/services/api.js`)
- 实现`POST /api/v1/jobs/createTask`创建任务
- 实现`GET /api/v1/jobs/recordInfo`查询状态
- 支持Bearer Token认证
- 实现任务状态轮询机制

### 4. 状态管理 (`src/store/`)
- **状态对象**：
  - 用户输入：`theme`、`title`
  - 词汇联想结果：`vocabulary`（分三类）
  - API设置：`apiKey`、`aspectRatio`、`resolution`、`outputFormat`
  - 生成状态：`status`、`taskId`、`resultUrl`、`error`
  - 工作流：`currentStep`、`stepsCompleted`
- **操作**：更新状态、触发词汇联想、生成提示词、调用API

## 工作流步骤
1. **步骤1**：输入主题/场景 → 触发词汇联想
2. **步骤2**：输入标题 → 显示智能建议
3. **步骤3**：展示/编辑词汇联想结果（15-20个单词）
4. **步骤4**：预览/编辑生成的提示词（Markdown格式）
5. **步骤5**：配置API → 生成图像 → 展示结果

## 实施阶段

### 阶段1：项目初始化（1-2天）
- 创建React项目：`npm create vite@latest`
- 配置TailwindCSS、ESLint、Prettier
- 设置基础项目结构
- 创建方案文档：将本计划保存为`PROJECT-PLAN.md`供用户审阅

### 阶段2：核心服务开发（2-3天）
- 实现词汇联想服务（基于主题的关键词匹配）
- 实现提示词生成器（模板填充）
- 实现API服务层（基于nanobanana.md文档）
- 创建状态管理Context

### 阶段3：UI组件开发（2-3天）
- 开发工作流导航组件（WorkflowStepper）
- 开发各步骤表单组件（ThemeInput、TitleInput等）
- 开发词汇编辑组件（VocabularyAssociation）
- 开发提示词预览组件（Markdown渲染）
- 开发API设置和生成状态组件

### 阶段4：集成与测试（1-2天）
- 集成所有组件和服务
- 实现完整的用户工作流
- 添加错误处理和加载状态
- 进行响应式设计适配
- 测试核心功能流程

### 阶段5：部署与优化（1天）
- 构建生产版本：`npm run build`
- 配置环境变量
- 部署到静态托管服务（Vercel/Netlify）
- 编写使用文档

## 关键依赖
- **React 18**：前端框架
- **Vite**：构建工具
- **TailwindCSS**：样式框架
- **Axios/Fetch API**：HTTP客户端
- **React Markdown**：Markdown渲染
- **React Hot Toast**：通知系统
- **React Icons**：图标库

## 风险与缓解
1. **API调用失败**：实现重试机制和用户友好错误提示
2. **词汇联想不准**：提供用户编辑功能，支持自定义词汇
3. **网络延迟**：添加加载状态和进度指示
4. **API密钥安全**：前端不存储密钥，用户自行输入

## 扩展可能性
- 更多主题模板和词汇库
- 多语言支持
- 批量生成功能
- 社区分享功能
- 历史记录保存