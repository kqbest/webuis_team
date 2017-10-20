<template>
  <section class="informationSystem">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="字典名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="操作类型:" prop="type">
              <el-select v-model="navForm.type" placeholder="请选择">
                <el-option v-for="item in obj.selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="findPage(true)">查询</el-button>
          <el-button class="mlem" @click="resetForm('navForm')">重置</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>系统字典</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" @click="findPage">刷新</el-button>
        <span class="mlem">
            系统字典共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="findPage" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="dataDicID" label="序号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dataDicCode" label="字典标识" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dataDicName" label="字典名称" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog title="编辑" size="small" top="25%" :visible.sync="alert.formVisible">
        <el-form :model="popupForm" ref="popupForm" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <span>字典标识:</span>
              <span>{{ popupForm.dataDicCode }}</span>
            </el-col>
            <el-col :span="12">
              <span>字典名称:</span>
              <span>{{ popupForm.dataDicName }}</span>
            </el-col>
          </el-row>
          <hr class="hr">
          <el-row>
            <el-col :span="24">
              <p class="listCount">
                <span>选项列表 (<font class='pub_count'>{{ other.pop_totalCount }}</font>)</span>
                <el-button type="primary" size="mini" @click="addInfo">新建</el-button>
              </p>
            </el-col>
          </el-row>
          <el-table :data="array.pop_tableData" stripe border height="300">
            <el-table-column label="操作" width="100" align="center">
              <template scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
                  <el-button size="mini" :plain="true" type="success" icon="edit" @click="pop_editInfo(scope.row.dataDicValueID)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
                  <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.dataDicValueID)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="dataDicValueCode" label="选项代码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dataDicValueName" label="选项名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="启用状态" align="center">
              <template scope="scope">
                <span class="this_enable" @click="enabledState(scope.row.dataDicValueID,scope.row.state)">{{ scope.row.stateName }}</span>
              </template>
            </el-table-column>           
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="alert.formVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </section>
    <!-- 新增 -->
    <section class="this_add">
      <el-dialog :title="other.title" size="tiny" top="30%" :visible.sync="alert.formAddVisible">
        <el-form :model="formAdd" ref="formAdd" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="22">
              <el-form-item label="选项代码:" prop="code" required>
                <el-input type="text" v-model="formAdd.code" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="选项名称:" prop="name" required>
                <el-input type="text" v-model="formAdd.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" v-show="other.isAdd" @click="addInfoSave();">保 存</el-button>
          <el-button type="primary" v-show="!other.isAdd" @click="pop_editInfoSave();">保 存</el-button>
          <el-button @click="alert.formAddVisible = false;resetForm('formAdd');">取 消</el-button>
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
        name: '',
        type: '1'
      },
      popupForm: {
        dataDicID: '',
        dataDicCode: '',
        dataDicName: ''
      },
      formAdd: {
        code: '',
        name: '',
        dataDicValueID: ''
      },
      array: {
        tableData: [],//表格数据
        pop_tableData: []//弹框-表格数据
      },
      obj: {
        selectOptions: [{
          value: '',
          label: '全部'
        },{
          value: '1',
          label: '可操作'
        },{
          value: '0',
          label: '不可操作'
        }],
        dataList: ''
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        pop_pageStart: 0,
        pop_totalCount: 0,
        title: '新增',
        isAdd: true
      },
      alert: {
        formVisible: false,
        formAddVisible: false
      }
    }
  },
  computed: {
  },
  created() {
    this.findPage(true);
  },
  methods: {
    //加载列表
    findPage(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      this.$http.get(this.$location.sysDataDicfindPage,{
        params:{
          dataDicName: this.navForm.name,
          pageStart: this.other.pageStart,
          operateFlag: this.navForm.type
        }
      }).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.other.totalCount = res.totalCount;
          let list = res.sysDataDicList;
          if(can){
            this.array.tableData = list || [];
          }else{
            this.array.tableData.push(...list);
          }
        }
      });
    },
    //编辑
    editInfo(dataList) {
      this.popupForm.dataDicID = dataList.dataDicID;
      this.popupForm.dataDicCode = dataList.dataDicCode;
      this.popupForm.dataDicName = dataList.dataDicName;
      this.obj.dataList = dataList;
      this.$http.get(this.$location.sysDataDicfindMxPage,{
        params: {
          dataDicID: this.popupForm.dataDicID,
          dataDicCode: this.popupForm.dataDicCode,
          dataDicName: this.popupForm.dataDicName,
          pageStart: this.other.pop_pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.other.pop_totalCount = res.totalCount;
          this.array.pop_tableData = res.sysDataDicList || [];
        }
      });
      this.alert.formVisible = true;
    },
    //启用状态
    enabledState(dataDicValueID,state) {
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
        this.$http.get(this.$location.sysDataDicupdateState, {
          params: {
            dataDicValueID: dataDicValueID,
            state: state
          }
        }).then(data => {
          let message = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: message,
              duration: 1000
            });
            this.editInfo(this.obj.dataList);
          }
        });
      }).catch(() => {});
    },
    //删除
    deleted(dataDicValueID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysDataDicdelete, {
          params: {
            dataDicValueID: dataDicValueID
          }
        }).then(data => {
          let message = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: message,
              duration: 1000
            });
            this.editInfo(this.obj.dataList);
          }
        });
      }).catch(() => {});
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //新建
    addInfo() {
      this.other.title = '新建';
      this.other.isAdd = true;
      this.formAdd.code = '';
      this.formAdd.name = '';
      this.formAdd.dataDicValueID = '';
      this.alert.formAddVisible = true;
    },
    //新建保存
    addInfoSave() {
      this.$http.get(this.$location.sysDataDicinsert,{
        params: {
          dataDicID: this.popupForm.dataDicID,
          dataDicValueCode: this.formAdd.code,
          dataDicValueName: this.formAdd.name
        }
      }).then(data => {
        let message = data.returnContent;
        if(data.returnCode == '1'){
          this.$message({
              type: 'success',
              message: message,
              duration: 1000
          });
          this.editInfo(this.obj.dataList);
        }
      });
      this.alert.formAddVisible = false;
    },
    //弹框-编辑
    pop_editInfo(dataDicValueID) {
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.$http.get(this.$location.sysDataDicupdateQuery,{
        params: {
          dataDicValueID: dataDicValueID
        }
      }).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.formAdd.code = res.dataDicValueCode;
          this.formAdd.name = res.dataDicValueName;
          this.formAdd.dataDicValueID = res.dataDicValueID;
        }
      });
      this.alert.formAddVisible = true;
    },
    //弹框-编辑保存
    pop_editInfoSave() {
      this.other.title = '编辑';
      this.$http.get(this.$location.sysDataDicupdate,{
        params: {
          dataDicID: this.popupForm.dataDicID,
          dataDicValueID: this.formAdd.dataDicValueID,
          dataDicValueCode: this.formAdd.code,
          dataDicValueName: this.formAdd.name
        }
      }).then(data => {
        let message = data.returnContent;
        if (data.returnCode == '1') {
          this.$message({
            type: 'success',
            message: message,
            duration: 1000
          });
          this.editInfo(this.obj.dataList);
        }
      });
      this.alert.formAddVisible = false;
    }
  }
}
</script>

<style lang='less'>
.informationSystem{
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
  .this_popup{
    .el-dialog__body{
      padding: 30px 80px;
      .hr{
        margin: 10px 0;
        border: none;
        border-top: 1px solid #d1e5da;
      }
      .listCount{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .el-table{
        .el-button{
          margin-left: 0;
        }
        .this_enable{
          color: green;
          cursor: pointer;
        }
      }
    }
  }
}
</style>