<template>
  <section class="templateBinding">
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>其他设置</el-breadcrumb-item>
          <el-breadcrumb-item>模板绑定</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            模板绑定共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.templateBindID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.templateBindID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="templateTypeName" label="模板类型" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examineTypeName" label="检查类型" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="examineItemName" label="检查项目" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="templateName" label="模板名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="imageCount" label="图片数量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="默认模板" align="center" width="100">
          <template scope="scope">
            <el-checkbox v-model="scope.row.defaultTemplate" disabled></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.templateBindID,scope.row.state)">{{ scope.row.stateName }}</span>
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
                <el-select v-model="popupForm.examineType" clearable placeholder="请选择" @change="loadExamineItem">
                  <el-option v-for="item in array.examineTypeList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
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
              <el-form-item label="模板类型:" prop="templateType">
                <el-select v-model="popupForm.templateType" clearable placeholder="请选择" @change="loadTemplate">
                  <el-option v-for="item in array.templateTypeList" :key="item.dataDicValueCode" :label="item.dataDicValueName" :value="item.dataDicValueCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="图片数量:" prop="imageCount">
                <el-input v-model="popupForm.imageCount"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="模板名称:" prop="templateName">
                <el-select v-model="popupForm.templateName" clearable placeholder="请选择">
                  <el-option v-for="item in array.templateNameList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11" class="pd10_48">
              <el-checkbox v-model="popupForm.defaultTemplate">默认模板</el-checkbox>
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
        examineType: '',
        examineItem: '',
        templateType: '',//模板类型
        imageCount: '',//图片数量
        templateName: '',//模板名称
        defaultTemplate: '',//默认模板
        templateBindID: ''
      },
      rules: {
        examineType:[{ required: true, message: '请选择检查类型', trgger: 'blur' }],
        templateType:[{ required: true, message: '请选择模板类型', trgger: 'blur' }],
        imageCount:[{ required: true, message: '图片数量不能为空', trgger: 'blur' }],
        templateName:[{ required: true, message: '请选择模板名称', trgger: 'blur' }]
      },
      array: {
        tableData: [], //列表数据
        examineTypeList: [], //检查类型数据
        examineItemList: [], //检查项目数据
        templateTypeList: [], //模板类型数据
        templateNameList: [] //模板名称数据
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
      this.$http.get(this.$location.sysTemplateBindfindPage,{
        params:{
          pageStart: this.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        let list = res.sysTemplateBindList;
        if (list.length > 0) {
          list.forEach((k, i) => {
            if (k.defaultTemplate == '1') {
              k.defaultTemplate = true;
            } else if (k.defaultTemplate == '0') {
              k.defaultTemplate = false;
            }
          });
        }
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysTemplateBindinsertReady).then(data => {
        this.array.examineTypeList = data.returnContent.examineTypeList || [];
        this.array.templateTypeList = data.returnContent.templateTypeList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.popupForm.defaultTemplate == true) {
          this.popupForm.defaultTemplate = '1';
        } else {
          this.popupForm.defaultTemplate = '0';
        }
      if (this.other.isAdd == true) { //新建保存
        this.$http.get(this.$location.sysTemplateBindinsert,{
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
        this.$http.get(this.$location.sysTemplateBindupdate,{
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
    editInfo(templateBindID) {
      this.$http.get(this.$location.sysTemplateBindupdateQuery,{
        params: {
          templateBindID: templateBindID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineTypeList = data.returnContent.examineTypeList || [];
        this.array.examineItemList = res.examineItemList || [];
        this.array.templateTypeList = data.returnContent.templateTypeList || [];
        this.array.templateList = data.returnContent.templateList || [];
        let info = res.sysTemplateBind;
        this.popupForm.examineType = info.examineType;
        this.popupForm.examineItem = info.examineItem;
        this.popupForm.templateType = info.templateType;//模板类型
        this.popupForm.imageCount = info.imageCount.toString();//图片数量
        this.popupForm.templateName = info.templateName;//模板名称
        if (info.defaultTemplate == '1') {
          info.defaultTemplate = true;
        } else if (k.defaultTemplate == '0') {
          info.defaultTemplate = false;
        }
        this.popupForm.defaultTemplate = info.defaultTemplate;//默认模板
        this.popupForm.templateBindID = templateBindID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //启用状态
    enabledState(templateBindID, state) {
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
        this.$http.get(this.$location.sysTemplateBindupdateState, {
          params: {
            templateBindID: templateBindID,
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
    deleted(templateBindID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.sysTemplateBinddelete, {
          params: {
            templateBindID: templateBindID
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
      this.$http.get(this.$location.sysTemplateBindloadExamineItem,{
        params: {
          examineType: this.popupForm.examineType
        }
      }).then(data => {
        this.array.examineItemList = data.returnContent.examineItemList;
      });
    },
    //加载模板名称
    loadTemplate() {
      this.$http.get(this.$location.sysTemplateBindloadTemplate,{
        params: {
          templateType: this.popupForm.templateType
        }
      }).then(data => {
        this.array.templateNameList = data.returnContent;
      });
    },
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.examineTypeList = [];
      this.array.examineItemList = [];
      this.array.templateTypeList = [];
      this.array.templateNameList = [];
      this.alert.popupVisible = false;
    }
  }
}
</script>

<style lang='less'>
.templateBinding{
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
    .pd10_48{
      padding-top: 10px;
      padding-left: 48px;
    }
  }
}
</style>