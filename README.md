## AeTrapp API Service 

Node.js backend for the AeTrapp platform.

## Quick Start

The easiest way to run the API server locally is using Docker. Install it and run:

    docker-compose up  

It will run migrations and start the service at http://localhost:3030.

## Testing

Init PostgreSQL service:

    yarn testdb

When the service is ready, migrate database and seed:

    ./node_modules/.bin/sequelize db:migrate --url 'postgresql://aetrapp:aetrapp@localhost:15433/aetrapp'
    ./node_modules/.bin/sequelize db:seed:all --url 'postgresql://aetrapp:aetrapp@localhost:15433/aetrapp'

Install dependencies:

    yarn

Run tests:

    yarn test    

## License

[GPL-3.0](LICENSE)
