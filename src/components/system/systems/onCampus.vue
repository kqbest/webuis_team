<template>
  <section class="onCampus">
    <!-- 头部 -->
    <header>
      <div class="this_breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>其他设置</el-breadcrumb-item>
          <el-breadcrumb-item>插件管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <nav class="this_nav">
        <el-form :inline="true" :model="navForm" ref="navForm" class="demo-form-inline">
          <el-form-item label="菜单目录:" prop="treeValue">
            <el-cascader :props="treeProps" :options="treeOptions" v-model="navForm.treeValue" change-on-select></el-cascader>
          </el-form-item>
          <el-form-item label="菜单名称:" prop="user">
            <el-input v-model="navForm.user" placeholder="菜单名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="findPage()">查询</el-button>
            <el-button @click="resetForm('navForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </nav>
      <h2 class="this_total">
        <el-button class="mr10" @click="findPage()">刷新</el-button>
        共<em class="em">{{ totalCount }}</em>条记录
      </h2>
    </header>
    <!-- 表格 -->
    <section class="this_table">
      <el-table :data="tableData" stripe border style="width: 100%">
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
        user: ''
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
    this.findPage();
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysMenuManagerfindTree).then(data => {
        let res = data.data.returnContent;
        this.treeOptions = res || [];
      }).catch(error => {
        console.log(error);
      });
    },
    //加载列表
    findPage() {
      this.$http.get(this.$location.sysMenuManagerfindPage,{
        params:{
          parentMenuID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          pageStart: this.pageStart,
          menuName: this.navForm.user
        }
      }).then(data => {
        let res = data.data.returnContent;
        this.totalCount = res.totalCount;
        let sysMenuList = res.sysMenuList;
        this.tableData = sysMenuList || [];
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
          let message = data.data.returnContent;
          let returnCode = data.data.returnCode;
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
  height: 100%;
  overflow: auto;
  .this_breadcrumb{
    width: 100%;
    margin: 10px 0;
  }
  .this_nav{
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px 0;
    padding: 1em;
    background-color: #f2f2f2;
  }
  .this_total{
    width: 100%;
    margin: 10px 0;
    text-align: right;
    .em{
      padding: 0 5px;
      color: #4bc889;
    }
  }
  .this_table{
    display: flex;
    flex-grow: 1;
    width: 100%;
    .this_enable{
      color: green;
      cursor: pointer;
    }
  }
}
</style>