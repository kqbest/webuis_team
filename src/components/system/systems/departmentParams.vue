<template>
  <section class="departmentParams">
    <nav class="pub_select">
      <el-form ref="navForm" :model="navForm" label-width="86px">
        <el-row>
          <el-col>
            <el-form-item label="科室目录:" prop="treeValue">
              <el-cascader :props="obj.treeProps" :options="array.treeOptions" v-model="navForm.treeValue" change-on-select @change="treeArea(array.treeOptions,navForm.treeValue[navForm.treeValue.length-1])"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="参数代码:" prop="code">
              <el-input v-model="navForm.code" placeholder="请输入参数代码"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="参数名称:" prop="name">
              <el-input v-model="navForm.name" placeholder="请输入参数名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="参数分组:" prop="group">
              <el-select v-model="navForm.group" placeholder="请选择">
                <el-option v-for="item in array.groupData" :value="item.value" :label="item.label" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-button class="mlem" type="primary" @click="queryData(true)">查询</el-button>
          <el-button class="mlem" @click="resetForm('navForm')">重置</el-button>
        </el-row>
      </el-form>
    </nav>
    <section class="pub_hr">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>科室参数</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-button class="mlem" @click="queryData">刷新</el-button>
        <span class="mlem">
            科室参数共<font class='pub_count'>{{ other.totalCount }}</font>条
        </span>
      </div>
    </section>
    <!-- 表格 -->
    <section class="this_table">
      <el-table v-scroll="queryData" :data="array.tableData" stripe border height="100">
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" :disabled="true" placement="top-start">
              <el-button size="mini" :plain="true" type="success" icon="edit" @click="editInfo(scope.row.paraID)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="paraID" label="序号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraGroupName" label="参数分组" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraCode" label="参数代码" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraName" label="参数名称" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraValue" label="参数值" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paraDesc" label="参数说明" align="center" show-overflow-tooltip></el-table-column>
      </el-table>
    </section>
    <!-- 弹框 -->
    <section class="this_popup">
      <el-dialog title="编辑" size="small" top="30%" :visible.sync="alert.formVisible">
        <el-form :model="popupForm" ref="popupForm" label-width="120px" class="demo-ruleForm">
          <el-row>
            <el-col :span="11">
              <el-form-item label="院区:" prop="hospitalName">
                <span>{{ popupForm.hospitalName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="检查科室:" prop="departmentName">
                <span>{{ popupForm.departmentName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="参数分组:" prop="paraGroup">
                <span>{{ popupForm.paraGroup }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="参数代码:" prop="paraCode">
                <span>{{ popupForm.paraCode }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="参数名称:" prop="paraName">
                <span>{{ popupForm.paraName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数值:" prop="paraValue" required>
                <el-input type="text" v-model="popupForm.paraValue" v-show="other.isInput"></el-input>
                <el-select v-model="popupForm.paraValue" placeholder="请选择" v-show="!other.isInput">
                  <el-option v-for="item in array.selectList" :value="item" :label="item" :key="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="22">
              <el-form-item label="参数说明:" prop="paraDesc">
                <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="popupForm.paraDesc" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button type="primary" @click="editInfoSave">保 存</el-button>
          <el-button @click="alert.formVisible = false;resetForm('popupForm');">取 消</el-button>
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
        treeValue: [],
        code: '',
        name: '',
        group: ''
      },
      popupForm: {
        paraID: '',
        hospitalName: '',
        departmentName: '',
        paraGroup: '',
        paraCode: '',
        paraName: '',
        paraValue: '',
        paraDesc: ''
      },
      array: {
        treeOptions: [],//树形数据
        tableData: [],//表格数据
        groupData: [{//参数分组数据
          value: '',
          label: '请选择'
        },{
          value: '1',
          label: '公共参数'
        },{
          value: '2',
          label: '预约参数'
        },{
          value: '3',
          label: '登记参数'
        },{
          value: '4',
          label: '呼叫参数'
        },{
          value: '5',
          label: '报告参数'
        },{
          value: '6',
          label: '打印参数'
        },{
          value: '7',
          label: '接口参数'
        }],
        selectList: []//编辑弹框单选下拉数据
      },
      obj: {
        treeProps: {
          value: 'depID',
          label: 'depName',
          children: 'childList'
        },
        tableParms: {
          hospitalID: '',
          departmentID: ''
        }
      },
      other: {
        pageStart: 0,
        totalCount: 0,
        isFirst: true,
        isInput: true
      },
      alert: {
        formVisible: false
      }
    }
  },
  computed: {
  },
  created() {
    this.findTree();
  },
  methods: {
    //加载左侧树形
    findTree() {
      this.$http.get(this.$location.sysDepParafindTree).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.array.treeOptions = res || [];
          if (this.other.isFirst) {
            this.navForm.treeValue.push(this.array.treeOptions[0].depID);
            this.other.isFirst = false;
            let len = this.navForm.treeValue.length;
            this.treeArea(this.array.treeOptions,this.navForm.treeValue[len-1]);
            this.queryData(true);
          }
        }
      });
    },
    //加载列表
    queryData(can) {
      can?this.other.pageStart=0:this.other.pageStart++;
      this.$http.get(this.$location.sysDepParafindPage,{
        params:{
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          paraCode: this.navForm.code,
          paraName: this.navForm.name,
          paraGroup: this.navForm.group,
          pageStart: this.other.pageStart
        }
      }).then(data => {
        let res = data.returnContent;
        if(data.returnCode == '1'){
          this.other.totalCount = res.totalCount;
          let list = res.sysDepParaList;
          if(can){
            this.array.tableData = list || [];
          }else{
            this.array.tableData.push(...list);
          }
        }
      });
    },
    //编辑
    editInfo(paraID) {
      this.$http.get(this.$location.sysDepParaupdateQuery,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          paraID: paraID
        }
      }).then(data => {
        let res = data.returnContent;
        if (data.returnCode == '1') {
          this.popupForm.paraID = paraID;
          this.popupForm.hospitalName = res.sysDepPara.hospitalName;
          this.popupForm.departmentName = res.sysDepPara.departmentName;
          this.popupForm.paraGroup = res.sysDepPara.paraGroup;
          this.popupForm.paraCode = res.sysDepPara.paraCode;
          this.popupForm.paraName = res.sysDepPara.paraName;
          this.popupForm.paraValue = res.sysDepPara.paraValue;
          this.popupForm.paraDesc = res.sysDepPara.paraDesc;
          //判断是输入框还是下拉框（0为输入框 1为下拉框）
          if (res.paraValueType == 0){
            this.other.isInput = true;
          }else if(res.paraValueType == 1){
            this.array.selectList = res.paraValueTypeArray || [];
            this.other.isInput = false;
          }
          this.alert.formVisible = true;
        }
      });
    },
    //编辑保存
    editInfoSave() {
      this.$http.get(this.$location.sysDepParaupdate,{
        params: {
          hospitalID: this.obj.tableParms.hospitalID,
          departmentID: this.obj.tableParms.departmentID,
          paraID: this.popupForm.paraID,
          paraValue: this.popupForm.paraValue
        }
      }).then(data => {
        let message = data.returnContent;
        if (data.returnCode == '1') {
          this.$message({
            type: 'success',
            message: message,
            duration: 1000
          });
          this.queryData(true);
        }
      });
      this.alert.formVisible = false;
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
            this.obj.tableParms.departmentID = k.depID;
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
    //form重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang='less'>
.departmentParams{
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
      .el-button{
        margin-left: 0;
      }
      .el-table__header{
        width: 100%!important;
      }
      .el-table__empty-block{
        width: 100%!important;
      }
    }
  }
  .this_popup{
    .el-select{
      width: 100%;
    }
  }
}
</style>