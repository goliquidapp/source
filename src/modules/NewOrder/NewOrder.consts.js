export default {
	'Limit':"Limit orders are used to specify a maximum or minimum price the trader is willing to buy or sell at. Traders use this order type to minimise their trading cost, however they are sacrificing guaranteed execution as there is a chance the order may not be executed if it is placed deep out of the market.",
	'Market':"A Market Order will be placed when the market reaches the Trigger Price.",
	'StopMarket':"A Stop Order is an order that does not enter the order book until the market reaches a certain Trigger Price. Traders use this type of order for two main strategies:\n\n1- As a risk-management tool to limit losses on existing positions\n2- As an automatic tool to enter the market at a desired entry point without manually waiting for the market to place the order.\n\nA Stop Order will become a Market Order when the Stop Price is reached.",
	'StopLimit':"A Stop Limit Order is like a Stop Order, but allows you to set the price of the order once your Stop Price is triggered. Use this as an alternative to Stop orders if you wish to control your exit.\n\nNote that, if your triggered order does not match against any orders in the book, your position may remain open.Set a deep price for best results.",
	'GoodTillCancel':'Order will stay open till cancelled manually.',
	'ImmediateOrCancel':'Any unfilled portion left immediately after placement is canceled.',
	'FillOrKill':'The order will only execute if its full quantity can be immediately filled.',
	'TrailingStop':'A Trailing Stop Order is similar to a Stop Market Order, whereby you specify the Trailing Value differential to the Trigger Price, and if triggered then a market order will be placed.',
	'TakeProfitLimit': 'A Take Profit Limit Order can be used to set a target price on a position. It is like a Stop, but triggers are set in the opposite direction.\n\nUse this to exit a position in profit, or to set an entry point for a new position.',
	'TakeProfitMarket':'A Take Profit Order can be used to set a target price on a position. It is like a Stop, but triggers are set in the opposite direction.\n\nUse this to exit a position in profit, or to set an entry point for a new position. A Take Profit Order becomes a Market Order once triggered.',
	'ScaleOrder':'A scale order comprises several limit orders at incrementally increasing or decreasing prices. If it is a buy scale order, the limit orders will decrease in price, triggering buys at lower prices as the price starts to fall. With a sell order, the limit orders will increase in price, allowing the trader to take advantage of increasing prices, thereby locking in higher returns.',
	'Uniform':'Uniform distribution of orders',
	'Normal':'Normal distribution of orders',
	'Positive':'Positive distribution of orders',
	'Negative':'Negative distribution od orders'
}