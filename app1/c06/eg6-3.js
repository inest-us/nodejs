//the process  object is one of the few Node global objects
process.nextTick(function() {
    console.log('nextTick');
});