# vite-starter

```
git clone git@github.com:vlcn-io/vite-starter.git
pnpm install
pnpm dev
```

What you get:
- A client ([App.tsx](https://github.com/vlcn-io/vite-starter/blob/main/src/App.tsx)) that runs a SQLite DB
- A server ([server.js](https://github.com/vlcn-io/vite-starter/blob/main/server.js)) that the client (or many clients) can sync to when online
- A database schema file ([schema.mjs](https://github.com/vlcn-io/vite-starter/blob/main/src/schemas/testSchema.mjs)) that is automatically applied and migrated to on server startup and on change on the client.
