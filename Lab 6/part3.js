(function () {
	// Add the click handler for the button
    $("button").on("click", function() {
        $("#allUpper").text($("#myInput").val().toUpperCase());

        $("#allLower").text($("#myInput").val().toLowerCase());

        $("#redText").text($("#myInput").val());
        $("#redText").css("color", "red");

        $("#flashyText").text($("#myInput").val());
        $("#flashyText").addClass("flashy");
    });
})();