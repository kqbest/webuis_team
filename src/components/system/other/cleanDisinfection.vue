<template>
  <section class="cleanDisinfection">
    <nav class="pub_select">
      <el-form :model="navForm" ref="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="检查类型:" prop="examineType">
              <el-select v-model="navForm.examineType" placeholder="请选择">
                <el-option v-for="item in array.examineTypeList" :key="item.examineType" :label="item.examineType" :value="item.examineType"></el-option>
              </el-select>
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
          <el-breadcrumb-item>其他设置</el-breadcrumb-item>
          <el-breadcrumb-item>清洗消毒</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            清洗消毒共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.sterilizeID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.sterilizeID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="sterilizeID" label="序号" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fieldName" label="字段名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fieldTypeName" label="数据类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="fieldUnit" label="单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.sterilizeID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="small" top="26%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm" :rules="rules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查类型:" prop="examineType">
                <el-input v-model="popupForm.examineType" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="字段名称:" prop="fieldName">
                <el-input v-model="popupForm.fieldName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="单位:" prop="fieldUnit">
                <el-input v-model="popupForm.fieldUnit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="数据类型:" prop="fieldType">
                <el-select v-model="popupForm.fieldType" placeholder="请选择" @change="whichShow">
                  <el-option v-for="item in array.dataTypeList" :key="item.dataDicValueCode" :label="item.dataDicValueName" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="other.isShow=='1'">
            <el-col :span="11">
              <el-form-item label="默认值:" prop="defaultV">
                <el-input v-model="popupForm.defaultV"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="other.isShow=='2'">
            <el-col :span="11">
              <el-form-item label="时间格式:" prop="dateTimeType">
                <el-select v-model="popupForm.dateTimeType" placeholder="请选择">
                  <el-option v-for="item in array.timeFormatList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-show="other.isShow=='3'">
            <el-col :span="24">
              <div class="select_cnt">
                <div class="codeValue">
                  <span>字段值:</span>
                  <el-button type="primary" size="mini" @click="addRow">新增</el-button>
                </div>
                <el-table :data="array.tableData1" stripe height="200">
                  <el-table-column prop="input" label="内容" align="center" show-overflow-tooltip>
                    <template scope="scope">
                      <el-input v-model="scope.row.input"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop="check" label="默认" align="center" show-overflow-tooltip>
                    <template scope="scope">
                      <el-checkbox v-model="scope.row.check"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template scope="scope">
                      <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
                        <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleteRow(scope.$index)"></el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="submitForm('popupForm',infoSave,'popupVisible')">保 存</el-button>
          <el-button type="primary" v-show="other.isAdd" @click="submitForm('popupForm',infoSave)">保存并新建</el-button>
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
      navForm: {
        examineType: ''
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        examineType: '',
        fieldName: '',//字段名称
        fieldUnit: '',//单位
        fieldType: '',//数据类型
        defaultV: '',//默认值
        dateTimeType: '',//时间格式
        sterilizeValue: '',//下拉组合
        sterilizeID: ''
      },
      rules: {
        fieldType:[{ required: true, message: '请选择数据类型', trgger: 'blur' }],
        fieldName:[{ required: true, message: '请输入字段名称', trgger: 'blur' }]
      },
      array: {
        tableData: [], //列表数据
        dataTypeList: [], //数据类型数据
        timeFormatList: [], //时间格式数据
        tableData1: [] //列表数据
      },
      obj: {},
      other: {
        pageStart: '0',
        totalCount: '0',
        title: '新增',
        isAdd: true, //判断是否是新建
        isShow: '4' //判断展示哪个数据类型的内容 1:数据类型、数值类型 2:时间类型 3:下拉框类型
      },
      alert: {
        popupVisible: false
      }
    }
  },
  computed: {},
  created() {
    this.findTree();
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.cleanSterilizefindTree).then(data => {
        let res = data.returnContent;
        this.array.examineTypeList = res || [];
        //默认选中第一个
        if (this.array.examineTypeList.length > 0) {
          this.navForm.examineType = this.array.examineTypeList[0].examineType;
        }
        this.queryData(true);
      });
    },
    //加载列表
    queryData(can) {
      can ? (this.pageStart = 0) : this.pageStart ++;
      this.$http.get(this.$location.cleanSterilizefindPage,{
        params:{
          examineType: this.navForm.examineType,
          pageStart: this.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        this.popupForm.hospitalID = res.hospitalID;
        this.popupForm.departmentID = res.departmentID;
        this.popupForm.examineType = res.examineType;
        let list = res.cleanSterilizeList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.cleanSterilizeinsertReady).then(data => {
        this.array.dataTypeList = data.returnContent.dataTypeList || [];
        this.array.timeFormatList = data.returnContent.timeFormatList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        let arr = '';
        if (this.array.tableData1.length > 0) {
          this.array.tableData1.forEach((k, i) => {
            if (arr == '') {
              arr = k.input + ',' + k.check;
            } else {
              arr += ';' + k.input + ',' + k.check;
            }
          });
        }
        this.$http.get(this.$location.cleanSterilizeinsert,{
          params: {
            hospitalID: this.popupForm.hospitalID,
            departmentID: this.popupForm.departmentID,
            examineType: this.popupForm.examineType,
            fieldName: this.popupForm.fieldName,
            fieldUnit: this.popupForm.fieldUnit,
            fieldType: this.popupForm.fieldType,
            defaultV: this.popupForm.defaultV,
            dateTimeType: this.popupForm.dateTimeType,
            sterilizeValue: arr
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000
          });
          resolve(); //成功的回调
          this.queryData(true);
          this.other.isShow = '4';
        });
      } else { //编辑保存
        let thisID = this.popupForm.sterilizeID;
        let arr = '';
        if (this.array.tableData1.length > 0) {
          this.array.tableData1.forEach((k, i) => {
            if (arr == '') {
              arr = thisID + ',' + k.input + ',' + k.check;
            } else {
              arr += ';' + thisID + ',' + k.input + ',' + k.check;
            }
          });
        }
        this.$http.get(this.$location.cleanSterilizeupdate,{
          params: {
            sterilizeID: this.popupForm.sterilizeID,
            hospitalID: this.popupForm.hospitalID,
            departmentID: this.popupForm.departmentID,
            examineType: this.popupForm.examineType,
            fieldName: this.popupForm.fieldName,
            fieldUnit: this.popupForm.fieldUnit,
            fieldType: this.popupForm.fieldType,
            defaultV: this.popupForm.defaultV,
            dateTimeType: this.popupForm.dateTimeType,
            sterilizeValue: arr
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000
          });
          resolve(); //成功的回调
          this.queryData(true);
          this.other.isShow = '4';
        });
      }
    },
    //编辑
    editInfo(sterilizeID) {
      this.array.tableData1 = [];
      this.$http.get(this.$location.cleanSterilizeupdateQuery,{
        params: {
          sterilizeID: sterilizeID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineItemList = res.examineItemList || [];
        let info = res.cleanSterilize;
        this.popupForm.sterilizeID = sterilizeID;
        this.popupForm.hospitalID = info.hospitalID;
        this.popupForm.departmentID = info.departmentID;
        this.popupForm.examineType = info.examineType;
        this.popupForm.fieldName = info.fieldName;
        this.popupForm.fieldUnit = info.fieldUnit;
        this.popupForm.fieldType = info.fieldType.toString();
        this.popupForm.defaultV = info.defaultV;
        this.popupForm.dateTimeType = info.dateTimeType;
        if (res.cleanSterilizeValueList.length > 0) {
          res.cleanSterilizeValueList.forEach((k, i) => {
            if (k.defaultValue == '0') {
              k.defaultValue = false;
            }else if(k.defaultValue == '1'){
              k.defaultValue = true;
            }
            let row = {
              input: k.sterilizeValue,
              check: k.defaultValue
            };
            this.array.tableData1.push(row);
          });
        }
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //启用状态
    enabledState(sterilizeID, state) {
      let stateName;
      if (state == "0") {
        state = "1";
        stateName = "启用";
      } else if (state == "1") {
        state = "0";
        stateName = "停用";
      }
      this.$confirm(`是否确认${stateName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.cleanSterilizeupdateState, {
          params: {
            sterilizeID: sterilizeID,
            state: state
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        });
      }).catch(() => {});
    },
    //删除
    deleted(sterilizeID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.cleanSterilizedelete, {
          params: {
            sterilizeID: sterilizeID
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          this.queryData(true);
        });
      }).catch(() => {});
    },
    //增加行
    addRow() {
      this.array.tableData1.push({
        input: '',
        check: false
      });
    },
    //删除行
    deleteRow(index) {
      this.array.tableData1.splice(index,1);
    },
    //判断展示哪个数据类型的内容
    whichShow() {
      let value = this.popupForm.fieldType;
      if (value == '1' || value == '5' || value == '7') {
        this.other.isShow = '1';
      } else if (value == '4') {
        this.other.isShow = '2';
      }else{
        this.other.isShow = '3';
      }
    },
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.examineItemList = [];
      this.alert.popupVisible = false;
      this.other.isShow = '4';
    }
  }
}
</script>

<style lang='less'>
.cleanDisinfection{
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
      .el-button--danger.is-plain{
        margin-left: 0;
      }
      .this_enable {
        color: green;
        cursor: pointer;
      }
    }
  }
  .this_popup{
    .select_cnt{
      padding: 0 60px 0 40px;
      .codeValue{
        margin-bottom: 10px;
        >span:nth-child(1){
          margin-right: 20px;
        }
      }
    }
  }
}
</style>