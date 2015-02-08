describe('Logpack', function(){
    'use strict';

    var LogFactory;

    describe('LEVEL', function(){

        it('should return numeric value for each LEVEL', function(){
            expect(Logpack.LEVEL).toBeDefined();
            expect(Logpack.LEVEL.DEBUG).toBe(1);
            expect(Logpack.LEVEL.INFO).toBe(2);
            expect(Logpack.LEVEL.WARNING).toBe(3);
            expect(Logpack.LEVEL.ERROR).toBe(4);
            expect(Logpack.LEVEL.SILENT).toBe(5);
        });

        it('should return string value for each level', function(){
            expect(Logpack.LEVEL.LEVEL_TO_STRING).toBeDefined();
            expect(Logpack.LEVEL.LEVEL_TO_STRING(Logpack.LEVEL.DEBUG)).toBe('debug');
            expect(Logpack.LEVEL.LEVEL_TO_STRING(Logpack.LEVEL.INFO)).toBe('info');
            expect(Logpack.LEVEL.LEVEL_TO_STRING(Logpack.LEVEL.WARNING)).toBe('warn');
            expect(Logpack.LEVEL.LEVEL_TO_STRING(Logpack.LEVEL.ERROR)).toBe('error');
            expect(Logpack.LEVEL.LEVEL_TO_STRING(Logpack.LEVEL.SILENT)).toBe('log');
            expect(Logpack.LEVEL.LEVEL_TO_STRING()).toBe('log');
        });
    });

    describe('LogFactory', function(){

        beforeEach(function(){
            LogFactory = Logpack.LogFactory();
        });

        it('should have specific methods', function(){
            expect(LogFactory.getDefault).toBeDefined();
            expect(LogFactory.getDefault().debug).toBeDefined();
            expect(LogFactory.getDefault().d).toBeDefined();
            expect(LogFactory.getDefault().info).toBeDefined();
            expect(LogFactory.getDefault().i).toBeDefined();
            expect(LogFactory.getDefault().warn).toBeDefined();
            expect(LogFactory.getDefault().w).toBeDefined();
            expect(LogFactory.getDefault().error).toBeDefined();
            expect(LogFactory.getDefault().e).toBeDefined();
            expect(LogFactory.setLogWriters).toBeDefined();
            expect(LogFactory.create).toBeDefined();
        });
    });

    describe('WriterFactory', function(){
        var WriterFactory;

        beforeEach(function(){
            WriterFactory = Logpack.WriterFactory();
        });

        it('should have specific methods', function(){
            expect(WriterFactory.getDefault).toBeDefined();
            expect(WriterFactory.getDefault().write).toBeDefined();
        });

        describe('ConsoleWriter', function(){
            var ConsoleWriterFactory;

            beforeEach(function(){
                ConsoleWriterFactory = WriterFactory.Console();
            });

            it('should have specific methods', function(){
                expect(ConsoleWriterFactory.setLevel).toBeDefined();
                expect(ConsoleWriterFactory.setBuffer).toBeDefined();
                expect(ConsoleWriterFactory.setFormatter).toBeDefined();
                expect(ConsoleWriterFactory.create).toBeDefined();
            });
        });

        describe('ServerWriter', function(){
            var ServerWriterFactory;

            beforeEach(function(){
                ServerWriterFactory = WriterFactory.Server();
            });

            it('should have specific methods', function(){
                expect(ServerWriterFactory.setLevel).toBeDefined();
                expect(ServerWriterFactory.setBuffer).toBeDefined();
                expect(ServerWriterFactory.setFormatter).toBeDefined();
                expect(ServerWriterFactory.setUrl).toBeDefined();
                expect(ServerWriterFactory.create).toBeDefined();
            });
        });
    });

    describe('BufferFactory', function(){
        var BufferFactory;

        beforeEach(function(){
            BufferFactory = Logpack.BufferFactory();
        });

        it('should have specific methods', function(){
            expect(BufferFactory.getDefault).toBeDefined();
            expect(BufferFactory.getDefault().store).toBeDefined();
        });

        describe('SizeBuffer', function(){
            var SizeBufferFactory;

            beforeEach(function(){
                SizeBufferFactory = BufferFactory.SizeBuffer();
            });

            it('should have specific methods', function(){
                expect(SizeBufferFactory.setSizeInKb).toBeDefined();
                expect(SizeBufferFactory.create).toBeDefined();
            });
        });

        describe('TimeBuffer', function(){
            var TimeBufferFactory;

            beforeEach(function(){
                TimeBufferFactory = BufferFactory.TimeBuffer();
            });

            it('should have specific methods', function(){
                expect(TimeBufferFactory.setTimeInMs).toBeDefined();
                expect(TimeBufferFactory.create).toBeDefined();
            });
        });

        describe('CountBuffer', function(){
            var CountBufferFactory;

            beforeEach(function(){
                CountBufferFactory = BufferFactory.CountBuffer();
            });

            it('should have specific methods', function(){
                expect(CountBufferFactory.setCount).toBeDefined();
                expect(CountBufferFactory.create).toBeDefined();
            });
        });
    });

    describe('FormatterFactory', function(){
        var FormatterFactory;

        beforeEach(function(){
            FormatterFactory = Logpack.FormatterFactory();
        });

        it('should have specific methods', function(){
            expect(FormatterFactory.getDefault).toBeDefined();
            expect(FormatterFactory.getDefault().format).toBeDefined();
        });

        describe('SimpleFormatter', function(){
            var SimpleFormatterFactory;

            beforeEach(function(){
                SimpleFormatterFactory = FormatterFactory.SimpleFormatter();
            });

            it('should have specific methods', function(){
                expect(SimpleFormatterFactory.create).toBeDefined();
            });
        });

        describe('JsonFormatter', function(){
            var JsonFormatterFactory;

            beforeEach(function(){
                JsonFormatterFactory = FormatterFactory.JsonFormatter();
            });

            it('should have specific methods', function(){
                expect(JsonFormatterFactory.setUidManager).toBeDefined();
                expect(JsonFormatterFactory.create).toBeDefined();
            });
        });
    });

    describe('Default Log', function(){
        var Log;

        beforeEach(function(){
            Log = LogFactory.getDefault();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should have specific methods', function(){
            expect(Log.debug).toBeDefined();
            expect(Log.info).toBeDefined();
            expect(Log.warn).toBeDefined();
            expect(Log.error).toBeDefined();
            expect(Log.log).toBeUndefined();
        });

        it('should call to "info", "warn", "error" consoles methods only', function(){
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).not.toHaveBeenCalled();
            expect(console.info).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('DEBUG log levels with console writer', function() {
        var Log;

        beforeEach(function () {
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.DEBUG).create()).create();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should call to "debug", "info", "warn", "error" consoles methods only', function () {
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).toHaveBeenCalled();
            expect(console.info).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('INFO log levels with console writer', function() {
        var Log;

        beforeEach(function () {
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.INFO).create()).create();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should call to "info", "warn", "error" consoles methods only', function () {
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).not.toHaveBeenCalled();
            expect(console.info).toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('WARNING log levels with console writer', function() {
        var Log;

        beforeEach(function () {
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.WARNING).create()).create();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should call to "warn", "error" consoles methods only', function () {
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).not.toHaveBeenCalled();
            expect(console.info).not.toHaveBeenCalled();
            expect(console.warn).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('ERROR log levels with console writer', function() {
        var Log;

        beforeEach(function () {
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.ERROR).create()).create();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should call to "error" consoles method only', function () {
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).not.toHaveBeenCalled();
            expect(console.info).not.toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).toHaveBeenCalled();
        });
    });

    describe('SILENT log levels with console writer', function() {
        var Log;

        beforeEach(function () {
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setLevel(Logpack.LEVEL.SILENT).create()).create();

            spyOn(console, 'log');
            spyOn(console, 'debug');
            spyOn(console, 'info');
            spyOn(console, 'warn');
            spyOn(console, 'error');
        });

        it('should not call to any consoles methods', function () {
            Log.debug('debug msg');
            Log.info('info msg');
            Log.warn('warn msg');
            Log.error('error msg');

            expect(console.log).not.toHaveBeenCalled();
            expect(console.debug).not.toHaveBeenCalled();
            expect(console.info).not.toHaveBeenCalled();
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.error).not.toHaveBeenCalled();
        });
    });

    describe('server writer', function(){
        var Log, url = 'http://127.0.0.1:3000/log';

        beforeEach(function(){
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Server().setUrl(url).create()).create();

            spyOn(console, 'info');
            spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
            spyOn(XMLHttpRequest.prototype, 'send').andCallThrough();
        });

        it('should write to server only', function(){
            Log.info('info msg');

            expect(console.info).not.toHaveBeenCalled();
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
            expect(XMLHttpRequest.prototype.open.mostRecentCall.args[1]).toEqual(url);
        });
    });

    describe('server writer', function(){
        var Log, url = 'http://127.0.0.1:3000/log';

        beforeEach(function(){
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Server().setUrl(url).create()).create();

            spyOn(console, 'info');
            spyOn(XMLHttpRequest.prototype, 'open').andCallThrough();
            spyOn(XMLHttpRequest.prototype, 'send').andCallThrough();
        });

        it('should write to server only', function(){
            Log.info('info msg');

            expect(console.info).not.toHaveBeenCalled();
            expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
            expect(XMLHttpRequest.prototype.open.mostRecentCall.args[1]).toEqual(url);
        });
    });

    describe('writer count buffer', function(){
        var Log, storage;

        beforeEach(function(){
            storage = {};
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setBuffer(Logpack.BufferFactory(storage).CountBuffer().setCount(10).create()).create()).create();

            spyOn(console, 'info');
        });

        it('should flash buffer in tenth message', function(){
            for(var i=0; i<9; i++){
                Log.info('info msg');
            }

            expect(console.info).not.toHaveBeenCalled();
            // 9 messages and a buffer index
            expect(Object.keys(storage).length).toBe(10);

            Log.info('info msg');

            expect(console.info).toHaveBeenCalled();
            expect(Object.keys(storage).length).toBe(1);
        });
    });

    describe('writer size buffer', function(){
        var Log, storage, id='zopa';

        beforeEach(function(){
            storage = {};
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setBuffer(Logpack.BufferFactory(storage).SizeBuffer(id).setSizeInKb(1).create()).create()).create();

            spyOn(console, 'info');
        });

        it('should flash buffer in reaching 1 KB storage message', function(){
            for(var i=0; i<5; i++){
                // 61 chars + 39 formatter's additional chars = 100; 100*2 = 200 Byte
                Log.info('1234567890123456789012345678901234567890123456789012345678901');
            }

            expect(console.info).not.toHaveBeenCalled();
            expect(Object.keys(storage).length).toBe(6);

            Log.info('1');

            expect(console.info).toHaveBeenCalled();
            expect(Object.keys(storage).length).toBe(1);

            //check buffer key format
            expect(storage['SizeBuffer-' + id + '-index']).toBeDefined();
            expect(storage['SizeBuffer-' + id + '-index']).toBe(0);
        });
    });

    describe('writer time buffer', function(){
        var Log, storage;

        beforeEach(function(){
            storage = {};
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setBuffer(Logpack.BufferFactory(storage).TimeBuffer().setTimeInMs(1000).create()).create()).create();

            spyOn(console, 'info');
        });

        it('should flash buffer after 1 second', function(){
            runs(function(){
                Log.info('info msg');

                expect(console.info).not.toHaveBeenCalled();
                expect(Object.keys(storage).length).toBe(2);

                Log.info('info msg');

                expect(console.info).not.toHaveBeenCalled();
                expect(Object.keys(storage).length).toBe(3);
            });

            waits(500);

            runs(function(){
                expect(Object.keys(storage).length).toBe(3);
            });

            waits(500);

            runs(function(){
                expect(Object.keys(storage).length).toBe(1);
            });
        });
    });

    describe('writer simple formatter', function(){
        var Log;

        beforeEach(function(){
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setFormatter(Logpack.FormatterFactory().SimpleFormatter().create()).create()).create();

            spyOn(console, 'info');
        });

        it('should write message in simple format', function(){
            Log.info('info msg');
            expect(console.info.calls[0].args[0]).toEqual('info msg');
        });
    });

    describe('writer Json formatter', function(){
        var Log;

        beforeEach(function(){
            Log = LogFactory.setLogWriters(Logpack.WriterFactory().Console().setFormatter(
                Logpack.FormatterFactory().JsonFormatter().setUidManager({getUid:function(){return 3232;}}).create())
                .create())
                .create();

            spyOn(console, 'info').andCallThrough();
        });

        it('should write message in simple format', function(){
            Log.info('info msg');
            expect(console.info.calls[0].args[0]).toBeDefined();
            expect(console.info.calls[0].args[0].LogData).toBeDefined();
            expect(console.info.calls[0].args[0].LogData.Log_timestamp).toBeDefined();
            expect(console.info.calls[0].args[0].LogData.component).toBeDefined();
            expect(console.info.calls[0].args[0].LogData.function).toBeDefined();
            expect(console.info.calls[0].args[0].LogData.line).toBeDefined();
            expect(console.info.calls[0].args[0].LogData.Log_level).toEqual('info');
            expect(console.info.calls[0].args[0].LogData.Message_Text).toEqual(['info msg']);
            expect(console.info.calls[0].args[0].LogData.Event_Id).toEqual(3232);
        });
    });
});
