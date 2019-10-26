#!/usr/bin/env python3

die1 = int(input('Die 1? '))
assert die1 >= 1 and die1 <= 6
die2 = int(input('Die 2? '))
assert die2 >= 1 and die2 <= 6
total = die1 + die2
print(f'You rolled a {total}')
