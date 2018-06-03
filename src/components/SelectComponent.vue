<template>
    <div class="currency-select-container">
        Currency :
        <el-select  placeholder="Select"
                    v-model="selectedCurrency"
                    @change="onChange">

            <el-option size="small"
                       v-for="item in selectOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
        </el-select>
    </div>
</template>

<script>
    export default {
        name: "SelectComponent",
        data() {
            return {
                selectedCurrency: 'usd',
                selectOptions: [
                    {
                        value: 'usd',
                        label: 'USD'
                    },
                    {
                        value: 'eur',
                        label: 'EUR'
                    }
                ]
            }
        },

        methods: {
            onChange() {
                this.$emit("currencyChange", this.selectedCurrency);
            }
        }
    }
</script>

<style scoped>
    div .currency-select-container {
        padding-bottom: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .el-select {
        width: 100px;
        padding-left: 5px;
    }
</style>
