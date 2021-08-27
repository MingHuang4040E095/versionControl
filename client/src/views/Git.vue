<template>
    <div>
        <div class="theme-color">
            <div v-for="color in themeColor" :key="color" :style="{ 'background-color': color }">{{ color }}</div>
        </div>
        <div class="text-h4 font-weight-bold mb-5 title">Git介面</div>
        <svg :viewbox="viewbox" id="gitInterface" preserveAspectRatio="xMidYMid slice">
            <!-- 標題區塊 -->
            <g>
                <text fill="#8C6969" v-for="item in header_text" :key="item.title" :x="item.x" :y="item.y">
                    {{ item.title }}
                </text>
            </g>

            <!-- Graph 圖形區塊 -->
            <g transform="translate(0, 35)">
                <g transform="translate(20, 0)">
                    <path fill="none" stroke="#4D4E64" stroke-width="5" stroke-linecap="round" :d="graph_line"></path>
                    <circle
                        v-for="item in graph_circle"
                        :key="item.commit"
                        transform="translate(0, -5)"
                        fill="#ffffff"
                        :cx="item.x"
                        :cy="item.y"
                        r="6"
                        stroke="#4D4E64"
                        stroke-width="5"
                    />
                </g>
                <g>
                    <text fill="#7C7A8B" v-for="item in description_text" :key="item.commit" :x="item.x" :y="item.y">
                        {{ item.description }}
                    </text>
                </g>
            </g>
            <!-- 分支 -->
            <g transform="translate(0, 35)">
                <g transform="translate(20, 0)">
                    <path fill="none" stroke="#4D4E64" stroke-width="5" stroke-linecap="round" :d="graph_line"></path>
                    <circle
                        v-for="item in graph_circle"
                        :key="item.commit"
                        transform="translate(0, -5)"
                        fill="#ffffff"
                        :cx="item.x"
                        :cy="item.y"
                        r="6"
                        stroke="#4D4E64"
                        stroke-width="5"
                    />
                </g>
            </g>
        </svg>
        <div class="git-btn-block">
            <button>Commit</button>
            <button>Push</button>
            <button>Pull</button>
            <button>Patch</button>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        viewbox() {
            return `0 0 ${this.svgWidth} ${this.svgHeight}`
        },
        //標頭文字
        header_text() {
            let scale = [1, 0.6, 3.5, 1, 1] //比例
            let scaleTotal = scale.reduce((a, b) => a + b) //相加
            let svgWidth = Number(this.svgWidth)
            // let spacing = svgWidth / this.headerItems.length
            // console.log(spacing)
            let x = Number(this.graph_coordinate_x)
            let target_x = 0
            let header_text = this.headerItems.map((title, index) => {
                let spacing = (svgWidth / scaleTotal) * scale[index]
                // let number = index + 1
                target_x = target_x === 0 ? x : target_x + Number(spacing) //計算x的座標

                return {
                    title,
                    y: this.graph_coordinate_y,
                    x: target_x,
                }
            })
            return header_text
        },
        //圖形-圓形
        graph_circle() {
            // currentBranch
            let otherBranchList = []
            let graph_circle = this.commitRecord.map((item, index) => {
                let targetTitle = this.header_text.find((item) => item.title === 'Graph')
                let x = targetTitle?.x //取得x座標
                let y = this.graph_coordinate_y

                let otherBranch = false //其他分支
                if (item.branch !== this.currentBranch) {
                    otherBranchList.push(item.branch)
                    otherBranch = true
                    x = x + 25
                }

                let number = index + 1
                let target_y = y * number //計算y的座標
                return {
                    commit: item.commit,
                    x: x, //x座標
                    y: target_y, //y座標
                }
            })
            return graph_circle
        },
        //圖形-線
        graph_line() {
            //原本的寫法
            let targetTitle = this.header_text.find((item) => item.title === 'Graph')
            let x = targetTitle?.x //取得x座標
            let path_d = ''
            let y = this.graph_coordinate_y //y座標
            this.commitRecord.forEach((item, index) => {
                let number = index + 1
                let target_y = y * number //計算y的座標
                path_d = path_d === '' ? `M${x},${target_y}` : path_d + ` ${x},${target_y}`
            })
            return path_d
        },
        //敘述-文字
        description_text() {
            let targetTitle = this.header_text.find((item) => item.title === 'Description')
            let x = targetTitle?.x //取得x座標
            // let path_d = ''
            // let x = this.graph_coordinate_x //X座標
            let y = this.graph_coordinate_y //y座標
            let graph_text = this.commitRecord.map((item, index) => {
                let number = index + 1
                let target_y = y * number //計算y的座標
                return {
                    ...item,
                    x: x,
                    y: target_y,
                }
            })
            console.log(graph_text)
            return graph_text
        },
    },
    data() {
        return {
            //SVG區塊
            svgHeight: 1200,
            svgWidth: 1200,
            //圖形的x座標
            graph_coordinate_x: 50,
            graph_coordinate_y: 50,
            themeColor: ['#4D4E64', '#D0E5F2', '#E1CEC9', '#8C6969', '#7C7A8B'], //色彩主題
            // 標頭項目
            headerItems: ['Graph', 'Description', 'Date', 'Author', 'Commit'],

            currentBranch: 'upload-image', //當前分支
            //提交紀錄
            commitRecord: [
                {
                    commit: '1asc', //提交的哈希值
                    previousCommit: '2as', //提交的哈希值
                    description: '測試用的地圖組件', //提交訊息
                    author: 'MingHuang', //提交人
                    branch: 'upload-image', //分支
                    date: '', //提交日期
                },
                {
                    commit: '2as', //提交的哈希值
                    previousCommit: '3as', //提交的哈希值
                    description: '變更儲存圖片的路徑，上傳/下載圖片時進行提交', //提交訊息
                    author: 'MingHuang', //提交人
                    branch: 'upload-image', //分支
                    date: '', //提交日期
                },
                {
                    commit: '4zxcasfzxvz', //提交的哈希值
                    previousCommit: 'wqgsdg5', //提交的哈希值
                    description: '分支一號', //提交訊息
                    author: 'Willy', //提交人
                    branch: 'delete-image', //分支
                    date: '', //提交日期
                },
                {
                    commit: '3as', //提交的哈希值
                    previousCommit: '4zxcz', //提交的哈希值
                    description: '整理api，依照路由區分api，圖片相關的api放在router/image.js做處理', //提交訊息
                    author: 'MingHuang', //提交人
                    branch: 'upload-image', //分支
                    date: '', //提交日期
                },

                {
                    commit: '4zxcz', //提交的哈希值
                    previousCommit: 'wqgsdg5', //提交的哈希值
                    description: '修正刪除檔案成功卻顯示錯誤訊息', //提交訊息
                    author: 'MingHuang', //提交人
                    branch: 'upload-image', //分支
                    date: '', //提交日期
                },
                {
                    commit: 'wqgsdg5', //提交的哈希值
                    previousCommit: '', //提交的哈希值
                    description: '刪除本地圖片', //提交訊息
                    author: 'MingHuang', //提交人
                    branch: 'upload-image', //分支
                    date: '', //提交日期
                },
            ],
        }
    },
}
</script>
<style lang="scss" scoped>
.theme-color {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    > div {
        width: 80px;
        height: 80px;
        color: rgb(31, 31, 31);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}

#gitInterface {
    width: 100%;
    height: auto;
    min-height: 450px;
    background: linear-gradient(to right bottom, rgb(214 200 196) 32%, #d0e5f2);
    border-radius: 8px;
    box-shadow: 1px 5px 11px #8c69699e;
}
.title {
    color: rgb(124 122 139 / 23%);
    text-shadow: -4px -4px 3px #fff, 4px 4px 3px #bfbcbc;
}
.git-btn-block {
    padding: 10px;
    // background: #fff;
    > button {
        display: inline-block;
        // background: linear-gradient(135deg, #e1cec9 0%, #f1e6e3 80%);
        // background: linear-gradient(to right bottom, #e1cec9 40%, #ffffff);
        border-radius: 6px;
        box-shadow: -4px -4px 10px -8px #ffffff, 4px 4px 10px -8px rgba(0, 0, 0, 0.3);
        padding: 8px 16px;
        font-size: 1rem;
        color: #7c7a8b;
        letter-spacing: 0.5px;
        &:active {
            box-shadow: -4px -4px 10px -8px #ffffff inset, 4px 4px 10px -8px rgba(0, 0, 0, 0.3) inset;
        }
    }

    > button + button {
        margin-left: 1.5rem;
    }

    > button:nth-child(odd) {
        background: linear-gradient(135deg, #e1cec9 0%, #f1e6e3 80%);
    }
    > button:nth-child(even) {
        background: linear-gradient(135deg, #d0e5f2 0%, #daeaf5 80%);
    }
}
</style>
