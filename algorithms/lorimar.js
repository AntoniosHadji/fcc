var assert = require('chai').assert

function sensorAnalysis(sensor_data){
  //your code here
  var mean = 0;
  for (i=0;  i<sensor_data.length; i++) {
    mean += sensor_data[i][1];
  }
  mean = mean / sensor_data.length;
  var sigma = 0;

  for (i=0;  i<sensor_data.length; i++) {
    sigma += Math.pow(sensor_data[i][1] - mean, 2);
  }
  sigma = Math.sqrt(sigma / (sensor_data.length - 1));
  return [Math.round(mean*10000)/10000, Math.round(sigma*10000)/10000];
}

sensorData1 = [['Distance:', 116.28, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 117.1, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 123.96, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 117.17, 'Meters', 'Sensor 5 malfunction =>lorimar']];
assert.deepEqual(sensorAnalysis(sensorData1), [118.6275, 3.5779], "Incorrect Answer");

sensorData2 = [['Distance:', 295.68, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 294.78, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 298.21, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 294.84, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 296.54, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 133.84, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 294.41, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 294.82, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 134.61, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 294.86, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.88, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.87, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.47, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 135.5, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.9, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.08, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 171.36, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.08, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.92, 'Meters', 'Sensor 5 malfunction =>lorimar'], ['Distance:', 170.88, 'Meters', 'Sensor 5 malfunction =>lorimar']];
assert.deepEqual(sensorAnalysis(sensorData2),[215.2265, 68.4014], "Incorrect Values");
