/*jslint node: true*/
'use strict';
var Gun = require('gun/gun');
var sort = require('./sort');


// for distance traveled
var options = {
	speed: 0.1
};

/*
	figure out where the player
	a player is from where they
	last turned, and how fast they
	are travelling.
*/
function distance(coord) {
	var delta, elapsed = Gun.time.now() - coord.time;
	delta = (elapsed * options.speed) * coord.direction;

	return delta + coord[coord.axis];
}

// find the current coordinate of the player
function find(player) {
	var coord, position;
	coord = sort(player).reverse()[0];

	// if the player has no history
	if (!coord) {
		return null;
	}

	// don't mutate the last position, make a copy
	position = Gun.obj.copy(coord);

	position[coord.axis] = distance(coord);
	position.time = Gun.time.now();

	return position;
}

module.exports = find;
