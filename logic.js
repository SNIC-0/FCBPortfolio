let board;
let score = 0;
let rows = 4;
let columns = 4;

//will be used to monitor if the user already won
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//variables for touch input
let startX = 0;
let startY = 0;

//create function to set the game board
//setGame() is used to set the game board
function setGame(){
	
	board = [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){
			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile, num);

			document.getElementById("board").append(tile);

		}
	}

	setTwo();
	setTwo();
}
	//This function is to update the appearance of the tile based on its number
	function updateTile(tile, num){

		tile.innerText="";
		tile.classList.value="";

		tile.classList.add("tile");

		if(num > 0) {
			//This will display the number of the tile
			tile.innerText = num.toString();

			if (num <= 4096){
				tile.classList.add("x"+num.toString());
			} else {
				//Then if the num value is greater than 4096, it will use class x8192 to color the tile
				tile.classList.add("x8192");
			}
		}
	}

	window.onload = function(){
		setGame();

}


function handleSlide(e){ // e = event
	console.log(e.code); //prints the key being pressed

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){



			if(e.code == "ArrowLeft"){
				SlideLeft();
				setTwo();
			}
			else if(e.code == "ArrowRight"){
				SlideRight();
				setTwo();
			}
			else if(e.code == "ArrowUp"){
				SlideUp();
				setTwo();
			}
			else if(e.code == "ArrowDown"){
				SlideDown();
				setTwo();
			}
		}

		document.getElementById("score").innerText = score;


		setTimeout(() => {
			checkWin();

		}, 2000);

		if(hasLost() == true){
			setTimeout(() => {
				alert("Game Over!");
				restartGame();
				alert("Click an arrow key to restart");
			}, 100)
		}
}

document.addEventListener("keydown", handleSlide);

//removes the zeroes from the row / col
function filterZero(row){
	return row.filter(num => num != 0);

}

//merges the adjacent  tiles
function slide(row){
	row = filterZero(row);

	for(let i = 0; i<row.length -1; i++){
		if(row[i] == row[i+1]){
			row[i] *= 2; //merge - doubles the first tile to merge
			row[i + 1] = 0;

			score += row[i];
		}
	}

	row = filterZero(row);

	//add zeroes on the back after merging
	while(row.length < columns){
		row.push(0); //adds zero from behind
	}

	return row; // submits the updated row / column
}

function SlideLeft(){

	for(let r=0; r<rows; r++){
		let row = board[r];

		//line for animation
		let originalRow = row.slice();
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			//line for animation
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s"; 
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}

		}
	}
}

function SlideRight(){

	for(let r=0; r<rows; r++){
		let row = board[r];

		//line for animation
		let originalRow = row.slice();

		row.reverse();
		row = slide(row);
		row.reverse();


		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			updateTile(tile, num);

			//line for animation
			if(originalRow[c] !== num && num !== 0){ // if the original tile !== current tile, apply animation
				tile.style.animation = "slide-from-left 0.3s"
				setTimeout(() => {
					tile.style.animation = "";
				},300);
			}
		}
	}
}

function SlideUp(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();

		col = slide(col);

		let changedIndeces = [];
		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndeces.push(r);
			}
		}

		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(changedIndeces.includes(r) && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
			updateTile(tile, num);
		}
	}

}

function SlideDown(){
	for(let c = 0; c < columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();

		col.reverse();
		col = slide(col);
		col.reverse();

		let changedIndeces = [];
		for(let r = 0; r < rows; r++){
			if(originalCol[r] !== col[r]){
				changedIndeces.push(r);
			}
		}

		for(let r = 0; r < rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(changedIndeces.includes(r) && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 300);
			}
			updateTile(tile, num);
		}
	}

}

function hasEmptyTile(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			if(board[r][c] == 0){
				return true;
			}
		}
	}

	return false;
}

function setTwo(){

	if(hasEmptyTile() == false){
		return
	}

	let found = false;

	while(found == false){
		let r = Math.floor(Math.random() * rows);
		let c = Math.floor(Math.random() * columns);

		if(board[r][c] == 0){

			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function checkWin(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){

			if(board[r][c] == 2048 && is2048 == false){
				alert("You Win! You got the 2048");
				is2048Exist = true;
			}

			else if(board[r][c] == 4096 && is4096 == false){
				alert("You Win! You got the 4096");
				is4096Exist = true;
			}

			else if(board[r][c] == 8192 && is8192 == false){
				alert("You Win! You got the 8192");
				is8192Exist = true;
			}

		}
	}
}


//check if there is still an empty tile
function hasLost(){

	for(let r = 0; r < rows; r++){

		for(let c = 0; c < columns; c++){

			if(board[r][c] == 0){
				return false;
			}

			const currentTile = board[r][c];
			// check if there are two adjacent tiles
			if (
				// will check current tile if it has possible merge to its upper tile OR
				r > 0 && board[r-1][c] === currentTile || 
				// check current tile if it has possible merge to its lower tile OR
				r < rows - 1 && board[r+1][c] === currentTile ||
				// check current tile if it has possible merge to its left OR
				c > 0 && board[r][c-1] === currentTile ||
				// check current tile if it has possible merge to its right
				c < columns - 1 && board[r][c+1] === currentTile) {
				
				return false;
			}
		}
	}
	return true;
}

function restartGame(){
	for(let r = 0; r < rows; r++){
		for(let c = 0; c < columns; c++){
			board[r][c] = 0;
		}
	}

	score = 0;

	setTwo();

}

// event listener when the screen is touched and assigns X and Y coords
document.addEventListener('touchstart', (e) => {
	startX = e.touches[0].clientX;
	startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	// disable scrolling feature
	e.preventDefault();
//passive property to make sure preventDefault() will work
}, {passive: false}); 

document.addEventListener('touchend', (e) => {
	if(!e.target.className.includes("tile")) {
		return
	}

	let diffX = startX - e.changedTouches[0].clientX;
	let diffY = startY - e.changedTouches[0].clientY;

	// check if the horizontal swipe is greater in magnitude
	// than the vertical swipe
	if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
            SlideLeft(); // Call a function for sliding left
            setTwo(); // Call a function named "setTwo"
        } else {
            SlideRight(); // Call a function for sliding right
            setTwo(); // Call a function named "setTwo"
        }
    } else {
	    // Vertical swipe
	    if (diffY > 0) {
	        SlideUp(); // Call a function for sliding up
	        setTwo(); // Call a function named "setTwo"
	    } else {
	        SlideDown(); // Call a function for sliding down
	        setTwo(); // Call a function named "setTwo"
	    }
	}

	document.getElementById("score").innerText = score;

	checkWin();

	// Call hasLost() to check for game over conditions
	if (hasLost()) {
	    // Use setTimeout to delay the alert
	    setTimeout(() => {
	    alert("Game Over! You have lost the game. Game will restart");
	    restartGame();
	    alert("Click any key to restart");
	    }, 100); 
	}

} );