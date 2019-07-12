// @NOTE https://jestjs.io/docs/en/manual-mocks.html

const d = (obj: any) => console.dir(obj, {depth: 10, colors: true});

const influx = jest.genMockFromModule('influx');

const __mockedWritePoints = jest.fn().mockImplementation(() => {
  d('writePoints');
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
