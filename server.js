var express = require("express");
var multer  = require('multer');
var AdmZip  = require('adm-zip');
var fs      = require("fs");
var app     = express(); 
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var zip, fileName, zipEntries;

var upload = multer({ storage : storage}).single('userUpload');
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.post('/',function(req,res){
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }
    var filesize = req.file.size / 1000;
    fileName = req.file.filename;
    console.log("file size in KB: " + filesize);
    zip = new AdmZip("./uploads/"+ fileName);
    zipEntries = zip.getEntries();
    zipEntries.forEach(function(zipEntry) {
        console.log(zipEntry.toString()); // outputs zip entries information 
        if (zipEntry.entryName == "fileName") {
            console.log(zipEntry.data.toString('utf8')); 
        }
    });
   // console.log(zip.readAsText("some_folder/my_file.txt")); 
   zip.extractAllTo("./uploads", true);
    res.end("done");
  });
});

app.listen(3000,function(){
    console.log("Working on port 3000");
});