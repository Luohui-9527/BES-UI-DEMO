<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:100px; width: 100%">
        <el-form :model="form" :inline="true">
          <el-form-item label="批阅状态">
            <el-select
              v-model="form.value"
              size="mini"
              style="width: 100px"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in form.options"
                :key="item.value"
                size="mini"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="交卷时间段">
            <el-date-picker
              v-model="form.endTimeRange"
              size="mini"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="考试标题">
            <el-input v-model="form.title" size="mini" placeholder="考试标题" />
          </el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="margin-top: 5px"
            @click="submit"
          >查询</el-button>
        </el-form>
        <div>
          <el-button type="primary" size="mini">
            <i class="el-icon-notebook-1" />阅卷
          </el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="paper" label="试卷" />
          <el-table-column prop="examSession" label="场次" />
          <el-table-column prop="publishDate" label="发布日期" />
          <el-table-column prop="tel" label="答卷人手机号" />
          <el-table-column prop="examiner" label="答卷人" />
          <el-table-column prop="actualEndTime" label="交卷时间" />
          <el-table-column prop="markingStopTime" label="阅卷终止时间" />
          <el-table-column prop="objectiveSubjectScore" label="客观题" />
          <el-table-column prop="subjectvieSubjectScore" label="主观题" />
          <el-table-column prop="systemEvaluate" label="系统评价" />
          <el-table-column prop="status" label="状态" />
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
      tableData: [{ paper: 'java', examSession: '12334', publishDate: new Date().toLocaleString(), tel: '1312312344', examiner: 'syt', actualEndTime: new Date().toLocaleString(), markingStopTime: new Date().toLocaleString(), objectiveSubjectScore: 50, subjectvieSubjectScore: 50, systemEvaluate: 'good', status: '已批阅' }],
      form: {
        options: [{
          value: '选项1',
          label: '已批阅'
        },
        {
          value: '选项2',
          label: '未批阅'
        }],
        endTimeRange: [],
        title: ''
      }
    }
  },
  methods: {
    submit() {

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}
</style>
