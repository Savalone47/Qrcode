const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const bobyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const qrcode = require('qrcode');

// import from models
const userModel = require('./models/user');

// init app
const app = express();

// Connect to database
mongoose.connect('mongodb://localhost:27017/qrdemo', {
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open",(callback)=>{
	console.log("connection succeeded");
});

// set the template engine
app.set('view engine', 'ejs');

//fetch data from the reuqest
app.use(bobyParser.json());
app.use(bobyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// loading the Get page
app.get('/',(req, res)=>{
    userModel.find((err, data)=>{
        if(err) {console.log(err);}
        else{
            if(data!=''){
                let temp = [];
                for(let i=0; i<data.length; i++){
                    
                    let name = {data: data[i].name};
                    temp.push(name);
                    
                    let phone = {data:data[i].phone};
                    temp.push(phone);
                }
                qrcode.toDataURL(temp, {errorCorrectionLevel: 'H'}, (err, url)=>{
                    console.log(url);
                    res.render('qrcode', {data:url});
                })
            }else{res.render('qrcode', {data:''});}
        }
    });
});

// loading the post page
app.post('/', (req, res)=>{
    let user = new userModel({
        name:req.body.name,
        phone:req.body.phone
    });
    user.save((err, data)=>{
        if(err){console.log(err);}
        else{res.redirect('/');}
    });
});

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  next(createError(404));
});

// error handler
app.use((err, req, res, next)=>{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//Assign port
const PORT  = process.env.PORT || 3000;
app.listen(PORT,()=>console.log(`Server is Starting on htpp://localhost:${PORT}`));
