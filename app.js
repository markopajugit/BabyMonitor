        // App version - increment this when you update files to force cache refresh
        const APP_VERSION = '1.7.1';

        const ICONS = {
            'Feed': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v5h-6zM9 7v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7H9z"/></svg>',
            'Feed Start': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v5h-6zM9 7v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7H9z"/><line x1="12" y1="11" x2="12" y2="16"/></svg>',
            'Feed End': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6v5h-6zM9 7v14a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V7H9z"/><path d="m16 16-4-4-4 4"/></svg>',
            'Sleep': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
            'Sleep Start': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>',
            'Sleep End': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
            'Diaper': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h20"/><path d="M4.5 12v6a3.5 3.5 0 0 0 7 0"/><path d="M12.5 18a3.5 3.5 0 0 0 7 0v-6"/></svg>',
            'Medicine': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h8"/><path d="M12 4v16"/><rect width="16" height="16" x="4" y="4" rx="2"/></svg>',
            'Bath': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12A5 5 0 1 1 19 12"/><path d="M3 16v-2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M4 16h16"/><path d="M4 16v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/></svg>',
            'Doctor': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>',
            'Milestone': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
            'Other': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
            'default': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>'
        };
        
        // Image icons for timeline view (inverted to white)
        const IMAGES = {
            'Feed Start': '<img src="4292048.png" alt="Feed Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Feed End': '<img src="4292048.png" alt="Feed Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Feed': '<img src="4292048.png" alt="Feed Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Sleep Start': '<img src="263806.png" alt="Sleep Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Sleep End': '<img src="263806.png" alt="Sleep Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Sleep': '<img src="263806.png" alt="Sleep Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Diaper': '<img src="134996.png" alt="Diaper Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Medicine': '<img src="134996.png" alt="Medicine Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Bath': '<img src="134996.png" alt="Bath Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Doctor': '<img src="134996.png" alt="Doctor Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Milestone': '<img src="263806.png" alt="Milestone Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'Other': '<img src="134996.png" alt="Other Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">',
            'default': '<img src="134996.png" alt="Event Icon" width="24" height="24" style="filter: invert(1) brightness(1.2);">'
        };
        
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
        function quickEvent(type, iconKey) {
            // iconKey is now the key in ICONS, e.g. 'Feed Start'
            const iconSvg = ICONS[iconKey] || ICONS['default'];
            
            const event = {
                id: Date.now(),
                type: type,
                icon: iconSvg,
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
                    showToast(`<span style="display:inline-flex;vertical-align:middle;margin-right:8px;width:20px;height:20px">${iconSvg}</span> ${type} recorded!`);
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
            
            const iconSvg = ICONS[type] || ICONS['default'];
            
            const event = {
                id: editingId ? parseInt(editingId) : Date.now(),
                type: type,
                icon: iconSvg,
                time: new Date(time).toISOString(),
                notes: notes
            };
            
            saveEvent(event).then(success => {
                if (success) {
                    closeModal();
                    const action = editingId ? 'updated' : 'recorded';
                    showToast(`<span style="display:inline-flex;vertical-align:middle;margin-right:8px;width:20px;height:20px">${iconSvg}</span> ${type} ${action}!`);
                    
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
                    
                    // Ensure all events have icons assigned
                    events = events.map(event => {
                        if (!event.icon) {
                            event.icon = ICONS[event.type] || ICONS['default'];
                        }
                        return event;
                    });
                    
                    if (document.getElementById('eventsView').classList.contains('active')) {
                        renderEvents();
                    }
                    if (document.getElementById('dayTimelineView').classList.contains('active')) {
                        renderTimeline();
                    }
                    // Check feed status when events are loaded
                    checkActiveFeed();
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
                if (e.touches.length === 1) {
                    owletTouchStartX = e.touches[0].clientX;
                    owletTouchStartY = e.touches[0].clientY;
                }
            }, false);
            
            view.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 0) return;
                
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const diffX = touchEndX - owletTouchStartX;
                const diffY = touchEndY - owletTouchStartY;
                
                // Swipe to go back: right swipe with minimal vertical movement
                if (diffX > 100 && Math.abs(diffY) < 50) {
                    e.preventDefault();
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
                
                // Validate O2 average is between 0 and 100
                const isO2AverageInvalid = latest_reading.oxygen_10_av !== null && latest_reading.oxygen_10_av !== undefined 
                    && (latest_reading.oxygen_10_av < 0 || latest_reading.oxygen_10_av > 100);
                
                // Validate skin temperature is between 30 and 40°C (reasonable range for body temperature)
                const isTempInvalid = latest_reading.skin_temperature !== null && latest_reading.skin_temperature !== undefined 
                    && (latest_reading.skin_temperature < 30 || latest_reading.skin_temperature > 40);
                
                // Validate movement is between 0 and 146
                const isMovementInvalid = latest_reading.movement !== null && latest_reading.movement !== undefined 
                    && (latest_reading.movement < 0 || latest_reading.movement > 146);
                
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
                                
                                <div class="owlet-vital-card" style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div class="owlet-vital-label" style="font-size: 12px; color: #64748b; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                                        <span>Skin Temperature</span>
                                        <span id="tempInvalidIcon" style="cursor: pointer; font-size: 16px; color: #ef4444;">?</span>
                                    </div>
                                    <div id="owletTempValue" class="owlet-vital-value" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${tempDisplay}
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                <div class="owlet-vital-card" style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div class="owlet-vital-label" style="font-size: 12px; color: #64748b; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                                        <span>Movement</span>
                                        <span id="movementInvalidIcon" style="cursor: pointer; font-size: 16px; color: #ef4444;">?</span>
                                    </div>
                                    <div id="owletMovementValue" class="owlet-vital-value" style="font-size: 20px; font-weight: 600; color: #1e293b;">
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
                                <div class="owlet-vital-card" style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div class="owlet-vital-label" style="font-size: 12px; color: #64748b; margin-bottom: 4px;">O2 Average (10m) ${isO2AverageInvalid ? '<span id="o2AvgInvalidIcon" style="cursor: pointer; font-size: 16px; color: #ef4444; margin-left: 6px;">?</span>' : ''}</div>
                                    <div id="owletO2AvgValue" class="owlet-vital-value" style="font-size: 20px; font-weight: 600; color: #1e293b;">
                                        ${o2AverageDisplay}
                                    </div>
                                </div>
                                
                                <div class="owlet-vital-card" style="background: #f8fafc; border-radius: 8px; padding: 12px;">
                                    <div class="owlet-vital-label" style="font-size: 12px; color: #64748b; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                                        <span>Sleep Status</span>
                                        <span id="sleepStatusIcon" style="cursor: pointer; font-size: 16px; color: #ef4444;">?</span>
                                    </div>
                                    <div id="owletSleepValue" class="owlet-vital-value" style="font-size: 16px; font-weight: 600; color: #1e293b;">
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
                
                const updateElementPreserveIcons = (id, value) => {
                    const elem = document.getElementById(id);
                    if (elem) {
                        // Only update the first text node, preserving child elements (icons)
                        if (elem.firstChild && elem.firstChild.nodeType === Node.TEXT_NODE) {
                            elem.firstChild.textContent = value;
                        } else if (elem.firstChild) {
                            // If first child is not text, insert text before it
                            elem.insertBefore(document.createTextNode(value), elem.firstChild);
                        } else {
                            elem.textContent = value;
                        }
                    }
                };
                
                const positionTooltipWithBounds = (tooltip, triggerElement) => {
                    const rect = triggerElement.getBoundingClientRect();
                    const padding = 8;
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    
                    // Calculate position above the icon
                    let left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
                    let top = rect.top - tooltip.offsetHeight - padding;
                    
                    // Check left boundary
                    if (left < padding) {
                        left = padding;
                    }
                    // Check right boundary
                    if (left + tooltip.offsetWidth > viewportWidth - padding) {
                        left = viewportWidth - tooltip.offsetWidth - padding;
                    }
                    
                    // Check top boundary - if tooltip goes off screen, position it below instead
                    if (top < padding) {
                        top = rect.bottom + padding;
                    }
                    // Check bottom boundary
                    if (top + tooltip.offsetHeight > viewportHeight - padding) {
                        top = viewportHeight - tooltip.offsetHeight - padding;
                    }
                    
                    tooltip.style.left = left + 'px';
                    tooltip.style.top = top + 'px';
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
                updateElement('owletTempValue', tempDisplay);
                updateElement('owletMovementValue', movementDisplay);
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
                
                // Add click handler for O2 Average invalid icon
                const o2AvgInvalidIcon = document.getElementById('o2AvgInvalidIcon');
                if (o2AvgInvalidIcon) {
                    o2AvgInvalidIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove existing tooltip if any
                        const existingTooltip = document.getElementById('o2TooltipPopover');
                        if (existingTooltip) {
                            existingTooltip.remove();
                        }
                        
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        tooltip.id = 'o2TooltipPopover';
                        tooltip.style.cssText = `
                            position: fixed;
                            background: #1e293b;
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 12px;
                            z-index: 10000;
                            pointer-events: auto;
                            white-space: nowrap;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        `;
                        tooltip.textContent = 'owlet api saadab mingit paska';
                        document.body.appendChild(tooltip);
                        
                        // Position tooltip with viewport boundary checking
                        tooltip.style.transition = 'opacity 5s ease-out';
                        positionTooltipWithBounds(tooltip, o2AvgInvalidIcon);
                        
                        // Remove tooltip on click elsewhere
                        const closeTooltip = () => {
                            if (document.getElementById('o2TooltipPopover')) {
                                document.getElementById('o2TooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                            clearTimeout(autoCloseTimer);
                            clearTimeout(fadeOutTimer);
                        };
                        document.addEventListener('click', closeTooltip);
                        
                        // Start fade out after 5 seconds
                        const fadeOutTimer = setTimeout(() => {
                            if (document.getElementById('o2TooltipPopover')) {
                                document.getElementById('o2TooltipPopover').style.opacity = '0';
                            }
                        }, 5000);
                        
                        // Remove tooltip after fade completes (5 more seconds)
                        const autoCloseTimer = setTimeout(() => {
                            if (document.getElementById('o2TooltipPopover')) {
                                document.getElementById('o2TooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                        }, 10000);
                    });
                }
                
                // Add click handler for Temperature invalid icon
                const tempInvalidIcon = document.getElementById('tempInvalidIcon');
                if (tempInvalidIcon) {
                    tempInvalidIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove existing tooltip if any
                        const existingTooltip = document.getElementById('tempTooltipPopover');
                        if (existingTooltip) {
                            existingTooltip.remove();
                        }
                        
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        tooltip.id = 'tempTooltipPopover';
                        tooltip.style.cssText = `
                            position: fixed;
                            background: #1e293b;
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 12px;
                            z-index: 10000;
                            pointer-events: auto;
                            white-space: normal;
                            max-width: 200px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        `;
                        tooltip.textContent = 'see tundub täiega off - probably miks seda official appis pole :D';
                        document.body.appendChild(tooltip);
                        
                        // Position tooltip with viewport boundary checking
                        tooltip.style.transition = 'opacity 5s ease-out';
                        positionTooltipWithBounds(tooltip, tempInvalidIcon);
                        
                        // Remove tooltip on click elsewhere
                        const closeTooltip = () => {
                            if (document.getElementById('tempTooltipPopover')) {
                                document.getElementById('tempTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                            clearTimeout(autoCloseTimer);
                            clearTimeout(fadeOutTimer);
                        };
                        document.addEventListener('click', closeTooltip);
                        
                        // Start fade out after 5 seconds
                        const fadeOutTimer = setTimeout(() => {
                            if (document.getElementById('tempTooltipPopover')) {
                                document.getElementById('tempTooltipPopover').style.opacity = '0';
                            }
                        }, 5000);
                        
                        // Remove tooltip after fade completes (5 more seconds)
                        const autoCloseTimer = setTimeout(() => {
                            if (document.getElementById('tempTooltipPopover')) {
                                document.getElementById('tempTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                        }, 10000);
                    });
                }
                
                // Add click handler for Sleep Status icon
                const sleepStatusIcon = document.getElementById('sleepStatusIcon');
                if (sleepStatusIcon) {
                    sleepStatusIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove existing tooltip if any
                        const existingTooltip = document.getElementById('sleepTooltipPopover');
                        if (existingTooltip) {
                            existingTooltip.remove();
                        }
                        
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        tooltip.id = 'sleepTooltipPopover';
                        tooltip.style.cssText = `
                            position: fixed;
                            background: #1e293b;
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 12px;
                            z-index: 10000;
                            pointer-events: auto;
                            white-space: normal;
                            max-width: 200px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        `;
                        tooltip.textContent = 'see tundub täiega umbes owleti enda mingi sita algo järgi';
                        document.body.appendChild(tooltip);
                        
                        // Position tooltip with viewport boundary checking
                        tooltip.style.transition = 'opacity 5s ease-out';
                        positionTooltipWithBounds(tooltip, sleepStatusIcon);
                        
                        // Remove tooltip on click elsewhere
                        const closeTooltip = () => {
                            if (document.getElementById('sleepTooltipPopover')) {
                                document.getElementById('sleepTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                            clearTimeout(autoCloseTimer);
                            clearTimeout(fadeOutTimer);
                        };
                        document.addEventListener('click', closeTooltip);
                        
                        // Start fade out after 5 seconds
                        const fadeOutTimer = setTimeout(() => {
                            if (document.getElementById('sleepTooltipPopover')) {
                                document.getElementById('sleepTooltipPopover').style.opacity = '0';
                            }
                        }, 3000);
                        
                        // Remove tooltip after fade completes (5 more seconds)
                        const autoCloseTimer = setTimeout(() => {
                            if (document.getElementById('sleepTooltipPopover')) {
                                document.getElementById('sleepTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                        }, 10000);
                    });
                }
                
                // Add click handler for Movement invalid icon
                const movementInvalidIcon = document.getElementById('movementInvalidIcon');
                if (movementInvalidIcon) {
                    movementInvalidIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        // Remove existing tooltip if any
                        const existingTooltip = document.getElementById('movementTooltipPopover');
                        if (existingTooltip) {
                            existingTooltip.remove();
                        }
                        
                        // Create tooltip
                        const tooltip = document.createElement('div');
                        tooltip.id = 'movementTooltipPopover';
                        tooltip.style.cssText = `
                            position: fixed;
                            background: #1e293b;
                            color: white;
                            padding: 8px 12px;
                            border-radius: 6px;
                            font-size: 12px;
                            z-index: 10000;
                            pointer-events: auto;
                            white-space: normal;
                            max-width: 200px;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                        `;
                        tooltip.textContent = '0-146? pole rohkem kätte saand:D jälle mingi owleti api lambinumber';
                        document.body.appendChild(tooltip);
                        
                        // Position tooltip with viewport boundary checking
                        tooltip.style.transition = 'opacity 5s ease-out';
                        positionTooltipWithBounds(tooltip, movementInvalidIcon);
                        
                        // Remove tooltip on click elsewhere
                        const closeTooltip = () => {
                            if (document.getElementById('movementTooltipPopover')) {
                                document.getElementById('movementTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                            clearTimeout(autoCloseTimer);
                            clearTimeout(fadeOutTimer);
                        };
                        document.addEventListener('click', closeTooltip);
                        
                        // Start fade out after 5 seconds
                        const fadeOutTimer = setTimeout(() => {
                            if (document.getElementById('movementTooltipPopover')) {
                                document.getElementById('movementTooltipPopover').style.opacity = '0';
                            }
                        }, 5000);
                        
                        // Remove tooltip after fade completes (5 more seconds)
                        const autoCloseTimer = setTimeout(() => {
                            if (document.getElementById('movementTooltipPopover')) {
                                document.getElementById('movementTooltipPopover').remove();
                            }
                            document.removeEventListener('click', closeTooltip);
                        }, 10000);
                    });
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
                if (e.touches.length === 1) {
                    historyTouchStartX = e.touches[0].clientX;
                    historyTouchStartY = e.touches[0].clientY;
                }
            }, false);
            
            view.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 0) return;
                
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                
                const diffX = touchEndX - historyTouchStartX;
                const diffY = touchEndY - historyTouchStartY;
                
                // Swipe to go back: right swipe with minimal vertical movement
                if (diffX > 100 && Math.abs(diffY) < 50) {
                    e.preventDefault();
                    closeOwletHistoryView();
                }
            }, false);
        }
        
        // Chart instances storage
        let hrChartInstance = null;
        let o2ChartInstance = null;
        let combinedChartInstance = null;
        let timelineChartInstance = null;
        
        async function loadAndRenderCharts(dateStr) {
            try {
                // Destroy existing charts first
                if (hrChartInstance) {
                    hrChartInstance.destroy();
                    hrChartInstance = null;
                }
                if (o2ChartInstance) {
                    o2ChartInstance.destroy();
                    o2ChartInstance = null;
                }
                
                // Fetch minute-by-minute data for the selected date
                const response = await fetch(`events.php?minutes=true&date=${dateStr}`);
                if (!response.ok) {
                    console.warn('Failed to fetch minute data for charts');
                    showChartError('hrChart', 'Failed to load chart data');
                    showChartError('o2Chart', 'Failed to load chart data');
                    return;
                }
                
                const data = await response.json();
                
                // Check for error response
                if (data.error) {
                    console.warn('Chart data error:', data.error);
                    showChartError('hrChart', data.error);
                    showChartError('o2Chart', data.error);
                    return;
                }
                
                if (!data.minutes || data.minutes.length === 0) {
                    console.warn('No minute data available for charts');
                    showChartError('hrChart', 'No minute data available for this date');
                    showChartError('o2Chart', 'No minute data available for this date');
                    return;
                }
                
                // Process minute data for charts - create full 24h range
                const chartData = processMinuteDataForCharts(data.minutes, dateStr);
                
                // Render HR chart
                renderHRChart(chartData);
                
                // Render O2 chart
                renderO2Chart(chartData);
            } catch (error) {
                console.error('Error loading chart data:', error);
                showChartError('hrChart', 'Error loading chart data');
                showChartError('o2Chart', 'Error loading chart data');
            }
        }
        
        function showChartError(chartId, errorMessage) {
            let container = null;
            
            // Try to find container via canvas element first
            const canvas = document.getElementById(chartId);
            if (canvas && canvas.parentElement) {
                container = canvas.parentElement;
            } else {
                // If canvas doesn't exist, find container by position in charts section
                const containers = document.querySelectorAll('.history-chart-container');
                if (chartId === 'hrChart' && containers.length >= 1) {
                    container = containers[0];
                } else if (chartId === 'o2Chart' && containers.length >= 2) {
                    container = containers[1];
                } else if (chartId === 'combinedChart' && containers.length >= 3) {
                    container = containers[2];
                }
            }
            
            if (!container) return;
            
            // Clear the container and show error message
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #64748b; text-align: center; padding: 20px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
                    <div style="font-size: 14px; font-weight: 500; color: #475569; margin-bottom: 4px;">${errorMessage}</div>
                </div>
            `;
        }
        
        function processMinuteDataForCharts(minutes, dateStr) {
            const labels = [];
            const hrData = [];
            const o2Data = [];
            const timestamps = []; // Store full timestamps for tooltips
            
            // Create a map of existing data by minute index (0-1439 for 24 hours)
            const dataMap = new Map();
            minutes.forEach((minute) => {
                const timestamp = new Date(minute.timestamp);
                const hour = timestamp.getHours();
                const minuteOfHour = timestamp.getMinutes();
                const minuteIndex = hour * 60 + minuteOfHour; // 0-1439
                dataMap.set(minuteIndex, {
                    hr: minute.heart_rate_avg !== null && minute.heart_rate_avg !== undefined ? minute.heart_rate_avg : null,
                    o2: minute.oxygen_saturation_avg !== null && minute.oxygen_saturation_avg !== undefined ? minute.oxygen_saturation_avg : null,
                    timestamp: timestamp
                });
            });
            
            // Create full 24-hour range (1440 minutes)
            const baseDate = dateStr ? new Date(dateStr + 'T00:00:00') : new Date();
            baseDate.setHours(0, 0, 0, 0);
            
            for (let minuteIndex = 0; minuteIndex < 1440; minuteIndex++) {
                const hour = Math.floor(minuteIndex / 60);
                const minuteOfHour = minuteIndex % 60;
                
                // Create timestamp for this minute
                const timestamp = new Date(baseDate);
                timestamp.setHours(hour, minuteOfHour, 0, 0);
                
                // Format time label
                const timeLabel = `${String(hour).padStart(2, '0')}:${String(minuteOfHour).padStart(2, '0')}`;
                labels.push(timeLabel);
                timestamps.push(timestamp);
                
                // Get data from map or use 0 for missing data
                const dataPoint = dataMap.get(minuteIndex);
                if (dataPoint) {
                    hrData.push(dataPoint.hr !== null && dataPoint.hr !== undefined ? dataPoint.hr : 0);
                    o2Data.push(dataPoint.o2 !== null && dataPoint.o2 !== undefined ? dataPoint.o2 : 0);
                } else {
                    hrData.push(0);
                    o2Data.push(0);
                }
            }
            
            return { labels, hrData, o2Data, timestamps };
        }
        
        function renderHRChart(chartData) {
            let canvas = document.getElementById('hrChart');
            
            // If canvas doesn't exist (was replaced by error message), restore it
            if (!canvas) {
                // Find the container by looking for the one that should contain hrChart
                const containers = document.querySelectorAll('.history-chart-container');
                if (containers.length >= 1) {
                    containers[0].innerHTML = '<canvas id="hrChart" class="history-chart"></canvas>';
                    canvas = document.getElementById('hrChart');
                }
            }
            
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (hrChartInstance) {
                hrChartInstance.destroy();
            }
            
            // Store timestamps and labels for tooltip access
            const timestamps = chartData.timestamps;
            const labels = chartData.labels;
            
            // Pre-calculate all 24 full hours (00:00 to 23:00)
            const fullHours = [];
            if (timestamps.length > 0) {
                const baseDate = new Date(timestamps[0]);
                baseDate.setHours(0, 0, 0, 0);
                
                // Generate all 24 hours
                for (let hour = 0; hour < 24; hour++) {
                    const hourDate = new Date(baseDate);
                    hourDate.setHours(hour, 0, 0, 0);
                    fullHours.push(hourDate);
                }
            }
            
            const firstTimestamp = timestamps.length > 0 ? timestamps[0] : null;
            const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
            
            hrChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Heart Rate (bpm)',
                        data: chartData.hrData,
                        borderColor: '#ec4899',
                        backgroundColor: 'rgba(236, 72, 153, 0.1)',
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        spanGaps: false
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
                            },
                            callbacks: {
                                title: function(context) {
                                    const index = context[0].dataIndex;
                                    const timestamp = timestamps[index];
                                    if (timestamp) {
                                        const hours = String(timestamp.getHours()).padStart(2, '0');
                                        const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                                        return `${hours}:${minutes}`;
                                    }
                                    return context[0].label || '';
                                }
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
                                maxTicksLimit: 24,
                                callback: function(value, index, ticks) {
                                    if (timestamps.length === 0) {
                                        return '';
                                    }
                                    
                                    // Get the label value - value might be index or string
                                    let labelValue = '';
                                    if (typeof value === 'string') {
                                        labelValue = value;
                                    } else if (typeof value === 'number' && index >= 0 && index < labels.length) {
                                        labelValue = labels[index];
                                    } else if (value !== null && value !== undefined) {
                                        labelValue = String(value);
                                    } else {
                                        return '';
                                    }
                                    
                                    if (!labelValue || labelValue === '') {
                                        return '';
                                    }
                                    
                                    // Parse HH:MM from label value
                                    const timeMatch = labelValue.match(/(\d{2}):(\d{2})/);
                                    if (!timeMatch) {
                                        return '';
                                    }
                                    
                                    const labelMinutes = parseInt(timeMatch[2], 10);
                                    
                                    // Only show labels at full hours (minutes === 00)
                                    if (labelMinutes === 0) {
                                        const labelHours = parseInt(timeMatch[1], 10);
                                        return `${String(labelHours).padStart(2, '0')}:00`;
                                    }
                                    
                                    return '';
                                }
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: false
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
            let canvas = document.getElementById('o2Chart');
            
            // If canvas doesn't exist (was replaced by error message), restore it
            if (!canvas) {
                // Find the container by looking for the one that should contain o2Chart
                const containers = document.querySelectorAll('.history-chart-container');
                if (containers.length >= 2) {
                    containers[1].innerHTML = '<canvas id="o2Chart" class="history-chart"></canvas>';
                    canvas = document.getElementById('o2Chart');
                }
            }
            
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (o2ChartInstance) {
                o2ChartInstance.destroy();
            }
            
            // Store timestamps and labels for tooltip access
            const timestamps = chartData.timestamps;
            const labels = chartData.labels;
            
            // Pre-calculate all full hours in the data range
            const firstTimestamp = timestamps.length > 0 ? timestamps[0] : null;
            const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
            const fullHours = [];
            
            if (firstTimestamp && lastTimestamp) {
                // Get the first full hour (round up if needed)
                const startHour = new Date(firstTimestamp);
                startHour.setMinutes(0);
                startHour.setSeconds(0);
                startHour.setMilliseconds(0);
                
                // Get the last full hour (round down if needed)
                const endHour = new Date(lastTimestamp);
                endHour.setMinutes(0);
                endHour.setSeconds(0);
                endHour.setMilliseconds(0);
                
                // Generate all full hours in range
                let currentHour = new Date(startHour);
                while (currentHour <= endHour) {
                    fullHours.push(new Date(currentHour));
                    currentHour.setHours(currentHour.getHours() + 1);
                }
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
                        borderWidth: 1,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        spanGaps: false
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
                            },
                            callbacks: {
                                title: function(context) {
                                    const index = context[0].dataIndex;
                                    const timestamp = timestamps[index];
                                    if (timestamp) {
                                        const hours = String(timestamp.getHours()).padStart(2, '0');
                                        const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                                        return `${hours}:${minutes}`;
                                    }
                                    return context[0].label || '';
                                }
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
                                maxTicksLimit: 24,
                                callback: function(value, index, ticks) {
                                    if (timestamps.length === 0) {
                                        return '';
                                    }
                                    
                                    // Get the label value - value might be index or string
                                    let labelValue = '';
                                    if (typeof value === 'string') {
                                        labelValue = value;
                                    } else if (typeof value === 'number' && index >= 0 && index < labels.length) {
                                        labelValue = labels[index];
                                    } else if (value !== null && value !== undefined) {
                                        labelValue = String(value);
                                    } else {
                                        return '';
                                    }
                                    
                                    if (!labelValue || labelValue === '') {
                                        return '';
                                    }
                                    
                                    // Parse HH:MM from label value
                                    const timeMatch = labelValue.match(/(\d{2}):(\d{2})/);
                                    if (!timeMatch) {
                                        return '';
                                    }
                                    
                                    const labelMinutes = parseInt(timeMatch[2], 10);
                                    
                                    // Only show labels at full hours (minutes === 00)
                                    if (labelMinutes === 0) {
                                        const labelHours = parseInt(timeMatch[1], 10);
                                        return `${String(labelHours).padStart(2, '0')}:00`;
                                    }
                                    
                                    return '';
                                }
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: false
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
                            min: 0,
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
        
        function renderCombinedChart(chartData) {
            let canvas = document.getElementById('combinedChart');
            
            // If canvas doesn't exist (was replaced by error message), restore it
            if (!canvas) {
                // Find the container by looking for the one that should contain combinedChart
                const containers = document.querySelectorAll('.history-chart-container');
                if (containers.length >= 3) {
                    containers[2].innerHTML = '<canvas id="combinedChart" class="history-chart"></canvas>';
                    canvas = document.getElementById('combinedChart');
                }
            }
            
            if (!canvas) return;
            
            const ctx = canvas.getContext('2d');
            
            // Destroy existing chart if it exists
            if (combinedChartInstance) {
                combinedChartInstance.destroy();
            }
            
            // Store timestamps and labels for tooltip access
            const timestamps = chartData.timestamps;
            const labels = chartData.labels;
            
            // Pre-calculate all 24 full hours (00:00 to 23:00)
            const fullHours = [];
            if (timestamps.length > 0) {
                const baseDate = new Date(timestamps[0]);
                baseDate.setHours(0, 0, 0, 0);
                
                // Generate all 24 hours
                for (let hour = 0; hour < 24; hour++) {
                    const hourDate = new Date(baseDate);
                    hourDate.setHours(hour, 0, 0, 0);
                    fullHours.push(hourDate);
                }
            }
            
            const firstTimestamp = timestamps.length > 0 ? timestamps[0] : null;
            const lastTimestamp = timestamps.length > 0 ? timestamps[timestamps.length - 1] : null;
            
            combinedChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: chartData.labels,
                    datasets: [
                        {
                            type: 'bar',
                            label: 'Heart Rate (bpm)',
                            data: chartData.hrData,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.8)',
                            borderWidth: 1,
                            yAxisID: 'y'
                        },
                        {
                            type: 'line',
                            label: 'Oxygen Saturation (%)',
                            data: chartData.o2Data,
                            borderColor: '#8b5cf6',
                            backgroundColor: 'transparent',
                            borderWidth: 2,
                            fill: false,
                            tension: 0.4,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            spanGaps: false,
                            yAxisID: 'y1',
                            borderDash: []
                        }
                    ]
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
                            },
                            callbacks: {
                                title: function(context) {
                                    const index = context[0].dataIndex;
                                    const timestamp = timestamps[index];
                                    if (timestamp) {
                                        const hours = String(timestamp.getHours()).padStart(2, '0');
                                        const minutes = String(timestamp.getMinutes()).padStart(2, '0');
                                        return `${hours}:${minutes}`;
                                    }
                                    return context[0].label || '';
                                }
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
                                maxTicksLimit: 24,
                                callback: function(value, index, ticks) {
                                    if (timestamps.length === 0) {
                                        return '';
                                    }
                                    
                                    // Get the label value - value might be index or string
                                    let labelValue = '';
                                    if (typeof value === 'string') {
                                        labelValue = value;
                                    } else if (typeof value === 'number' && index >= 0 && index < labels.length) {
                                        labelValue = labels[index];
                                    } else if (value !== null && value !== undefined) {
                                        labelValue = String(value);
                                    } else {
                                        return '';
                                    }
                                    
                                    if (!labelValue || labelValue === '') {
                                        return '';
                                    }
                                    
                                    // Parse HH:MM from label value
                                    const timeMatch = labelValue.match(/(\d{2}):(\d{2})/);
                                    if (!timeMatch) {
                                        return '';
                                    }
                                    
                                    const labelMinutes = parseInt(timeMatch[2], 10);
                                    
                                    // Only show labels at full hours (minutes === 00)
                                    if (labelMinutes === 0) {
                                        const labelHours = parseInt(timeMatch[1], 10);
                                        return `${String(labelHours).padStart(2, '0')}:00`;
                                    }
                                    
                                    return '';
                                }
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Heart Rate (bpm)',
                                font: {
                                    size: 12
                                },
                                color: '#ef4444'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#ef4444'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: 'Oxygen Saturation (%)',
                                font: {
                                    size: 12
                                },
                                color: '#8b5cf6'
                            },
                            grid: {
                                drawOnChartArea: false
                            },
                            ticks: {
                                font: {
                                    size: 10
                                },
                                color: '#8b5cf6',
                                stepSize: 1
                            },
                            min: 80,
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
                                min: Math.min(...hourlyData.map(h => h.heart_rate?.min).filter(x => x !== null && x !== undefined && x > 0)),
                                max: Math.max(...hourlyData.map(h => h.heart_rate?.max).filter(x => x !== null && x !== undefined))
                            };
                        }
                        
                        if (o2s.length > 0) {
                            aggregated.oxygen_saturation = {
                                avg: o2s.reduce((a, b) => a + b, 0) / o2s.length,
                                min: Math.min(...hourlyData.map(h => h.oxygen_saturation?.min).filter(x => x !== null && x !== undefined && x > 0)),
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
                            <div class="history-stat-card history-stat-card-heartrate" style="background: linear-gradient(135deg, #ec4899, #db2777); border-radius: 12px; padding: 10px; color: white;">
                                <div class="history-stat-label" style="font-size: 12px; opacity: 0.9; margin-bottom: 8px;">Daily Avg Heart Rate</div>
                                <div id="historyAvgHR" class="history-stat-value" style="font-size: 28px; font-weight: 600; margin-bottom: 8px;">${avgHR}</div>
                                <div class="history-stat-minmax" style="font-size: 11px; opacity: 0.8;">Min: <span id="historyMinHR" class="history-stat-min">${minHR}</span> | Max: <span id="historyMaxHR" class="history-stat-max">${maxHR}</span></div>
                            </div>
                            
                            <div class="history-stat-card history-stat-card-oxygen" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 12px; padding: 10px; color: white;">
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
                        <div class="icon">${ICONS['default']}</div>
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
                
                let typeClass = 'custom';
                if (event.type.includes('Feed')) typeClass = 'feed';
                else if (event.type.includes('Sleep')) typeClass = 'sleep';
                else if (event.type.includes('Diaper')) typeClass = 'diaper';
                else if (event.type.includes('Milestone')) typeClass = 'milestone';
                
                const iconSvg = ICONS[event.type] || ICONS['default'];
                
                return `
                    <div class="event-item">
                        <div class="event-icon ${typeClass}">
                            ${iconSvg}
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
            
            // Re-initialize Feather Icons if they're used in dynamically added content
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
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
                            <div class="milestone-icon">${ICONS['Milestone']}</div>
                            <div class="milestone-title">${milestone.notes || milestone.type}</div>
                            <div class="milestone-date">${dateStr}</div>
                        </div>
                    `);
                } else {
                    boxes.push(`
                        <div class="milestone-box empty" onclick="openModal(); document.getElementById('eventType').value = 'Milestone';">
                            <div class="milestone-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg></div>
                            <div class="milestone-title">Add Milestone</div>
                        </div>
                    `);
                }
            }
            
            if (milestones.length === 0) {
                milestonesGrid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1 / -1;">
                        <div class="icon">${ICONS['Milestone']}</div>
                        <h3>No milestones yet</h3>
                        <p>Record your baby's special moments</p>
                    </div>
                `;
            } else {
                milestonesGrid.innerHTML = boxes.join('');
            }
            
            // Re-initialize Feather Icons if they're used in dynamically added content
            if (typeof feather !== 'undefined') {
                feather.replace();
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
            toast.innerHTML = message;
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
            const owletView = document.getElementById('owletView');
            const owletHistoryView = document.getElementById('owletHistoryView');
            
            const isViewActive = (eventsView && eventsView.classList.contains('active')) ||
                                 (milestonesView && milestonesView.classList.contains('active')) ||
                                 (dayTimelineView && dayTimelineView.classList.contains('active')) ||
                                 (owletView && owletView.classList.contains('active')) ||
                                 (owletHistoryView && owletHistoryView.classList.contains('active'));
            
            if (isViewActive && e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, false);

        document.addEventListener('touchend', function(e) {
            // Make sure we have valid touch data
            if (e.changedTouches.length === 0) return;
            
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            
            const horizontalDistance = touchEndX - touchStartX;
            const verticalDistance = Math.abs(touchEndY - touchStartY);
            
            // Threshold for swipe detection: 100px horizontal movement (right to left, i.e., positive X distance)
            // with less than 50px vertical movement
            if (horizontalDistance > 100 && verticalDistance < 50) {
                const eventsView = document.getElementById('eventsView');
                const milestonesView = document.getElementById('milestonesView');
                const dayTimelineView = document.getElementById('dayTimelineView');
                const owletView = document.getElementById('owletView');
                const owletHistoryView = document.getElementById('owletHistoryView');
                
                // Swipe to go back: right swipe (positive X movement)
                if (eventsView && eventsView.classList.contains('active')) {
                    e.preventDefault();
                    closeEventsView();
                } else if (milestonesView && milestonesView.classList.contains('active')) {
                    e.preventDefault();
                    closeMilestonesView();
                } else if (dayTimelineView && dayTimelineView.classList.contains('active')) {
                    e.preventDefault();
                    closeDayTimelineView();
                } else if (owletView && owletView.classList.contains('active')) {
                    e.preventDefault();
                    closeOwletView();
                } else if (owletHistoryView && owletHistoryView.classList.contains('active')) {
                    e.preventDefault();
                    closeOwletHistoryView();
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
                // Destroy chart if it exists
                if (timelineChartInstance) {
                    timelineChartInstance.destroy();
                    timelineChartInstance = null;
                }
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

            // Show stats (legend is handled by chart)
            // legend.classList.add('show');
            document.getElementById('dailyStats').classList.add('show');

            // Process events for timeline
            const processedEvents = processEventsForTimeline(dayEvents);
            
            // Create chart container
            timeline.innerHTML = `
                <h3 class="timeline-chart-title">Daily Timeline</h3>
                <div class="timeline-chart-container">
                    <canvas id="timelineChart" class="timeline-chart-canvas"></canvas>
                </div>
            `;

            // Render Chart.js timeline
            renderTimelineChart(processedEvents, dayStart);
            
            // Calculate and display daily stats
            calculateDailyStats(processedEvents, dayEvents);
            renderDayEventList(dayEvents);
        }

        function renderTimelineChart(processedEvents, dayStart) {
            let canvas = document.getElementById('timelineChart');
            if (!canvas) return;

            // Set fixed height for the container to ensure readable rows
            const container = canvas.parentElement;
            container.style.height = '280px'; // Enough for 4-5 rows
            container.style.marginBottom = '20px';

            const ctx = canvas.getContext('2d');

            // Destroy existing chart if it exists
            if (timelineChartInstance) {
                timelineChartInstance.destroy();
            }

            // Prepare data for Chart.js
            const chartData = prepareTimelineChartData(processedEvents, dayStart);

            timelineChartInstance = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            left: 10,
                            right: 20,
                            top: 10,
                            bottom: 10
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 8,
                                font: { size: 11 },
                                color: '#64748b'
                            }
                        },
                        tooltip: {
                            enabled: false
                        }
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            min: 0,
                            max: 24,
                            ticks: {
                                stepSize: 3, // Every 3 hours
                                callback: function(value) {
                                    return `${String(value).padStart(2, '0')}:00`;
                                },
                                font: { size: 10 },
                                color: '#94a3b8'
                            },
                            grid: {
                                color: '#f1f5f9',
                                drawBorder: false
                            },
                            border: { display: false }
                        },
                        y: {
                            type: 'category',
                            // Labels will be auto-taken from data labels
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: { size: 12, weight: 500 },
                                color: '#475569'
                            },
                            border: { display: false },
                            stacked: true
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'xy',
                        intersect: false
                    },
                    onClick: function(evt, elements) {
                        if (elements.length > 0) {
                            const element = elements[0];
                            const dataset = timelineChartInstance.data.datasets[element.datasetIndex];
                            const dataItem = dataset.data[element.index];
                            
                            if (dataItem && dataItem.rawEvent) {
                                const event = dataItem.rawEvent;
                                let timeStr;
                                if (event.type === 'duration') {
                                    timeStr = `${event.startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${event.endTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                                } else {
                                    timeStr = event.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                }
                                
                                // Use existing showEventInfo if available
                                if (typeof showEventInfo === 'function') {
                                    showEventInfo(event.title, timeStr, evt.native.clientX, evt.native.clientY);
                                }
                            }
                        }
                    }
                }
            });
        }

        function prepareTimelineChartData(processedEvents, dayStart) {
            const sleepData = [];
            const feedData = [];
            const diaperData = [];
            const otherData = [];
            
            let totalSleepMinutes = 0;
            let totalFeedMinutes = 0;
            let diaperCount = 0;
            let otherCount = 0;

            processedEvents.forEach(event => {
                let startHour, endHour;
                
                if (event.type === 'duration') {
                    startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60;
                    endHour = event.endTime.getHours() + event.endTime.getMinutes() / 60;
                    
                    // Handle crossing midnight
                    if (endHour < startHour) endHour += 24;
                    
                    const durationMinutes = Math.round((event.endTime - event.startTime) / (1000 * 60));
                    
                    if (event.category === 'sleep') {
                        totalSleepMinutes += durationMinutes;
                    } else if (event.category === 'feed') {
                        totalFeedMinutes += durationMinutes;
                    } else if (event.category === 'other') {
                        // For other duration events if any
                        otherCount++;
                    }
                } else {
                    startHour = event.time.getHours() + event.time.getMinutes() / 60;
                    endHour = startHour + 0.2; 
                    
                    if (event.category === 'diaper') {
                        diaperCount++;
                    } else {
                        otherCount++;
                    }
                }
                
                // Helper to format category label with stats
                const formatDuration = (totalMinutes) => {
                    const hours = Math.floor(totalMinutes / 60);
                    const minutes = totalMinutes % 60;
                    if (hours === 0) return `${minutes}m`;
                    return `${hours}h ${minutes}m`;
                };

                // Generate Labels with Stats
                const sleepLabel = 'Sleep';
                const feedLabel = 'Feed';
                const diaperLabel = 'Diaper';
                const otherLabel = 'Other';

                const dataPoint = {
                    x: [startHour, endHour],
                    y: '', // Placeholder, will match label
                    rawEvent: event
                };
                
                if (event.category === 'sleep') {
                    dataPoint.y = sleepLabel;
                    sleepData.push(dataPoint);
                } else if (event.category === 'feed') {
                    dataPoint.y = feedLabel;
                    feedData.push(dataPoint);
                } else if (event.category === 'diaper') {
                    dataPoint.y = diaperLabel;
                    diaperData.push(dataPoint);
                } else {
                    dataPoint.y = otherLabel;
                    otherData.push(dataPoint);
                }
            });
            
            // Recalculate totals fully first to ensure labels are correct for ALL data points
            // The previous loop did it incrementally which is wrong for the label assignment on early items
            // Let's do a pre-pass
            totalSleepMinutes = 0;
            totalFeedMinutes = 0;
            diaperCount = 0;
            otherCount = 0;
            
            processedEvents.forEach(event => {
                if (event.type === 'duration') {
                    // Handle duration calculations properly, including cross-midnight if needed
                    // But here we just use the event duration which should be correct
                    const durationMs = event.endTime - event.startTime;
                    const durationMinutes = Math.round(durationMs / (1000 * 60));
                    
                    if (event.category === 'sleep') totalSleepMinutes += durationMinutes;
                    else if (event.category === 'feed') totalFeedMinutes += durationMinutes;
                    else otherCount++;
                } else {
                    if (event.category === 'diaper') diaperCount++;
                    else otherCount++;
                }
            });
            
            const formatDuration = (totalMinutes) => {
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                if (hours === 0) return `${minutes}m`;
                return `${hours}h ${minutes}m`;
            };

            // Clear and re-populate data with correct Y labels
            sleepData.length = 0;
            feedData.length = 0;
            diaperData.length = 0;
            otherData.length = 0;
            
            processedEvents.forEach(event => {
                let startHour, endHour;
                if (event.type === 'duration') {
                    startHour = event.startTime.getHours() + event.startTime.getMinutes() / 60;
                    endHour = event.endTime.getHours() + event.endTime.getMinutes() / 60;
                    if (endHour < startHour) endHour += 24;
                } else {
                    startHour = event.time.getHours() + event.time.getMinutes() / 60;
                    endHour = startHour + 0.2;
                }
                
                const dataPoint = {
                    x: [startHour, endHour],
                    y: '', 
                    rawEvent: event
                };
                
                if (event.category === 'sleep') {
                    dataPoint.y = 'Sleep';
                    sleepData.push(dataPoint);
                } else if (event.category === 'feed') {
                    dataPoint.y = 'Feed';
                    feedData.push(dataPoint);
                } else if (event.category === 'diaper') {
                    dataPoint.y = 'Diaper';
                    diaperData.push(dataPoint);
                } else {
                    dataPoint.y = 'Other';
                    otherData.push(dataPoint);
                }
            });

            // Build datasets only for categories with events
            const datasets = [];
            const labels = [];

            if (sleepData.length > 0) {
                labels.push('Sleep');
                datasets.push({
                    label: 'Sleep',
                    data: sleepData,
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                });
            }

            if (feedData.length > 0) {
                labels.push('Feed');
                datasets.push({
                    label: 'Feed',
                    data: feedData,
                    backgroundColor: 'rgba(244, 114, 182, 0.7)',
                    borderColor: 'rgba(244, 114, 182, 1)',
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                });
            }

            if (diaperData.length > 0) {
                labels.push('Diaper');
                datasets.push({
                    label: 'Diaper',
                    data: diaperData,
                    backgroundColor: 'rgba(52, 211, 153, 0.7)',
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: 1,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                });
            }

            if (otherData.length > 0) {
                labels.push('Other');
                datasets.push({
                    label: 'Other',
                    data: otherData,
                    backgroundColor: 'rgba(251, 191, 36, 0.8)',
                    borderColor: 'rgba(251, 191, 36, 1)',
                    borderWidth: 1,
                    borderSkipped: false,
                    borderRadius: 1,
                    barPercentage: 0.7,
                    categoryPercentage: 0.8
                });
            }

            return {
                labels: labels,
                datasets: datasets
            };
        }

        function processEventsForTimeline(dayEvents) {
            const processed = [];
            const used = new Set();

            // Sort events by time to ensure proper chronological order
            const sortedEvents = [...dayEvents].sort((a, b) => new Date(a.time) - new Date(b.time));

            // Helper function to get icon for event type (use image icons)
            function getIconForEvent(event) {
                return IMAGES[event.type] || IMAGES['default'];
            }

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
                            icon: getIconForEvent(event),
                            title: baseType,
                            notes: event.notes || endEvent.notes
                        });
                    } else {
                        // Unpaired start event
                        processed.push({
                            type: 'instant',
                            category: baseType.toLowerCase(),
                            time: new Date(event.time),
                            icon: getIconForEvent(event),
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
                            icon: getIconForEvent(event),
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
                        icon: getIconForEvent(event),
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
                    coloredSection.style.borderRadius = '0';
                    
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
                    // Removed title attribute to prevent duplicate tooltips with custom popup
                    
                    timelineTrack.appendChild(coloredSection);
                    
                    // Create start marker
                    const startMarker = document.createElement('div');
                    startMarker.className = 'event-marker';
                    startMarker.style.left = `${startPercent}%`;
                    
                    const startIcon = document.createElement('div');
                    startIcon.className = 'event-marker-icon';
                    startIcon.innerHTML = event.icon;
                    // Removed title attribute to prevent duplicate tooltips with custom popup
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
                    // Removed title attribute to prevent duplicate tooltips with custom popup
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
                    // Removed title attribute to prevent duplicate tooltips with custom popup
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
            
            const iconSvg = ICONS[eventType] || ICONS['default'];
            
            eventsContainer.innerHTML = `
                <div class="event-item">
                    <span style="display:inline-flex;vertical-align:middle;width:20px;height:20px;color:var(--primary)">${iconSvg}</span>
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
                        <div class="icon">${ICONS['default']}</div>
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
                
                let typeClass = 'custom';
                if (event.type.includes('Feed')) typeClass = 'feed';
                else if (event.type.includes('Sleep')) typeClass = 'sleep';
                else if (event.type.includes('Diaper')) typeClass = 'diaper';
                else if (event.type.includes('Milestone')) typeClass = 'milestone';

                let intervalText = '';
                if (event.type === 'Feed End') {
                    const durationSinceFeedStart = feedEndToDuration.get(event.id);
                    if (durationSinceFeedStart) {
                        intervalText = ` • ${durationSinceFeedStart}`;
                    }
                }
                
                // Use image icons for timeline view
                const iconContent = IMAGES[event.type] || IMAGES['default'];
                
                return `
                    <div class="event-item">
                        <div class="event-icon ${typeClass}">${iconContent}</div>
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
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || `HTTP ${response.status}: Failed to delete`);
                    }).catch(() => {
                        throw new Error(`HTTP ${response.status}: Failed to delete`);
                    });
                }
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
                console.error('Delete error:', err);
                showToast('Failed to delete event: ' + err.message);
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

        // Initialize Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Set today's date in calendar icon
        const today = new Date();
        const todayNumber = today.getDate();
        const calendarDayEl = document.getElementById('todayNumber');
        if (calendarDayEl) {
            calendarDayEl.textContent = todayNumber;
        }
        
        // ========== FEED MONITORING AND NOTIFICATIONS ==========
        let feedMonitoringInterval = null;
        let notificationSentForFeedId = {};

        // Request notification permission (only called from user interactions)
        function requestNotificationPermission() {
            if (!('Notification' in window)) {
                console.log('This browser does not support notifications');
                return;
            }

            if (Notification.permission === 'granted') {
                console.log('Notification permission already granted');
                startFeedMonitoring();
            } else if (Notification.permission !== 'denied') {
                // Ask for permission only if not denied before
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted');
                        startFeedMonitoring();
                    } else {
                        console.log('Notification permission denied');
                    }
                });
            } else {
                // Permission was previously denied, still start monitoring but without notifications
                startFeedMonitoring();
            }
        }

        // Register service worker for PWA notifications
        function registerServiceWorker() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service-worker.js?v=' + APP_VERSION)
                    .then((reg) => {
                        console.log('Service Worker registered:', reg);
                    })
                    .catch((err) => {
                        console.log('Service Worker registration failed:', err);
                    });
            }
        }

        // Check if a feed is still active (started but not ended)
        function checkActiveFeed() {
            const now = new Date().getTime();
            const ONE_HOUR = 60 * 60 * 1000;

            // Get all feed events
            const feedEvents = events.filter(e => e.type === 'Feed Start' || e.type === 'Feed End');
            
            // Sort by time descending
            const sorted = [...feedEvents].sort((a, b) => new Date(b.time) - new Date(a.time));

            // Check for incomplete feeds (Feed Start without corresponding Feed End)
            for (let i = 0; i < sorted.length; i++) {
                const event = sorted[i];
                
                if (event.type === 'Feed Start') {
                    // Check if there's a corresponding Feed End after this Feed Start
                    const feedStartTime = new Date(event.time).getTime();
                    const hasCorrespondingEnd = sorted.slice(0, i).some(e => 
                        e.type === 'Feed End' && new Date(e.time).getTime() > feedStartTime
                    );

                    if (!hasCorrespondingEnd) {
                        // This feed hasn't ended
                        const feedDuration = now - feedStartTime;

                        if (feedDuration > ONE_HOUR) {
                            // Feed has lasted more than 1 hour
                            const durationHours = Math.floor(feedDuration / (60 * 60 * 1000));
                            const durationMinutes = Math.floor((feedDuration % (60 * 60 * 1000)) / (60 * 1000));
                            
                            // Send notification only once per feed
                            if (!notificationSentForFeedId[event.id]) {
                                sendLongFeedNotification(durationHours, durationMinutes, event);
                                notificationSentForFeedId[event.id] = true;
                            }
                        }
                    } else {
                        // Feed has ended, clear the flag for this feed
                        delete notificationSentForFeedId[event.id];
                    }
                    
                    // Only check the most recent incomplete feed
                    break;
                }
            }
        }

        // Send notification for long feed
        function sendLongFeedNotification(hours, minutes, feedEvent) {
            const feedStartTime = new Date(feedEvent.time);
            const timeStr = feedStartTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });

            const notificationTitle = '🍼 Long Feeding Session';
            const notificationOptions = {
                body: `Your baby has been feeding for ${hours}h ${minutes}m (started at ${timeStr}). Consider ending this feed session if it's complete.`,
                icon: 'icon-512.png',
                badge: 'icon-192.png',
                tag: 'long-feed-' + feedEvent.id,
                requireInteraction: true,
                actions: [
                    {
                        action: 'end-feed',
                        title: 'End Feed'
                    },
                    {
                        action: 'dismiss',
                        title: 'Dismiss'
                    }
                ]
            };

            // Try to send via service worker notification API (preferred)
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.controller.postMessage({
                    type: 'SEND_NOTIFICATION',
                    title: notificationTitle,
                    options: notificationOptions
                });
            }

            // Fallback: Use Notification API directly
            if ('Notification' in window && Notification.permission === 'granted') {
                const notification = new Notification(notificationTitle, notificationOptions);
                
                notification.onclick = () => {
                    window.focus();
                    openDayTimelineView();
                    notification.close();
                };
            }

            console.log('Long feed notification sent for feed started at', feedEvent.time);
        }

        // Start monitoring feeds for long duration
        function startFeedMonitoring() {
            // Check immediately
            checkActiveFeed();

            // Then check every 5 minutes
            if (feedMonitoringInterval) {
                clearInterval(feedMonitoringInterval);
            }
            feedMonitoringInterval = setInterval(() => {
                checkActiveFeed();
            }, 5 * 60 * 1000); // 5 minutes

            console.log('Feed monitoring started');
        }

        // Stop monitoring (if needed)
        function stopFeedMonitoring() {
            if (feedMonitoringInterval) {
                clearInterval(feedMonitoringInterval);
                feedMonitoringInterval = null;
            }
            console.log('Feed monitoring stopped');
        }

        // Initialize
        setDefaultTime();
        loadEvents();
        registerServiceWorker();
        
        // Request notification permission on first user interaction
        document.addEventListener('click', function requestPermissionOnce() {
            if ('Notification' in window && Notification.permission === 'default') {
                requestNotificationPermission();
            }
            document.removeEventListener('click', requestPermissionOnce);
        }, { once: false, capture: true });
