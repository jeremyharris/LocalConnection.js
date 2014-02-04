# LocalConnection

LocalConnection allows you to send events across browser tabs. It uses
HTML5 `localStorage` and is subject to its security policies. If the browser
does not support `localStorage`, cookies are used as a fallback.

## Support

[IE9 fails](https://github.com/jeremyharris/LocalConnection.js/issues/3) 
since it does not support the `JSON` object. To enable `JSON` 
support in IE9, add the following script to pages that use LocalConnection:

    <script src="http://cdnjs.cloudflare.com/ajax/libs/json2/20110223/json2.js"></script>

## Usage

To communicate, there needs to be a sender and a receiver.

### Receiver

To begin listening for events, set up LocalConnection and call the
`listen()` method.

    var t = new LocalConnection({
      name: 'mycookiename'
    });
    // start listening
    t.listen();

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

A few examples are available the `/demos` directory. **Note:** By default Chrome
doesn't enable cookies for the `file://` protocol, so either use Firefox to
test or set up a host.

### Basic

This is a very basic example which demonstrates the basics of adding
callbacks. Open both the sender and receive file in your browser.

### Video Sync

This demonstrates a very simple way to only allow a single video to play
at a time. If users opened several windows and tabs that played videos,
this would prevent them from playing over each other.

## License

Copyright (c) 2012 Jeremy Harris

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


