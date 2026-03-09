# 井下积液工况诊断系统

基于井管电流监测与水敏电阻网的智能积液诊断系统

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI 组件库**: Ant Design 5.x（深色主题）
- **图表库**: ECharts 5.x（通过 echarts-for-react）
- **路由**: React Router v6
- **构建工具**: Vite 5.x

## 快速启动

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
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

### 启动开发服务器
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

启动后，浏览器将自动打开 [http://localhost:3000](http://localhost:3000)
前端服务将运行在 `http://localhost:3000`

#### 启动后端 API 服务器

在另一个终端窗口中：

```bash
cd backend
export FLASK_ENV=development  # 开发模式
python app.py
```

后端服务将运行在 `http://localhost:5000`

**注意**: 生产环境部署时，请勿设置 `FLASK_ENV=development`，并使用 Gunicorn 或 uWSGI 等生产级 WSGI 服务器。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 功能模块

### 1. 系统首页 (`/`)

- 系统概览统计面板（井管总数、正常/预警/故障数量等）
- 各井管状态卡片（实时状态、积液高度）
- 积液高度可视化示意图
- 诊断方法说明

### 2. 生产监控 (`/monitor`)

- 左侧井管列表，点击切换查看各井管数据
- 右侧显示三组监测曲线：
  - 电流(A) - 实际电流 vs 预测电流
  - 电压(V) & 电机频率(Hz) - 双Y轴图表
  - 吸入口压力(MPa) & 温度(°C) - 三条曲线
- 当前参数摘要

### 3. 数据大屏 (`/report`)

- 综合统计面板
- 各井管积液状态示意图
- 各井管电流对比图表

### 4. 异常管理 (`/alarm`)

- 左右布局
- **左侧**: 故障预警表格（筛选、查询、分页）
- **右侧**: 选中告警的运行监测故障诊断曲线 + 故障信息

### 5. 历史预警记录 (`/alarm/history`)

- 时间范围筛选
- 区域、井管名筛选
- 完整的历史记录表格

### 6. 电流实况 (`/monitor/current`)

- 全部井管实时电流状态概览
- 各井管电流曲线（支持按井管筛选）

### 7. 积液诊断 (`/monitor/liquid`)

- 水敏电阻网数据可视化（横向条形图）
- 综合诊断结果（电流法 + 电阻网法）
- 积液高度计算和置信度
- 传感器详情数据表

## 积液诊断算法

### 电流诊断法

| 条件 | 诊断结论 |
|------|----------|
| 电流突降 > 30% | 疑似积液（预警） |
| 电流波动幅度 > 20% | 含气预警 |
| 电流持续低于额定值 50% | 严重积液（故障） |

### 水敏电阻网诊断法

| 条件 | 诊断结论 |
|------|----------|
| 电阻值 < 1000Ω | 该深度有液 |
| 1个传感器检测到积液 | 预警 |
| 3个以上传感器检测到积液 | 故障 |

### 综合诊断

取电流诊断和电阻网诊断中较严重的状态，积液高度按加权平均计算（电流法 40% + 电阻网法 60%）。

## 模拟数据说明

系统内置 7 根井管的模拟数据：

| 井管名称 | 区域 | 状态 | 积液高度 |
|------|------|------|----------|
| A区-1号井管 | A区 | 正常 | 0m |
| A区-2号井管 | A区 | 预警 | 320m |
| A区-3号井管 | A区 | 故障 | 850m |
| B区-1号井管 | B区 | 正常 | 0m |
| B区-2号井管 | B区 | 预警 | 150m |
| C区-1号井管 | C区 | 正常 | 0m |
| C区-2号井管 | C区 | 故障 | 1200m |

每根井管包含 60 个时序数据点（5分钟间隔），覆盖：
- 电流 (0-21A)
- 电压 (0-2100V)
- 电机频率 (0-50Hz)
- 吸入口压力 (0-12MPa)
- 吸入口温度 (0-120°C)
- 电机绕组温度 (0-120°C)

水敏电阻传感器每根井管 10 个，沿 200m-2000m 均匀分布。

## UI 主题

深蓝色工业风格，主要色彩：

- 主背景: `#001529`
- 卡片背景: `#002244`
- 表格头部: `#003366`
- 主色调: `#1890ff`（蓝色）
- 正常状态: `#52c41a`（绿色）
- 预警状态: `#faad14`（黄色）
- 故障状态: `#ff4d4f`（红色）
- 标题文字: `#00ffff`（青色）
构建产物将生成在 `dist` 目录中。

### 生产环境部署

生产环境建议使用：
- **Frontend**: Nginx 托管静态文件
- **Backend**: Gunicorn/uWSGI + Nginx 反向代理

示例 Gunicorn 启动命令：
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```


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
