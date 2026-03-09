#!/bin/bash

# 井下积液工况诊断系统启动脚本

echo "=================================="
echo "井下积液工况诊断系统"
echo "Well Liquid Diagnosis System"
echo "=================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: 未安装 Node.js，请先安装 Node.js (>=16.0.0)"
    exit 1
fi

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "错误: 未安装 Python，请先安装 Python (>=3.8)"
    exit 1
fi

# 检查是否已安装前端依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装前端依赖..."
    npm install
fi

# 检查是否已安装后端依赖
if [ ! -d "backend/.venv" ]; then
    echo "正在创建 Python 虚拟环境..."
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

echo ""
echo "启动后端服务器 (端口 5000)..."
cd backend
source .venv/bin/activate
export FLASK_ENV=development
python app.py &
BACKEND_PID=$!
cd ..

echo "启动前端服务器 (端口 3000)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=================================="
echo "系统启动成功！"
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:5000"
echo "=================================="
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
