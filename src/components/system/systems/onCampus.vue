<template>
  <section class="onCampus">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="菜单目录:" prop="treeValue">
              <el-cascader :props="treeProps" :options="treeOptions" v-model="navForm.treeValue" change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入菜单名称"></el-input>
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
          <el-breadcrumb-item>插件管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" @click="findPage">刷新</el-button>
        <span class="mlem">
            插件管理共<font class='pub_count'>{{ totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="findPage" :data="tableData" stripe border height="100" style="width: 100%">
        <el-table-column prop="menuID" label="菜单编码" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menuName" label="菜单名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="urlAdress" label="URL" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentMenuID" label="父菜单编码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="parentMenuName" label="父菜单名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="menuClassName" label="菜单类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.menuID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
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
      //nav option
      treeProps:{
        value: 'menuID',
        label: 'menuName',
        children: 'childList'
      },
      treeOptions: [],
      //tableData
      tableData: []
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
      this.$http.get(this.$location.sysMenuManagerfindTree).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        if(returnCode == '1'){
          this.treeOptions = res || [];
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //加载列表
    findPage(can) {
      can?this.pageStart=0:this.pageStart++;
      this.$http.get(this.$location.sysMenuManagerfindPage,{
        params:{
          parentMenuID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          pageStart: this.pageStart,
          menuName: this.navForm.name
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        if(returnCode == '1'){
          this.totalCount = res.totalCount;
          let sysMenuList = res.sysMenuList;
          if(can){
            this.tableData = sysMenuList || [];
          }else{
            this.tableData.push(...sysMenuList);
          }
        }else if(returnCode == '0'){
          this.$message({
            type: 'error',
            message: res,
            duration: 1000
          });
        }
      }).catch(error => {
        console.log(error);
      });
    },
    //启用状态
    enabledState(menuID,state) {
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
        this.$http.get(this.$location.sysMenuManagerupdateState, {
            params: {
                menuID: menuID,
                state: state
            }
        }).then(data => {
          let returnCode = data.returnCode;
          let message = data.returnContent;
          if(returnCode == '1'){
            this.$message({
                type: 'success',
                message: message,
                duration: 1000
            });
            this.findPage();
          }else if(returnCode == '0'){
            this.$message({
                type: 'error',
                message: message,
                duration: 1000
            });
          }
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='less' scoped>
.onCampus{
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
    }
    .this_enable{
      color: green;
      cursor: pointer;
    }
  }
}
</style>