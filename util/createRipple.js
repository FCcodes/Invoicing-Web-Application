export const createRipple = (element, event) =>{
    
	const circle = document.createElement("span");
	const diameter = Math.max(
		element.clientWidth,
		element.clientHeight
	);

    
	const radius = diameter / 2;
	circle.style.width = circle.style.height = `${diameter}px`;
	circle.style.left = `${event.clientX - (element.offsetLeft + radius)}px`;
	circle.style.top = `${event.clientY - (element.offsetTop + radius)}px`;	

	const ripple = element.getElementsByClassName("ripple")[0];
    
	if (ripple) {
		ripple.remove();
	}
    

    circle.classList.add("ripple");    
    element.appendChild(circle);
    

	
};
