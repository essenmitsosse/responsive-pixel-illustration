export const updateDocumentTitle = (imageName, queryString) => {
	let name = imageName;
	// add resizeable to the title
	if (queryString.resizeable) {
		name += ' resizeable';
	}
	// Display the id for the Seedable Random Number Generator in the title;
	if (queryString.id) {
		name += ` (${queryString.id})`;
	}
	// Display the imageName as the title
	document.title = name;
};
