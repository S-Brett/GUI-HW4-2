
 
// Brett Svendsen, UMass Lowell Computer Science
// brett_svendsen@student.uml.edu


"use strict";

let TABLE_ID = 1;


function deleteTable(_jqLI, _jqDIV, _jqREFRESH){


	$(_jqLI).remove();
	$(_jqDIV).remove();

	$(_jqREFRESH).tabs('refresh');

}

function deleteTableByID(_ID){

	// `'#li-${newTableId}', 'div#${newTableId}', 'div#table-tabs'`
	$(`#li-table-${_ID}`).remove();
	$(`div#table-${_ID}`).remove();

	$('div#table-tabs').tabs('refresh');

}

$( "#tableCreationForm" ).mouseup(function() {
	let startX = parseInt($('#x-slider').slider('values', 0));
	let endX = parseInt($('#x-slider').slider('values', 1));
	let startY = parseInt($('#y-slider').slider('values', 0));
	let endY = parseInt($('#y-slider').slider('values', 1));

	$('div#working-table').html(genTable(startX, endX, startY, endY));
});

$( document ).ready(function(){
	// -- Validation plugin Start --
	$.validator.setDefaults({

		submitHandler: function(){ 
			let startX = parseInt($('#x-slider').slider('values', 0));
			let endX = parseInt($('#x-slider').slider('values', 1));
			let startY = parseInt($('#y-slider').slider('values', 0));
			let endY = parseInt($('#y-slider').slider('values', 1));

			console.log(startX + ' ' + endX);

			let newTable = genTable(startX, endX, startY, endY);

 			console.log(newTable);

 			let newTableId = 'table-' + TABLE_ID;
			// let deleteFuncArg = `'#li-${newTableId}', 'div#${newTableId}', 'div#table-tabs'`;
			let deleteFuncArg = TABLE_ID;
			let deleteButton = `<button class="table-delete-btn" type="button" onclick="deleteTableByID(${deleteFuncArg})">x</button>`;
			TABLE_ID += 1;

			$('div#table-tabs ul').append(`<li id="li-${newTableId}"><a href="#${newTableId}">${newTableId} ${deleteButton}</li>`);
			$('div#table-tabs div').last().after(`<div id="${newTableId}">${newTable.outerHTML}</div>`);

			$('div#table-tabs').tabs('refresh');

		}
	});

	// $('div#table-tabs').tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	// $( "div#table-tabs li" ).removeClass( "ui-corner-top" ).addClass( "ui-corner-left" );
	$('div#table-tabs').tabs()

	$( "#tableCreationForm" ).validate({
		rules: {
			tsX: {digits: true, max: parseInt( $('#teX').val() )-1},
			teX: {digits: true, min: parseInt( $('#tsX').val() )+1},
			tsY: {digits: true, max: parseInt( $('#teY').val() )-1},
			teY: {digits: true, min: parseInt( $('#tsY').val() )+1}
		}
	});

	// X slider
	$('#x-slider').slider({
		range: true,
		min: -100,
		max: 100,
		values: [-25,25],
		slide: function(event, ui){
			$('#x-slider-text').html(ui.values[0] + " to " + ui.values[1]);

			let startX = parseInt($('#x-slider').slider('values', 0));
			let endX = parseInt($('#x-slider').slider('values', 1));
			let startY = parseInt($('#y-slider').slider('values', 0));
			let endY = parseInt($('#y-slider').slider('values', 1));

			$('div#working-table').html(genTable(startX, endX, startY, endY));
		}
	});

	$('#x-slider-text').html(
		$('#x-slider').slider('values', 0) + 
		" to " + 
		$('#x-slider').slider('values', 1));

	// Y slider
	$('#y-slider').slider({
		range: true,
		min: -100,
		max: 100,
		values: [-25,25],
		slide: function(event, ui){
			$('#y-slider-text').html(ui.values[0] + " to " + ui.values[1]);

			let startX = parseInt($('#x-slider').slider('values', 0));
			let endX = parseInt($('#x-slider').slider('values', 1));
			let startY = parseInt($('#y-slider').slider('values', 0));
			let endY = parseInt($('#y-slider').slider('values', 1));

			$('div#working-table').html(genTable(startX, endX, startY, endY));
		}
	});

	$('#y-slider-text').html(
		$('#y-slider').slider('values', 0) + 
		" to " + 
		$('#y-slider').slider('values', 1));


	let startX = parseInt($('#x-slider').slider('values', 0));
	let endX = parseInt($('#x-slider').slider('values', 1));
	let startY = parseInt($('#y-slider').slider('values', 0));
	let endY = parseInt($('#y-slider').slider('values', 1));

	$('div#working-table').html(genTable(startX, endX, startY, endY));

})



function isNum(_string){ return /^-?\d+$/.test(_string); }
function mathRange(_num1, _num2){ return Math.abs(_num1 - _num2); }

function TableObject(_startX, _endX, _startY, _endY, 
			_offsetX=0, _offsetY=0, _stepX=1, _stepY=1){

	this.startX = _startX;
	this.endX = _endX;
	this.startY = _startY;
	this.endY = _endY;

	// These members do nothing yet
	this.offsetX = _offsetX;
	this.offsetY = _offsetY;
	this.stepX = _stepX;
	this.stepY = _stepY;
}

function makeHTMLTable(_tObj){

	if(_tObj.constructor.name != 'TableObject'){
		console.log("ERROR: Attempted to pass an object of type: " 
			+ _tObj.constructor.name);
		return -1337;
	}

	console.log("SUCCESS: Got table");
	console.log("TABLE X: " + _tObj.startX + " to " + _tObj.endX);
	console.log("TABLE Y: " + _tObj.startY + " to " + _tObj.endY);

	let table = document.createElement('table');

	// make first row
	let row1 = document.createElement('tr');
	let deadCell = document.createElement('td');
	deadCell.classList.add('deadcell');

	row1.appendChild(deadCell);

	for(let i = _tObj.startX; i <= _tObj.endX; i++){
		let headerCell = document.createElement('th');
		headerCell.appendChild(document.createTextNode(i))
		headerCell.classList.add("cell-header");

		row1.appendChild(headerCell);
	}

	table.appendChild(row1);

	// We traverse the 2d list by going left to right
	// and then down
	for(let y = _tObj.startY; y <= _tObj.endY; y++){
		let row = document.createElement('tr');
		let rowY = document.createElement('th');
		rowY.appendChild(document.createTextNode(y));
		rowY.classList.add("cell-header");

		row.appendChild(rowY);

		for(let x = _tObj.startX; x <= _tObj.endX; x++){
			let cellX = document.createElement('td');
			cellX.appendChild(document.createTextNode(x*y));

			row.appendChild(cellX);
		}

		table.appendChild(row);
	}

	return table;

}

function genErrorMsg(_message){
	let errorMsg = document.createElement('span');
	errorMsg.appendChild(document.createTextNode(_message))
	errorMsg.classList.add("error-msg")

	return errorMsg;
}

function genTable(sX, eX, sY, eY){

	let myTable = new TableObject(sX, eX, sY, eY);

	// Remove old table to keep the page clean
	// let oldTable = document.getElementById('mult-table');
	// if (oldTable) oldTable.remove();

	let newTable = makeHTMLTable(myTable);
	newTable.id = 'mult-table';
	console.log(newTable);
	newTable.cellspacing = '0';
	newTable.cellpadding = '0';

	// IF range is beyond 11, set container to overflow:scaling

	return newTable;

	// document.getElementById('table-div').appendChild(newTable)
}



