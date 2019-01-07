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

  $("#submitButton").on("click", function() {
    event.preventDefault();

    var name = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#firstTrainTime").val().trim();
    var frequency= $("#frequency").val().trim();


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

});

database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
   
   var name = snapshot.val().name;
   var destination = snapshot.val().destination;
   var firstTrainTime= snapshot.val().firstTrainTime;
   var frequency = snapshot.val().frequency;
   var dateAdded = snapshot.val().dateAdded;
   // to find the next arrival time and mins to arrival you cave to find the difference between the current time and first train time
   //then take that number and find the remainder of that number and the frequency
   //the mins to arrival would be the frequency minus the remainder of the previous
   // the next arrival time would be the current time plus difference between the frequency and remainder
   var diffOfCurrentAndFirstTime = moment().diff(moment(firstTrainTime, "HH:mm"), "minutes");
   var timeDiffandFreqRemainder = diffOfCurrentAndFirstTime % frequency;
   var minsTillArrival = frequency - timeDiffandFreqRemainder;
   var actualArrival = moment().add(minsTillArrival, "minutes").format("HH:mm");
   var row = $("<tr>");

   if(moment(firstTrainTime, "HH:mm") > moment()){
       actualArrival = moment(firstTrainTime, "HH:mm").format("HH:mm");
       minsTillArrival = moment(firstTrainTime, "HH:mm").diff(moment(), "minutes");
       row.appendTo("#tableBody");
       $("<td>"+name+"</td>").appendTo(row);
       $("<td>"+destination+"</td>").appendTo(row);
       $("<td>"+frequency+"</td>").appendTo(row);
       $("<td>"+actualArrival+"</td>").appendTo(row);
       $("<td>"+minsTillArrival+"</td>").appendTo(row);
   } else {
        row.appendTo("#tableBody");
        $("<td>"+name+"</td>").appendTo(row);
        $("<td>"+destination+"</td>").appendTo(row);
        $("<td>"+frequency+"</td>").appendTo(row);
        $("<td>"+actualArrival+"</td>").appendTo(row);
        $("<td>"+minsTillArrival+"</td>").appendTo(row);
   }

});