<template>
  <section class="systemParameters">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="参数代码:" prop="code">
              <el-input v-model="navForm.code" placeholder="请输入参数代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="参数名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="queryData(true)">查询</el-button>
          <el-button class="mlem" @click="resetForm('navForm')">重置</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>系统参数</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            系统参数共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.sysParaID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sysParaID" label="序号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraCode" label="参数代码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraName" label="参数名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraValue" label="参数值" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraDesc" label="参数说明" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog title="编辑" size="tiny" top="30%" :visible.sync="alert.formVisible">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数代码:" prop="paraCode">
                <span>{{ popupForm.paraCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数名称:" prop="paraName">
                <span>{{ popupForm.paraName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数值:" prop="paraValue" required>
                <el-input type="text" v-model="popupForm.paraValue"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数说明:" prop="paraDesc">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="popupForm.paraDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="editInfoSave">保 存</el-button>
          <el-button @click="alert.formVisible = false;resetForm('popupForm');">取 消</el-button>
        </div>
      </el-dialog>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      navForm: {
        code: '',
        name: ''
      },
      popupForm: {
        sysParaID: '',
        paraCode: '',
        paraName: '',
        paraValue: '',
        paraDesc: ''
      },
      array: {
        tableData: []//表格数据
      },
      obj: {
        
      },
      other: {
        pageStart: 0,
        totalCount: 0
      },
      alert: {
        formVisible: false
      }
    }
  },
  computed: {
  },
  created() {
    this.queryData(true);
  },
  methods: {
    //加载列表
    queryData(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      this.$http.get(this.$location.sysParafindPage,{
        params:{
          paraCode: this.navForm.code,
          paraName: this.navForm.name,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysParaList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //编辑
    editInfo(sysParaID) {
      this.$http.get(this.$location.sysParaupdateQuery,{
        params: {
          sysParaID: sysParaID
        }
      }).then(data => {
        let res = data.returnContent;
        this.popupForm.sysParaID = sysParaID;
        this.popupForm.paraCode = res.sysPara.paraCode;
        this.popupForm.paraName = res.sysPara.paraName;
        this.popupForm.paraValue = res.sysPara.paraValue;
        this.popupForm.paraDesc = res.sysPara.paraDesc;
        this.alert.formVisible = true;
      });
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysParaupdate,{
        params: {
          sysParaID: this.popupForm.sysParaID,
          paraCode: this.popupForm.paraCode,
          paraName: this.popupForm.paraName,
          paraValue: this.popupForm.paraValue,
          paraDesc: this.popupForm.paraDesc
        }
      }).then(data => {
        let message = data.returnContent;
        this.$message({
          type: 'success',
          message: message,
          duration: 1000
        });
        this.queryData(true);
      });
      this.alert.formVisible = false;
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang='less'>
.systemParameters{
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  .this_table{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding-bottom: 20px;
    .el-table{
      flex-grow: 1;
      .el-button{
        margin-left: 0;
      }
      .el-table__header{
        width: 100%!important;
      }
      .el-table__empty-block{
        width: 100%!important;
      }
    }
  }
}
</style>