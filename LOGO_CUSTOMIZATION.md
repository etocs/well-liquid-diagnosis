# Logo自定义指南 / Logo Customization Guide

本文档说明如何自定义系统中的Logo图标。

## Logo位置 / Logo Locations

系统中有两处显示Logo：

### 1. 登录页面 (Login Page)
**文件位置**: `src/pages/Login.tsx` (第76-103行)

当前使用emoji图标 💧，如需替换为自定义图片：

**方法一：使用图片文件**
```tsx
{/* Logo */}
<div style={{ textAlign: 'center', marginBottom: 32 }}>
  <div style={{
    width: 64, height: 64,
    background: 'linear-gradient(135deg, #1890ff, #00c6ff)',
    borderRadius: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0 8px 24px rgba(24,144,255,0.4)',
  }}>
    {/* 替换emoji为img标签 */}
    <img src="/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
  </div>
  <h1 style={{
    color: '#00ffff',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    margin: '0 0 6px',
  }}>
    井下积液工况诊断系统
  </h1>
  <p style={{ color: '#6b8aab', fontSize: 13, margin: 0 }}>
    Well Liquid Diagnosis Platform
  </p>
</div>
```

**方法二：使用SVG图标**
```tsx
{/* Logo */}
<div style={{ textAlign: 'center', marginBottom: 32 }}>
  <div style={{
    width: 64, height: 64,
    background: 'linear-gradient(135deg, #1890ff, #00c6ff)',
    borderRadius: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0 8px 24px rgba(24,144,255,0.4)',
  }}>
    {/* 替换为SVG */}
    <svg width="40" height="40" viewBox="0 0 100 100">
      {/* 在这里添加你的SVG路径 */}
      <circle cx="50" cy="50" r="40" fill="white" />
    </svg>
  </div>
  <h1 style={{
    color: '#00ffff',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    margin: '0 0 6px',
  }}>
    井下积液工况诊断系统
  </h1>
  <p style={{ color: '#6b8aab', fontSize: 13, margin: 0 }}>
    Well Liquid Diagnosis Platform
  </p>
</div>
```

### 2. 页面头部 (Header)
**文件位置**: `src/components/Layout/Header.tsx` (第98-124行)

当前使用emoji图标 💧，如需替换：

**方法一：使用图片文件**
```tsx
<div style={{
  width: 40,
  height: 40,
  background: themeMode === 'dark' 
    ? 'linear-gradient(135deg, #1890ff, #00c6ff)' 
    : 'linear-gradient(135deg, #40a9ff, #69c0ff)',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 18,
  flexShrink: 0,
}}>
  {/* 替换emoji为img标签 */}
  <img src="/logo.png" alt="Logo" style={{ width: 24, height: 24 }} />
</div>
```

**方法二：使用SVG图标**
```tsx
<div style={{
  width: 40,
  height: 40,
  background: themeMode === 'dark' 
    ? 'linear-gradient(135deg, #1890ff, #00c6ff)' 
    : 'linear-gradient(135deg, #40a9ff, #69c0ff)',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
}}>
  {/* 替换为SVG */}
  <svg width="24" height="24" viewBox="0 0 100 100">
    {/* 在这里添加你的SVG路径 */}
    <circle cx="50" cy="50" r="40" fill="white" />
  </svg>
</div>
```

## 图片文件放置 / Image File Placement

如果使用图片文件（.png, .jpg, .svg等），请按以下步骤操作：

### 步骤1：添加图片文件
将你的logo图片文件放置在以下目录：
```
public/
  └── logo.png  (或 logo.svg, logo.jpg等)
```

### 步骤2：在代码中引用
在代码中使用绝对路径引用：
```tsx
<img src="/logo.png" alt="Logo" style={{ width: 40, height: 40 }} />
```

或者使用import方式（推荐）：
```tsx
import logoImage from '../assets/logo.png';

<img src={logoImage} alt="Logo" style={{ width: 40, height: 40 }} />
```

如果使用import方式，需要将图片放在 `src/assets/` 目录下。

## 修改系统名称 / Modify System Name

如果需要修改系统名称，请在相同位置修改：

### 登录页面系统名称
**文件**: `src/pages/Login.tsx` (第98行)
```tsx
<h1 style={{ /* ... */ }}>
  井下积液工况诊断系统  {/* 修改这里 */}
</h1>
<p style={{ /* ... */ }}>
  Well Liquid Diagnosis Platform  {/* 修改这里 */}
</p>
```

### 头部系统名称
**文件**: `src/components/Layout/Header.tsx` (第110-121行)
```tsx
<div style={{ 
  color: themeMode === 'dark' ? '#00ffff' : '#1890ff', 
  fontSize: 16, 
  fontWeight: 700, 
  lineHeight: 1.2, 
  letterSpacing: 1 
}}>
  井下积液诊断系统  {/* 修改这里 */}
</div>
<div style={{ color: themeMode === 'dark' ? '#8c9eb5' : '#666666', fontSize: 11 }}>
  Well Liquid Diagnosis Platform  {/* 修改这里 */}
</div>
```

## 注意事项 / Notes

1. **图片尺寸建议** / Recommended Image Sizes:
   - 登录页Logo: 64x64 像素或更大
   - 头部Logo: 40x40 像素或更大
   - 建议使用PNG格式以支持透明背景

2. **文件格式** / File Formats:
   - PNG: 支持透明背景，推荐使用
   - SVG: 矢量格式，任意缩放不失真，最佳选择
   - JPG: 不支持透明背景

3. **样式调整** / Style Adjustments:
   - 可以根据需要调整 `width` 和 `height` 样式
   - 可以移除或修改背景渐变色 `background`
   - 可以调整圆角 `borderRadius`

4. **开发环境** / Development:
   - 修改代码后需要重新编译：`npm run dev`
   - 浏览器会自动刷新显示最新内容

5. **生产环境** / Production:
   - 部署前记得构建：`npm run build`
   - 确保图片文件包含在构建输出中

## 示例 / Examples

### 完整示例：使用公司Logo替换
```tsx
// 1. 将公司logo.png放在 public/ 目录下

// 2. 修改 src/pages/Login.tsx
<div style={{ textAlign: 'center', marginBottom: 32 }}>
  <div style={{
    width: 80,  // 增加尺寸
    height: 80,
    borderRadius: 16,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',  // 白色背景
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }}>
    <img src="/logo.png" alt="公司Logo" style={{ 
      width: 60, 
      height: 60,
      objectFit: 'contain'
    }} />
  </div>
  <h1 style={{
    color: '#00ffff',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 2,
    margin: '0 0 6px',
  }}>
    您的系统名称  {/* 修改系统名称 */}
  </h1>
  <p style={{ color: '#6b8aab', fontSize: 13, margin: 0 }}>
    Your System Name  {/* 修改英文名称 */}
  </p>
</div>

// 3. 同样方式修改 src/components/Layout/Header.tsx
```

## 技术支持 / Support

如有问题，请查看：
- React官方文档: https://react.dev/
- Ant Design文档: https://ant.design/
- 项目README.md文件
