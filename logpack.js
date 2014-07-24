'use strict';

/**
 * @ngdoc overview
 * @name Logpack
 *
 * @author Igor Smirnov
 *
 * @description
 *
 * Main {@link Global.Logpack `Log`} package
 *
 * <div doc-module-components="Global.Logpack"></div>
 */
(function(window){


    var _noop = function(){};

    /**
     * @ngdoc object
     * @name Logpack.LogFactoryObj
     *
     * @author Igor Smirnov
     *
     * @description
     * Factory to create {@link Logpack.Log `Log`} with default or specific writers
     *
     * # General usage
     * To create simple log with default level info, default console writer, default blank buffer and default SimpleFormater use:
     *
     * <pre>
     *     var Log = Logpack.LogFactory().getDefault();
     *
     *     Log.debug('Contact:', contact);
     *     Log.info("You are about to get error");
     *     Log.warn("Final warning");
     *     Log.error("Error!");
     * </pre>
     *
     * Log can write to different writer, a server for example or to your own writer that implement `write(level, stack, args)` function.
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().create(),
     *         Logpack.WriterFactory().Server().setUrl('http://rest.com/log').create()
     *      ).create();
     *
     *      var LogWithMyOwnWriter = Logpack.LogFactory().setLogWriters(
     *         {
     *             write : function(level, stack, args){
     *                   alert(args);
     *             }
     *         }
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     *      LogWithMyOwnWriter.info('Contact:', contact);
     * </pre>
     */
    var LogFactoryObj = function(defaultWriter){
        var _self = this;
        this._writers = [defaultWriter];
        return {
            /**
             * @ngdoc method
             * @name Logpack.LogFactoryObj#getDefault
             * @methodOf Logpack.LogFactoryObj
             *
             * @description
             * Method to create simple log with default level info, default console writer, default blank buffer and default SimpleFormater
             *
             * @return {Object} default log
             */
            getDefault : function(){
                return this.setLogWriters().create();
            },
            /**
             * @ngdoc method
             * @name Logpack.LogFactoryObj#create
             * @methodOf Logpack.LogFactoryObj
             *
             * @description
             * Method to create log with specific or default writers
             *
             * @return {Object} log with specific or default writers
             */
            create : function(){
                return _self.Log();
            },
            /**
             * @ngdoc method
             * @name Logpack.LogFactoryObj#setLogWriters
             * @methodOf Logpack.LogFactoryObj
             *
             * @description
             * Set specific writers to the log
             *
             * @param {...*} writers {@link Logpack.WriterFactoryObj `specific writers`}
             */
            setLogWriters : function(){
                _self._writers = arguments.length ? arguments : [defaultWriter];
                return this;
            }
        };
    };


    /**
     *
     * @ngdoc object
     * @name Logpack.Log
     *
     * @author Igor Smirnov
     *
     * @description
     * Log created by {@link Logpack.LogFactoryObj `LogFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     */
    LogFactoryObj.prototype.Log = function(){


        var _self = this;

        var _getStackTrace = function(){
            var trace = (window.printStackTrace || _noop)();
            // printStackTrace return current runtime stack. A first 5 places is Log and stackTrace.js call stacks
            if(trace && trace.length >= 6){
                trace.splice(0,5);
                return trace;
            }
            return [];
        };


        var _write = function(level){
            return function() {
                var stack = _getStackTrace();
                for (var i = 0; i < _self._writers.length; i++) {
                    _self._writers[i].write(level, stack, arguments);
                }
            };
        };


        return {
            /**
             * @ngdoc method
             * @name Logpack.Log#debug
             * @methodOf Logpack.Log
             *
             * @description
             * Debug method try to logs a value ñ level debug.
             * Those messages will only be outputted when Log level is debug.
             *
             * @param {...*} arguments mix of arguments
             */
            debug : _write(Logpack.LEVEL.DEBUG),
            d : _write(Logpack.LEVEL.DEBUG),

            /**
             * @ngdoc method
             * @name Logpack.Log#info
             * @methodOf Logpack.Log
             *
             * @description
             * Info method try to logs a value ñ level info.
             * Those messages will only be outputted when Log level is debug or info.
             *
             * @param {...*} arguments mix of arguments
             */

            info : _write(Logpack.LEVEL.INFO),
            i : _write(Logpack.LEVEL.INFO),

            /**
             * @ngdoc method
             * @name Logpack.Log#warn
             * @methodOf Logpack.Log
             *
             * @description
             * Warn method try to logs a value ñ level warn.
             * Those messages will only be outputted when Log level is debug or info or warning.
             *
             * @param {...*} arguments mix of arguments
             */
            warn : _write(Logpack.LEVEL.WARNING),
            w : _write(Logpack.LEVEL.WARNING),

            /**
             * @ngdoc method
             * @name Logpack.Log#error
             * @methodOf Logpack.Log
             *
             * @description
             * Error method try to logs a value ñ level error.
             * Those messages will only be outputted when Log level is debug or info or warning or error
             *
             * @param {...*} arguments mix of arguments
             */
            error : _write(Logpack.LEVEL.ERROR),
            e : _write(Logpack.LEVEL.ERROR)
        };
    };


    /**
     *
     * @ngdoc object
     * @name Logpack.WriterFactoryObj
     *
     * @author Igor Smirnov
     *
     * @description
     * Factory to create writer, that write Log's messages depends on log level. WriterFactory produce two build-in writers:
     *  - {@link Logpack.ConsoleWriter `console writer`} (default)
     *  - {@link Logpack.ServerWriter `server writer`}
     *
     * Writer can be configured with a {@link Logpack.BufferFactoryObj `buffer`} and a {@link Logpack.FormatterFactoryObj `formatter`}
     *
     * # General usage
     * To create simple console or server writer (with blank buffer, simple formatter and info log level) use:
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().create(),
     *         Logpack.WriterFactory().Server().setUrl('http://rest.com/log').create()
     *      ).create();
     *
     *      Log.info('Contact:', contact); // write to server and console writer
     * </pre>
     *
     * To create Writer with a specific log level use `setLevel` function:
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.WARNING).create(),
     *         Logpack.WriterFactory().Server().setLevel(Logpack.LEVEL.DEBUG).setUrl('http://rest.com/log').create()
     *      ).create();
     *
     *      Log.debug('Contact:', contact); // write to server writer only
     *      Log.warn('Contact:', contact); // write to both writers
     * </pre>
     *
     * To create Writer with specific formatter use `setFormatter` function:
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().getDefault()).create()
     *      ).create();
     * </pre>
     *
     * To create Writer with specific buffer use `setBuffer` function:
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setBuffer(Logpack.BufferFactory().getDefault()).create()
     *      ).create();
     * </pre>
     *
     */
    var WriterFactoryObj = function(defaultBuffer, defaultFormatter){
        var _self = this;
        this._level = Logpack.LEVEL.INFO;
        this._buffer = defaultBuffer;
        this._formatter = defaultFormatter;

        /**
         * @ngdoc method
         * @name Logpack.WriterFactoryObj#setLevel
         * @methodOf Logpack.WriterFactoryObj
         *
         * @description
         * Set writer log level
         *
         * @param {Object} level {@link Logpack.LEVEL `writer log level`}
         */
        var _setLevel = function(level){
            _self._level = level || Logpack.LEVEL.INFO;
            return this;
        };

        /**
         * @ngdoc method
         * @name Logpack.WriterFactoryObj#setBuffer
         * @methodOf Logpack.WriterFactoryObj
         *
         * @description
         * Set writer buffer
         *
         * @param {Object} buffer {@link Logpack.BufferFactoryObj `writer buffer`}
         */
        var _setBuffer = function(buffer) {
            _self._buffer = buffer || defaultBuffer;
            return this;
        };

        /**
         * @ngdoc method
         * @name Logpack.WriterFactoryObj#setFormatter
         * @methodOf Logpack.WriterFactoryObj
         *
         * @description
         * Set writer message formatter
         *
         * @param {Object} formatter {@link Logpack.FormatterFactoryObj `writer message formatter`}
         */
        var _setFormatter = function(formatter){
            _self._formatter = formatter || defaultFormatter;
            return this;
        };


        return {
            /**
             * @ngdoc method
             * @name Logpack.WriterFactoryObj#getDefault
             * @methodOf Logpack.WriterFactoryObj
             *
             * @description
             * Create default writer with log level info, {@link Logpack.SimpleFormatter `simple formatter`} and {@link Logpack.BlankBuffer `blank buffer`}
             *
             * @return {Object} default {@link Logpack.ConsoleWriter `writer`}
             */
            getDefault : function(){
                return this.Console().setLevel().setBuffer().setFormatter().create();
            },

            /**
             * @ngdoc method
             * @name Logpack.WriterFactoryObj#Console
             * @methodOf Logpack.WriterFactoryObj
             *
             * @description
             * Use Console WriterFactory
             */
            Console : function(){
                return {
                    setLevel : _setLevel,
                    setBuffer : _setBuffer,
                    setFormatter : _setFormatter,
                    create : function(){
                        return _self.ConsoleWriter();
                    }
                }
            },

            /**
             * @ngdoc method
             * @name Logpack.WriterFactoryObj#Server
             * @methodOf Logpack.WriterFactoryObj
             *
             * @description
             * Use Sever WriterFactory
             */
            Server : function(){
                var _url;
                return {
                    setLevel : _setLevel,
                    setBuffer : _setBuffer,
                    setFormatter : _setFormatter,
                    /**
                     * @ngdoc method
                     * @name Logpack.WriterFactoryObj#setUrl
                     * @methodOf Logpack.WriterFactoryObj
                     *
                     * @description
                     * Set url to server writer. Exist in Server writer only!
                     *
                     * @param {String} url server log service url
                     */
                    setUrl : function(url){
                        // check url string
                        if(/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(url)) {
                            _url = url;
                        }
                        else{
                            _url = null;
                        }
                        return this;
                    },
                    create : function(){
                        return _self.ServerWriter(_url);
                    }
                }
            }
        }
    };


    /**
     * @ngdoc object
     * @name Logpack.ConsoleWriter
     *
     * @author Igor Smirnov
     *
     * @description
     * Console writer created by {@link Logpack.WriterFactoryObj `WriterFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     */
    WriterFactoryObj.prototype.ConsoleWriter = function(){
        var _self = this;


        return {
            write : function(level, stack, args){
                if(!isNaN(level) && level >= _self._level){
                    _self._buffer.store({level:level, formattedMessages:_self._formatter.format(level, stack, args)}, function(messageObjectStack){
                        for(var i = 0; i < messageObjectStack.length; i++){
                            var logFunc = console[Logpack.LEVEL.LEVEL_TO_STRING(messageObjectStack[i].level)] || _noop;
                            var args = messageObjectStack[i].formattedMessages instanceof Array ? messageObjectStack[i].formattedMessages : [messageObjectStack[i].formattedMessages];
                            logFunc.apply(console, args);
                        }
                    }, level == Logpack.LEVEL.ERROR);
                }
            }
        };
    };


    /**
     * @ngdoc object
     * @name Logpack.ServerWriter
     *
     * @author Igor Smirnov
     *
     * @description
     * Server writer created by {@link Logpack.WriterFactoryObj `WriterFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     */
    WriterFactoryObj.prototype.ServerWriter = function(url){
        var _self = this;


        return {
            write : function(level, stack, args){
                if(!isNaN(level) && level >= _self._level){
                    _self._buffer.store(_self._formatter.format(level, stack, args), function(formattedMessages){
                        if(url) {
                            var req = new XMLHttpRequest();
                            req.open('POST', url);
                            req.send(JSON.stringify(formattedMessages));
                        }
                    }, level == Logpack.LEVEL.ERROR)
                }
            }
        };
    };


//    TODO: for server errors handling
//    req.onreadystatechange=function(){
//        if (req.readyState==4 && req.status!=201){
//            //TODO: server error handling
//        }
//    };


    /**
     * @ngdoc object
     * @name Logpack.BufferFactoryObj
     *
     * @author Igor Smirnov
     *
     * @description
     * Factory to create buffer, that store and collect Log's messages and flash them to writer. BufferFactory produce four build-in buffers:
     * - {@link Logpack.BlankBuffer `blank buffer`} (default) - doesn't store, immediately flash a message to writer
     * - {@link Logpack.CountBuffer `count buffer`} - flash after n messages or on error message
     * - {@link Logpack.SizeBuffer `size buffer`} - flash if storage reached n kb or on error message
     * - {@link Logpack.TimeBuffer `time buffer`} - flash after n milliseconds or on error message
     *
     * Buffer use as default storage a sessionLocation, to change it pass your own storage object `var bufferFactory = Logpack.BufferFactory(window.locationStorage)`
     *
     * During document unload event buffer flash all stored messages to write. Buffer can be defined with id that used to store message with this unique key
     *
     * #General usage
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().CountBuffer().setCount(30).create()).create(),
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().SizeBuffer(4521).setSizeInKb(200).create()).create(),
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().TimeBuffer('bufferID').setTimeInMs(3000).create()).create()
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     * </pre>
     */
    var BufferFactoryObj = function(storage){
        var _self = this;
        this._storage = storage || {};
        this._unloadListeners = [];


        Logpack.BufferFactoryStatic = Logpack.BufferFactoryStatic || {};


        this._flashAbstractMethod = function(cb){
            var msgs = [];
            //store last cb for unload event
            this._cb = cb || this._cb || _noop;
            for(var i = 0; i < this._storage[this._getStamp('index')]; i++){
                if(typeof this._storage[this._getStamp(i)] != 'undefined') {
                    msgs.push(JSON.parse(this._storage[this._getStamp(i)]));
                    delete this._storage[this._getStamp(i)];
                }
            }
            this._storage[this._getStamp('index')] = 0;
            this._cb(msgs);
        };


        (window.addEventListener || _noop)('unload', function(event){
            while(_self._unloadListeners.length > 0){
                //flesh all registered buffers
                (_self._unloadListeners.pop() || _noop)();
            }
        });


        return {
            /**
             * @ngdoc method
             * @name Logpack.BufferFactoryObj#getDefault
             * @methodOf Logpack.BufferFactoryObj
             *
             * @description
             * Create default blank buffer
             *
             * @return {Object} default {@link Logpack.BlankBuffer `blank buffer`}
             */
            getDefault : function(){
                return _self.BlankBuffer();
            },

            /**
             * @ngdoc method
             * @name Logpack.BufferFactoryObj#SizeBuffer
             * @methodOf Logpack.BufferFactoryObj
             *
             * @description
             * Use Size BufferFactory
             *
             * @param {String} id - buffer storage key (optional)
             */
            SizeBuffer : function(id){
                var _size, defaultSize = 500;
                Logpack.BufferFactoryStatic.sizeBufferCounter = Logpack.BufferFactoryStatic.sizeBufferCounter || 0;
                var sizeBufferStamp = 'SizeBuffer-' + (id || (Logpack.BufferFactoryStatic.sizeBufferCounter++)) + '-';
                return {
                    /**
                     * @ngdoc method
                     * @name Logpack.BufferFactoryObj#setSizeInKb
                     * @methodOf Logpack.BufferFactoryObj
                     *
                     * @description
                     * Set size limit for SizeBuffer. On reaching this limit, buffer flash all stored messages to writer. Exist in SizeBuffer only!
                     *
                     * @param {Number} size - size of storage in KB (optional, default is 500KB)
                     */
                    setSizeInKb : function(size){
                        _size = size || defaultSize;
                        return this;
                    },
                    create : function(){
                        return _self.SizeBuffer(sizeBufferStamp, _size || defaultSize);
                    }
                }
            },

            /**
             * @ngdoc method
             * @name Logpack.BufferFactoryObj#TimeBuffer
             * @methodOf Logpack.BufferFactoryObj
             *
             * @description
             * Use Time BufferFactory
             *
             * @param {String} id - buffer storage key (optional)
             */
            TimeBuffer : function(id){
                var _time, defaultTime = 1000;
                Logpack.BufferFactoryStatic.timeBufferCounter = Logpack.BufferFactoryStatic.timeBufferCounter || 0;
                var timeBufferStamp= 'TimeBuffer-' + (id || (Logpack.BufferFactoryStatic.timeBufferCounter++)) + '-';
                return {
                    /**
                     * @ngdoc method
                     * @name Logpack.BufferFactoryObj#setTimeInMs
                     * @methodOf Logpack.BufferFactoryObj
                     *
                     * @description
                     * Set time limit for TimeBuffer. On reaching this limit, buffer flash all stored messages to writer. Exist in TimeBuffer only!
                     *
                     * @param {Number} time - buffer time limit (optional, default is 1000 ms)
                     */
                    setTimeInMs : function(time){
                        _time = time || defaultTime;
                        return this;
                    },
                    create : function(){
                        return _self.TimeBuffer(timeBufferStamp, _time || defaultTime);
                    }
                }
            },

            /**
             * @ngdoc method
             * @name Logpack.BufferFactoryObj#CountBuffer
             * @methodOf Logpack.BufferFactoryObj
             *
             * @description
             * Use Count BufferFactory
             *
             * @param {String} id - buffer storage key (optional)
             */
            CountBuffer : function(id){
                var _count, defaultCount = 30;
                Logpack.BufferFactoryStatic.countBufferCounter = Logpack.BufferFactoryStatic.countBufferCounter || 0;
                var timeBufferStamp= 'CountBuffer-' + (id || (Logpack.BufferFactoryStatic.countBufferCounter++)) + '-';
                return {
                    /**
                     * @ngdoc method
                     * @name Logpack.BufferFactoryObj#setCount
                     * @methodOf Logpack.BufferFactoryObj
                     *
                     * @description
                     * Set messages count limit for CountBuffer. On reaching this limit, buffer flash all stored messages to writer. Exist in CountBuffer only!
                     *
                     * @param {Number} count - buffer messages count limit (optional, default is 30 ms)
                     */
                    setCount : function(count){
                        _count = count || defaultCount;
                        return this;
                    },
                    create : function(){
                        return _self.CountBuffer(timeBufferStamp, _count || defaultCount);
                    }
                }
            }
        }
    };


    /**
     * @ngdoc object
     * @name Logpack.BlankBuffer
     *
     * @author Igor Smirnov
     *
     * @description
     * Default blank buffer created by {@link Logpack.BufferFactoryObj `BufferFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     */
    BufferFactoryObj.prototype.BlankBuffer = function(){
        return {
            store : function(storage, writerCb, flash){
                writerCb([storage]);
            }
        };
    };


    /**
     * @ngdoc object
     * @name Logpack.SizeBuffer
     *
     * @author Igor Smirnov
     *
     * @description
     * Size buffer created by {@link Logpack.BufferFactoryObj `BufferFactory`}. On reaching size limit, buffer flash all stored messages to writer, to more details see {@link Global.Logpack `the Logpack`}
     */
    BufferFactoryObj.prototype.SizeBuffer = function(bufferStamp, size){
        var _self = this;


        this._getStamp = function(id){
            return bufferStamp + id;
        };


        this._isSizeOverflow = function() {
            var total = 0;
            for (var i = 0; i < _self._storage[_self._getStamp('index')]; i++) {
                total += typeof _self._storage[_self._getStamp(i)] != 'undefined' ? _self._storage[_self._getStamp(i)].length * 2 : 0;
            }
            return (total/1024) > size;
        };


        (function init() {
            // assign to unload event
            _self._unloadListeners.push(_self._flashAbstractMethod.bind(_self));
            //set current buffer index, use stored index if exist
            _self._storage[_self._getStamp('index')] = _self._storage[_self._getStamp('index')] || 0;
        })();


        return {
            store : function(storage, writerCb, flash){
                _self._storage[_self._getStamp(_self._storage[_self._getStamp('index')]++)] = JSON.stringify(storage);


                if(flash || _self._isSizeOverflow()){
                    _self._flashAbstractMethod.bind(_self)(writerCb);
                }
            }
        };
    };


    /**
     * @ngdoc object
     * @name Logpack.TimeBuffer
     *
     * @author Igor Smirnov
     *
     * @description
     * Time buffer created by {@link Logpack.BufferFactoryObj `BufferFactory`}. On reaching time limit, buffer flash all stored messages to writer, to more details see {@link Global.Logpack `the Logpack`}
     */
    BufferFactoryObj.prototype.TimeBuffer = function(bufferStamp, time){
        var _self = this;
        var timeoutId;


        this._getStamp = function(id){
            return bufferStamp + id;
        };


        this._initTimer = function(){
            clearInterval(timeoutId);
            timeoutId = setTimeout(function(){
                _self._flashAbstractMethod.bind(_self)();
            }, time);
        };


        (function init() {
            // assign to unload event
            _self._unloadListeners.push(_self._flashAbstractMethod.bind(_self));
            //set current buffer index, use stored index if exist
            _self._storage[_self._getStamp('index')] = _self._storage[_self._getStamp('index')] || 0;
            _self._initTimer();
        })();


        return {
            store : function(storage, writerCb, flash){
                _self._storage[_self._getStamp(_self._storage[_self._getStamp('index')]++)] = JSON.stringify(storage);


                if(flash){
                    _self._flashAbstractMethod.bind(_self)(writerCb);
                    _self._initTimer();
                }
            }
        };
    };


    /**
     * @ngdoc object
     * @name Logpack.CountBuffer
     *
     * @author Igor Smirnov
     *
     * @description
     * Count buffer created by {@link Logpack.BufferFactoryObj `BufferFactory`}. On reaching messages count limit, buffer flash all stored messages to writer, to more details see {@link Global.Logpack `the Logpack`}
     */
    BufferFactoryObj.prototype.CountBuffer = function(bufferStamp, count){
        var _self = this;
        var _count = count;


        this._getStamp = function(id){
            return bufferStamp + id;
        };


        (function init() {
            // assign to unload event
            _self._unloadListeners.push(_self._flashAbstractMethod.bind(_self));
            //set current buffer index, use stored index if exist
            _self._storage[_self._getStamp('index')] = _self._storage[_self._getStamp('index')] || 0;
        })();


        return {
            store : function(storage, writerCb, flash){
                _self._storage[_self._getStamp(_self._storage[_self._getStamp('index')]++)] = JSON.stringify(storage);


                if(flash || --_count <= 0){
                    _self._flashAbstractMethod.bind(_self)(writerCb);
                    _count = count;
                }
            }
        };
    };

    /**
     * @ngdoc object
     * @name Logpack.FormatterFactoryObj
     *
     * @author Igor Smirnov
     *
     * @description
     * Factory to create message formatter. FormatterFactory produce two build-in formatters:
     *  - {@link Logpack.SimpleFormatter `SimpleFormatter`} (default)
     *  - {@link Logpack.JsonFormatter `JsonFormatter`}
     *
     * #General usage
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().getDefault()).create(),
     *         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().JsonFormatter().create()).create(),
     *         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().SimpleFormatter().create()).create()
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     * </pre>
     */
    var FormatterFactoryObj = function(){
        var _self = this;
        this._uidManager;


        return {
            /**
             * @ngdoc method
             * @name Logpack.FormatterFactoryObj#getDefault
             * @methodOf Logpack.FormatterFactoryObj
             *
             * @description
             * Create default simple formatter
             *
             * @return {Object} default {@link Logpack.SimpleFormatter `simple formatter`}
             */
            getDefault : function(){
                return this.SimpleFormatter().create();
            },

            /**
             * @ngdoc method
             * @name Logpack.FormatterFactoryObj#SimpleFormatter
             * @methodOf Logpack.FormatterFactoryObj
             *
             * @description
             * Use SimpleFormatter Factory
             */
            SimpleFormatter : function(){
                return {
                    create : function(){
                        return _self.SimpleFormatter();
                    }
                }
            },

            /**
             * @ngdoc method
             * @name Logpack.FormatterFactoryObj#JsonFormatter
             * @methodOf Logpack.FormatterFactoryObj
             *
             * @description
             * Use JsonFormatter Factory
             */
            JsonFormatter : function(){
                return {
                    /**
                     * @ngdoc method
                     * @name Logpack.FormatterFactoryObj#setUidManager
                     * @methodOf Logpack.FormatterFactoryObj
                     *
                     * @description
                     * Set uid manager that return last request/response uid and implement `getUid` function
                     *
                     * @param {Object} uidManager uid manager that return last request/response uid
                     */
                    setUidManager : function(uidManager){
                        _self._uidManager = uidManager;
                        return this;
                    },
                    create : function(){
                        return _self.JsonFormatter();
                    }
                }
            }
        }
    };


    /**
     * @ngdoc object
     * @name Logpack.SimpleFormatter
     *
     * @author Igor Smirnov
     *
     * @description
     * Default Simple Formatter created by {@link Logpack.FormatterFactoryObj `FormatterFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     */
    FormatterFactoryObj.prototype.SimpleFormatter = function(){


        var _format = function(level, stack, messages) {
            var formatted = [];
            for (var i=0; i< messages.length; i++){
                formatted.push(_formatError(messages[i]));
            }
            formatted.push(_getConsoleLine(stack));
            return formatted;
        };


        var _formatError = function(arg) {
            if (arg instanceof Error) {
                if (arg.stack) {
                    arg = (arg.message && arg.stack.indexOf(arg.message) === -1)
                        ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
                } else if (arg.sourceURL) {
                    arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                }
            }
            return arg;
        };


        var _getConsoleLine = function(stack){
            if(stack && stack.length >= 1){
                var splitedStack = stack[0].split('@');
                if(splitedStack.length >= 2){
                    return '[' + splitedStack[1] + ']';
                }
            }
            return "";
        };


        return {
            format : _format
        };
    };


    /**
     * @ngdoc object
     * @name Logpack.JsonFormatter
     *
     * @author Igor Smirnov
     *
     * @description
     * Json Formatter created by {@link Logpack.FormatterFactoryObj `FormatterFactory`}, to more details see {@link Global.Logpack `the Logpack`}
     *
     * Message format:
     * <pre>
     *     "LogData" : {
     *          "Log_level" : "info"
     *          "Message_Text" : "random text"
     *          "Log_timestamp" : "2014-17-04T13:18:30Z"
     *          "component" : "transactionsWidget"
     *          "function" : "sortByName"
     *          "line" : "405"
     *          "Event_Id" : "23412432434"
     *      }
     * </pre>
     */
    FormatterFactoryObj.prototype.JsonFormatter = function(){
        var _self = this;

        var _format = function(level, stack, messages) {
            return {
                "LogData" : {
                    "Log_level" : Logpack.LEVEL.LEVEL_TO_STRING(level),
                    "Message_Text" : _formatMessages(messages),
                    "Log_timestamp" : new Date().toISOString(),
                    "component" : "WTF",
                    "function" : _getFunctionName(stack),
                    "line" : _getLineNumber(stack),
                    "Event_Id" : _getUid()
                }
            };
        };


        var _getUid = function(){
            if(_self._uidManager && _self._uidManager.getUid){
                return _self._uidManager.getUid();
            }
            return "there is no uidManager to produce uid";
        };


        var _formatMessages = function(messages){
            var formatted = [];
            for (var i=0; i< messages.length; i++){
                formatted.push(_formatObj(messages[i]));
            }
            return formatted;
        };


        var _formatObj = function(arg) {
            if (arg instanceof Object) {
                if (arg instanceof Error) {
                    if (arg.stack) {
                        return (arg.message && arg.stack.indexOf(arg.message) === -1)
                            ? 'Error: ' + arg.message + '\n' + arg.stack : arg.stack;
                    } else if (arg.sourceURL) {
                        return arg.message + '\n' + arg.sourceURL + ':' + arg.line;
                    }
                }
                //TODO: parse object to string
                return arg;
            }
            return arg;
        };


        var _getLineNumber = function(stack){
            return '[' + (_getConsoleLine(stack)[1] || '-1') + ']';
        };


        var _getFunctionName = function(stack){
            return '[' + (_getConsoleLine(stack)[0] || 'unknown') + ']';
        };


        var _getConsoleLine = function(stack){
            if(stack && stack.length >= 1){
                return stack[0].split('@');
            }
            return [];
        };


        return {
            format : _format
        };
    };



    /**
     * @ngdoc object
     * @name Global.Logpack
     *
     * @author Igor Smirnov
     *
     * @description
     * The Logpack is global log's modules collection, that helps to build complex and modular logger.
     * Each module easy to configure and can be replaced by your own module.
     * The Logpack contains:
     *
     * - {@link Logpack.LogFactoryObj `LogFactory`} - Factory to create Log. LogFactory produce:
     *  - {@link Logpack.Log `Log`}
     *
     * - {@link Logpack.WriterFactoryObj `WriterFactory`} - Factory to create writer, that write Log's messages. WriterFactory produce two writers:
     *  - {@link Logpack.ConsoleWriter `console writer`} (default)
     *  - {@link Logpack.ServerWriter `server writer`}
     *
     * - {@link Logpack.BufferFactoryObj `BufferFactory`} - Factory to create buffer, that store and collect Log's messages and flash them to writer. BufferFactory produce four buffers:
     *  - {@link Logpack.BlankBuffer `blank buffer`} (default) - doesn't store, immediately flash a message to writer
     *  - {@link Logpack.CountBuffer `count buffer`} - flash after n messages or on error message
     *  - {@link Logpack.SizeBuffer `size buffer`} - flash if storage reached n kb or on error message
     *  - {@link Logpack.TimeBuffer `time buffer`} - flash after n milliseconds or on error message
     *
     * - {@link Logpack.FormatterFactoryObj `FormatterFactory`} - Factory to create message formatter. FormatterFactory produce two formatters:
     *  - {@link Logpack.SimpleFormatter `SimpleFormatter`} (default)
     *  - {@link Logpack.JsonFormatter `JsonFormatter`}
     *
     * - {@link Logpack.LEVEL `LEVEL`} - Log level.
     *  - DEBUG
     *  - INFO
     *  - WARNING
     *  - ERROR
     *  - SILENT
     *
     * # General usage
     * To create simple log with default level info, default console writer, default blank buffer and default SimpleFormater use:
     *
     * <pre>
     *     var Log = Logpack.LogFactory().getDefault();
     *
     *     Log.debug('Contact:', contact);
     *     Log.info("You are about to get error");
     *     Log.warn("Final warning");
     *     Log.error("Error!");
     * </pre>
     *
     * Log can write to different writer, a server for example or to your own writer that implement `write(level, stack, args)` function.
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().create(),
     *         Logpack.WriterFactory().Server().setUrl('http://rest.com/log').create()
     *      ).create();
     *
     *      var LogWithMyOwnWriter = Logpack.LogFactory().setLogWriters(
     *         {
     *             write : function(level, stack, args){
     *                   alert(args);
     *             }
     *         }
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     *      LogWithMyOwnWriter.info('Contact:', contact);
     * </pre>
     *
     * Writer can be defined with a specific log level
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.WARNING).create(),
     *         Logpack.WriterFactory().Server().setLevel(Logpack.LEVEL.DEBUG).setUrl('http://rest.com/log').create()
     *      ).create();
     *
     *      Log.debug('Contact:', contact); // write to server writer only
     *      Log.warn('Contact:', contact); // write to both writers
     * </pre>
     *
     * Writer can be defined with a build-in formatter or with your own that implement `format(level, stack, messages)` function
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().JsonFormatter().create()).create()
     *      ).create();
     *
     *      var LogWithMyOwnFormatter = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console().setFormatter(
     *              {
     *                  format : function(level, stack, messages){
     *                      var formatted = [];
     *                      for (var i=0; i< messages.length; i++){
     *                          formatted.push({level:level, stack:stack, messages:messages[i], app:"bnhp"});
     *                      }
     *                      return formatted;
     *                  }
     *              }
     *         ).create()
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     *      // write to console in json format
     *      //[{
     *      //     "LogData" : {
     *      //         "Log_level" : "info",
     *      //         "Message_Text" : "Contact: Object",
     *      //         "Log_timestamp" : "2014-17-04T13:18:30Z",
     *      //         "component" : "",
     *      //         "function" : "functionName",
     *      //         "line" : "[index.js:90:3]",
     *      //         "Event_Id" : "12312"
     *      //     }
     *      // }]
     *
     *      LogWithMyOwnFormatter.info('Contact:', contact); // write to console in your own format
     * </pre>
     *
     * Writer can be defined with a build-in buffer or with your own that implement `store(storage, writerCb, flash)` function
     * Buffer use as default storage a sessionLocation, to change it pass your own storage object `var bufferFactory = Logpack.BufferFactory(window.locationStorage)`
     *
     * <pre>
     *      var Log = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().CountBuffer().setCount(30).create()).create(),
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().SizeBuffer().setSizeInKb(200).create()).create(),
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(Logpack.BufferFactory().TimeBuffer().setTimeInMs(3000).create()).create()
     *      ).create();
     *
     *      var LogWithMyOwnBuffer = Logpack.LogFactory().setLogWriters(
     *         Logpack.WriterFactory().Console()
     *            .setBuffer(
     *                  {
     *                      store : function(storage, writerCb, flash){
     *                          writerCb([storage]);
     *                      }
     *                  }
     *            ).create()
     *      ).create();
     *
     *      Log.info('Contact:', contact);
     *      LogWithMyOwnBuffer.info('Contact:', contact);
     * </pre>
     *
     * @type {{LEVEL: {DEBUG: string, INFO: string, WARNING: string, ERROR: string, SILENT: string, LEVEL_TO_STRING: LEVEL_TO_STRING}, FormatterFactory: FormatterFactory, BufferFactory: BufferFactory, WriterFactory: WriterFactory, LogFactory: LogFactory}}
     */
    window.Logpack = {
        /**
         * @ngdoc object
         * @name Logpack.LEVEL
         *
         * @author Igor Smirnov
         *
         * @description
         * Log level.
         * - DEBUG
         * - INFO
         * - WARNING
         * - ERROR
         * - SILENT
         *
         * # General usage
         * <pre>
         *     var Log = Logpack.LogFactory().setLogWriters(
         *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.DEBUG).create(),
         *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.INFO).create(),
         *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.WARNING).create(),
         *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.ERROR).create(),
         *         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.SILENT).create()
         *      ).create();
         * </pre>
         */
        LEVEL : {
            DEBUG: 1, INFO: 2, WARNING: 3, ERROR: 4, SILENT: 5,
            LEVEL_TO_STRING: function (level) {
                switch (level) {
                    case this.DEBUG:
                        return 'debug';
                    case this.INFO:
                        return 'info';
                    case this.WARNING:
                        return 'warn';
                    case this.ERROR:
                        return 'error';
                    default :
                        return 'log';
                }
            }
        },
        FormatterFactory : function(){return new FormatterFactoryObj()},
        BufferFactory : function(storage){return new BufferFactoryObj(storage || window.sessionStorage)},
        WriterFactory : function(){return new WriterFactoryObj(this.BufferFactory().getDefault(), this.FormatterFactory().getDefault());},
        LogFactory : function(){return new LogFactoryObj(this.WriterFactory().getDefault());}
    };
}(window));
