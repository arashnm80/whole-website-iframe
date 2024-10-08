addEventListener('fetch', event => {
  const url = new URL(event.request.url)
  const targetUrl = url.searchParams.get('url')

  if (!targetUrl) {
    return event.respondWith(new Response('Please provide a URL as a query parameter, e.g., ?url=https://example.com', { status: 400 }))
  }

  event.respondWith(fetch(targetUrl, {
    headers: {
      'User-Agent': 'Cloudflare Worker Proxy',
      'X-Forwarded-For': event.request.headers.get('CF-Connecting-IP')
    }
  }))
})
