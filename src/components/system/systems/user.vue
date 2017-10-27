<template>
  <section class="user">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="院区:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="form.treeValue" change-on-select @change="treeArea(array.treeOptions,form.treeValue[form.treeValue.length-1])"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="用户名:" prop="userName">
              <el-input v-model="form.loginName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="姓名:" prop="name">
              <el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
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
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo()">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            用户管理共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <section class='main'>
      <el-table v-scroll='queryData' :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" align="center" width="150">
          <template scope="scope">
            <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.userInfoID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.userInfoID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="loginName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户类型" prop="userTypeName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="归属院区" prop="hospitalName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="归属科室" prop="departmentName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="150">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.userInfoID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="14%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="90px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="归属院区:" prop="hospitalName">
                <el-input v-model="popupForm.hospitalName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="归属科室:" prop="departmentName">
                <el-input v-model="popupForm.departmentName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户名:" prop="loginName" required>
                <el-input v-model="popupForm.loginName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名:" prop="userName" required>
                <el-input v-model="popupForm.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工号:" prop="jobNumber" required>
                <el-input v-model="popupForm.jobNumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="性别:" prop="sex">
                <el-select v-model="popupForm.sex">
                  <el-option v-for="item in array.sexList" :key="item.dataDicValueCode" :label="item.dataDicValueName" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="职称:" prop="station">
                <el-input v-model="popupForm.station"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="用户类型:" prop="userType" required>
                <el-select v-model="popupForm.userType">
                  <el-option v-for="item in array.userTypeList" :key="item.dataDicValueCode" :label="item.dataDicValueName" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="popupForm.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="短号:" prop="shortPhone">
                <el-input v-model="popupForm.shortPhone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="密码:" prop="password">
                <el-input v-model="popupForm.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排班岗位:" prop="dataDicID">
                <el-select v-model="popupForm.dataDicID" multiple placeholder="请选择">
                  <el-option v-for="item in array.dataDicIDList" :key="item.dataDicValueID" :label="item.dataDicValueID" :value="item.dataDicValueID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="有效期:" prop="foreverState">
                <el-radio-group v-model="popupForm.foreverState">
                  <el-radio :label="1">永久</el-radio>
                  <el-radio :label="0">日期范围</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="角色:" prop="roleIDArray" required>
                <el-select v-model="popupForm.roleIDArray" multiple placeholder="请选择">
                  <el-option v-for="item in array.sysRoleList" :key="item.roleID" :label="item.roleName" :value="item.roleID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="输入法:" prop="inputMethod">
                <el-input v-model="popupForm.inputMethod" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="个人介绍:" prop="resume">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="popupForm.resume"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="手写签名:" prop="roleDesc">
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog v-model="obj.upload.dialogVisible" size="tiny">
                  <img width="100%" :src="obj.upload.dialogImageUrl" alt="">
                </el-dialog>
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
        treeValue: [],
        loginName: '',
        userName: ''
      },
      popupForm: {
        hospitalID: '',
        hospitalName: '',
        departmentID: '',
        departmentName: '',
        loginName: '',//用户名
        userName: '',//姓名
        jobNumber: '',//工号
        sex: '1',//性别
        station: '',//职称
        userType: '1',//用户类型
        phone: '',//联系电话
        shortPhone: '',//短号
        password: '',//密码
        dataDicID: '',//排班岗位
        foreverState: 1,//永久性标识
        startDate: '',//开始日期
        endDate: '',//结束日期
        roleIDArray: [],//角色
        inputMethod: '',//输入法
        resume: '',//个人介绍
        cANumber: '',//CA验证码
        nameAbbr: '',//名称缩写
        userInfoID: ''
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
        dataDicIDList: [],
        sexList: [],//性别list
        userTypeList: [],//用户类型list
        sysRoleList: []//角色list
      },
      obj: {
        treeProps:{
          value: 'depID',   
          label: 'depName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          hospitalName: '',
          depID: '',
          depName: ''
        },
        upload: {
          dialogImageUrl: '',
          dialogVisible: false
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
      this.$http.get(this.$location.sysUserInfofindTree).then(data => {
        let res = data.returnContent;
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
      });
    },
    //查询数据
    queryData(can) {
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysUserInfofindPage,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.depID,
          pageStart: this.other.pageStart,
          loginName: this.form.loginName,
          userName: this.form.userName
        }
      }).then(data => {
        let res = data.returnContent;
        let list = res.sysUserInfoList;
        this.other.totalCount = res.totalCount;
        if(can){
          this.array.tableData = list;
        }else{
          this.array.tableData.push(...list);
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
        this.$http.get(this.$location.sysUserInfoinsertReady,{
          params: {
            hospitalID: this.obj.tableParms.hospitalID,
            departmentID: this.obj.tableParms.depID
          }
        }).then(data => {
          let res = data.returnContent;
          this.array.dataDicIDList = res.dataDicIDList;
          this.array.sexList = res.sexList;
          this.array.userTypeList = res.userTypeList;
          this.array.sysRoleList = res.sysRoleList;

          this.popupForm.hospitalID = res.sysDepartmentManager.hospitalID;
          this.popupForm.hospitalName = res.sysDepartmentManager.hospitalName;
          this.popupForm.departmentID = res.sysDepartmentManager.depID;
          this.popupForm.departmentName = res.sysDepartmentManager.depName;
        });
        this.other.title = '新建';
        this.other.isAdd = true;
        this.alert.popupVisible = true;
      }
    },
    //新建保存
    addInfoSave(type) {
      let jsonData = new FormData();
      jsonData.append('cANumber',this.popupForm.cANumber);
      jsonData.append('hospitalID',this.popupForm.hospitalID);
      jsonData.append('departmentID',this.popupForm.departmentID);
      jsonData.append('loginName',this.popupForm.loginName);
      jsonData.append('userName',this.popupForm.userName);
      jsonData.append('jobNumber',this.popupForm.jobNumber);
      jsonData.append('sex',this.popupForm.sex);
      jsonData.append('station',this.popupForm.station);
      jsonData.append('userType',this.popupForm.userType);
      jsonData.append('phone',this.popupForm.phone);
      jsonData.append('shortPhone',this.popupForm.shortPhone);
      jsonData.append('password',this.popupForm.password);
      jsonData.append('dataDicID',this.popupForm.dataDicID);
      jsonData.append('foreverState',this.popupForm.foreverState);
      jsonData.append('startDate',this.popupForm.startDate);
      jsonData.append('endDate',this.popupForm.endDate);
      jsonData.append('roleIDArray',this.popupForm.roleIDArray);
      jsonData.append('inputMethod',this.popupForm.inputMethod);
      jsonData.append('resume',this.popupForm.resume);
      jsonData.append('nameAbbr',this.popupForm.nameAbbr);
      jsonData.append("inputMethod","");
      $.ajax({
        type: 'post',
        url: this.$location.sysUserInfoinsert,
        dataType:'json',
        data: jsonData,
        //告诉jQuery不要去处理发送的数据
        processData: false,
        //告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: data => {
          let msg = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            });
            this.queryData(true);
          }
        }
      });
      // //判断是 保存/保存并新建
      if(type == '1'){
        this.popupForm.loginName = '',//用户名
        this.popupForm.userName = '',//姓名
        this.popupForm.jobNumber = '',//工号
        this.popupForm.sex = '1',//性别
        this.popupForm.station = '',//职称
        this.popupForm.userType = '1',//用户类型
        this.popupForm.phone = '',//联系电话
        this.popupForm.shortPhone = '',//短号
        this.popupForm.password = '',//密码
        this.popupForm.dataDicID = '',//排班岗位
        this.popupForm.foreverState = '1',//永久性标识
        this.popupForm.startDate = '',//开始日期
        this.popupForm.endDate = '',//结束日期
        this.popupForm.roleIDArray = [],//角色
        this.popupForm.resume = ''//个人介绍
      }else{
        //清空弹框数据
        this.resetForm('popupForm');
        this.array.dataDicIDList = [];
        this.array.sexList = [];
        this.array.userTypeList = [];
        this.array.sysRoleList = [];
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(userInfoID) {
      this.$http.get(this.$location.sysUserInfoupdateQuery,{
        params: {
          userInfoID: userInfoID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.dataDicIDList = res.dataDicIDList;
        this.array.sexList = res.sexList;
        this.array.userTypeList = res.userTypeList;
        this.array.sysRoleList = res.sysRoleList;

        this.popupForm.hospitalID = res.sysUserInfo.hospitalID;
        this.popupForm.hospitalName = res.sysUserInfo.hospitalName;
        this.popupForm.departmentID = res.sysUserInfo.departmentID;
        this.popupForm.departmentName = res.sysUserInfo.departmentName;
        this.popupForm.loginName = res.sysUserInfo.loginName;//用户名
        this.popupForm.userName = res.sysUserInfo.userName;//姓名
        this.popupForm.jobNumber = res.sysUserInfo.jobNumber;//工号
        this.popupForm.sex = res.sysUserInfo.sex.toString();//性别
        this.popupForm.station = res.sysUserInfo.station;//职称
        this.popupForm.userType = res.sysUserInfo.userType.toString();//用户类型
        this.popupForm.phone = res.sysUserInfo.phone;//联系电话
        this.popupForm.shortPhone = res.sysUserInfo.shortPhone;//短号
        this.popupForm.password = res.sysUserInfo.password;//密码
        this.popupForm.dataDicID = res.sysUserInfo.dataDicID;//排班岗位
        this.popupForm.foreverStat = res.sysUserInfo.foreverStat;//永久性标识
        this.popupForm.startDate = res.sysUserInfo.startDate;//开始日期
        this.popupForm.endDate = res.sysUserInfo.endDate;//结束日期
        let sysUserInfo = [];
        res.sysUserInfo.roleIDArray.split(',').forEach((k,i) => {
          sysUserInfo.push(parseInt(k));
        });
        this.popupForm.roleIDArray = sysUserInfo;//角色
        this.popupForm.inputMethod = res.sysUserInfo.inputMethod;//输入法
        this.popupForm.resume = res.sysUserInfo.resume;//个人介绍
        this.popupForm.cANumbe = res.sysUserInfo.cANumbe;//CA验证码
        this.popupForm.nameAbbr = res.sysUserInfo.nameAbbr;//名称缩写
        this.popupForm.userInfoID = res.sysUserInfo.userInfoID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      let jsonData = new FormData();
      jsonData.append('cANumber',this.popupForm.cANumber);
      jsonData.append('hospitalID',this.popupForm.hospitalID);
      jsonData.append('departmentID',this.popupForm.departmentID);
      jsonData.append('loginName',this.popupForm.loginName);
      jsonData.append('userName',this.popupForm.userName);
      jsonData.append('jobNumber',this.popupForm.jobNumber);
      jsonData.append('sex',this.popupForm.sex);
      jsonData.append('station',this.popupForm.station);
      jsonData.append('userType',this.popupForm.userType);
      jsonData.append('phone',this.popupForm.phone);
      jsonData.append('shortPhone',this.popupForm.shortPhone);
      jsonData.append('password',this.popupForm.password);
      jsonData.append('dataDicID',this.popupForm.dataDicID);
      jsonData.append('foreverState',this.popupForm.foreverState);
      jsonData.append('startDate',this.popupForm.startDate);
      jsonData.append('endDate',this.popupForm.endDate);
      jsonData.append('roleIDArray',this.popupForm.roleIDArray);
      jsonData.append('inputMethod',this.popupForm.inputMethod);
      jsonData.append('resume',this.popupForm.resume);
      jsonData.append('nameAbbr',this.popupForm.nameAbbr);
      jsonData.append("inputMethod","");
      jsonData.append("userInfoID",this.popupForm.userInfoID);
      $.ajax({
        type: 'post',
        url: this.$location.sysUserInfoupdate,
        dataType:'json',
        data: jsonData,
        //告诉jQuery不要去处理发送的数据
        processData: false,
        //告诉jQuery不要去设置Content-Type请求头
        contentType: false,
        success: data => {
          let msg = data.returnContent;
          if(data.returnCode == '1'){
            this.$message({
              type: 'success',
              message: msg,
              duration: 1000
            });
            this.queryData(true);
          }
        }
      });
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.dataDicIDList = [];
      this.array.sexList = [];
      this.array.userTypeList = [];
      this.array.sysRoleList = [];
      this.alert.popupVisible = false;
    },
    //启用状态
    enabledState(userInfoID,state) {
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
        this.$http.get(this.$location.sysUserInfoupdateState,{
          params: {
            userInfoID: userInfoID,
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
    deleted(userInfoID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysUserInfodelete,{
          params: {
            userInfoID: userInfoID
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
      this.array.dataDicIDList = [];
      this.array.sexList = [];
      this.array.userTypeList = [];
      this.array.sysRoleList = [];
      this.alert.popupVisible = false;
    },
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.obj.upload.dialogImageUrl = file.url;
      this.obj.upload.dialogVisible = true;
    }
  }
}
</script>
<style lang='less'>
.user {
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
    .el-select{
      width: 100%;
    }
    .el-upload--picture-card,
    .el-upload-list__item {
        width: 70px;
        height: 70px;
        line-height: 75px;
    }
  }
}
</style>
