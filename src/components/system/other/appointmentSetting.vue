<template>
  <section class="appointmentSetting">
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
          <el-col>
            <el-form-item label="星期:" prop="scheduleWeek">
              <el-select v-model="navForm.scheduleWeek" multiple placeholder="请选择">
                <el-option v-for="item in array.weekRangeList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="规则项目:" prop="ruleItem">
              <el-select v-model="navForm.ruleItem" clearable placeholder="请选择">
                <el-option v-for="item in array.ruleItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
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
          <el-breadcrumb-item>预约设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" type="primary" @click="addInfo">新建</el-button>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            预约设置共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.scheduleID)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="明细" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="info" icon="document" @click="detailInfo(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="danger" icon="delete" @click="deleted(scope.row.scheduleID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="scheduleID" label="编号" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="scheduleName" label="排班名称" width="180" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="ruleItem" label="规则项目" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="scheduleWeek" label="星期" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startTime" label="开始时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endTime" label="结束时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="timeSpace" label="时间间隔" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quantity" label="放号量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="启用状态" align="center" width="100">
          <template scope="scope">
            <span class="this_enable" @click="enabledState(scope.row.scheduleID,scope.row.state)">{{ scope.row.stateName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!-- 新增/编辑弹框 -->
    <section class="this_popup">
      <el-dialog :title="other.title" size="small" top="30%" :visible.sync="alert.popupVisible" :before-close="closePopup">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm" :rules="rules">
          <el-row>
            <el-col :span="11">
              <el-form-item label="规则分类:">
                <span>{{ popupForm.ruleIDName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="规则项目:" prop="ruleItem">
                <el-select v-model="popupForm.ruleItem" clearable placeholder="请选择">
                  <el-option v-for="item in array.c_ruleItemList" :key="item.depDataDicValueName" :label="item.depDataDicValueName" :value="item.depDataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="排班名称:" prop="scheduleName">
                <el-input v-model="popupForm.scheduleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="星期范围:" prop="scheduleWeek">
                <el-select v-model="popupForm.scheduleWeek" multiple placeholder="请选择">
                  <el-option v-for="item in array.c_weekRangeList" :key="item.dataDicValueName" :label="item.dataDicValueName" :value="item.dataDicValueName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="开始时间:" prop="startTime">
                <el-time-select v-model="popupForm.startTime" :picker-options="{start:'07:00',step:'00:10',end:'23:59'}" :editable="false" placeholder="选择开始时间"></el-time-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="结束时间:" prop="endTime">
                <el-time-select v-model="popupForm.endTime" :picker-options="{start:'07:00',step:'00:10',end:'23:59'}" :editable="false" placeholder="选择开始时间"></el-time-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="时间间隔:" prop="timeSpace">
                <el-input type="number" v-model="popupForm.timeSpace">
                  <template slot="append">分钟</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="放号量:" prop="quantity">
                <el-input type="number" v-model="popupForm.quantity"></el-input>
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
    <!-- 明细弹框 -->
    <section class="this_dt_popup">
      <el-dialog title="明细" size="small" top="23%" :visible.sync="alert.dt_popupVisible" :before-close="dt_closePopup">
        <el-form :model="dt_popupForm" ref="dt_popupForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item label="星期:">
                <span>{{ dt_popupForm.scheduleWeek }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="规则项目:" prop="ruleItem">
                <span>{{ dt_popupForm.ruleItem }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="dt_table">
            <span class="mlem">
                选项列表: (<font class='pub_count'>{{ other.dt_totalCount }}</font>)
            </span>
            <el-table :data="array.dt_tableData" stripe height="300">
              <el-table-column prop="input" label="操作" align="center" show-overflow-tooltip>
                <template scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
                    <el-button size="mini" :plain="true" type="success" icon="edit" @click="dt_editInfo(scope.row)"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" :disabled="true" placement="top-start">
                    <el-button size="mini" :plain="true" type="danger" icon="delete" @click="dt_deleted(scope.row.detailID)"></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column prop="detailID" label="编号" width="100" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="startTime" label="开始时间" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="endTime" label="结束时间" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column prop="quantity" label="放号量" align="center" show-overflow-tooltip></el-table-column>
              <el-table-column label="启用状态" align="center" width="100">
                <template scope="scope">
                  <span class="this_enable" @click="dt_enabledState(scope.row.detailID,scope.row.state)">{{ scope.row.stateName }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="dt_closePopup">关 闭</el-button>
        </div>
      </el-dialog>
    </section>
    <!-- 明细编辑弹框 -->
    <section class="this_editPopup">
      <el-dialog title="编辑" size="tiny" top="36%" :visible.sync="alert.dt_editPopupVisible" :before-close="dt_editClosePopup">
        <el-form :model="dt_editPopupForm" ref="dt_editPopupForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="22">
              <el-form-item label="放号量:" prop="quantity" :rules="[{required:true,message:'请输入邮箱地址',trigger:'blur'}]">
                <el-input type="number" v-model="dt_editPopupForm.quantity"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="submitForm('dt_editPopupForm',editInfoSave,'dt_editPopupVisible')">保 存</el-button>
          <el-button @click="dt_editClosePopup">取 消</el-button>
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
        examineType: '',
        scheduleWeek: [],//星期
        ruleItem: ''//规则项目
      },
      popupForm: {
        ruleIDName: '',
        examineType: '',
        ruleItem: '',
        scheduleName: '',
        scheduleWeek: [],
        startTime: '',
        endTime: '',
        timeSpace: '',//时间间隔
        quantity: '',//放号量
        scheduleID: ''
      },
      dt_popupForm: {
        scheduleWeek: '',
        ruleItem: ''
      },
      dt_editPopupForm: {
        detailID: '',
        quantity: ''
      },
      rules: {
        ruleItem:[{ required: true, message: '请选择规则项目', trgger: 'blur' }],
        scheduleName:[{ required: true, message: '请输入排班名称', trgger: 'blur' }],
        scheduleWeek:[{
          required: true,
          trgger: 'blur',
          validator: (rule, value, callback) => {
            if (value.length > 0) {
              callback();
            } else {
              callback(new Error('请选择星期范围'));
            }
          }
        }],
        startTime:[{ required: true, message: '请选择开始时间', trgger: 'blur' }],
        endTime:[{ required: true, message: '请选择结束时间', trgger: 'blur' }],
        timeSpace:[{
          required: true,
          trgger: 'blur',
          validator: (rule,value,callback) => {
            if (this.isNumber(value) && value != '') {
              callback();
            } else {
              callback(new Error('请输入时间间隔,格式为正整数'));
            }
          }
        }],
        quantity:[{
          required: true,
          trgger: 'blur',
          validator: (rule,value,callback) => {
            if (this.isNumber(value) && value != '') {
              callback();
            } else {
              callback(new Error('请输入放号量,格式为正整数'));
            }
          }
        }]
      },
      array: {
        tableData: [], //列表数据
        dt_tableData: [], //明细列表数据
        weekRangeList: [], //查询条件-星期范围数据
        ruleItemList: [], //查询条件-规则项目数据
        c_ruleItemList: [], //弹框-规则项目数据
        c_weekRangeList: [] //弹框-星期范围数据
      },
      obj: {
        list: {}
      },
      other: {
        pageStart: '0',
        dt_pageStart: '0',
        totalCount: '0',
        dt_totalCount: '0',
        title: '新增',
        isAdd: true //判断是否是新建
      },
      alert: {
        popupVisible: false,
        dt_popupVisible: false,
        dt_editPopupVisible: false
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
      this.$http.get(this.$location.sysScheduleWeekfindTree).then(data => {
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
      this.$http.get(this.$location.sysScheduleWeekfindWeekPage,{
        params:{
          examineType: this.navForm.examineType,
          scheduleWeek: this.navForm.scheduleWeek,//星期
          ruleItem: this.navForm.ruleItem,//规则项目
          pageStart: this.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.other.totalCount = res.totalCount;
        this.popupForm.examineType = res.examineType;
        this.popupForm.ruleIDName = res.ruleIDName;
        this.array.weekRangeList = res.weekRangeList;
        this.array.ruleItemList = res.ruleItemList;  
        let list = res.sysScheduleWeekList;
        if(can){
          this.array.tableData = list || [];
        }else{
          this.array.tableData.push(...list);
        }
      });
    },
    //新建
    addInfo() {
      this.$http.get(this.$location.sysScheduleWeekinsertWeekReady,{
        params: {
          examineType: this.navForm.examineType
        }
      }).then(data => {
        this.popupForm.examineType = this.navForm.examineType;
        this.array.c_ruleItemList = data.returnContent.ruleItemList || [];
        this.array.c_weekRangeList = data.returnContent.weekRangeList || [];
      });
      this.other.title = '新建';
      this.other.isAdd = true;
      this.alert.popupVisible = true;
    },
    //保存
    infoSave(resolve) {
      if (this.other.isAdd == true) { //新建保存
        this.$http.get(this.$location.sysScheduleWeekinsertWeek,{
          params: {
            examineType: this.popupForm.examineType,
            ruleItem: this.popupForm.ruleItem,
            scheduleName: this.popupForm.scheduleName,
            scheduleWeek: this.popupForm.scheduleWeek.join(','),
            startTime: this.popupForm.startTime,
            endTime: this.popupForm.endTime,
            timeSpace: this.popupForm.timeSpace,
            quantity: this.popupForm.quantity
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
        this.$http.get(this.$location.sysScheduleWeekupdateWeek,{
          params: {
            examineType: this.popupForm.examineType,
            ruleItem: this.popupForm.ruleItem,
            scheduleName: this.popupForm.scheduleName,
            scheduleWeek: this.popupForm.scheduleWeek.join(','),
            startTime: this.popupForm.startTime,
            endTime: this.popupForm.endTime,
            timeSpace: this.popupForm.timeSpace,
            quantity: this.popupForm.quantity,
            scheduleID: this.popupForm.scheduleID
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
    editInfo(scheduleID) {
      this.$http.get(this.$location.sysScheduleWeekupdateWeekQuery,{
        params: {
          scheduleID: scheduleID
        }
      }).then(data => {
        let res = data.returnContent;
        this.array.c_ruleItemList = res.ruleItemList || [];
        this.array.c_weekRangeList = res.weekRangeList || [];
        let info = res.sysScheduleWeek;
        this.popupForm.ruleIDName = info.ruleIDName;
        this.popupForm.examineType = info.examineType;
        this.popupForm.ruleItem = info.ruleItem;
        this.popupForm.scheduleName = info.scheduleName;
        this.popupForm.scheduleWeek = info.scheduleWeek.split(',');
        this.popupForm.startTime = info.startTime;
        this.popupForm.endTime = info.endTime;
        this.popupForm.timeSpace = info.timeSpace;
        this.popupForm.quantity = info.quantity;
        this.popupForm.scheduleID = scheduleID;
      });
      this.other.title = '编辑';
      this.other.isAdd = false;
      this.alert.popupVisible = true;
    },
    //明细
    detailInfo(list) {
      this.obj.list = list;
      this.$http.get(this.$location.sysScheduleWeekfindWeekDetailPage,{
        params: {
          scheduleID: list.scheduleID,
          pageStart: this.other.dt_pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        this.dt_popupForm.scheduleWeek = list.scheduleWeek;
        this.dt_popupForm.ruleItem = list.ruleItem;
        this.other.dt_totalCount = res.totalCount;
        this.array.dt_tableData = res.sysScheduleWeekList;
      });
      this.alert.dt_popupVisible = true;
    },
    //启用状态
    enabledState(scheduleID, state) {
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
        this.$http.get(this.$location.sysScheduleWeekupdateWeekState, {
          params: {
            scheduleID: scheduleID,
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
    //明细-启用状态
    dt_enabledState(detailID, state) {
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
        this.$http.get(this.$location.sysScheduleWeekupdateWeekDetailState, {
          params: {
            detailID: detailID,
            state: state
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          this.detailInfo(this.obj.list);
        });
      }).catch(() => {});
    },
    //删除
    deleted(scheduleID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.sysScheduleWeekdeleteWeek, {
          params: {
            scheduleID: scheduleID
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
    //明细-删除
    dt_deleted(detailID) {
      this.$confirm("是否确认删除该条信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$http.get(this.$location.sysScheduleWeekdeleteWeekDetail, {
          params: {
            detailID: detailID
          }
        }).then(data => {
          let msg = data.returnContent;
          this.$message({
            type: "success",
            message: msg,
            duration: 1000
          });
          this.detailInfo(this.obj.list);
        });
      }).catch(() => {});
    },
    //明细-编辑
    dt_editInfo(list) {
      this.dt_editPopupForm.detailID = list.detailID;
      this.dt_editPopupForm.quantity = list.quantity;
      this.alert.dt_editPopupVisible = true;
    },
    //明细-编辑保存
    editInfoSave(resolve) {
      this.$http.get(this.$location.sysScheduleWeekupdateWeekDetail,{
        params: {
          detailID: this.dt_editPopupForm.detailID,
          quantity: this.dt_editPopupForm.quantity
        }
      }).then(data => {
        let msg = data.returnContent;
          this.$message({
              type: 'success',
              message: msg,
              duration: 1000
          });
          resolve(); //成功的回调
          this.detailInfo(this.obj.list);
      });
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
    //关闭弹框清除数据
    closePopup() {
      //清空弹框数据
      this.resetForm("popupForm");
      this.array.c_ruleItemList = [];//弹框-规则项目数据
      this.array.c_weekRangeList = [];//弹框-规则项目数据
      this.alert.popupVisible = false;
    },
    //关闭弹框清除数据-明细
    dt_closePopup() {
      //清空弹框数据
      this.resetForm("dt_popupForm");
      this.alert.dt_popupVisible = false;
    },
    //关闭弹框清除数据-明细编辑
    dt_editClosePopup() {
      //清空弹框数据
      this.resetForm("dt_editPopupForm");
      this.alert.dt_editPopupVisible = false;
    }
  }
}
</script>

<style lang='less'>
.appointmentSetting{
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
      .el-button.is-plain{
        margin-left: 0;
      }
      .this_enable {
        color: green;
        cursor: pointer;
      }
    }
  }
  .dt_table{
    padding: 0 30px;
    .el-button.is-plain{
      margin-left: 0;
    }
    .this_enable {
      color: green;
      cursor: pointer;
    }
  }
}
</style>