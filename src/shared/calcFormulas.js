export const CalcFormulas = {
    data() {
        return {
            btcData: {
                availableSupply: 0,
                volume24h: 0,
                selectedCurrency: 'usd',
                clientBtcValuation: 1
            }
        }
    },

    methods: {
        /*
         * "available_supply" of coin N / "available_supply" of Bitcoin * "price_usd" of coin N / "client_btc_valuation
         */
        calculateSap(coinData) {
            return coinData['available_supply'] / this.btcData.availableSupply
                * coinData['price_' + this.btcData.selectedCurrency] / this.btcData.clientBtcValuation;
        },

        /*
         *   (("market_cap_usd" of coin N / "24h_volume_usd" of coin N ) * "24h_volume_usd" of Bitcoin) /
         *   "available_supply" of coin N / "client_btc_valuation"
         */
        calculateVap(coinData) {
            return ((coinData['market_cap_' + this.btcData.selectedCurrency] / coinData['24h_volume_' + this.btcData.selectedCurrency])
                * this.btcData.volume24h) / coinData['available_supply'] / this.btcData.clientBtcValuation;
        },

        calculateLiquidity(coinData) {
            return coinData['24h_volume_' + this.btcData.selectedCurrency] / (coinData['market_cap_' + this.btcData.selectedCurrency] * 0.01);
        },

        calculateSapVap(coinData) {
            return coinData.sap / coinData.vap;
        }
    }
};
