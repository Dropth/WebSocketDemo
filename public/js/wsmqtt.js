/**
 * Created by af121111 on 21/11/16.
 */

const SensorType = {
    pos: 'POSITIVE_NUMBER',
    per:'PERCENT',
    onof:'ON_OFF',
    opcl:'OPEN_CLOSE',
}
let cpt=0;

var wsbroker = document.getElementById("adresse").value;//"127.0.0.1";  //mqtt websocket enabled broker
var wsport = parseInt(document.getElementById("port").value);// port for above

var client = new Paho.MQTT.Client(wsbroker, wsport,
    "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {

    let s = createSensor(message.destinationName, message.payloadString);

    var test = document.getElementById("messages");
    var line ='';
    line += "<tr>";
    line += "<td>";
    line += message.destinationName + " -- " + message.payloadString;
    line += "</td>";
    line += "<td>";
    line += s.toString();
    line += "</td>";
    line += "</tr>";

    test.innerHTML=test.innerHTML + line;
};
var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");

        client.subscribe(document.getElementById("sub").value, {qos: 1});

        let table = document.getElementById("tabMes");
        let string ='';
        string += "<thead>";
        string += "<tr>";
        string += "<th>Message</th>";
        string += "<th>Sensor</th>";
        string += "</tr>";
        string += "</thead>";
        string += "<tbody id=\"messages\"></tbody>";

        table.innerHTML=table.innerHTML + string;

    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};
function init() {

    document.getElementById("unsub").type = "Button";
    document.getElementById("deco").type = "Button";
    document.getElementById("submit").type = "hidden";
    document.getElementById("adresse").disabled = true;
    document.getElementById("port").disabled = true;
    document.getElementById("sub").disabled = true;
    client.connect(options);
}

function decoClose() {

    window.location.reload(false);
}

function unSub() {

    client.unsubscribe(document.getElementById("sub").value);
    document.getElementById("sub").disabled = false;
    document.getElementById("btnSub").type = "Button";
    document.getElementById("unsub").type = "hidden";
}

function subTopic() {

    client.subscribe(document.getElementById("sub").value, {qos: 1});
    document.getElementById("sub").disabled = true;
    document.getElementById("btnSub").type = "hidden";
    document.getElementById("unsub").type = "Button";
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
