<template>
  <div class="dashboard-container">
    <el-container v-show="show" style="height: 800px">
      <el-header style="width: 100%">
        <el-row>
          场次名:
          <el-input placeholder="场次名" size="mini" style="width: 9%" />&nbsp;
          考试名:
          <el-input placeholder="考试名" size="mini" style="width: 9%" />&nbsp;
          试卷发布人:
          <el-input placeholder="试卷发布人" size="mini" style="width: 9%" />&nbsp;
          考试时间段:
          <el-date-picker
            v-model="time"
            style="width: 30%"
            size="mini"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
      </el-header>
      <p style="margin:0px">
        &nbsp;&nbsp;
        <i style="color:#5599AA;font-size:13px" class="el-icon-question">查看详情</i>
      </p>
      <el-main v-if="show">
        <el-table :data="tableData" height="90%" style="width: 100%" border @row-click="changeShow">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="name" label="考试名" />
          <el-table-column prop="category" label="场次" />
          <el-table-column prop="value" label="考试截止时间" />
          <el-table-column prop="remark" label="计划考试人数" />
          <el-table-column prop="remark" label="实际考试人数" />
          <el-table-column prop="remark" label="操作">
            <i style="color:green;font-size:20px" class="el-icon-question" />
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration" />
          <el-pagination layout="prev, pager, next" :total="50" />
        </div>
      </el-main>
    </el-container>
    <div v-show="!show">
      <el-table border :data="tableData" height="700px" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="exaName" label="考试名" width="180" />>
        <el-table-column prop="subItem" label="主观题" />
        <el-table-column prop="objItem" label="客观题" />
        <el-table-column prop="score" label="总分" />
        <el-table-column prop="ranking" label="排名" />
        <el-table-column prop="spendtime" label="考试耗时" />
        <el-table-column prop="label" label="能力标签" />
      </el-table>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="block">
            <span class="demonstration" />
            <el-pagination layout="prev, pager, next" :total="50" />
          </div>
        </el-col>
        <el-col :span="2" :offset="16">
          <el-button @click="changeShow">返回</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }, { remark: 444 }],
      show: true
    }
  },
  mounted() {
    this.getReport()
  },
  methods: {
    getReport() {
      this.$axios.get('http://localhost:8080/dictionary/findAll').then(res => {
        this.tableData = res.data
        //  console.log(this.getDictionaryData)
      })
    },
    changeShow() {
      this.show = !this.show
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
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
