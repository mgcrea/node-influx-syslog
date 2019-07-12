import * as influxSyslog from '../../src';

describe('influxSyslog', () => {
  it('should expose a stable API', () => {
    expect(influxSyslog).toBeDefined();
    expect(influxSyslog).toMatchSnapshot();
  });
});
