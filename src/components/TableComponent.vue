<template>
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
</template>

<script>
    import {CalcFormulas} from "../shared/calcFormulas";
    import {Utils} from "../shared/utils";
    import {Constants} from "../shared/constants";

    export default {
        name: "TableComponent",
        mixins: [CalcFormulas, Utils],

        props: {
            columns: Array
        },

        data() {
            return {
                tableData: [],
                isLoading: true,
                recordLoadStep: 10,
                recordLimit: 10
            }
        },

        methods: {
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
        },

        created() {
            this.loadTableData();
        }
    }
</script>

<style scoped>

</style>
