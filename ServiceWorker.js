const CACHE_NAME = 'HMD_CACHE';

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(CACHE_NAME).then(async (cache) => {
			const response = await cache.match(event.request);

			if(response){console.log("Hit");}

			return response || fetch(event.request).then((fetch_response) => {
				cache.put(event.request, fetch_response.clone());
				return fetch_response;
			});
		})
	);
})
