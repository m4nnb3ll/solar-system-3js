import planets from './planets';

export function displayModal(state)
{
	const modal = document.getElementById('modal');
	if (state.selectedPlanet)
	{
		if (!modal.classList.contains('active'))
			modal.classList.add('active');
		const img = modal.querySelector('img');
		img.src = planets[state.selectedPlanet].img;
		img.alt = state.selectedPlanet;
		modalBody = modal.querySelector('#modal-body');
		modalBody.innerHTML = `
			<h2 class="title">${state.selectedPlanet.toUpperCase()}</h2>
			<p>
				${(() => {
					let content = '';
					for (let key in planets[state.selectedPlanet])
						content += ((key != 'img')
									&& `<p class="description-field"><b>${key}</b>: ${planets[state.selectedPlanet][key]}<br/><p>` || '');
					return content;
				})()}
			</p>
		`
	}
	else if (!state.selectedPlanet && modal.classList.contains('active'))
		modal.classList.remove('active');
}

export function isMouseOverModal(mouseX, mouseY)
{
	const modal = document.getElementById('modal');
	const modalRect = modal.getBoundingClientRect();  
	return (
		modal.classList.contains('active') &&
		mouseX >= modalRect.left &&
		mouseX <= modalRect.right &&
		mouseY >= modalRect.top &&
		mouseY <= modalRect.bottom
	);
}