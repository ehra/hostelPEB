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
    $("#roll_num").text(jone.roll_num);
    $("#branch").text(jone.Branch);
  });

  