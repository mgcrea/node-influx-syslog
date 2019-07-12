import {SYSLOG_SCHEMA} from '../../src/adapters/syslog';

describe('syslog', () => {
  it('should properly export a schema', () => {
    expect(SYSLOG_SCHEMA).toMatchSnapshot();
  });
});
