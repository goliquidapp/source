<h1 align="center">
  <a href="https://goliquid.app/">
    Liquid
  </a>
</h1>
<p align="center">
    <img src="https://goliquid.app/assets/imgs/logo.svg" width="128">
</p>
<p align="center">
  <strong>Easy, Efficient and Secure!</strong><br>
  Any Time, Any Place trading
</p>

<p align="center">
  <a href="https://play.google.com/store/apps/details?id=com.bitmex_trading">
    <img src="https://goliquid.app/assets/imgs/google-play.svg" alt="Download on Play Store" width="220" />
  </a>
  <a href="https://apps.apple.com/us/app/l1qu1d/id1482273711?ls=1">
    <img src="https://goliquid.app/assets/imgs/apple-store.svg" alt="Download on Apple Store" width="220" />
  </a>
  <a href="https://testflight.apple.com/join/9PE9fAMf">
    <img src="https://goliquid.app/assets/imgs/testflight.svg" alt="Join beta" width="220" />
  </a>
</p>

<p align="center">
  <a href="https://webchat.freenode.net/#goliquid">
    <img src="https://webchat.freenode.net/static/favicon.png" alt="Freenode" width="40" />
  </a>
  <a href="https://twitter.com/GoLiquidApp">
    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Twitter_bird_logo_2012.svg/150px-Twitter_bird_logo_2012.svg.png" alt="Twitter" width="40" />
  </a>
  <a href="https://t.me/goliquid">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/768px-Telegram_logo.svg.png" alt="Telegram" width="40" />
  </a>
</p>

<p>
    <a href="https://twitter.com/intent/follow?screen_name=GoLiquidApp">
        <img src="https://img.shields.io/twitter/follow/GoLiquidApp.svg?label=Follow%20@Liquid" alt="Follow @Liquid" />
    </a>
</p>

### Summary
<p align="center">
Liquid is a free software for trading on crypto currency exchanges.<br/>
It uses AES256 to encrypt your credentials and stores them safe in your device hence it's secured and reliable.  
</p>

### 🚀 Features
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

### 📖 Folder Structure
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

### 🎉 Building notes

- When creating a production release make sure to set **debug** flag to `false` in `src/config.js`

- IOS release:  
  - `cd ios && fastlane beta ` this will create a new release on TestFlight

- Android release:  
  - `cd android && ./gradlew assembleRelease`

- Binaries:
  - [Download Universal APK](app-universal-release.apk)
  - MD5 93AF3A0FC150A8244836F85BE5E42802

### 📄 License

This application is not open source and is licensed under **Fair Source 1 (v0.9)**

Please read the [License](LICENSE)

### 📄 Copyright
© All rights reserved to [CNepho](https://cnepho.com/) SARL