function optionLevelDropDown(currentOption) {
/*
    const paymentMethodsObj = {             //  <select id="payment" name="payment">
        "crypto-wallet": "Crypto Wallet",       //      <option value="crypto-wallet">Crypto Wallet</option>
        "credit-card" : "Credit Card",          //      <option value="credit-card">Credit Card</option>
        "debit-card":  "Debit Card",            //      <option value="debit-card">Debit Card</option>
        "paypal" : "PayPal",                    //      <option value="paypal" selected>PayPal</option>
        };                                      //  </select>
        
    const paymentMethods = Object.keys(paymentMethodsObj).map( (key) => ({ 
            value: key, 
            label: paymentMethodsObj[key],
            isSelected: cryptoService.paymentMethod == key,
        }));
    
*/
    const availableOptions = [
        { key: 'crypto-wallet', label: 'Crypto Wallet', selected: false },
        { key: 'credit-card', label: 'Credit Card', selected: false },
        { key: 'debit-card', label: 'Debit Card', selected: false },
        { key: 'paypal', label: 'PayPal', selected: false },
    ]
    const result = availableOptions.map(x => x.key == currentOption ? { ...x, selected: true } : x);
    return result;
}
module.exports = optionLevelDropDown;
