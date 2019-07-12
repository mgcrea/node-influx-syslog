import {SEVERITY_LEVEL_VALUES, SYSLOG_SCHEMA} from '../../src/adapters/syslog';

describe('syslog', () => {
  it('should properly export a schema', () => {
    expect(SEVERITY_LEVEL_VALUES).toMatchSnapshot();
  });
  it('should properly export a schema', () => {
    expect(SYSLOG_SCHEMA).toMatchSnapshot();
  });
});
