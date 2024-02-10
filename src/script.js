document.getElementById('toggle-expand').addEventListener('click', (e) => {
	const mainCanvas = document.getElementById('canvas-container');
	mainCanvas.style.height = mainCanvas.style.height != '100vh' ? '100vh' : '50vh';
})