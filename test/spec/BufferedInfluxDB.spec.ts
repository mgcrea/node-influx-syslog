import {FieldType, __mockedWritePoints} from 'influx';
import BufferedInfluxDB from '../../src/utils/BufferedInfluxDB';
import {waitFor} from '../utils';

const INFLUX_SCHEMA = {
  measurement: 'response_times',
  fields: {
    path: FieldType.STRING,
    duration: FieldType.INTEGER
  },
  tags: ['host']
};

describe('BufferedInfluxDB', () => {
  it('should properly export a class', () => {
    expect(BufferedInfluxDB).toBeDefined();
    expect(typeof BufferedInfluxDB).toBe('function');
  });
  describe('should properly connect', () => {
    const influx = new BufferedInfluxDB('http://localhost:8086/syslog', {debounceWait: 100});
    influx.addSchema(INFLUX_SCHEMA);
    beforeEach(() => {
      jest.resetAllMocks();
    });
    it('should only call parent writePoints after wait delay', async () => {
      await influx.writePoints([
        {
          measurement: 'response_times',
          tags: {host: 'foobar'},
          fields: {duration: 1000, path: '/foo/bar'}
        }
      ]);
      await waitFor(50);
      expect(influx['__stackedPoints'].length).toEqual(1);
      expect(influx['__stackedPoints']).toMatchSnapshot();
      expect(__mockedWritePoints).toHaveBeenCalledTimes(0);
      await waitFor(100);
      expect(influx['__stackedPoints'].length).toEqual(0);
      expect(influx['__stackedPoints']).toMatchSnapshot();
      expect(__mockedWritePoints).toHaveBeenCalledTimes(1);
    });
    it('should only call parent writePoints once after multiple writePoints', async () => {
      await influx.writePoints([
        {
          measurement: 'response_times',
          tags: {host: 'foobar'},
          fields: {duration: 1000, path: '/foo/bar'}
        }
      ]);
      await waitFor(10);
      await influx.writePoints([
        {
          measurement: 'response_times',
          tags: {host: 'foobar'},
          fields: {duration: 1000, path: '/foo/baz'}
        }
      ]);
      expect(influx['__stackedPoints'].length).toEqual(2);
      expect(influx['__stackedPoints']).toMatchSnapshot();
      expect(__mockedWritePoints).toHaveBeenCalledTimes(0);
      await waitFor(100);
      expect(influx['__stackedPoints'].length).toEqual(0);
      expect(influx['__stackedPoints']).toMatchSnapshot();
      expect(__mockedWritePoints).toHaveBeenCalledTimes(1);
    });
  });
});
