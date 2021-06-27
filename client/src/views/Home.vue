<template>
    <section>
        <div class="text-h4 font-weight-bold mb-5 title">檔案版本控制</div>
        <v-file-input show-size label="File input" @change="selectFile"></v-file-input>
        <v-btn color="blue-grey mb-16" class="ma-2 white--text" @click="imageUpload">
            Upload
            <v-icon right dark>
                mdi-cloud-upload
            </v-icon>
        </v-btn>
        <v-simple-table sort-by="calories" class="elevation-1 text-subtitle-1">
            <!-- <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="imageEdit(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="imageDelete(item)">
                    mdi-delete
                </v-icon>
            </template> -->
            <template v-slot:default>
                <thead>
                    <tr>
                        <th class="text-center" v-for="item in headers" :key="item.text">
                            {{ item.text }}
                        </th>
                    </tr>
                </thead>
                <!-- { text: '檔案大小 (kB)', value: 'size' },
                { text: '檔案類型', value: 'type' },
                { text: '更新日期', value: 'dateUpdated' },
                { text: '上傳日期', value: 'dateUpload' },
                { text: 'Actions', value: 'actions', sortable: false }, -->
                <tbody>
                    <tr v-for="item in fileList" :key="item._id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.size / 1000 }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.dateUpdated }}</td>
                        <td>
                            {{ moment(item.dateUpload).format('YYYY-MM-DD HH:mm:ss') }}
                        </td>
                        <td>
                            <v-icon small class="mr-2" @click="imageDownload(item)">
                                mdi-download
                            </v-icon>
                            <v-icon small class="mr-2" @click="imageEdit(item)">
                                mdi-pencil
                            </v-icon>
                            <v-icon small @click="imageDelete(item)">
                                mdi-delete
                            </v-icon>
                        </td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <!-- 訊息條 -->
        <v-snackbar v-model="messageStatus" :timeout="5000">
            {{ messageText }}

            <template v-slot:action="{ attrs }">
                <v-btn color="blue" text v-bind="attrs" @click="messageStatus = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </section>
</template>
<script>
import moment from 'moment'
export default {
    name: 'Home',
    props: {
        page: {
            type: String,
            default: '1',
        },
    },
    data() {
        return {
            moment: moment, //時間格式化套件
            headers: [
                {
                    text: '檔案名稱',
                    align: 'start',
                    sortable: false,
                    value: 'name',
                },
                { text: '檔案大小 (kB)', value: 'size' },
                { text: '檔案類型', value: 'type' },
                { text: '更新日期', value: 'dateUpdated' },
                { text: '上傳日期', value: 'dateUpload' },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            fileList: [],
            file: {
                name: '', //檔名
                type: '', //檔案類型
                size: 0, //檔案大小
            }, //選擇的檔案
            imgUrl: null,

            //訊息條
            messageStatus: false,
            messageText: '',
        }
    },
    methods: {
        //選擇上傳檔案時觸發
        selectFile(file) {
            console.log(file)
            this.file = file
        },
        imageUpload() {
            let status = false
            let formData = new FormData()
            formData.append('file', this.file)
            this.$http
                .post('/imageUpload', formData, {
                    'Content-Type': 'multipart/form-data',
                })
                .then((res) => {
                    status = res.data.status
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    this.messageStatus = true
                    this.messageText = status ? '上傳成功' : '上傳失敗'
                    status ? this.imagesList() : null
                })
        },
        //編輯檔案
        imageEdit(file) {
            console.log(file)
        },
        //刪除檔案
        imageDelete(file) {
            console.log(file)
            let status = false
            this.$http
                .delete('/imageDelete', {
                    params: {
                        _id: file._id,
                    },
                })
                .then((res) => {
                    status = res.data.status
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    this.messageStatus = true
                    this.messageText = status ? '刪除成功' : '刪除失敗'
                    status ? this.imagesList() : null
                })
        },
        //下載檔案
        imageDownload(file) {
            this.$http
                .get(`/imageDownload/_id=${file._id}`, { responseType: 'blob' })
                .then((res) => {
                    console.log(res)
                    const a = document.createElement('a')
                    const url = URL.createObjectURL(res.formData)
                    a.download = file.name
                    a.href = url
                    a.click()
                    setTimeout(() => URL.revokeObjectURL(url), 5000)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {})
        },
        initialize(value) {
            console.log(value)
        },

        imagesList(page = 1, limit = 5) {
            this.$http.get(`/imagesList/page=${page}&limit=${limit}`).then((res) => {
                console.log(res)

                this.fileList = res.data.data
                // this.$nextTick(() => {
                // })
                // //將圖片從buffer轉回正常的圖
                // let bytes = new Uint8Array(res.data.data[0].binary.data)
                // let storeData = ''
                // let len = bytes.byteLength
                // for (let i = 0; i < len; i++) {
                //     storeData += String.fromCharCode(bytes[i])
                // }
                // this.imgUrl = 'data:image/png;base64,' + window.btoa(storeData)
            })
        },
    },
    created() {
        this.imagesList(this.page)
    },
}
</script>
<style lang="scss" scoped>
.title {
    color: #7ea2d6;
}
::v-deep .v-data-table-header {
    span {
        color: #7ea2d6;
    }
}
</style>
