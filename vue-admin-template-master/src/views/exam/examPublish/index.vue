<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:100px; width: 100%">
        <el-row style="display: inline">
          <el-col :span="10">
            试卷发布人:
            <el-input placeholder="试卷发布人" size="mini" style="width: 50%" />&nbsp;
          </el-col>发布时间段:
          <el-date-picker
            v-model="time"
            size="mini"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10">
            考 试 标 题:
            <el-input placeholder="考试标题" size="mini" style="width: 50%" />
          </el-col>考试时间段:
          <el-date-picker
            v-model="time"
            size="mini"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <div style="margin-top:20px">
          <el-row style="display: inline">
            <el-button type="primary" size="mini" @click="dialogFormVisible = true">
              <i class="el-icon-edit" />修改
            </el-button>
            <el-button type="primary" size="mini" @click="open">
              <i class="el-icon-delete" />删除
            </el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible = true">
              <i class="el-icon-circle-plus" />发布
            </el-button>
          </el-row>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="name" label="试卷发布人" />
          <el-table-column prop="category" label="发布时间段" />
          <el-table-column prop="value" label="考试结束日期和时间" />
          <el-table-column prop="category" label="计划人数" />
          <el-table-column prop="remark" label="考试时长" />
          <el-table-column prop="remark" label="评卷官" />
          <el-table-column prop="remark" label="考试说明" />
          <el-table-column prop="remark" label="状态列" />
          <el-table-column prop="remark" label="发布次数" />
          <el-table-column label="操作" width="210">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="dialogFormVisible = true"
            />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="open" />
            <el-button type="warning" icon="el-icon-share" size="mini" circle />
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration" />
          <el-pagination background layout="prev, pager, next" :total="50" />
        </div>
      </el-main>
    </el-container>

    <el-dialog title="发布信息" :visible.sync="dialogFormVisible" center>
      <el-form :v-model="form" label-width="170px">
        <el-form-item label="试卷" :label-width="formLabelWidth">
          <el-select v-model="value" filterable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="考试场次">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试标题">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试截止日期">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试截止时间">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="计划参与人数">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试时长">
          <el-input style="width: 50%" />
        </el-form-item>
        <el-form-item label="评卷官">
          <el-select v-model="value1" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="阅卷方式">
          <el-select v-model="form.region" placeholder="请选择阅卷方式">
            <el-option label="1" value="1" />
            <el-option label="2" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择阅卷截止时间">
          <div class="block">
            <el-date-picker
              v-model="value3"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
            />
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }],
      time: '',
      dialogFormVisible: false,
      visible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
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
    open() {
      this.$confirm('此操作将永久删除选中内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}
</style>
