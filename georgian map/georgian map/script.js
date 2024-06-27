document.addEventListener('DOMContentLoaded', function() {
	// Get all the path elements
	let paths = document.querySelectorAll('path');
	let visitedCountElement = document.getElementById('visited-count');
	let visitedCounterDiv = document.querySelector('.visited-counter');
	let congratsAnimation = document.getElementById('congrats-animation'); // Assuming you have an element for congrats animation

	// Function to update the visibility of the visited counter
	function updateVisitedCounterVisibility() {
		 if (parseInt(visitedCountElement.innerText) > 0) {
			  visitedCounterDiv.style.display = 'block';
		 } else {
			  visitedCounterDiv.style.display = 'none';
		 }
	}

	// Function to save state to local storage
	function saveState() {
		 let state = [];
		 paths.forEach(function(path) {
			  state.push({
					id: path.id,
					clicked: path.getAttribute('data-clicked'),
					color: path.style.fill
			  });
		 });
		 localStorage.setItem('pathState', JSON.stringify(state));
		 localStorage.setItem('visitedCount', visitedCountElement.innerText);
	}

	// Function to load state from local storage
	function loadState() {
		 let state = JSON.parse(localStorage.getItem('pathState'));
		 if (state) {
			  state.forEach(function(item) {
					let path = document.getElementById(item.id);
					if (path) {
						 path.setAttribute('data-clicked', item.clicked);
						 path.style.fill = item.color;
					}
			  });
		 }
		 let visitedCount = localStorage.getItem('visitedCount');
		 if (visitedCount) {
			  visitedCountElement.innerText = visitedCount;
		 }
	}

	// Function to check if all regions are visited
	function allRegionsVisited() {
		 let allVisited = true;
		 paths.forEach(function(path) {
			  if (path.getAttribute('data-clicked') !== 'true') {
					allVisited = false;
			  }
		 });
		 return allVisited;
	}

	// Add event listener to each path element
	paths.forEach(function(path) {
		 // Add a custom attribute to track the state of each path
		 path.setAttribute('data-clicked', 'false');

		 path.addEventListener('click', function() {
			  let clicked = this.getAttribute('data-clicked');

			  if (clicked === 'false') {
					// Change color of clicked path
					this.style.fill = '#10c51f'; // Change to desired color

					// Update visited count
					let visitedCount = parseInt(visitedCountElement.innerText);
					visitedCount++;
					visitedCountElement.innerText = visitedCount;

					// Update state of path
					this.setAttribute('data-clicked', 'true');
			  } else {
					// Change color back to original
					this.style.fill = ''; // Revert to original color

					// Update visited count
					let visitedCount = parseInt(visitedCountElement.innerText);
					visitedCount--;
					visitedCountElement.innerText = visitedCount;

					// Update state of path
					this.setAttribute('data-clicked', 'false');
			  }

			  // Save state to local storage
			  saveState();

			  // Update the visibility of the visited counter
			  updateVisitedCounterVisibility();

			  // Check if all regions are visited
			  if (allRegionsVisited()) {
					// Display congrats animation
					congratsAnimation.style.display = 'block';
			  } else {
					// Hide congrats animation if it's displayed
					congratsAnimation.style.display = 'none';
			  }
		 });

		 // Add mouseenter and mouseleave event listeners
		 // Your existing code for hover effects
	});

	// Load state from local storage
	loadState();

	// Initial check to hide or show the visited counter
	updateVisitedCounterVisibility();

	// Add event listener to copy the current page URL to clipboard
	document.getElementById('copyLinkButton').addEventListener('click', function() {
		 const link = window.location.href;  // Get the current page URL
		 navigator.clipboard.writeText(link).then(function() {
			  // Show the notification
			  const notification = document.getElementById('notification');
			  notification.style.display = 'block'; // Ensure it's visible

			  // Hide the notification after 3 seconds
			  setTimeout(function() {
					notification.style.display = 'none';
			  }, 3000);
		 }, function(err) {
			  console.error('Could not copy text: ', err);
		 });
	});

	// Add event listener to download the current SVG map as a JPG image
	document.getElementById('downloadButton').addEventListener('click', function() {
		 const svgElement = document.querySelector('svg'); // Get the SVG element
		 const canvas = document.createElement('canvas'); // Create a canvas element
		 const ctx = canvas.getContext('2d'); // Get the 2D context of the canvas

		 // Set canvas dimensions to match SVG element
		 canvas.width = svgElement.clientWidth;
		 canvas.height = svgElement.clientHeight;

		 // Create a new image element
		 const img = new Image();

		 // Serialize SVG to XML and embed CSS styles
		 const svgData = new XMLSerializer().serializeToString(svgElement);
		 const cssStyles = `
		 /* CSS styles */
		 `;
		 const svgWithStyles = `
			  <svg xmlns="http://www.w3.org/2000/svg" width="${svgElement.clientWidth}" height="${svgElement.clientHeight}">
					<style>${cssStyles}</style>
					${svgElement.innerHTML}
			  </svg>
		 `;

		 // Create a data URL from the styled SVG
		 const svgUrl = 'data:image/svg+xml;base64,' + btoa(svgWithStyles);

		 // Set the source of the image element to the SVG data URL
		 img.src = svgUrl;

		 // Draw the image onto the canvas once it's loaded
		 img.onload = function() {
			  // Set the background color to white
			  ctx.fillStyle = 'white';
			  ctx.fillRect(0, 0, canvas.width, canvas.height);

			  // Draw the SVG image on top of the white background
			  ctx.drawImage(img, 0, 0);

			  // Convert the canvas content to a data URL representing a JPEG image
			  const jpgUrl = canvas.toDataURL('image/jpeg');

			  // Create a temporary anchor element
			  const a = document.createElement('a');
			  a.href = jpgUrl;
			  a.download = 'map.jpg'; // Set the download attribute to specify the file name

			  // Programmatically trigger a click event to download the image
			  a.click();
		 };
	});
});
