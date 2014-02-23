var resourceful = require('resourceful');

var Creature = resourceful.define('creature', function () {
  //
  // Specify a storage engine
  //
  this.use('memory');

  //
  // Specify some properties with validation
  //
  this.string('diet');
  this.bool('vertebrate');
  this.array('belly');

  //
  // Specify timestamp properties
  //
  this.timestamps();
});

//
// Now that the `Creature` prototype is defined
// we can add custom logic to be available on all instances
//
Creature.prototype.feed = function (food) {
  this.belly.push(food);
};


var creat = new Creature();
creat.feed("food");

