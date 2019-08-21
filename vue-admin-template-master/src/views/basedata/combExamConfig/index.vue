<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:10%; width: 100%">
        <!-- 表头 -->
        <el-row>
          <el-form :inline="true" style="float: left" :model="filters">
            <el-form-item label="组卷配置项标题：">
              <el-input v-model="filters.name" style="width: 130px" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchDic(filters.name)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 按钮 -->
        <el-row style="display: inline">
          <el-button type="success" size="mini" icon="el-icon-plus" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="mutiDel">删除</el-button>
          <el-button type="warning" size="mini" icon="el-icon-edit" @click="handleEdit">修改</el-button>
        </el-row>
      </el-header>
      <!-- 表格 -->
      <el-main v-if="show">
        <el-table v-loading="listLoading" :data="currentPageData" border style="width: 100%" height="90%" @selection-change="selectChange">
          <el-table-column type="selection" width="40%" />
          <el-table-column prop="name" label="配置项" />
          <el-table-column prop="difficult" label="难度" />
          <el-table-column prop="updatedBy" label="修改人" />
          <el-table-column prop="updatedTime" label="更新时间" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="company" label="公司" />
          <el-table-column prop="remark" label="备注" />
          <!-- 操作按钮 -->
          <el-table-column fixed="right" label="操作" width="150%">
            <template>
              <el-button type="success" icon="el-icon-plus" size="mini" circle @click="handleAdd" />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="mutiDel" />
              <el-button type="warning" icon="el-icon-edit" size="mini" circle @click="handleEdit" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-button icon="el-icon-arrow-left" @click="prevPage" />
        <span>第{{ currentPage }}页/共{{ totalPage }}页</span>
        <el-button icon="el-icon-arrow-right" @click="nextPage" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      //  返回数据
      tableData: [],
      //  搜索区域参数
      filters: { name: '' },
      //  列表Loading加载
      listLoading: false,
      show: true,
      //  批量选中data
      selectList: [],
      formRules: {
        combExamConfigName: [{ required: true, message: '请输入配置项名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
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
      this.$router.push({
        name: 'CombExam'
      })
    },
    //  显示编辑界面
    handleEdit: function() {
      this.$router.push({
        name: 'CombExam'
      })
    },
    //  批量选中
    selectChange: function(val) {
      this.selectList = val
    },
    //  批量删除
    mutiDel: function() {
      this.$confirm('确认删除吗？', '提示', {})
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
