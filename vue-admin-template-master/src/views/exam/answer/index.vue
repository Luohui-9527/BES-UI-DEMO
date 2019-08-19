<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="width: 100%">
<<<<<<< HEAD
        <el-row>
          考试名:
          <el-input placeholder="考试名" size="mini" style="width: 10%" />&nbsp;
          场次编号:
          <el-input placeholder="场次编号" size="mini" style="width: 10%" />&nbsp;
          考试时间段:
=======
        <el-row style="display: inline">
          <el-col :span="10">
            考 试 名 &nbsp;:
            <el-input placeholder="考试名" size="mini" style="width: 50%" />&nbsp;
          </el-col>考试时间段:
>>>>>>> 9e363575c0bda4f607777411f7c143f22321b601
          <el-date-picker
            v-model="time"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;
<<<<<<< HEAD
          试卷发布人:
          <el-input placeholder="试卷发布人" size="mini" style="width: 10%" />&nbsp;
=======
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="10">
            场次编号:
            <el-input placeholder="场次编号" size="mini" style="width: 50%" />&nbsp;
          </el-col>试卷发布人:
          <el-input placeholder="试卷发布人" size="mini" style="width: 40%" />&nbsp;
>>>>>>> 9e363575c0bda4f607777411f7c143f22321b601
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
