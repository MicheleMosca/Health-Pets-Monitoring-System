start_message = "Hi! I'm the HPMS Telegram Bot.\n" \
                "You can use the /help command to know all the implemented function."

help_message = "The currently implemented functions are:\n" \
               "\t-\t/login [user] [pass]: enter your username and your password to use the commands below;\n" \
               "\t-\t/logout: logout to change your account;\n" \
               "\t-\t/FoodStation: get the status of your Food Stations;\n" \
               "\t-\t/PetStatus: get the status of your Pets."

loginParametersError_message = "Login failed! Write your username and password correctly."

loginSuccess_message = "Login successfully!"

loginFailed_message = "Unregistered user or wrong username or password inserted."

alreadyLogged_message = "You're already logged as user: %s.\n" \
                        "Please logout using /logout."

logoutSuccess_message = "Logout successfully!"

logoutFailed_message = notLogged_message = "You are not logged in."

unknownCommand_message = "Unknown command inserted.\n" \
                         "Please check the command list by /help."