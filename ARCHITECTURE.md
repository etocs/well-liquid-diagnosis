# 系统架构文档

## 系统概述

井下积液工况诊断系统是一个基于 Web 的实时监控和诊断平台，用于监测油井的工作状态，通过电流分析和水敏电阻网络数据来诊断井下积液情况。

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    用户界面层 (Frontend)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ 异常管理  │  │ 实时监控  │  │ 历史记录  │  │ 数据报表  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                   Vue 3 + Element Plus                   │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────┐
│                  应用服务层 (Backend)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ 数据接口  │  │ 故障诊断  │  │ 预警处理  │  │ 数据分析  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
│                      Flask API Server                    │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                     数据层 (Data)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│
│  │ 时序数据  │  │ 传感器数据 │  │ 告警记录  │  │ 配置信息  ││
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘│
└─────────────────────────────────────────────────────────┘
```

## 前端架构

### 技术选型

- **Vue 3**: 采用 Composition API，提供更好的代码组织和类型支持
- **Vite**: 快速的开发服务器和构建工具
- **Element Plus**: 企业级 UI 组件库
- **ECharts**: 专业的数据可视化库
- **Vue Router**: 单页应用路由管理

### 目录结构

```
frontend/src/
├── assets/           # 静态资源
│   └── styles.css   # 全局样式和主题
├── components/       # 可复用组件
│   └── Layout.vue   # 主布局组件
├── views/           # 页面组件
│   ├── ExceptionManagement.vue    # 异常管理
│   ├── HistoryRecords.vue         # 历史记录
│   ├── PlatformHome.vue           # 平台首页
│   └── ...
├── router/          # 路由配置
│   └── index.js
├── api/             # API 接口封装（待实现）
├── App.vue          # 根组件
└── main.js          # 入口文件
```

### 状态管理

当前版本使用组件内部状态管理。未来可考虑引入 Pinia 进行全局状态管理。

### 数据流

```
用户操作 → 组件事件 → API 调用 → 后端处理 → 数据返回 → 组件更新 → 视图刷新
```

## 后端架构

### 技术选型

- **Flask**: 轻量级 Python Web 框架
- **Flask-CORS**: 处理跨域请求
- **RESTful API**: 标准化的 API 设计

### API 设计

#### 资源划分

1. **wells**: 井信息管理
2. **alerts**: 预警信息管理
3. **realtime**: 实时监测数据
4. **history**: 历史数据查询

#### 接口规范

```
GET    /api/wells/alerts          # 获取预警列表
GET    /api/wells/history         # 获取历史记录
GET    /api/wells/realtime/:id    # 获取实时数据
GET    /api/wells/liquid-level/:id # 获取积液高度
POST   /api/wells/process-alert   # 处理预警
GET    /api/platforms             # 获取平台列表
GET    /api/wells                 # 获取井列表
```

## 数据模型

### 预警记录 (Alert)

```javascript
{
  id: Number,              // 记录ID
  platform: String,        // 平台名称
  well: String,            // 井名称
  set: String,             // 套名
  faultType: String,       // 故障类型
  faultTime: DateTime,     // 故障时间
  status: String,          // 处理状态 (未处理/已处理)
  processTime: DateTime    // 处理时间
}
```

### 实时数据 (RealtimeData)

```javascript
{
  wellId: String,          // 井ID
  timestamp: DateTime,     // 时间戳
  current: Number,         // 电流 (A)
  frequency: Number,       // 频率 (Hz)
  voltage: Number,         // 电压 (V)
  flow: Number,            // 流量
  pressure: Number,        // 压力 (Mpa)
  inletTemperature: Number,// 进口温度 (℃)
  motorTemperature: Number // 电机温度 (℃)
}
```

### 水敏电阻网络数据 (ResistorNetwork)

```javascript
{
  wellId: String,          // 井ID
  liquidLevel: Number,     // 积液高度 (m)
  resistorNetwork: [       // 电阻传感器数组
    {
      depth: Number,       // 深度 (m)
      resistance: Number,  // 电阻值 (Ω)
      isWet: Boolean       // 是否检测到液体
    }
  ],
  timestamp: DateTime      // 测量时间
}
```

## 诊断算法

### 电流模式分析

1. **合气故障**: 
   - 特征: 电流波动幅度 > 2A
   - 频率: 波动周期性出现
   - 流量: 逐渐减小

2. **电流异常**:
   - 特征: 电流超出正常范围 (15-22A)
   - 持续时间: > 5分钟

### 积液高度计算

基于水敏电阻网络数据：

```python
def calculate_liquid_level(resistor_data):
    """
    计算积液高度
    resistor_data: 电阻传感器数组 [{depth, resistance}]
    """
    threshold = 8000  # 电阻阈值 (Ω)
    liquid_level = 0
    
    for sensor in sorted(resistor_data, key=lambda x: x['depth']):
        if sensor['resistance'] < threshold:
            liquid_level = sensor['depth']
        else:
            break
    
    return liquid_level
```

## 性能优化

### 前端优化

1. **懒加载**: 路由组件按需加载
2. **图表优化**: ECharts 数据抽样和渲染优化
3. **防抖节流**: 搜索和实时更新使用防抖
4. **虚拟滚动**: 大数据列表使用虚拟滚动

### 后端优化

1. **数据缓存**: 使用 Redis 缓存热点数据
2. **数据库索引**: 优化查询性能
3. **异步处理**: 耗时操作使用异步任务
4. **数据分页**: 大数据量使用分页加载

## 安全设计

### 认证授权

- JWT Token 认证
- 角色权限控制 (RBAC)
- 会话超时管理

### 数据安全

- HTTPS 加密传输
- 敏感数据加密存储
- SQL 注入防护
- XSS 攻击防护

## 部署架构

### 生产环境部署

```
┌─────────────────────────────────────────┐
│            Nginx (反向代理)               │
│  ┌─────────────┐     ┌─────────────┐   │
│  │  静态文件    │     │   API 路由   │   │
│  │  (Frontend)  │     │  (Backend)  │   │
│  └─────────────┘     └─────────────┘   │
└─────────────────────────────────────────┘
         ↓                      ↓
┌─────────────────┐    ┌─────────────────┐
│   静态资源服务    │    │   Flask + uWSGI  │
│   (Nginx)       │    │   (Python App)   │
└─────────────────┘    └─────────────────┘
                              ↓
                    ┌─────────────────┐
                    │    数据库/缓存    │
                    │  PostgreSQL     │
                    │  Redis          │
                    └─────────────────┘
```

### Docker 部署

提供 Docker Compose 配置，一键部署所有服务。

## 监控和运维

### 系统监控

- 应用性能监控 (APM)
- 错误日志收集
- 实时告警通知

### 日志管理

- 访问日志
- 错误日志
- 操作日志
- 诊断日志

## 未来规划

### 功能扩展

1. **移动端适配**: 响应式设计，支持移动设备
2. **智能诊断**: 引入机器学习算法提升诊断准确度
3. **预测性维护**: 基于历史数据预测故障
4. **多语言支持**: 国际化支持

### 技术升级

1. **实时通信**: WebSocket 实现实时数据推送
2. **大数据处理**: 引入时序数据库处理海量监测数据
3. **云原生**: Kubernetes 编排，弹性伸缩
4. **微服务**: 服务拆分，独立部署

## 参考资料

- Vue 3 官方文档: https://vuejs.org/
- Element Plus 文档: https://element-plus.org/
- ECharts 文档: https://echarts.apache.org/
- Flask 文档: https://flask.palletsprojects.com/
