# LocalConnection

LocalConnection allows you to send events across browser tabs. It uses
cookies and is subject to their security policies.

## Usage

To communicate, there needs to be a sender and a receiver.

### Receiver

To begin listening for events, set up LocalConnection and call the 
`listen()` method.

    var t = new LocalConnection({
      name: 'mycookiename'
    });
    // start listening
    t.listen();start

Then, add some callbacks. Callbacks listen for events sent by other
LocalConnections using the same name.

    // take the response and log it
    t.addCallback('log', function(msg) {
      document.getElementById('log').innerHTML += msg+'<br />';
    });

### Sender

To send data to the callback we just set up, simply call the `send()`
method.

    var t = new LocalConnection({
      name: 'mycookiename'
    });
    // log some stuff!
    t.send('log', 'Come at me bro');

## Examples

A few examples are available the `/tests` directory. **Note:** By default Chrome
doesn't enable cookies for the `file://` protocol, so either use Firefox to
test or set up a host.

## License

Copyright (c) 2012 Jeremy Harris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


