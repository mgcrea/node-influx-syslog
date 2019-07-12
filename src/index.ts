import {createLogger, createSyslogStream} from './adapters/bunyan';
import {SYSLOG_SCHEMA} from './adapters/syslog';
import BufferedInfluxDB from './utils/BufferedInfluxDB';

export {SYSLOG_SCHEMA, BufferedInfluxDB, createSyslogStream};

export default createLogger;
