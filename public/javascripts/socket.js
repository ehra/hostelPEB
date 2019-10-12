
$(document).ready(function(){
		$("#link1").click(function() {
			$(this).addClass("active");
			$("#link2").removeClass("active");
			$("#link3").removeClass("active");
			$("#tab1").show(0);
			$("#tab2").hide(0);
			$("#tab3").hide(0);
		});
		$("#link2").click(function() {
			$(this).addClass("active");
			$("#link1").removeClass("active");
			$("#link3").removeClass("active");
			$("#tab2").show(0);
			$("#tab1").hide(0);
			$("#tab3").hide(0);
		});
		$("#link3").click(function() {
			$(this).addClass("active");
			$("#link1").removeClass("active");
			$("#link2").removeClass("active");
			$("#tab3").show(0);
			$("#tab1").hide(0);
			$("#tab2").hide(0);
		});
	});

//Connection to users page only
var socket = io('/users');
  
  socket.on('connect',function(socket){
  	$("#room_book").css({'display':'block'});
  	console.log("Client connection");
  });
  
function op(){
	  console.log($('input[name=yolo]:checked', '#myForm').prop('id'));
      socket.emit('book_req', $('input[name=yolo]:checked', '#myForm').prop('id'));
};

socket.on('lie',function(){
		$('#error').css({'display':'block'});
		$('#error').delay(5000).fadeOut();
	});
		
	socket.on('booked', function(data){
		 var kamra = "#" + data.room;
		 if(data.group == 1 && data.vaccancy==1){
		 		$(kamra).siblings("span").css({'display':'none'});
		 		$(kamra).after("<span class='badge' style='background-color:#E53935'>(1)</span>");
		 }
		 else{
		 	$(kamra).siblings("span").css({'display':'none'});
		 	$(kamra).hide();		 
		 } 
	});
	
	
	socket.on('rooms',function(newRooms){
		console.log(newRooms);
		for(var i=0; i < newRooms.rooms.length; i++){
			if(!newRooms.group && newRooms.rooms[i].vaccancy == 1){
				 $("#"+newRooms.rooms[i].room_number+"div").find("span").css({'display':'none'});
			     $("#"+newRooms.rooms[i].room_number).after("<span class='badge' style='background-color:#E53935'>(1)</span>");		
 			}else{
				//nothing left go faggot
			  $("#"+newRooms.rooms[i].room_number).hide();
			}
		}
	});

	socket.on('end',function(last){
		if(last){
			if(last.text==null){ 
				window.location.href = "/users";
			}
			else{
				window.location.href = last.url+'?room='+last.text;
			}
		}
		else{
			window.location.href = "/";
		}	
});
			  
		  
