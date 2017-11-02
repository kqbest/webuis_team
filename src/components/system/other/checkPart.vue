<template>
  <section class="checkPart">
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
          <el-breadcrumb-item>其他设置</el-breadcrumb-item>
          <el-breadcrumb-item>检查部位</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData(true)">刷新</el-button>
        <span class="mlem">
            检查部位共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <section class="main">
      <el-table v-scroll='queryData' :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" align="center" width="120">
          <template scope="scope">
            <el-button :plain="true" type="success" size="mini" icon="edit" @click="editInfo(scope.row.partID)"></el-button>
            <el-button :plain="true" type="danger" size="mini" icon="delete" @click="deleted(scope.row.partID)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="部位编码" prop="partID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部位名称" prop="partName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上级部位编码" prop="parentPartID" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="上级部位名称" prop="parentPartName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查项目" prop="examineItemName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="绑定机房" prop="bandExamRoomName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="检查系数" prop="examineRatio" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="书写系数" prop="writeRatio" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="部位分类" prop="classifyPartName" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="分类检查系数" prop="classifyExamineRatio" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="分类书写系数" prop="classifyWriteRatio" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.partID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="popup">
      <el-dialog :title="other.title" size="small" top="18%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="100px" :rules="rules">
          <el-row>
            <el-col :span="8">
              <el-form-item label="检查类型:">
                <span>{{ popupForm.examineType }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="父类编码:">
                <span>{{ popupForm.parentPartID }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="父类名称:">
                <span>{{ popupForm.parentPartName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="部位代码:" prop="partCode">
                <el-input v-model="popupForm.partCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部位名称:" prop="partName">
                <el-input v-model="popupForm.partName" @change="loadPingYin"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="英文名称:" prop="englishName">
                <el-input v-model="popupForm.englishName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="拼音:" prop="spell">
                <el-select v-model="popupForm.spell" clearable placeholder="请选择">
                  <el-option v-for="item in array.spellList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对应代码:" prop="hISCode">
                <el-input v-model="popupForm.hISCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检查费用:" prop="checkFee">
                <el-input v-model="popupForm.checkFee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="绑定机房:" prop="bandExamRoom">
                <el-select v-model="popupForm.bandExamRoom" multiple placeholder="请选择">
                  <el-option v-for="item in array.bandExamRoomList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检查项目:" prop="examineItem">
                <el-select v-model="popupForm.examineItem" clearable placeholder="请选择">
                  <el-option v-for="item in array.examineItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="部位分类:" prop="classifyPartName">
                <el-select v-model="popupForm.classifyPartName" clearable placeholder="请选择">
                  <el-option v-for="item in array.classifyPartNameList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="检查系数:" prop="examineRatio">
                <el-input v-model="popupForm.examineRatio"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="书写系数:" prop="writeRatio">
                <el-input v-model="popupForm.writeRatio"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="审核系数:" prop="auditRatio">
                <el-input v-model="popupForm.auditRatio"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8"> 
              <el-form-item label="分类审核系数:" prop="classifyAuditRatio">
                <el-input v-model="popupForm.classifyAuditRatio"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类检查系数:" prop="classifyExamineRatio">
                <el-input v-model="popupForm.classifyExamineRatio"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类书写系数:" prop="classifyWriteRatio">
                <el-input v-model="popupForm.classifyWriteRatio"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="注意事项:" prop="attention">
                <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="popupForm.attention"></el-input>
              </el-form-item>
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
      form: {
        treeValue: []
      },
      popupForm: {
        hospitalID: "",
        departmentID: "",
        examineType: "",
        parentPartID: "",
        parentPartName: "",
        partCode: "",
        partName: "",
        englishName: "",
        spell: "",
        hISCode: "",
        checkFee: "",
        bandExamRoom: "",
        examineItem: "",
        examineRatio: "",
        writeRatio: "",
        auditRatio: "",
        classifyPartName: "",
        classifyAuditRatio: "",
        classifyExamineRatio: "",
        classifyWriteRatio: "",
        attention: "",
        partID: ''
      },
      rules: {
        partCode: [{ required: true, message: "请输入部位代码", trgger: "blur" }],
        partName: [{ required: true, message: "请输入部位名称", trgger: "blur" }],
        spell: [{ required: true, message: "请选择拼音", trgger: "blur" }],
        checkFee: [{ 
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        examineRatio: [{ 
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        writeRatio: [{ 
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        auditRatio: [{
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        classifyExamineRatio: [{
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        classifyWriteRatio: [{
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }],
        classifyAuditRatio: [{
          message: "请输入数字", 
          trgger: "blur",
          validator: (rule, value, callback) => {
            if (this.isNumber(value)) {
              callback();
            } else {
              callback(new Error());
            }
          }
        }]
      },
      array: {
        treeOptions: [], //树形数据
        tableData: [], //表格数据
        bandExamRoomList: [], //绑定机房数据
        examineItemList: [], //检查项目数据
        classifyPartNameList: [], //部位分类数据
        spellList: [] //拼音数据
      },
      obj: {
        treeProps: {
          value: "treeID",
          label: "treeName",
          children: "childList"
        },
        tableParms: {
          hospitalID: "",
          departmentID: "",
          examineType: "",
          parentPartID: ""
        }
      },
      other: {
        totalCount: "",
        pageStart: "0",
        title: "新建",
        isAdd: true,
        isFirst: true //判断是否是初次加载树形，如果是给treeValue添加默认值
      },
      alert: {
        popupVisible: false
      }
    };
  },
  computed: {},
  created() {
    this.findTree();
  },
  methods: {
    //加载树形
    findTree() {
      this.$http.get(this.$location.sysExamineBodyPartfindTree).then(data => {
        let res = data.returnContent;
        this.array.treeOptions = res || [];
        //默认选中第一个
        if (this.array.treeOptions.length > 0) {
          if (this.other.isFirst) {
            this.form.treeValue.push(this.array.treeOptions[0].treeID);
            this.other.isFirst = false;
            let len = this.form.treeValue.length;
            this.treeArea(this.array.treeOptions, this.form.treeValue[len - 1]);
            this.queryData(true);
          }
        }
      });
    },
    //查询数据
    queryData(can) {
      let len = this.form.treeValue.length;
      can ? (this.other.pageStart = 0) : this.other.pageStart++;
      this.$http.get(this.$location.sysExamineBodyPartfindPage, {
        params: {
          examineType: this.obj.tableParms.examineType,
          parentPartID: this.obj.tableParms.parentPartID,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysExamineBodyPartList;
        if (can) {
          this.array.tableData = list || [];
        } else {
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysExamineBodyPartinsertReady, {
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          examineType: this.obj.tableParms.examineType
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.bandExamRoomList = res.bandExamRoomList;
        this.array.examineItemList = res.examineItemList;
        this.array.classifyPartNameList = res.classifyPartNameList;
        this.popupForm.hospitalID = this.obj.tableParms.hospitalID;
        this.popupForm.departmentID = this.obj.tableParms.departmentID;
        this.popupForm.examineType = this.obj.tableParms.examineType;
        this.popupForm.parentPartID = this.obj.tableParms.parentPartID;
      });
      this.other.title = "新建";
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        this.popupForm.bandExamRoom = this.popupForm.bandExamRoom.join(','); //数组转成逗号隔开的字符串
        this.$http.get(this.$location.sysExamineBodyPartinsert, {
          params: this.popupForm
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          resolve();
          this.queryData(true);
        });
      } else { //编辑保存
        this.popupForm.bandExamRoom = this.popupForm.bandExamRoom.join(','); //数组转成逗号隔开的字符串
        this.$http.get(this.$location.sysExamineBodyPartupdate, {
          params: this.popupForm
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          resolve();
          this.queryData(true);
        });
      }
    },
    //编辑
    editInfo(partID) {
      this.$http.get(this.$location.sysExamineBodyPartupdateQuery, {
        params: {
          partID: partID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.bandExamRoomList = res.bandExamRoomList;
        this.array.examineItemList = res.examineItemList;
        this.array.classifyPartNameList = res.classifyPartNameList;
        this.array.spellList = res.spellArray;
        let info = res.sysExamineBodyPart;
        this.popupForm = this.copy(info);
        this.popupForm.bandExamRoom = this.popupForm.bandExamRoom.split(','); //逗号隔开的字符串转成数组
      });
      this.other.title = "编辑";
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //启用状态
    enabledState(partID, state) {
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
        this.$http.get(this.$location.sysExamineBodyPartupdateState, {
          params: {
            partID: partID,
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
    deleted(partID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.sysExamineBodyPartdelete, {
          params: {
            partID: partID
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
    //获取拼音
    loadPingYin() {
      if (this.popupForm.partName != "") {
        this.popupForm.spell = "";
        this.$http.get(this.$location.sysExamineBodyPartloadPingYin, {
          params: {
            partName: this.popupForm.partName
          }
        }).then(data => {
          this.array.spellList = data.returnContent.spellArray;
        });
      }
    },
    //正整数校验
    isNumber(value) {
      let isNumber = /^\d+$/; //正整数
      if (value != '') {
        if (isNumber.test(value)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    //递归取数据
    treeArea(dataList, thisId) {
      if (dataList.length > 0) {
        if (thisId == undefined) {
          return false;
        }
        dataList.forEach((k, i) => {
          if (k.treeID == thisId) {
            console.log("success");
            this.obj.tableParms.hospitalID = k.hospitalID;
            this.obj.tableParms.departmentID = k.departmentID;
            this.obj.tableParms.examineType = k.examineType;
            this.popupForm.treeID = k.treeID;
            this.obj.tableParms.parentPartID = k.treeID;
            this.popupForm.parentPartName = k.treeName;
            return false;
          } else {
            if (k.childList.length > 0) {
              this.treeArea(k.childList, thisId);
              console.log("go");
            } else {
              console.log("end");
              return false;
            }
          }
        });
      }
    },
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.bandExamRoomList = [];
      this.array.examineItemList = [];
      this.array.classifyPartNameList = [];
      this.alert.popupVisible = false;
    }
  }
};
</script>
<style lang='less'>
.checkPart {
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
      .el-table__header {
        width: 100% !important;
      }
      .el-table__empty-block {
        width: 100% !important;
      }
      .el-button {
        margin-left: 0;
      }
      .this_enable {
        color: green;
        cursor: pointer;
      }
    }
  }
}
</style>