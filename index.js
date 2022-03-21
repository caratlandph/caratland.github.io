const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

console.log(__dirname)
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'\\index.html'));
  //__dirname : It will resolve to your project folder.
});
router.get('/wordle-app.js',function(req,res){
    res.sendFile(path.join(__dirname+'\\wordle-app.js'));
    //__dirname : It will resolve to your project folder.
});
router.get('/words.js',function(req,res){
    res.sendFile(path.join(__dirname+'\\words.js'));
    //__dirname : It will resolve to your project folder.
  });
router.get('/style.css',function(req,res){
res.sendFile(path.join(__dirname+'\\style.css'));
//__dirname : It will resolve to your project folder.
});
router.get('/caratdeul.png',function(req,res){
  res.sendFile(path.join(__dirname+'\\caratdeul.png'));
  //__dirname : It will resolve to your project folder.
  });

app.use('/', router);
app.listen(process.env.port || 8000);

console.log('Running at Port 8000');