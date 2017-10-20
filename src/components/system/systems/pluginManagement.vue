<template>
  <section class="pluginManagement">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="地区目录:" prop="treeValue">
              <el-cascader :props="treeProps" :options="treeOptions" v-model="navForm.treeValue" change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="地区名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入地区名称"></el-input>
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
          <el-breadcrumb-item>地区管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo()">新建</el-button>
        <el-button class="mlem" @click="findPage">刷新</el-button>
        <span class="mlem">
            地区管理共<font class='pub_count'>{{ totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table :data="tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="alert.formEditVisible = true;editInfo(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.areaID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="areaCode" label="地区代码" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="areaName" label="地区名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentCode" label="上级地区代码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentName" label="上级地区名称" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 新增 -->
    <section class="this_add">
      <el-dialog title="新增" size="tiny" top="30%" :visible.sync="alert.formAddVisible" :before-close="addClose">
        <el-form :model="formAdd" ref="formAdd" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="22">
              <el-form-item label="地区代码:" prop="code" required>
                <el-input type="text" v-model="formAdd.code" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="地区名称:" prop="name" required>
                <el-input type="text" v-model="formAdd.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="上级地区代码:" prop="pCode">
                <el-input type="text" v-model="formAdd.pCode" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="上级地区名称:" prop="pName">
                <el-input type="text" v-model="formAdd.pName" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="alert.formAddVisible = false;addInfoSave();">保 存</el-button>
          <el-button type="primary" @click="addInfoSave('1');">保存并新建</el-button>
          <el-button @click="alert.formAddVisible = false;resetForm('formAdd');">取 消</el-button>
        </div>
      </el-dialog>
    </section>
    <!-- 编辑 -->
    <section class="this_edit">
      <el-dialog title="编辑" size="tiny" top="30%" :visible.sync="alert.formEditVisible">
        <el-form :model="formEdit" ref="formEdit" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="22">
              <el-form-item label="地区代码:" prop="code" required>
                <el-input type="text" v-model="formEdit.code" auto-complete="off"></el-input>
              </el-form-item>
              </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="地区名称:" prop="name" required>
                <el-input type="text" v-model="formEdit.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="上级地区代码:" prop="pCode">
                <el-input type="text" v-model="formEdit.pCode" auto-complete="off" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="上级地区名称:" prop="pName">
                <el-input type="text" v-model="formEdit.pName" auto-complete="off" disabled></el-input>
          </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="alert.formEditVisible = false;editInfoSave();resetForm('formEdit');">保 存</el-button>
          <el-button @click="alert.formEditVisible = false;resetForm('formEdit');">取 消</el-button>
        </div>
      </el-dialog>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      pageStart: '0',
      totalCount: '0',
      //nav value
      navForm: {
        treeValue: [],
        name: ''
      },
      alert: {
        formAddVisible: false,
        formEditVisible: false
      },
      //nav option
      treeProps: {
        value: 'areaID',
        label: 'areaName',
        children: 'childList'
      },
      treeOptions: [],
      //tableData
      tableData: [],
      formAdd: {
        code: '',
        name: '',
        pCode: '',
        pName: '',
        pId: ''
      },
      formEdit: {
        id: '',
        code: '',
        name: '',
        pCode: '',
        pName: '',
        pId: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.findTree();
    this.findPage(true);
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysAreaManagerfindTree).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.treeOptions = res || [];
        }
      });
    },
    //加载列表
    findPage(can) {
      can?this.pageStart=0:this.pageStart++;
      this.$http.get(this.$location.sysAreaManagerfindPage,{
        params:{
          parentAreaID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          pageStart: this.pageStart,
          areaName: this.navForm.user
        }
      }).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.totalCount = res.totalCount;
          let sysAreaList = res.sysAreaList;
          if(can){
            this.tableData = sysAreaList || [];
          }else{
            this.tableData.push(...sysAreaList);
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //删除
    deleted(areaID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysAreaManagerdelete, {
          params: {
            areaID: areaID
          }
        }).then(data => {
          let message = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: message,
              duration: 1000
            });
            this.findPage(true);
            this.findTree();
          }
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
          if(k.areaID == thisId){
            console.log('success');
            this.formAdd.pName = k.areaName;
            this.formAdd.pCode = k.areaCode;
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
    //新建
    addInfo() {
      this.alert.formAddVisible = true;
      let pId = this.navForm.treeValue[this.navForm.treeValue.length-1];
      this.formAdd.pId = pId;
      this.treeArea(this.treeOptions,pId);
    },
    addClose() {
      this.alert.formAddVisible = false;
      this.resetForm('formAdd');
    },
    //新建保存 type=1时为保存并新建
    addInfoSave(type) {
      this.$http.get(this.$location.sysAreaManagerinsert,{
        params: {
          areaCode: this.formAdd.code,
          areaName: this.formAdd.name,
          parentAreaID: this.formAdd.pId
        }
      }).then(data => {
        let message = data.returnContent;
        if(data.returnCode == '1'){
          this.$message({
              type: 'success',
              message: message,
              duration: 1000
          });
          if(type == '1'){
            this.formAdd.code = '';
            this.formAdd.name = '';
          }else{
            this.resetForm('formAdd');
          }
          this.findPage();
          this.findTree();
        }
      });
    },
    //编辑
    editInfo(dataList) {
      this.formEdit.id = dataList.areaID;
      this.formEdit.code = dataList.areaCode;
      this.formEdit.name = dataList.areaName;
      this.formEdit.pCode = dataList.parentCode;
      this.formEdit.pName = dataList.parentName;
      this.formEdit.pId = dataList.parentAreaID;
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysAreaManagerupdate,{
        params: {
          areaID: this.formEdit.id,
          areaCode: this.formEdit.code,
          areaName: this.formEdit.name,
          parentAreaID: this.formEdit.pId
        }
      }).then(data => {
        let message = data.returnContent;
        if(data.returnCode == '1'){
          this.$message({
              type: 'success',
              message: message,
              duration: 1000
          });
          this.findPage();
          this.findTree();
        }
      });
    }
  }
}
</script>

<style lang='less'>
.pluginManagement{
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
      .el-table__header{
        width: 100%!important;
      }
      .el-table__empty-block{
        width: 100%!important;
      }
    }
  }
  .this_table{
    .el-button--danger.is-plain{
      margin-left: 0;
    }
  }
}
</style>