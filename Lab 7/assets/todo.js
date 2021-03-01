(function () {
	"use strict";
	const template = $("#todo-template");
	let index = 0;
	template.hide();

	$("#todo-form").find("button").click(function (event) {
		event.preventDefault();

		const inputField = $("#todo-form input[type='text']");

		$.ajax({
			method: 'POST',
			url: "todoList", 
			contentType: 'application/json',
			data: JSON.stringify({
				todo: inputField.val()
			}),
			dataType: 'json'
		});

		const newTodo = template.clone();

		newTodo.find("input[type='text']").val(inputField.val());
		newTodo.find(".input-group-prepend .input-group-text").text(++index);

		newTodo.show();

		$(".card-body#todo-list").append(newTodo);

		inputField.val("");
	});

	$.get("todoList", function(data) {

		for (let i = 0; i < data.length; i++) {
			const newTodo = template.clone();
			newTodo.attr("id", data[i].id);
			newTodo.find("input[type='text']").val(data[i].description);
			newTodo.find(".input-group-prepend .input-group-text").text(++index);
			newTodo.show();
			$(".card-body#todo-list").append(newTodo);	
		}

	});
}());	