var start = 80;
var goodDiff = start/20;


//easiest: 120 6
//easy   : 100 5
//normal : 80  4
//harder : 60  3
//hard   : 40  2
//unfair   : 20  1


var xSize = 4;
var ySize = 4;

var R;
var G;
var B;

var SR;
var SG;
var SB;


//Higher is easeier
var difficulty = start;


//spanish is cool, right?
function setDiff(numero){
	ref = {120:"Easiest",100:"Easy",80:"Normal",60:"Hard",40:"Harder",20:"Unfair"}
	start = numero;
	difficulty = numero;
	goodDiff = start/20

	$("#diffLevel").html(ref[numero])
	$("#setup").hide();
	$("table").show();
	resetGame();

}

$(function() {
	$("#box").append(makeGrid(xSize, ySize));
	newTask();
});

//new task without changing difficulty
function newTask(){
	setAll();
	setOne(difficulty);
	updateText(difficulty);
}

function resetGame(){
	var xSize = 4;
	var ySize = 4;

	//125 is the easiest
	var difficulty = start;

	setAll();
	setOne(difficulty);
	updateText(difficulty);
}

function updateText(diff){
	$("#level").html((start-diff)/goodDiff+1);

	if (diff <= 0){
		win();
		difficulty = start; // Idk why I need this but it works now
	}

};


//For when the answer is correct
function right(){
	

    $('body').addClass('right');
    setTimeout(function() {
          $('body').removeClass('right');
    }, 500);

};

//For when the answer is incorrect
function wrong(){


    $('body').addClass('wrong');
    setTimeout(function() {
          $('body').removeClass('wrong');
    }, 500);

};

function tag(element){
	if ($(element).css("background-color") == "rgb("+SR+", "+SG+", "+SB+")"){
		//The tile is the same colour as the base: failure
		if (difficulty < start-goodDiff){
			//if it's level 3 or above: go back two levels
			difficulty = difficulty + goodDiff*2
		}else if (difficulty < start){
			//if it's level 2, goto level one
			difficulty = difficulty + goodDiff
		}
		wrong();
	}else{
		difficulty = difficulty - goodDiff
		right();
	};

	newTask();
};

function refresh(){
	$("#setup").show();
	$("table").hide();
};

function win(){
	alert("You won!");
	refresh();
};

//make one tile a slightly different colour
//max change is 125
function setOne(change){

	//Choose a random tile by number  THE CULPRIT TO THE ELUSIVE NO TILE CHANGED BUG
	var targetTile = Math.round(Math.random()*((xSize*ySize)-1));

	if (change > start){
		change = start;
	}else if(change < 1){
		change = 1;
	};

	$('.tile').each(function(i) {

		//if the tile is the chosen one
		if (targetTile == i){

			//r, g or b?
			var RGOB = Math.random();

			if (RGOB < 0.33){
				//change R
				R = plusOrMinus(R,change);

			}else if (RGOB < 0.66){
				//change G
				G = plusOrMinus(G,change);

			}else{
				//change B
				B = plusOrMinus(B,change);

			};

			$(this).css("background-color", "RGB("+R+","+G+","+B+")");
		};



	});

};

//will change the vars randomly but keeping it in 0 - 255
function plusOrMinus(var1,var2){
	var result;

	if (Math.random() > .5){
		//Subtract the second from the firstChild
		result = var1-var2;

		if (result < 0){
			result = var1+var2;
		};
	}else{
		//Add the two vars
		result = var1+var2;

		if (result > 255){
			result = var1-var2;
		};
	};

	return result;
};


//Make all tiles one colour
function setAll(){
	R = Math.round(Math.random()*255);
	G = Math.round(Math.random()*255);
	B = Math.round(Math.random()*255);

	SR = R;
	SG = G;
	SB = B;

	$('.tile').each(function(i) {
		$(this).css("background-color", "RGB("+R+","+G+","+B+")");
	});
};

Number.prototype.times = function(fn) {
	for(var r = [], i = 0; i < this; i++)
	r.push(fn(i));
	return r;
}

function makeGrid(numRows, numCols) {

var row = function(r) {
return $("<tr/>").append(numCols.times(function(c) {
return $("<td/>").html("<div class=\"tile\" onclick=\"tag(this);\"></div>");
}));
};

return $("<table/>")
.append(numRows.times(row));
}

function cheat(){
	$('.tile').each(function(i) {

		if ("rgb("+SR+", "+SG+", "+SB+")" != $(this).css("background-color") ){
			$(this).click();
		};


	});
};
