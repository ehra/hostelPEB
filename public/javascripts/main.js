/*---For Register.Jade----*/

$(function(){
  $("#choice").on("change",function(){
   var choice = $("#choice").val();
   console.log(choice);
   if(choice == "YES"){
    $("#pass_word22").hide();
    $("#pass_word32").hide();
   }else{ 
    $("#pass_word22").show();
    $("#pass_word32").show();  
    }
   });
}); 

$(function(){
  $("#index-link").click(function(){
    window.location.href = "/";
  });
  $("#rgstr-link").click(function(){
    window.location.href = "/register";
  });
  $("#frnds-link").click(function(){
    window.location.href = "/friends";
  });
  $("#intr-link").click(function(){
    window.location.href = "/rules";
  });
});