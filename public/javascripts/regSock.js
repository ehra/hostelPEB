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
    $("#first_name").val(jone.name);
    $("#roll_num").val(jone.roll_num);
    $("#branch").val(jone.Branch);
  });

  