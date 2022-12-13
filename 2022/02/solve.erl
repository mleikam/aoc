-module(solve).
-export([part1/1, part2/1]).

-record(rule,{ ties, loses_to, wins_against }).

get_points() -> 
  D0 = dict:new(),
  D1 = dict:store("X", 1 ,D0),
  D2 = dict:store("Y", 2 ,D1),
  D3 = dict:store("Z", 3 ,D2),
  D4 = dict:store("W", 6 ,D3), % win
  D5 = dict:store("L", 0 ,D4), % loss
  D6 = dict:store("T", 3 ,D5), % tie
  D6.

get_rules() -> 
  D0 = dict:new(),
  D1 = dict:store("A", #rule{ ties="X", loses_to="Y", wins_against="Z"} ,D0),
  D2 = dict:store("B", #rule{ ties="Y", loses_to="Z", wins_against="X"} ,D1),
  D3 = dict:store("C", #rule{ ties="Z", loses_to="X", wins_against="Y"} ,D2),
  D3.

get_input(Filename) ->
  lists:map( fun(X) -> string:split(X," ") end, read_lines:read_all(Filename)).

get_outcome(Mine,Rule) when Mine == Rule#rule.loses_to -> "W";
get_outcome(Mine,Rule) when Mine == Rule#rule.ties -> "T";
get_outcome(Mine,Rule) when Mine == Rule#rule.wins_against -> "L".

score(Theirs,Mine,Rules) ->
  Rule = dict:fetch(Theirs,Rules),
  Outcome = get_outcome(Mine,Rule),
  PointsHash = get_points(),
  Scores = lists:map( fun(A) -> 
    Result = dict:fetch(A,PointsHash),
    Result
  end, [Mine,Outcome]),
  lists:sum( Scores ).

part1(Filename) ->
  Rules = get_rules(),
  Scores = lists:map(fun([A,B]) -> score(A,B,Rules) end,get_input(Filename)),
  lists:sum(Scores).

win_lose_or_tie(Theirs,Outcome,Rules) ->
  Rule = dict:fetch(Theirs,Rules),
  Mine = if
    Outcome == "X" -> Rule#rule.wins_against; % I lose
    Outcome == "Y" -> Rule#rule.ties; % tie
    Outcome == "Z" -> Rule#rule.loses_to; % I win
    true -> "Z"
  end,
  score(Theirs,Mine,Rules).

part2(Filename) -> 
  S = erlang:monotonic_time(microsecond),
  Rules = get_rules(),
  Scores = lists:map(fun([A,B]) -> win_lose_or_tie(A,B,Rules) end,get_input(Filename)),
  Total = lists:sum(Scores),
  io:format("runtime: ~pms~n",[(erlang:monotonic_time(microsecond)-S)/1000]),
  Total.
