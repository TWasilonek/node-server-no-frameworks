# Node.js http server without frameworks
This is a simple http server using CRUD services written in pure Node.js without the use of any external frameworks.


## Features   
✅ Node.js

✅ CRUD actions

✅ Simple JWT authentication

✅ Login and Register routes


## Requirements 
Latest Node.js version.


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

3. Adding HTTPS support

If you want to use https, you can uncomment the https server code in `index.js`.
To make it work:
```
1. $ mkdir https
2. $ cd https
3. $ openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
The above commands will result in having the necessary `key.pem` and `cert.pem` files needed to start the https server.


## Routes

**Customers**
```
POST /customers => create customer
Doesn't require any specific model, 
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



