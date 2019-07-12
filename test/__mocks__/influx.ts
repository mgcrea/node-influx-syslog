// @NOTE https://jestjs.io/docs/en/manual-mocks.html
import {dir} from 'console';

const d = (obj: any) => dir(obj, {depth: 10, colors: true});

const influx = jest.genMockFromModule('influx');

const __mockedWritePoints = jest.fn().mockImplementation(() => {
  d('__mockedWritePoints');
});

export class InfluxDB {
  addSchema() {}
  async writePoints() {
    __mockedWritePoints();
  }
}

influx.InfluxDB = InfluxDB;
influx.__mockedWritePoints = __mockedWritePoints;

module.exports = influx;
