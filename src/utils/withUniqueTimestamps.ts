import {IPoint} from 'influx';
import padStart from 'lodash.padstart';

const withUniqueTimestamps = (points: IPoint[]): IPoint[] => {
  const initialValue: {
    uniquePoints: IPoint[];
    lastTimestamp: number;
    currentNanoSecond: number;
  } = {uniquePoints: [], lastTimestamp: 0, currentNanoSecond: 0};

  const {uniquePoints} = points.reduce((soFar, value) => {
    // Only process fields with timestamps
    if (!value.fields || !value.fields.timestamp) {
      return soFar;
    }
    const {timestamp} = value.fields;
    // Order messages by "virtual" nano-seconds
    if (timestamp === soFar.lastTimestamp) {
      soFar.currentNanoSecond += 1;
    } else {
      soFar.currentNanoSecond = parseInt(timestamp.slice(-6), 10);
    }
    value.timestamp = `${timestamp.slice(0, -6)}${padStart(soFar.currentNanoSecond.toString(), 6, '0')}`;
    soFar.uniquePoints.push(value);
    soFar.lastTimestamp = timestamp;
    return soFar;
  }, initialValue);

  return uniquePoints;
};

export default withUniqueTimestamps;
