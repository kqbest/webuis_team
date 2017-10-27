<template>
  <section class="commonSymbols">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="检查类型:" prop="examineType">
              <el-select v-model="navForm.examineType" placeholder="请选择" clearable>
                <el-option v-for="item in array.examineTypeList" :value="item.treeName" :label="item.treeName" :key="item.treeID"></el-option>
              </el-select>
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
          <el-breadcrumb-item>模板设置</el-breadcrumb-item>
          <el-breadcrumb-item>常用符号</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            常用符号共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.signID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="signID" label="符号编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="signName" label="符号名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examineType" label="符号类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.signID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="tiny" top="35%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="90px" :rules="rules">
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查类型:" prop="examineType">
                <span>{{ popupForm.examineType }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="符号名称:" prop="signName">
                <el-input v-model="popupForm.signName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" v-show="other.isAdd" @click="submitForm('popupForm',addInfoSave)">保 存</el-button>
          <el-button type="primary" v-show="!other.isAdd" @click="submitForm('popupForm',editInfoSave)">保 存</el-button>
          <el-button type="primary" v-show="other.isAdd" @click="submitForm('popupForm',addInfoSave('1'))">保存并新建</el-button>
          <el-button @click="closePopup">取 消</el-button>
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
        examineType: ''
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        examineType: '',
        signID: '',
        signName: ''
      },
      rules: {
        signName: [
          { required: true, message: '请输入符号名称', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      array: {
        examineTypeList: [],//左侧树形数据
        tableData: []//表格数据
      },
      obj: {
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        isAdd: true,
        title: '新建'
      },
      alert: {
        popupVisible: false
      }
    }
  },
  computed: {
  },
  created() {
    this.findTree();
  },
  methods: {
    //加载左侧树形
    findTree() {
      this.$http.get(this.$location.sysCommonSignfindTree).then(data => {
        let res = data.returnContent;
        this.array.examineTypeList = res || [];
        this.navForm.examineType = res[0].treeName;
        this.queryData(true);
      });
      console.log(this.$location.sysCommonSignfindTree);
    },
    //加载列表
    queryData(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      this.$http.get(this.$location.sysCommonSignfindPage,{
        params:{
          examineType: this.navForm.examineType,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let list = data.returnContent.sysCommonSignList;
        this.other.totalCount = data.returnContent.totalCount;
        this.popupForm.hospitalID = data.returnContent.hospitalID;
        this.popupForm.departmentID = data.returnContent.departmentID;
        if (can) {
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.other.isAdd = true;
      this.other.title = '新建';
      this.popupForm.examineType = this.navForm.examineType;
      this.alert.popupVisible = true;
    },
    //新建保存
    addInfoSave(type) {
      this.$http.get(this.$location.sysCommonSigninsert,{
        params:{
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          examineType: this.popupForm.examineType,
          signName: this.popupForm.signName
        }
      }).then(data => {
        let msg = data.returnContent;
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.queryData(true);
      });
      if (type == '1') {
        this.popupForm.signName = '';
      }else{
        this.resetForm('popupForm');
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(list) {
      this.other.isAdd = false;
      this.other.title = '编辑';
      this.popupForm.examineType = this.navForm.examineType;
      this.popupForm.signID = list.signID;
      this.popupForm.signName = list.signName;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysCommonSignupdate,{
        params:{
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          examineType: this.popupForm.examineType,
          signName: this.popupForm.signName,
          signID: this.popupForm.signID
        }
      }).then(data => {
        let msg = data.returnContent;
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.queryData(true);
      });
      this.resetForm('popupForm');
      this.alert.popupVisible = false;
    },
    //启用状态
    enabledState(signID,state) {
      let stateName;
      if(state == '0'){
        state = '1';
        stateName = '启用';
      }else if(state == '1'){
        state = '0';
        stateName = '停用';
      }
      this.$confirm(`是否确认${stateName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysCommonSignupdateState, {
          params: {
            signID: signID,
            state: state
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
      }).catch(() => {});
    },
    //删除
    deleted(signID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysCommonSigndelete, {
          params: {
            signID: signID
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
      }).catch(() => {});
    },
    //清除弹框form
    closePopup() {
      this.alert.popupVisible = false;
      this.resetForm('popupForm');
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='less'>
.commonSymbols{
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
  .this_enable{
    color: green;
    cursor: pointer;
  }
}
</style>