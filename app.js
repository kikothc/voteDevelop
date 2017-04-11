var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/route_app');

var app = express();
var ejs = require('ejs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//当服务器访问路径/favicon.ico 服务器会返回 public目录下的favicon.ico文件
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));//写请求日志的
app.use(bodyParser.json());//处理请求体为JSON格式的文件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//获得get请求，第一个参数是匹配内容，第二个参数是匹配成功后执行的回调函数
app.get('/vote/index', routes.index);  
app.get(/\/vote\/detail/, routes.detail);  
app.get('/vote/register', routes.register);  
app.get('/vote/search', routes.search); 
app.get('/vote/rule', routes.rule);

app.get('/vote/index/data', routes.index_data);
app.get(/\/vote\/index\/poll/, routes.index_poll);
app.get(/\/vote\/index\/search/, routes.index_search);
app.get(/\/vote\/all\/detail\/data/, routes.detail_data);

app.post(/\/vote\/register\/data/, routes.register_data);
app.post('/vote/index/info', routes.index_info);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
