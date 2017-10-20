<template>
  <section class="logs">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="所属院区:" prop="hospitalID">
              <el-select v-model="navForm.hospitalID" placeholder="请选择" clearable @change="loadDept">
                <el-option v-for="item in array.hospitalList" :value="item.hospitalID" :label="item.hospitalName" :key="item.hospitalID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="检查科室:" prop="departmentID">
              <el-select v-model="navForm.departmentID" placeholder="请选择" @change="loadUser">
                <el-option v-for="item in array.departmentList" :value="item.depID" :label="item.depName" :key="item.depID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="检查流水:" prop="examineID">
              <el-input v-model="navForm.examineID" placeholder="请输入检查流水号"></el-input>
            </el-form-item>
          </el-col>

          <el-col>
            <el-form-item label="日志类型:" prop="logType">
              <el-select v-model="navForm.logType" placeholder="请选择">
                <el-option v-for="item in array.logTypeList" :value="item.dataDicValueCode" :label="item.dataDicValueName" :key="item.dataDicValueCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="操作用户:" prop="userInfoID">
              <el-select v-model="navForm.userInfoID" placeholder="请选择">
                <el-option v-for="item in array.userList" :value="item.userInfoID" :label="item.userName" :key="item.userInfoID"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="IP地址:" prop="iPAddress">
              <el-input v-model="navForm.iPAddress" placeholder="请输入IP地址"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="时间:" prop="timeSlot">
              <el-date-picker v-model="navForm.timeSlot" type="daterange" align="right" placeholder="选择日期范围" :picker-options="obj.pickerOptions"></el-date-picker>
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
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>日志</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            日志共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.logID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalName" label="所属院区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="departmentName" label="检查科室" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examineID" label="检查流水" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logTypeName" label="日志类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="操作用户" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="iPAddress" label="IP地址" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="eventTime" label="操作时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" label="日志内容" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      navForm: {
        hospitalID: '',
        departmentID: '',
        examineID: '',
        logType: '',
        userInfoID: '',
        iPAddress: '',
        timeSlot: ''
      },
      array: {
        tableData: [],//表格数据
        hospitalList: [],//所属院区数据
        departmentList: [],//检查科室数据
        logTypeList: [],//日志类型数据
        userList: []//操作用户数据
      },
      obj: {
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        isFirst: true
      },
      alert: {
        formVisible: true
      }
    }
  },
  computed: {
  },
  created() {
    this.queryData(true);
  },
  methods: {
    //加载列表
    queryData(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      let time = this.navForm.timeSlot;
      let startTime = '';
      let endTime = '';
      if (time.length > 0) {
        startTime = time[0].getFullYear() + '-' + (time[0].getMonth()+1) + '-' + time[0].getDate();
        endTime = time[1].getFullYear() + '-' + (time[1].getMonth()+1) + '-' + time[1].getDate();
      }
      this.$http.get(this.$location.sysServerLogfindPage,{
        params:{
          hospitalID: this.navForm.hospitalID,
          departmentID: this.navForm.departmentID,
          examineID: this.navForm.examineID,
          logType: this.navForm.logType,
          userInfoID: this.navForm.userInfoID,
          iPAddress: this.navForm.iPAddress,
          startTime: startTime,
          endTime: endTime,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.other.totalCount = res.totalCount;
          this.array.hospitalList = res.sysHospitalManagerList;
          this.array.logTypeList = res.logTypeList;
          let list = res.sysServerLogList;
          if(can){
            this.array.tableData = list || [];
          }else{
            this.array.tableData.push(...list);
          }
          this.navForm.hospitalID = res.sessionUser.hospitalID;
          this.navForm.departmentID = res.sessionUser.departmentID;
        }
      });
    },
    //加载科室
    loadDept() {
      if (!this.other.isFirst) {
        this.navForm.departmentID = '';
      }
      this.other.isFirst = false;
      this.array.departmentList = [];
      this.$http.get(this.$location.sysUserInfoloadDept,{
        params: {
          hospitalID: this.navForm.hospitalID
        }
      }).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.array.departmentList = res || [];
        }
      });
    },
    //加载用户
    loadUser() {
      this.navForm.userInfoID = '';
      this.array.userList = [];
      this.$http.get(this.$location.sysUserInfoloadUser,{
        params: {
          hospitalID: this.navForm.hospitalID,
          departmentID: this.navForm.departmentID
        }
      }).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.array.userList = res.sysUserInfoList || [];
        }
      });
    },
    //删除
    deleted(logID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysServerLogdelete, {
          params: {
            logID: logID
          }
        }).then(data => {
          let message = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: message,
              duration: 1000
            });
            this.queryData(true);
          }
        });
      }).catch(() => {});
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
}
</script>

<style lang='less'>
.logs{
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
}
</style>