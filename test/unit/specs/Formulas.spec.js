function calculateSap(data, btcMockData) {
    return data['available_supply'] / btcMockData.available_supply * data['price_' + btcMockData.selectedCurrency] / btcMockData.clientBtcValuation;
}

function calculateVap(coinData, btcMockData) {
    return ((coinData['market_cap_' + btcMockData.selectedCurrency] / coinData['24h_volume_' + btcMockData.selectedCurrency])
        * btcMockData.volume24h) / coinData['available_supply'] / btcMockData.clientBtcValuation;
}

function calculateLiquidity(coinData, btcMockData) {
    return coinData['24h_volume_' + btcMockData.selectedCurrency] / (coinData['market_cap_' + btcMockData.selectedCurrency] * 0.01);
}

describe('calculation formulas test', () => {
    let mockData = {
        available_supply: 17072762,
        price_usd: 7000,
        '24h_volume_usd': 4944470000,
        market_cap_usd: "131784308423",
    };

    let btcData = {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        rank: "1",
        price_usd: 7000,
        price_btc: 1.0,
        "24h_volume_usd": "4944470000.0",
        volume24h: "4944470000.0",
        market_cap_usd: "131784308423",
        available_supply: "17072762.0",
        total_supply: "17072762.0",
        max_supply: "21000000.0",
        "percent_change_1h": "0.25",
        "percent_change_24h": "0.87",
        "percent_change_7d": "4.98",
        "last_updated": "1528056576",
        selectedCurrency: 'usd',
        clientBtcValuation: 1
    };

   it('calculates SAP', () => {
       expect(calculateSap(mockData, btcData)).toEqual(7000);
   });

    it('calculates VAP', () => {
        expect( parseFloat(calculateVap(mockData, btcData).toFixed(2)) ).toEqual(7718.98);
    });

    it('calculates liquidity', () => {
       expect( parseFloat(calculateLiquidity(mockData, btcData).toFixed(2)) ).toEqual(3.75);
    });
});
