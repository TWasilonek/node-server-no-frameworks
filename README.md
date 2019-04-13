# Node.js http server without frameworks
This is a simple http server using CRUD services written in pure Node.js without the use of any external frameworks.


## Features   
✅ Node.js
✅ CRUD actions
✅ Simple JWT authentication
✅ Login and Register routes


## Getting Started   
1. Clone project   

```
git clone https://github.com/TWasilonek/node-express-customers-app.git
```

2. Change into node-server-no-frameworks directory   

```
cd node-server-no-frameworks
```

3. Start the project

```
npm start
```


## Routes

**Customers**
```
POST /customers => create customer
Don't require any specific model, 
you can send a simple JSON payload of random key/value pairs.
```
```
GET /customers
```
```
GET /customer/:id
```
```
PUT /customers/:id => update customer
Payload same as in POST
```
```
DELETE /customers/:id
```

**Aath**
```
POST /register

Payload:
{string} email 
{string} username
{string} firstName
{string} password

Returns JWT token
```

```
POST /login

Payload:
{string} username 
{string} password
```

**Users**
All routes are protected, so you need to include an `Authorization` header with the JWT token

```
GET /users
```
```
GET /users/:username
```
```
PUT /users/:username

Payload (no fields are required):
{string} email 
{string} username
{string} firstName
{string} password
```
```
DELETE /users/:username
```



