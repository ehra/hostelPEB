var socket = io('/');
  
  socket.on('connect',function(socket){
  	console.log("Client connection");
  });
  
  function forgot(val){
    socket.emit('forgot',val);
  };
  
  socket.on('reply',function(key){
    $("#groupKey").text(key);
  });