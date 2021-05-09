<template>
    <section>
        <h1>This is an about page</h1>
        <!-- <div>{{ '這個是路由傳過來的值: ' + id }}</div> -->
        <!-- <h2>之前的{{ gridObj_col }}</h2> -->
        <!-- <div class="table">
            <div class="table-body">
                <div>設備編號</div>
                <div>設備名稱</div>
                <div>檢查主項目</div>
                <div>檢查子項目</div>
                <div>10:00</div>
                <div>12:00</div>
                <div>15:00</div>
                <div :style="{ 'grid-row': `2 / 16` }">{{ tableData.number }}</div>
                <template data-block="電磁流量計區塊">
                    <div class="electromagnetic">電磁流量計</div>
                    <template data-block="即時流量區塊">
                        <div class="immediate">即時流量</div>
                        <div class="child-label">檢測數值</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">照片</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">MAX</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">MIN</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">AVE</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                    </template>
                    <template data-block="累積流量區塊">
                        <div class="accumulation">累積流量</div>
                        <div class="child-label">檢測數值</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">照片</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">MAX</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">MIN</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                        <div class="child-label">AVE</div>
                        <div>5</div>
                        <div>6</div>
                        <div>7</div>
                    </template>
                </template>
                <template data-block="A區進流區塊">
                    <div class="enter-flow">A區進流</div>
                    <template>
                        <div class="date-label">昨日累計</div>
                        <div class="date-value"></div>
                        <div class="date-label">今日累計</div>
                        <div class="date-value"></div>
                        <div class="date-label">今日流量</div>
                        <div class="date-value"></div>
                    </template>
                </template>
                <template data-block="備註區塊">
                    <div></div>
                    <template>
                        <div class="date-label">備註</div>
                        <div class="date-value"></div>
                    </template>
                </template>
            </div>
        </div> -->
        <h2>A 表格grid動態</h2>
        <DynamicTable :tableData_header="tableData_header_A" :tableData="tableData_A" />
        <h2 style="margin-top:2rem;">B 表格grid動態</h2>
        <DynamicTable :tableData_header="tableData_header_B" :tableData="tableData_B" />
        <h2 style="margin-top:2rem;">C 表格grid動態</h2>
        <DynamicTable :tableData_header="tableData_header_C" :tableData="tableData_C" />
        <h2 style="margin-top:2rem;">D 表格grid動態</h2>
        <DynamicTable :tableData_header="tableData_header_D" :tableData="tableData_D" />
        <h2 style="margin-top:2rem;">E 表格grid動態</h2>
        <DynamicTable :tableData_header="tableData_header_E" :tableData="tableData_E" />
    </section>
</template>
<script>
import DynamicTable from '@/components/DynamicTable'
export default {
    components: {
        DynamicTable,
    },
    props: {
        //檔案的id
        id: {
            default: '',
            type: String,
        },
    },
    data() {
        return {
            tableData_header_A: [
                { name: '設備編號', type: 'number' },
                { name: '設備名稱', type: 'name' },
                { name: '檢查主項目', type: 'mainName' },
                { name: '檢查子項目', type: 'childName' },
                { name: '10:00', type: 'value' },
                { name: '12:00', type: 'value' },
                { name: '15:00', type: 'value' },
            ],
            tableData_A: {
                number: 'A001-a',
                nameList: [
                    {
                        type: 1, //排版類型
                        name: '電磁流量計',
                        //底下的主項目
                        mainList: [
                            {
                                mainName: '即時流量',
                                childList: [
                                    {
                                        childName: '檢測數值',
                                        time: [100, 200, 300],
                                    },
                                    {
                                        childName: '照片',
                                        time: [111, 222, 333],
                                    },
                                    {
                                        childName: 'MAX',
                                        value: 444,
                                    },
                                    {
                                        childName: 'MIN',
                                        value: 777,
                                    },
                                    {
                                        childName: 'AVE',
                                        value: 4000,
                                    },
                                ],
                            },
                            {
                                mainName: '累積流量',
                                childList: [
                                    {
                                        childName: '檢測數值',
                                        time: [100, 200, 300],
                                    },
                                    {
                                        childName: '照片',
                                        time: [111, 222, 333],
                                    },
                                    {
                                        childName: 'MAX',
                                        value: 444,
                                    },
                                    {
                                        childName: 'MIN',
                                        value: 777,
                                    },
                                    {
                                        childName: 'AVE',
                                        value: 2000,
                                    },
                                    {
                                        childName: '測試123123',
                                        value: 2000,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 2, //排版類型
                        name: 'A區進流',
                        mainList: [
                            {
                                mainName: '昨日累計',
                                value: 'www',
                            },
                            {
                                mainName: '今日累計',
                                value: 'xxx',
                            },
                            {
                                mainName: '今日流量',
                                value: 'yyy',
                            },
                        ],
                    },
                    {
                        type: 2, //排版類型
                        name: 'B區進流',
                        mainList: [
                            {
                                mainName: '昨日累計',
                                value: 'www',
                            },
                            {
                                mainName: '今日累計',
                                value: 'xxx',
                            },
                            {
                                mainName: '今日流量',
                                value: 'yyy',
                            },
                            {
                                mainName: '備註',
                                value: '0000',
                            },
                        ],
                    },
                ],
            },

            tableData_header_B: [
                { name: '設備編號', type: 'number' },
                { name: '設備名稱', type: 'name' },
                { name: '檢查主項目', type: 'mainName' },
                { name: '檢查子項目', type: 'childName' },
                { name: '巡察結果', type: 'value' },
            ],
            tableData_B: {
                number: 'B001',
                nameList: [
                    {
                        type: 1, //排版類型
                        name: '水質監測',
                        //底下的主項目
                        mainList: [
                            {
                                mainName: '水溫',
                                childList: [
                                    {
                                        childName: '進流',
                                        value: 444,
                                    },
                                    {
                                        childName: '備註',
                                        value: 444,
                                    },
                                ],
                            },
                            {
                                mainName: '酸鹼值',
                                childList: [
                                    {
                                        childName: '進流',
                                        value: 444,
                                    },
                                    {
                                        childName: '備註',
                                        value: 444,
                                    },
                                ],
                            },
                            {
                                mainName: 'DO',
                                childList: [
                                    {
                                        childName: '進流',
                                        value: 444,
                                    },
                                    {
                                        childName: '備註',
                                        value: 444,
                                    },
                                ],
                            },
                            {
                                mainName: 'SS',
                                childList: [
                                    {
                                        childName: '進流',
                                        value: 444,
                                    },
                                    {
                                        childName: '備註',
                                        value: 444,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },

            tableData_header_C: [
                { name: '設備編號', type: 'number' },
                { name: '設備名稱', type: 'name' },
                { name: '檢查主項目', type: 'mainName' },
                { name: '檢查子項目', type: 'childName' },
                { name: '巡察結果', type: 'value' },
            ],
            tableData_C: {
                number: 'C001',
                nameList: [
                    {
                        type: 2, //排版類型
                        name: '周邊環境',
                        mainList: [
                            {
                                mainName: '是否髒亂',
                                value: '4的',
                            },
                            {
                                mainName: '照片',
                                value: 'xxx',
                            },
                            {
                                mainName: '備註',
                                value: 'yyy',
                            },
                        ],
                    },
                ],
            },

            tableData_header_D: [
                { name: '設備編號', type: 'number' },
                { name: '設備名稱', type: 'name' },
                { name: '檢查主項目', type: 'mainName' },
                { name: '巡察結果', type: 'value' },
            ],
            tableData_D: {
                number: 'A001-d',
                nameList: [
                    {
                        type: 2, //排版類型
                        name: '燈具',
                        mainList: [
                            {
                                mainName: '是否運作',
                                value: '4',
                            },
                            {
                                mainName: '照片',
                                value: 'xxx',
                            },
                            {
                                mainName: '備註',
                                value: 'yyy',
                            },
                        ],
                    },
                    {
                        type: 2, //排版類型
                        name: '集水',
                        mainList: [
                            {
                                mainName: '是否運作',
                                value: '4',
                            },
                            {
                                mainName: '照片',
                                value: 'xxx',
                            },
                            {
                                mainName: '備註',
                                value: 'yyy',
                            },
                        ],
                    },
                ],
            },

            tableData_header_E: [
                { name: '設備編號', type: 'number' },
                { name: '設備名稱', type: 'name' },
                { name: '檢查主項目', type: 'mainName' },
                { name: '檢查子項目', type: 'childName' },
                // { name: '巡察結果', type: 'value' },
                { name: '10:00', type: 'value' },
                { name: '12:00', type: 'value' },
                { name: '15:00', type: 'value' },
            ],
            tableData_E: {
                number: 'A001-d',
                nameList: [
                    {
                        type: 1, //排版類型
                        name: '電磁流量計',
                        //底下的主項目
                        mainList: [
                            {
                                mainName: '即時流量',
                                childList: [
                                    {
                                        childName: '檢測數值',
                                        time: [100, 200, 300],
                                    },
                                    {
                                        childName: '照片',
                                        time: [111, 222, 333],
                                    },
                                    {
                                        childName: 'MAX',
                                        value: 444,
                                    },
                                    {
                                        childName: 'MIN',
                                        value: 777,
                                    },
                                    {
                                        childName: 'AVE',
                                        value: 4000,
                                    },
                                ],
                            },
                            {
                                mainName: '累積流量',
                                childList: [
                                    {
                                        childName: '檢測數值',
                                        time: [100, 200, 300],
                                    },
                                    {
                                        childName: '照片',
                                        time: [111, 222, 333],
                                    },
                                    {
                                        childName: 'MAX',
                                        value: 444,
                                    },
                                    {
                                        childName: 'MIN',
                                        value: 777,
                                    },
                                    {
                                        childName: 'AVE',
                                        value: 2000,
                                    },
                                    {
                                        childName: '測試123123',
                                        value: 2000,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 2, //排版類型
                        name: '燈具',
                        mainList: [
                            {
                                mainName: '是否運作',
                                value: '4',
                            },
                            {
                                mainName: '照片',
                                value: 'xxx',
                            },
                            {
                                mainName: '備註',
                                value: 'yyy',
                            },
                        ],
                    },
                    {
                        type: 2, //排版類型
                        name: '集水',
                        mainList: [
                            {
                                mainName: '是否運作',
                                value: '4',
                            },
                            {
                                mainName: '照片',
                                value: 'xxx',
                            },
                            {
                                mainName: '備註',
                                value: 'yyy',
                            },
                        ],
                    },
                ],
            },
        }
    },
}
</script>
