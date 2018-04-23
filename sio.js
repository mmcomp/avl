var io = require('socket.io')();
var sockets = [];
io.on('connection', function(client){
	console.log('connected');
	client.id = sockets.length;
	client.isAdmin = false;
	sockets.push(client);
	client.on('admin',function(){
		client.isAdmin = true;
		console.log('admin',client.id);
	});
	client.on('data',function(data){
		if(client.isAdmin===true){
			client.broadcast.emit('message',data);
		}
// 		client.emit('message',data);//{serialNumber: '546654654',lon: 54.654654,lat: 36.654654});
	});
});
io.listen(4000);