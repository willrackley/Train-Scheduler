var config = {
     apiKey: "AIzaSyAiNa0JZmuxuCLnP8GxDvDjnTjeLyp_3yI",
     authDomain: "train-scheduler-bootcamp.firebaseapp.com",
     databaseURL: "https://train-scheduler-bootcamp.firebaseio.com",
     projectId: "train-scheduler-bootcamp",
     storageBucket: "train-scheduler-bootcamp.appspot.com",
     messagingSenderId: "793449061315"
   };
   firebase.initializeApp(config);

   

  var database = firebase.database();
 
  $(".editForm").hide();

//submit button in the add train form that adds the train information to the database
  $("#submitButton").on("click", function() {
    event.preventDefault();

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency= $("#frequency").val().trim();
    
 
    if(name === "" || $("#destination").val() === "" || $("#firstTrainTime").val() === "" || $("#frequency").val() === "") {
        alert("Please complete all input fields.");
    } else {
    database.ref().push({
      name: name,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $("#name").val(" ");
    $("#destination").val(" ");
    $("#firstTrainTime").val(" ");
    $("#frequency").val(" ");
    
}

});

database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {

   var name = snapshot.val().name;
   var destination = snapshot.val().destination;
   var firstTrainTime= snapshot.val().firstTrainTime;
   var frequency = snapshot.val().frequency;
   var dateAdded = snapshot.val().dateAdded;
   var key = snapshot.key;
   var editKey = snapshot.key;
   

   // to find the next arrival time and mins to arrival you cave to find the difference between the current time and first train time
   //then take that number and find the remainder of that number and the frequency
   //the mins to arrival would be the frequency minus the remainder of the previous
   // the next arrival time would be the current time plus difference between the frequency and remainder
   var diffOfCurrentAndFirstTime = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes");
   var timeDiffandFreqRemainder = diffOfCurrentAndFirstTime % frequency;
   var minsTillArrival = frequency - timeDiffandFreqRemainder;
   var actualArrival = moment().add(minsTillArrival, "minutes").format("HH:mm");
   var row = $("<tr class="+key+">");
   var option = $("<option id=" +editKey+">");
   
   //check to see if the first train out is later than the current time, 
   //if so then we set the next arrival time to the first train time
   if(moment(firstTrainTime, "HH:mm") > moment()){
       actualArrival = moment(firstTrainTime, "HH:mm").format("HH:mm");
       minsTillArrival = moment(firstTrainTime, "HH:mm").diff(moment(), "minutes");
       row.appendTo("#tableBody");
       $("<td>"+"<button class=deleteButton databaseKey="+ key+">"+"x"+"</button>"+"</td>").appendTo(row);
       $("<td>"+name+"</td>").appendTo(row);
       $("<td id="+"destinationData"+key+">"+destination+"</td>").appendTo(row);
       $("<td id="+"frequencyData"+ key+">"+frequency+"</td>").appendTo(row);
       $("<td id="+"actualArrivalData"+key+">"+actualArrival+"</td>").appendTo(row);
       $("<td id="+"minsTillArrivalData"+key+">"+minsTillArrival+"</td>").appendTo(row);
       $("<td>"+"<button class=editButton databaseKey="+ key+">"+"edit"+"</button>"+"</td>").appendTo(row);
       
   } else {
        row.appendTo("#tableBody");
        $("<td>"+"<button class=deleteButton databaseKey="+ key+">"+"x"+"</button>"+"</td>").appendTo(row);
        $("<td>"+name+"</td>").appendTo(row);
        $("<td id="+"destinationData"+key+">"+destination+"</td>").appendTo(row);
        $("<td id="+"frequencyData"+ key+">"+frequency+"</td>").appendTo(row);
        $("<td id="+"actualArrivalData"+key+">"+actualArrival+"</td>").appendTo(row);
        $("<td id="+"minsTillArrivalData"+key+">"+minsTillArrival+"</td>").appendTo(row);
        $("<td>"+"<button class=editButton databaseKey="+ key+">"+"edit"+"</button>"+"</td>").appendTo(row);
   }

   //function for doing the train math after its editted
   function trainMath(edittedFirstTrainTime, edittedFrequency, editButtonKey){

     if(edittedFrequency === ""){
          edittedFrequency = frequency;
          database.ref().child(editButtonKey).update({frequency: edittedFrequency});
     }if(edittedFirstTrainTime === ""){
          edittedFirstTrainTime = firstTrainTime;
          database.ref().child(editButtonKey).update({firstTrainTime: edittedFirstTrainTime});
     }
     
     var diffOfCurrentAndFirstTime = moment().diff(moment(edittedFirstTrainTime, "HH:mm"), "minutes");
     var timeDiffandFreqRemainder = diffOfCurrentAndFirstTime % edittedFrequency;
     var minsTillArrival = edittedFrequency - timeDiffandFreqRemainder;
     var actualArrival = moment().add(minsTillArrival, "minutes").format("HH:mm");
     database.ref().child(editButtonKey).update({firstTrainTime: edittedFirstTrainTime});
     database.ref().child(editButtonKey).update({frequency: edittedFrequency});

     if(moment(edittedFirstTrainTime, "HH:mm") > moment()){
          actualArrival = moment(edittedFirstTrainTime, "HH:mm").format("HH:mm");
          minsTillArrival = moment(edittedFirstTrainTime, "HH:mm").diff(moment(), "minutes");
     } 

     $("#actualArrivalData"+editButtonKey).text(actualArrival);
     $("#minsTillArrivalData"+editButtonKey).text(minsTillArrival);
     $("#frequencyData"+editButtonKey).text(edittedFrequency);
     }
  
   
   //deletes item from database and the DOM
     $(".deleteButton").unbind("click").on("click", function(){
          var key = $(this).attr("databaseKey");
          $("."+key).remove();
          database.ref().child(key).remove();
     });
  
     //opens the form that allows user to edit train info
     $(".editButton").unbind("click").on("click", function(){
          $("#editSubmitButton").removeAttr("editSubmitKey");
          $(".editForm").show();
          $("#editDestination").val("");
          $("#editFirstTrainTime").val("");
          $("#editFrequency").val("");
          var editButtonKey = $(this).attr("databaseKey")
          $("#editSubmitButton").attr("editSubmitKey",editButtonKey);

     //this submit button edits the train information
     $("#editSubmitButton").unbind("click").on("click", function(){
          var edittedDestination = $("#editDestination").val().trim();
          var edittedFirstTrainTime = $("#editFirstTrainTime").val().trim();
          var edittedFrequency = $("#editFrequency").val().trim();

          trainMath(edittedFirstTrainTime, edittedFrequency, editButtonKey);

          if(edittedDestination !== ""){
               database.ref().child(editButtonKey).update({destination: edittedDestination});
               $("#destinationData"+editButtonKey).text(edittedDestination);
          }
          $("#editSubmitButton").removeAttr("editSubmitKey");
          $(".editForm").hide();
          });

          $("#editCancelButton").unbind("click").on("click", function(){
               $(".editForm").hide();
               $("#editDestination").val("");
               $("#editFirstTrainTime").val("");
               $("#editFrequency").val("");
          });
          
     });
 
});