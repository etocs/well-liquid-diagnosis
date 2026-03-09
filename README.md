# 井下积液工况诊断系统 (Well Liquid Diagnosis System)

基于电流监测与水敏电阻网的积液诊断平台

## 项目简介

本系统是一个专业的井下积液工况诊断平台，主要功能包括：

- **电流监测**: 实时监测井下泵的电流变化，用于诊断工况异常
- **水敏电阻网**: 结合井筒中部署的水敏电阻网络进行积液高度判定
- **实时监控**: 提供各个井筒的数据大屏展示
- **异常预警**: 自动检测故障并生成预警信息
- **历史记录**: 完整的历史预警记录和处理追踪

## 技术栈

### 前端
- **Vue 3**: 渐进式 JavaScript 框架
- **Vite**: 新一代前端构建工具
- **Element Plus**: 基于 Vue 3 的组件库
- **ECharts**: 数据可视化图表库
- **Vue Router**: 官方路由管理器

### 后端
- **Flask**: Python 轻量级 Web 框架
- **Flask-CORS**: 跨域资源共享支持

## 功能特性

### 1. 异常管理 (Exception Management)
- 实时显示井下泵故障预警列表
- 多条件筛选（平台、井名、故障类型）
- 实时监测曲线展示：
  - 电流与电机频率曲线
  - 电压与流量曲线
  - 压力与温度曲线
- 故障详细信息展示

### 2. 历史预警记录 (Historical Records)
- 完整的历史预警数据查询
- 按时间范围筛选
- 处理状态跟踪
- 处理时间记录

### 3. 实时监控
- 多参数实时曲线图
- 自动刷新数据
- 异常状态高亮显示

### 4. 数据分析
- 基于电流模式的故障诊断
- 水敏电阻网络数据分析
- 积液高度计算

## 项目结构

```
well-liquid-diagnosis/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── assets/       # 静态资源
│   │   │   └── styles.css
│   │   ├── components/   # 公共组件
│   │   │   └── Layout.vue
│   │   ├── views/        # 页面组件
│   │   │   ├── ExceptionManagement.vue
│   │   │   ├── HistoryRecords.vue
│   │   │   ├── PlatformHome.vue
│   │   │   ├── ProductionMonitoring.vue
│   │   │   ├── DataReports.vue
│   │   │   ├── BaseInfo.vue
│   │   │   ├── SystemManagement.vue
│   │   │   └── SecurityAudit.vue
│   │   ├── router/       # 路由配置
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   └── index.html
├── backend/              # 后端项目
│   ├── app.py           # Flask 应用
│   └── requirements.txt
├── vite.config.js       # Vite 配置
├── package.json
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 16.0.0
- Python >= 3.8
- npm 或 yarn

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/etocs/well-liquid-diagnosis.git
cd well-liquid-diagnosis
```

#### 2. 安装前端依赖

```bash
npm install
```

#### 3. 安装后端依赖

```bash
cd backend
pip install -r requirements.txt
```

### 运行项目

#### 启动前端开发服务器

```bash
npm run dev
```

前端服务将运行在 `http://localhost:3000`

#### 启动后端 API 服务器

在另一个终端窗口中：

```bash
cd backend
python app.py
```

后端服务将运行在 `http://localhost:5000`

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

## API 接口文档

### 获取预警列表
```
GET /api/wells/alerts
参数: platform, well, status
返回: 预警列表数据
```

### 获取历史记录
```
GET /api/wells/history
返回: 历史预警记录
```

### 获取实时监测数据
```
GET /api/wells/realtime/<well_id>
返回: 实时电流、压力、温度等数据
```

### 获取积液高度数据
```
GET /api/wells/liquid-level/<well_id>
返回: 基于水敏电阻网络的积液高度数据
```

### 处理预警
```
POST /api/wells/process-alert
参数: { alertId }
返回: 处理结果
```

## 系统截图

### 异常管理页面
![Exception Management](https://github.com/user-attachments/assets/23eb4b4f-bdbc-4e5e-968a-517ef4b1ea49)

### 历史预警记录页面
![History Records](https://github.com/user-attachments/assets/5ed57795-2658-4708-8422-9b0eb572d623)

## 配置说明

### Vite 配置

`vite.config.js` 文件配置了：
- Vue 插件支持
- 路径别名 (@)
- 开发服务器端口 (3000)
- API 代理配置

### 路由配置

`frontend/src/router/index.js` 配置了所有页面路由：
- /platform-home - 平台首页
- /production-monitoring - 生产监控
- /data-reports - 数据报表
- /exception-management - 异常管理
- /base-info - 基础信息
- /system-management - 系统管理
- /security-audit - 安全审计
- /history-records - 历史预警记录

## 主题定制

系统采用深蓝色专业主题，可在 `frontend/src/assets/styles.css` 中修改颜色变量：

```css
:root {
  --primary-bg: #0a1929;
  --secondary-bg: #112240;
  --card-bg: #1a2942;
  --border-color: #1e3a5f;
  --primary-blue: #1890ff;
  /* ... 更多颜色变量 */
}
```

## 开发指南

### 添加新页面

1. 在 `frontend/src/views/` 创建新的 Vue 组件
2. 在 `frontend/src/router/index.js` 添加路由配置
3. 在 `Layout.vue` 中添加导航菜单项

### 添加新的 API 接口

1. 在 `backend/app.py` 中添加新的路由处理函数
2. 使用 `@app.route()` 装饰器定义路由
3. 返回 JSON 格式数据

## 故障诊断

### 常见故障类型

1. **合气**: 电流波动，流量逐渐减小
2. **电流波动**: 电流不稳定
3. **压力异常**: 进口压力超出正常范围
4. **温度异常**: 温度超过安全阈值

### 诊断依据

- 电流曲线模式分析
- 电机频率变化趋势
- 压力-流量相关性
- 温度监测数据
- 水敏电阻网络状态

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

ISC License

## 联系方式

- 项目地址: https://github.com/etocs/well-liquid-diagnosis
- 问题反馈: https://github.com/etocs/well-liquid-diagnosis/issues
