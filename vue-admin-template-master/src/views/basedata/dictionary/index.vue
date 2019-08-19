<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:10%; width: 100%">
        <el-row style="height:50%">
          字典名称：<el-input size="mini" style="width: 10%" />&nbsp;
          字典类型：<el-input size="mini" style="width: 10%" />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <el-row style="display: inline">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="mutiDel">删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDictionaryById({},selectList[0])">修改</el-button>
          <el-button type="primary" size="mini" icon="el-icon-upload">导入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="currentPageData" border style="width: 100%" height="90%" v-loading="listLoading" @selection-change="selectChange">
          <el-table-column type="selection" width="30%" v-model="editRow" />
          <!--索引-->
          <el-table-column type="index" :index="indexMethod" width="30%" />
          <el-table-column prop="name" label="字典名" />
          <el-table-column prop="category" label="字典类型" />
          <el-table-column prop="value" label="字典值" />
          <el-table-column prop="updatedTime" label="更新时间" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="status" label="状态" />
          <el-table-column  fixed="right" label="操作" width="150%">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" circle></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="mutiDel" size="mini" circle></el-button>
              <el-button type="primary" icon="el-icon-edit" @click="editDictionaryById(scope.$index,scope.row)" size="mini" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button  icon="el-icon-arrow-left" @click="prevPage" />
          <span>第{{currentPage}}页/共{{totalPage}}页</span>
        <el-button  icon="el-icon-arrow-right" @click="nextPage" />
      </el-main>
    </el-container>
    <el-dialog title="基本信息" width="400px" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :inline="true" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-row>
          <el-form-item label="字典名" prop="dictionaryName">
            <el-input v-model="addForm.dictionaryName" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典类型" prop="dictionaryType">
            <el-input v-model="addForm.dictionaryType" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典值" prop="dictionaryValue">
            <el-input v-model="addForm.dictionaryValue" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用" prop="status">
            <el-radio v-model="addForm.status" label="1">是</el-radio>
            <el-radio v-model="addForm.status" label="2">否</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注信息" prop="comment">
            <el-input type="textarea" :rows="4" v-model="addForm.comment" auto-complete="off" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="基本信息" width="400px" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :inline="true" :model="addForm" label-width="100px" :rules="addFormRules">
        <el-row>
          <el-form-item label="字典名" prop="dictionaryName">
            <el-input v-model="editForm.dictionaryName" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典类型" prop="dictionaryType">
            <el-input v-model="editForm.dictionaryType" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典值" prop="dictionaryValue">
            <el-input v-model="editForm.dictionaryValue" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用" prop="status">
            <el-radio v-model="editForm.status" label="1">是</el-radio>
            <el-radio v-model="editForm.status" label="2">否</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注信息" prop="comment">
            <el-input type="textarea" :rows="4" v-model="editForm.comment" auto-complete="off" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }, { remark: 455 }],
      //  搜索区域参数
      filters: {
        dictionaryName:'',
        dictionaryType:'',
        mark:''
      },
      //  列表Loading加载
      listLoading: false,
      //  添加按钮Loading加载
      addLoading: false,
      show: true,
      //  新增界面是否显示
      addFormVisible: false,
      //  新增界面数据
      addForm: {
        dictionaryName: '',
        dictionaryType: '',
        dictionaryValue: '',
        status: '',
        comment: ''
      },
      //  批量选中data
      selectList: [],
      addFormRules: {
        dictionaryName: [{ required: true, message: '请输入字典名', trigger: 'blur' }],
        dictionaryType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }],
        dictionaryValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
      },
      //  编辑界面是否显示
      editFormVisible: false,
      //  编辑按钮Loading加载
      editLoading: false,
      //  编辑界面row
      editRow:"",
      //  编辑界面数据
      editForm: {
        id:'',
        dictionaryName:'',
        dictionaryType:'',
        dictionaryValue:'',
        status:'',
        comment:''
      },
      //  分页
      totalPage: 1, //  统共页数，默认为1
      currentPage: 1, //  当前页数 ，默认为1
      pageSize: 7, //  每页显示数量
      currentPageData: [{ remark: 444 }, { remark: 455 }] //  当前页显示内容
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
    countPages:function(){
      //  计算一共有几页
      this.totalPage = Math.ceil(this.tableData.length / this.pageSize)
      //  计算得0时设置为1
      this.totalPage = this.totalPage == 0 ? 1 : this.totalPage
      this.getCurrentPageData()
    },
    //  分页
    //  设置当前页面数据，对数组操作的截取规则为[0~9],[10~20]...,
    //  当currentPage为1时，我们显示(0*pageSize+1)-1*pageSize，当currentPage为2时，我们显示(1*pageSize+1)-2*pageSize...
    getCurrentPageData() {
      let begin = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      var oldTable=this.tableData
      this.currentPageData = oldTable.slice(
        begin,
        end
      )
    },
    searchDic:function(name,type,mark){
      var oldData=this.tableData
      var newDic=[];
      for (var i=0;i<oldData.length;i++){
        var value=oldData[i];
        if (name==""&&type!=""&&mark!=""){
          if (value.dictionaryType.indexOf(type)!=-1&&value.mark.indexOf(mark)!=-1) {
            newDic.push(value)
          }
        }else if (name==""&&type==""&&mark!=""){
          if (value.mark.indexOf(mark)!=-1){
            newDic.push(value)
          }
        } else if (name==""&&type!=""&&mark==""){
          if (value.dictionaryType.indexOf(type)!=-1){
            newDic.push(value)
          }
        }else if (name!=""&&type==""&&mark==""){
          if (value.dictionaryName.indexOf(name)!=-1){
            newDic.push(value)
          }
        }
        else if (name!=""&&type==""&&mark!=""){
          if (value.dictionaryName.indexOf(name)!=-1&&value.mark.indexOf(mark)!=-1){
            newDic.push(value)
          }
        } else if (name!=""&&type!=""&&mark==""){
          if (value.dictionaryName.indexOf(name)!=-1&&value.dictionaryType.indexOf(type)!=-1){
            newDic.push(value)
          }
        } else if (name==""&&type==""&&mark==""){
          this.getResult();
          newDic=this.tableData;
        } else if (name!=""&&type!=""&&mark!=""){
          if (value.dictionaryType.indexOf(type)!=-1&&value.dictionaryName.indexOf(name)!=-1&&value.mark.indexOf(mark)!=-1){
            newDic.push(value);
          }
        }
      }
      this.countSearchPages(newDic)
    },
    getCurrentPageData() {
      let begin = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      var oldTable=this.tableData;
      this.currentPageData = oldTable.slice(
        begin,
        end
      );
    },
    getDictionary() {
      this.$axios.get('http://localhost:8080/dictionary/findAll').then(res => {
        this.tableData = res.data
        console.log(this.getDictionaryData)
      })
    },
    //  显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
    },
    //  显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    }, 
    editDictionaryById:function(index, row){
      this.editFormVisible=true;
      this.editForm = Object.assign({}, row);
    },
    //table序号
    indexMethod(index) {
      return index + 1;
    },
    //批量选中
    selectChange: function(val) {
      this.selectList = val;
    },
    //批量删除
    mutiDel:function(){
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        const length = this.selectList.length;
        for (let i = 0; i < length; i++) {
          this.deleteDic(this.selectList[i].id);
        }
        this.getResult(1);
        this.getCurrentPageData();
      })
    },
    //单次删除
    deleteDic:function(id){
      var CommonRequest = {
        url:"http:localhost:8090/dictionary/edit",
        method:"POST",
        data:id
      };
      Axios({
        method:'POST',
        baseURL:"/api/dictionary/del",
        data:CommonRequest
      }).then(CommonResponse => {
        this.editLoading = false
        if (CommonResponse && CommonResponse.data.status=="success"){
          this.$message({
            message: CommonResponse.data.data,
            type: "success"
          })
        } else {
          this.$message({
            message: CommonResponse.data.data.errorMessage,
            type: "fail"
          })
        }
        this.selectList = [];
      })
    },
    getResult: function(val) {
      this.currentPage=val
      this.listLoading = true
      var data={
      }
      var CommonRequest = {
        url:"http:localhost:8090/dictionary/queryAll",
        method:"POST",
        data:data
      };
      Axios({
        method:'POST',
        baseURL:"/api/dictionary/queryAll",
        data:CommonRequest
      }).then(CommonResponse => {
        if (CommonResponse && CommonResponse.data.status=="success"){
          var object=CommonResponse.data.data
          var length=Object.keys(object)
          console.log(length)
          this.tableData = object
          //this.count = length;
          this.listLoading = false
          this.totalPage=length
          this.countPages()
        }else {
          alert(CommonResponse.data.data.errorMessage)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
