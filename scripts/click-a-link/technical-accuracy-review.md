# Technical accuracy review

## Scope and scenario

The film depicts one simplified HTTPS navigation: a standard link, no service-worker interception, a response not entirely fulfilled from browser cache, address resolution required, a fresh illustrative HTTP/2 connection over TCP and TLS, HTML containing references to separate resources, and progressive browser rendering. The model is not a universal rigid sequence. “SIMPLIFIED HTTPS NAVIGATION” remains visible throughout.

## Review results

| Topic | Film treatment | Qualification |
|---|---|---|
| URL | Separates HTTPS scheme, hostname, path | “PROTOCOL” is a viewer-friendly label for the scheme; the path names a resource at the service. It is not a filesystem-path guarantee. |
| DNS | Resolver returns address information, not HTML | Explicit “Not fetching a webpage.” No compulsory authoritative-server visit is shown. Resolver directory mentions caches/upstream resolvers. |
| Example IP | 203.0.113.10 | Fictional example mapping, not a claim of the current address of example.com. TEST-NET-3 is reserved for documentation by RFC 5737. |
| DNS caching | “CACHE MAY SKIP THIS STEP” | The visible lookup is required in this scenario; browser/OS/resolver caching can reduce/avoid network work in other cases. |
| Transport | “HTTP/2 · TCP + TLS” | HTTP/3 instead uses QUIC over UDP. Film does not label HTTP/3 TCP-based or imply this transport is universal. |
| Handshake | TCP SYN / SYN·ACK / ACK and abstract TLS exchange | Symbolic timing, not a packet capture or a universal TLS round-trip count. Lock is displayed only after local TLS completion at 12.35 s. |
| TLS | Protected channel remains visible and carrying labeled messages | Encryption does not make traffic or its existence disappear. Legible packet labels are educational annotations, not exposed plaintext on a wire. No DNS-encryption claim. |
| Connection reuse | “CONNECTIONS MAY BE REUSED” | This fresh connection is for teaching clarity, not a necessity on every click. |
| Destination | “A CDN or proxy may be the endpoint.” | The service icon is a logical endpoint, not necessarily one physical origin machine. |
| Request | GET /page, browser toward service | Marked “SIMPLIFIED HTTP/2 REQUEST”. HTTP/2 actually represents method/path via pseudoheaders in binary frames; this is not a literal HTTP/1 request line on the wire. Other methods exist. |
| Response | Example 200 OK / HTML, service toward browser | “EXAMPLE SUCCESS RESPONSE”, not a promised result. HTTP/2 carries :status 200 rather than a literal reason-phrase line. Other statuses, redirects and content types are omitted. |
| Resources | HTML references CSS / JS / images, separate request branches originate at browser | Not depicted as all embedded in the original HTML. Resource work may overlap parsing and other network work. |
| Rendering | Parse, style, layout, paint, composite; page paint begins before image reveal completes | Conceptual staged visualization, not exact browser-thread execution ordering. JavaScript and resource completion may alter subsequent style/layout/paint work. |
| Timing | Film takes 30 seconds for explanation | No invented universal latency figure is displayed. Real timings vary with network, cache, transport and page. |

## Sources reviewed

Fetched and inspected during production:

1. MDN — How browsers work: https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/How_browsers_work
2. MDN — Overview of HTTP: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
3. MDN — HTTP/3 glossary: https://developer.mozilla.org/en-US/docs/Glossary/HTTP_3
4. RFC 5737 — IPv4 Address Blocks Reserved for Documentation: https://www.rfc-editor.org/rfc/rfc5737.html

Source cautions: the MDN browser overview includes simplified/dated wording about mandatory authoritative DNS traversal, TLS round-trip counts and specific IP addresses. Those claims are not repeated as universal facts. Protocol-specific exceptions and cache/proxy behavior are checked against the HTTP overview and HTTP/3 reference. The animation uses the reserved example address instead of presenting a live domain-to-IP measurement.

## Educational regression coverage

Tests assert DNS content is not an HTTP response, documentation address use, cache note, explicit HTTP/2 TCP+TLS labeling, no incorrect HTTP/3 reference, request/response directions, lock timing, separate resource requests, progressive page paint before last asset, scenario annotation on all scenes, and no universal latency values. These checks support but do not replace a human networking expert's independent review.
