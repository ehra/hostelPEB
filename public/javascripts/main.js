/*---For Register.Jade----*/

$(function(){
  $("#choice").on("change",function(){
   var choice = $("#choice").val();
   console.log(choice);
   if(choice == "YES"){
    $("#pass_word").hide();
    $("#pass_word2").hide();
   }else{ 
    $("#pass_word").show();
    $("#pass_word2").show();  
    }
   });
}); 
 
 
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
 
 var  socket = io.connect('//localhost:3000');
 
 socket.on('rooms',function(rooms){
		for(var i=0;i<rooms.length;i++){
			if(rooms[i].vaccancy == 1){
				//only one room left
			}else{
				//nothing left go faggot
				$("#"+rooms[i].room_number).hide();
			}

		}
	});
 
 function op(){
      socket.emit('chat-message', $('input[name=yolo]:checked', '#myForm').prop('id'));
	};
	
	 socket.on('chat-message', function(msg){
		 //Prints in browsers console
		 	console.log("Shit:" + msg);
		 	$("#"+msg).hide();
     	 });
    
	
