<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:10%; width: 100%">
        <!-- 表头 -->
        <el-row>
          <el-form :inline="true" style="float: left">
            <el-form-item label="题目分类：">
              <el-cascader :options="options" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="选择题型：">
              <el-input v-model="subject.subjectType" placeholder="请输入" style="width: 130px" />
            </el-form-item>
            <el-form-item label="输入题目：">
              <el-input v-model="subject.name" placeholder="请输入" style="width: 130px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryDictionaryData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 按钮 -->
        <el-row style="display: inline">
          <el-button type="success" size="mini" icon="el-icon-plus" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="mutiDel">删除</el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="editSubjectById({},selectList[0])">修改</el-button>
          <el-button type="primary" size="mini" icon="el-icon-upload" @click="handleImport">导入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
        </el-row>
      </el-header>
      <!-- 表格 -->
      <el-main v-if="show">
        <el-table v-loading="listLoading" :data="currentPageData" border style="width: 100%" height="90%" @selection-change="selectChange">
          <el-table-column v-model="editRow" type="selection" width="40%" />
          <!-- 索引 -->
          <el-table-column prop="name" label="题目" :show-overflow-tooltip="true" />
          <el-table-column prop="subjectType" label="题目类型" />
          <el-table-column prop="category" label="题目分类" />
          <el-table-column prop="updatedTime" label="更新时间" />
          <el-table-column prop="status" label="状态" />
          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="150%">
            <template slot-scope="scope">
              <el-button type="success" icon="el-icon-plus" size="mini" circle @click="handleAdd" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="mutiDel" />
              <el-button type="warning" icon="el-icon-edit" size="mini" circle @click="editSubjectById(scope.$index,scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-button icon="el-icon-arrow-left" />
        <span>第{{ currentPage }}页/共{{ totalPage }}页</span>
        <el-button icon="el-icon-arrow-right" />
      </el-main>
    </el-container>
    <!-- 增加窗口 -->
    <el-dialog title="增加题目信息" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :inline="true" :model="addForm" label-width="100px" :rules="FormRules">
        <el-form-item label="题目类型：" prop="category">
          <el-input v-model="addForm.category" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题型：" prop="subjectType">
          <el-input v-model="addForm.sujectType" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="难度：" prop="difficulty">
          <el-input v-model="addForm.difficulty" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题目：" prop="name">
          <el-input v-model="addForm.name" type="textarea" :rows="3" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-row>
          <el-form-item label="选项：">
            <el-link type="primary" @click="addDomain">+ 添加选项</el-link>
          </el-form-item>
        </el-row>
        <el-form-item
          v-for="(domain, index) in addForm.domains"
          :key="domain.key"
          :label="'选项：' + index"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true, message: '选项不能为空', trigger: 'blur'
          }"
        >
          <el-input v-model="domain.value" /><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-row>
          <el-form-item label="答案：" prop="answer">
            <el-input v-model="addForm.answer" type="textarea" :rows="2" auto-complete="off" style="width: 300px" />
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
            <el-input v-model="addForm.comment" type="textarea" :rows="4" auto-complete="off" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="addLoading" @click="addSubmit">提交</el-button>
        <el-button @click="addFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改窗口 -->
    <el-dialog title="增加题目信息" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :inline="true" :model="editForm" label-width="100px" :rules="FormRules">
        <el-form-item label="题目类型：" prop="category">
          <el-input v-model="editForm.category" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题型：" prop="subjectType">
          <el-input v-model="editForm.sujectType" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="难度：" prop="difficulty">
          <el-input v-model="editForm.difficulty" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题目：" prop="name">
          <el-input v-model="editForm.name" type="textarea" :rows="3" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-row>
          <el-form-item label="选项：">
            <el-link type="primary" @click="addDomain">+ 添加选项</el-link>
          </el-form-item>
        </el-row>
        <el-form-item
          v-for="(domain, index) in addForm.domains"
          :key="domain.key"
          :label="'选项：' + index"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true, message: '选项不能为空', trigger: 'blur'
          }"
        >
          <el-input v-model="domain.value" /><el-button @click.prevent="removeDomain(domain)">删除</el-button>
        </el-form-item>
        <el-row>
          <el-form-item label="答案：" prop="answer">
            <el-input v-model="editForm.answer" type="textarea" :rows="2" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用" prop="status">
            <el-radio v-model="editForm.status" label="1">是</el-radio>
            <el-radio v-model="editForm.status" label="2">否</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="editForm.remark" type="textarea" :rows="4" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="editLoading" @click="addSubmit">提交</el-button>
        <el-button @click="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--导入窗口-->
    <el-dialog title="导入窗口" width="400px" :visible.sync="importFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" label-width="80px">
        <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <div style="align:center"><el-button size="small" type="primary" center>点击上传</el-button></div>
          <div slot="tip" class="el-upload__tip">只能上传 xlsx / xls 文件，且不超过1M</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary">提交</el-button>
        <el-button @click="importFormVisible = false">取消</el-button>
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
      // 导入窗口显示
      importFormVisible: false,
      // 文件上传List
      fileList: [],
      //  返回数据
      tableData: [{ remark: 444 }, { remark: 455 }],
      //  搜索区域参数
      filters: {
        dictionaryName: '',
        dictionaryType: '',
        mark: ''
      },
      subject: [],
      //  列表Loading加载
      listLoading: false,
      //  添加按钮Loading加载
      addLoading: false,
      show: true,
      //  新增界面是否显示
      addFormVisible: false,
      //  新增界面数据
      addForm: {
        subjectId: '',
        name: '',
        category: '',
        subjectType: '',
        updatedTime: '',
        status: '',
        remark: '',
        domains: [{
          value: ''
        }]
      },
      //  批量选中data
      selectList: [],
      FormRules: {
        name: [{ required: true, message: '请输入题目', trigger: 'blur' }],
        category: [{ required: true, message: '请输入题目类别', trigger: 'blur' }],
        subjectType: [{ required: true, message: '请输入题目类型', trigger: 'blur' }],
        subjectSelection: [{ required: true, message: '请输入题目类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        answer: [{ required: true, message: '请填写答案', trigger: 'blur' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'blur' }]
      },
      //  编辑界面是否显示
      editFormVisible: false,
      //  编辑按钮Loading加载
      editLoading: false,
      //  编辑界面row
      editRow: '',
      //  编辑界面数据
      editForm: {
        subjectId: '',
        name: '',
        subjectType: '',
        updatedTime: '',
        category: '',
        status: '',
        remark: ''
      },
      //  分页
      totalPage: 1, //  统共页数，默认为1
      currentPage: 1, //  当前页数 ，默认为1
      pageSize: 7, //  每页显示数量
      currentPageData: [{ subjectId: 1, name: '下列选项中，请选择一个handssome英俊coolman，学习如何做一名优秀的组员balibalibalibalibalabala', subjectType: 1, category: 1, updatedTime: '2017-1-2 14:20:56', status: 1 }, { subjectId: 2, name: '下列选项中，请选择一个handssome英俊coolman，学习如何做一名优秀的组员balibalibalibalibalabala', subjectType: 2, category: 2, updatedTime: '2017-1-2 14:20:56', status: 1 }], //  当前页显示内容
      // 查询区域的下拉框的选中信息
      options: [{
        value: 'Java',
        label: 'Java基础',
        children: [{
          value: 'shejiyuanze',
          label: 'Java设计原则'
        }, {
          value: 'daohang',
          label: 'JavaSE',
          children: [{
            value: 'cexiangdaohang',
            label: '异常'
          }, {
            value: 'dingbudaohang',
            label: '接口'
          }]
        }]
      }, {
        value: 'zujian',
        label: 'Java后端',
        children: [{
          value: 'basic',
          label: '框架',
          children: [{
            value: 'layout',
            label: 'Spring'
          }, {
            value: 'color',
            label: 'Mybatis'
          }, {
            value: 'typography',
            label: 'SpringMVC'
          }]
        }]
      }, {
        value: 'form',
        label: 'Web基础',
        children: [{
          value: 'radio',
          label: 'JS'
        }, {
          value: 'checkbox',
          label: 'Html'
        }, {
          value: 'input',
          label: 'Vue'
        }]
      }, {
        value: 'ziyuan',
        label: '大数据',
        children: [{
          value: 'axure',
          label: '算法'
        }, {
          value: 'sketch',
          label: 'Sql'
        }]
      }]
    }
  },
  mounted() {
    //  初始加载
  },
  methods: {
    searchDic: function(name, type, mark) {
      var oldData = this.tableData
      var newDic = []
      for (var i = 0; i < oldData.length; i++) {
        var value = oldData[i]
        if (name === '' && type !== '' && mark !== '') {
          if (value.dictionaryType.indexOf(type) !== -1 && value.mark.indexOf(mark) !== -1) {
            newDic.push(value)
          }
        } else if (name !== '' && type !== '' && mark === '') {
          if (value.mark.indexOf(mark) !== -1) {
            newDic.push(value)
          }
        } else if (name !== '' && type !== '' && mark === '') {
          if (value.dictionaryType.indexOf(type) !== -1) {
            newDic.push(value)
          }
        } else if (name !== '' && type !== '' && mark === '') {
          if (value.dictionaryName.indexOf(name) !== -1) {
            newDic.push(value)
          }
        } else if (name !== '' && type !== '' && mark === '') {
          if (value.dictionaryName.indexOf(name) !== -1 && value.mark.indexOf(mark) !== -1) {
            newDic.push(value)
          }
        } else if (name !== '' && type !== '' && mark === '') {
          if (value.dictionaryName.indexOf(name) !== -1 && value.dictionaryType.indexOf(type) !== -1) {
            newDic.push(value)
          }
        } else if (name === '' && type === '' && mark === '') {
          this.getResult()
          newDic = this.tableData
        } else if (name !== '' && type !== '' && mark !== '') {
          if (value.dictionaryType.indexOf(type) !== -1 && value.dictionaryName.indexOf(name) !== -1 && value.mark.indexOf(mark) !== -1) {
            newDic.push(value)
          }
        }
      }
      this.countSearchPages(newDic)
    },
    //  显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
    },
    //  显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubjectById: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    //  table序号
    indexMethod(index) {
      return index + 1
    },
    //  批量选中
    selectChange: function(val) {
      this.selectList = val
    },
    //  批量删除
    mutiDel: function() {
      this.$confirm('确认删除吗？', '提示', {}).then(() => {
        const length = this.selectList.length
        for (let i = 0; i < length; i++) {
          this.deleteDic(this.selectList[i].id)
        }
        this.getResult(1)
        this.getCurrentPageData()
      })
    },
    //  单次删除
    deleteDic: function(id) {
      var CommonRequest = {
        url: 'http:localhost:8081/dictionary/edit',
        method: 'POST',
        data: id
      }
      Axios({
        method: 'POST',
        baseURL: '/api/dictionary/del',
        data: CommonRequest
      }).then(CommonResponse => {
        this.editLoading = false
        if (CommonResponse && CommonResponse.data.status === 'success') {
          this.$message({
            message: CommonResponse.data.data,
            type: 'success'
          })
        } else {
          this.$message({
            message: CommonResponse.data.data.errorMessage,
            type: 'fail'
          })
        }
        this.selectList = []
      })
    },
    // 显示导入页面
    handleImport: function() {
      this.importFormVisible = true
    },
    // 文件相关方法
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 添加窗口的添加选项按钮
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    removeDomain(item) {
      var index = this.addForm.domains.indexOf(item)
      if (index !== -1) {
        this.addForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.addForm.domains.push({
        value: '',
        key: Date.now()
      })
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
