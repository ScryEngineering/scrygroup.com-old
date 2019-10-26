var 1..6: die1;
var 1..6: die2;
2..12: total;
constraint total = die1 + die2;

solve satisfy;
output ["\(die1) and \(die2) give \(total)\n"];
