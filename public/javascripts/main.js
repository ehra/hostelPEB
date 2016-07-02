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
