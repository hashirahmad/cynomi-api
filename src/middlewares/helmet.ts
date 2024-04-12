import helmet from 'helmet'

/**
 * helmet is a collection of 14 small middleware functions that set
 * HTTP response headers. Mounting helmet() doesn't include all of
 * these middleware functions but provides you with sensible defaults
 * such as DNS Prefetch Control, Frameguard, Hide Powered-By, HSTS,
 * IE No Open, Don't Sniff Mimetype, and XSS Filter.
 */
export default [
    helmet(),
    /**
     * This is needed for allowing the API docs. The `apidoc` package
     * is used which generates the appropriate HTML.
     */
    helmet.contentSecurityPolicy({
        directives: {
            'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            'style-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        },
    }),
]
