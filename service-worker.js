// Baby Monitor Service Worker
// Handles notifications and background sync

const CACHE_VERSION = 'v1.6';

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_VERSION).then((cache) => {
            console.log('[Service Worker] Cache opened');
            return cache.addAll([
                '/',
                '/index.html',
                '/app.js',
                '/styles.css',
                '/manifest.json'
            ]).catch(err => {
                console.log('[Service Worker] Some files not cached:', err);
                // Continue even if some files fail to cache
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_VERSION) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).then((response) => {
                // Clone the response
                const responseClone = response.clone();
                
                // Cache successful responses for GET requests
                if (event.request.method === 'GET' && response.status === 200) {
                    caches.open(CACHE_VERSION).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                
                return response;
            }).catch(() => {
                // Return a fallback response if both cache and network fail
                console.log('[Service Worker] Fetch failed for:', event.request.url);
                return new Response('Offline - Page not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            });
        })
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Handle notification actions
    if (event.action === 'end-feed') {
        // Open app and focus
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then((clientList) => {
                // Check if app is already open
                for (let client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        client.focus();
                        client.postMessage({ type: 'END_FEED_ACTION' });
                        return client;
                    }
                }
                // Otherwise open new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    } else {
        // Default click - just open the app
        event.waitUntil(
            clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            }).then((clientList) => {
                for (let client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
        );
    }
});

// Handle messages from the app
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SEND_NOTIFICATION') {
        self.registration.showNotification(event.data.title, event.data.options).catch((err) => {
            console.log('[Service Worker] Failed to show notification:', err);
        });
    }
});

