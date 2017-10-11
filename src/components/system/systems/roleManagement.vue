<template>
  <section class="roleManagement">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="科室目录:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="form.treeValue" change-on-select></el-cascader>
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
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo()">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            角色管理共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <section class='main'>
      <el-table v-scroll='queryData' :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" align="center" width="150">
          <template scope="scope">
            <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.depID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.depID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="角色编号" prop="roleID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="院区" prop="hospitalName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室" prop="departmentName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="150">
          <template scope="scope">
            <!-- <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.depID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.depID)"></el-button> -->
            <span class="this_enable" @click="enabledState(scope.row.menuID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="30%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区:" prop="hospitalName">
                <el-input v-model="popupForm.hospitalName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="上级科室:" prop="parentDepName">
                <el-input v-model="popupForm.parentDepName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="科室编号:" prop="depCode" required>
                <el-input v-model="popupForm.depCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="科室名称:" prop="depName" required>
                <el-input v-model="popupForm.depName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="popupForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <div class="this_check">
                <el-checkbox v-model="popupForm.checked">医技科室</el-checkbox>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" v-show="other.isAdd" @click="addInfoSave()">保 存</el-button>
          <el-button type="primary" v-show="!other.isAdd" @click="editInfoSave()">保 存</el-button>
          <el-button type="primary" v-show="other.isAdd" @click="addInfoSave('1')">保存并新建</el-button>
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
        treeValue: [0],
        number: '',
        name: ''
      },
      popupForm: {
        hospitalID: '',
        hospitalName: '',
        parentDepID: '',
        parentDepName: '',
        depID: '',
        depCode: '',
        depName: '',
        phone: '',
        checked: false
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
      },
      obj: {
        treeProps:{
           value: 'depID',   
           label: 'depName',
           children: 'childList'
        },
        tableParms: {
          hospitalID: '1',
          parentDepID: '0',
          depCode: '',
          depName: ''
        }
      },
      other: {
        totalCount: '',
        pageStart: '0',
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
    this.queryData(true);
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysRoleManagerfindTree).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.array.treeOptions = res;
        }else if(data.returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      });
    },
    //查询数据
    queryData(can) {
      let treeValueLen = this.form.treeValue.length;
      this.treeArea(this.array.treeOptions,this.form.treeValue[treeValueLen-1]);
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysRoleManagerfindPage,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.form.treeValue[treeValueLen-1],
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        let list = res.sysRoleList;
        if(data.returnCode == '1'){
          this.other.totalCount = res.totalCount;
          if(can){
            this.array.tableData = list;
          }else{
            this.array.tableData.push(...list);
          }
        }else if(data.returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      });
    },
    //新建
    addInfo() {
      let treeValueLen = this.form.treeValue.length;
      this.treeArea(this.array.treeOptions,this.form.treeValue[treeValueLen-1]);
      this.$http.get(this.$location.sysDepartmentManagerinsertReady,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          parentDepID: this.form.treeValue[treeValueLen-1]
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        if(returnCode == '1'){
          this.popupForm.hospitalID = res.hospitalID;
          this.popupForm.hospitalName = res.hospitalName;
          this.popupForm.parentDepID = res.parentDepID;
          this.popupForm.parentDepName = res.parentDepName;
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //新建保存
    addInfoSave(type) {
      let check;
      if(this.popupForm.checked == true){
        check = '1';
      }else{
        check = '0';
      }
      let treeValueLen = this.form.treeValue.length;
      this.$http.get(this.$location.sysDepartmentManagerinsert,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          parentDepID: this.form.treeValue[treeValueLen-1],
          depCode: this.popupForm.depCode,
          depName: this.popupForm.depName,
          phone: this.popupForm.phone,
          isPACS: check
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let msg = data.returnContent;
        if(returnCode == '1'){
          this.$message({
            type: 'success',
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: msg,
            duration: 1000
          });
        }
      });
      //判断是 保存/保存并新建
      if(type == '1'){
        this.popupForm.depCode = '';
        this.popupForm.depName = '';
        this.popupForm.phone = '';
        this.popupForm.checked = false;
        this.alert.popupVisible = true;
      }else{
        //清空弹框数据
        this.resetForm('popupForm');
        this.popupForm.checked = false;
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(depID) {
      this.$http.get(this.$location.sysDepartmentManagerupdateQuery,{
        params: {
          depID: depID
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        if(returnCode == '1'){
          this.popupForm.hospitalID = res.hospitalID;
          this.popupForm.hospitalName = res.hospitalName;
          this.popupForm.parentDepID = res.parentDepID;
          this.popupForm.parentDepName = res.parentDepName;
          this.popupForm.depID = res.depID;
          this.popupForm.depCode = res.depCode;
          this.popupForm.depName = res.depName;
          this.popupForm.phone = res.phone;
          if (res.isPACS == '1') {
            this.popupForm.checked = true;
          }else{
            this.popupForm.checked = false;
          }
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      let check;
      if(this.popupForm.checked == true){
        check = '1';
      }else{
        check = '0';
      }
      let treeValueLen = this.form.treeValue.length;
      this.$http.get(this.$location.sysDepartmentManagerupdate,{
        params: {
          depID: this.popupForm.depID,
          hospitalID: this.popupForm.hospitalID,
          parentDepID: this.form.treeValue[treeValueLen-1],
          depCode: this.popupForm.depCode,
          depName: this.popupForm.depName,
          phone: this.popupForm.phone,
          isPACS: check
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let msg = data.returnContent;
        if(returnCode == '1'){
          this.$message({
            type: 'success',
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: msg,
            duration: 1000
          });
        }
      });
      //清空弹框数据
      this.resetForm('popupForm');
      this.popupForm.checked = false;
      this.alert.popupVisible = false;
    },
    //删除
    deleted(depID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysDepartmentManagerdelete,{
          params: {
            depID: depID
          }
        }).then(data => {
          let returnCode = data.returnCode;
          let msg = data.returnContent;
          if(returnCode == '1'){
            this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            });
            this.queryData(true);
            this.findTree();
          }else if(returnCode == '0'){
            this.$message({
              type: 'error',
              message: msg,
              duration: 1000
            });
          }
        });
      });
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
            this.obj.tableParms.parentDepID = k.parentDepID;
            this.obj.tableParms.depCode = k.depCode;
            this.obj.tableParms.depName = k.depName;
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
      this.resetForm('popupForm');
      this.popupForm.checked = false;
      this.alert.popupVisible = false;
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}

</script>
<style lang='less' scoped>
.roleManagement {
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
    .this_check{
      padding-left: 120px;
      padding-top: 8px;
    }
  }
}
</style>
