const staticCacheName = 's-app-v0.8'
const dynamicCacheName = 'd-app-v0.8'

const assetUrls = [
  '/',
  '/js/app.8ae6b22f.js',
  '/js/chunk-vendors.0bac9419.js',
  '/css/app.ad26099f.css',
  '/swapp.js',
  '/img/menu-background.jpg',

]

self.addEventListener('install', async event => {
  console.log('install')
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
  const { request } = event

  const url = new URL(request.url)

  if (assetUrls.includes(url.pathname) || url.pathname.includes('/icons/')) {
    const cache = await caches.open(staticCacheName)
    const keys = await cache.keys()
    if (!keys.includes(url.pathname)) {
      cache.add(url.pathname);
    }
  }

  if (url.pathname === location.pathname) {
    event.respondWith(cacheFirst(request))
  } /*else if (url.pathname.includes('/icons/')) {
    event.respondWith(cacheFirst(request))
  } else {
    event.respondWith(networkFirst(request))
  }*/
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