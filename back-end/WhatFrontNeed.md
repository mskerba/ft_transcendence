

listen on FronDirectMessage ==> data like {userId of Sender, msg}
listen on status ==> data like {userId of connected client, "status": {online , in game}}

emit event{inGame, when user enter to game}