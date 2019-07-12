import {InfluxDB, ISingleHostConfig, IClusterConfig} from 'influx';
import Logger, {
  LoggerOptions as BunyanLoggerOptions,
  createLogger as createBunyanLogger,
  LogLevel as BunyanLogLevel
} from 'bunyan';
import stripAnsi from 'strip-ansi';
import {IPoint as InfluxPoint} from 'influx';
import {SyslogLevel, SEVERITY_LEVEL_VALUES, SYSLOG_SCHEMA} from './syslog';
import through2 from 'through2';
import BufferedInfluxDB from 'src/utils/BufferedInfluxDB';

export type BunyanLogObject = {
  level: BunyanLogLevel;
  msg: string;
  name: string;
  pid: string;
  time: Date;
  hostname: string;
  v?: number;
  appname?: string;
  facility?: string;
};

export const getSyslogSeverityLevel = (level: BunyanLogLevel): SyslogLevel => {
  switch (level) {
    case Logger.TRACE:
      return 'debug';
    case Logger.DEBUG:
      return 'debug';
    case Logger.INFO:
      return 'info';
    case Logger.WARN:
      return 'warning';
    case Logger.ERROR:
      return 'err';
    case Logger.FATAL:
      return 'crit';
    default:
      throw new Error(`Unhandled log level=${level}`);
  }
};

export const castSyslogInputPoint: (o: BunyanLogObject) => InfluxPoint = logObject => {
  const {time, level, name, pid, msg, hostname} = logObject;
  const {appname = 'app', facility = 'facility'} = logObject;
  const severity = getSyslogSeverityLevel(level);
  const tags = {severity, appname, facility, hostname, host: hostname};
  const timestamp = `${time.getTime()}000000`;
  const fields = {
    version: 1,
    severity_code: SEVERITY_LEVEL_VALUES[severity], // eslint-disable-line @typescript-eslint/camelcase
    facility_code: 14, // eslint-disable-line @typescript-eslint/camelcase
    timestamp,
    procid: pid,
    message: stripAnsi(msg)
  };
  return {
    measurement: 'syslog',
    tags,
    fields
  };
};

export const createSyslogStream = (influx: InfluxDB) =>
  through2.obj((chunkObj: BunyanLogObject, _enc: string, callback: () => void) => {
    const syslogPoint = castSyslogInputPoint(chunkObj);
    influx.writePoints([syslogPoint]);
    callback();
  });

export const createLogger = (
  {streams = [], ...bunyanOptions}: BunyanLoggerOptions,
  {schema = [], ...influxOptions}: ISingleHostConfig | IClusterConfig
): Logger => {
  const influx = new BufferedInfluxDB({
    schema: [...schema, SYSLOG_SCHEMA],
    ...influxOptions
  });
  return createBunyanLogger({
    streams: [
      ...streams,
      {
        stream: createSyslogStream(influx),
        level: 'trace',
        type: 'raw'
      }
    ],
    ...bunyanOptions
  });
};
