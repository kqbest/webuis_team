<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <header class="this_header"></header>
    <article class="this_section">
      <nav class="this_nav">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-button type="text"  class="el-icon-setting" :label="!isCollapse"></el-button>
        </el-radio-group> -->
        <el-button type="text" class="el-icon-menu this_spread" @click="isCollapse=!isCollapse"></el-button>
        <el-menu default-active="1-2" :router="true" :unique-opened="true" class="el-menu-vertical-demo" @open="handleOpen" :collapse="isCollapse">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">系统设置</span>
            </template>
            <el-menu-item index="/">
              <i class="el-icon-menu"></i>
              <span slot="title">插件管理</span>
            </el-menu-item>
            <el-menu-item index="/pluginManagement">
              <i class="el-icon-menu"></i>
              <span slot="title">地区管理</span>
            </el-menu-item>
            <el-menu-item index="/regionalManagement">
              <i class="el-icon-menu"></i>
              <span slot="title">院区管理</span>
            </el-menu-item>
            <el-menu-item index="/managementDepartment">
              <i class="el-icon-menu"></i>
              <span slot="title">科室管理</span>
            </el-menu-item>
            <el-menu-item index="/roleManagement">
              <i class="el-icon-menu"></i>
              <span slot="title">角色管理</span>
            </el-menu-item>
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item index="/informationSystem">
              <i class="el-icon-menu"></i>
              <span slot="title">系统字典</span>
            </el-menu-item>
            <el-menu-item index="/informationDepartment">
              <i class="el-icon-menu"></i>
              <span slot="title">科室字典</span>
            </el-menu-item>
            <el-menu-item index="/systemParameters">
              <i class="el-icon-menu"></i>
              <span slot="title">系统参数</span>
            </el-menu-item>
            <el-menu-item index="/departmentParams">
              <i class="el-icon-menu"></i>
              <span slot="title">科室参数</span>
            </el-menu-item>
            <el-menu-item index="/logs">
              <i class="el-icon-menu"></i>
              <span slot="title">日志管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span slot="title">模板设置</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">常用符号</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">关键短语</span>
            </el-menu-item>
            <el-menu-item index="2-3">
              <i class="el-icon-menu"></i>
              <span slot="title">模板分类</span>
            </el-menu-item>
            <el-menu-item index="2-4">
              <i class="el-icon-menu"></i>
              <span slot="title">书写模板</span>
            </el-menu-item>
            <el-menu-item index="2-5">
              <i class="el-icon-menu"></i>
              <span slot="title">书写词库</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-message"></i>
              <span slot="title">其他设置</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span slot="title">检查部位</span>
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-menu"></i>
              <span slot="title">报告项设置</span>
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-menu"></i>
              <span slot="title">自定义项</span>
            </el-menu-item>
            <el-menu-item index="3-4">
              <i class="el-icon-menu"></i>
              <span slot="title">样图管理</span>
            </el-menu-item>
            <el-menu-item index="3-5">
              <i class="el-icon-menu"></i>
              <span slot="title">内镜信息</span>
            </el-menu-item>
            <el-menu-item index="3-6">
              <i class="el-icon-menu"></i>
              <span slot="title">清洗消毒</span>
            </el-menu-item>
            <el-menu-item index="3-7">
              <i class="el-icon-menu"></i>
              <span slot="title">测值管理</span>
            </el-menu-item>
            <el-menu-item index="3-8">
              <i class="el-icon-menu"></i>
              <span slot="title">模板绑定</span>
            </el-menu-item>
            <el-menu-item index="3-9">
              <i class="el-icon-menu"></i>
              <span slot="title">绑定标识</span>
            </el-menu-item>
            <el-menu-item index="3-10">
              <i class="el-icon-menu"></i>
              <span slot="title">结构化报告</span>
            </el-menu-item>
            <el-menu-item index="3-11">
              <i class="el-icon-menu"></i>
              <span slot="title">预约设置</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </nav>
      <main class="this_main">
        <router-view class="view"></router-view>
      </main>
    </article>
  </div>
</template>
<script>
import { localTitle } from './location/title';
import { mapActions } from "vuex";
export default {
  name: 'app',
  data() {
    return {
      isCollapse: true
    }
  },
  created() {
    //获取地址和端口
    this.getLoadIp();
    //登录
    this.loginIn();
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    //获取地址和端口
    getLoadIp() {
      this.$http.get(this.$location.sysUserInfovalidate, {}).then(data => {
        if (data.returnCode == 1) {
          let validateIP = _.get(data, 'returnContent.validateIP');
          let validatePort = _.get(data, 'returnContent.validatePort');
          this.authorization(validateIP, validatePort);
        }
      })
    },
    //授权验证(地址,端口)
    authorization(validateIP, validatePort) {
      // console.log(validateIP, validatePort)
      this.$jsonp(localTitle, {
        requestType: 9,
        VRSVRIP: validateIP,
        VRSVRPort: validatePort,
        VRModal: 3
      }).then(data => {
        // console.log(data);

      })
    },
    //登录
    loginIn() {
      this.$http.get(this.$location.sysUserInfologin, {
        params: {
          hospitalID: '1',
          departmentID: '1',
          loginName: '1',
          password: 'admin'
        }
      }).then(data => {
        data = data.returnContent;
        // console.log(data)
        this.$store.dispatch("setHospitalID", '1');
        this.$store.dispatch("setDepartmentID", '1');
        this.$store.dispatch("setUserMsg", data.sessionUser);
      })
    }
  }

}

</script>
<style lang="less" scoped>
#app {
  height: 100%;
  display: flex;
  flex-direction: column;
  .this_header {
    height: 80px;
    background: #009933;
  }
  .this_section {
    width: 100%;
    height: 100%;
    flex-grow: 1;
    display: flex;
    .this_nav {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #eef1f6;
      .this_spread {
        width: 100%;
        background: #eef1f6;
      }
      .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        height: 100%;
        max-height: 100%;
      }
    }
    .this_main {
      height: 100%;
      padding: 15px 20px 0 20px;
      flex-grow: 1;
      .view {
        height: 100%;
        border: 1px solid red;
      }
    }
    border:1px solid blue;
  }
}

</style>

