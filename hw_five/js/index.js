const data = {
	"A": {"value":1,  "amount":9},
	"B": {"value":3,  "amount":2},
	"C": {"value":3,  "amount":2},
	"D": {"value":2,  "amount":4},
	"E": {"value":1,  "amount":12},
	"F": {"value":4,  "amount":2},
	"G": {"value":2,  "amount":3},
	"H": {"value":4,  "amount":2},
	"I": {"value":1,  "amount":9},
	"J": {"value":8,  "amount":1},
	"K": {"value":5,  "amount":1},
	"L": {"value":1,  "amount":4},
	"M": {"value":3,  "amount":2},
	"N": {"value":1,  "amount":6},
	"O": {"value":1,  "amount":8},
	"P": {"value":3,  "amount":2},
	"Q": {"value":10, "amount":1},
	"R": {"value":1,  "amount":6},
	"S": {"value":1,  "amount":4},
	"T": {"value":1,  "amount":6},
	"U": {"value":1,  "amount":4},
	"V": {"value":4,  "amount":2},
	"W": {"value":4,  "amount":2},
	"X": {"value":8,  "amount":1},
	"Y": {"value":4,  "amount":2},
	"Z": {"value":10, "amount":1},
	"_": {"value":0,  "amount":2}
};
let last;

const ROW_SIZE = 7;
let board = {
	// Maps slots --> tiles
	filledTiles: new Map()
}

/* Help with dragable elements
    src: https://www.elated.com/drag-and-drop-with-jquery-your-essential-guide/ */
$(document).ready(() => {
	initDragNDrop();
	for(let i = ROW_SIZE; i < 2*ROW_SIZE; i ++) {
		board.filledTiles.set(i, i - ROW_SIZE);
	}
	console.log(board.filledTiles);
});

function initDragNDrop() {
	// Add draggables & droppable locations to the screen
	for(let i = 0; i < ROW_SIZE; i ++) {
		$('#topShelf').append("<div class='droppable' id="+i+"> </div>");
		$('#botShelf').append("<div class='droppable' id="+(7+i)+"> <div class='draggable'> " + i + "</div> </div>");
	}


	// Set draggable properties
	$('.draggable').draggable({
		'containment': '.container',
		'revert': () => 'invalid',
		'start': function handleDrag(e, ui) {
			$(ui.helper).draggable('option', 'revert', true); // Re-enables is reverting on drag
		}
	});	
	$('.draggable').each((i, el) => $(el).data('id', i));

	// Set droppable properties
	$('.droppable').droppable({
		'accept': '.draggable',
		'drop': function handleDrop(e, ui) {
			const slotID =  parseInt($(this).attr('id'));
			const tileID =  parseInt($(ui.draggable).data('id'));

			// If the tile its trying to move to is empty, allow the move
			if(board.filledTiles.get(slotID) === null || board.filledTiles.get(slotID) === undefined) {
				// Clear its past slot
				for(const [slot, tile] of board.filledTiles.entries())
					if(board.filledTiles.get(slot) == tileID) 
						board.filledTiles.set(slot, null);
				
				// Set its new slot
				board.filledTiles.set(slotID, tileID)
				
				// Hold it in the tile's plce
				ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
				ui.draggable.draggable( 'option', 'revert', false ); 
			}
		}
	});	
}