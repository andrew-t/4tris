var scores = new Array();
var board = new Array();
var turn;
var allowplay;
$(this).load(function() {
	scores[0]=0; scores[1]=0;
	boardml = '';
	for (i = 5; i >= 0; --i) {
		boardml += '<tr>';
		board[i] = new Array();
		for (j = 0; j < 7; ++j) {
			boardml += '<td class="cell" id="c'+i+"x"+j+'"><div></div></td>';
			board[i][j] = -1;
		}
		boardml += '</tr>';
	} $('table#board').html(boardml);
	turn = 0;
	setallowplay(true);
	$('td.cell').mouseover(function() {
		$('td.cellhover0').removeClass('cellhover0');
		$('td.cellhover1').removeClass('cellhover1');
		if (allowplay)
			hlcol($(this).attr('id').substr(3));
		else lastcol = $(this).attr('id').substr(3);
	});
	$('td.cell').mouseout(function() {
		$('td.cellhover0').removeClass('cellhover0');
		$('td.cellhover1').removeClass('cellhover1');
	});
	$('td.cell').click(function() {
		if (!allowplay) return;
		for (i = 0; i < 6; i++) 
			for (j = 0; j < 7; ++j)
				if (board[i][j] == -1)
					removetoken(i, j, false);
		col = $(this).attr('id').substr(3);
		for (i = 0; i < 6; ++i)
			if (board[i][col] == -1) {
				droptoken(turn, col, i, 7);
				turn = 1-turn;
				setallowplay(false);
				setTimeout(checklines, 500);
				return;
			}
		// if column was full, do nothing
	});
});

function droptoken(colour, column, row, from) {
	board[row][column] = colour;
	$('td#c'+row+'x'+column+'>div').append('<div class="counter c'+colour+'"></div>');
	$('td#c'+row+'x'+column+'>div>div.counter:last-child')
		.css({top: (100*(row-from))+'px'})
		.animate({left: '0px'}, (from<7)?250:0)
		.animate({top: '0px'}, 500);
}
function removetoken(i, j, fancy) {
	if (fancy)
		$('td#c'+i+'x'+j+'>div>div.counter')
			.fadeOut(250);
	else
		$('td#c'+i+'x'+j+'>div>div.counter')
			.remove();
	board[i][j] = -1;
}

function checklines() {
	clear = new Array();
	for (i = 5; i >= 0; --i) {
		clear[i] = new Array();
		for (j = 0; j < 7; ++j)
			clear[i][j] = false;
	}
	clearany = false;
	for (i = 0; i < 6; i++) // hlines
		for (j = 0; j < 4; j++)
			if (board[i][j] > -1)
				if ((board[i][j+1] == board[i][j]) &&
					(board[i][j+2] == board[i][j]) &&
					(board[i][j+3] == board[i][j])) {
					clear[i][j+3] = clear[i][j+2] = 
						clear[i][j+1] = clear[i][j] = 
						clearany = true;
					++scores[board[i][j]];
				}
	for (i = 0; i < 3; i++) {
		// vlines
		for (j = 0; j < 7; j++)
			if (board[i][j] > -1)
				if ((board[i+1][j] == board[i][j]) &&
					(board[i+2][j] == board[i][j]) &&
					(board[i+3][j] == board[i][j])) {
					clear[i+3][j] = clear[i+2][j] = 
						clear[i+1][j] = clear[i][j] = 
						clearany = true;
					++scores[board[i][j]];
				}
		// diagonals
		for (j = 0; j < 4; j++) {
			if (board[i][j] > -1)
				if ((board[i+1][j+1] == board[i][j]) &&
					(board[i+2][j+2] == board[i][j]) &&
					(board[i+3][j+3] == board[i][j])) {
					clear[i+3][j+3] = clear[i+2][j+2] = 
						clear[i+1][j+1] = clear[i][j] =
						clearany = true;
					++scores[board[i][j]];
				}
			if (board[i+3][j] > -1)
				if ((board[i+2][j+1] == board[i+3][j]) &&
					(board[i+1][j+2] == board[i+3][j]) &&
					(board[i  ][j+3] == board[i+3][j])) {
					clear[i][j+3] = clear[i+1][j+2] = 
						clear[i+2][j+1] = clear[i+3][j] =
						clearany = true;
					++scores[board[i+3][j]];
				}
		}
	}
	if (!clearany) 
		setallowplay(true);
	else {
		for (i = 0; i < 6; i++) 
			for (j = 0; j < 7; ++j)
				if (clear[i][j]) {
					if (board[i][j] != -1)
						removetoken(i, j, true);
					for (k = i + 1; k < 6; k++) 
						if ((board[k][j] != -1) && (!clear[k][j])) {
							droptoken(board[k][j], j, i, k);
							removetoken(k, j, false);
							clear[k][j] = true;
							break;
						}
				}
		$('div#s0').html(scores[0]);
		$('div#s1').html(scores[1]);
		setTimeout(checklines, 750);
	}
}

function setallowplay(a) {
	if (allowplay = a)
		hlcol(lastcol);
	else {
		$('td.cellhover0').removeClass('cellhover0');
		$('td.cellhover1').removeClass('cellhover1');
		$('table#board').css('cursor', 'default');
	}
}
var lastcol = -1;
function hlcol(col) {
	if ((lastcol = col) == -1) return;
	for (i = 0; i < 6; ++i)
		if (board[i][col] == -1) {
			$('td#c'+i+'x'+col).addClass('cellhover'+turn);
			$('table#board').css('cursor', 'hand');
			return;
		}
	$('table#board').css('cursor', 'default');
}