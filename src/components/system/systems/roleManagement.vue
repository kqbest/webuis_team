<template>
  <section class="roleManagement">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="院区:" prop="treeValue">
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
            <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.roleID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.roleID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="角色编号" prop="roleID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色名称" prop="roleName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="院区" prop="hospitalName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室" prop="departmentName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="150">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.roleID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="20%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px">
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区:" prop="hospitalName">
                <el-input v-model="popupForm.hospitalName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="科室:" prop="depName">
                <el-input v-model="popupForm.depName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="角色名称:" prop="roleName" required>
                <el-input v-model="popupForm.roleName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="角色描述:" prop="roleDesc">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="popupForm.roleDesc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="角色权限:" required>
                <el-tabs v-model="other.activeName" type="border-card">
                  <el-tab-pane label="菜单权限" name="first">
                    <div class="tree">
                      <el-tree ref="tree1" node-key="menuID" :data="array.menuArr" show-checkbox :props="obj.menuProps"></el-tree>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="功能权限" name="second">
                    <div class="tree">
                      <el-tree ref="tree2" node-key="rightID" :data="array.authArr" show-checkbox :props="obj.authProps"></el-tree>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="诊断权限" name="third">
                    <div class="tree">
                      <el-tree ref="tree3" node-key="treeID" :data="array.diagnArr" show-checkbox :props="obj.diagnProps"></el-tree>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="审核权限" name="fourth">
                    <div class="tree">
                      <el-tree ref="tree4" node-key="treeID" :data="array.auditArr" show-checkbox :props="obj.auditProps"></el-tree>
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
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
        treeValue: []
      },
      popupForm: {
        hospitalID: '',
        hospitalName: '',
        departmentID: '',
        departmentName: '',
        roleName: '',
        roleDesc: '',
        roleID: ''
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
        menuArr: [],//菜单权限
        authArr: [],//功能权限
        diagnArr: [],//诊断权限
        auditArr: []//审核权限
      },
      obj: {
        treeProps:{
          value: 'depID',   
          label: 'depName',
          children: 'childList'
        },
        menuProps: {
          id: 'menuID',
          label: 'menuName',
          children: 'childList'
        },
        authProps: {
          id: 'rightID',
          label: 'rightName',
          children: 'childList'
        },
        diagnProps: {
          id: 'treeID',
          label: 'treeName',
          children: 'childList'
        },
        auditProps: {
          id: 'treeID',
          label: 'treeName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          hospitalName: '',
          depID: '',
          depName: ''
        }
      },
      other: {
        totalCount: '',
        pageStart: '0',
        title: '新建',
        isAdd: true,
        isFirst: true, //判断是否是初次加载树形，如果是给treeValue添加默认值
        activeName: 'first'//tabs默认选中第一个
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
      this.$http.get(this.$location.sysRoleManagerfindTree).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.array.treeOptions = res;
          //默认选中第一个
          if(this.array.treeOptions.length > 0){
            if(this.other.isFirst){
              this.form.treeValue.push(this.array.treeOptions[0].depID);
              this.other.isFirst = false;
              let len = this.form.treeValue.length;
              this.treeArea(this.array.treeOptions,this.form.treeValue[len-1]);
              this.queryData(true);
            }
          }
        }
      });
    },
    //查询数据
    queryData(can) {
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysRoleManagerfindPage,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.depID,
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
        }
      });
    },
    //新建
    addInfo() {
      if (this.form.treeValue[this.form.treeValue.length-1] == '0') {
        this.$alert(`请选择相应的院区或科室！`,'提示',{
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {});
      }else{
        this.$http.get(this.$location.sysRoleManagerinsertReady,{
          params: {
            hospitalID: this.obj.tableParms.hospitalID,
            departmentID: this.obj.tableParms.depID
          }
        }).then(data => {
          let res = data.returnContent;
          if(data.returnCode == '1'){
            this.array.menuArr = res.sysMenuTree;
            this.array.authArr = res.authTree;
            this.array.diagnArr = res.assistTree;
            this.array.auditArr = res.assistTree;

            this.popupForm.hospitalID = this.obj.tableParms.hospitalID;
            this.popupForm.hospitalName = this.obj.tableParms.hospitalName;
            this.popupForm.departmentID = this.obj.tableParms.depID;
            this.popupForm.depName = this.obj.tableParms.depName;
          }
        });
        this.other.title = '新建';
        this.other.isAdd = true;
        this.alert.popupVisible = true;
      }
    },
    //新建保存
    addInfoSave(type) {
      let mArr = this.$refs.tree1.getCheckedKeys();//菜单权限
      let rArr = this.$refs.tree2.getCheckedKeys();//功能权限
      let dNodes = this.$refs.tree3.getCheckedNodes();//诊断权限
      let aNodes = this.$refs.tree4.getCheckedNodes();//审核权限
      let dArr = '';
      let aArr = '';
      dNodes.forEach((k, i) => {
        let hospID = k.hospitalID;
        let depID = k.departmentID;
        if(dArr == ''){
          dArr = hospID + ',' + depID;
        }else{
          dArr += ';' + hospID + ',' + depID;
        }
      });
      aNodes.forEach((k, i) => {
        let hospID = k.hospitalID;
        let depID = k.departmentID;
        if(aArr == ''){
          aArr = hospID + ',' + depID;
        }else{
          aArr += ';' + hospID + ',' + depID;
        }
      });
      this.$http.get(this.$location.sysRoleManagerinsert,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          roleName: this.popupForm.roleName,
          roleDesc: this.popupForm.roleDesc,
          menuIDArray: mArr.join(','),
          rightIDArray: rArr.join(','),
          diagnosisIDArray: dArr,
          auditIDArray: aArr
        }
      }).then(data => {
        let msg = data.returnContent;
        if(data.returnCode == '1'){
          this.$message({
            type: 'success',
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        }
      });
      //判断是 保存/保存并新建
      if(type == '1'){
        this.popupForm.roleName = '';
        this.popupForm.roleDesc = '';
        //清空树形勾选
        this.$refs.tree1.setCheckedKeys([]);
        this.$refs.tree2.setCheckedKeys([]);
        this.$refs.tree3.setCheckedKeys([]);
        this.$refs.tree4.setCheckedKeys([]);
      }else{
        //清空弹框数据
        this.resetForm('popupForm');
        this.array.menuArr = [];
        this.array.authArr = [];
        this.array.diagnArr = [];
        this.array.auditArr = [];
        this.popupForm.roleName = '';
        this.popupForm.roleDesc = '';
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(roleID) {
      this.$http.get(this.$location.sysRoleManagerupdateQuery,{
        params: {
          roleID: roleID
        }
      }).then(data => {
        let res = data.returnContent;
        let role = res.sysRoleManager;
        if(data.returnCode == '1'){
          this.popupForm.roleID = roleID;
          this.array.menuArr = res.sysMenuTree;
          this.array.authArr = res.authTree;
          this.array.diagnArr = res.assistTree;
          this.array.auditArr = res.assistTree;
          this.popupForm.hospitalID = role.hospitalID;
          this.popupForm.hospitalName = role.hospitalName;
          this.popupForm.departmentID = role.departmentID;
          this.popupForm.departmentName = role.departmentName;
          this.popupForm.roleName = role.roleName;
          this.popupForm.roleDesc = role.roleDesc;
          let mArr = role.menuIDArray;
          let rArr = role.rightIDArray;
          let diagn = role.diagnosisIDArray.split(';');
          let audit = role.auditIDArray.split(';');
          let dArr = '';
          let aArr = '';
          diagn.forEach((k, i) => {
            let treeID = k.split(',')[1];
            if(dArr == ''){
              dArr = treeID;
            }else{
              dArr += ',' + treeID;
            }
          });
          audit.forEach((k, i) => {
            let treeID = k.split(',')[1];
            if(aArr == ''){
              aArr = treeID;
            }else{
              aArr += ',' + treeID;
            }
          });
          this.$refs.tree1.setCheckedKeys(mArr.split(','));//菜单权限
          this.$refs.tree2.setCheckedKeys(rArr.split(','));//功能权限
          if(dArr){
            this.$refs.tree3.setCheckedKeys(dArr.split(','));//诊断权限
          }
          if(aArr){
            this.$refs.tree4.setCheckedKeys(aArr.split(','));//审核权限
          }
        }
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      let mArr = this.$refs.tree1.getCheckedKeys();//菜单权限
      let rArr = this.$refs.tree2.getCheckedKeys();//功能权限
      let dNodes = this.$refs.tree3.getCheckedNodes();//诊断权限
      let aNodes = this.$refs.tree4.getCheckedNodes();//审核权限
      let dArr = '';
      let aArr = '';
      dNodes.forEach((k, i) => {
        let hospID = k.hospitalID;
        let depID = k.departmentID;
        if(dArr == ''){
          dArr = hospID + ',' + depID;
        }else{
          dArr += ';' + hospID + ',' + depID;
        }
      });
      aNodes.forEach((k, i) => {
        let hospID = k.hospitalID;
        let depID = k.departmentID;
        if(aArr == ''){
          aArr = hospID + ',' + depID;
        }else{
          aArr += ';' + hospID + ',' + depID;
        }
      });
      this.$http.get(this.$location.sysRoleManagerupdate,{
        params: {
          roleID: this.popupForm.roleID,
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          roleName: this.popupForm.roleName,
          roleDesc: this.popupForm.roleDesc,
          menuIDArray: mArr.join(','),
          rightIDArray: rArr.join(','),
          diagnosisIDArray: dArr,
          auditIDArray: aArr
        }
      }).then(data => {
        let msg = data.returnContent;
        if(data.returnCode == '1'){
          this.$message({
            type: 'success',
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        }
      });
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.menuArr = [];
      this.array.authArr = [];
      this.array.diagnArr = [];
      this.array.auditArr = [];
      this.popupForm.roleName = '';
      this.popupForm.roleDesc = '';
      this.alert.popupVisible = false;
    },
    //启用状态
    enabledState(roleID,state) {
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
        this.$http.get(this.$location.sysRoleManagerupdateState,{
          params: {
            roleID: roleID,
            state: state
          }
        }).then(data => {
          let msg = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            });
            this.queryData(true);
          }
        });
      }).catch(() => {});
    },
    //删除
    deleted(roleID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysRoleManagerdelete,{
          params: {
            roleID: roleID
          }
        }).then(data => {
          let msg = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            });
            this.queryData(true);
          }
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
          if(k.depID == thisId){
            console.log('success');
            this.obj.tableParms.hospitalID = k.hospitalID;
            this.obj.tableParms.hospitalName = this.array.treeOptions[0].depName;
            this.obj.tableParms.depID = k.depID;
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
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.menuArr = [];
      this.array.authArr = [];
      this.array.diagnArr = [];
      this.array.auditArr = [];
      this.popupForm.roleName = '';
      this.popupForm.roleDesc = '';
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
