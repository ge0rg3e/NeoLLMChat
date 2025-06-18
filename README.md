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

---

## Coming Soon

-   [] Web Search

## Setup Guide

### Prerequisites

-   Docker installed on your host
-   Access to a MongoDB instance (self-hosted or cloud service like MongoDB Atlas)

### Step 1: Database Setup

1. Set up a MongoDB instance:
    - Self-host MongoDB using Docker
    - Or create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
    - Create a new collection named `neollmchat`
    - Save your connection string for the next step

### Step 2: Configuration

1. Create a new directory for the app
2. Create a `compose.yml` file with the following content:

```yml
services:
    neollmchat:
        image: ghcr.io/ge0rg3e/neollmchat:latest
        container_name: NeoLLMChat
        environment:
            - DATABASE_URL= # mongodb
            - CONTENT_ENCRYPTION_KEY= # Buffer.from(randomBytes(32)).toString('base64');
            - JWT_SECRET= # a strong secret
        ports:
            - 8608:8608
        restart: always
```

### Step 3: Running the App

1. Navigate to the directory where you created `compose.yml`
2. Run the following command to start the app:

```bash
docker compose up -d
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
