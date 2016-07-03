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
var socket = io('//localhost:3000/users');
  
function op(){
      socket.emit('message', $('input[name=yolo]:checked', '#myForm').prop('id'));
};
	
	socket.on('message', function(data){
		 if(data.group == 1 && data.vaccancy==1){
		 		$(".vac_alert").css('display','none');
		 		$("#"+ data.room).after("<span class='badge vac_alert'style='background-color:#E53935'>(1)</span>");
		 }else{
		 	$("#"+ data.room).hide();			 
		 } 
		});

	socket.on('rooms',function(newRooms){
		for(var i=0;i<newRooms.rooms.length;i++){
			if(!newRooms.group && newRooms.rooms[i].vaccancy == 1){
				//var rN = newRooms.rooms[i].room_number;
				if(($("#"+newRooms.rooms[i].room_number).has(".vac_alert")))
				{
			     $(".vac_alert").css('display','none');
			     $("#"+newRooms.rooms[i].room_number).after("<span class='badge vac_alert' style='background-color:#E53935'>(1)</span>");
				}
				else{
				 $("#"+newRooms.rooms[i].room_number).after("<span class='badge vac_alert' style='background-color:#E53935'>(1)</span>");
				}
			}else{
				//nothing left go faggot
			  $("#"+newRooms.rooms[i].room_number).hide();
			}
		}
	});
			  
		  