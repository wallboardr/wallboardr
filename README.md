# Wallboardr

A simple way to collect and format display content from all over into one place. Will rotate through a collection of pages, with custom intervals and transitions.

## Things to do

[ ] Refactoring
    [ ] Screen and board data manipulation into services (resources?)
    [ ] Separate screens and board UI manipulation into their own controllers
[ ] Screen support
    [x] Remove padding on screen container
    [ ] Multiple "widgets" per screen
    [x] Sort screens
    [x] Disable screens
    [ ] Teamcity screen
        [ ] Create form to enter credentials and URL
        [ ] Load in projects to choose from
        [ ] Allow selection of multiple build configurations
        [ ] Persist this as a screen
        [ ] Be able to take screen and get statuses at render time
        [ ] Improve rendering of a pipeline
    [ ] Local screen
        [x] Basic message support
        [ ] Preview message (POST data to a board URL)
        [ ] Upload images
        [x] Support tables
        [x] Support lists
[ ] Reload screens on running boards
    [x] Find lightweight web socket implementation (Primus + WebSockets (ws))
    [x] Add support for single command to "HUP" the list of screens
    [ ] Increase reliability of communication
    [ ] Only update screens that have been changed?
    [ ] Notification when board opened in non-Web Socket browser
[ ] User management
    [x] Ability for admin to add another admin
    [ ] Ability to create users with editor role
    [x] List of existing users
    [ ] Reset password
    [ ] Change own password
    [ ] Disable users
    [ ] Delete users?
[ ] Visual customization
    [ ] Per installation CSS overrides
    [ ] Per board visual configuration
    [ ] Highlighting? Text colours?
[ ] More unit tests



