$(document).ready(function(){
		$("#link1").click(function() {
			$("#tab1").show(0);
			$("#tab2").hide(0);
			$("#tab3").hide(0);
		});
		$("#link2").click(function() {
			$("#tab2").show(0);
			$("#tab1").hide(0);
			$("#tab3").hide(0);
		});
		$("#link3").click(function() {
			$("#tab3").show(0);
			$("#tab1").hide(0);
			$("#tab2").hide(0);
		});
	});
 
 var  socket = io.connect('//localhost:5000');

     function op(){
      socket.emit('chat message', $('input[name=yolo]:checked', '#myForm').val());
	 };
	 
	 socket.on('message', function(msg){
		 console.log("oo");
      	 $("input[value=msg]").attr('disabled',true);
	  	 alert($("input[value=msg]").val());
     });
    