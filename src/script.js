import { renderer, camera, animate, canvasContainer } from './solar'

document.getElementById('toggle-expand').addEventListener('click', (e) => {
	const mainCanvas = document.getElementById('canvas-container');
	mainCanvas.style.height = mainCanvas.style.height != '100vh' ? '100vh' : '50vh';
	e.target.classList.toggle("shrink");
})

renderer.setAnimationLoop(animate);
const observer = new ResizeObserver((entries) => {
	camera.aspect = entries[0].contentRect.width / entries[0].contentRect.height;
    camera.updateProjectionMatrix();
    renderer.setSize(entries[0].contentRect.width, entries[0].contentRect.height);
})
observer.observe(canvasContainer);
// console.log("Everything is run")