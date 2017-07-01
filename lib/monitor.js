const Utils = require('./utils.js');



class Monitor {
    constructor(server, options) {
       // this.settings = options;
        //this._state = { report: false };
        this._transform = options.output;
        //this._settings ={color:true};
        this.logger = options.logger;
        this._server = server;
        const reqOptions = {headers:false,payload:false};
        const resOptions = {payload:false};
         // hapi Event handler
        this._requestLogHandler = (request, event) => {
            this.push(() => new Utils.RequestLog(request, event));
        };

        this._logHandler = (event) => {

            this.push(() => new Utils.ServerLog(event));
        };
        this._errorHandler = (request, error) => {

            this.push(() => new Utils.RequestError(request, error));
        };
        this._responseHandler = (request) => {
        
             this.push(() => new Utils.RequestSent(reqOptions, resOptions, request));
            
        };

    }
    _start(callback){
        // Initialize Events
        this._server.on('log', this._logHandler);
        this._server.on('request-error', this._errorHandler);
        this._server.on('response', this._responseHandler);
        this._server.on('request', this._requestLogHandler);
        return callback();
    }
    push(value) { 
        let _this = this;
        this._transform(value(),{},function(err,data){
         _this.logger.info(data);
        });
    }
   
}


module.exports = Monitor;
