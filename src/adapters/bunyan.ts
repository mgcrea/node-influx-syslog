import {InfluxDB} from 'influx';
import Logger, {LogLevel as BunyanLogLevel} from 'bunyan';
import stripAnsi from 'strip-ansi';
import {IPoint as InfluxPoint} from 'influx';
import {SyslogLevel, SEVERITY_LEVEL_VALUES} from './syslog';
import through2 from 'through2';

export type BunyanLogObject = {
  level: BunyanLogLevel;
  msg: string;
  name: string;
  pid: string;
  time: Date;
  hostname: string;
  v?: number;
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
  const severity = getSyslogSeverityLevel(level);
  const tags = {severity, facility: name, hostname, host: hostname, appname: 'app'};
  const timestamp = `${time.getTime()}000000`;
  const fields = {
    version: 1,
    severity_code: SEVERITY_LEVEL_VALUES[severity],
    facility_code: 14, // console
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

const createSyslogWritableStream = (influx: InfluxDB) =>
  through2.obj((chunkObj: BunyanLogObject, _enc: string, callback: () => void) => {
    const syslogPoint = castSyslogInputPoint(chunkObj);
    influx.writePoints([syslogPoint]);
    callback();
  });

export default createSyslogWritableStream;
