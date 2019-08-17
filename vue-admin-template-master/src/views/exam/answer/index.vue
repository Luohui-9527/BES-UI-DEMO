<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="width: 100%">
        <el-row>
          考试名：<el-input placeholder="考试名" size="mini" style="width: 140px" />&nbsp;
          场次编号：<el-input placeholder="场次编号" size="mini" style="width: 140px" />&nbsp;
          考试时间段：<el-time-picker size="mini" placeholder="选择时间" style="width: 120px" />到
          <el-time-picker size="mini" placeholder="选择时间" style="width: 120px" />&nbsp;
          试卷发布人：<el-input placeholder="试卷发布人" size="mini" style="width: 140px" />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="name" label="考试名" />
          <el-table-column prop="category" label="场次" />
          <el-table-column prop="value" label="考试截止时间" />
          <el-table-column prop="category" label="答卷人手机号" />
          <el-table-column prop="remark" label="姓名" />
          <el-table-column prop="remark" label="开始考试时间" />
          <el-table-column prop="remark" label="交卷时间" />
          <el-table-column prop="remark" label="客观题得分" />
          <el-table-column prop="remark" label="主观题得分" />
          <el-table-column label="操作" width="210">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle />
            <el-button type="success" icon="el-icon-check" size="mini" circle />
            <el-button type="warning" icon="el-icon-star-off" size="mini" circle />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle />
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
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [],
      show: true
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
