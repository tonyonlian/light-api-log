const Monitor = require('./monitor.js');
const Output = require('./output.js');
const log4js = require('log4js');

// log4js.configure({
//   appenders: [
//     { type: 'console'},
//     { type: 'file', filename: 'logs/cheese.log' },
//     { type: "dateFile",
//       filename: "logs/log_date/light-api",
//       alwaysIncludePattern: true,
//       pattern: "-yyyy-MM-dd-hh.log"
//     }
  
//   ],
//     replaceConsole: false
// });


var _level = 'info'; 
exports.register = function (server, options, next) {
    let _logConf = options;
    _level = _logConf.level;
    log4js.configure(_logConf);
    let logger = log4js.getLogger("LIGHT-API");
    logger.setLevel(_level);
    const monitor = new Monitor(server,{logger:logger,output:Output});
    
    server.expose('serivce', {logger:_loggerFunc});
    server.log('info','completed to ligh-api-log plugin init');
    monitor._start(next);
}

exports.register.attributes = {
    pkg: require('../package.json')
};

exports.logger = _loggerFunc;

var _loggerFunc = function(name){
  var logger = log4js.getLogger(name);
  return logger;
}
