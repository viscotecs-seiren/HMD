const CACHE_NAME = 'HMD_CACHE';

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
 });

self.addEventListener('activate', (event) => {
	console.log("a");
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => {
		console.log("b");
		cache.keys().then(function(keys) {
			console.log("c");
			keys.forEach(function(request, index, array) {
				console.log(request);
			});
		});
	}).then(self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const response = await cache.match(event.request);

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
