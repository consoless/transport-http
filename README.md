[![Build Status](https://img.shields.io/travis/consoless/transport-http/master.svg)](https://travis-ci.org/consoless/transport-http)
[![Coverage](https://img.shields.io/codecov/c/github/consoless/transport-http/master.svg)](https://codecov.io/gh/consoless/transport-http)
[![Dependencies](https://img.shields.io/david/consoless/transport-http.svg)](https://david-dm.org/consoless/transport-http)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/consoless/transport-http)

# Transport Http

Sends message over the network.

## Install

```
$ npm install --save @consoless/transport-http
or
$ yarn add @consoless/transport-http
```

## Usage (TBD)

## API

#### config

Type: `object`<br>
Default: 
```javascript
{
  fieldsMap: null,
  method: 'GET',
  suppressRemoteErrors: true,
  url: null
}
```

Config object represents parameters which is used to send log message to remote server.

> url

Request url where message bag will be sent.

> method

Http method to use for request. Can be `GET` (default) or `POST`. According to method, message will be send in different ways.
In case if method is `GET` message bag will be send as query parameters, e.g.:

`http://localhost?l=error&m=hello%20world&to=3`

If the method is `POST` then data is send as json string and `Content-type: application/json` is added to request headers, e.g.:

`{"l":"error","m":"hello world","to":3}` 

> fieldsMap

Defines the names of query parameters. Example: 

```javascript
{
  level: 'level',
  message: 'message',
  timeOffset: 'timeOffset'
}
```

Default values are:

```javascript
{
  level: 'l',
  message: 'm',
  timeOffset: 'to'
}
```

> suppressRemoteErrors

By default all the errors produced by request are suppressed and messages don't guaranteed to be sent. To throw errors set this option to `false`.

## License

MIT © [Alexey Lizurchik](https://github.com/likerRr)
