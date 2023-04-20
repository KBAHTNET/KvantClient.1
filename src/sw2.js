const staticCacheName = 's-app-v1.3'
const dynamicCacheName = 'd-app-v1.3'

const assetUrls = [
  'index.html',
  '/js/app.2ad2e0f4.js',
  '/js/chunk-vendors.0bac9419.js',
  '/css/app.8fb48445.css',
  '/swapp.js',
  '/sw.js',
  '/img/menu-background.jpg',

]

self.addEventListener('install', async event => {
  console.log('install')
  debugger;
  const cache = await caches.open(staticCacheName)
  await cache.addAll(assetUrls)
})

self.addEventListener('activate', async event => {
  console.log('activate')
  const cacheNames = await caches.keys()
  await Promise.all(
    cacheNames
    .filter(name => name !== staticCacheName)
    .filter(name => name !== dynamicCacheName)
    .map(name => caches.delete(name))
  )
})

self.addEventListener('fetch', async (event) => {
  console.log('fetch')
  debugger;
  const { request } = event

  const url = new URL(request.url)

  if (assetUrls.includes(url) || '/icons/' in url) {
    const cache = await caches.open(staticCacheName)
    const keys = await cache.keys()
    if (!keys.includes(url)) {
      cache.add(url);
    }
  }

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request))
  } else if (url.includes('/icons/')) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }
})


async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (e) {
    const cached = await cache.match(request)
    return cached ?? await caches.match('/offline.html')
  }
}