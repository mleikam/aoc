-module(read_lines).
-export([read_n_lines/2, read_all/1]).

read_n_lines(Filename,NumLines) ->
  {ok, FileDev} = file:open(Filename, [raw, read, read_ahead]),
  Lines = do_read([],FileDev, NumLines),
  file:close(FileDev),
  Lines.

do_read(Lines, _, 0) ->
  lists:reverse(Lines);
do_read(Lines, FileDev, L) ->
  case file:read_line(FileDev) of
    {ok, Line} ->
      do_read([Line|Lines], FileDev, L - 1);
    eof ->
      do_read(Lines, FileDev, 0)
  end.

read_all(Filename) -> 
  {ok, FileDev} = file:open(Filename, [raw, read, read_ahead]),
  Lines = do_read_all([],FileDev),
  file:close(FileDev),
  Lines.  

do_read_all(Lines, FileDev) ->
  case file:read_line(FileDev) of
    {ok, Line} ->
      do_read_all([Line|Lines], FileDev);
    eof ->
      lists:reverse(Lines)
  end.
