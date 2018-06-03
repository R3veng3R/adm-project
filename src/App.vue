<template>
    <div id="app" class="container">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }

    .el-table .sap-vap-less-one-row {
        background: #bfeed7;
    }

    .el-table .sap-vap-higher-one-row  {
        background: #f0afb3;
    }

    .el-table .bitcoin-row {
        background: #e8e8e8;
    }

    span.negative {
        color: red;
    }

    span.positive {
        color: green;
    }

    .el-table .cell {
        word-break: unset;
    }

    .el-table th {
        padding: 12px 0 0 0;
    }
</style>
