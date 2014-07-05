# Logpack #
## Modular and extendable logger ##
 To instal logpack run bower command:
 `bower install logpack`
 
## Description ##
 The Logpack is global log's modules collection, that helps to build complex and modular logger.
 Each module easy to configure and can be replaced by your own module.
 The Logpack contains:

 - **LogFactory** - Factory to create Log. LogFactory produce:
  - **Log**

 - **WriterFactory** - Factory to create writer, that write Log's messages. WriterFactory produce two writers:
  - **console writer** (default)
  - **server writer**

 - **BufferFactory** - Factory to create buffer, that store and collect Log's messages and flash them to writer. BufferFactory produce four buffers:
  - **blank buffer** (default) - doesn't store, immediately flash a message to writer
  - **count buffer** - flash after n messages or on error message
  - **size buffer** - flash if storage reached n kb or on error message
  - **time buffer** - flash after n milliseconds or on error message

 - **FormatterFactory** - Factory to create message formatter. FormatterFactory produce two formatters:
  - **SimpleFormatter** (default)
  - **JsonFormatter**

 - **LEVEL** - Log level.
  - DEBUG
  - INFO
  - WARNING
  - ERROR
  - SILENT

 # General usage #
 To create simple log with default level info, default console writer, default blank buffer and default SimpleFormater use:

 ```javascript
     var Log = Logpack.LogFactory().getDefault();

     Log.debug('Contact:', contact);
     Log.info("You are about to get error");
     Log.warn("Final warning");
     Log.error("Error!");
 ```

 Log can write to different writer, a server for example or to your own writer that implement `write(level, stack, args)` function.

 ```javascript
      var Log = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console().create(),
         Logpack.WriterFactory().Server().setUrl('http://rest.com/log').create()
      ).create();

      var LogWithMyOwnWriter = Logpack.LogFactory().setLogWriters(
         {
             write : function(level, stack, args){
                   alert(args);
             }
         }
      ).create();

      Log.info('Contact:', contact);
      LogWithMyOwnWriter.info('Contact:', contact);
 ```

 Writer can be defined with a specific log level

 ```javascript
      var Log = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.WARNING).create(),
         Logpack.WriterFactory().Server().setLevel(Logpack.LEVEL.DEBUG).setUrl('http://rest.com/log').create()
      ).create();

      Log.debug('Contact:', contact); // write to server writer only
      Log.warn('Contact:', contact); // write to both writers
 ```

 Writer can be defined with a build-in formatter or with your own that implement `format(level, stack, messages)` function

 ```javascript
      var Log = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().JsonFormatter().create()).create()
      ).create();
      var LogWithMyOwnFormatter = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console().setFormatter(
              {
                  format : function(level, stack, messages){
                      var formatted = [];
                      for (var i=0; i< messages.length; i++){
                          formatted.push({level:level, stack:stack, messages:messages[i], app:"bnhp"});
                      }
                      return formatted;
                  }
              }
         ).create()
      ).create();
      Log.info('Contact:', contact);
      // write to console in json format
      //[{
      //     "LogData" : {
      //         "Log_level" : "info",
      //         "Message_Text" : "Contact: Object",
      //         "Log_timestamp" : "2014-17-04T13:18:30Z",
      //         "component" : "",
      //         "function" : "functionName",
      //         "line" : "[index.js:90:3]",
      //         "Event_Id" : "12312"
      //     }
      // }]
      LogWithMyOwnFormatter.info('Contact:', contact); // write to console in your own format
 ```

 Writer can be defined with a build-in buffer or with your own that implement `store(storage,    writerCb, flash)` function
 Buffer use as default storage a sessionLocation, to change it pass your own storage object `var bufferFactory = Logpack.BufferFactory(window.locationStorage)`

 ```javascript
      var Log = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console()
            .setBuffer(Logpack.BufferFactory().CountBuffer().setCount(30).create()).create(),
         Logpack.WriterFactory().Console()
            .setBuffer(Logpack.BufferFactory().SizeBuffer().setSizeInKb(200).create()).create(),
         Logpack.WriterFactory().Console()
            .setBuffer(Logpack.BufferFactory().TimeBuffer().setTimeInMs(3000).create()).create()
      ).create();
      var LogWithMyOwnBuffer = Logpack.LogFactory().setLogWriters(
         Logpack.WriterFactory().Console()
            .setBuffer(
                  {
                      store : function(storage, writerCb, flash){
                          writerCb([storage]);
                      }
                  }
            ).create()
      ).create();
      Log.info('Contact:', contact);
      LogWithMyOwnBuffer.info('Contact:', contact);
 ```
## Testing ##
To test logpack run `karma start`

# Browsers support #

 All modern browsers and IE 9+
