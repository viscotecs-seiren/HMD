const CACHE_NAME = 'HMD_CACHE';

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
 });

self.addEventListener('activate', (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		cache.keys().then(function(keys) {
			console.log("activate");
			keys.forEach(function(request) {
				if(request.url) {
					if(!request.url.endsWith("_0.jpg")) {
						cache.delete(request);
					}
				}
			});
		});
	}).then(self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const response = await cache.match(event.request);

			console.log(event.request);

			return response || fetch(event.request).then((_response) => {
				if(!_response || _response.status !== 200 || _response.type !== 'basic') {
					return _response;
				}

				cache.put(event.request, _response.clone());

				return _response;
			});
		})
	);
});

self.addEventListener("message", (event) => {
	if(event.data["command"]) {
		if(event.data["command"] === "clearCache") {
			event.waitUntil(
				event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
					cache.keys().then(function(keys) {
						keys.forEach(function(request) {
							if(request.url) {
								if(!request.url.endsWith("_0.jpg")) {
									cache.delete(request);
								}
							}
						});
					});
				}))
			);
		}
	}
});