# Traffic Data

React + node.js (Express) + MySQL. Charts for country traffic and vehicle types.

## How to run

```
docker compose up --build
```

Then open http://127.0.0.1:3000/

login: admin / admin123

## Folders

- `backend` - api
- `frontend` - react app
- `db/init.sql` - schema + some sample rows

## API

- POST /api/login - Sign IN
- GET /api/traffic - all
- GET /api/traffic/by-country - By country, for the country graff
- GET /api/traffic/by-vehicle  - By vehicle, for the vehicle graff
- POST /api/traffic - crate new insert 
- PUT /api/traffic/:id - update by ID
- DELETE /api/traffic/:id - Delete by ID 

Protected routes need `Authorization: Bearer <token>` 
need be Sign IN if not you get 401 not authorised 
