//   --> 第 1 步
console.log(1)
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();


//跨域  后期删
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8081"); //为了跨域保持session，所以指定地址，不能用*
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
});


//session  服务端 session 存储
var session=require('express-session');
app.use(session({
    secret:'classweb531234',               //设置 session 签名
    name:'classweb',
    cookie:{maxAge:60*1000*60*24}, // 储存的时间 24小时
    resave:false,             // 每次请求都重新设置session
    saveUninitialized:true
}));

// 验证用户登录
app.use(function(req, res, next){

    //后台请求
    if(req.session.username){ //表示已经登录后台
        next();
    }else if( req.url.indexOf("login") >=0 || req.url.indexOf("logout") >= 0){
        //登入，登出不需要登录
        next();
    }else{
        //next(); //TODO:这里是调试的时候打开的，以后需要删掉
        res.end('{"redirect":"true"}');
        
    };
    
});


console.log(__dirname,'dirname 当前模块的文件夹名称。等同于 __filename 的 path.dirname() 的值。')
// this middleware will be executed for every request to the app
//将中间件 安装function在path。如果path未指定，则默认为“/”。
//在一个中间件的安装path会导致中间件功能被执行，只要所需的路径基地匹配path。
//由于path默认为“/”，所以没有路径安装的中间件将被执行给应用程序的每个请求。
app.use('/login',function (req, res, next) {
  console.log('Time: %d', Date.now());
  next();
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));            //设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('view engine', 'jade');                             //设置视图模板引擎为 jade。

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));                                     //加载日志中间件。
app.use(bodyParser.json());									//加载解析json的中间件								
app.use(bodyParser.urlencoded({ extended: false }));		//加载解析urlencoded请求体的中间件。
app.use(cookieParser());									//加载解析cookie的中间件。
app.use(express.static(path.join(__dirname, 'public')));	//设置public文件夹为存放静态文件的目录。

app.use('/', index);										//加载 index.js 路由控制器。
app.use('/users', users);									//加载 users.js 路由控制器。


// catch 404 and forward to error handler
app.use(function(req, res, next) {							//捕获404错误，并转发到错误处理器。
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {      				//development开发环境下的错误处理器，将错误信息渲染error模版并显示到浏览器中。
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
