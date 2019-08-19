<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:10%; width: 100%">
        <el-row style="height:50%">
          题目类别：<el-input size="mini" style="width: 10%" />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <el-row style="display: inline">
          <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          <el-button type="primary" size="mini" icon="el-icon-upload">导入</el-button>
          <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="30%" />
          <el-table-column prop="name" label="题目类别" />
          <el-table-column prop="category" label="备注" />
          <el-table-column prop="value" label="更新时间" />
          <el-table-column prop="remark" label="状态" />
          <el-table-column label="操作" width="200%">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini" circle />
              <el-button type="success" icon="el-icon-check" size="mini" circle />
              <el-button type="warning" icon="el-icon-star-off" size="mini" circle />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle />
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
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :inline="true" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="字典名" prop="dictionary_name">
          <el-input v-model="addForm.dictionaryName" auto-complete="off"></el-input>
        </el-form-item>
        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
        <el-form-item label="字典类型" prop="dictionary_type">
          <el-input v-model="addForm.dictionaryType" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dictionary_value">
          <el-input v-model="addForm.dictionaryValue" auto-complete="off"></el-input>
        </el-form-item>
        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
        <el-form-item label="是否启用" prop="status">
          <el-radio v-model="addForm.status" label="1" >是</el-radio>
          <el-radio v-model="addForm.status" label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="备注信息" prop="comment">
          <el-input v-model="addForm.comment" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{remark: 444}],
      show: true,
      addFormVisible: false,
      //新增界面数据
      addForm: {
        dictionaryName:'',
        dictionaryType:'',
        dictionaryValue:'',
        status:'',
        comment:'',
      },
      addFormRules: {
      dictionaryName: [{ required: true, message: "请输入字典名", trigger: "blur" }],
      dictionaryType: [
        { required: true, message: "请输入字典类型", trigger: "blur" }
      ],
      dictionaryValue: [
        { required: true, message: "请输入字典值", trigger: "blur" }
      ],
      status: [{ required: true, message: "请选择是否启用", trigger: "blur" }],
      comment: [{ required: true, message: "请输入描述信息", trigger: "blur" }]
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
    //显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
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
