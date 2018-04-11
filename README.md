## Aetrapp Server

Node.js server, provides an API used by Aetrapp's [mobile](github.com/aetrapp/mobile) and [web](github.com/aetrapp/webapp) apps.

## Development

Requirements:

* Docker

### Configuration

Edit `NODE_CONFIG` enviroment varible at `docker-compose.yml` file. It contains a JSON string to change database credentials and other configs.

## API

Please refer to [FeathersJS docs](https://docs.feathersjs.com/api/databases/querying.html) to learn how to make queries to the API. Custom calls are described next.

### Traps

Order by city state and name ascending (use -1 for descending):

* http://localhost:3030/traps?$sort[city]=1


## Changelog

No releases yet.

## License

[GPL-3.0](LICENSE)
