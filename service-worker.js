self.addEventListener("install", (event) => {
  console.log("Bond Chat Installed");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
