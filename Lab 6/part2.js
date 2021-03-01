(function () {
	const template = document.getElementById("template");

	// remove template from the page, since it is only a template
	const parent = template.parentNode;
	parent.removeChild(template);

	// Create an XMLHttpRequest object
	const xhttp = new XMLHttpRequest();

	// Set onreadystatechange
	xhttp.onreadystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			const contact = JSON.parse(this.responseText);
			populateContacts(contact);
		}
	}

	// Open and send requests
	xhttp.open("GET", "http://students.engr.scu.edu/~adiaztos/resources/contacts.php", true);
	xhttp.send();

	// This function takes the list of contacts and clones a new element from the template with the value of each contact
	function populateContacts(contacts) {
		for (let i = 0; i < contacts.length; i++){
			const node = template.cloneNode(true);

			// set node ID to contact ID
			node.id = contacts[i].id;

			// replace the contact index
			node.innerHTML = node.innerHTML.replace("1", i + 1);

			// replace index span with unique ID
			node.innerHTML = node.innerHTML.replace(/index/g, i + 1 + node.id);

			// replace the name
			node.innerHTML = node.innerHTML.replace('name="name"', 'value="' + contacts[i].name + '" name="name"');

			// replace the email
			node.innerHTML = node.innerHTML.replace('name="email"', 'value="' + contacts[i].email + '" name="email"');

			parent.appendChild(node);
		}
	}

	// submits a request with the search query for the filtered list of contacts
	function search() {
		// clear the current contacts list
		while (parent.lastChild) {
			parent.removeChild(parent.lastChild);
		}

		//get the search query and return the contacts
		let query = "http://students.engr.scu.edu/~adiaztos/resources/contacts.php?query=";
		query += document.getElementById("searchField").value;
		xhttp.open("POST", query, true);
		xhttp.send();
	}

	// assign the search function as the click handler for search button
	document.getElementById("searchBtn").onclick = function(){search();};
	
})();