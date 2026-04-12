const CACHE_NAME = "rpglog-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
];

// Instalar — cachear assets estáticos
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activar — limpiar caches viejos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — estrategia Network First para API, Cache First para assets
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  
  // API calls — Network First, sin cachear
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(
      fetch(e.request).catch(() =>
        new Response(JSON.stringify({ ok: false, offline: true }), {
          headers: { "Content-Type": "application/json" }
        })
      )
    );
    return;
  }

  // Assets — Cache First
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return res;
      })
    ).catch(() => caches.match("/index.html"))
  );
});

// Sync en background — se ejecuta cuando vuelve internet
self.addEventListener("sync", (e) => {
  if (e.tag === "rpglog-sync") {
    e.waitUntil(syncPendingActions());
  }
});

// Recibir notificaciones push
self.addEventListener("push", (e) => {
  const data = e.data?.json() || { title: "RPGLog", body: "Tienes misiones pendientes" };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/logo192.png",
      badge: "/logo192.png",
      data: data.url || "/",
      vibrate: [200, 100, 200],
    })
  );
});

// Click en notificación — abrir la app
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: "window" }).then(clientList => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow(e.notification.data || "/");
    })
  );
});

async function syncPendingActions() {
  // Lee acciones pendientes de IndexedDB y las envía al backend
  const pending = await getPendingActions();
  for (const action of pending) {
    try {
      await fetch(action.url, {
        method: action.method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${action.token}`
        },
        body: JSON.stringify(action.body),
      });
      await removePendingAction(action.id);
    } catch (_) {}
  }
}

// IndexedDB helpers dentro del SW
function getPendingActions() {
  return new Promise((resolve) => {
    const req = indexedDB.open("rpglog-offline", 1);
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("pending")) return resolve([]);
      const tx = db.transaction("pending", "readonly");
      const store = tx.objectStore("pending");
      const all = store.getAll();
      all.onsuccess = () => resolve(all.result || []);
      all.onerror = () => resolve([]);
    };
    req.onerror = () => resolve([]);
  });
}

function removePendingAction(id) {
  return new Promise((resolve) => {
    const req = indexedDB.open("rpglog-offline", 1);
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("pending")) return resolve();
      const tx = db.transaction("pending", "readwrite");
      tx.objectStore("pending").delete(id);
      tx.oncomplete = resolve;
    };
    req.onerror = resolve;
  });
}
