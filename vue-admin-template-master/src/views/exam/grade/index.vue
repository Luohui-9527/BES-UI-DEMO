<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:100px; width: 100%">
        <el-row style="display: inline">
          批阅状态:
          <el-select v-model="value" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              style="width: 20%"
            />
          </el-select>&nbsp;&nbsp;&nbsp;&nbsp;交卷时间段:
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;&nbsp;&nbsp;&nbsp;考试标题:
          <el-input placeholder="考试标题" style="width: 7%" />&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" icon="el-icon-search" @click="getDictionary">查询</el-button>
        </el-row>
        <div style="margin-top:20px">
          <el-button type="primary" size="mini">
            <i class="el-icon-notebook-1" />阅卷
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="name" label="试卷" />
          <el-table-column prop="category" label="场次" />
          <el-table-column prop="value" label="发布日期" />
          <el-table-column prop="category" label="答卷人手机号" />
          <el-table-column prop="remark" label="答卷人" />
          <el-table-column prop="remark" label="交卷时间" />
          <el-table-column prop="remark" label="阅卷终止时间" />
          <el-table-column prop="remark" label="客观题" />
          <el-table-column prop="remark" label="主观题" />
          <el-table-column prop="remark" label="系统评价" />
          <el-table-column prop="remark" label="状态" />
          <el-table-column label="操作">
            <el-button type="primary" icon="el-icon-notebook-1" size="mini" circle />
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration" />
          <el-pagination background layout="prev, pager, next" :total="50" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }],
      time: ''
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}
</style>
