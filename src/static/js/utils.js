'use strict';

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

function renderGraph(deviceName) {
  var device = {
    'temperature': {
        label: 'temperature',
        borderColor: window.chartColors.red,
        data: [],
    },
    'humidity': {
        label: 'humidity',
        borderColor: window.chartColors.blue,
        data: [],
    },
    'pressure': {
        label: 'pressure(k)',
        borderColor: window.chartColors.green,
        data: [],
    }
  }
  var config = {
    type: 'line',
    data: {
      labels: [],
      datasets: [device['temperature'], device['humidity'], device['pressure']]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: deviceName + ' REALTIME MONITORING'
      },
      tooltips: {
        mode: 'index',
      },
      hover: {
        mode: 'index'
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Time'
          }
        }],
        yAxes: [{
          // stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Value'
          }
        }]
      }
    }
  };

  var ctx = document.getElementById('canvas-'+deviceName).getContext('2d');
  window.myLine[deviceName] = new Chart(ctx, config);

  // Create a client instance
  var client = new Paho.MQTT.Client("46.101.48.109", 9001, "realtime-js-demo-"+deviceName);

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("KKU/"+deviceName+"/#");
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    // onMessageArrived:{"info":{"ssid":"metallic-guppys","flash_size":4194304,"flash_id":"1640c8","chip_id":"12bf1e","sdk":"2.2.1(cfd48f3)","mac":"2c:3a:e8:12:bf:1e","id":"1228574","client_id":"1228574","device_id":"12bf1e","prefix":"KKU/","ip":"192.168.0.186","version":"v1.0.4"},"d":{"myName":"LATTE-002","millis":19696649,"temperature":30.78,"humidity":38.89,"pressure":100960,"relayState":1,"updateInterval":1000,"A0":821,"heap":39392,"rssi":-48,"counter":19686,"subscription":1}}
    // console.log("onMessageArrived:"+message.payloadString);
    var data = {};
    try{
      data = JSON.parse(message.payloadString);
    } catch (err) {
      console.log('error:', err)
    }

    if (data.d) {
      device['temperature'].data.push(data.d.temperature);
      device['humidity'].data.push(data.d.humidity);
      device['pressure'].data.push(data.d.pressure/1000);
      config.data.labels.push(moment().format("HH:MM:SS"));
      window.myLine[deviceName].update();
    }
  }


  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // connect the client
  client.connect({onSuccess:onConnect});
}