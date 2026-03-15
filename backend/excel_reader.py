"""
excel_reader.py — 从 Excel 读取电流/电阻数据，模拟实测数据 API

用法:
  pip install flask flask-cors openpyxl pandas
  python excel_reader.py --file data.xlsx --well "E区-实测井" --port 8765

Excel 文件格式（第一行为表头）：
  | time (可选)         | current (A) | resistance (Ω) |
  |---------------------|-------------|----------------|
  | 2024-01-01 12:00:00 |       18.5  |            850 |
  | ...                 |       ...   |            ... |

其中 time 列可省略，缺省时按行号生成相对时间戳。

运行后，接口地址为：
  GET http://localhost:<port>/api/realtime

每次请求返回"当前秒"对应的一行数据（自动循环），格式：
  {
    "wellName": "<--well 参数>",
    "current": 18.5,
    "resistance": 850,
    "timestamp": "12:00:01"
  }
"""

import argparse
import threading
import time
import os

from flask import Flask, jsonify
from flask_cors import CORS

try:
    import pandas as pd
except ImportError:
    pd = None  # type: ignore

try:
    import openpyxl  # noqa: F401 -- only needed by pandas engine
except ImportError:
    pass

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the frontend

# ── Global state ──────────────────────────────────────────────────────────────
_lock = threading.Lock()
_rows: list[dict] = []          # Loaded data rows
_index: int = 0                 # Current row index (cycles through _rows)
_well_name: str = "实测井"
_last_tick: float = 0.0         # Last time we advanced the index


def _load_excel(filepath: str, well_name: str) -> None:
    """Load Excel file into _rows. Supports .xlsx and .xls."""
    global _rows, _well_name

    if pd is None:
        raise RuntimeError("pandas is not installed. Run: pip install pandas openpyxl")

    if not os.path.isfile(filepath):
        raise FileNotFoundError(f"Excel file not found: {filepath}")

    df = pd.read_excel(filepath, engine="openpyxl")
    df.columns = [str(c).strip().lower() for c in df.columns]

    # Normalise column names
    col_map = {}
    for col in df.columns:
        lc = col.lower()
        if lc in ("current", "电流", "current(a)", "电流(a)"):
            col_map[col] = "current"
        elif lc in ("resistance", "电阻", "resistance(ω)", "电阻(ω)", "resistance(ohm)"):
            col_map[col] = "resistance"
        elif lc in ("time", "timestamp", "时间", "datetime"):
            col_map[col] = "time"
    df.rename(columns=col_map, inplace=True)

    if "current" not in df.columns:
        raise ValueError("Excel must have a 'current' (电流) column")
    if "resistance" not in df.columns:
        raise ValueError("Excel must have a 'resistance' (电阻) column")

    rows = []
    for i, row in df.iterrows():
        ts = str(row.get("time", "")) if "time" in df.columns else ""
        rows.append({
            "current": float(row["current"]),
            "resistance": float(row["resistance"]),
            "time": ts,
        })

    with _lock:
        _rows[:] = rows
        _well_name = well_name
    print(f"[excel_reader] Loaded {len(rows)} rows from '{filepath}', well='{well_name}'")


def _tick() -> None:
    """Background thread: advance _index every second."""
    global _index, _last_tick
    while True:
        time.sleep(1)
        with _lock:
            if _rows:
                _index = (_index + 1) % len(_rows)
        _last_tick = time.time()


# ── Flask routes ───────────────────────────────────────────────────────────────

@app.route("/api/realtime")
def get_realtime():
    """Return current data point (cycles through Excel rows at 1 row/second)."""
    with _lock:
        if not _rows:
            return jsonify({"error": "No data loaded"}), 503
        row = _rows[_index]
        well_name = _well_name

    import datetime
    ts = row["time"] if row["time"] else datetime.datetime.now().strftime("%H:%M:%S")

    return jsonify({
        "wellName": well_name,
        "current": round(row["current"], 3),
        "resistance": round(row["resistance"], 3),
        "timestamp": ts,
    })


@app.route("/api/status")
def get_status():
    """Return server / dataset status."""
    with _lock:
        total = len(_rows)
        idx = _index
        well = _well_name
    return jsonify({
        "well": well,
        "total_rows": total,
        "current_index": idx,
    })


# ── Entry point ────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(description="Excel data API server for well liquid diagnosis")
    parser.add_argument("--file", "-f", required=True, help="Path to Excel file (.xlsx)")
    parser.add_argument("--well", "-w", default="实测井", help="Well name (default: 实测井)")
    parser.add_argument("--port", "-p", type=int, default=8765, help="HTTP port (default: 8765)")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind (default: 0.0.0.0)")
    args = parser.parse_args()

    _load_excel(args.file, args.well)

    # Start background ticker
    t = threading.Thread(target=_tick, daemon=True)
    t.start()

    print(f"[excel_reader] API server starting on http://{args.host}:{args.port}")
    print(f"[excel_reader] Endpoint: GET /api/realtime")
    print(f"[excel_reader] Press Ctrl+C to stop.")
    app.run(host=args.host, port=args.port, debug=False)


if __name__ == "__main__":
    main()
