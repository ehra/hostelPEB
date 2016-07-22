var socket = io('/register');
  
  socket.on('connect',function(socket){
  	console.log("Client connection");
  });
  
  function verify(val){
    console.log(val);
    socket.emit('verify',val);
  };
  
  socket.on('jone',function(jone){
  	console.log(jone);
  });

  socket.on("rape",function(){
    console.log("Rape hogaya bc");
  });
  