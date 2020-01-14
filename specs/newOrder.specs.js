export default function(spec){
  spec.describe('Creating new order', function(){
  	spec.it('works', async function() {
  		await spec.exists('Navigator.HeroButton');
	    await spec.press('Navigator.HeroButton');
	    await spec.exists('NewOrder.ContainerView');
	    await spec.exists('NewOrder.QtyInput');
	    await spec.exists('NewOrder.PriceInput');

	    await spec.fillIn('NewOrder.QtyInput','1');
	    await spec.fillIn('NewOrder.PriceInput','8500');

	    await spec.exists('Summary.BuyTagButton');
	    await spec.exists('Summary.SellTagButton');
  	})
  })
}