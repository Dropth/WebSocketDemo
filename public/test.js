/*import  { OpenClose }  from 'object';
import  { OnOff }  from 'object';
import  { Positive }  from 'object';
import  { Percent }  from 'object';
import  { Datum }  from 'object';*/

const SensorType = {
    pos: 'POSITIVE_NUMBER',
    per:'PERCENT',
    onof:'ON_OFF',
    opcl:'OPEN_CLOSE',
}

/**
 * Created by af121111 on 21/11/16.
 */



let cpt=0;

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
    line.textContent = message.destinationName+ ' -- ' + message.payloadString;

    let s = createSensor(message.destinationName, message.payloadString);

    line.textContent += "  ---> Création du Sensor : " + s.toString();

    //console.log(s.getType());

    messages.appendChild(line);

    //console.log(message.destinationName, ' -- ', message.payloadString);
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

function createSensor(nom,data) {

    var obj = JSON.parse(data);

    let id = cpt++;
    let name = nom.split("/")[1];
    let res;
    let dat = new Datum(obj.value);
    switch (obj.type) {
        case SensorType.pos:
            res = new Positive(id, name, obj.type, dat);
            //
            break;
        case SensorType.per:
            res = new Percent(id, name, obj.type, dat);
            break;
        case SensorType.onof:
            res = new OnOff(id, name, obj.type, dat);
            break;
        case SensorType.opcl:
            res = new OpenClose(id, name, obj.type, dat);
            break;
        default:
            throw {name: 'SensorType', message: 'Le type transmis n\'est pas reconnu'};
    }

    Object.assign(res.data, dat);
    return res;

}
