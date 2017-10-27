<template>
  <section class="regionalManagement">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="院区目录:">
              <el-cascader :props="treeProps" :options="treeOptions" v-model="navForm.treeValue" change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="院区编号:">
              <el-input v-model="navForm.code" placeholder="请输入院区编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="院区名称:">
              <el-input v-model="navForm.name" placeholder="请输入院区名称"></el-input>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="findPage">查询</el-button>
          <el-button class="mlem" @click="resetForm('navForm')">重置</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>院区管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary"  @click="addInfo()">新建</el-button>
        <el-button class="mlem">刷新</el-button>
        <span class="mlem">
            院区管理共<font class='pub_count'>{{ totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="findPage" :data="tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.hospitalID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.hospitalID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="hospitalCode" label="院区编号" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospitalName" label="院区名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="hospitalGradeName" label="院区等级" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="areaName" label="地区" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="postCode" label="邮编" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="联系方式" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_add">
      <el-dialog :title="title" size="small" top="30%" :visible.sync="alert.formAddVisible" :before-close="addClose">
        <el-form :model="formAdd" ref="formAdd" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区编号:" prop="hospitalCode" required>
                <el-input type="text" v-model="formAdd.hospitalCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="院区名称:" prop="hospitalName" required>
                <el-input type="text" v-model="formAdd.hospitalName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="邮编:" prop="postCode">
                <el-input type="text" v-model="formAdd.postCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="联系电话:" prop="phone">
                <el-input type="text" v-model="formAdd.phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区等级:" prop="hospitalGradeID" required>
                <el-select v-model="formAdd.hospitalGradeID">
                  <el-option v-for="(item,index) in selectDate.hospitalGradeList" :label="item.dataDicValueName" :key="index" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="省份:" prop="provinceID" required>
                <el-select v-model="formAdd.provinceID" @change="loadArea(formAdd.provinceID,'1')">
                  <el-option v-for="(item,index) in selectDate.provinceList" :label="item.areaName" :key="index" :value="item.areaID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="城市:" prop="cityID">
                <el-select v-model="formAdd.cityID" @change="loadArea(formAdd.cityID,'2')">
                  <el-option v-for="(item,index) in selectDate.cityList" :label="item.areaName" :key="index" :value="item.areaID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="区县:" prop="countyID">
                <el-select v-model="formAdd.countyID" @change="loadArea(formAdd.countyID,'3')">
                  <el-option v-for="(item,index) in selectDate.countyList" :label="item.areaName" :key="index" :value="item.areaID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="街道:" prop="streetID">
                <el-select v-model="formAdd.streetID">
                  <el-option v-for="(item,index) in selectDate.streetList" :label="item.areaName" :key="index" :value="item.areaID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
            <el-button v-show="isAdd" type="primary" @click="addInfoSave">保 存</el-button>
            <el-button v-show="isAdd" type="primary" @click="addInfoSave('1');">保存并新建</el-button>
            <el-button v-show="!isAdd" type="primary" @click="editInfoSave(formAdd.hospitalID)">保 存</el-button>
            <el-button @click="addClose">取 消</el-button>
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
      isAdd: true,
      title: '新建',
      //nav value
      navForm: {
        treeValue: [],
        code: '',
        name: ''
      },
      alert: {
        formAddVisible: false
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
        hospitalCode: '',//院区编号
        hospitalName: '',//院区名称
        postCode: '',//邮编
        phone: '',//联系电话
        hospitalGradeID: '1',//院区等级
        provinceID: '',//省份
        cityID: '',//城市
        countyID: '',//区县
        streetID: '',//街道
        hospitalID: ''//院区id
      },
      selectDate: {
        hospitalGradeList: [],
        provinceList: [],
        cityList: [],
        countyList: [],
        streetList: []
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
      this.$http.get(this.$location.sysHospitalManagerfindTree).then(data => {
        let res = data.returnContent;
        this.treeOptions = res || [];
      });
    },
    //加载列表
    findPage(can) {
      can?this.pageStart=0:this.pageStart++;
      let treeValueLen = this.navForm.treeValue.length;
      let param = {
        provinceID: '',
        cityID: '',
        countyID: '',
        streetID: '',
        pageStart: this.pageStart,
        hospitalCode: this.navForm.code,
        hospitalName: this.navForm.name
      }
      if(treeValueLen == 2){
        param = {
          provinceID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          cityID: '',
          countyID: '',
          streetID: '',
          pageStart: this.pageStart,
          hospitalCode: this.navForm.code,
          hospitalName: this.navForm.name
        }
      }else if(treeValueLen == 3){
        param = {
          provinceID: '',
          cityID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          countyID: '',
          streetID: '',
          pageStart: this.pageStart,
          hospitalCode: this.navForm.code,
          hospitalName: this.navForm.name
        }
      }else if(treeValueLen == 4){
        param = {
          provinceID: '',
          cityID: '',
          countyID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          streetID: '',
          pageStart: this.pageStart,
          hospitalCode: this.navForm.code,
          hospitalName: this.navForm.name
        }
      }else if(treeValueLen == 5){
        param = {
          provinceID: '',
          cityID: '',
          countyID: '',
          streetID: this.navForm.treeValue[this.navForm.treeValue.length-1],
          pageStart: this.pageStart,
          hospitalCode: this.navForm.code,
          hospitalName: this.navForm.name
        }
      }
      this.$http.get(this.$location.sysHospitalManagerfindPage,{
        params: param
      }).then(data => {
        let res = data.returnContent;
        this.totalCount = res.totalCount;
        let sysHospitalList = res.sysHospitalList;
        if (can) {
         this.tableData = sysHospitalList || [];
        }else{
          this.tableData.push(...sysHospitalList);
        }
      });
    },
    //删除
    deleted(hospitalID) {
      this.$confirm('是否确认删除该条信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysHospitalManagerdelete, {
          params: {
            hospitalID: hospitalID
          }
        }).then(data => {
          let message = data.returnContent;
          this.$message({
              type: 'success',
              message: message,
              duration: 1000
          });
          this.findPage(true);
          this.findTree();
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
      this.$http.get(this.$location.sysHospitalManagerinsertReady).then(data => {
        let res = data.returnContent;
        let hospitalGradeList = res.hospitalGradeList;
        let sysAreaList = res.sysAreaList;
        this.selectDate.hospitalGradeList = hospitalGradeList || [];
        this.selectDate.provinceList = sysAreaList || [];
      });
      this.isAdd = true;
      this.title = '新建';
      this.alert.formAddVisible = true;
    },
    //新建保存 type=1时为保存并新建
    addInfoSave(type) {
      this.$http.get(this.$location.sysHospitalManagerinsert,{
        params: {
          hospitalCode: this.formAdd.hospitalCode,
          hospitalName: this.formAdd.hospitalName,
          postCode: this.formAdd.postCode,
          phone: this.formAdd.phone,
          hospitalGradeID: this.formAdd.hospitalGradeID,
          provinceID: this.formAdd.provinceID,
          cityID: this.formAdd.cityID,
          countyID: this.formAdd.countyID,
          streetID: this.formAdd.streetID
        }
      }).then(data => {
        let message = data.returnContent;
        this.$message({
            type: 'success',
            message: message,
            duration: 1000
        });
        if(type == '1'){
          this.formAdd.hospitalCode = '';
          this.formAdd.hospitalName = '';
          this.formAdd.postCode = '';
          this.formAdd.phone = '';
          this.formAdd.hospitalGradeID = '';
          this.formAdd.provinceID = '';
          this.formAdd.cityID = '';
          this.formAdd.countyID = '';
          this.formAdd.streetID = '';
        }else{
          this.resetForm('formAdd');
          this.alert.formAddVisible = false;
        }
        this.findPage(true);
      });
    },
    //编辑
    editInfo(hospitalID) {
      this.$http.get(this.$location.sysHospitalManagerupdateQuery,{
        params: {
          hospitalID: hospitalID
        }
      }).then(data => {
        let res = data.returnContent;
        let hospitalGradeList = res.hospitalGradeList;
        let sysAreaList = res.sysAreaList;
        let sysHospitalManager = res.sysHospitalManager;
        this.selectDate.hospitalGradeList = hospitalGradeList || [];
        this.selectDate.provinceList = sysAreaList || [];

        this.formAdd.hospitalCode = sysHospitalManager.hospitalCode;
        this.formAdd.hospitalName = sysHospitalManager.hospitalName;
        this.formAdd.postCode = sysHospitalManager.postCode;
        this.formAdd.phone = sysHospitalManager.phone;
        this.formAdd.hospitalGradeID = sysHospitalManager.hospitalGradeID.toString();
        this.formAdd.provinceID = sysHospitalManager.provinceID;
        this.formAdd.cityID = sysHospitalManager.cityID;
        this.formAdd.countyID = sysHospitalManager.countyID;
        if(sysHospitalManager.streetID == '0'){
          sysHospitalManager.streetID = '';
        }
        this.formAdd.streetID = sysHospitalManager.streetID;
        this.formAdd.hospitalID = hospitalID;
        this.loadArea(this.formAdd.provinceID,'1');
        this.loadArea(this.formAdd.cityID,'2');
        this.loadArea(this.formAdd.countyID,'3');
      });
      this.isAdd = false;
      this.title = '编辑';
      this.alert.formAddVisible = true;
    },
    //编辑保存
    editInfoSave(hospitalID) {
      this.$http.get(this.$location.sysHospitalManagerupdate,{
        params: {
          hospitalID: hospitalID,
          hospitalCode: this.formAdd.hospitalCode,
          hospitalName: this.formAdd.hospitalName,
          postCode: this.formAdd.postCode,
          phone: this.formAdd.phone,
          hospitalGradeID: this.formAdd.hospitalGradeID,
          provinceID: this.formAdd.provinceID,
          cityID: this.formAdd.cityID,
          countyID: this.formAdd.countyID,
          streetID: this.formAdd.streetID
        }
      }).then(data => {
        let message = data.returnContent;
        this.$message({
          type: 'success',
          message: message,
          duration: 1000
        });
        this.resetForm('formAdd');
        this.alert.formAddVisible = false;
        this.findPage(true);
      });
      this.formAdd.hospitalID = '';
    },
    //联动加载
    loadArea(now,type) {
      if(!now){
        return false;
      }
      this.$http.get(this.$location.sysAreaManagerloadArea,{
        params: {
          areaID: now
        }
      }).then(data => {
        let res = data.returnContent;
        if(type == 1){
          this.selectDate.cityList = res;
        }else if(type == 2){
          this.selectDate.countyList = res;
        }else if(type == 3){
          this.selectDate.streetList = res;
        }
      });
    },
    addClose() {
      this.alert.formAddVisible = false;
      this.resetForm('formAdd');
      this.formAdd.hospitalID = '';
    }
  }
}
</script>

<style lang='less'>
.regionalManagement{
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
  .this_add{
    .el-select{
      width: 100%;
    }
  }
}
</style>