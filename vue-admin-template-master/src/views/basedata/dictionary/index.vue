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
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDictionaryById({},selectList[0])">修改</el-button>
          <el-button type="primary" size="mini" icon="el-icon-upload">导入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%" v-loading="listLoading" @selection-change="selectChange">
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
        <div class="block">
          <span class="demonstration" />
          <el-pagination
            layout="prev, pager, next"
            :total="50"
          />
        </div>
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
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }, { remark: 455 }],
      //  列表Loading加载
      listLoading: false,
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
      }
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
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
    }
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
