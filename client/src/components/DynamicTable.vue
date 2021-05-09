<template>
    <div class="table">
        <div>type2_col_item : {{ type2_col_item }}</div>
        <div>ype2_col_value : {{ type2_col_value }}</div>
        <div
            class="table-body"
            :style="{
                'grid-template-columns': `repeat(${tableData_header.length}, 1fr)`,
                'grid-template-rows': `repeat(${gridObj_row.rows}, 1fr)`,
            }"
        >
            <div v-for="item in tableData_header" :key="item.name">{{ item.name }}</div>
            <!-- <div>設備名稱</div>
            <div>檢查主項目</div>
            <div>檢查子項目</div>
            <div>10:00</div>
            <div>12:00</div>
            <div>15:00</div> -->
            <!-- gridObj_row: {
                // number: '2 / 16',
                // item0: '2 / 12',
                // // item2:'2 / 7'
                // main0_0: '2 / 7',
                // main0_1: '7 / 12',
                // item1: '12 / 15',
                // main2_1:'3 / 5',
            }, -->
            <!-- total_line + 1 的1為底線 -->
            <div :style="{ 'grid-row': gridObj_row.number }">{{ tableData.number }}</div>
            <!-- grid-row: 2 / 12; -->
            <!-- computedItem -->
            <template v-for="(item, index) in tableData.nameList">
                <template v-if="item.type === 1">
                    <div :style="{ 'grid-row': gridObj_row[`item${index}`] }" :key="item.name">
                        {{ item.name }}
                    </div>
                    <template v-for="(main, mainIndex) in item.mainList">
                        <div :style="{ 'grid-row': gridObj_row[`main${index}_${mainIndex}`] }" :key="main.mainName">
                            {{ main.mainName }}
                        </div>
                        <template v-for="(child, childIndex) in main.childList">
                            <div class="child-label" :key="`${main.mainName}${child.childName}`">
                                {{ child.childName }}
                            </div>
                            <template v-for="(childObj_key, keyIndex) in Object.keys(child)">
                                <div
                                    v-if="childObj_key === 'value'"
                                    :style="{
                                        'grid-column': `${tableData_header.length +
                                            1 -
                                            type2_col_value}/ ${tableData_header.length + 1} `,
                                    }"
                                    :key="`${mainIndex}_${childIndex}_${childObj_key}_${keyIndex}`"
                                >
                                    <!-- {{ child[childObj_key] }} -->
                                    {{ `${mainIndex}_${childIndex}_${childObj_key}_${keyIndex}` }}
                                </div>
                                <template v-else-if="childObj_key === 'time'">
                                    <div
                                        :key="
                                            `${mainIndex}_${childIndex}_${childObj_key}_${keyIndex}_${childItemIndex}`
                                        "
                                        v-for="(childItem, childItemIndex) in child[childObj_key]"
                                    >
                                        {{ childItem }}
                                    </div>
                                </template>
                            </template>
                        </template>
                    </template>
                </template>
                <template v-else-if="item.type === 2">
                    <div :style="{ 'grid-row': gridObj_row[`item${index}`] }" :key="item.name">
                        {{ item.name }}
                    </div>
                    <template v-for="main in item.mainList">
                        <div
                            :style="{ 'grid-column': ` 3 / ${type2_col_item + 3}` }"
                            :key="`${item.name}${main.mainName}`"
                        >
                            {{ main.mainName }}
                        </div>
                        <div
                            :style="{
                                'grid-column': ` ${tableData_header.length +
                                    1 -
                                    type2_col_value} / ${tableData_header.length + 1} `,
                            }"
                            :key="`${item.name}${main.mainName}value`"
                        >
                            {{ main.value }}
                        </div>
                    </template>
                </template>
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        //標題
        tableData_header: {
            type: Array,
            default: [],
        },
        //資料
        tableData: {
            type: Object,
            default: {},
        },
    },
    data() {
        return {}
    },
    computed: {
        gridObj_row() {
            /**
             *  number 設備編號
             *  item${itemIndex}  設備名稱 itemIndex為第幾個 "設備名稱"
             *  main${itemIndex}_${mainIndex}  檢查主項目   mainIndex為第幾個 "主項目"
             */
            // gridObj_row: {
            //     // number: '2 / 16',  //A001-a
            //     // item0: '2 / 12',   //電磁流量計
            //     // // item2:'2 / 7'  //A區進流
            //     // main0_0: '2 / 7', //即時流量
            //     // main0_1: '7 / 12', //累積流量
            //     // item1: '12 / 15',  //B區進流
            //     // main2_1:'3 / 5',
            // },
            let number = 2
            let itemNumber = 2
            let mainNumber = 2

            let gridObj_row = {}

            //計算全部有幾行
            this.tableData.nameList.forEach((item, index) => {
                let count = 0
                if (item.type === 1) {
                    item.mainList.forEach((obj, mainIndex) => {
                        number = number + obj.childList.length
                        count = count + obj.childList.length

                        gridObj_row[`main${index}_${mainIndex}`] = `${mainNumber} / ${obj.childList.length +
                            mainNumber}`
                        mainNumber = obj.childList.length + mainNumber
                    })
                    gridObj_row[`item${index}`] = `${itemNumber} / ${count + itemNumber}`
                    itemNumber = count + itemNumber
                } else if (item.type === 2) {
                    number = number + item.mainList.length
                    count = count + item.mainList.length

                    gridObj_row[`item${index}`] = `${itemNumber} / ${count + itemNumber}`
                    itemNumber = count + itemNumber
                }
            })

            gridObj_row.rows = number - 1
            gridObj_row.number = `2 / ${number}`
            return gridObj_row
        },

        //計算 type = 2時 ，col要多少
        type2_col_value() {
            let total = this.tableData_header.length
            let label = 0

            this.tableData_header.forEach((item) => {
                if (item.type === 'mainName' || item.type === 'childName') {
                    label = label + 1
                }
            })

            return total - label - 2 //2為設備編號及設備名稱
        },

        type2_col_item() {
            let col = 0

            this.tableData_header.forEach((item) => {
                if (item.type === 'mainName' || item.type === 'childName') {
                    col = col + 1
                }
            })
            return col
        },
    },
}
</script>
<style lang="scss" scoped>
.table {
    overflow-x: auto;
}
.table-body {
    min-width: 1200px;
    display: grid;
    div {
        border: 1px solid #ccc;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
