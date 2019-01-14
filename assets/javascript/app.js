// initializing firebase
var config = {
    apiKey: "AIzaSyAqIrV6ZDW9HTlFth0ptCTNT3zExf9y-HA",
    authDomain: "trainschedule-de1b8.firebaseapp.com",
    databaseURL: "https://trainschedule-de1b8.firebaseio.com",
    projectId: "trainschedule-de1b8",
    storageBucket: "",
    messagingSenderId: "934151729989"
};
firebase.initializeApp(config);

// variables
var database = firebase.database();

// onclick function
$("#addTrain").on("click", function (event) {
    event.preventDefault();
    // create variables from user input
    var trainName = $('#nameInput').val().trim();
    var destination = $('#destinationInput').val().trim();
    var firstTrainTime = moment($('#firstTrainInput').val().trim(), "HH:mm").format("X");
    var frequency = $('#frequencyInput').val().trim();

    //local temp object for database
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    }
    //push to database
    database.ref().push(newTrain)
    //consolelog latest data
    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);
    // empty input boxes
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");
});
// event to add data to firebase
database.ref().on("child_added", function (childSnapshot) {
       // update the variable with data from the database
        var newTrainName = childSnapshot.val().trainName;
        var newDestination = childSnapshot.val().destination;
        var newTime = childSnapshot.val().firstTrainTime;
        var newFrequency = childSnapshot.val().frequency;
        // consolelog new train data
        console.log(newTrainName);
        console.log(newDestination);
        console.log(newTime);
        console.log(newFrequency);

        // moment.js 
        var tFrequency = newFrequency;
        var firstTime = newTime;
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        // create new row for train data
        var newRow = $("<tr>").append(
            $("<td>").text(newTrainName),
            $("<td>").text(newDestination),
            $("<td>").text(newFrequency),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
        );
        // append the new row
        $("#newTrains").append(newRow);
    },
        // handle errors
    function (errorObject) {
        // In case of error this will print the error
        console.log("The read failed: " + errorObject.code);

    });