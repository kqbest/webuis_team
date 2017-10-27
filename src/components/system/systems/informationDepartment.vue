<template>
  <section class="informationDepartment">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="菜单目录:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="navForm.treeValue" change-on-select @change="treeArea(array.treeOptions,navForm.treeValue[navForm.treeValue.length-1])"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="字典名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入字典名称"></el-input>
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
        <el-table-column prop="depTypeID" label="字典内码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depTypeGroupName" label="字典分组" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depTypeCode" label="字典代码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depTypeName" label="字典名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depTypeParent" label="父字典代码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="depTypeParentName" label="父字典名称" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog title="编辑" size="small" top="25%" :visible.sync="alert.formVisible">
        <el-form :model="popupForm" ref="popupForm" class="demo-ruleForm">
          <el-row>
            <el-col :span="12">
              <span>字典标识:</span>
              <span>{{ popupForm.depTypeCode }}</span>
            </el-col>
            <el-col :span="12">
              <span>字典名称:</span>
              <span>{{ popupForm.depTypeName }}</span>
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
                  <el-button size="mini" :plain="true" type="success" icon="edit" @click="pop_editInfo(scope.row.depDataDicValueID)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
                  <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.depDataDicValueID)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="depDataDicValueCode" label="选项代码" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="depDataDicValueName" label="选项名称" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column prop="depDataDicParentName" label="选项父类" align="center" show-overflow-tooltip></el-table-column>
            <el-table-column label="启用状态" align="center">
              <template scope="scope">
                <span class="this_enable" @click="enabledState(scope.row.depDataDicValueID,scope.row.state)">{{ scope.row.stateName }}</span>
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
          <el-row>
            <el-col :span="22">
              <el-form-item label="选项父类:" prop="parent" required>
                <el-select v-model="formAdd.parent" placeholder="请选择">
                  <el-option v-for="item in array.parentData" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
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
        treeValue: [],
        name: ''
      },
      popupForm: {
        depTypeID: '',
        depTypeCode: '',
        depTypeName: '',
        depTypeParent: ''
      },
      formAdd: {
        code: '',
        name: '',
        parent: '',
        depDataDicValueID: ''
      },
      array: {
        treeOptions: [],//树形选中数据
        tableData: [],//表格数据
        pop_tableData: [],//弹框-表格数据
        parentData: []//弹框-父类下拉数据
      },
      obj: {
        treeProps:{
          value: 'depID',
          label: 'depName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          departmentID: '',
          depTypeName: ''
        },
        dataList: ''
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        pop_pageStart: 0,
        pop_totalCount: 0,
        title: '新增',
        isAdd: true,
        isFirst: true
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
    this.findTree();
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysDepDataDicfindTree).then(data => {
        let res = data.returnContent;
        this.array.treeOptions = res || [];
        //默认选中第一个
        if(this.array.treeOptions.length > 0){
          if(this.other.isFirst){
            this.navForm.treeValue.push(this.array.treeOptions[0].depID);
            this.other.isFirst = false;
            let len = this.navForm.treeValue.length;
            this.treeArea(this.array.treeOptions,this.navForm.treeValue[len-1]);
            this.findPage(true);
          }
        }
      });
    },
    //加载列表
    findPage(can) {
      if (true) {}
      can?this.other.pageStart=0:this.other.pageStart++;
      this.$http.get(this.$location.sysDepDataDicfindPage,{
        params:{
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depTypeName: this.navForm.name,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysDepDataDicList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //编辑
    editInfo(dataList) {
      this.popupForm.depTypeID = dataList.depTypeID;
      this.popupForm.depTypeCode = dataList.depTypeCode;
      this.popupForm.depTypeName = dataList.depTypeName;
      this.popupForm.depTypeParent = dataList.depTypeParent;
      this.obj.dataList = dataList;
      this.$http.get(this.$location.sysDepDataDicfindMxPage,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depTypeID: this.popupForm.depTypeID,
          depTypeCode: this.popupForm.depTypeCode,
          depTypeName: this.popupForm.depTypeName,
          depTypeParent: this.popupForm.depTypeParent,
          pageStart: this.other.pop_pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.pop_totalCount = res.totalCount;
        this.array.pop_tableData = res.sysDepDataDicList || [];
      });
      this.alert.formVisible = true;
    },
    //新建
    addInfo() {
      this.other.title = '新建';
      this.other.isAdd = true;
      this.formAdd.code = '';
      this.formAdd.name = '';
      this.formAdd.dataDicValueID = '';
      this.alert.formAddVisible = true;
      this.$http.get(this.$location.sysDepDataDicinsertReady,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depTypeParent: this.popupForm.depTypeParent
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.parentData = res;
      });
    },
    //新建保存
    addInfoSave() {
      this.$http.get(this.$location.sysDepDataDicinsert,{
        params: {
          depTypeID: this.popupForm.depTypeID,
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depDataDicValueCode: this.formAdd.code,
          depDataDicValueName: this.formAdd.name,
          depDataDicParent: this.formAdd.parent
        }
      }).then(data => {
        let message = data.returnContent;
        this.$message({
            type: 'success',
            message: message,
            duration: 1000
        });
        this.editInfo(this.obj.dataList);
      });
      this.alert.formAddVisible = false;
    },
    //弹框-编辑
    pop_editInfo(depDataDicValueID) {
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.formAddVisible = true;
      this.formAdd.depDataDicValueID = depDataDicValueID;
      this.$http.get(this.$location.sysDepDataDicupdateQuery,{
        params: {
          depDataDicValueID: depDataDicValueID,
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depTypeParent: this.popupForm.depTypeParent
        }
      }).then(data => {
        let info = data.returnContent.sysDepDataDic;
        this.formAdd.code = info.depDataDicValueCode;
        this.formAdd.name = info.depDataDicValueName;
        this.formAdd.parent = info.depDataDicParent;
      });
    },
    //弹框-编辑保存
    pop_editInfoSave() {
      this.other.title = '编辑';
      this.alert.formAddVisible = false;
      this.$http.get(this.$location.sysDepDataDicupdate,{
        params: {
          depDataDicValueID: this.formAdd.depDataDicValueID,
          depTypeID: this.popupForm.depTypeID,
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          depDataDicValueCode: this.formAdd.code,
          depDataDicValueName: this.formAdd.name,
          depDataDicParent: this.formAdd.parent
        }
      }).then(data => {
        let message = data.returnContent;
        this.$message({
          type: 'success',
          message: message,
          duration: 1000
        });
        this.editInfo(this.obj.dataList);
      });
    },
    //启用状态
    enabledState(depDataDicValueID,state) {
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
        this.$http.get(this.$location.sysDepDataDicupdateState, {
          params: {
            depDataDicValueID: depDataDicValueID,
            state: state
          }
        }).then(data => {
          let message = data.returnContent;
          this.$message({
            type: 'success',
            message: message,
            duration: 1000
          });
          this.editInfo(this.obj.dataList);
        });
      }).catch(() => {});
    },
    //删除
    deleted(depDataDicValueID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysDepDataDicdelete, {
          params: {
            depDataDicValueID: depDataDicValueID
          }
        }).then(data => {
          let message = data.returnContent;
          this.$message({
            type: 'success',
            message: message,
            duration: 1000
          });
          this.editInfo(this.obj.dataList);
        });
      }).catch(() => {});
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //递归取数据
    treeArea(dataList,thisId) {
      if(dataList.length > 0){
        if(thisId == undefined){
          return false;
        }
        dataList.forEach((k, i) => {
          if(k.depID == thisId){
            console.log('success');
            this.obj.tableParms.hospitalID = k.hospitalID;
            this.obj.tableParms.departmentID = k.depID;
            return false;
          }else{
            if(k.childList.length > 0){
              this.treeArea(k.childList,thisId);
              console.log('go');
            }else{
              console.log('end');
              return false;
            }
          }
        })
      }
    }
  }
}
</script>

<style lang='less'>
.informationDepartment{
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