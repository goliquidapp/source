import { combineReducers } from 'redux';
import orderBook from '../modules/OrderBook/OrderBook.reducer.js';
import summary 	 from '../modules/Summary/Summary.reducer.js';
import myOrders  from '../modules/MyOrders/MyOrders.reducer.js';
import newOrder  from '../modules/NewOrder/NewOrder.reducer.js';
import settings  from '../modules/Settings/Settings.reducer.js';
import userLog  from '../modules/UserLog/UserLog.reducer.js';
import trades  from '../modules/Trades/Trades.reducer.js';
import balance  from '../modules/Balance/Balance.reducer.js';
import wallet  from '../modules/Wallet/Wallet.reducer.js';
import position  from '../modules/Position/Position.reducer.js';
import deposit  from '../modules/Deposit/Deposit.reducer.js';
import withdraw from '../modules/Withdraw/Withdraw.reducer.js';
import globalNotification from '../modules/GlobalNotification/GlobalNotification.reducer.js';
import recentTrades from '../modules/CurrentPrice/RecentTrades.reducer.js';
import webScreen from '../modules/WebScreen/WebScreen.reducer.js';
import notifications from '../modules/Notifications/Notifications.reducer.js';
import scheduledPopup from '../modules/ScheduledPopup/ScheduledPopup.reducer.js';
import accounts from '../modules/Accounts/Accounts.reducer.js';

export default combineReducers({
	orderBook,
	summary,
	myOrders,
	newOrder,
	settings,
	userLog,
	trades,
	balance,
	wallet,
	position,
	deposit,
	withdraw,
	globalNotification,
	recentTrades,
	webScreen,
	notifications,
	scheduledPopup,
	accounts
});