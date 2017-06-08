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

var startTime; //Time you start the game
var endTime;  //Time you win

var startingDifficulty;
var tagCount; //How many times the user has clicked a tile

//Higher is easeier
var difficulty = start;


//spanish is cool, right?
function setDiff(numero){
	ref = {120:"Easiest",100:"Easy",80:"Normal",60:"Hard",40:"Harder",20:"Unfair"}
	startingDifficulty = ref[numero];
	start = numero;
	difficulty = numero;
	goodDiff = start/20

	$("#diffLevel").html(startingDifficulty)
	$("#setup").hide();
	$("table").show();
	resetGame();

	//Start the timer
	startTime = (new Date).getTime();

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
	xSize = 4;
	ySize = 4;

	tagCount = 0;

	//125 is the easiest
	var difficulty = start;

	setAll();
	setOne(difficulty);
	updateText(difficulty);
}

function updateText(diff){

	if ((start-diff)/goodDiff+1 > 20){
		$("#level").html("Winner winner, chicken dinner!");
	} else {
		$("#level").html((start-diff)/goodDiff+1);
	}

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

	tagCount += 1;

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
	$("table").hide();
	$('#setup').show();
	$("#winDiv").css('visibility', 'hidden');
	$("#level").text("1");
	$("#diffLevel").text("Normal");
};

function win(){
	var endTime = (new Date).getTime();

	var date = new Date(endTime-startTime);
	var h = date.getHours();
	var m = date.getMinutes();
	var s = ("0" + date.getSeconds()).slice(-2);
	var ms = date.getMilliseconds();
	var timeMessage = ((h * 60) + m) + ":" + s + "." + ms
	$("#winMessage").html("You have beaten painterly on " + startingDifficulty + " difficulty!<br/>It took you " + timeMessage + " and " + tagCount + " clicks!");

	$("#winDiv").css('visibility', 'visible');
	$("table").hide();

};

//make one tile a slightly different colour
//max change is 125
function setOne(change){

	//Choose a random tile by number  0-15 THE CULPRIT TO THE ELUSIVE NO TILE CHANGED BUG
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
