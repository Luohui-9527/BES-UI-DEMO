<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:100px; width: 100%">
        <el-row style="height:50%">
          试卷发布人:
          <el-input placeholder="试卷发布人" size="mini" style="width: 140px" />&nbsp;发布时间段:
          <el-date-picker
            v-model="time"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;考试时间段:
          <el-date-picker
            v-model="time"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;考试标题:
          <el-input placeholder="考试标题" size="mini" style="width: 140px" />
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <el-row style="display: inline">
          <el-button type="primary" size="mini">
            <i class="el-icon-edit" />修改
          </el-button>
          <el-button type="primary" size="mini">
            <i class="el-icon-delete" />删除
          </el-button>
          <el-button type="primary" size="mini">
            <i class="el-icon-circle-plus" />发布
          </el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
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
            <el-button type="primary" icon="el-icon-edit" size="mini" circle />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle />
            <el-button type="warning" icon="el-icon-share" size="mini" circle />
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
      show: true,
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
