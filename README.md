# Node.js Influx Syslog

[![npm version](https://img.shields.io/npm/v/influx-syslog.svg)](https://github.com/mgcrea/node-influx-syslog/releases)
[![license](https://img.shields.io/github/license/mgcrea/node-influx-syslog.svg?style=flat)](https://tldrlegal.com/license/mit-license)
[![build status](https://travis-ci.com/mgcrea/node-influx-syslog.svg?branch=master)](https://travis-ci.com/mgcrea/node-influx-syslog)
[![dependencies status](https://david-dm.org/mgcrea/node-influx-syslog/status.svg)](https://david-dm.org/mgcrea/node-influx-syslog)
[![devDependencies status](https://david-dm.org/mgcrea/node-influx-syslog/dev-status.svg)](https://david-dm.org/mgcrea/node-influx-syslog?type=dev)
[![coverage](https://codecov.io/gh/mgcrea/node-influx-syslog/branch/master/graph/badge.svg)](https://codecov.io/gh/mgcrea/node-influx-syslog)

Easily forward [Node.js](https://nodejs.org/en/) logs to an [InfluxDB](https://github.com/influxdata/influxdb) instance using the [Syslog Protocol](https://tools.ietf.org/html/rfc5424) to analyze aggregated results with [Chronograf](https://github.com/influxdata/chronograf).

Originally built to properly monitor [scalable Kubernetes deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#scaling-a-deployment) & micro-services.

[![Banner](https://mgcrea.github.io/node-influx-syslog/images/log-viewer-overview.png)](https://docs.influxdata.com/chronograf/v1.7/guides/analyzing-logs/)

- Uses [bunyan](https://github.com/trentm/node-bunyan) writeable streams as a logger interface.

- Relies on [node-influx](https://github.com/node-influx/node-influx) to connect and write to the InfluxDB instance.

- Provides basic writes batching to InfluxDB thanks to a custom sublass [`BufferedInfluxDB`](https://github.com/mgcrea/node-influx-syslog/blob/master/src/utils/BufferedInfluxDB.ts).

- Built with [TypeScript](https://www.typescriptlang.org/) for static type checking with exported types along the library.

## Documentation

### Installation

```bash
yarn add influx-syslog
# or
npm install influx-syslog
```

### Examples

#### Simple example

You can use the provided factory function to quickly get a working logger.

Will use debounced writes to InfluxDB by default (with `BufferedInfluxDB`).

```js
import createLogger from 'influx-syslog';

const log = createLogger(
  // Bunyan options
  {
    name: 'myLogger',
    streams: [
      // optional: also log to stderr
      {
        stream: process.stderr,
        level: 'debug'
      }
    ]
  },
  // InfluxDB constructor options
  {
    host: 'localhost',
    database: 'syslog_db'
  }
);

log.info('hi');
```

#### Advanced example

You might want to setup both the influx instance and buyan logger yourself.

```js
import {createLogger} from 'bunyan';
import {InfluxDB} from 'influx';
import {createSyslogStream, SYSLOG_SCHEMA} from 'influx-syslog';

const influx = new InfluxDB({
  host: 'localhost',
  database: 'syslog_db',
  schema: [SYSLOG_SCHEMA]
});

const log = createLogger({
  name: 'myLogger',
  streams: [
    {
      stream: process.stderr,
      level: 'debug'
    },
    {
      stream: createSyslogStream(influx),
      level: 'trace',
      type: 'raw'
    }
  ]
});

log.info('hi');
```

#### Advanced example with debounced writes to InfluxDB

You can also use `BufferedInfluxDB` class instead to automatically batch writes to InfluxDB every `debounceWait` ms.

```js
import {createLogger} from 'bunyan';
import {createSyslogStream, SYSLOG_SCHEMA, BufferedInfluxDB} from 'influx-syslog';

const influx = new BufferedInfluxDB(INFLUXDB_URI, {debounceWait: 1000});
influx.addSchema(SYSLOG_SCHEMA);

const log = createLogger({
  name: 'myLogger',
  streams: [
    {
      stream: process.stderr,
      level: 'debug'
    },
    {
      stream: createSyslogStream(influx),
      level: 'trace',
      type: 'raw'
    }
  ]
});

log.info('hi');
```

### External links

- [Analyzing logs with Chronograf](https://docs.influxdata.com/chronograf/v1.7/guides/analyzing-logs/)

### Available scripts

| **Script**    | **Description**              |
| ------------- | ---------------------------- |
| start         | alias to `spec:watch`        |
| test          | Run all tests                |
| spec          | Run unit tests               |
| spec:coverage | Run unit tests with coverage |
| spec:watch    | Watch unit tests             |
| lint          | Run eslint static tests      |
| pretty        | Run prettier static tests    |
| build         | Compile the library          |
| build:watch   | Watch compilation            |

## Authors

**Olivier Louvignes**

- http://olouv.com
- http://github.com/mgcrea

## License

```
The MIT License

Copyright (c) 2019 Olivier Louvignes <olivier@mgcrea.io>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
