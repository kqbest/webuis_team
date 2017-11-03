<template>
  <section class="measurement">
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
          <el-breadcrumb-item>测值管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            测值管理共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.measureID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.measureID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="examineItemName" label="检查项目" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="measureName" label="测值名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="measureUnit" label="测值单位" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="measureJS" label="脚本" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="small" top="33%" :visible.sync="alert.popupVisible" :before-close="closePopup">
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
              <el-form-item label="测值名称:" prop="measureName">
                <el-input v-model="popupForm.measureName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="测值单位:" prop="measureUnit">
                <el-input v-model="popupForm.measureUnit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="正常范围:" prop="normalRange">
                <el-input v-model="popupForm.normalRange" placeholder="格式例如:0~100"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="测值类型:" prop="measureType">
                <el-select v-model="popupForm.measureType" clearable placeholder="请选择">
                  <el-option v-for="item in array.measureTypeList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
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
      navForm: {
        examineType: ''
      },
      popupForm: {
        hospitalID: '',
        departmentID: '',
        examineType: '',
        examineItem: '',
        measureName: '',//测值名称
        measureUnit: '',//测值单位
        normalRange: '',//正常范围
        measureType: '',//测值类型
        measureID: ''
      },
      rules: {
        examineItem:[{ required: true, message: '请选择检查项目', trgger: 'blur' }],
        measureName:[{ required: true, message: '请输入测值名称', trgger: 'blur' }]
      },
      array: {
        tableData: [], //列表数据
        examineItemList: [], //检查项目数据
        measureTypeList: [] //测值类型数据
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
      this.$http.get(this.$location.measureValuefindTree).then(data => {
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
      this.$http.get(this.$location.measureValuefindPage,{
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
        let list = res.measureValueManageList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.measureValueinsertReady,{
        params: {
          examineType: this.navForm.examineType
        }
      }).then(data => {
        this.popupForm.examineType = data.returnContent.examineTypeName;
        this.array.examineItemList = data.returnContent.examineItemList || [];
        this.array.measureTypeList = data.returnContent.measureTypeList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        this.$http.get(this.$location.measureValueinsert,{
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
        this.$http.get(this.$location.measureValueupdate,{
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
    editInfo(measureID) {
      this.$http.get(this.$location.measureValueupdateQuery,{
        params: {
          measureID: measureID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.examineItemList = res.examineItemList || [];
        this.array.measureTypeList = res.measureTypeList || [];
        let info = res.measureValueManage;
        this.popupForm.hospitalID = info.hospitalID;
        this.popupForm.departmentID = info.departmentID;
        this.popupForm.examineType = info.examineType;
        this.popupForm.examineItem = info.examineItem;
        this.popupForm.measureName = info.measureName;//测值名称
        this.popupForm.measureUnit = info.measureUnit;//测值单位
        this.popupForm.normalRange = info.normalRange;//正常范围
        this.popupForm.measureType = info.measureType;//测值类型
        this.popupForm.measureID = measureID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //删除
    deleted(measureID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.measureValuedelete, {
          params: {
            measureID: measureID
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
      this.array.measureTypeList = [];
      this.alert.popupVisible = false;
    }
  }
}
</script>

<style lang='less'>
.measurement{
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