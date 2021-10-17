<template>
  <section>
    <!-- <svg viewbox="0 0 1920 1080" id="gitInterface"></svg> -->
    <div class="text-h4 font-weight-bold mb-5 title">檔案版本控制</div>
    <v-file-input
      show-size
      label="File input"
      @change="selectFile"
    ></v-file-input>
    <v-btn color="blue-grey mb-16" class="ma-2 white--text" @click="fileUpload">
      Upload
      <v-icon right dark>
        mdi-cloud-upload
      </v-icon>
    </v-btn>
    <v-simple-table sort-by="calories" class="elevation-1 text-subtitle-1">
      <!-- <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="fileEdit(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="fileDelete(item)">
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
          <tr v-for="item in fileList" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.version }}</td>
            <td>{{ item.size / 1000 }}</td>
            <td>{{ item.type }}</td>
            <td>
              {{ moment(item.dateUpdated).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>
              {{ moment(item.dateUpload).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>
              <v-icon small class="mr-2" @click="fileDownload(item)">
                mdi-download
              </v-icon>

              <v-dialog transition="dialog-top-transition" max-width="600">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    small
                    class="mr-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="fileVersionList(item)"
                  >
                    mdi-format-list-bulleted
                  </v-icon>
                </template>
                <template v-slot:default="dialog">
                  <v-card>
                    <v-toolbar color="primary" dark>檔案版本清單</v-toolbar>
                    <!-- <v-card-text> 123</v-card-text> -->
                    <!-- <v-row class="text-center mt-2">
                      <v-col cols="8">版本</v-col>
                      <v-col cols="4">下載</v-col>
                    </v-row>
                    <v-row class="text-center mt-1" v-for="(file,index) in vsersionList" :key="file._id">
                      <v-col cols="8">{{index}}</v-col>
                      <v-col cols="4">下載</v-col>
                    </v-row> -->
                    <v-simple-table
                      sort-by="calories"
                      class="elevation-1 text-subtitle-1"
                    >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th
                              class="text-center"
                              v-for="file in vsersionListHeaders"
                              :key="file.value"
                            >
                              {{ file.text }}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="file in vsersionList"
                            :key="file._id"
                            class="text-center"
                          >
                            <td>{{ file.version }}</td>
                            <td>{{ file.size / 1000 }}</td>
                            <td>
                              {{
                                moment(file.dateUpload).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )
                              }}
                            </td>
                            <td>
                              <v-icon
                                small
                                class="mr-2"
                                @click="fileDownload(item)"
                              >
                                mdi-download
                              </v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>

                    <v-card-actions class="justify-end">
                      <v-btn text @click="dialog.value = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>

              <v-icon small class="mr-2" @click="fileEdit(item)">
                mdi-pencil
              </v-icon>
              <v-icon small @click="fileDelete(item)">
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
import moment from "moment";
export default {
  name: "Home",
  props: {
    page: {
      type: String,
      default: "1"
    }
  },
  data() {
    return {
      moment: moment, //時間格式化套件
      headers: [
        {
          text: "檔案名稱",
          align: "start",
          sortable: false,
          value: "name"
        },
        { text: "版本號", value: "version" },
        { text: "檔案大小 (kB)", value: "size" },
        { text: "檔案類型", value: "type" },
        { text: "更新日期", value: "dateUpdated" },
        { text: "上傳日期", value: "dateUpload" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      fileList: [],
      file: {
        name: "", //檔名
        type: "", //檔案類型
        size: 0 //檔案大小
      }, //選擇的檔案
      imgUrl: null,

      //訊息條
      messageStatus: false,
      messageText: "",

      //版本清單
      vsersionList: [],
      vsersionListHeaders: [
        {
          text: "版本",
          align: "start",
          sortable: false,
          value: "version"
        },
        { text: "檔案大小 (kB)", value: "size" },
        {
          text: "日期",
          value: "dateUpload"
        },
        { text: "Actions", value: "actions", sortable: false }
      ]
    };
  },
  methods: {
    //選擇上傳檔案時觸發
    selectFile(file) {
      console.log(file);
      this.file = file;
    },
    fileUpload() {
      let status = false;
      let formData = new FormData();
      console.log(this.file);
      formData.append("file", this.file);
      this.$http
        .post("/file/upload", formData, {
          "Content-Type": "multipart/form-data"
        })
        .then(res => {
          status = res.data.status;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.messageStatus = true;
          this.messageText = status ? "上傳成功" : "上傳失敗";
          status ? this.filesList() : null;
        });
    },
    //編輯檔案
    fileEdit(file) {
      console.log(file);
    },
    //刪除檔案
    fileDelete(file) {
      console.log(file);
      let status = false;
      this.$http
        .delete("/file/delete", {
          params: {
            _id: file.id
          }
        })
        .then(res => {
          status = res.data.status;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.messageStatus = true;
          this.messageText = status ? "刪除成功" : "刪除失敗";
          status ? this.filesList() : null;
        });
    },
    //下載檔案
    fileDownload(file) {
      //回傳格式設定為 blob
      this.$http
        .get(`/file/download/_id=${file._id}`, { responseType: "blob" })
        .then(res => {
          console.log(res);
          let a = document.createElement("a");
          let url = URL.createObjectURL(res.data);
          a.download = file.name;
          a.href = url;
          a.click();
          setTimeout(() => {
            URL.revokeObjectURL(url);
            a.remove();
          }, 5000);
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {});
    },
    //搜尋圖片版本清單
    fileVersionList(item) {
      this.$http.get(`/file/vsersionList/name=${item.name}`).then(res => {
        // console.log(res);
        this.vsersionList = res.data.data.map((item, index, thisArray) => {
          let versionLast = thisArray.length; // 最新版

          let version = versionLast - index;
          return {
            ...item,
            version
          };
        });
      });
    },

    initialize(value) {
      console.log(value);
    },

    filesList(page = 1, limit = 5) {
      this.$http.get(`/file/list/page=${page}&limit=${limit}`).then(res => {
        console.log(res);

        this.fileList = res.data.data;
        // this.$nextTick(() => {
        // })
        // //將圖片從buffer轉回正常的圖
        // let bytes = new Uint8Array(res.data.data[0].binary.data)
        // let storeData = ''
        // let len = bytes.byteLength
        // for (let i = 0; i < len; i++) {
        //     storeData += String.fromCharCode(bytes[i])
        // }
        // this.imgUrl = 'data:file/png;base64,' + window.btoa(storeData)
      });
    }
  },
  created() {
    this.filesList(this.page);
  }
};
</script>
<style lang="scss" scoped>
#gitInterface {
  width: 100%;
  min-height: 450px;
  background-color: #ffffff;
}
.title {
  color: #7ea2d6;
}
::v-deep .v-data-table-header {
  span {
    color: #7ea2d6;
  }
}
</style>
