<template>
  <div class="layout-container">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#ff4d4f" stroke-width="2"/>
            <path d="M20 8 L20 20 L28 20" stroke="#ff4d4f" stroke-width="2" fill="none"/>
            <circle cx="20" cy="20" r="2" fill="#ff4d4f"/>
          </svg>
          <span class="logo-text">中国海油</span>
        </div>
      </div>
      
      <div class="header-center">
        <nav class="nav-menu">
          <router-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="nav-item"
            :class="{ active: currentRoute === item.path }"
          >
            <component :is="item.icon" class="nav-icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </nav>
      </div>
      
      <div class="header-right">
        <el-icon class="header-icon" :size="20"><Bell /></el-icon>
        <el-icon class="header-icon" :size="20"><Moon /></el-icon>
        <el-icon class="header-icon" :size="20"><FullScreen /></el-icon>
        <el-icon class="header-icon" :size="20"><Setting /></el-icon>
        <div class="user-info">
          <el-icon :size="20"><UserFilled /></el-icon>
          <span>超级管理员</span>
        </div>
      </div>
    </div>
    
    <!-- Main content -->
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeFilled,
  Monitor,
  DataAnalysis,
  Warning,
  Document,
  Setting,
  Lock,
  Bell,
  Moon,
  FullScreen,
  UserFilled
} from '@element-plus/icons-vue'

const route = useRoute()

const menuItems = [
  { path: '/platform-home', title: '平台首页', icon: HomeFilled },
  { path: '/production-monitoring', title: '生产监控', icon: Monitor },
  { path: '/data-reports', title: '数据报表', icon: DataAnalysis },
  { path: '/exception-management', title: '异常管理', icon: Warning },
  { path: '/base-info', title: '基础信息', icon: Document },
  { path: '/system-management', title: '系统管理', icon: Setting },
  { path: '/security-audit', title: '安全审计', icon: Lock }
]

const currentRoute = computed(() => route.path)
</script>

<style scoped>
.layout-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--primary-bg);
}

.header {
  height: 60px;
  background: linear-gradient(90deg, #0d2847 0%, #1a3a5f 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 2px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.header-left {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 2px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-menu {
  display: flex;
  gap: 8px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 6px;
  color: var(--text-primary);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  background: rgba(24, 144, 255, 0.2);
  border-color: var(--primary-blue);
  transform: translateY(-2px);
}

.nav-item.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.nav-icon {
  width: 18px;
  height: 18px;
}

.header-right {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.3s;
}

.header-icon:hover {
  color: var(--primary-blue);
  transform: scale(1.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(24, 144, 255, 0.1);
  border: 1px solid rgba(24, 144, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-info:hover {
  background: rgba(24, 144, 255, 0.2);
  border-color: var(--primary-blue);
}

.main-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: var(--primary-bg);
}
</style>
