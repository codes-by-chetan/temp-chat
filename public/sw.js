// sw.js
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Optional: Handle click actions, e.g., focus on the app window
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      if (clientsArr.length > 0) {
        clientsArr[0].focus();
      } else {
        clients.openWindow('/');
      }
    })
  );
});