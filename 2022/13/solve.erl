-module(solve).
-export([part1/1,compare/2,sort/1,part2/1]).

% input parsing functions
get_input(Filename) ->
  read_lines:read_all(Filename).
comma_parser(Params) ->
  {ok, Tokens, _} = erl_scan:string(Params ++ "."),
  {ok, Terms} = erl_parse:parse_term(Tokens),
  Terms.

append_pairs(Pairs,Item) ->
  Pairs ++ [Item].

% get pairs of lines; returns a list of [Left,Right] pairs
get_line_pairs([],Pairs) -> Pairs;
get_line_pairs([A,B],Pairs) -> append_pairs(Pairs,[A,B]);
get_line_pairs([A,B,_Blank],Pairs) -> append_pairs(Pairs,[A,B]);
get_line_pairs([A,B,_Blank | Rest ],Pairs) -> 
  get_line_pairs(Rest, append_pairs(Pairs,[A,B])).

get_line_pairs([A,B,_Blank|Rest]) ->
  get_line_pairs(Rest, [[A,B]]).

% both lists ran out at the same time
compare_lists([],[]) -> 0; 
% Right is empty and left is not
compare_lists(A,[]) when length(A) > 0 -> -1; 
% Left is empty and right is not
compare_lists([],B) when length(B) > 0 ->  1; 
% we have two lists, each with one element
compare_lists([A],[B]) -> compare(A,B);
% we have two lists, each with more than one element 
compare_lists([A|Left],[B|Right]) -> 
  X = compare(A,B),
  case X of
    0 -> compare(Left,Right);
    1 -> 1;
    -1 -> -1
  end.

% we have two lists, compare them as such
compare(A,B) when is_list(A) and is_list(B) ->      compare_lists(A,B);
% Left is a list, but Right is not
compare(A,B) when is_list(A) and not is_list(B) ->  compare(A,[B]);
% Right is a list, but Left is not
compare(A,B) when is_list(B) and not is_list(A) ->  compare([A],B);
% Left is less than Right
compare(A,B) when A < B -> 1;
% Left is more than Right
compare(A,B) when A > B -> -1;
% Left equals Right
compare(A,B) when A == B -> 0.

% find the indexes where the value is not false
sum_true_indexes(L) ->
  Truthy = [ I || {I,B} <- lists:enumerate(1,L) , B /= -1 ],
  lists:sum(Truthy).

part1(Filename) ->
  Lines = get_input(Filename),
  Pairs = get_line_pairs(Lines),
  Parsed = [ [comma_parser(X), comma_parser(Y)] || [X,Y] <- Pairs],
  sum_true_indexes([ compare(X,Y) || [X,Y] <- Parsed]).

% quicksort adapted from 
% https://www.erlang.org/doc/programming_examples/list_comprehensions.html
sort([Pivot|T]) ->
  sort([ X || X <- T, compare(X,Pivot) /= -1 ]) ++
  [Pivot] ++
  sort([ X || X <- T, compare(X,Pivot) == -1]);
sort([]) -> [].

% look for the markers, extract their indices and return the product
get_decoder_key(L) -> 
  E = lists:enumerate(1,L),
  [A|_] = [ I || {I,X} <- E , X == [2] ],
  [B|_] = [ I || {I,X} <- E , X == [6] ],
  A*B.  

part2(Filename) ->
  Lines = get_input(Filename),
  Parsed = [ comma_parser(L) || L <- Lines, L /= []] ++ [[6]] ++ [[2]],
  Sorted = sort(Parsed),
  get_decoder_key(Sorted).
