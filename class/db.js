var moment = require('moment-jalaali');
module.exports = class db {
  constructor(url,dbase) {
    this.url = url;
    this.dbase = dbase;
    this.db = null;
    this.dbo = null;
  }
  
  connect(){
    let MongoClient = require('mongodb').MongoClient;
    let url = this.url;
    let dbase = this.dbase;
    return new Promise(
    function (resolve, reject) {
        MongoClient.connect(url, function(err, db) {
          if (err) {
            reject(err);
          }else{
            let dbo = db.db(dbase);
            let out = {db:db,dbo:dbo};
            resolve(out);
          }
        });
    });
  }

  disconnect(){
    if(this.db){
      this.db.close();
      return new Promise(
      function (resolve, reject) {
        resolve(true);
      });
    }else{
      return new Promise(
      function (resolve, reject) {
        reject('Not Connected');
      });
    }
  }
  
  getCars(){
    if(this.dbo){
      let dbo = this.dbo;
      return new Promise(
      function (resolve, reject) {
        dbo.collection("cars").find().toArray(function(err,result){
          if (err) {
            reject(err);
          }else{
            resolve(result);            
          }
        });
      });
    }
  }
  
  getSerialNumber(fserialNumber){
    if(this.dbo){
      let dbo = this.dbo;
      return new Promise(
      function (resolve, reject) {
        dbo.collection("points").find({serialNumber:fserialNumber}).sort({_id:-1}).limit(1).toArray(function(err,result){
          if (err) {
            reject(err);
          }else{
            resolve(result);            
          }
        });
      });
    }else{
      return new Promise(
      function (resolve, reject) {
        reject('Not Connected');
      });
    }
  }
  
  getSerialData(fserialNumber){
    if(this.dbo){
      let dbo = this.dbo;
      return new Promise(
      function (resolve, reject) {
        dbo.collection("cars").find({serialNumber:fserialNumber}).sort({_id:-1}).limit(1).toArray(function(err,result){
          if (err) {
            reject(err);
          }else{
            resolve(result);            
          }
        });
      });
    }else{
      return new Promise(
      function (resolve, reject) {
        reject('Not Connected');
      });
    }
  }
  

  getSerials(loadData){
    function convTime(inp){
      var options = {
          timeZone: "Asia/Tehran",
          year: 'numeric', month: 'numeric', day: 'numeric',
          hour: 'numeric', minute: 'numeric', second: 'numeric'
      };

      var formatter = new Intl.DateTimeFormat([], options);

      var UTCTime = inp;
      var localTime = formatter.format(new Date(UTCTime));
      var currentTime = formatter.format(new Date()); 

      return localTime;
    }
    loadData = (loadData)?loadData:false;
    if(this.dbo){
      let dbo = this.dbo;
      return new Promise(
      function (resolve, reject) {
        dbo.collection("points").aggregate([{$match: {}},{ 
          $sort: { 
            "regdate": 1
          } 
        }, {
          $group:{
            _id: '$serialNumber',
            value: {
              "$first" : "$value"
            },
            regdate : {
              "$last" : "$regdate"
            }
          },
        },{
          $lookup:
          {
            from: "cars",
            localField: "_id",
            foreignField: "serialNumber",
            as: "serialData"
          }
        }]).toArray(function(err,result){
          if (err) {
            reject(err);
          }else{
            let da;
            for(var i = 0;i < result.length;i++){
              da = result[i];
              result[i].localRegDate =  convTime(da.regdate);
              da = moment(result[i].localRegDate);
              result[i].pdate = da.format('jYYYY/jM/jD HH:mm:ss');
            }
            resolve(result);            
          }
        });
      });
    }else{
      return new Promise(
      function (resolve, reject) {
        reject('Not Connected');
      });
    }
  }
  
  addPoint(data) {
    if(this.dbo){
      let dbo = this.dbo;
      return new Promise(
      function (resolve, reject) {
        dbo.collection("points").insertOne(data, function(err, res) {
          if (err) {
            reject(err);
          }else{
            resolve(true);            
          }
        });
      });
    }else{
      return new Promise(
      function (resolve, reject) {
        reject('Not Connected');
      });
    }
  }
};