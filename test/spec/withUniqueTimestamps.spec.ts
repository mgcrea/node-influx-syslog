import withUniqueTimestamps from 'src/utils/withUniqueTimestamps';
import {IPoint} from 'influx';

describe('withUniqueTimestamps', () => {
  it('should properly export a class', () => {
    expect(withUniqueTimestamps).toBeDefined();
    expect(typeof withUniqueTimestamps).toBe('function');
  });
  it('should properly order points by nanoseconds', () => {
    const timestamp = `${new Date(1562361784183).getTime()}000000`;
    const points: IPoint[] = [{fields: {timestamp}}, {fields: {timestamp}}, {fields: {timestamp}}];
    expect(withUniqueTimestamps(points)).toMatchSnapshot();
  });
  it('should properly order points by nanoseconds 2', () => {
    const timestamp = `${new Date(1562361784183).getTime()}000123`;
    const points: IPoint[] = [{fields: {timestamp}}, {fields: {timestamp}}, {fields: {timestamp}}];
    expect(withUniqueTimestamps(points)).toMatchSnapshot();
  });
  it('should properly order points by nanoseconds 3', () => {
    const timestampA = `${new Date(1562361784183).getTime()}000123`;
    const timestampB = `${new Date(1562361784183).getTime()}000456`;
    const timestampC = `${new Date(1562361784185).getTime()}000789`;
    const points: IPoint[] = [
      {fields: {timestamp: timestampA}},
      {fields: {timestamp: timestampA}},
      {fields: {timestamp: timestampB}},
      {fields: {timestamp: timestampC}},
      {fields: {timestamp: timestampC}},
      {fields: {timestamp: timestampC}}
    ];
    expect(withUniqueTimestamps(points)).toMatchSnapshot();
  });
});
