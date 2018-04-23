/*
var socket = require('socket.io-client')('http://localhost:4000');

socket.on('connect', function(){
	console.log('connected!');
	socket.emit('admin');
	setTimeout(function(){
		socket.emit('data',{serialNumber: '546654654',lon: 59.5812886,lat: 36.3040583,speed: 0});
	},1000);
});
socket.on('event', function(data){
	console.log('event',data);
});
socket.on('message', function(data){
	console.log('message',data);
});
socket.on('disconnect', function(){
	console.log('disconnected!');
});
*/

var net = require('net');

var client = new net.Socket();
client.connect(33003, '127.0.0.1', function() {
	console.log('Connected');
	client.write("imei:868683028956377,tracker,180412105433,,F,072430.000,A,3616.7756,N,05932.2209,E,0.00,0,,0,0,0.00%,,;");
});

client.on('data', function(data) {
	console.log('Received: ' + data);
// 	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});
