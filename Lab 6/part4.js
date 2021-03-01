(function () {
	const resources = "http://students.engr.scu.edu/~adiaztos/resources/";

	// Load sample1.php
	$("#sample1").load(resources + "sample1.php");

	// Load sample2.php
	$("#sample2").load(resources + "sample2.php");

	// Get sample3.php
	$.get(resources + "sample3.php", function (data) {
		const response = JSON.parse(data);
		const list = $("<ul></ul>");
		for (let i = 0; i < response.friends.length; i++) {
			list.append($("<li></li>").text(response.friends[i].name))
		}
		$("#sample3").append(list);
	})

})();