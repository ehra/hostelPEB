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

//Connection to users page only
var socket = io('//localhost:3000/users');
  
function op(){
      socket.emit('message', $('input[name=yolo]:checked', '#myForm').prop('id'));
};
	
	socket.on('message', function(data){
		 if(data.group == 1 && data.vaccancy==1){
			$("#"+ data.room).after("<span class='badge' style='background-color:#E53935'>(1)</span>");
		 }else{
		 	$("#"+ data.room).hide();			 
		 }
		});

	socket.on('rooms',function(newRooms){
		for(var i=0;i<newRooms.rooms.length;i++){
			if(!newRooms.group && newRooms.rooms[i].vaccancy == 1){
				//only one room left
			  $("#"+newRooms.rooms[i].room_number).after("<span class='badge' style='background-color:#E53935'>(1)</span>");
			}else{
				//nothing left go faggot
			  $("#"+newRooms.rooms[i].room_number).hide();
			}
		}
	});
			  
		  