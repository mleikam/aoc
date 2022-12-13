-module(solve).
-export([part1/1,part2/1]).

lines_to_integers(Lines) ->
  lists:map(fun(X) -> 
    {Int, _} = string:to_integer(string:strip(X, right, $\n)),
    Int
  end, Lines).

get_lines(Filename) ->
  lines_to_integers(read_lines:read_all(Filename)).

combine([First | Rest]) -> % first line & export
  combine(Rest,First,[]).

combine([],ElfTotal,AllTotals) -> % end of the input
  Combined = lists:append([AllTotals,[ElfTotal]]),
  Combined;
combine([ First | Rest],ElfTotal,AllTotals) when First == error -> % empty line
  combine(Rest,0,lists:append([AllTotals,[ElfTotal]]));
combine([First | Rest],ElfTotal,AllTotals) -> % incremental add
  combine(Rest,First + ElfTotal,AllTotals).

part1(Filename) -> 
  lists:max(combine(get_lines(Filename))).

part2(Filename) -> 
  Elves = combine(get_lines(Filename)),
  Sorted = lists:reverse(lists:sort(Elves)),
  lists:sum([lists:nth(1,Sorted),lists:nth(2,Sorted),lists:nth(3,Sorted)]).
