int: die1;
constraint die1 >= 1 /\ die2 <= 6;
int: die2;
constraint die2 >= 1 /\ die2 <= 6;
var int: total = die1 + die2;

solve satisfy;
output ["You rolled a \(total)\n"];
