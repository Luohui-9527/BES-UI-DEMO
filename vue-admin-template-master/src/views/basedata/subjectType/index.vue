<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:10%; width: 100%">
        <!-- 表头 -->
        <el-row>
          <el-form :inline="true" style="float: left">
            <el-form-item label="题目类型：">
              <el-input v-model="subjectType.name" style="width: 130px" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="queryDictionaryData">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 按钮 -->
        <el-row style="display: inline">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="mutiDel">删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="editDictionaryById({},selectList[0])">修改</el-button>
          <el-button type="primary" size="mini" icon="el-icon-upload" @click="handleImport">导入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table v-loading="listLoading" :data="currentPageData" border style="width: 100%" height="90%" @selection-change="selectChange">
          <el-table-column type="selection" width="40%" />
          <el-table-column prop="name" label="题目类型" />
          <el-table-column prop="remark" label="备注" />
          <el-table-column prop="updatedTime" label="更新时间" />
          <el-table-column prop="status" label="状态" />
          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="150%">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="handleAdd" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="mutiDel" />
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editDictionaryById(scope.$index,scope.row)" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-button icon="el-icon-arrow-left" @click="prevPage" />
        <span>第{{ currentPage }}页/共{{ totalPage }}页</span>
        <el-button icon="el-icon-arrow-right" @click="nextPage" />
      </el-main>
    </el-container>
    <!-- 增加窗口 -->
    <el-dialog title="基本信息" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :inline="true" :model="addForm" label-width="100px" :rules="FormRules">
        <el-row>
          <el-form-item label="题目类型" prop="subjectTypeName">
            <el-input v-model="addForm.dictionaryName" auto-complete="off" style="width: 300px" />
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
            <el-input v-model="addForm.comment" type="textarea" :rows="4" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="addLoading" @click="addSubmit">提交</el-button>
        <el-button @click="addFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改窗口 -->
    <el-dialog title="基本信息" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :inline="true" :model="addForm" label-width="100px" :rules="FormRules">
        <el-row>
          <el-form-item label="题目类型" prop="subjectTypeName">
            <el-input v-model="editForm.dictionaryName" auto-complete="off" style="width: 300px" />
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
            <el-input v-model="editForm.comment" type="textarea" :rows="4" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="editLoading" @click="editSubmit">提交</el-button>
        <el-button @click="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!--导入窗口-->
    <el-dialog title="导入窗口" width="400px" :visible.sync="importFormVisible" :close-on-click-modal="false">
      <el-form ref="importForm" :inline="true" :model="importForm" label-width="80px">
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
        <el-button type="primary" :loading="importLoading" @click="importSubmit">提交</el-button>
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
      tableData: [],
      //  搜索区域参数
      filters: {
        dictionaryName: '',
        dictionaryType: '',
        mark: ''
      },
      subjectType: [],
      //  列表Loading加载
      listLoading: false,
      //  添加按钮Loading加载
      addLoading: false,
      show: true,
      //  新增界面是否显示
      addFormVisible: false,
      //  新增界面数据
      addForm: {
        subjectTypeName: '',
        status: '',
        comment: ''
      },
      //  批量选中data
      selectList: [],
      FormRules: {
        subjectTypeName: [{ required: true, message: '请输入题目类型', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      //  编辑界面是否显示
      editFormVisible: false,
      //  编辑按钮Loading加载
      editLoading: false,
      //  编辑界面row
      editRow: '',
      //  编辑界面数据
      editForm: {
        id: '',
        dictionaryName: '',
        dictionaryType: '',
        dictionaryValue: '',
        status: '',
        comment: ''
      },
      //  分页
      totalPage: 1, //  统共页数，默认为1
      currentPage: 1, //  当前页数 ，默认为1
      pageSize: 7, //  每页显示数量
      currentPageData: [{ remark: 444 }, { remark: 455 }] //  当前页显示内容
    }
  },
  mounted() {
    //  初始加载
  },
  methods: {
    countPages: function() {
      //  计算一共有几页
      this.totalPage = Math.ceil(this.tableData.length / this.pageSize)
      //  计算得0时设置为1
      this.totalPage = this.totalPage === 0 ? 1 : this.totalPage
      this.getCurrentPageData()
    },
    //  分页
    //  设置当前页面数据，对数组操作的截取规则为[0~9],[10~20]...,
    //  当currentPage为1时，我们显示(0*pageSize+1)-1*pageSize，当currentPage为2时，我们显示(1*pageSize+1)-2*pageSize...
    // getCurrentPageData() {
    //   let begin = (this.currentPage - 1) * this.pageSize
    //   let end = this.currentPage * this.pageSize
    //   var oldTable = this.tableData
    //   this.currentPageData = oldTable.slice(
    //     begin,
    //     end
    //   )
    // },
    //  获取全部数据
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
    // 获取
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
    //  新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          if (this.addForm.dictionaryName === '') {
            this.$message({
              message: '请填写字典名字',
              type: 'error'
            })
            return
          }
          if (this.addForm.dictionaryType === '') {
            this.$message({
              message: '请填写字典类型',
              type: 'error'
            })
            return
          }
          if (this.addForm.status === '') {
            this.addForm.status = '1'
          }
          if (this.addForm.dictionaryValue === '') {
            this.$message({
              message: '请填写字典值',
              type: 'error'
            })
          }
          if (this.addForm.comment === '') {
            this.$message({
              message: '请填写描述',
              type: 'error'
            })
          }
          this.$confirm('确认增加吗？', '提示', {}).then(() => {
            this.addLoading = true
            var CommonRequest = {
              url: 'http:localhost:8090/dictionary/save',
              method: 'POST',
              data: this.addForm
            }
            Axios({
              method: 'POST',
              baseURL: '/api/dictionary/save',
              data: CommonRequest
            }).then(CommonResponse => {
              if (CommonResponse && CommonResponse.data.status === 'success') {
                this.addLoading = false
                this.$message({
                  message: CommonResponse.data.data,
                  type: 'success'
                })
              }
              this.$refs['addForm'].resetFields()
              this.addFormVisible = false
              this.getResult(1)
              this.getCurrentPageData()
            })
          })
        }
      })
    },
    //  显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editDictionaryById: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    editSubmit: function() {
      if (this.editForm.dictionaryName === '') {
        this.$message({
          message: '请填写字典名字',
          type: 'error'
        })
        return
      }
      if (this.editForm.dictionaryType === '') {
        this.$message({
          message: '请填写字典类型',
          type: 'error'
        })
        return
      }
      if (this.editForm.status === '') {
        this.addForm.status = '1'
      }
      if (this.editForm.dictionaryValue === '') {
        this.$message({
          message: '请填写字典值',
          type: 'error'
        })
      }
      if (this.editForm.comment === '') {
        this.$message({
          message: '请填写描述',
          type: 'error'
        })
      }
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm('确认修改吗？', '提示', {}).then(() => {
            var newDic = {
              id: this.editForm.id,
              dictionaryName: this.editForm.dictionaryName,
              dictionaryType: this.editForm.dictionaryType,
              dictionaryValue: this.editForm.dictionaryValue,
              comment: this.editForm.comment,
              status: this.editForm.status
            }
            var CommonRequest = {
              url: 'http:localhost:8081/dictionary/edit',
              method: 'POST',
              data: newDic
            }
            Axios({
              method: 'POST',
              baseURL: '/api/dictionary/edit',
              data: CommonRequest
            })
              .then(CommonResponse => {
                this.editLoading = false
                if (CommonResponse && CommonResponse.data.status === 'success') {
                  this.$message({
                    message: CommonResponse.data.data,
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: CommonResponse.data.data.errorMessage,
                    type: 'ail'
                  })
                }
                this.$refs['editForm'].resetFields()
                this.editFormVisible = false
                this.getResult(1)
                this.getCurrentPageData()
              })
          })
        }
      })
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
    getResult: function(val) {
      this.currentPage = val
      this.listLoading = true
      var data = {
      }
      var CommonRequest = {
        url: 'http:localhost:8081/dictionary/queryAll',
        method: 'POST',
        data: data
      }
      Axios({
        method: 'POST',
        baseURL: '/api/dictionary/queryAll',
        data: CommonRequest
      }).then(CommonResponse => {
        if (CommonResponse && CommonResponse.data.status === 'success') {
          var object = CommonResponse.data.data
          var length = Object.keys(object)
          console.log(length)
          this.tableData = object
          //  this.count = length;
          this.listLoading = false
          this.totalPage = length
          this.countPages()
        } else {
          alert(CommonResponse.data.data.errorMessage)
        }
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
