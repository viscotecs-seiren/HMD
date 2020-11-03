const CACHE_NAME = 'HMD_CACHE';

self.addEventListener('activate', (event) => {
	event.waitUntil(self.clients.claim());
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
