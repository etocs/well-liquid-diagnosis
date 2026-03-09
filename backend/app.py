from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Mock data for wells
wells_data = [
    {
        'id': 1,
        'platform': '乌石17-2',
        'well': 'A43',
        'set': '01',
        'faultType': '合气',
        'faultTime': '2025-07-14 09:27:00',
        'status': '未处理',
        'processTime': ''
    },
    {
        'id': 2,
        'platform': '乌石17-2',
        'well': 'A43',
        'set': '01',
        'faultType': '合气',
        'faultTime': '2025-07-14 03:00:00',
        'status': '未处理',
        'processTime': ''
    },
    {
        'id': 3,
        'platform': '乌石17-2',
        'well': 'A3',
        'set': '01',
        'faultType': '电流波动',
        'faultTime': '2025-07-14 08:56:00',
        'status': '已处理',
        'processTime': '2025-08-08 09:50:25'
    }
]

# Generate mock time series data
def generate_time_series(start_time, duration_minutes, base_value, variance):
    """Generate mock time series data"""
    data = []
    current_time = datetime.strptime(start_time, '%Y-%m-%d %H:%M:%S')
    
    for i in range(duration_minutes):
        timestamp = current_time + timedelta(minutes=i)
        value = base_value + random.uniform(-variance, variance)
        data.append({
            'timestamp': timestamp.strftime('%H:%M'),
            'value': round(value, 2)
        })
    
    return data

@app.route('/api/wells/alerts', methods=['GET'])
def get_alerts():
    """Get all well alerts/exceptions"""
    platform = request.args.get('platform', 'all')
    well = request.args.get('well', 'all')
    status = request.args.get('status', 'all')
    
    filtered_data = wells_data
    
    if platform != 'all':
        filtered_data = [w for w in filtered_data if w['platform'] == platform]
    
    if well != 'all':
        filtered_data = [w for w in filtered_data if w['well'] == well]
    
    if status != 'all':
        filtered_data = [w for w in filtered_data if w['status'] == status]
    
    return jsonify({
        'success': True,
        'data': filtered_data,
        'total': len(filtered_data)
    })

@app.route('/api/wells/history', methods=['GET'])
def get_history():
    """Get historical alert records"""
    return jsonify({
        'success': True,
        'data': wells_data,
        'total': len(wells_data)
    })

@app.route('/api/wells/realtime/<well_id>', methods=['GET'])
def get_realtime_data(well_id):
    """Get real-time monitoring data for a specific well"""
    
    # Generate mock data for charts
    current_data = generate_time_series('2025-07-14 02:00:00', 100, 19.5, 1.5)
    frequency_data = generate_time_series('2025-07-14 02:00:00', 100, 50, 2)
    voltage_data = generate_time_series('2025-07-14 02:00:00', 100, 1850, 150)
    flow_data = generate_time_series('2025-07-14 02:00:00', 100, 47, 3)
    pressure_data = generate_time_series('2025-07-14 02:00:00', 100, 10, 1.5)
    inlet_temp_data = generate_time_series('2025-07-14 02:00:00', 100, 102, 3)
    motor_temp_data = generate_time_series('2025-07-14 02:00:00', 100, 107, 3)
    
    return jsonify({
        'success': True,
        'data': {
            'wellId': well_id,
            'wellName': '乌石17-2-A43-01',
            'current': current_data,
            'frequency': frequency_data,
            'voltage': voltage_data,
            'flow': flow_data,
            'pressure': pressure_data,
            'inletTemperature': inlet_temp_data,
            'motorTemperature': motor_temp_data,
            'faultInfo': {
                'name': '合气',
                'level': '二级',
                'startTime': '2025-07-14 02:00:30',
                'endTime': '2025-07-14 02:59:30',
                'reason': '电流波动，但不停机流量逐渐减小'
            }
        }
    })

@app.route('/api/wells/liquid-level/<well_id>', methods=['GET'])
def get_liquid_level(well_id):
    """Get liquid level data from water-sensitive resistor network"""
    
    # Mock resistor network data (simulating sensors at different depths)
    resistor_network = []
    for i in range(10):
        depth = 100 + i * 50  # Depths from 100m to 550m
        resistance = random.uniform(1000, 5000) if i < 6 else random.uniform(10000, 50000)
        is_wet = resistance < 8000  # Low resistance indicates liquid presence
        
        resistor_network.append({
            'depth': depth,
            'resistance': round(resistance, 2),
            'isWet': is_wet
        })
    
    # Calculate liquid level based on resistor data
    liquid_level = 0
    for sensor in resistor_network:
        if sensor['isWet']:
            liquid_level = sensor['depth']
    
    return jsonify({
        'success': True,
        'data': {
            'wellId': well_id,
            'liquidLevel': liquid_level,
            'unit': 'm',
            'resistorNetwork': resistor_network,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
    })

@app.route('/api/wells/process-alert', methods=['POST'])
def process_alert():
    """Process/handle an alert"""
    data = request.json
    alert_id = data.get('alertId')
    
    # Find and update the alert
    for well in wells_data:
        if well['id'] == alert_id:
            well['status'] = '已处理'
            well['processTime'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            break
    
    return jsonify({
        'success': True,
        'message': '警报已处理'
    })

@app.route('/api/platforms', methods=['GET'])
def get_platforms():
    """Get list of platforms"""
    platforms = ['乌石17-2', '文昌13-1', '涠洲12-8']
    return jsonify({
        'success': True,
        'data': platforms
    })

@app.route('/api/wells', methods=['GET'])
def get_wells():
    """Get list of wells"""
    platform = request.args.get('platform')
    
    wells = {
        '乌石17-2': ['A43', 'A3', 'B12', 'C5'],
        '文昌13-1': ['W1', 'W2', 'W3'],
        '涠洲12-8': ['V1', 'V2']
    }
    
    if platform:
        return jsonify({
            'success': True,
            'data': wells.get(platform, [])
        })
    
    all_wells = []
    for platform_wells in wells.values():
        all_wells.extend(platform_wells)
    
    return jsonify({
        'success': True,
        'data': all_wells
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
