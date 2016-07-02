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

var  socket = io.connect('//localhost:3000/users');
  
 function op(){
	  //	console.log("Working2");
      socket.emit('message', $('input[name=yolo]:checked', '#myForm').prop('id'));
	//  alert($('input[name=yolo]:checked', '#myForm').prop('id'));
  };
	
	 socket.on('message', function(data){
		 if(data.vaccancy==1){
			 console.log(data.vaccancy);
			 //show 1 room
			$(div).after("<span class='badge' style='background-color:#E53935'>(1)</span>");
		 }else if(data.vaccancy == 0){
		 	$("#"+ data).hide();			 
		 }
		 //Prints in browsers console
		 	console.log("Room:" + data);
     	 });

socket.on('rooms',function(rooms){
 	console.log("Working2");
		for(var i=0;i<rooms.length;i++){
			if(rooms[i].vaccancy == 1){
				//only one room left
				$(div).after("<span class='badge' style='background-color:#E53935'>(1)</span>");
			} else{
				//nothing left go faggot
				$("#"+rooms[i].room_number).hide();
			}

		}
	});
 		  
		  