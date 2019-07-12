import {FieldType} from 'influx';

export type SyslogLevel = 'emerg' | 'alert' | 'crit' | 'err' | 'warning' | 'notice' | 'info' | 'debug';

export const SEVERITY_LEVEL_VALUES: {[s in SyslogLevel]: number} = {
  emerg: 0,
  alert: 1,
  crit: 2,
  err: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7
};

export const SYSLOG_SCHEMA = {
  measurement: 'syslog',
  fields: {
    version: FieldType.INTEGER,
    severity_code: FieldType.INTEGER, // eslint-disable-line @typescript-eslint/camelcase
    facility_code: FieldType.INTEGER, // eslint-disable-line @typescript-eslint/camelcase
    timestamp: FieldType.INTEGER,
    procid: FieldType.STRING,
    // msgid: FieldType.STRING,
    message: FieldType.STRING
    // sdid: FieldType.BOOLEAN
  },
  tags: ['severity', 'facility', 'host', 'hostname', 'appname']
};
