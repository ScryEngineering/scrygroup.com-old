1..6: die1;
1..6: die2;
var 2..12: total;
constraint total = die1 + die2;

solve satisfy;
output ["You rolled a \(total)\n"];
