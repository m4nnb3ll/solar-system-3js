import * as THREE from 'three';
import * as dat from 'dat.gui';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { displayModal, isMouseOverModal } from './modal';
// Textures
import spaceTexture from '../assets/textures/space.jpg';
import sunTexture from '../assets/textures/sun.jpg';
import mercuryTexture from '../assets/textures/mercury.jpg';
import venusTexture from '../assets/textures/venus.jpg';
import earthTexture from '../assets/textures/earth.jpg';
import marsTexture from '../assets/textures/mars.jpg';
import jupiterTexture from '../assets/textures/jupiter.jpg';
import saturnTexture from '../assets/textures/saturn.jpg';
import saturnRingTexture from '../assets/textures/saturn_ring.png';
import uranusTexture from '../assets/textures/uranus.jpg';
import uranusRingTexture from '../assets/textures/uranus_ring.png';
import neptuneTexture from '../assets/textures/neptune.jpg';
import plutoTexture from '../assets/textures/pluto.jpg';

const state = { speed: 1, selectedPlanet: undefined }

export const canvasContainer = document.getElementById('canvas-container');
export const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
canvasContainer.insertBefore(renderer.domElement, canvasContainer.firstChild);

const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
    45,
    canvasContainer.clientWidth / canvasContainer.clientHeight,
    1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-100, 100, 100);
orbit.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    spaceTexture,
    spaceTexture,
    spaceTexture,
    spaceTexture,
    spaceTexture,
    spaceTexture
]);

const textureLoader = new THREE.TextureLoader();

const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.name = "sun";
scene.add(sun);

function ringMaker({innerRadius, outerRadius, segments, color, texture})
{
	const ringGeo = new THREE.RingGeometry(
		innerRadius,
		outerRadius,
		segments);
	let	ringMaterial = color
		?	new THREE.MeshBasicMaterial({ color })
		:	new THREE.MeshBasicMaterial({ map: textureLoader.load(texture), side: THREE.DoubleSide });
	return (new THREE.Mesh(ringGeo, ringMaterial));
}

function planetMaker(name, size, texture, position, ringOpts) {
    const geo = new THREE.SphereGeometry(size, 30, 30);
    const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(texture)
    });
    const planet = new THREE.Mesh(geo, mat);
	planet.name = name;
    const planetCenter = new THREE.Object3D();
    planetCenter.add(planet);
    let ring;
	if(ringOpts) {
		ring = ringMaker(ringOpts);
		planetCenter.add(ring);
		ring.position.x = position;
		ring.rotation.x = (ringOpts.tilt || -0.5) * Math.PI;
    }
	const planetPath = ringMaker({
		innerRadius: position, outerRadius: position + .1,
		segments: 42, color: 0xffffff
	})
	scene.add(planetPath);
	planetPath.rotation.x = -0.5 * Math.PI;
    scene.add(planetCenter);
    planet.position.x = position;
    return {planet, planetCenter, ring}
}

const mercury = planetMaker("mercury", 3.2, mercuryTexture, 28);
const venus = planetMaker("venus", 5.8, venusTexture, 44);
const earth = planetMaker("earth", 6, earthTexture, 62);
const mars = planetMaker("mars", 4, marsTexture, 78);
const jupiter = planetMaker("jupiter", 12, jupiterTexture, 100);
const saturn = planetMaker("saturn", 10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
	segments: 32,
	tilt: 26.73 / 180,
    texture: saturnRingTexture
});
const uranus = planetMaker("uranus", 7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
	segments: 32,
	tilt: 97.77 / 180,
    texture: uranusRingTexture
});
const neptune = planetMaker("neptune", 7, neptuneTexture, 200);
const pluto = planetMaker("pluto", 2.8, plutoTexture, 216);

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300, 0);
scene.add(pointLight);

const pointerPosition = new THREE.Vector2(-1, -1);
canvasContainer.addEventListener('pointermove', (e) => {
  const rect = canvasContainer.getBoundingClientRect(); 
  pointerPosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  pointerPosition.y = - ((e.clientY - rect.top) / rect.height) * 2 + 1;
});

document.getElementById('close-btn').addEventListener('mousedown',(e) => {
	if (e.button != 0) return ;
	state.selectedPlanet = undefined;
	document.getElementById('modal').classList.remove('active');
});

const rayCaster = new THREE.Raycaster();
canvasContainer.addEventListener('mousedown', (e) => {
	if (e.button != 0) return ;
	const clickPosition = new THREE.Vector2();
	const rect = canvasContainer.getBoundingClientRect(); 
	clickPosition.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
	clickPosition.y = - ((e.clientY - rect.top) / rect.height) * 2 + 1;
	// check the intersection
	rayCaster.setFromCamera(clickPosition, camera);
    intersects = rayCaster.intersectObjects(scene.children);
	if (!isMouseOverModal(e.clientX, e.clientY))
	{
		if (intersects.length)
		{
			for (let i = 0; i < intersects.length; i++)
			{
				if (intersects[i].object.name)
				{
					state.selectedPlanet = intersects[i].object.name;
					break ;
				}
			}
		}
		else
			state.selectedPlanet = undefined;
	}
	displayModal(state);
}); 

export function animate() {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.planet.rotateY(0.004);
    venus.planet.rotateY(0.002);
    earth.planet.rotateY(0.02);
    mars.planet.rotateY(0.018);
    jupiter.planet.rotateY(0.04);
    saturn.planet.rotateY(0.038);
	saturn.ring.rotateZ(0.030);
    uranus.planet.rotateY(0.03);
	uranus.ring.rotateZ(0.022);
    neptune.planet.rotateY(0.032);
    pluto.planet.rotateY(0.008);

    //Around-sun-rotation
    mercury.planetCenter.rotateY(0.04 * state.speed);
    venus.planetCenter.rotateY(0.015 * state.speed);
    earth.planetCenter.rotateY(0.01 * state.speed);
    mars.planetCenter.rotateY(0.008 * state.speed);
    jupiter.planetCenter.rotateY(0.002 * state.speed);
    saturn.planetCenter.rotateY(0.0009 * state.speed);
    uranus.planetCenter.rotateY(0.0004 * state.speed);
    neptune.planetCenter.rotateY(0.0001 * state.speed);
    pluto.planetCenter.rotateY(0.00007 * state.speed);

	rayCaster.setFromCamera(pointerPosition, camera);
	let intersects = [];
	if (pointerPosition.x != -1 || pointerPosition.y != -1)
		intersects = rayCaster.intersectObjects(scene.children);
	document.body.style.cursor = intersects.length ? 'pointer' : 'auto';
    renderer.render(scene, camera);
}

const gui = new dat.GUI();
gui.add({speed: 1}, 'speed', 0, 10).onChange((e) => {
	state.speed = e;
});

const guiElement = gui.domElement;
guiElement.style.position = 'absolute';
guiElement.style.top = '1rem';
guiElement.style.right = '0';
canvasContainer.appendChild(guiElement);
