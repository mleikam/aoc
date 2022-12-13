-module(solve).
-export([part1/1,part2/1]).

get_input(Filename) ->
  read_lines:read_all(Filename).

compartmentalize(Bag) -> 
  Half = round(length(Bag)/2),
  [string:slice(Bag,0,Half), string:slice(Bag,Half)].

part1(Filename) ->
  Rows = get_input(Filename),
  Bags = lists:map(fun(R) -> compartmentalize(R) end, Rows),
  Commons = lists:map(fun([A,B]) -> intersection(A,B) end, Bags),
  get_score(Commons).

to_list(S) ->
  [[X] || X <- S].

intersection(A,B)->
  I = [X || X <- B, Y <- A, X =:= Y],
  lists:uniq(I).

intersection(AA,BB,CC) ->
  A = to_list(AA),
  B = to_list(BB),
  C = to_list(CC),
  AB = intersection(A,B),
  AC = intersection(A,C),
  Z = intersection(AB,AC),
  lists:uniq(Z).

find_badges([],X) -> X;
find_badges([A,B,C],X) -> 
  Badges = intersection(A,B,C),  
  X ++ Badges;
find_badges([A,B,C | Rest],X) -> 
  Badges = intersection(A,B,C),
  find_badge(Rest,Badges++X).
find_badges([A,B,C | Rest]) -> 
  Badges = intersection(A,B,C),
  find_badge(Rest,Badges).

score20(N,F) when N > (90*F) -> N-(96*F);
score20(N,F) -> N-(38*F).

get_score(L) ->
  F = 20, % an arbitrary number so Erlang treats letters as numbers
  L20 = lists:flatten(lists:map(fun(B) -> [score20(X*F,F) || X <- B] end, L)),
  round(lists:sum(L20)/F).

part2(Filename) ->
  Rows = get_input(Filename),
  Badges = find_badges(Rows),
  get_score(Badges).
