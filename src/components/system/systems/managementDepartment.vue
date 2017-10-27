<template>
  <section class="managementDepartment">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="科室目录:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="form.treeValue" change-on-select></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="科室编号:" prop="number">
              <el-input v-model="form.number" placeholder="请输入科室编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="科室名称:" prop="name">
              <el-input v-model="form.name" placeholder="请输入科室名称"></el-input>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="queryData(true)">查询</el-button>
          <el-button class="mlem" @click="resetForm('form')">重置</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>科室管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo()">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            科室管理共<font class='pub_count'>{{ other.totalCount }}</font>条
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
        <el-table-column label="院区" prop="hospitalName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室编号" prop="depCode" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="科室名称" prop="depName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上级科室" prop="parentDepName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="医技科室" prop="isPACSName" align="center" show-overflow-tooltip></el-table-column>
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
    <section class="popup_ready">
      <el-dialog title="科室新建成功，马上进行初始化数据" size="small" top="30%" :visible.sync="alert.readyVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
        <el-form :model="readyForm" ref="readyForm" label-width="120px">
          <h3 class="this_tips">请选择初始化数据来源</h3>
          <div class="this_radio">
            <el-radio-group v-model="readyForm.radio" @change="radioChange">
              <el-radio :label="1">从脚本中导入原始数据</el-radio>
              <el-radio :label="2">指定数据来源</el-radio>
            </el-radio-group>
          </div>
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区:" prop="hospitalValue" required v-show="other.isReady">
                <el-select v-model="readyForm.hospitalValue" @change="loadDept()">
                  <el-option v-for="item in readyForm.hospitalList" :key="item.hospitalID" :label="item.hospitalName" :value="item.hospitalID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="科室:" prop="deptValue" required v-show="other.isReady">
                <el-select v-model="readyForm.deptValue">
                  <el-option v-for="item in readyForm.deptList" :key="item.depID" :label="item.depName" :value="item.depID"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查类型:" prop="examineTypeValue" required>
                <el-select v-model="readyForm.examineTypeValue">
                  <el-option v-for="item in readyForm.examineTypeList" :key="item.dataDicValueCode" :label="item.dataDicValueName" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="loadReadySave()">确 定</el-button>
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
      readyForm: {
        radio: 1,
        hospitalList: [],
        deptList: [],
        examineTypeList: [],
        hospitalValue: '',
        deptValue: '',
        examineTypeValue: ''
      },
      array: {
        treeOptions: [],//树形数据
        tableData: []//表格数据
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
        isAdd: true,
        isReady: false,
        isContinue: true
      },
      alert: {
        popupVisible: false,
        readyVisible: false
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
      this.$http.get(this.$location.sysDepartmentManagerfindTree).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        this.array.treeOptions = res;
      });
    },
    //查询数据
    queryData(can) {
      let treeValueLen = this.form.treeValue.length;
      this.treeArea(this.array.treeOptions,this.form.treeValue[treeValueLen-1]);
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysDepartmentManagerfindPage,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          parentDepID: this.form.treeValue[treeValueLen-1],
          pageStart: this.other.pageStart,
          depCode: '',
          depName: ''
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        let sysDepartmentList = res.sysDepartmentList;
        this.other.totalCount = res.totalCount;
        if(can){
          this.array.tableData = sysDepartmentList;
        }else{
          this.array.tableData.push(...sysDepartmentList);
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
        this.popupForm.hospitalID = res.hospitalID;
        this.popupForm.hospitalName = res.hospitalName;
        this.popupForm.parentDepID = res.parentDepID;
        this.popupForm.parentDepName = res.parentDepName;
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
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.loadReady();
      });
      //判断是 保存/保存并新建
      if(type == '1'){
        this.other.isContinue = false;
      }else{
        this.popupForm.checked = false;
        this.alert.popupVisible = false;
        this.other.isContinue = true;
      }
    },
    //数据初始化
    loadReady() {
      this.$http.get(this.$location.sysDepartmentManagerloadReady).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        let sysHospitalManagerList = res.sysHospitalManagerList;
        let examineTypeList = res.examineTypeList;
        this.readyForm.hospitalList = sysHospitalManagerList;
        this.readyForm.examineTypeList = examineTypeList;
        this.alert.readyVisible = true;
      });
    },
    //初始化数据来源切换
    radioChange() {
      if(this.readyForm.radio == '1'){
        this.other.isReady = false;
      }else if(this.readyForm.radio == '2'){
        this.other.isReady = true;
      }
    },
    //初始化数据-院区联动科室
    loadDept() {
      this.$http.get(this.$location.sysUserInfoloadDept,{
        params: {
          hospitalID: this.readyForm.hospitalValue
        }
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        this.readyForm.deptList = res;
      });
    },
    //数据初始化保存
    loadReadySave() {
      let param;
      let arr = this.readyForm.hospitalList.filter(o => o.hospitalID == this.readyForm.hospitalValue);
      if(this.readyForm.radio == 1){
        param = {
          hospitalName: this.popupForm.hospitalName,
          depName: this.popupForm.depName,
          examineType: this.readyForm.examineTypeValue
        }
      }else if(this.readyForm.radio == 2){
        param = {
          hospitalID: this.readyForm.hospitalValue,
          hospitalName: arr[0].hospitalName,
          depID: this.readyForm.deptValue,
          depName: this.popupForm.depName,
          examineType: this.readyForm.examineTypeValue
        }
      }
      this.$http.get(this.$location.sysDepartmentManagerloadData,{
        params: param
      }).then(data => {
        let returnCode = data.returnCode;
        let res = data.returnContent;
        this.$message({
          type: 'success',
          message: res,
          duration: 1000
        });
        this.alert.readyVisible = false;
        this.readyForm.radio = 1;
        this.resetForm('readyForm');
        if(this.other.isContinue == true){
          this.resetForm('popupForm');
        }else{
          this.popupForm.depCode = '';
          this.popupForm.depName = '';
          this.popupForm.phone = '';
          this.popupForm.checked = false;
        }
        this.queryData(true);
        this.findTree();
      });
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
        this.$message({
          type: 'success',
          message: msg,
          duration: 1000
        });
        this.queryData(true);
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
          this.$message({
            type: 'success',
            message: msg,
            duration: 1000
          });
          this.queryData(true);
          this.findTree();
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
<style lang='less'>
.managementDepartment {
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
    }
  }
  .popup{
    .this_check{
      padding-left: 120px;
      padding-top: 8px;
    }
  }
  .popup_ready{
    .this_tips{
      font-size: 16px;
      margin-bottom: 15px;
    }
    .this_radio{
      margin-bottom: 10px;
    }
  }
}
</style>