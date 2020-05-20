# CloneBox

## Awesome app for manage yours files

## Note

- That app works only under Unix
- Windows user must change the file paths in server/

### Technologies stack

```
Express   - 4.17.2
TypeORM   - 0.2.24
MySQL     - 5.6
Vue       - 2.6.11
Vuetify   - 2.2.11
```

---

## Installation

1. Clone or download project
2. For all folder install packages: `npm install`
3. For all folder in root create `.env`
4. Copy data from `.env.examples` to `.env`
5. Create [TinyPng](https://tinypng.com) account and generate your API key
6. Create new `clonebox` Schema for your DB
7. `server/ormconfig.json` adds your DB settings

---

## Start app for login, client and server

```
npm start serve
```

**Local**

- login (localhost) -> Port 5600
- client (localhost) -> Port 5700
- server (localhost) -> Port 3004 & 3003

## Open API

`/api-docs`

## Copyright

&copy; CloneBox
