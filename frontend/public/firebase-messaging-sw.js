importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyDcOinAjm1suBn-vQ_IlhKoenMc17psx_E",
  authDomain: "mgg-dashboard.firebaseapp.com",
  projectId: "mgg-dashboard",
  storageBucket: "mgg-dashboard.firebasestorage.app",
  messagingSenderId: "914318799661",
  appId: "1:914318799661:web:1700fb8950522800ab99a4"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// This handles push notifications when the app tab is CLOSED or in the background
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background push received:', payload);

  const notificationTitle = payload.notification?.title || 'Mahatma Global Gateway';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification.',
    icon: '/logo.svg',
    badge: '/logo.svg',
    tag: 'mgg-notification', // Replaces old notification instead of stacking
    data: { url: '/' },     // URL to open when clicked
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// When user clicks the notification, open or focus the app tab
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a tab is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('localhost') && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new tab
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
