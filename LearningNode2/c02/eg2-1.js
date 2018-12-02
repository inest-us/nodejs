/*
    If we remove the process.stdin.setEncoding() function call at the beginning
    application will fail. The reason is there is no trim() function on a buffer
    => error: input.trim is not a function
*/
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
   var input = process.stdin.read();

   if (input !== null) {
      // echo the text
      process.stdout.write(input);

      var command = input.trim();
      if (command == 'exit')
         process.exit(0);
   }
});