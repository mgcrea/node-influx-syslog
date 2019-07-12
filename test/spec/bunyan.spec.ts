import Logger from 'bunyan';
import {castSyslogInputPoint, BunyanLogObject} from '../../src/adapters/bunyan';

describe('bunyan', () => {
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
});
