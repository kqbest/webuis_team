<template>
  <section class="endoscope">
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
          <el-breadcrumb-item>内镜信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            内镜信息共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.endoscapicID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.endoscapicID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="examineType" label="检查类型" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoscapicNO" label="内镜编号" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endotencileNO" label="钢号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoscapicCardNo" label="内镜卡号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoscapicType" label="内镜类别" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endoscapicName" label="内镜型号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="repairScope" label="保修范围" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.endoscapicID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="small" top="30%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm" :rules="rules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查类型:" prop="examineType">
                <el-input v-model="popupForm.examineType" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="检查项目:" prop="examineItem">
                <el-select v-model="popupForm.examineItem" clearable placeholder="请选择">
                  <el-option v-for="item in array.examineItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="内镜编号:" prop="endoscapicNO">
                <el-input v-model="popupForm.endoscapicNO"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="钢号:" prop="endotencileNO">
                <el-input v-model="popupForm.endotencileNO"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="内镜卡号:" prop="endoscapicCardNo">
                <el-input v-model="popupForm.endoscapicCardNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="内镜类型:" prop="endoscapicType">
                <el-input v-model="popupForm.endoscapicType"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="内镜型号:" prop="endoscapicName">
                <el-input v-model="popupForm.endoscapicName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="保修范围:" prop="repairScope">
                <el-input v-model="popupForm.repairScope"></el-input>
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
      navForm: {
        examineType: ''
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        examineType: '',
        examineItem: '',
        endoscapicNO: '',//内镜编号
        endotencileNO: '',//钢号
        endoscapicCardNo: '',//内镜卡号
        endoscapicType: '',//内镜类别
        endoscapicName: '',//内镜型号
        repairScope: '',//保修范围
        endoscapicID: ''
      },
      rules: {
        endoscapicNO:[{ required: true, message: '内镜编号不能为空', trgger: 'blur' }]
      },
      array: {
        tableData: [], //列表数据
        examineItemList: [] //检查项目数据
      },
      obj: {},
      other: {
        pageStart: '0',
        totalCount: '0',
        title: '新增',
        isAdd: true //判断是否是新建
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
      this.$http.get(this.$location.endoscopeInformationfindTree).then(data => {
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
      this.$http.get(this.$location.endoscopeInformationfindPage,{
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
        let list = res.endoscopeInformationList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.endoscopeInformationinsertReady,{
        params: {
          examineType: this.navForm.examineType
        }
      }).then(data => {
        this.popupForm.examineType = data.returnContent.examineTypeName;
        this.array.examineItemList = data.returnContent.examineItemList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        this.$http.get(this.$location.endoscopeInformationinsert,{
          params: this.popupForm
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000
          });
          resolve(); //成功的回调
          this.queryData(true);
        });
      } else { //编辑保存
        this.$http.get(this.$location.endoscopeInformationupdate,{
          params: this.popupForm
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000
          });
          resolve(); //成功的回调
          this.queryData(true);
        });
      }
    },
    //编辑
    editInfo(endoscapicID) {
      this.$http.get(this.$location.endoscopeInformationupdateQuery,{
        params: {
          endoscapicID: endoscapicID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineItemList = res.examineItemList || [];
        let info = res.endoscopeInformation;
        this.popupForm.hospitalID = info.hospitalID;
        this.popupForm.departmentID = info.departmentID;
        this.popupForm.examineType = info.examineType;
        this.popupForm.examineItem = info.examineItem;
        this.popupForm.endoscapicNO = info.endoscapicNO;//内镜编号
        this.popupForm.endotencileNO = info.endotencileNO;//钢号
        this.popupForm.endoscapicCardNo = info.endoscapicCardNo;//内镜卡号
        this.popupForm.endoscapicType = info.endoscapicType;//内镜类别
        this.popupForm.endoscapicName = info.endoscapicName;//内镜型号
        this.popupForm.repairScope = info.repairScope;//保修范围
        this.popupForm.endoscapicID = endoscapicID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //启用状态
    enabledState(endoscapicID, state) {
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
        this.$http.get(this.$location.endoscopeInformationupdateState, {
          params: {
            endoscapicID: endoscapicID,
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
    deleted(endoscapicID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.endoscopeInformationdelete, {
          params: {
            endoscapicID: endoscapicID
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
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.examineItemList = [];
      this.alert.popupVisible = false;
    }
  }
}
</script>

<style lang='less'>
.endoscope{
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
}
</style>