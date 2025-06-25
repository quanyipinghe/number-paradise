# 🚀 数字乐园 (Number Paradise)

“数字乐园”是一个为儿童设计的互动式数字学习Web应用。它通过有趣的游戏和直观的交互，帮助孩子们建立对数字的认知、学习数数，并在一个充满乐趣的环境中培养对数学的兴趣。

## ✨ 核心功能

本项目目前包含两大核心功能模块：

### 1. 互动数字认知

- **路径**: `/cognition`
- **描述**: 此模块展示了一个从1到100的交互式数字网格。孩子们可以自由点击任何一个数字，系统会立即播放该数字的中文普通话发音。这个功能旨在通过视觉和听觉的双重刺激，帮助儿童将数字的形态和读音联系起来，建立牢固的数字概念。
- **特色**:
    - **即时音频反馈**: 点击数字即可发声，响应迅速。
    - **直观网格布局**: 清晰地展示数字的顺序和大小关系。
    - **响应式设计**: 在桌面、平板和手机上均有良好的视觉和操作体验。

### 2. 数数游戏

- **路径**: `/` (应用首页)
- **描述**: 这是一个寓教于乐的计数游戏。屏幕上会随机出现若干个可爱的 Emoji 表情（如 🍎, 🍌, ⭐ 等），孩子需要数清楚它们的数量，并从四个选项中选出正确的数字答案。
- **特色**:
    - **随机题目生成**: 每次游戏都会随机生成不同数量的物品，保持新鲜感。
    - **生动有趣的动画**: Emoji 和交互按钮都带有活泼的动画效果，吸引孩子的注意力。
    - **即时鼓励与反馈**: 回答正确会得到积极的鼓励，回答错误则会提示再试一次，营造一个无压力的学习氛围。
    - **分数激励**: 答对题目可以获得分数，增加了游戏的挑战性和成就感。

## 🛠️ 技术栈

本项目采用现代前端技术栈构建，以确保高性能、可维护性和优秀的用户体验。

- **前端框架**: [Vue 3](https://vuejs.org/) (使用 `<script setup>` 语法)
- **构建工具**: [Vite](https://vitejs.dev/)
- **编程语言**: [TypeScript](https://www.typescriptlang.org/)
- **路由管理**: [Vue Router](https://router.vuejs.org/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **UI 样式**: [Tailwind CSS](https://tailwindcss.com/)
- **代码规范**: ESLint + Prettier

## 本地开发

您可以按照以下步骤在本地运行本项目：

1.  **克隆仓库**
    ```bash
    git clone <your-repository-url>
    cd number-paradise
    ```

2.  **安装依赖**
    推荐使用 `npm` 或 `pnpm`。
    ```bash
    npm install
    ```

3.  **启动开发服务器**
    此命令将启动一个本地开发服务器，您可以通过浏览器访问 `http://localhost:5173` (端口号可能会变化)。
    ```bash
    npm run dev
    ```

4.  **构建生产版本**
    当您需要将项目打包用于部署时，运行以下命令。打包后的文件将位于 `dist` 目录。
    ```bash
    npm run build
    ```

## 📁 项目结构

项目的源代码位于 `src` 目录下，其主要结构如下：

```
src/
├── assets/         # 存放图片、字体等静态资源
├── components/     # 全局可复用的Vue组件 (如 NumberCard.vue, NumberGrid.vue)
├── pages/          # 页面级组件 (如 CountingGamePage.vue, NumberCognitionPage.vue)
├── router/         # Vue Router 路由配置
├── services/       # 应用服务 (如 AudioService.ts 用于处理音频播放)
├── store/          # Pinia 状态管理模块 (如 game.ts)
├── styles/         # 全局样式文件
├── App.vue         # 应用根组件
├── Layout.vue      # 主布局组件
└── main.ts         # 应用入口文件
