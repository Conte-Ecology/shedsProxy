# SHEDS Proxy Application

This web application acts as a proxy for the individual SHEDS applications.

## Configuration

The proxy server configuration is defined in a `config.js` file. An example of this file is provided at `config_example.js`. For security purposes, the actual `config.js` file is not added to this repo.

The configuration includes two properties:

- `port`: the port that the proxy server will listen on
- `maintenance`: boolean flag to enable maintenance mode
- `router`: a router table with keys being the incoming `host:port` and values being the target address. Note that the target address must be fully qualified (e.g. include `http://`)

## Logging

The proxy server uses `bunyan` to create JSON logs which are sent to `stdout` and `stderr`. These streams can then be written to log files using `pm2`.

```
pm2 start app.js --name sheds-proxy
```
