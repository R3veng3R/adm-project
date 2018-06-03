<template>
    <div>
        <SelectComponent @currencyChange="onCurrencyChange"> </SelectComponent>

        <div class="block slider-container">
            <vue-slider v-model="clientSliderValue"
                        :min="10"
                        :max="1000">
            </vue-slider>
        </div>

        <el-table border
                  v-loading="isLoading"
                  :data="tableData"
                  :row-class-name="tableRowClassName"
                  :highlight-current-row="false"
                  height="555"
                  style="width: 100%">

            <el-table-column v-for="column in columns" :key="column.id"
                             sortable
                             :prop="column.prop"
                             :label="column.label"
                             :width="column.width"
                             :resizable="column.resizable">

                <template slot-scope="scope">
                    <div v-if="column.render" v-html="column.render(scope.row)"></div>
                    <div v-else v-html="scope.row[column.prop]"></div>
                </template>

            </el-table-column>
        </el-table>

        <div class="button-container">
            <el-button type="primary" round
                       :disabled="isLoading"
                       icon="el-icon-refresh"
                       size="small"
                       @click="loadMoreRecords">
                Load 10 more
            </el-button>
        </div>
    </div>
</template>

<script>
    import vueSlider from 'vue-slider-component';
    import {Constants} from "../shared/constants";
    import {CalcFormulas} from "../shared/calcFormulas";
    import {Utils} from "../shared/utils";
    import SelectComponent from "./SelectComponent";

    export default {
        name: "BitcoinComponent",
        components: {SelectComponent, vueSlider},
        mixins: [CalcFormulas, Utils],

        data() {
            return {
                isLoading: true,
                tableData: [],
                columns: [],

                clientSliderValue: 100,
                selectedCurrency: 'usd',

                recordLoadStep: 10,
                recordLimit: 10
            }
        },

        created() {
            this.initColumns();
            this.loadTableData();
        },

        methods: {
            initColumns() {
                this.columns = [
                    {prop: 'rank', label: '#', width: '60', resizable: false},
                    {prop: 'name', label: 'Name', width: '', resizable: true},
                    {
                        prop: 'price_usd', label: 'Price, ' + this.selectedCurrency.toUpperCase(), width: '150', resizable: true,
                        render: (data) => {
                            return this.formatPrice(data['price_' + this.selectedCurrency]);
                        }
                    },
                    {
                        prop: 'sap',
                        label: 'Supply-adjusted price (SAP), ' + this.selectedCurrency.toUpperCase(),
                        width: '165',
                        resizable: true,
                        render: (data) => {
                            return this.formatPrice(data.sap);
                        }
                    },
                    {
                        prop: 'vap',
                        label: 'Volume-adjusted price (VAP), ' + this.selectedCurrency.toUpperCase(),
                        width: '165',
                        resizable: true,
                        render: (data) => {
                            return this.formatPrice(data.vap);
                        }
                    },
                    {
                        prop: 'sapDividedVap', label: 'SAP/VAP', width: '110', resizable: true,
                        render: (data) => {
                            return (data.sapDividedVap * 100).toFixed(2) + '%';
                        }
                    },
                    {
                        prop: 'liquidity24h', label: 'Liquidity (24h)', width: '100', resizable: true,
                        render: (data) => {
                            return data.liquidity24h.toFixed(2) + '%';
                        }
                    },
                    {
                        prop: 'percent_change_24h',
                        label: 'Change (24h)',
                        width: '100',
                        resizable: true,
                        render: (data) => {
                            if (data.percent_change_24h < 0) {
                                return '<span class="negative">' + data.percent_change_24h + '</span>';
                            } else {
                                return '<span class="positive">+' + data.percent_change_24h + '</span>';
                            }
                        }
                    },
                    {
                        prop: 'percent_change_7d',
                        label: 'Change (7d)',
                        width: '100',
                        resizable: true,
                        render: (data) => {
                            if (data.percent_change_7d < 0) {
                                return '<span class="negative">' + data.percent_change_7d + '</span>';
                            } else {
                                return '<span class="positive">+' + data.percent_change_7d + '</span>';
                            }
                        }
                    },
                ]
            },

            loadTableData() {
                this.isLoading = true;

                this.$http.get(Constants.BACKEND_API_URL + '?convert=' +this.selectedCurrency.toUpperCase()+ '&limit=' + this.recordLimit)
                    .then((response) => {
                        this.findAndSetBtcData(response.data);
                        this.recalculateData(response.data);
                        this.tableData = response.data;

                        this.$notify({
                            title: 'Data loaded',
                            message: 'Data has been loaded successfully',
                            type: 'success',
                            position: 'bottom-right'
                        });

                        console.log(response);
                    })
                    .catch((error) => {
                        this.$notify.error({
                            title: 'Error has occurred',
                            message: error.message,
                            position: 'bottom-right'
                        });
                    })
                    .finally(() => {
                        this.isLoading = false;
                    })
            },

            tableRowClassName({row, rowIndex}) {
                if (row.id === Constants.BITCOIN_ID) {
                    return 'bitcoin-row';
                }

                if (row.sapDividedVap < 1.0) {
                    return 'sap-vap-less-one-row';
                } else {
                    return 'sap-vap-higher-one-row';
                }

                return '';
            },

            recalculateData(data) {
                data.forEach((data) => {
                    data.sap = this.calculateSap(data);
                    data.vap = this.calculateVap(data);
                    data.sapDividedVap = this.calculateSapVap(data);
                    data.liquidity24h = this.calculateLiquidity(data);
                });
            },

            loadMoreRecords() {
                this.recordLimit += this.recordLoadStep;
                this.loadTableData();
            },

            findAndSetBtcData(data) {
                let btc = data.find((element) => {
                    return element.id === Constants.BITCOIN_ID;
                });

                if (!btc) {
                    this.$notify.error({
                        title: 'Error has occurred',
                        message: 'No Bitcoin data has been received from the server',
                        position: 'bottom-right'
                    });

                    throw new Error("Bitcoin data has not been found");
                }

                this.setBtcData(btc);
            },

            setBtcData(btc) {
                this.btcData.availableSupply = btc.available_supply;
                this.btcData.volume24h = btc['24h_volume_' + this.selectedCurrency];
                this.btcData.selectedCurrency = this.selectedCurrency;
            },

            onCurrencyChange($event) {
                this.selectedCurrency = $event;
                this.loadTableData();
                this.initColumns();
            }
        },

        watch: {
            clientSliderValue: function (newValue, oldValue) {
                // multiplication is much faster and easy, than division
                this.btcData.clientBtcValuation = newValue * 0.01;
                this.recalculateData(this.tableData);
            }
        }
    }
</script>

<style scoped>
    div .button-container {
        padding-top: 10px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
</style>
