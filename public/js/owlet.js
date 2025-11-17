// ============================================
// OWLET.JS - Owlet monitoring and display
// ============================================

import { getOwletVitals, getOwletSummaries } from './api.js';
import { showAlertToast, closeOwletView } from './ui.js';
import { playAlertSound, formatVitalStatus, getColorForStatus } from './utils.js';

let owletAutoRefreshInterval = null;
let lastAlertTime = {};
let owletTouchStartX = 0;
let owletTouchStartY = 0;

export function openOwletViewHandler() {
    const owletView = document.getElementById('owletView');
    const gridContainer = document.getElementById('gridContainer');
    if (owletView) owletView.classList.add('active');
    if (gridContainer) gridContainer.classList.add('hidden');
    
    loadOwletData();
    setupOwletSwipeGesture();
    
    if (owletAutoRefreshInterval) clearTimeout(owletAutoRefreshInterval);
    const scheduleOwletRefresh = () => {
        if (document.getElementById('owletView')?.classList.contains('active')) {
            loadOwletData().finally(() => {
                owletAutoRefreshInterval = setTimeout(scheduleOwletRefresh, 5000); // 5 sec refresh
            });
        } else {
            if (owletAutoRefreshInterval) {
                clearTimeout(owletAutoRefreshInterval);
                owletAutoRefreshInterval = null;
            }
        }
    };
    owletAutoRefreshInterval = setTimeout(scheduleOwletRefresh, 5000);
}

function setupOwletSwipeGesture() {
    const view = document.getElementById('owletView');
    if (!view) return;
    
    view.addEventListener('touchstart', (e) => {
        owletTouchStartX = e.touches[0].clientX;
        owletTouchStartY = e.touches[0].clientY;
    }, false);
    
    view.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - owletTouchStartX;
        const diffY = touchEndY - owletTouchStartY;
        
        if (diffX > 100 && Math.abs(diffY) < 50) {
            closeOwletViewHandler();
        }
    }, false);
}

async function loadOwletData() {
    const statusDiv = document.getElementById('owletStatus');
    if (!statusDiv) return;
    
    try {
        statusDiv.style.opacity = '0.7';
        const data = await getOwletVitals();
        statusDiv.style.opacity = '1';
        
        const { latest_reading } = data;
        
        if (!latest_reading) {
            statusDiv.innerHTML = `
                <div class="empty-state">
                    <div class="icon">💓</div>
                    <h3>No Owlet Data Available</h3>
                    <p>Make sure the Owlet sync service is running</p>
                </div>
            `;
            return;
        }
        
        // Check alerts
        checkAndShowAlerts(latest_reading);
        
        // Render vitals display
        renderVitalsDisplay(statusDiv, latest_reading);
    } catch (error) {
        console.error('Error loading Owlet data:', error);
        statusDiv.innerHTML = `
            <div class="empty-state">
                <div class="icon">❌</div>
                <h3>Error Loading Data</h3>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function checkAndShowAlerts(reading) {
    if (reading.low_oxygen === true) {
        const alertKey = 'low_oxygen';
        const now = Date.now();
        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 30000) {
            playAlertSound();
            showAlertToast('⚠️ Low Oxygen Alert!', 'danger');
            lastAlertTime[alertKey] = now;
        }
    }
    
    if (reading.high_heart_rate === true) {
        const alertKey = 'high_hr';
        const now = Date.now();
        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 30000) {
            playAlertSound();
            showAlertToast('⚠️ High Heart Rate Alert!', 'danger');
            lastAlertTime[alertKey] = now;
        }
    }
    
    if (reading.low_battery === true) {
        const alertKey = 'low_battery';
        const now = Date.now();
        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 60000) {
            showAlertToast('🔋 Low Battery on Sock', 'warning');
            lastAlertTime[alertKey] = now;
        }
    }
    
    if (reading.sock_connected === false) {
        const alertKey = 'sock_disconnected';
        const now = Date.now();
        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 60000) {
            showAlertToast('❌ Sock Disconnected!', 'danger');
            lastAlertTime[alertKey] = now;
        }
    }
}

function renderVitalsDisplay(container, reading) {
    const hrStatus = formatVitalStatus(reading.heart_rate, 60, 160);
    const o2Status = formatVitalStatus(reading.oxygen_saturation, 95, 100);
    
    const heartRateDisplay = reading.heart_rate !== null && reading.heart_rate !== undefined ? reading.heart_rate + ' bpm' : 'N/A';
    const o2Display = reading.oxygen_saturation !== null && reading.oxygen_saturation !== undefined ? reading.oxygen_saturation + '%' : 'N/A';
    const batteryDisplay = reading.battery_percentage !== null && reading.battery_percentage !== undefined ? reading.battery_percentage + '%' : 'N/A';
    const tempDisplay = reading.skin_temperature !== null && reading.skin_temperature !== undefined ? reading.skin_temperature + '°C' : 'N/A';
    const sleepStateDisplay = getSleepStateDisplay(reading.sleep_state);
    
    container.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div style="background: #f8fafc; border-radius: 8px; padding: 12px; border-left: 4px solid ${getColorForStatus(hrStatus)};">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Heart Rate</div>
                    <div style="font-size: 28px; font-weight: 600; color: ${getColorForStatus(hrStatus)};">${heartRateDisplay}</div>
                </div>
                <div style="background: #f8fafc; border-radius: 8px; padding: 12px; border-left: 4px solid ${getColorForStatus(o2Status)};">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Oxygen Level</div>
                    <div style="font-size: 28px; font-weight: 600; color: ${getColorForStatus(o2Status)};">${o2Display}</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Battery</div>
                    <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${batteryDisplay}</div>
                </div>
                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Temperature</div>
                    <div style="font-size: 20px; font-weight: 600; color: #1e293b;">${tempDisplay}</div>
                </div>
            </div>
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 16px; font-weight: 600; color: #1e293b;">${sleepStateDisplay}</div>
                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                    Sock Connected: <strong style="color: ${reading.sock_connected === true ? '#10b981' : '#ef4444'};">${reading.sock_connected === true ? '✓ Yes' : '✗ No'}</strong>
                </div>
            </div>
        </div>
    `;
}

function getSleepStateDisplay(state) {
    switch(state) {
        case 2: return 'Asleep 😴';
        case 8: return 'Light Sleep 💤';
        case 1: return 'Awake 👀';
        case 0: return 'Detecting...';
        default: return 'Unknown';
    }
}

export function closeOwletViewHandler() {
    const owletView = document.getElementById('owletView');
    const gridContainer = document.getElementById('gridContainer');
    if (owletView) owletView.classList.remove('active');
    if (gridContainer) gridContainer.classList.remove('hidden');
    
    if (owletAutoRefreshInterval) {
        clearTimeout(owletAutoRefreshInterval);
        owletAutoRefreshInterval = null;
    }
}

// Global functions for onclick handlers
window.openOwletView = openOwletViewHandler;
window.closeOwletView = closeOwletViewHandler;

