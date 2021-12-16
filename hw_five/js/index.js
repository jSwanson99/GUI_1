/*
    File: index.css 
    GUI Assignment:  HW5 Scrabble Board
    Jonathan Swanson, UMass Lowell Computer Science, jonathan_swanson@student.uml.edu 
    Copyright (c) 2021 by Jonathan.  All rights reserved.  May be freely copied or 
    excerpted for educational purposes with credit to the author. 
    updated by JS on December 16, 2021 at 12:00 PM 

	This assignments purpose is to implement one line of a scrabble board
	using jquery. Users are able to move tiles to and from their hand and the board, 
	with restrictions being placed where the tile can land. The user  is able
	to submit their word, to recivve a new set of letters, and they are able to reset
	the game. They are also able to view the current game's progress on a scoreboard.
*/

let letters = {
	"A": {"value":1,  "amount":9,  "remaining":9},
	"B": {"value":3,  "amount":2,  "remaining":2},
	"C": {"value":3,  "amount":2,  "remaining":2},
	"D": {"value":2,  "amount":4,  "remaining":4},
	"E": {"value":1,  "amount":12,  "remaining":12},
	"F": {"value":4,  "amount":2,  "remaining":2},
	"G": {"value":2,  "amount":3,  "remaining":3},
	"H": {"value":4,  "amount":2,  "remaining":2},
	"I": {"value":1,  "amount":9,  "remaining":9},
	"J": {"value":8,  "amount":1, "remaining":1},
	"K": {"value":5,  "amount":1, "remaining":1},
	"L": {"value":1,  "amount":4,  "remaining":4},
	"M": {"value":3,  "amount":2,  "remaining":2},
	"N": {"value":1,  "amount":6,  "remaining":6},
	"O": {"value":1,  "amount":8,  "remaining":8},
	"P": {"value":3,  "amount":2,  "remaining":2},
	"Q": {"value":10, "amount":1, "remaining":1},
	"R": {"value":1,  "amount":6,  "remaining":6},
	"S": {"value":1,  "amount":4,  "remaining":4},
	"T": {"value":1,  "amount":6,  "remaining":6},
	"U": {"value":1,  "amount":4,  "remaining":4},
	"V": {"value":4,  "amount":2,  "remaining":2},
	"W": {"value":4,  "amount":2,  "remaining":2},
	"X": {"value":8,  "amount":1, "remaining":1},
	"Y": {"value":4,  "amount":2,  "remaining":2},
	"Z": {"value":10, "amount":1, "remaining":1},
	"_": {"value":0,  "amount":2,  "remaining":2}
};

// Number of tiles in a row
const ROW_SIZE = 7;
// Location of bonus tiles
const BONUS_TILES = [1, 4];

// Total game score
let score = 0;

// Board
let filledTiles = new Map();

/* Help with dragable elements
    src: https://www.elated.com/drag-and-drop-with-jquery-your-essential-guide/ */
$(document).ready(() => {
	initDragNDrop();
	resetMap();
});

// Creates draggable tiles and locations to dorp them
function initDragNDrop() {
	// Add draggables & droppable locations to the screen
	for(let i = 0; i < ROW_SIZE; i ++) {
		const letter = getRandomLetter();
		$('#topShelf').append("<div class='droppable' id="+i+"> </div>");
		$('#botShelf').append("<div class='droppable' id="+(7+i)+"> <div class='draggable' id=" + i + "> <p class='letter'>" + letter[0]+ "</p> <p class='value'>" + letter[1].value + "</p> </div> </div>");
	}

	// Bonus Tiles
	for(let i of BONUS_TILES) {
		$(`#topShelf div#${i}`).addClass('bonus');
		$(`#topShelf div#${i}`).text('2x');
	}


	// Set draggable properties
	$('.draggable').draggable({
		'containment': '.container',
		'revert': () => 'invalid',
		'start': function handleDrag(e, ui) {
			$(ui.helper).draggable('option', 'revert', true); // Re-enables is reverting on drag
		}
	});	

	// Set droppable properties
	$('.droppable').droppable({
		'accept': '.draggable',
		'drop': function handleDrop(e, ui) {
			const slotID =  parseInt($(this).attr('id'));
			const tileID =  parseInt($(ui.draggable).attr('id'));

			// If the tile its trying to move to is empty, allow the move
			if( tileEmpty(slotID) ) {
				if(tileID > 6 || (boardEmpty() || !tileEmpty(slotID - 1) || !tileEmpty(slotID + 1)))  {
					// Clear its past slot
					for(const [slot, tile] of filledTiles.entries())
					if(filledTiles.get(slot) == tileID) 
						filledTiles.set(slot, undefined);

					// Set its new slot
					filledTiles.set(slotID, tileID)

					// Hold it in the tile's plce
					ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
					ui.draggable.draggable( 'option', 'revert', false ); 

					console.log(filledTiles); // For debugging / grading
				}
			}
		}
	});	
}

// Submits scrabble board
function submitWork() {
	let points = [];
	let mult = 1;
	let wordVal = 0;
	let word = "";

	// Builds the word the user entered and gets its score
	for(let i = 0; i < ROW_SIZE; i ++) {
		const tileID = filledTiles.get(i);
		if(tileID >= 0) {
			// JQuery Query Strings
			const isBonus = BONUS_TILES.indexOf(i) !== -1;
			const tile = `#${tileID}.draggable`;
			const letterContainer = `${tile} p.letter`;
			const valueContainer = `${tile} p.value`;

			// Build the word
			const letter = $(letterContainer).text().replace(/\s+/g, '');
			word += letter;

			// Tally the score
			const value = parseInt($(valueContainer).text().replace(/\s+/g, ''));
			mult *= isBonus ? 2 : 1;
			wordVal += value;
			points.push(value);

			// Reset the scrabble board
			resetTile(tile);
			filledTiles.set(i, undefined); 
			letters[letter].remaining --;
			console.log(letters); // To make it easier to debug/grade

			// Add new letters to board
			replaceTile(tile)
		}
	}

	// Update scoreboard
	if( word ) {
		$("#scoreboard").css({'display': 'revert'});
		$("tbody").prepend(
			`<tr> 
				<th scope="row"> ${word} </th>
				<td> ${points} </td>
				<td> ${wordVal} </td>
				<td> ${mult}x </td>
				<td> ${score += mult * wordVal} </td>
			</tr>`
		);
	}
}

// Replaces all of the draggable objects
function getNewTiles() {
	resetMap();
	$(".draggable").each((i, el) => {
		replaceTile(el);
		resetTile(el);
	});
}

// Replaces a single tile
function replaceTile(tile) {
	const letter = getRandomLetter();
	$(tile).children().eq(0).text(letter[0]);
	$(tile).children().eq(1).text(letter[1].value);
}

// Resets a single tile to its original location
function resetTile(tile) {
	$(tile).css({"top":"", "left":""});; // src: https://stackoverflow.com/questions/15193640/jquery-ui-draggable-reset-to-original-position
}

// Clears the internal representation of the scrabble board
function resetMap() {
	// Fills bottom half of map with tiles 0-6
	for(let i = 0; i < 2*ROW_SIZE; i ++) {
		if(i < ROW_SIZE) {
			// Clear out top row / scrabble board
			filledTiles.set(i, undefined)
		} else {
			// Set bottom row / hand to have tiles 0 thru 6
			filledTiles.set(i, i - ROW_SIZE);
		}
	}
	console.log(filledTiles); // For debugging / grading
}

// Resets tiles to have their full amount remaining
function resetTileCount() {
	for(let key of Object.keys(letters)) {
		letters[key].remaining = letters[key].amount;
	}
}

// Selects a random letter, ensuring it still have available uses
function getRandomLetter() {
	const key = Object.keys(letters)[Math.floor(Math.random() * Object.keys(letters).length)];
	if(letters[key].remaining > 0) {
		return [key, letters[key]]
	}
	return getRandomLetter();
}

// Determines if the board is empty
function boardEmpty() {
	for(let i = 0; i < ROW_SIZE; i ++) {
		if(!tileEmpty(i))
			return false;
	}
	return true;
}

// Determines if a tile is empty
function tileEmpty(tile) {
	return filledTiles.get(tile) === undefined;
}

function clearScoreboard() {
	$('.table tbody').html();
}

// Completely resets the game
function resetGame() {
	resetMap();
	getNewTiles();
	resetTileCount();
	$('tbody').html(' ')
	score = 0;
}