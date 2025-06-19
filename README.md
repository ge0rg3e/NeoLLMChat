# NeoLLMChat

A self-hosted LLM Chat Web UI built with React and ElysiaJS.

## Features

-   [x] Open Source & Self-Hosted
-   [x] Chat Interface
-   [x] Chat History
-   [x] Multiple Model Support (OpenAI API Protocol Compatible)
-   [x] Secure API Key Encryption
-   [x] Multi-User Authentication
-   [x] File Attachment Capabilities
-   [x] Code Syntax Highlighting
-   [x] Message Editing & Regeneration
-   [x] Web Search (Beta)

---

## Setup Guide

```yml
services:
    neollmchat:
        image: ghcr.io/ge0rg3e/neollmchat:latest
        container_name: neollmchat
        environment:
            - DATABASE_URL= # mongodb
            - CONTENT_ENCRYPTION_KEY= # Buffer.from(randomBytes(32)).toString('base64');
            - JWT_SECRET= # a strong secret
            - SEARXNG_HOST=http://localhost:8080 # Required for Web Search
            - SEARXNG_ENGINES=bing # google,bing,brave
        ports:
            - 8608:8608
        restart: always

    searxng: # Required for Web Search
        container_name: searxng
        image: docker.io/searxng/searxng:latest
        restart: unless-stopped
        ports:
            - '8080:8080'
        volumes:
            - ./searxng:/etc/searxng:rw
        environment:
            - SEARXNG_BASE_URL=https://${SEARXNG_HOSTNAME:-localhost}/
```

## Contributing

Contributions are welcome! Here’s how to get started:

1. Fork this repository
2. Clone your fork locally
3. Run `bun install` to install dependencies
4. Make your changes or add features
5. Test your changes locally
6. Commit and push your branch
7. Open a Pull Request describing your improvements

Please keep code style consistent and write clean, simple code.

---

## License

[MIT](LICENSE) License © Ge0rg3e
