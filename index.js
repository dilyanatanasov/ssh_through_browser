var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Client = require('ssh2').Client;
var port = process.env.PORT || 3000;

let connect = {
  host: '194.141.22.133',
  port: 22,
  username: 'dilian',
  password: 'atanasov.416',
  algorithms: {
    cipher: [
      'aes128-ctr',
      'aes192-ctr',
      'aes256-ctr',
      'aes128-gcm',
      'aes128-gcm@openssh.com',
      'aes256-gcm',
      'aes256-gcm@openssh.com',
      'aes256-cbc'
    ]
  }
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.broadcast.emit('connected');

    socket.on('disconnect', function(){
      socket.broadcast.emit('disconnected');
    });
    
    socket.on('chat message', function(msg){
      socket.broadcast.emit('chat message', msg);
    });
    console.log("Connected");

       var client = new Client();
       client.on('ready',function(){
       console.log('SSH connected');

      client.shell(false,function(err, stream) {
        if (err) throw err;

        stream.on('data', function(data) {
         // console.log('OUTPUT: ' + data.toString());
          socket.emit('ServerResponse', data.toString());
        })
        
        socket.on('command',function(msg){
         // console.log('Input: ' + msg);
          stream.write(msg + "\r\n");
        })
    })
  })
    client.connect(connect);
  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
