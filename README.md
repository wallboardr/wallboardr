# Wallboardr

A simple way to collect and format display content from all over into one place. Will rotate through a collection of pages, with custom intervals and transitions.

## Things to do

[ ] Refactoring
    [ ] Screen and board data manipulation into services (resources?)
    [ ] Separate screens and board UI manipulation into their own controllers
[ ] Screen support
    [ ] Remove padding on screen container
    [ ] Multiple "widgets" per screen
    [ ] Sort screens
    [ ] Disable screens
    [ ] Teamcity screen
        [ ] Create form to enter credentials and URL
        [ ] Load in projects to choose from
        [ ] Allow selection of multiple build configurations
        [ ] Persist this as a screen
        [ ] Be able to take screen and get statuses at render time
        [ ] Improve rendering of a pipeline
    [ ] Local screen
        [ ] Basic message support
        [ ] Preview message (POST data to a board URL)
        [ ] Upload images
[ ] Reload screens on running boards
    [x] Find lightweight web socket implementation (Primus + WebSockets (ws))
    [x] Add support for single command to "HUP" the list of screens
    [ ] Only update screens that have been changed?
    [ ] Notification when board opened in non-Web Socket browser
[ ] User management
[ ] More unit tests