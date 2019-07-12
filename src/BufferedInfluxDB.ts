import {InfluxDB, IPoint, IWriteOptions} from 'influx';
import debounce from 'lodash.debounce';

import withUniqueTimestamps from 'src/utils/withUniqueTimestamps';

type BufferedInfluxDBOptions = {wait?: number; maxWait?: number};

class BufferedInfluxDB extends InfluxDB {
  private __stackedPoints: IPoint[];
  constructor(options: any, {wait = 1000}: BufferedInfluxDBOptions = {}) {
    super(options);
    this.__stackedPoints = [];
    this.__debouncedFlushPoints = debounce(this.__flushPoints, wait, {maxWait: wait});
  }
  async writePoints(points: IPoint[], options?: IWriteOptions): Promise<void> {
    this.__stackedPoints.push(...points);
    this.__debouncedFlushPoints(options);
  }
  async __flushPoints(options?: IWriteOptions): Promise<void> {
    const stackedPointsSoFar = this.__stackedPoints.splice(0, this.__stackedPoints.length);
    const uniqueStackedPoints = withUniqueTimestamps(stackedPointsSoFar);
    try {
      return await super.writePoints(uniqueStackedPoints, options);
    } catch (err) {
      // Restore stack on error
      this.__stackedPoints.unshift(...stackedPointsSoFar);
      throw err;
    }
  }
  // typings
  async __writePoints(_points: IPoint[], _options?: IWriteOptions): Promise<void> {}
  async __debouncedFlushPoints(_options?: IWriteOptions): Promise<void> {}
}

export default BufferedInfluxDB;
