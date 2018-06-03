function calculateSap(data, btcMockData) {
    return data['available_supply'] / btcMockData.btcAvailableSupply * data['price_' + btcMockData.selectedCurrency] / btcMockData.clientBtcValuation;
}


describe('calculation formulas test', () => {
    let mockData = {
        available_supply: 1000,
        price_usd: 15000,
        '24h_volume_usd': 100000,
    };

    let btcData = {
        btcAvailableSupply: 1000,
        selectedCurrency: 'usd',
        clientBtcValuation: 1,
        btc24hVolume: 100000
    };

   it('calculate SAP test', () => {
       expect(calculateSap(mockData, btcData)).toEqual(15000);
   });
});
