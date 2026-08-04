import time
import socket
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from ping3 import ping

logger = logging.getLogger(__name__)

def execute_ping(ip_address: str, timeout: float = 1.5, current_status: str = None) -> tuple[str, float]:
    """
    Executes real ICMP ping using ping3. If ICMP socket permission fails or times out,
    attempts TCP socket handshake on port 80/443/22 as fallback.
    """
    if current_status == 'Maintenance':
        return ('Maintenance', None)

    try:
        response_time = ping(ip_address, timeout=timeout, unit='ms')
        if response_time is not None and response_time is not False:
            return ('Online', round(float(response_time), 2))
    except Exception as e:
        logger.debug(f"ICMP ping error for {ip_address}: {e}")

    # Fallback to TCP socket connection test (ports 80, 443, 22)
    for port in [80, 443, 22]:
        start_time = time.time()
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(1.0)
        try:
            result = s.connect_ex((ip_address, port))
            if result == 0:
                elapsed_ms = (time.time() - start_time) * 1000
                s.close()
                return ('Online', round(elapsed_ms, 2))
        except Exception:
            pass
        finally:
            s.close()

    return ('Offline', None)

def execute_ping_parallel(devices: list, max_workers: int = 15) -> list:
    """
    Executes multi-threaded parallel ping probes across all inventory devices concurrently.
    """
    results = []

    def probe_device(device):
        status, latency = execute_ping(device.ip_address, current_status=device.status)
        return (device, status, latency)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(probe_device, device) for device in devices]
        for future in as_completed(futures):
            try:
                device, status, latency = future.result()
                results.append((device, status, latency))
            except Exception as e:
                logger.error(f"Parallel ping worker exception: {e}")

    return results
