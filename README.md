# What is RED
It's a concept project in which the EventEmitter paradigm has been applied to a PERN Stack (PostgreSQL, Express.js, React.js, Node.js).
- When a change on a table of the database occours, a notification is emitted.
- A BackEnd Express.js Server application (subscribed to PostgreSQL) receives the notification, re-elaborate it and emits a notification.
- A FrontEnd React.js WebApp is connected to Express.js through a WebSocket and listens for notifications. When the notification comes, the Hook updates the state.

For the Backward channel an API has been defined into the Express.js BackEnd application: the React.js FrontEnd application makes http requests to the Express.js BackEnd through the API, the Express.js BackEnd interact with the DB and answers to the FrontEnd.  

# Getting Started
You need a Postgres database running

configure your preferences in `server\src\DB\db_config.js`
configure your preferences in `server\src\App\app_config.js`

## Available Scripts

In the client directory, you can run:

### `npm install`
### `npm start`

In the server directory, you can run:

### `npm install`
### `npm run watch`