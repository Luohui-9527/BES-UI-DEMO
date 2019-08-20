<template>
  <div class="dashboard-container">
    <el-container v-show="show" style="height: 800px">
      <el-header style="height:15%; width: 100%">
        <el-form :model="form" :inline="true">
          <el-form-item label="场次名">
            <el-input v-model="form.examSession" placeholder="场次名" size="mini" />
          </el-form-item>
          <el-form-item label="考试名">
            <el-input v-model="form.title" placeholder="考试名" size="mini" />
          </el-form-item>
          <el-form-item label="试卷发布人">
            <el-input v-model="form.publisher" placeholder="试卷发布人" size="mini" />
          </el-form-item>
          <el-form-item label="考试时间段">
            <el-date-picker
              v-model="form.examTimeRange"
              size="mini"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="margin-top: 5px"
            @click="submit"
          >查询</el-button>
        </el-form>
      </el-header>
      <div style="margin-left:20px">
        <el-button type="primary" size="mini">
          <i class="el-icon-question" />查看详情
        </el-button>
      </div>
      <el-main v-if="show">
        <el-table
          :data="tableData1"
          height="90%"
          style="width: 100%"
          border
          @row-click="changeShow"
        >
          <el-table-column type="selection" width="35" />
          <el-table-column prop="title" label="考试名" />
          <el-table-column prop="examSession" label="场次" />
          <el-table-column prop="endTime" label="考试截止时间" />
          <el-table-column prop="planPepoleNum" label="计划考试人数" />
          <el-table-column prop="actualPepoleNum" label="实际考试人数" />
          <el-table-column label="操作">
            <i style="color:green;font-size:20px" class="el-icon-question" />
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration" />
          <el-pagination background layout="prev, pager, next" :total="50" />
        </div>
      </el-main>
    </el-container>
    <div v-show="!show">
      <el-table border :data="tableData2" height="700px" stripe style="width: 100%">
        <el-table-column prop="examiner" label="姓名" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="title" label="考试名" />>
        <el-table-column prop="objectiveSubjectScore" label="主观题" />
        <el-table-column prop="subjectvieSubjectScore" label="客观题" />
        <el-table-column prop="score" label="总分" />
        <el-table-column prop="ranking" label="排名" />
        <el-table-column prop="examCostTime" label="考试耗时" />
        <el-table-column prop="abilityLabel" label="能力标签" />
      </el-table>

      <el-row :gutter="20">
        <el-col :span="6">
          <div class="block">
            <span class="demonstration" />
            <el-pagination background layout="prev, pager, next" :total="50" />
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
      tableData1: [{ title: 'java', examSession: '12334', endTime: new Date().toLocaleString(), planPepoleNum: 5, actualPepoleNum: 50 }],
      tableData2: [{ examiner: 'syt', sex: '男', title: 'java', objectiveSubjectScore: 50, subjectvieSubjectScore: 50, score: 100, ranking: 1, examCostTime: '5分钟', abilityLabel: 'A' }],
      show: true,
      form: {
        examSession: '',
        title: '',
        publisher: '',
        examTimeRange: []
      }
    }
  },
  methods: {
    changeShow() {
      this.show = !this.show
    },
    submit() {

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
