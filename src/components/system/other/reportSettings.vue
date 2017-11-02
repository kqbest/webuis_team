<template>
  <section class="reportSettings">
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>其他设置</el-breadcrumb-item>
          <el-breadcrumb-item>报告项设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            报告项设置共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.reportItemID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="examineTypeName" label="检查类型" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examineItemName" label="检查项目" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="contentItemName" label="内容项" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.reportItemID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="tiny" top="30%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm" :rules="rules">
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查类型:" prop="examineType">
                <el-select v-model="popupForm.examineType" clearable placeholder="请选择" @change="loadExamineItem">
                  <el-option v-for="item in array.examineTypeList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="检查项目:" prop="examineItem">
                <el-select v-model="popupForm.examineItem" clearable placeholder="请选择">
                  <el-option v-for="item in array.examineItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="内容项:" prop="contentItem">
                <el-select v-model="popupForm.contentItem" multiple placeholder="请选择">
                  <el-option v-for="item in array.contentItemList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
                </el-select>
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
      popupForm: {
        examineType: '',
        examineItem: '',
        contentItem: [],
        reportItemID: ''
      },
      rules: {
        examineType:[{ required: true, message: '请选择检查类型', trgger: 'blur' }],
        contentItem:[{
          trgger: 'blur',
          validator: (rule, value, callback) => {
            console.log(value);
            if (value.length > 0) {
              callback();
            } else {
              callback(new Error('请选择检查类型'));
            }
          }
        }]
      },
      array: {
        tableData: [], //列表数据
        examineTypeList: [], //检查类型数据
        examineItemList: [], //检查项目数据
        contentItemList: [] //内容项数据
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
    this.queryData(true);
  },
  methods: {
    //加载列表
    queryData(can) {
      can ? (this.pageStart = 0) : this.pageStart ++;
      this.$http.get(this.$location.sysReportItemfindPage,{
        params:{
          pageStart: this.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysReportItemList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysReportIteminsertReady).then(data => {
        this.array.examineTypeList = data.returnContent.examineTypeList || [];
        this.array.contentItemList = data.returnContent.contentItemList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        this.$http.get(this.$location.sysReportIteminsert,{
          params: {
            examineType: this.popupForm.examineType,
            examineItem: this.popupForm.examineItem,
            contentItem: this.popupForm.contentItem.join(',')
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
        });
      } else { //编辑保存
        this.$http.get(this.$location.sysReportItemupdate,{
          params: {
            examineType: this.popupForm.examineType,
            examineItem: this.popupForm.examineItem,
            contentItem: this.popupForm.contentItem.join(','),
            reportItemID: this.popupForm.reportItemID
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
        });
      }
    },
    //编辑
    editInfo(dataList) {
      this.$http.get(this.$location.sysReportItemupdateQuery,{
        params: {
          reportItemID: dataList.reportItemID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineTypeList = res.examineTypeList || [];
        this.array.examineItemList = res.examineItemList || [];
        this.array.contentItemList = res.contentItemList || [];
        let info = res.sysReportItem;
        this.popupForm.examineType = info.examineType;
        this.popupForm.examineItem = info.examineItem;
        this.popupForm.contentItem = info.contentItem.split(',');
        this.popupForm.reportItemID = dataList.reportItemID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //启用状态
    enabledState(reportItemID, state) {
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
        this.$http.get(this.$location.sysReportItemupdateState, {
          params: {
            reportItemID: reportItemID,
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
    deleted(reportItemID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.sysReportItemdelete, {
          params: {
            reportItemID: reportItemID
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
    //加载检查项目
    loadExamineItem() {
      this.$http.get(this.$location.sysReportItemloadExamineItem,{
        params: {
          examineType: this.popupForm.examineType
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineItemList = data.returnContent.examineItemList || [];
      });
    },
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.examineTypeList = [];
      this.array.examineItemList = [];
      this.array.contentItemList = [];
      this.alert.popupVisible = false;
    }
  }
}
</script>

<style lang='less'>
.reportSettings{
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