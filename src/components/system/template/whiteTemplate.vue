<template>
  <section class="whiteTemplate">
    <nav class="pub_select">
      <el-form ref="form" :model="form" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="部位分类:" prop="treeValue">
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
          <el-breadcrumb-item>模板设置</el-breadcrumb-item>
          <el-breadcrumb-item>书写模板</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            书写模板共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <section class="main">
      <div class="this_table">
        <el-table v-scroll='queryData' :data="array.tableData" stripe border height="100" @row-click="showInfo">
          <el-table-column label="操作" align="center" width="150">
            <template scope="scope">
              <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.writeTemplateID)"></el-button>
              <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.writeTemplateID)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="模板名称" prop="templateName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="启用状态" align="center" width="150">
            <template scope="scope">
              <span class="this_enable" @click="enabledState(scope.row.writeTemplateID,scope.row.state)">{{ scope.row.stateName }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="this_show">
        <el-form :model="showForm" ref="showForm" label-width="120px">
          <el-row>
            <el-col :span="22">
              <el-form-item label="模板名称:" prop="templateName">
                <span>{{ showForm.templateName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查所见:" prop="findings">
                <el-input type="textarea" :rows="4" placeholder="" v-model="showForm.findings" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查诊断:" prop="diagnosis">
                <el-input type="textarea" :rows="3" placeholder="" v-model="showForm.diagnosis" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="术后医嘱:" prop="postoperative">
                <el-input type="textarea" :rows="2" placeholder="" v-model="showForm.postoperative" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="提示语:" prop="hintInfo">
                <span>{{ showForm.hintInfo }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="阴阳性:" prop="masculine">
                <span>{{ showForm.masculine }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="绑定项目:" prop="examineItem">
                <span>{{ showForm.examineItem }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="16%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" :rules="rules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="模板归属:" prop="templateType">
                <el-radio v-model="popupForm.templateType" label="0">公共模板</el-radio>
                <el-radio v-model="popupForm.templateType" label="1">个人模板</el-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查类型:" prop="examineType">
                <span>{{ popupForm.examineType }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="defaultTemplate">
                <el-checkbox v-model="popupForm.defaultTemplate">默认模板</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="模板名称:" prop="templateName" required>
                <el-input type="text" placeholder="" v-model="popupForm.templateName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查所见:" prop="findings" required>
                <el-input type="textarea" :rows="4" placeholder="" v-model="popupForm.findings"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查诊断:" prop="diagnosis" required>
                <el-input type="textarea" :rows="3" placeholder="" v-model="popupForm.diagnosis"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="术后医嘱:" prop="postoperative">
                <el-input type="textarea" :rows="2" placeholder="" v-model="popupForm.postoperative"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="提示语:" prop="hintInfo">
                <el-input type="text" placeholder="" v-model="popupForm.hintInfo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="阴阳性:" prop="masculine">
                <el-select v-model="popupForm.masculine" clearable placeholder="请选择">
                  <el-option v-for="item in array.masculineList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="绑定项目:" prop="examineItem">
                <el-select v-model="popupForm.examineItem" multiple placeholder="请选择">
                  <el-option v-for="item in array.examineItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" v-show="other.isAdd" @click="submitForm('popupForm',addInfoSave)">保 存</el-button>
          <el-button type="primary" v-show="!other.isAdd" @click="submitForm('popupForm',editInfoSave)">保 存</el-button>
          <el-button type="primary" v-show="other.isAdd" @click="submitForm('popupForm',addInfoSave('1'))">保存并新建</el-button>
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
      showForm: {
        templateName: '',
        findings: '',
        diagnosis: '',
        postoperative: '',
        hintInfo: '',
        masculine: '',
        examineItem: ''
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        templateType: '0',
        examineType: '',
        defaultTemplate: false,
        templateName: '',
        findings: '',
        diagnosis: '',
        postoperative: '',
        hintInfo: '',
        masculine: '',
        examineItem: '',
        writeTemplateID: ''
      },
      rules: {
        templateName: [
          {required: true, message: '请输入模板名称',trgger: 'blur'}
        ],
        findings: [
          {required: true, message: '请输入检查所见',trgger: 'blur'}
        ],
        diagnosis: [
          {required: true, message: '请输入检查诊断',trgger: 'blur'}
        ]  
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
        masculineList: [],//阴阳性数据
        examineItemList: []//检查项目数据
      },
      obj: {
        treeProps:{
          value: 'treeID',   
          label: 'treeName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          departmentID: '',
          examineType: '',
          classRealtedID: ''
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
      this.$http.get(this.$location.sysWriteTemplatefindTree).then(data => {
        let res = data.returnContent;
        this.array.treeOptions = res || [];
        //默认选中第一个
        if(this.array.treeOptions.length > 0){
          if(this.other.isFirst){
            this.form.treeValue.push(this.array.treeOptions[0].treeID);
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
      let len = this.form.treeValue.length;
      can ? this.other.pageStart = 0 : this.other.pageStart++;
      this.$http.get(this.$location.sysWriteTemplatefindPage,{
        params: {
          examineType: this.obj.tableParms.examineType,
          classRealtedID: this.form.treeValue[len-1],
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysWriteTemplateList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysWriteTemplateinsertReady,{
        params: {
          examineType: this.obj.tableParms.examineType
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.masculineList = res.masculineList;
        this.array.examineItemList = res.examineItemList;
        this.popupForm.hospitalID = this.obj.tableParms.hospitalID;
        this.popupForm.departmentID = this.obj.tableParms.departmentID;
        this.popupForm.examineType = this.obj.tableParms.examineType;
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //新建保存
    addInfoSave(type) {
      let defaultTemp = '';
      if (this.popupForm.defaultTemplate == true) {
        defaultTemp = '1';
      } else {
        defaultTemp = '0';
      }
      let examineItem = '';
      if (this.popupForm.examineItem != '') {
        examineItem = this.popupForm.examineItem.join(',');
      }
      this.$http.get(this.$location.sysWriteTemplateinsert,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          classRealtedID: this.obj.tableParms.classRealtedID,
          templateType: this.popupForm.templateType,
          examineType: this.popupForm.examineType,
          defaultTemplate: defaultTemp,
          templateName: this.popupForm.templateName,
          findings: this.popupForm.findings,
          diagnosis: this.popupForm.diagnosis,
          postoperative: this.popupForm.postoperative,
          hintInfo: this.popupForm.hintInfo,
          masculine: this.popupForm.masculine,
          examineItem: examineItem
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
      //判断是 保存/保存并新建
      if(type == '1'){
        this.popupForm.templateType = '0';
        this.popupForm.defaultTemplate = false;
        this.popupForm.templateName = '';
        this.popupForm.findings = '';
        this.popupForm.diagnosis = '';
        this.popupForm.postoperative = '';
        this.popupForm.hintInfo = '';
        this.popupForm.masculine = '';
        this.popupForm.examineItem = '';
      }else{
        //清空弹框数据
        this.resetForm('popupForm');
        this.array.masculineList = [];
        this.array.examineItemList = [];
        this.alert.popupVisible = false;
      }
    },
    //编辑
    editInfo(writeTemplateID) {
      this.$http.get(this.$location.sysWriteTemplateupdateQuery,{
        params: {
          writeTemplateID: writeTemplateID
        }
      }).then(data => {
        let res = data.returnContent;
        let info = res.sysWriteTemplate;
        this.array.masculineList = res.masculineList;
        this.array.examineItemList = res.examineItemList;
        this.popupForm.hospitalID = info.hospitalID;
        this.popupForm.departmentID = info.departmentID;
        this.popupForm.templateType = info.templateType.toString();
        this.popupForm.examineType = info.examineType;
        if (info.defaultTemplate == 0) {
          info.defaultTemplate = false;
        } else if(info.defaultTemplate == 1) {
          info.defaultTemplate = true;
        }
        this.popupForm.defaultTemplate = info.defaultTemplate;
        this.popupForm.templateName = info.templateName;
        this.popupForm.findings = info.findings;
        this.popupForm.diagnosis = info.diagnosis;
        this.popupForm.postoperative = info.postoperative;
        this.popupForm.hintInfo = info.hintInfo;
        this.popupForm.masculine = info.masculine;
        this.popupForm.examineItem = info.examineItem.split(',');
        this.popupForm.writeTemplateID = writeTemplateID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //编辑保存
    editInfoSave() {
      let defaultTemp = '';
      if (this.popupForm.defaultTemplate == true) {
        defaultTemp = '1';
      } else {
        defaultTemp = '0';
      }
      let examineItem = '';
      if (this.popupForm.examineItem != '') {
        examineItem = this.popupForm.examineItem.join(',');
      }
      this.$http.get(this.$location.sysWriteTemplateupdate,{
        params: {
          hospitalID: this.popupForm.hospitalID,
          departmentID: this.popupForm.departmentID,
          classRealtedID: this.obj.tableParms.classRealtedID,
          templateType: this.popupForm.templateType,
          examineType: this.popupForm.examineType,
          defaultTemplate: defaultTemp,
          templateName: this.popupForm.templateName,
          findings: this.popupForm.findings,
          diagnosis: this.popupForm.diagnosis,
          postoperative: this.popupForm.postoperative,
          hintInfo: this.popupForm.hintInfo,
          masculine: this.popupForm.masculine,
          examineItem: examineItem,
          writeTemplateID: this.popupForm.writeTemplateID
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
      //清空弹框数据
      this.resetForm('popupForm');
      this.array.masculineList = [];
      this.array.examineItemList = [];
      this.alert.popupVisible = false;
    },
    //启用状态
    enabledState(writeTemplateID,state) {
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
        this.$http.get(this.$location.sysWriteTemplateupdateState,{
          params: {
            writeTemplateID: writeTemplateID,
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
    deleted(writeTemplateID) {
      this.$confirm('是否确认删除该条信息?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(this.$location.sysWriteTemplatedelete,{
          params: {
            writeTemplateID: writeTemplateID
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
    showInfo(row) {
      this.showForm.templateName = row.templateName;
      this.showForm.findings = row.findings;
      this.showForm.diagnosis = row.diagnosis;
      this.showForm.postoperative = row.postoperative;
      this.showForm.hintInfo = row.hintInfo;
      this.showForm.masculine = row.masculine;
      this.showForm.examineItem = row.examineItem;
    },
    //递归取数据
    treeArea(dataList,thisId) {
      if(dataList.length > 0){
        if(thisId == undefined){
          return false;
        }
        dataList.forEach((k, i) => {
          if(k.treeID == thisId){
            console.log('success');
            this.obj.tableParms.hospitalID = k.hospitalID;
            this.obj.tableParms.departmentID = k.departmentID;
            this.obj.tableParms.examineType = k.examineType;
            this.obj.tableParms.classRealtedID = k.treeID;
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
      this.array.masculineList = [];
      this.array.examineItemList = [];
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
.whiteTemplate {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  .main {
    flex-grow: 1;
    height: 100%;
    display: flex;
    border: 1px solid green;
    .this_table{
      flex-grow: 1;
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
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
    .this_show{
      flex-grow: 1;
      width: 50%;
      height: 100%;
      padding-top: 30px;
      display: flex;
      flex-direction: column;
    }
  }
  .popup{
    .el-form{
      .el-form-item{
        margin-bottom: 15px;
        .el-form-item__error{
          padding-top: 2px;
        }
        .el-select{
          width: 100%;
        }
      }
    }
  }
}
</style>