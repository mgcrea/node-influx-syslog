import createBunyanSyslogStream from './adapters/bunyan';
import {SYSLOG_SCHEMA} from './adapters/syslog';
import BufferedInfluxDB from './BufferedInfluxDB';

export {SYSLOG_SCHEMA, BufferedInfluxDB, createBunyanSyslogStream};

export default createBunyanSyslogStream;
