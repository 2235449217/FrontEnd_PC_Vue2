<template>
  <div class="container">
    <ul class="tab-hint">
      <li>成员加入时无法更改您输入的内容，请输入正确的信息</li>
      <li>按输入的联系方式发送邀请；同时输入手机和邮箱，只发送手机邀请</li>
    </ul>
    <el-upload
      drag
      :limit="limitNum"
      :auto-upload="false"
      accept=".xlsx"
      :action="UploadUrl()"
      :on-change="fileChange"
      :on-exceed="exceedFile"
      :on-error="handleError"
      :file-list="fileList"
      class="upload-demo"
    >
      <!-- multiple -->
      <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">选择或拖拽上传文件，单个5MB以内</div>
    </el-upload>
    <a class="template-btn" @click="Download">下载通讯录模板</a>
  </div>
</template>

<script>
import { downloadTemplate, getimportExcel, getUserInfo, loadDeptUser } from '@/api/System/user';
import { downloadFile } from '@/api/file.js';

export default {
  data () {
    return {
      title: '用户',
      personal: {},
      limitNum: 1, // 上传excell时，同时允许上传的最大数
      fileList: [] // excel文件列表
    };
  },
  created() {
    getUserInfo().then(res => {
      this.personal = res.data.userInfo;
    });
  },
  methods: {
    downloadFile,
    // 导入模板
    Download() {
      const data = {
      };
      data.fileName = 'ExcelTemplate.xlsx';
      downloadTemplate(data).then(result => {
        console.log(result);
        this.downloadFile(result, this.title + '数据', 'xlsx');
      });
    },
    // 文件超出个数限制时的钩子
    exceedFile(files, fileList) {
      this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
    },
    // 文件状态改变时的钩子
    fileChange(file, fileList) {
      console.log(file);
      this.fileList.push(file.raw);
      console.log(this.fileList);
      const fd = new FormData();
      fd.append('file', file.raw);
      fd.forEach((key, value) => {
        console.log('key %s: value %s', key, value);
      });
      getimportExcel(fd).then((res) => {
        const data = {
          id: null
        };
        data.id = 7;
        loadDeptUser(data).then(res => {
          console.log(res);
          console.log('导入成功');
        });
      });
    },
    handleError(_err, file, fileList) {
      this.$message.error('文件上传失败');
    },
    UploadUrl: function() {
      console.log('这里进行上传');
      // 因为action参数是必填项，我们使用二次确认进行文件上传时，直接填上传文件的url会因为没有参数导致api报404，所以这里将action设置为一个返回为空的方法就行，避免抛错
      return '';
    },
    uploadFile() {
      if (this.fileList.length === 0) {
        this.$message.warning('请上传文件');
      } else {
        const form = new FormData();
        form.append('file', this.fileList);
        this.$axios({
          method: 'post',
          url: '/statistical/uploadbug',
          headers: {
            'Content-type': 'multipart/form-data'
          },
          data: form
        }).then(
          res => {

          }).catch(_err => {

        });
      }
    }

  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/color.scss';

  ::v-deep .container{
    width: 100%;
    height: 458px;
  }
   .tab-hint{

      padding-left: 15px;
      li{
        color: #939393;
        font-size: 12px;
        text-align:left;
      }
    }

    ::v-deep .upload-demo {
      .el-upload__tip{
           color: #91a1b7;
        }
      .el-upload{
          width: 520px;
        .el-upload-dragger{
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content:center;
          border: 1px solid #ddd;
          width: 520px;
          height: 323px;
          .el-upload__text{
            color: #91a1b7;
            border: 1px dashed $address_btn_color;
            width: 328px;
            height: 38px;
            line-height:38px;
            background-color: rgb(230, 247, 246);
      }

    }
  }

}
.template-btn{
  cursor: pointer;
  margin-top:12px;
  display:block;
  // text-decoration: none;
  color: $address_btn_color;
  }
</style>
