<template>
  <div class="dashboard-container">
    <!-- 增加窗口 -->
    <el-form ref="addForm" :inline="true" :model="addForm" :rules="formRules">
      <el-row>
        <el-form-item label="组卷配置信息:" />
      </el-row>
      <el-row>
        <el-form-item label="配置项名称" prop="name">
          <el-input v-model="addForm.name" auto-complete="off" style="width: 500px" />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="是否启用" prop="status">
          <el-radio v-model="addForm.status" label="1">是</el-radio>
          <el-radio v-model="addForm.status" label="2">否</el-radio>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="添加组卷明细:" />
      </el-row>
      <el-main v-if="show">
        <el-table v-loading="listLoading" :data="tableData" border style="width: 100%" height="90%" @selection-change="selectChange">
          <el-table-column type="selection" width="40%" />
          <el-table-column prop="category" label="题目类别" />
          <el-table-column prop="subjectType" label="类型" />
          <el-table-column prop="num" label="题目数量" />
          <el-table-column prop="difficult" label="题目难度" />
          <el-table-column prop="score" label="题的分值" />
          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="150%">
            <template>
              <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="handleAdd" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="mutiDel" />
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="handleEdit" />
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-form>
    <div slot="footer" class="dialog-footer" style="algin: center">
      <el-button type="primary" :loading="addLoading" @click="addSubmit">提交</el-button>
      <el-button @click="cancle">取消</el-button>
    </div>
    <!-- 新增配置窗口 -->
    <el-dialog title="基本信息" width="500px" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :inline="true" :model="addForm" label-width="100px" :rules="formRules">
        <el-form-item label="题目类别" prop="category">
          <el-input v-model="addForm.category" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题型" prop="subjectType">
          <el-input v-model="addForm.subjectType" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题目数量" prop="num">
          <el-input v-model="addForm.num" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题目难度" prop="difficult">
          <el-input v-model="addForm.difficult" auto-complete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="题的分值" prop="score">
          <el-input v-model="addForm.score" auto-complete="off" style="width: 300px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="addFormLoading" @click="addFormSubmit">提交</el-button>
        <el-button @click="addFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 修改配置窗口 -->
    <el-dialog title="基本信息" width="500px" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form ref="editForm" :inline="true" :model="editForm" label-width="100px" :rules="formRules">
        <el-row>
          <el-form-item label="题目类别" prop="category">
            <el-input v-model="editForm.category" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="题型" prop="subjectType">
            <el-input v-model="editForm.subjectType" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="题目数量" prop="num">
            <el-input v-model="editForm.num" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="题目难度" prop="difficult">
            <el-input v-model="editForm.difficult" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="题的分值" prop="score">
            <el-input v-model="editForm.score" auto-complete="off" style="width: 300px" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="editFormLoading" @click="editFormSubmit">提交</el-button>
        <el-button @click="editFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      //  返回数据
      tableData: [{ num: 10 }, { num: 20 }],
      combExamConfigData: [],
      //  列表Loading加载
      listLoading: false,
      //  添加按钮Loading加载
      addLoading: false,
      show: true,
      //  新增界面是否显示
      addFormVisible: false,
      //  新增界面数据
      addForm: {
        category: '',
        subjectType: '',
        score: '',
        difficult: '',
        num: ''
      },
      //  批量选中data
      selectList: [],
      formRules: {
        name: [{ required: true, message: '请输入配置项名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        category: [{ required: true, message: '请输入题目类别', trigger: 'blur' }],
        subjectType: [{ required: true, message: '请输入题型', trigger: 'blur' }],
        num: [{ required: true, message: '请输入题目数量', trigger: 'blur' }],
        difficult: [{ required: true, message: '请输入题目难度', trigger: 'blur' }],
        score: [{ required: true, message: '请输入题的分数', trigger: 'blur' }]
      },
      //  编辑界面是否显示
      editFormVisible: false,
      //  编辑界面数据
      editForm: {
        category: '',
        subjectType: '',
        score: '',
        difficult: '',
        num: ''
      }
    }
  },
  mounted() {
    //  初始加载
  },
  methods: {
    //  显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
    },
    //  显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    //  取消
    cancle: function() {
      this.$router.push({
        name: 'CombExamConfig'
      })
    },
    //  删除
    mutiDel: function() {
      this.$confirm('确认删除吗？', '提示', {})
    },
    //  批量选中
    selectChange: function(val) {
      this.selectList = val
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
