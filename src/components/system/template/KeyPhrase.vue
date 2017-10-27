<template>
  <section class="keyPhrase">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="检查类型:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="navForm.treeValue" change-on-select @change="queryData(true)"></el-cascader>
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
          <el-breadcrumb-item>关键短语</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            关键短语共<font class='pub_count'>{{ other.totalCount }}</font>条
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
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.keyWordID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="keyWordID" label="分类编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="keyWordName" label="分类名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentKeyWordID" label="上级编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentKeyWordName" label="上级名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="150">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.keyWordID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="tiny" top="30%" :visible.sync="alert.popupVisible" :before-close="closePopup">
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
              <el-form-item label="短语分类:" prop="keyWordName" required>
                <el-input v-model="popupForm.keyWordName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="父类编码:" prop="parentKeyWordID">
                <span>{{ popupForm.parentKeyWordID }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="父类短语:" prop="parentKeyWordName">
                <span>{{ popupForm.parentKeyWordName }}</span>
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
        treeValue: [],
        hospitalID: '',
        departmentID: '',
        parentKeyWordID: '0',
        examineType: 'US'
      },
      popupForm: {
        examineType: '',
        keyWordName: '',
        parentKeyWordID: '',
        parentKeyWordName: '',
        keyWordID: ''
      },
      rules:{
        keyWordName: [
          {required: true, message: '请输入短语分类名称', trrgger: 'blur'}
        ]
      },
      array: {
        treeOptions: [],//左侧树形数据
        tableData: []//表格数据
      },
      obj: {
        treeProps: {
          value: 'treeName',
          label: 'treeName',
          children: 'childList'
        }
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        isFirst: true,
        title: '新建',
        isAdd: true
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
      this.$http.get(this.$location.sysKeyWordfindTree).then(data => {
        let res = data.returnContent;
        this.array.treeOptions = res || [];
        //默认选中第一个
        if(this.array.treeOptions.length > 0){
          if(this.other.isFirst){
            this.navForm.treeValue.push(this.array.treeOptions[0].treeName);
            this.other.isFirst = false;
            this.queryData(true);
          }
        }
      });
    },
    //加载列表
    queryData(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      let len = this.navForm.treeValue.length;
      this.$http.get(this.$location.sysKeyWordfindPage,{
        params:{
          examineType: this.navForm.examineType,
          parentKeyWordID: this.navForm.parentKeyWordID,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysKeyWordList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
        this.navForm.hospitalID = res.hospitalID;
        this.navForm.departmentID = res.departmentID;
        this.navForm.parentKeyWordID = res.parentKeyWordID;
        this.navForm.examineType = res.examineType;
      });
    },
    //新建
    addInfo() {
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
      this.popupForm.examineType = this.navForm.examineType;
      this.popupForm.parentKeyWordID = this.navForm.parentKeyWordID;
      this.popupForm.parentKeyWordName = this.navForm.treeValue[this.navForm.treeValue.length-1];
    },
    //新建保存
    addInfoSave(type) {
      this.$http.get(this.$location.sysKeyWordinsert,{
        params: {
          hospitalID: this.navForm.hospitalID,
          departmentID: this.navForm.departmentID,
          examineType: this.popupForm.examineType,
          keyWordName: this.popupForm.keyWordName,
          parentKeyWordID: this.popupForm.parentKeyWordID
        }
      }).then(data => {
        let msg = data.returnContent;
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.queryData(true);
        if (type == '1') {
          this.popupForm.keyWordName = '';
        } else {
          this.resetForm('popupForm');
          this.alert.popupVisible = false;
        }
      });
    },
    //编辑
    editInfo(list) {
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
      this.popupForm.examineType = list.examineType;
      this.popupForm.keyWordName = list.keyWordName;
      this.popupForm.parentKeyWordID = list.parentKeyWordID;
      this.popupForm.parentKeyWordName = list.parentKeyWordName;
      this.popupForm.keyWordID = list.keyWordID;
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysKeyWordupdate,{
        params: {
          hospitalID: this.navForm.hospitalID,
          departmentID: this.navForm.departmentID,
          examineType: this.popupForm.examineType,
          keyWordName: this.popupForm.keyWordName,
          keyWordID: this.popupForm.keyWordID
        }
      }).then(data => {
        let msg = data.returnContent;
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.queryData(true);
        this.resetForm('popupForm');
        this.alert.popupVisible = false;
      });
    },
    //启用状态
    enabledState(keyWordID,state) {
      let stateName;
      if(state == '0'){
        state = '1';
        stateName = '启用';
      }else if(state == '1'){
        state = '0';
        stateName = '停用';
      }
      this.$confirm(`是否确认${stateName}?`,'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysKeyWordupdateState,{
          params: {
            keyWordID: keyWordID,
            state: state
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
      }).catch(() => {});
    },
    //删除
    deleted(keyWordID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysKeyWorddelete,{
          params: {
            keyWordID: keyWordID
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
      }).catch(() => {});
    },
    //关闭弹框并清空form表单
    closePopup() {
      this.alert.popupVisible = false;
      this.resetForm('popupForm');
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang='less'>
.keyPhrase{
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
    .this_enable{
      color: green;
      cursor: pointer;
    }
  }
}
</style>