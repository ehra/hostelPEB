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
    $("#first_name").text(jone.name);
    $("#pass_key").text(jone.Passkey);
    $("#branch").text(jone.Branch);
    $("#room_type").text(jone.room_type);
  });

  