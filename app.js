        // App version - increment this when you update files to force cache refresh
        const APP_VERSION = '1.3';
        
        // Initialize events array
        let events = [];
        let currentTimelineDate = new Date();
        let currentHistoryDate = new Date();

        // Set current time as default
        function setDefaultTime() {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            document.getElementById('eventTime').value = now.toISOString().slice(0, 16);
        }

        // Open modal
        function openModal() {
            document.getElementById('eventModal').classList.add('active');
            setDefaultTime();
        }

        // Close modal
        function closeModal() {
            document.getElementById('eventModal').classList.remove('active');
            document.getElementById('eventForm').reset();
            
            // Reset modal to add mode
            document.querySelector('#eventModal .modal-header h2').textContent = 'Add Event';
            document.querySelector('#eventModal .btn-primary').textContent = 'Save Event';
            delete document.getElementById('eventForm').dataset.editingId;
        }

        // Function to open milestones view (placeholder for now)
        function openMilestonesView() {
            loadEvents();
            document.getElementById('milestonesView').classList.add('active');
            document.getElementById('gridContainer').classList.add('hidden');
            renderMilestones();
        }

        // Quick event (one-tap)
        function quickEvent(type, icon) {
            const event = {
                id: Date.now(),
                type: type,
                icon: icon,
                time: new Date().toISOString(),
                notes: ''
            };
            
            // Pulse animation
            const targetBtn = window.event?.target?.closest('.grid-btn');
            if (targetBtn) {
                targetBtn.classList.add('pulse');
                setTimeout(() => targetBtn.classList.remove('pulse'), 600);
            }
            
            saveEvent(event).then(success => {
                if (success) {
                    showToast(`${icon} ${type} recorded!`);
                }
            });
        }

        // Handle form submission
        document.getElementById('eventForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const type = document.getElementById('eventType').value;
            const time = document.getElementById('eventTime').value;
            const notes = document.getElementById('eventNotes').value;
            const editingId = this.dataset.editingId;
            
            const iconMap = {
                'Feed': '🍼',
                'Sleep': '😴',
                'Diaper': '🩱',
                'Medicine': '💊',
                'Bath': '🛁',
                'Doctor': '👨‍⚕️',
                'Milestone': '⭐',
                'Other': '📝',
                'Feed Start': '🍼',
                'Feed End': '🍼',
                'Sleep Start': '😴',
                'Sleep End': '😴'
            };
            
            const event = {
                id: editingId ? parseInt(editingId) : Date.now(),
                type: type,
                icon: iconMap[type],
                time: new Date(time).toISOString(),
                notes: notes
            };
            
            saveEvent(event).then(success => {
                if (success) {
                    closeModal();
                    const action = editingId ? 'updated' : 'recorded';
                    showToast(`${iconMap[type]} ${type} ${action}!`);
                    
                    // Refresh the current view
                    if (document.getElementById('eventsView').classList.contains('active')) {
                        renderEvents();
                    }
                    if (document.getElementById('milestonesView').classList.contains('active')) {
                        renderMilestones();
                    }
                }
            });
        });

        // Load events from server
        function loadEvents() {
            fetch(`events.php?v=${APP_VERSION}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to load events');
                    }
                    return response.json();
                })
                .then(data => {
                    events = Array.isArray(data) ? data : [];
                    if (document.getElementById('eventsView').classList.contains('active')) {
                        renderEvents();
                    }
                    if (document.getElementById('dayTimelineView').classList.contains('active')) {
                        renderTimeline();
                    }
                })
                .catch(error => {
                    console.error('Error loading events:', error);
                    showToast('Failed to load events');
                });
        }

        // Save single event to server
        function saveEvent(event) {
            return fetch(`events.php?v=${APP_VERSION}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save event');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    loadEvents(); // Reload to get updated list
                    return true;
                } else {
                    throw new Error(data.error || 'Failed to save event');
                }
            })
            .catch(error => {
                console.error('Error saving event:', error);
                showToast('Failed to save event');
                return false;
            });
        }


        // Open events view
        function openEventsView() {
            loadEvents();
            document.getElementById('eventsView').classList.add('active');
            document.getElementById('gridContainer').classList.add('hidden');
        }

        // Close events view
        function closeEventsView() {
            document.getElementById('eventsView').classList.remove('active');
            document.getElementById('gridContainer').classList.remove('hidden');
        }

        // Close milestones view
        function closeMilestonesView() {
            document.getElementById('milestonesView').classList.remove('active');
            document.getElementById('gridContainer').classList.remove('hidden');
        }

        // Owlet Monitor
        let owletTouchStartX = 0;
        let owletTouchStartY = 0;
        let owletAutoRefreshInterval = null;
        let owletHistoryAutoRefreshInterval = null;
        let lastAlertTime = {};
        
        function playAlertSound() {
            // Simple beep alert using Web Audio API
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            } catch (e) {
                console.log('Audio alert not available');
            }
        }
        
        function showAlertToast(message, type = 'warning') {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'danger' ? '#ef4444' : '#f59e0b'};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                font-size: 14px;
                font-weight: 600;
                animation: slideIn 0.3s ease;
                max-width: 300px;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
        
        function openOwletView() {
            document.getElementById('owletView').classList.add('active');
            document.getElementById('gridContainer').classList.add('hidden');
            
            loadOwletData();
            setupOwletSwipeGesture();
            
            // Auto-refresh vital data every 1 second
            if (owletAutoRefreshInterval) clearTimeout(owletAutoRefreshInterval);
            const scheduleOwletRefresh = () => {
                if (document.getElementById('owletView').classList.contains('active')) {
                    loadOwletData().finally(() => {
                        owletAutoRefreshInterval = setTimeout(scheduleOwletRefresh, 1000);
                    });
                } else {
                    // Stop refresh if view is closed
                    if (owletAutoRefreshInterval) {
                        clearTimeout(owletAutoRefreshInterval);
                        owletAutoRefreshInterval = null;
                    }
                }
            };
            owletAutoRefreshInterval = setTimeout(scheduleOwletRefresh, 1000);
        }

        function closeOwletView() {
            document.getElementById('owletView').classList.remove('active');
            document.getElementById('gridContainer').classList.remove('hidden');
            
            // Stop auto-refresh when closing
            if (owletAutoRefreshInterval) {
                clearInterval(owletAutoRefreshInterval);
                owletAutoRefreshInterval = null;
            }
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
                
                // Swipe right with minimal vertical movement
                if (diffX > 100 && Math.abs(diffY) < 50) {
                    closeOwletView();
                }
            }, false);
        }

        async function loadOwletData() {
            const statusDiv = document.getElementById('owletStatus');
            try {
                // Show loading indicator briefly
                const wasVisible = statusDiv.style.opacity !== '0.5';
                statusDiv.style.opacity = '0.7';
                statusDiv.style.transition = 'opacity 0.3s ease';
                
                const response = await fetch('events.php?vitals=true');
                if (!response.ok) throw new Error('Failed to fetch vitals');
                
                const data = await response.json();
                const { latest_reading, vitals, last_update } = data;
                
                // Restore visibility
                statusDiv.style.opacity = '1';
                
                // Check for alerts and play sound/show toast
                if (latest_reading) {
                    if (latest_reading.low_oxygen === true) {
                        const alertKey = 'low_oxygen';
                        const now = Date.now();
                        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 30000) {
                            playAlertSound();
                            showAlertToast('⚠️ Low Oxygen Alert!', 'danger');
                            lastAlertTime[alertKey] = now;
                        }
                    }
                    if (latest_reading.high_heart_rate === true) {
                        const alertKey = 'high_hr';
                        const now = Date.now();
                        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 30000) {
                            playAlertSound();
                            showAlertToast('⚠️ High Heart Rate Alert!', 'danger');
                            lastAlertTime[alertKey] = now;
                        }
                    }
                    if (latest_reading.low_battery === true) {
                        const alertKey = 'low_battery';
                        const now = Date.now();
                        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 60000) {
                            showAlertToast('🔋 Low Battery on Sock', 'warning');
                            lastAlertTime[alertKey] = now;
                        }
                    }
                    if (latest_reading.sock_connected === false) {
                        const alertKey = 'sock_disconnected';
                        const now = Date.now();
                        if (!lastAlertTime[alertKey] || now - lastAlertTime[alertKey] > 60000) {
                            showAlertToast('❌ Sock Disconnected!', 'danger');
                            lastAlertTime[alertKey] = now;
                        }
                    }
                }
                
                if (!latest_reading) {
                    statusDiv.innerHTML = `
                        <div class="empty-state">
                            <div class="icon">💓</div>
                            <h3>No Owlet Data Available</h3>
                            <p>Make sure the Owlet sync service is running and configured</p>
                        </div>
                    `;
                    return;
                }
                
                const getVitalStatus = (value, low, high, label) => {
                    if (value === null || value === undefined) return 'gray';
                    if (typeof value === 'number') {
                        if (value < low || value > high) return 'red';
                        return 'green';
                    }
                    return 'gray';
                };
                
                const hrStatus = getVitalStatus(latest_reading.heart_rate, 90, 170, 'HR');
                const o2Status = getVitalStatus(latest_reading.oxygen_saturation, 90, 100, 'O2');
                
                const heartRateDisplay = latest_reading.heart_rate !== null && latest_reading.heart_rate !== undefined 
                    ? latest_reading.heart_rate + ' bpm' 
                    : 'N/A';
                const o2Display = latest_reading.oxygen_saturation !== null && latest_reading.oxygen_saturation !== undefined 
                    ? latest_reading.oxygen_saturation + '%' 
                    : 'N/A';
                const batteryDisplay = latest_reading.battery_percentage !== null && latest_reading.battery_percentage !== undefined 
                    ? latest_reading.battery_percentage + '%' 
                    : 'N/A';
                const batteryMinutesDisplay = latest_reading.battery_minutes !== null && latest_reading.battery_minutes !== undefined 
                    ? Math.floor(latest_reading.battery_minutes / 60) + 'h ' + Math.floor(latest_reading.battery_minutes % 60) + 'm'
                    : 'N/A';
                const movementDisplay = latest_reading.movement !== null && latest_reading.movement !== undefined 
                    ? latest_reading.movement 
                    : 'N/A';
                const signalDisplay = latest_reading.signal_strength !== null && latest_reading.signal_strength !== undefined 
                    ? Math.round(latest_reading.signal_strength) + '%'
                    : 'N/A';
                const tempDisplay = latest_reading.skin_temperature !== null && latest_reading.skin_temperature !== undefined 
                    ? latest_reading.skin_temperature + '°C'
                    : 'N/A';
                // Sleep state: 0=unknown, 1=awake, 2=asleep, 8=light sleep
                let sleepStateDisplay = 'Unknown';
                if (latest_reading.sleep_state === 2) {
                    sleepStateDisplay = 'Asleep 😴';
                } else if (latest_reading.sleep_state === 8) {
                    sleepStateDisplay = 'Light Sleep 💤';
                } else if (latest_reading.sleep_state === 1) {
                    sleepStateDisplay = 'Awake 👀';
                } else if (latest_reading.sleep_state === 0) {
                    sleepStateDisplay = 'Detecting...';
                } else {
                    console.warn('Unknown sleep state:', latest_reading.sleep_state);
                    sleepStateDisplay = 'Error (' + latest_reading.sleep_state + ')';
                }
                const o2AverageDisplay = latest_reading.oxygen_10_av !== null && latest_reading.oxygen_10_av !== undefined 
                    ? latest_reading.oxygen_10_av + '%'
                    : 'N/A';
                
                // Check if container exists for first-time render
                if (!document.getElementById('owletVitalsContainer')) {
                    statusDiv.innerHTML = `
                        <div id="owletVitalsContainer" style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 16px;">
                            <div style="justify-content: space-between; align-items: center; margin-bottom: 12px;">
                                <div>
                                    <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Current Vitals</h3>
                                </div>
                                <div id="owletLastUpdated" style="font-size: 11px; color: #94a3b8;"></div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <div id="owletHRCard" style="background: #f8fafc; border-radius: 8px; padding: 12px; border-left: 4px solid ${hrStatus === 'green' ? '#10b981' : hrStatus === 'red' ? '#ef4444' : '#cbd5e1'};">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Heart Rate</div>
                                    <div id="owletHRValue" style="font-size: 28px; font-weight: 600; color: ${hrStatus === 'green' ? '#10b981' : hrStatus === 'red' ? '#ef4444' : '#64748b'};">
                                        ${heartRateDisplay}
                                    </div>
                                </div>
                                
                                <div id="owletO2Card" style="background: #f8fafc; border-radius: 8px; padding: 12px; border-left: 4px solid ${o2Status === 'green' ? '#10b981' : o2Status === 'red' ? '#ef4444' : '#cbd5e1'};">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Oxygen Level</div>
                                    <div id="owletO2Value" style="font-size: 28px; font-weight: 600; color: ${o2Status === 'green' ? '#10b981' : o2Status === 'red' ? '#ef4444' : '#64748b'};">
                                        ${o2Display}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Battery</div>
                                    <div id="owletBatteryValue" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${batteryDisplay}
                                    </div>
                                    <div id="owletBatteryMinutes" style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                                        ${batteryMinutesDisplay} remaining
                                    </div>
                                </div>
                                
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Skin Temperature</div>
                                    <div id="owletTempValue" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${tempDisplay}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Movement</div>
                                    <div id="owletMovementValue" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${movementDisplay}
                                    </div>
                                </div>
                                
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Signal Strength</div>
                                    <div id="owletSignalValue" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${signalDisplay}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">O2 Average (10m)</div>
                                    <div id="owletO2AvgValue" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${o2AverageDisplay}
                                    </div>
                                </div>
                                
                                <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Sleep Status</div>
                                    <div id="owletSleepValue" style="font-size: 16px; font-weight: 600; color: #1e293b;">
                                        ${sleepStateDisplay}
                                    </div>
                                </div>
                            </div>
                            
                            <div id="owletAlertsSection" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
                                <div style="font-size: 12px; color: #64748b;">
                                    Sock Connected: <strong id="owletSockStatus" style="color: ${latest_reading.sock_connected === true ? '#10b981' : '#ef4444'};">${latest_reading.sock_connected === true ? '✓ Yes' : latest_reading.sock_connected === false ? '✗ No' : '? Unknown'}</strong>
                                </div>
                                <div id="owletAlerts"></div>
                            </div>
                        </div>
                    `;
                }
                
                // Update individual values
                const updateElement = (id, value) => {
                    const elem = document.getElementById(id);
                    if (elem) elem.textContent = value;
                };
                
                // Format and update last updated timestamp
                let lastUpdatedText = 'Last Updated: N/A';
                if (last_update) {
                    const lastUpdateDate = new Date(last_update);
                    const year = lastUpdateDate.getFullYear();
                    const month = String(lastUpdateDate.getMonth() + 1).padStart(2, '0');
                    const day = String(lastUpdateDate.getDate()).padStart(2, '0');
                    const hours = String(lastUpdateDate.getHours()).padStart(2, '0');
                    const minutes = String(lastUpdateDate.getMinutes()).padStart(2, '0');
                    const seconds = String(lastUpdateDate.getSeconds()).padStart(2, '0');
                    
                    lastUpdatedText = `Last Updated: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                }
                updateElement('owletLastUpdated', lastUpdatedText);
                
                updateElement('owletHRValue', heartRateDisplay);
                updateElement('owletO2Value', o2Display);
                updateElement('owletBatteryValue', batteryDisplay);
                updateElement('owletBatteryMinutes', `${batteryMinutesDisplay} remaining`);
                updateElement('owletTempValue', tempDisplay);
                updateElement('owletMovementValue', movementDisplay);
                updateElement('owletSignalValue', signalDisplay);
                updateElement('owletO2AvgValue', o2AverageDisplay);
                updateElement('owletSleepValue', sleepStateDisplay);
                updateElement('owletSockStatus', latest_reading.sock_connected === true ? '✓ Yes' : latest_reading.sock_connected === false ? '✗ No' : '? Unknown');
                
                // Update colors for HR and O2 cards
                const hrCard = document.getElementById('owletHRCard');
                const o2Card = document.getElementById('owletO2Card');
                const hrValue = document.getElementById('owletHRValue');
                const o2Value = document.getElementById('owletO2Value');
                const sockStatus = document.getElementById('owletSockStatus');
                
                if (hrCard) hrCard.style.borderLeftColor = hrStatus === 'green' ? '#10b981' : hrStatus === 'red' ? '#ef4444' : '#cbd5e1';
                if (o2Card) o2Card.style.borderLeftColor = o2Status === 'green' ? '#10b981' : o2Status === 'red' ? '#ef4444' : '#cbd5e1';
                if (hrValue) hrValue.style.color = hrStatus === 'green' ? '#10b981' : hrStatus === 'red' ? '#ef4444' : '#64748b';
                if (o2Value) o2Value.style.color = o2Status === 'green' ? '#10b981' : o2Status === 'red' ? '#ef4444' : '#64748b';
                if (sockStatus) sockStatus.style.color = latest_reading.sock_connected === true ? '#10b981' : '#ef4444';
                
                // Update alerts
                const alertsDiv = document.getElementById('owletAlerts');
                if (alertsDiv) {
                    let alertsHTML = '';
                    if (latest_reading.low_oxygen === true) alertsHTML += '<div style="font-size: 12px; color: #ef4444; margin-top: 4px;"><strong>⚠ Low Oxygen Alert</strong></div>';
                    if (latest_reading.high_heart_rate === true) alertsHTML += '<div style="font-size: 12px; color: #ef4444; margin-top: 4px;"><strong>⚠ High Heart Rate Alert</strong></div>';
                    if (latest_reading.low_battery === true) alertsHTML += '<div style="font-size: 12px; color: #ef4444; margin-top: 4px;"><strong>🔋 Low Battery Alert</strong></div>';
                    alertsDiv.innerHTML = alertsHTML;
                }
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

        // Owlet History View
        let historyTouchStartX = 0;
        let historyTouchStartY = 0;
        
        function openOwletHistoryView() {
            document.getElementById('owletHistoryView').classList.add('active');
            document.getElementById('owletView').classList.add('hidden');
            // Initialize to today
            currentHistoryDate = new Date();
            updateHistoryDate();
            // Load history once without auto-refresh to ensure it completes
            loadOwletHistory();
            setupHistorySwipeGesture();
            // Don't auto-refresh history - load once and display static data
            if (owletHistoryAutoRefreshInterval) clearTimeout(owletHistoryAutoRefreshInterval);
            owletHistoryAutoRefreshInterval = null;
        }
        
        function closeOwletHistoryView() {
            document.getElementById('owletHistoryView').classList.remove('active');
            document.getElementById('owletView').classList.remove('hidden');
            if (owletHistoryAutoRefreshInterval) {
                clearInterval(owletHistoryAutoRefreshInterval);
                owletHistoryAutoRefreshInterval = null;
            }
            // Clean up charts
            if (hrChartInstance) {
                hrChartInstance.destroy();
                hrChartInstance = null;
            }
            if (o2ChartInstance) {
                o2ChartInstance.destroy();
                o2ChartInstance = null;
            }
        }
        
        function navigateHistoryDate(direction) {
            // Clean up existing charts before loading new data
            if (hrChartInstance) {
                hrChartInstance.destroy();
                hrChartInstance = null;
            }
            if (o2ChartInstance) {
                o2ChartInstance.destroy();
                o2ChartInstance = null;
            }
            currentHistoryDate.setDate(currentHistoryDate.getDate() + direction);
            updateHistoryDate();
            loadOwletHistory();
        }
        
        function updateHistoryDate() {
            const today = new Date();
            const isToday = currentHistoryDate.toDateString() === today.toDateString();
            const dateStr = isToday ? 'Today' : currentHistoryDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: currentHistoryDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
            const dateElement = document.getElementById('historyCurrentDate');
            if (dateElement) {
                dateElement.textContent = dateStr;
            }
        }
        
        function setupHistorySwipeGesture() {
            const view = document.getElementById('owletHistoryView');
            if (!view) return;
            
            view.addEventListener('touchstart', (e) => {
                historyTouchStartX = e.touches[0].clientX;
                historyTouchStartY = e.touches[0].clientY;
            }, false);
            
            view.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const diffX = touchEndX - historyTouchStartX;
                const diffY = touchEndY - historyTouchStartY;
                
                // Swipe right with minimal vertical movement
                if (diffX > 100 && Math.abs(diffY) < 50) {
                    closeOwletHistoryView();
                }
            }, false);
        }
        
        // Chart instances storage
        let hrChartInstance = null;
        let o2ChartInstance = null;
        
        async function loadAndRenderCharts(dateStr) {
            try {
                // Fetch minute-by-minute data for the selected date
                const response = await fetch(`events.php?minutes=true&date=${dateStr}`);
                if (!response.ok) {
                    console.warn('Failed to fetch minute data for charts');
                    return;
                }
                
                const data = await response.json();
                if (!data.minutes || data.minutes.length === 0) {
                    console.warn('No minute data available for charts');
                    return;
                }
                
                // Process minute data for charts
                const chartData = processMinuteDataForCharts(data.minutes);
                
                // Render HR chart
                renderHRChart(chartData);
                
                // Render O2 chart
                renderO2Chart(chartData);
            } catch (error) {
                console.error('Error loading chart data:', error);
            }
        }
        
        function processMinuteDataForCharts(minutes) {
            const labels = [];
            const hrData = [];
            const o2Data = [];
            
            // Determine label frequency based on data length
            // For a full day (1440 minutes), show labels every 2 hours
            // For shorter periods, show labels more frequently
            const totalMinutes = minutes.length;
            let labelInterval = 120; // Default: every 2 hours (120 minutes)
            if (totalMinutes < 720) {
                labelInterval = 60; // Every hour if less than 12 hours
            }
            if (totalMinutes < 360) {
                labelInterval = 30; // Every 30 minutes if less than 6 hours
            }
            
            minutes.forEach((minute, index) => {
                const timestamp = new Date(minute.timestamp);
                // Format time as HH:MM for display
                const timeLabel = `${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`;
                
                // Show label at start, end, and at regular intervals
                if (index === 0 || index === minutes.length - 1 || index % labelInterval === 0) {
                    labels.push(timeLabel);
                } else {
                    labels.push('');
                }
                
                hrData.push(minute.heart_rate_avg !== null && minute.heart_rate_avg !== undefined ? minute.heart_rate_avg : null);
                o2Data.push(minute.oxygen_saturation_avg !== null && minute.oxygen_saturation_avg !== undefined ? minute.oxygen_saturation_avg : null);
            });
            
            return { labels, hrData, o2Data };
        }
        
        function renderHRChart(chartData) {
            const canvas = document.getElementById('hrChart');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (hrChartInstance) {
                hrChartInstance.destroy();
            }
            
            hrChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Heart Rate (bpm)',
                        data: chartData.hrData,
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        spanGaps: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12
                                },
                                color: '#1e293b'
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 10,
                            titleFont: {
                                size: 12
                            },
                            bodyFont: {
                                size: 11
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                font: {
                                    size: 10
                                },
                                color: '#64748b',
                                maxTicksLimit: 12
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Heart Rate (bpm)',
                                font: {
                                    size: 11
                                },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            }
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    }
                }
            });
        }
        
        function renderO2Chart(chartData) {
            const canvas = document.getElementById('o2Chart');
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (o2ChartInstance) {
                o2ChartInstance.destroy();
            }
            
            o2ChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Oxygen Saturation (%)',
                        data: chartData.o2Data,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        spanGaps: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12
                                },
                                color: '#1e293b'
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 10,
                            titleFont: {
                                size: 12
                            },
                            bodyFont: {
                                size: 11
                            }
                        }
                    },
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false
                            },
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                font: {
                                    size: 10
                                },
                                color: '#64748b',
                                maxTicksLimit: 12
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Oxygen (%)',
                                font: {
                                    size: 11
                                },
                                color: '#64748b'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#64748b',
                                stepSize: 1
                            },
                            min: 90,
                            max: 100
                        }
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    }
                }
            });
        }
        
        async function loadOwletHistory() {
            const contentDiv = document.getElementById('owletHistoryContent');
            try {
                // Fetch daily summaries (fast load, hour-by-hour data)
                const response = await fetch('events.php?summaries=true');
                if (!response.ok) throw new Error('Failed to fetch summaries');
                
                const data = await response.json();
                const { summaries } = data;
                
                if (!summaries || summaries.length === 0) {
                    contentDiv.innerHTML = `
                        <div class="empty-state">
                            <div class="icon">📭</div>
                            <h3 class="empty-state-title">No Historical Data</h3>
                            <p class="empty-state-message">Daily summaries will appear here as they're created</p>
                        </div>
                    `;
                    return;
                }
                
                // Find the summary for the selected date
                const selectedDateStr = currentHistoryDate.toISOString().split('T')[0]; // YYYY-MM-DD format
                let selectedSummary = summaries.find(s => s.date === selectedDateStr);
                
                // Check if we have a summary for the exact selected date
                const hasSummaryForDate = selectedSummary !== undefined;
                
                // If not found, try to find the closest available date (for fallback display)
                if (!selectedSummary) {
                    // Try to find today's data (might be in-progress)
                    const todayStr = new Date().toISOString().split('T')[0];
                    if (selectedDateStr === todayStr && summaries[0] && summaries[0].date === todayStr) {
                        selectedSummary = summaries[0];
                    } else {
                        // Find the closest previous date
                        selectedSummary = summaries.find(s => s.date <= selectedDateStr) || summaries[0];
                    }
                }
                
                // If no summary exists at all, show empty state
                if (!selectedSummary) {
                    contentDiv.innerHTML = `
                        <div class="empty-state">
                            <div class="icon">📭</div>
                            <h3 class="empty-state-title">No Data for Selected Date</h3>
                            <p class="empty-state-message">No historical data available for this date</p>
                        </div>
                    `;
                    return;
                }
                
                // If we don't have a summary for the selected date, show message
                if (!hasSummaryForDate) {
                    const formattedDate = currentHistoryDate.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    contentDiv.innerHTML = `
                        <div class="empty-state">
                            <div class="icon">📅</div>
                            <h3 class="empty-state-title">No Summary Available</h3>
                            <p class="empty-state-message">No summary data available for ${formattedDate}</p>
                        </div>
                    `;
                    return;
                }
                
                // Use the selected day's data for statistics and hourly breakdown
                const todaySummary = selectedSummary;
                let dailyStats = todaySummary.daily;
                
                // If this is today's in-progress data (no daily stats yet), calculate from hourly
                if (!dailyStats && todaySummary.hourly) {
                    const hourlyData = todaySummary.hourly;
                    
                    // Aggregate all hourly data for the day
                    let aggregated = {
                        heart_rate: { avg: null, min: null, max: null },
                        oxygen_saturation: { avg: null, min: null, max: null },
                        skin_temperature: { avg: null, min: null, max: null },
                        sleep: { asleep: 0, awake: 0 },
                        data_points: 0
                    };
                    
                    if (hourlyData.length > 0) {
                        const hrs = hourlyData.map(h => h.heart_rate?.avg).filter(x => x !== null && x !== undefined);
                        const o2s = hourlyData.map(h => h.oxygen_saturation?.avg).filter(x => x !== null && x !== undefined);
                        const temps = hourlyData.map(h => h.skin_temperature?.avg).filter(x => x !== null && x !== undefined);
                        
                        if (hrs.length > 0) {
                            aggregated.heart_rate = {
                                avg: hrs.reduce((a, b) => a + b, 0) / hrs.length,
                                min: Math.min(...hourlyData.map(h => h.heart_rate?.min).filter(x => x !== null && x !== undefined)),
                                max: Math.max(...hourlyData.map(h => h.heart_rate?.max).filter(x => x !== null && x !== undefined))
                            };
                        }
                        
                        if (o2s.length > 0) {
                            aggregated.oxygen_saturation = {
                                avg: o2s.reduce((a, b) => a + b, 0) / o2s.length,
                                min: Math.min(...hourlyData.map(h => h.oxygen_saturation?.min).filter(x => x !== null && x !== undefined)),
                                max: Math.max(...hourlyData.map(h => h.oxygen_saturation?.max).filter(x => x !== null && x !== undefined))
                            };
                        }
                        
                        if (temps.length > 0) {
                            aggregated.skin_temperature = {
                                avg: temps.reduce((a, b) => a + b, 0) / temps.length,
                                min: Math.min(...hourlyData.map(h => h.skin_temperature?.min).filter(x => x !== null && x !== undefined)),
                                max: Math.max(...hourlyData.map(h => h.skin_temperature?.max).filter(x => x !== null && x !== undefined))
                            };
                        }
                        
                        aggregated.sleep = {
                            asleep: hourlyData.reduce((sum, h) => sum + (h.sleep?.asleep || 0), 0),
                            awake: hourlyData.reduce((sum, h) => sum + (h.sleep?.awake || 0), 0)
                        };
                        
                        aggregated.data_points = hourlyData.reduce((sum, h) => sum + (h.data_points || 0), 0);
                    }
                    
                    dailyStats = aggregated;
                }
                
                const avgHR = dailyStats?.heart_rate?.avg !== null ? dailyStats?.heart_rate?.avg.toFixed(0) : 'N/A';
                const minHR = dailyStats?.heart_rate?.min !== null ? dailyStats?.heart_rate?.min.toFixed(0) : 'N/A';
                const maxHR = dailyStats?.heart_rate?.max !== null ? dailyStats?.heart_rate?.max.toFixed(0) : 'N/A';
                
                const avgO2 = dailyStats?.oxygen_saturation?.avg !== null ? dailyStats?.oxygen_saturation?.avg.toFixed(1) : 'N/A';
                const minO2 = dailyStats?.oxygen_saturation?.min !== null ? dailyStats?.oxygen_saturation?.min.toFixed(1) : 'N/A';
                const maxO2 = dailyStats?.oxygen_saturation?.max !== null ? dailyStats?.oxygen_saturation?.max.toFixed(1) : 'N/A';
                
                const avgTemp = dailyStats?.skin_temperature?.avg !== null ? dailyStats?.skin_temperature?.avg.toFixed(1) : 'N/A';
                
                // Calculate time span
                const firstTime = new Date(todaySummary.first_timestamp || todaySummary.date + 'T00:00:00Z');
                const lastTime = new Date(todaySummary.last_timestamp || new Date().toISOString());
                const timeSpan = (lastTime - firstTime) / 60000 + ' min';
                
                // Calculate sleep time (assuming each reading is 1 minute)
                const asleepMinutes = dailyStats?.sleep?.asleep || 0;
                const sleepHours = Math.floor(asleepMinutes / 60);
                const sleepMins = asleepMinutes % 60;
                const sleepTimeDisplay = asleepMinutes > 0 ? `${sleepHours}h ${sleepMins}m` : '0h 0m';
                
                // Calculate sleep percentage
                const totalSleepReadings = (dailyStats?.sleep?.asleep || 0) + (dailyStats?.sleep?.awake || 0);
                const sleepPercentage = totalSleepReadings > 0 ? Math.round((dailyStats?.sleep?.asleep / totalSleepReadings) * 100) : 0;
                
                // Check if we're viewing today's summary or a past day's summary
                const now = new Date();
                const todayDateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
                const summaryDateStr = todaySummary.date; // Should be in YYYY-MM-DD format
                const isToday = summaryDateStr === todayDateStr;
                
                // Get current hour to determine which hours are from yesterday vs today (only for today's view)
                const currentHour = now.getHours();
                
                // Get yesterday's date for formatting (only needed for today's view)
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayDateStr = yesterday.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });
                
                // Use hourly data from summary (already calculated server-side)
                const hourlyAverages = todaySummary.hourly.map((hour, index) => {
                    // Format time display based on whether we're viewing today or a past day
                    let timeDisplay;
                    const hourFormat = `${String(index).padStart(2, '0')}:00`;
                    
                    if (isToday) {
                        // For today's view: show date + hour for hours > currentHour (yesterday), just hour for hours <= currentHour (today)
                        const isYesterday = index > currentHour;
                        if (isYesterday) {
                            timeDisplay = `${yesterdayDateStr}, ${hourFormat}`;
                        } else {
                            timeDisplay = hourFormat;
                        }
                    } else {
                        // For past day's view: show all hours starting from 00
                        timeDisplay = hourFormat;
                    }
                    
                    const hrAvg = hour.heart_rate?.avg;
                    const o2Avg = hour.oxygen_saturation?.avg;
                    
                    return {
                        time: timeDisplay,
                        avgHR: (hrAvg != null && typeof hrAvg === 'number') ? hrAvg.toFixed(0) : 'N/A',
                        avgO2: (o2Avg != null && typeof o2Avg === 'number') ? o2Avg.toFixed(1) : 'N/A',
                        hasData: hour.data_points > 0
                    };
                });
                
                // Always render the full content
                contentDiv.innerHTML = `
                        <div class="history-stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                            <div class="history-stat-card history-stat-card-heartrate" style="background: linear-gradient(135deg, #ec4899, #db2777); border-radius: 12px; padding: 16px; color: white;">
                                <div class="history-stat-label" style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">Daily Avg Heart Rate</div>
                                <div id="historyAvgHR" class="history-stat-value" style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">${avgHR}</div>
                                <div class="history-stat-minmax" style="font-size: 11px; opacity: 0.8;">Min: <span id="historyMinHR" class="history-stat-min">${minHR}</span> | Max: <span id="historyMaxHR" class="history-stat-max">${maxHR}</span></div>
                            </div>
                            
                            <div class="history-stat-card history-stat-card-oxygen" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; padding: 16px; color: white;">
                                <div class="history-stat-label" style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">Daily Avg Oxygen Level</div>
                                <div id="historyAvgO2" class="history-stat-value" style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">${avgO2}%</div>
                                <div class="history-stat-minmax" style="font-size: 11px; opacity: 0.8;">Min: <span id="historyMinO2" class="history-stat-min">${minO2}</span>% | Max: <span id="historyMaxO2" class="history-stat-max">${maxO2}</span>%</div>
                            </div>
                        </div>
                        
                        <div class="history-charts-section">
                            <h3 class="history-charts-title">Daily Charts</h3>
                            <div class="history-chart-container">
                                <canvas id="hrChart" class="history-chart"></canvas>
                            </div>
                            <div class="history-chart-container">
                                <canvas id="o2Chart" class="history-chart"></canvas>
                            </div>
                        </div>
                        
                        <div class="history-hourly-section">
                            <h3 class="history-hourly-title">Hourly Averages (Past 24h)</h3>
                            <div id="historyHourlyContainer" class="history-hourly-container">
                            </div>
                        </div>
                    `;
                
                // Update individual values
                const updateElement = (id, value) => {
                    const elem = document.getElementById(id);
                    if (elem) elem.textContent = value;
                };
                
                updateElement('historyAvgHR', avgHR);
                updateElement('historyMinHR', minHR);
                updateElement('historyMaxHR', maxHR);
                updateElement('historyAvgO2', avgO2 + '%');
                updateElement('historyMinO2', minO2);
                updateElement('historyMaxO2', maxO2);
                
                // Update hourly averages
                const hourlyContainer = document.getElementById('historyHourlyContainer');
                if (hourlyContainer) {
                    hourlyContainer.innerHTML = hourlyAverages.map((hour, index) => `
                        <div class="history-hourly-card ${hour.hasData ? 'has-data' : 'no-data'}" data-hour-index="${index}">
                            <span class="history-hourly-time">${hour.time}</span>
                            <div class="history-hourly-values">
                                <div class="history-hourly-value"><strong>HR:</strong> ${hour.avgHR}</div>
                                <div class="history-hourly-value"><strong>O2:</strong> ${hour.avgO2}%</div>
                            </div>
                        </div>
                    `).join('');
                }
                
                // Load and render charts
                await loadAndRenderCharts(selectedDateStr);
            } catch (error) {
                console.error('Error loading history:', error);
                contentDiv.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">❌</div>
                        <h3 class="empty-state-title">Error Loading History</h3>
                        <p class="empty-state-message">${error.message}</p>
                    </div>
                `;
            }
        }
        
        // Render events list
        function renderEvents() {
            const eventList = document.getElementById('eventList');
            
            if (events.length === 0) {
                eventList.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">📭</div>
                        <h3>No events yet</h3>
                        <p>Start tracking your baby's activities</p>
                    </div>
                `;
                return;
            }
            
            eventList.innerHTML = events.map(event => {
                const date = new Date(event.time);
                const timeStr = date.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                
                const typeClass = event.type.toLowerCase();
                
                return `
                    <div class="event-item">
                        <div class="event-icon ${typeClass}">
                            ${event.icon}
                        </div>
                        <div class="event-details">
                            <div class="event-type">${event.type}</div>
                            <div class="event-time">${timeStr}</div>
                            ${event.notes ? `<div class="event-notes">${event.notes}</div>` : ''}
                        </div>
                        <div style="margin-left: auto; display: flex; gap: 8px;">
                            <button class="edit-btn" onclick="editEvent(${event.id})" style="background: var(--primary); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;">Edit</button>
                            <button class="delete-btn" onclick="deleteEvent(${event.id})" style="background: #ef4444; color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Render milestones grid with 6 boxes
        function renderMilestones() {
            const milestonesGrid = document.getElementById('milestonesGrid');
            const milestones = events.filter(event => event.type === 'Milestone');
            
            // Create 6 boxes
            const boxes = [];
            for (let i = 0; i < 6; i++) {
                if (i < milestones.length) {
                    const milestone = milestones[i];
                    const date = new Date(milestone.time);
                    const dateStr = date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    });
                    
                    boxes.push(`
                        <div class="milestone-box" onclick="editEvent(${milestone.id})">
                            <div class="milestone-icon">${milestone.icon}</div>
                            <div class="milestone-title">${milestone.notes || milestone.type}</div>
                            <div class="milestone-date">${dateStr}</div>
                        </div>
                    `);
                } else {
                    boxes.push(`
                        <div class="milestone-box empty" onclick="openModal(); document.getElementById('eventType').value = 'Milestone';">
                            <div class="milestone-icon">➕</div>
                            <div class="milestone-title">Add Milestone</div>
                        </div>
                    `);
                }
            }
            
            if (milestones.length === 0) {
                milestonesGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="icon">⭐</div>
                        <h3>No milestones yet</h3>
                        <p>Record your baby's special moments</p>
                    </div>
                `;
            } else {
                milestonesGrid.innerHTML = boxes.join('');
            }
        }

        // Edit event function
        function editEvent(eventId) {
            const event = events.find(e => e.id == eventId);
            if (!event) {
                showToast('Event not found');
                return;
            }
            
            // Populate the form with event data
            document.getElementById('eventType').value = event.type;
            // Convert UTC time to local time for datetime-local input
            const eventDate = new Date(event.time);
            eventDate.setMinutes(eventDate.getMinutes() - eventDate.getTimezoneOffset());
            document.getElementById('eventTime').value = eventDate.toISOString().slice(0, 16);
            document.getElementById('eventNotes').value = event.notes || '';
            
            // Store the event ID for updating
            document.getElementById('eventForm').dataset.editingId = eventId;
            
            // Change modal title and button text
            document.querySelector('#eventModal .modal-header h2').textContent = 'Edit Event';
            document.querySelector('#eventModal .btn-primary').textContent = 'Update Event';
            
            // Open the modal
            document.getElementById('eventModal').classList.add('active');
        }

        // Show toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }

        // Prevent zoom and scroll
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
        });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
        });
        
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        
        // Prevent pull-to-refresh on iOS
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        // Swipe to go back gesture
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', function(e) {
            // Only track swipe if a view is active
            const eventsView = document.getElementById('eventsView');
            const milestonesView = document.getElementById('milestonesView');
            const dayTimelineView = document.getElementById('dayTimelineView');
            
            const isViewActive = (eventsView && eventsView.classList.contains('active')) ||
                                 (milestonesView && milestonesView.classList.contains('active')) ||
                                 (dayTimelineView && dayTimelineView.classList.contains('active'));
            
            if (isViewActive && e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, false);

        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            
            const horizontalDistance = touchEndX - touchStartX;
            const verticalDistance = Math.abs(touchEndY - touchStartY);
            
            // Threshold for swipe detection: 100px horizontal movement with less vertical movement
            if (horizontalDistance > 100 && verticalDistance < 50) {
                const eventsView = document.getElementById('eventsView');
                const milestonesView = document.getElementById('milestonesView');
                const dayTimelineView = document.getElementById('dayTimelineView');
                
                // Right-to-left swipe (positive X movement)
                if (eventsView && eventsView.classList.contains('active')) {
                    e.preventDefault();
                    closeEventsView();
                } else if (milestonesView && milestonesView.classList.contains('active')) {
                    e.preventDefault();
                    closeMilestonesView();
                } else if (dayTimelineView && dayTimelineView.classList.contains('active')) {
                    e.preventDefault();
                    closeDayTimelineView();
                }
            }
        }, false);

        // Day Timeline Functions
        function openDayTimelineView() {
            loadEvents();
            currentTimelineDate = new Date(); // Start with today
            document.getElementById('dayTimelineView').classList.add('active');
            document.getElementById('gridContainer').classList.add('hidden');
            updateTimelineDate();
            renderTimeline();
        }

        function closeDayTimelineView() {
            document.getElementById('dayTimelineView').classList.remove('active');
            document.getElementById('gridContainer').classList.remove('hidden');
        }

        function navigateDate(direction) {
            currentTimelineDate.setDate(currentTimelineDate.getDate() + direction);
            updateTimelineDate();
            renderTimeline();
        }

        function updateTimelineDate() {
            const today = new Date();
            const isToday = currentTimelineDate.toDateString() === today.toDateString();
            const dateStr = isToday ? 'Today' : currentTimelineDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: currentTimelineDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
            });
            document.getElementById('currentDate').textContent = dateStr;
        }

        function renderTimeline() {
            const timeline = document.getElementById('timeline');
            const legend = document.getElementById('timelineLegend');
            const dayStart = new Date(currentTimelineDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentTimelineDate);
            dayEnd.setHours(23, 59, 59, 999);

            // Filter events for the current day
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.time);
                return eventDate >= dayStart && eventDate <= dayEnd;
            });

            if (dayEvents.length === 0) {
                timeline.innerHTML = `
                    <div class="no-events-timeline">
                        <div class="icon">📅</div>
                        <h3>No events for this day</h3>
                        <p>Add events to see them on the timeline</p>
                    </div>
                `;
                legend.classList.remove('show');
                document.getElementById('dailyStats').classList.remove('show');
                renderDayEventList([]);
                return;
            }

            // Show legend and stats
            legend.classList.add('show');
            document.getElementById('dailyStats').classList.add('show');

            // Create horizontal timeline structure
            let timelineHTML = '<div class="timeline-horizontal">';
            
            // Hour labels (every 4 hours)
            timelineHTML += '<div class="timeline-hours-container">';
            for (let hour = 0; hour <= 23; hour++) {
                const hourStr = hour % 4 === 0 ? hour.toString().padStart(2, '0') : '';
                timelineHTML += `<div class="hour-tick">${hourStr}</div>`;
            }
            timelineHTML += '</div>';
            
            // Timeline track
            timelineHTML += '<div class="timeline-track" id="timelineTrack">';
            timelineHTML += '</div>';
            timelineHTML += '</div>';
            
            timeline.innerHTML = timelineHTML;

            // Process and render events
            const processedEvents = processEventsForTimeline(dayEvents);
            renderHorizontalEventBlocks(processedEvents);
            
            // Timeline track no longer has general click handler - only events are clickable
            
            // Calculate and display daily stats
            calculateDailyStats(processedEvents, dayEvents);
            renderDayEventList(dayEvents);
        }

        function processEventsForTimeline(dayEvents) {
            const processed = [];
            const used = new Set();

            // Sort events by time to ensure proper chronological order
            const sortedEvents = [...dayEvents].sort((a, b) => new Date(a.time) - new Date(b.time));

            // First, process paired events (start/end pairs)
            sortedEvents.forEach((event, index) => {
                if (used.has(event.id)) return;

                if (event.type.includes('Start')) {
                    const baseType = event.type.replace(' Start', '');
                    const endType = baseType + ' End';
                    
                    // Find corresponding end event (should come after this start event)
                    const endEvent = sortedEvents.find((e, i) => 
                        i > index && 
                        e.type === endType && 
                        !used.has(e.id) &&
                        new Date(e.time) > new Date(event.time)
                    );

                    if (endEvent) {
                        // Paired event - create duration block
                        used.add(event.id);
                        used.add(endEvent.id);
                        
                        processed.push({
                            type: 'duration',
                            category: baseType.toLowerCase(),
                            startTime: new Date(event.time),
                            endTime: new Date(endEvent.time),
                            icon: event.icon,
                            title: baseType,
                            notes: event.notes || endEvent.notes
                        });
                    } else {
                        // Unpaired start event
                        processed.push({
                            type: 'instant',
                            category: baseType.toLowerCase(),
                            time: new Date(event.time),
                            icon: event.icon,
                            title: event.type,
                            notes: event.notes
                        });
                        used.add(event.id);
                    }
                } else if (event.type.includes('End')) {
                    // Check if this end event is already paired
                    if (!used.has(event.id)) {
                        // Unpaired end event
                        const baseType = event.type.replace(' End', '');
                        processed.push({
                            type: 'instant',
                            category: baseType.toLowerCase(),
                            time: new Date(event.time),
                            icon: event.icon,
                            title: event.type,
                            notes: event.notes
                        });
                        used.add(event.id);
                    }
                } else {
                    // Single events (Diaper, Medicine, etc.)
                    processed.push({
                        type: 'instant',
                        category: getCategoryFromType(event.type),
                        time: new Date(event.time),
                        icon: event.icon,
                        title: event.type,
                        notes: event.notes
                    });
                    used.add(event.id);
                }
            });

            return processed.sort((a, b) => {
                const timeA = a.type === 'duration' ? a.startTime : a.time;
                const timeB = b.type === 'duration' ? b.startTime : b.time;
                return timeA - timeB;
            });
        }

        function getCategoryFromType(type) {
            if (type.toLowerCase().includes('feed')) return 'feed';
            if (type.toLowerCase().includes('sleep')) return 'sleep';
            if (type.toLowerCase().includes('diaper')) return 'diaper';
            if (type.toLowerCase().includes('milestone')) return 'milestone';
            return 'other';
        }

        function renderHorizontalEventBlocks(processedEvents) {
            const timelineTrack = document.getElementById('timelineTrack');
            
            // Clear existing content
            timelineTrack.innerHTML = '';
            
            console.log('Rendering events:', processedEvents); // Debug log
            
            processedEvents.forEach((event, index) => {
                if (event.type === 'duration') {
                    // Create colored section for duration events
                    const coloredSection = document.createElement('div');
                    coloredSection.className = `timeline-colored-section ${event.category}`;
                    
                    const startPercent = getTimePercentage(event.startTime);
                    const endPercent = getTimePercentage(event.endTime);
                    const width = endPercent - startPercent;
                    
                    coloredSection.style.left = `${startPercent}%`;
                    coloredSection.style.width = `${width}%`;
                    
                    console.log(`Adding ${event.category} colored section:`, {
                        start: startPercent,
                        width: width,
                        startTime: event.startTime,
                        endTime: event.endTime
                    }); // Debug log
                    
                    // Add tooltip
                    const startTimeStr = event.startTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const endTimeStr = event.endTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    coloredSection.title = `${event.title}: ${startTimeStr} - ${endTimeStr}${event.notes ? '\n' + event.notes : ''}`;
                    
                    timelineTrack.appendChild(coloredSection);
                    
                    // Create start marker
                    const startMarker = document.createElement('div');
                    startMarker.className = 'event-marker';
                    startMarker.style.left = `${startPercent}%`;
                    
                    const startIcon = document.createElement('div');
                    startIcon.className = 'event-marker-icon';
                    startIcon.innerHTML = event.icon;
                    startIcon.title = `${event.title} Start - ${startTimeStr}${event.notes ? '\n' + event.notes : ''}`;
                    startIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showEventInfo(`${event.title} Start`, startTimeStr, e.clientX, e.clientY);
                    });
                    startMarker.appendChild(startIcon);
                    timelineTrack.appendChild(startMarker);
                    
                    // Create end marker
                    const endMarker = document.createElement('div');
                    endMarker.className = 'event-marker';
                    endMarker.style.left = `${endPercent}%`;
                    
                    const endIcon = document.createElement('div');
                    endIcon.className = 'event-marker-icon';
                    endIcon.innerHTML = event.icon;
                    endIcon.title = `${event.title} End - ${endTimeStr}${event.notes ? '\n' + event.notes : ''}`;
                    endIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showEventInfo(`${event.title} End`, endTimeStr, e.clientX, e.clientY);
                    });
                    endMarker.appendChild(endIcon);
                    timelineTrack.appendChild(endMarker);
                    
                } else {
                    // Create instant event marker
                    const instantMarker = document.createElement('div');
                    instantMarker.className = 'instant-event-marker';
                    
                    const timePercent = getTimePercentage(event.time);
                    instantMarker.style.left = `${timePercent}%`;
                    
                    const timeStr = event.time.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    
                    const instantIcon = document.createElement('div');
                    instantIcon.className = 'event-marker-icon';
                    instantIcon.innerHTML = event.icon;
                    instantIcon.title = `${event.title} - ${timeStr}${event.notes ? '\n' + event.notes : ''}`;
                    instantIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        showEventInfo(event.title, timeStr, e.clientX, e.clientY);
                    });
                    
                    instantMarker.appendChild(instantIcon);
                    timelineTrack.appendChild(instantMarker);
                }
            });
        }

        function getTimePercentage(date) {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();
            const totalSeconds = hours * 3600 + minutes * 60 + seconds + (milliseconds / 1000);
            return (totalSeconds / (24 * 3600)) * 100;
        }


        function showEventInfo(eventType, timeStr, x, y) {
            // Update popup content with simple event information
            document.getElementById('clickedTime').textContent = timeStr;
            const eventsContainer = document.getElementById('clickedEvents');
            
            // Get the icon from the event type
            const iconMap = {
                'Feed Start': '🍼', 'Feed End': '🍼', 'Feed': '🍼',
                'Sleep Start': '😴', 'Sleep End': '😴', 'Sleep': '😴',
                'Diaper': '🩱', 'Medicine': '💊', 'Bath': '🛁',
                'Doctor': '👨‍⚕️', 'Milestone': '⭐', 'Other': '📝'
            };
            
            const baseType = eventType.replace(' Start', '').replace(' End', '');
            const icon = iconMap[eventType] || iconMap[baseType] || '📝';
            
            eventsContainer.innerHTML = `
                <div class="event-item">
                    <span>${icon}</span>
                    <span>${eventType}</span>
                </div>
            `;
            
            // Position and show popup with better positioning
            const popup = document.getElementById('timelineClickInfo');
            popup.style.left = `${Math.max(10, Math.min(x - 90, window.innerWidth - 200))}px`;
            popup.style.top = `${y - 12}px`;
            popup.classList.add('show');
            
            // Hide popup after 2.5 seconds
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2500);
        }


        function calculateDailyStats(processedEvents, dayEvents) {
            let totalSleepMinutes = 0;
            let totalFeedMinutes = 0;
            let diaperCount = 0;
            let totalEvents = dayEvents.length;

            // Calculate duration stats from processed events
            processedEvents.forEach(event => {
                if (event.type === 'duration') {
                    const durationMs = event.endTime - event.startTime;
                    const durationMinutes = Math.round(durationMs / (1000 * 60));
                    
                    if (event.category === 'sleep') {
                        totalSleepMinutes += durationMinutes;
                    } else if (event.category === 'feed') {
                        totalFeedMinutes += durationMinutes;
                    }
                } else {
                    // Count instant events
                    if (event.category === 'diaper') {
                        diaperCount++;
                    }
                }
            });

            // Format durations
            const formatDuration = (totalMinutes) => {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                if (hours === 0) {
                    return `${minutes}m`;
                } else if (minutes === 0) {
                    return `${hours}h`;
                } else {
                    return `${hours}h ${minutes}m`;
                }
            };

            // Update UI
            document.getElementById('sleepDuration').textContent = formatDuration(totalSleepMinutes);
            document.getElementById('feedDuration').textContent = formatDuration(totalFeedMinutes);
            document.getElementById('diaperCount').textContent = diaperCount.toString();
            document.getElementById('totalEvents').textContent = totalEvents.toString();
        }

        // Render list of events for the selected day with edit buttons
        function renderDayEventList(dayEvents) {
            const list = document.getElementById('dayEventList');
            if (!list) return;

            if (!dayEvents || dayEvents.length === 0) {
                list.innerHTML = `
                    <div class="empty-state">
                        <div class="icon">📭</div>
                        <h3>No events for this day</h3>
                        <p>Add events to see them here</p>
                    </div>
                `;
                return;
            }

            // Precompute duration since last Feed Start for each Feed End (within the same day)
            // and interval since last Feed End for each Feed Start (within the same day)
            const feedEndToDuration = new Map();
            const feedStartToInterval = new Map();
            const asc = [...dayEvents].sort((a, b) => new Date(a.time) - new Date(b.time));
            let lastFeedStartTime = null;
            let lastFeedEndTime = null;
            asc.forEach(ev => {
                const evDate = new Date(ev.time);
                if (ev.type === 'Feed Start') {
                    if (lastFeedEndTime) {
                        const diffMs = evDate - lastFeedEndTime;
                        if (diffMs > 0) {
                            const totalMinutes = Math.floor(diffMs / (1000 * 60));
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;
                            let intervalStr = '';
                            if (hours > 0 && minutes > 0) {
                                intervalStr = `${hours}h ${minutes}m`;
                            } else if (hours > 0) {
                                intervalStr = `${hours}h`;
                            } else {
                                intervalStr = `${minutes}m`;
                            }
                            feedStartToInterval.set(ev.id, intervalStr);
                        }
                    }
                    lastFeedStartTime = evDate;
                } else if (ev.type === 'Feed End') {
                    if (lastFeedStartTime) {
                        const diffMs = evDate - lastFeedStartTime;
                        if (diffMs > 0) {
                            const totalMinutes = Math.floor(diffMs / (1000 * 60));
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;
                            let durationStr = '';
                            if (hours > 0 && minutes > 0) {
                                durationStr = `${hours}h ${minutes}m`;
                            } else if (hours > 0) {
                                durationStr = `${hours}h`;
                            } else {
                                durationStr = `${minutes}m`;
                            }
                            feedEndToDuration.set(ev.id, durationStr);
                        }
                    }
                    lastFeedEndTime = evDate;
                }
            });

            // Sort by time descending (latest first)
            const sorted = [...dayEvents].sort((a, b) => new Date(b.time) - new Date(a.time));

            list.innerHTML = sorted.map(event => {
                const date = new Date(event.time);
                const timeStr = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                const typeClass = event.type.toLowerCase();
                let intervalText = '';
                if (event.type === 'Feed End') {
                    const durationSinceFeedStart = feedEndToDuration.get(event.id);
                    if (durationSinceFeedStart) {
                        intervalText = ` • ${durationSinceFeedStart}`;
                    }
                }
                return `
                    <div class="event-item">
                        <div class="event-icon ${typeClass}">${event.icon}</div>
                        <div class="event-details">
                            <div class="event-type">${event.type}</div>
                            <div class="event-time">${timeStr}${intervalText}</div>
                            ${event.notes ? `<div class=\"event-notes\">${event.notes}</div>` : ''}
                        </div>
                        <div style=\"margin-left: auto; display: flex; gap: 8px;\">
                            <button class=\"edit-btn\" onclick=\"editEvent(${event.id})\" style=\"background: var(--primary); color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;\">Edit</button>
                            <button class=\"delete-btn\" onclick=\"deleteEvent(${event.id})\" style=\"background: #ef4444; color: white; border: none; border-radius: 8px; padding: 8px 12px; font-size: 12px; cursor: pointer;\">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Delete event
        function deleteEvent(eventId) {
            if (!confirm('Delete this event?')) return;
            fetch(`events.php?v=${APP_VERSION}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId })
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete');
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showToast('Event deleted');
                    loadEvents();
                } else {
                    throw new Error(data.error || 'Failed to delete');
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Failed to delete event');
            });
        }

        // Hide timeline info when clicking elsewhere
        document.addEventListener('click', function(event) {
            const popup = document.getElementById('timelineClickInfo');
            const timelineTrack = document.getElementById('timelineTrack');
            
            if (popup && !popup.contains(event.target) && event.target !== timelineTrack) {
                popup.classList.remove('show');
            }
        });

        // Initialize
        setDefaultTime();
        loadEvents();
