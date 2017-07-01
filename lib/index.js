const Monitor = require('./monitor.js');
const Output = require('./output.js');
const log4js = require('log4js');
const path = require('path');

var _level = 'all'; //默认日志级别

exports.register = function (server, options, next) {
    let _logConf = options;
    _level = _logConf.level ||'all';
    //配置日志
    log4js.configure(_logConf);

    //设置日志级别
    let logger = log4js.getLogger("LIGHT-API");
    logger.setLevel(_level);
    
    const monitor = new Monitor(server,{logger:logger,output:Output});
    
    server.expose('service', {logger:_loggerFunc});
    server.log('info','completed to ligh-api-log plugin init');
    
    monitor._start(next);
}

exports.register.attributes = {
    pkg: require('../package.json')
};

exports.logger = _loggerFunc;


//日志函数
var _loggerFunc = function(name){
  let newName = _getCurPath(name);
  var logger = log4js.getLogger(newName);
  logger.setLevel(_level);
  return logger;
}
//获取相对路径
var _getCurPath = function(filename){
    if(filename && path.isAbsolute(filename)){
        return path.relative(path.dirname(require.main.filename),filename); 
    }else{
        return filename;
    }
}