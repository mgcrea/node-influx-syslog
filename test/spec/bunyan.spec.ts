import Logger from 'bunyan';
import {
  castSyslogInputPoint,
  BunyanLogObject,
  getSyslogSeverityLevel,
  createSyslogStream
} from '../../src/adapters/bunyan';
import {InfluxDB} from 'influx';

describe('bunyan', () => {
  describe('getSyslogSeverityLevel', () => {
    it('should properly export a class', () => {
      expect(getSyslogSeverityLevel).toBeDefined();
      expect(typeof getSyslogSeverityLevel).toBe('function');
    });
    it('should properly get a syslog levels', () => {
      expect([
        getSyslogSeverityLevel(Logger.TRACE),
        getSyslogSeverityLevel(Logger.DEBUG),
        getSyslogSeverityLevel(Logger.INFO),
        getSyslogSeverityLevel(Logger.WARN),
        getSyslogSeverityLevel(Logger.ERROR),
        getSyslogSeverityLevel(Logger.FATAL)
      ]).toMatchSnapshot();
    });
  });
  describe('castSyslogInputPoint', () => {
    it('should properly export a class', () => {
      expect(castSyslogInputPoint).toBeDefined();
      expect(typeof castSyslogInputPoint).toBe('function');
    });
    it('should properly cast a syslog point', () => {
      const logObject: BunyanLogObject = {
        time: new Date(1562361784183000000),
        level: Logger.DEBUG,
        name: 'fooname',
        facility: 'foofacility',
        pid: '1',
        msg: 'bazqux',
        hostname: 'hostname'
      };
      expect(castSyslogInputPoint(logObject)).toMatchSnapshot();
    });
  });
  describe('createSyslogStream', () => {
    const influx = new InfluxDB('http://localhost:8086/syslog');
    it('should properly export a class', () => {
      expect(createSyslogStream).toBeDefined();
      expect(typeof createSyslogStream).toBe('function');
    });
    it('should properly create a stream', () => {
      const writableStream = createSyslogStream(influx);
      expect(typeof writableStream).toBe('object');
      expect(writableStream).toMatchSnapshot();
    });
  });
});
