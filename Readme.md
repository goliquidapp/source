# Bitmex Trading

## Folder Structure
```
src
    api
        API.js                  (Axios object for REST API, WebSocket for real-time)
    components                  (presentational components)
    helpers
        bitmex.helpers.js       (bitmex authentication helpers)
    modules                     (container modules (connected to Redux store))
    redux                       (Redux store and combineReducers setup)
    resources                   (Colors constatns)
    routing 
        headers.js              (Header styles for different screens)
        router.js               (React Navigation router)
    screens                     (Screens components)
    App.js                      (Main entry point of app)
    config.js                   (Global app configurations)
    setupTests.js               (Tests setups, later to be used for unit tests)
```

## Building notes

- When creating a production release make sure to set **debug** flag to `false` in `src/config.js`

### IOS release:  
- `cd ios && fastlane beta ` this will create a new release on TestFlight

### Android release:  
- `cd android && ./gradlew assembleRelease`
