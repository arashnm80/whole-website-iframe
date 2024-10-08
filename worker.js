async function handleRequest(request) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        return new Response('URL parameter is missing', { status: 400 });
    }

    try {
        const response = await fetch(targetUrl);
        const contentType = response.headers.get('Content-Type');

        // If the response is HTML, rewrite relative URLs
        if (contentType && contentType.includes('text/html')) {
            let html = await response.text();

            // Rewrite relative URLs for assets (CSS, JS, images, etc.)
            html = html.replace(/(href|src)="(\/[^"]*)"/g, `$1="${targetUrl}$2"`);
            html = html.replace(/url\((\/[^)]+)\)/g, `url(${targetUrl}$1)`);

            return new Response(html, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // For non-HTML content (like images, CSS), just return it directly
        return new Response(response.body, {
            status: response.status,
            headers: {
                'Content-Type': contentType || 'application/octet-stream',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        return new Response('Error fetching the requested website.', { status: 500 });
    }
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
