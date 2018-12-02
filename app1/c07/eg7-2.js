var fs = require('fs');
fs.exists('/etc/passwd', function(exists) {
    console.log('/etc/passwd:', exists);
    // => true
});

fs.exists('/does_not_exist', function(exists) {
    console.log('/does_not_exist:', exists);
    // => false
});