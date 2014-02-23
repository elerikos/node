var log4js = require('log4js');

var logger = log4js.getLogger();
/*log4js.configure({
    appenders: [
        {
            type: "file",
            filename: "cheese.log",
            category: [ 'cheese','console' ]
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});*/


//only errors and above get logged.
//you can also set this log level in the config object
//via the levels field.
logger.setLevel('INFO');

//console logging methods have been replaced with log4js ones.
//so this will get coloured output on console, and appear in cheese.log
console.error("AAArgh! Something went wrong", { some: "otherObject", useful_for: "debug purposes" });

//these will not appear (logging level beneath error)
logger.trace('Entering cheese testing');
logger.debug('Got cheese.');
logger.info('Cheese is Gouda.');
logger.warn('Cheese is quite smelly.');
//these end up on the console and in cheese.log
logger.error('Cheese %s is too ripe!', "gouda");
logger.fatal('Cheese was breeding ground for listeria.');





