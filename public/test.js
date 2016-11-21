var wsbroker = "127.0.0.1";  //mqtt websocket enabled broker
var wsport = 8080;// port for above
var client = new Paho.MQTT.Client(wsbroker, wsport,
    "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {

    var messages = document.querySelector('#messages');
    var line;
    line = document.createElement('li');
    line.textContent = message.destinationName+ ' -- '+ message.payloadString;
    messages.appendChild(line);

    console.log(message.destinationName, ' -- ', message.payloadString);
};
var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topic, you can add multile lines of these
        client.subscribe('value/#', {qos: 1});

        //use the below if you want to publish to a topic on connect
        /*message = new Paho.MQTT.Message("Hello");
        message.destinationName = "value/#" +
            "";
        client.send(message);*/

    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};
function init() {
    client.connect(options);
}