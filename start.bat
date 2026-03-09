@echo off
chcp 65001 >nul
cls

echo ==================================
echo 井下积液工况诊断系统
echo Well Liquid Diagnosis System
echo ==================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未安装 Node.js，请先安装 Node.js (^>=16.0.0^)
    pause
    exit /b 1
)

REM 检查 Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未安装 Python，请先安装 Python (^>=3.8^)
    pause
    exit /b 1
)

REM 检查是否已安装前端依赖
if not exist "node_modules" (
    echo 正在安装前端依赖...
    call npm install
)

REM 检查是否已安装后端依赖
if not exist "backend\.venv" (
    echo 正在创建 Python 虚拟环境...
    cd backend
    python -m venv .venv
    call .venv\Scripts\activate
    pip install -r requirements.txt
    cd ..
)

echo.
echo 启动后端服务器 (端口 5000^)...
cd backend
start "Backend Server" cmd /k ".venv\Scripts\activate && python app.py"
cd ..

timeout /t 2 /nobreak >nul

echo 启动前端服务器 (端口 3000^)...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ==================================
echo 系统启动成功！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:5000
echo ==================================
echo.
echo 关闭此窗口将停止所有服务
pause
