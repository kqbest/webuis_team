<template>
  <section class="whiteLexicon">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="部位分类:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="form.treeValue" change-on-select @change="treeArea(array.treeOptions,form.treeValue[form.treeValue.length-1])"></el-cascader>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="queryData(true)">查询</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>模板设置</el-breadcrumb-item>
          <el-breadcrumb-item>书写词库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            书写词库共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <section class="main">
      <el-table v-scroll='queryData' :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" align="center" width="150">
          <template scope="scope">
            <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.wordBaseID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.wordBaseID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="书写词库" prop="wordBaseName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="词库类别" prop="wordBaseGroupNmae" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查项目" prop="examineItemName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="父类编码" prop="parentID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="父类名称" prop="parentName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="150">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.wordBaseID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="28%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查类型:" prop="examineType">
                <span>{{ popupForm.examineType }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="父类编码:" prop="treeID">
                <span>{{ popupForm.treeID }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="父类名称:" prop="treeName">
                <span>{{ popupForm.treeName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="词库类别:" prop="wordBaseGroup">
                <el-select v-model="popupForm.wordBaseGroup" clearable placeholder="请选择">
                  <el-option v-for="item in array.wordBaseGroupList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="检查项目:" prop="examineItem">
                <el-select v-model="popupForm.examineItem" multiple placeholder="请选择">
                  <el-option v-for="item in array.examineItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="书写词库:" prop="wordBaseName" required>
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="popupForm.wordBaseName"></el-input>
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
      form: {
        treeValue: []
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        examineType: '',
        parentID: '',
        wordBaseGroup: '',
        examineItem: [],
        wordBaseName: '',
        wordBaseID: ''
      },
      rules: {
        wordBaseName: [
          {required: true, message: '请输入书写词库',trgger: 'blur'}
        ]      
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
        wordBaseGroupList: [],//词库类别数据
        examineItemList: []//检查项目数据
      },
      obj: {
        treeProps:{
          value: 'treeID',   
          label: 'treeName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          departmentID: '',
          examineType: '',
          treeParentID: ''
        }
      },
      other: {
        totalCount: '',
        pageStart: '0',
        title: '新建',
        isAdd: true,
        isFirst: true //判断是否是初次加载树形，如果是给treeValue添加默认值
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
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysWordBasefindTree).then(data => {
        let res = data.returnContent;
        this.array.treeOptions = res || [];
        //默认选中第一个
        if(this.array.treeOptions.length > 0){
          if(this.other.isFirst){
            this.form.treeValue.push(this.array.treeOptions[0].treeID);
            this.other.isFirst = false;
            let len = this.form.treeValue.length;
            this.treeArea(this.array.treeOptions,this.form.treeValue[len-1]);
            this.queryData(true);
          }
        }
      });
    },
    //查询数据
    queryData(can) {
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysWordBasefindPage,{
        params: {
          examineType: this.obj.tableParms.examineType,
          parentID: this.obj.tableParms.treeParentID,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysWordBaseList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysWordBaseinsertReady,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          examineType: this.obj.tableParms.examineType
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.wordBaseGroupList = res.wordBaseGroupList;
        this.array.examineItemList = res.examineItemList;
        this.popupForm.hospitalID = this.obj.tableParms.hospitalID;
        this.popupForm.departmentID = this.obj.tableParms.departmentID;
        this.popupForm.examineType = this.obj.tableParms.examineType;
        this.popupForm.parentID = this.obj.tableParms.treeParentID;
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //新建保存
    addInfoSave(type) {
      this.$http.get(this.$location.sysWordBaseinsert,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          examineType: this.popupForm.examineType,
          parentID: this.popupForm.parentID,
          wordBaseGroup: this.popupForm.wordBaseGroup,
          examineItem: this.popupForm.examineItem.join(','),
          wordBaseName: this.popupForm.wordBaseName
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
      //判断是 保存/保存并新建
      if(type == '1'){
        this.popupForm.wordBaseName = '';
      }else{
        //清空弹框数据
        this.resetForm('popupForm');
        this.array.wordBaseGroupList = [];
        this.array.examineItemList = [];
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(wordBaseID) {
      this.$http.get(this.$location.sysWordBaseupdateQuery,{
        params: {
          wordBaseID: wordBaseID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.wordBaseGroupList = res.wordBaseGroupList;
        this.array.examineItemList = res.examineItemList;
        let info = res.sysWordBase;
        this.popupForm.hospitalID = info.hospitalID;
        this.popupForm.departmentID = info.departmentID;
        this.popupForm.examineType = info.examineType;
        this.popupForm.parentID = info.parentID;
        this.popupForm.wordBaseID = info.wordBaseID;
        this.popupForm.wordBaseGroup = info.wordBaseGroup;
        this.popupForm.wordBaseName = info.wordBaseName;
        console.log(info.examineItem);
        this.popupForm.examineItem = info.examineItem.split(',');
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysWordBaseupdate,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          examineType: this.popupForm.examineType,
          parentID: this.popupForm.parentID,
          wordBaseGroup: this.popupForm.wordBaseGroup,
          examineItem: this.popupForm.examineItem.join(','),
          wordBaseName: this.popupForm.wordBaseName,
          wordBaseID: this.popupForm.wordBaseID
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
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.wordBaseGroupList = [];
      this.array.examineItemList = [];
      this.alert.popupVisible = false;
    },
    //启用状态
    enabledState(wordBaseID,state) {
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
        this.$http.get(this.$location.sysWordBaseupdateState,{
          params: {
            wordBaseID: wordBaseID,
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
    deleted(wordBaseID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysWordBasedelete,{
          params: {
            wordBaseID: wordBaseID
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
    //递归取数据
    treeArea(dataList,thisId) {
      if(dataList.length > 0){
        if(thisId == undefined){
          return false;
        }
        dataList.forEach((k, i) => {
          if(k.treeID == thisId){
            console.log('success');
            this.obj.tableParms.hospitalID = k.hospitalID;
            this.obj.tableParms.departmentID = k.departmentID;
            this.obj.tableParms.examineType = k.examineType;
            if (k.treeParentID == '-1') {
              k.treeParentID = '0';
            }
            this.obj.tableParms.treeParentID = k.treeParentID;
            this.popupForm.treeID = k.treeID;
            this.popupForm.treeName = k.treeName;
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
    },
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.djArr = [];
      this.alert.popupVisible = false;
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style lang='less'>
.whiteLexicon {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    border: 1px solid green;
    .el-table {
      flex-grow: 1;
      .el-table__header{
        width: 100%!important;
      }
      .el-table__empty-block{
        width: 100%!important;
      }
      .el-button{
        margin-left: 0;
      }
      .this_enable{
        color: green;
        cursor: pointer;
      }
    }
  }
  .popup{
    .tree{
      display: inline-block;
      width: 100%;
      height: 200px;
      border: 1px solid #d1dbe5;
      overflow: auto;
      .el-tree{
        border: none;
      }
    }
  }
}
</style>
