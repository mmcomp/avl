process.env.TZ = 'Asia/Tehran'
var socketIOClient = require('socket.io-client')('http://localhost:4000');
var net = require('net');
var db = require('./class/db.js');
var dbObj = new db("mongodb://localhost:27017/","gps");
var dbok = false;
dbObj.connect().then(out => {
	dbObj.db = out.db;
	dbObj.dbo = out.dbo;
	dbok = true;
}).catch(err => {
});
socketIOClient.on('connect', function(){
	console.log('Socket.IO connected!');
	socketIOClient.emit('admin');
// 	setTimeout(function(){
// 		socket.emit('data',{serialNumber: '546654654',lon: 59.5812886,lat: 36.3040583,speed: 0});
// 	},1000);
});
function convertCords(inp){
// 	let out = String(parseFloat(inp)/100);
	let degree = parseInt(parseFloat(inp)/100,10);
	let minute = parseFloat(inp)-(degree*100);
	let out = String(degree+(minute/60));
	return out;
}
var server = net.createServer(function(socket) {
// 	socket.read()
// 	console.log('Tcp Server Started!');
	socket.on('error',function(err){
// 		console.log('Error :',err);
		socket.destroy();
	});
	socket.on('data', function (data) {
// 		console.log('data');
// 		console.log(data);
		data = ""+data+"";
		let predata = data;
		let currentDate = new Date();
    let theSerialNumber = '';
		data = data.split(',');
		if(data.length==3 && data[2]=='A;'){
			//LOGIN
      
			socket.write('LOAD');
		}else if(data.length==1){
// 			if(predata.indexOf('imei:868683028956377')>=0){
// 			}else{
			socket.write('ON');
      socket.write('**,imei:'+predata.split(';')[0]+',101');
      console.log('**,imei:'+predata.split(';')[0]+',101')
// 			}
		}
    

// 		if(serialNumber=='868683028795197'){
		console.log('data recieved['+socket.remoteAddress+']:',currentDate.toLocaleString(),predata);
// 			socket.write('##,'+serialNumber+',100');
// 		}
		console.log(data);
		if(data.length>=10 && data[2]!=='' && data[4]!=='L' && predata.indexOf('imei:')===0){
      theSerialNumber = predata.split(',')[0].split(':')[1];			
			data = {
				data : predata,
				lon : convertCords(data[9]),
				lat : convertCords(data[7]),
				serialNumber : theSerialNumber,
				speed : data[11],
				regdate : new Date()
			};
			socketIOClient.emit('data',data);
			console.log('recieved :',data);
			if(dbok){
				dbObj.addPoint(data).then(out => {
				}).catch(err => {
				});
			}
		}
		
	});
});

// var io = require('socket.io')(server);
// io.on('connection', function(){
// 	console.log('io connect');
// });

server.listen(33003);


//------------------MONGODB------------------
/*
var db = require('./class/db.js');
var dbObj = new db("mongodb://localhost:27017/","gps");
dbObj.connect().then(out => {
	dbObj.db = out.db;
	dbObj.dbo = out.dbo;
	console.log('connected!');
	dbObj.addPoint({ lon: 36.65435435, lat: 56.464654654, regtime: "2018-02-25 10:14:00" }).then(out => {
		console.log('inserted!');
	}).catch(err => {
		console.log('Error Inserting : ',err);
	}).then(function(){
		dbObj.disconnect().then(res => {
			console.log('Disconnected!')
		}).catch(err => {
			console.log('Error Disconnecting : ',err);
		});
	});
}).catch(err => {
	console.log('Error Connecting : ',err);
});
console.log(dbObj);
*/
/*
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/", function(err, db) {
  if (err) throw err;
  var dbo = db.db("gps");
  var myobj = { lon: 36.65435435, lat: 56.464654654, regtime: "2018-02-25 10:14:00" };
  dbo.collection("points").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
*/