# Liquid

Liquid is a free software for trading on crypto currency exchanges. It uses AES256 to encrypt your credentials and stores them safe in your device hence it's secured and reliable.  

## Features
Liquid offers lots of features that will help you in your tradings, below is a list of current features:
- Real time order book showing current market size and price
- Real time crypto currency prices
- See your position on BitMEX in real time, close at market price or any price you want
- Check your orders (Active, Stop, Filled, Cancelled) in real time
- Receive notifications about your Position, Liquidation, Market Prices and exchanges high trades
- Open new orders (all kind of orders supported by BitMEX)
- Calculators to help you oversee your position and profits
- Interactive charts to help you in your trades, in addition to variety of popular indicators
- Wallet details and ability to share your deposit address, fill your account with simple click
- Ability to withdraw your money with simple secured form
- Support for all kind of crypto currencies available on BitMEX
- Advanced options for experienced users, like Dead-Man feature

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


## Copyright
© All rights reserved to [CNepho](https://cnepho.com/) SARL