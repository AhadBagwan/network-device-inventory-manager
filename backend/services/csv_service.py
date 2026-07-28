import io
import pandas as pd
from flask import Response

def generate_inventory_csv(devices):
    """
    Exports a list of Device objects into a clean CSV file using Pandas.
    """
    data = []
    for d in devices:
        data.append({
            'ID': d.id,
            'Hostname': d.hostname,
            'IP Address': d.ip_address,
            'Device Type': d.device_type,
            'Vendor': d.vendor,
            'Model': d.model,
            'Operating System': d.operating_system or '',
            'Serial Number': d.serial_number or '',
            'MAC Address': d.mac_address or '',
            'Location': d.location,
            'Rack': d.rack or '',
            'Status': d.status,
            'Latency (ms)': round(d.latency, 2) if d.latency is not None else 'N/A',
            'Last Checked': d.last_checked.strftime('%Y-%m-%d %H:%M:%S') if d.last_checked else 'Never',
            'Notes': d.notes or '',
            'Created At': d.created_at.strftime('%Y-%m-%d %H:%M:%S') if d.created_at else ''
        })

    df = pd.DataFrame(data)
    
    # Save dataframe to string buffer
    output = io.StringIO()
    df.to_csv(output, index=False, encoding='utf-8')

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=network_device_inventory.csv",
            "Content-Type": "text/csv; charset=utf-8"
        }
    )
