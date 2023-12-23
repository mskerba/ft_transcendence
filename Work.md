


*** don't forget to handle this ***

    1. is implemented
    -- CountUnseen not working in directMessage,
    -- CountUnseen in groups not is feild in rooms.
    2. not implemented
    -- use const user: UserEntity = req.user (from Body() red) the id inside user.userId 
        - for all places that need the id of user instead of receive it from http method.

    3. creation of group problems
        -- create protected group with empty password is accepted in front
        -- title is accepted with empty string in front
        -- maybe this above input handled in front.   
 
  *** postmen data ***
 -- i wanna handle when send to me data not in the database {messages, listContact, listGroups}


   *** some requirement not handled  ***
-- users can leave  groups if owner leave group he required to select user if  

*** some question that came to my mind***
-- adding user to the group that already joind am i suppose to handle this by check on each insertion on the table is this user    is already exist or just make the database fail and return that is already exists
-- why i can't  use findUnique we know the group of  attribute is unique then using findFirst