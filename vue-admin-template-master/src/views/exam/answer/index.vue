<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:13%; width: 100%">
        <el-form :model="form" :inline="true">
          <el-form-item label="考试名">
            <el-input v-model="form.title" placeholder="考试名" size="mini" />
          </el-form-item>
          <el-form-item label="场次编号">
            <el-input v-model="form.examSession" placeholder="场次编号" size="mini" />
          </el-form-item>
          <el-row>
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
            <el-form-item label="试卷发布人">
              <el-input v-model="form.publisher" placeholder="试卷发布人" size="mini" />
            </el-form-item>
            <el-button
              style="margin-top: 5px"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="submit"
            >查询</el-button>
          </el-row>
        </el-form>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="title" label="考试名" />
          <el-table-column prop="examSession" label="场次" />
          <el-table-column prop="endTime" label="考试截止时间" />
          <el-table-column prop="tel" label="答卷人手机号" />
          <el-table-column prop="examiner" label="姓名" />
          <el-table-column prop="actualStartTime" label="开始考试时间" />
          <el-table-column prop="actualEndTime" label="交卷时间" />
          <el-table-column prop="objectiveSubjectScore" label="客观题得分" />
          <el-table-column prop="subjectvieSubjectScore" label="主观题得分" />
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
      tableData: [{ title: 'java', examSession: '13452', endTime: new Date().toLocaleString(), tel: '13275011526', examiner: 'syt', actualStartTime: new Date().toLocaleString(), actualEndTime: new Date().toLocaleString(), objectiveSubjectScore: 50, subjectvieSubjectScore: 50 }],
      form: {
        title: '',
        examSession: '',
        examTimeRange: [],
        publisher: ''
      },
      show: true
    }
  },
  methods: {
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
</style>
