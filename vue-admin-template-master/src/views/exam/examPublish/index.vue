<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
      <el-form-item label="试卷发布人:">
        <el-input v-model="formInline.user" placeholder="试卷发布人"></el-input>
      </el-form-item>
      <el-form-item label="发布时间段:">
          <el-time-picker placeholder="选择时间" v-model="formInline.time" style="width: 30%;"></el-time-picker>
          <label>到</label>
          <el-time-picker placeholder="选择时间" v-model="formInline.time" style="width: 30%;"></el-time-picker>
      </el-form-item>
      <br>
      <el-form-item label="考 试 标 题:">
          <el-input v-model="formInline.user" placeholder="考试标题"></el-input>
        </el-form-item>
      <el-form-item>
      <el-form-item label="考试时间段:">
          <el-time-picker placeholder="选择时间" v-model="formInline.time" style="width: 30%;"></el-time-picker>
          <label>到</label>
          <el-time-picker placeholder="选择时间" v-model="formInline.time" style="width: 30%;"></el-time-picker>
      </el-form-item>
        <el-button type="primary" @click="showTime">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
    ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop=""
      label="试卷发布人"
      >
    </el-table-column>
    <el-table-column
      prop=""
      label="发布时间段"
    >
    </el-table-column>
    <el-table-column
      prop=""
      label="考试结束日期和时间"
    >
    </el-table-column>
    <el-table-column
      prop=""
      label="计划人数"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="考试时长"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="评卷官"
    >
    </el-table-column>
    <el-table-column
      prop=""
      label="考试说明"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="状态列"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="发布次数"
    >
    </el-table-column>
    <el-table-column
      prop="name"
      label="操作列"
    >
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
    <el-button @click="toggleSelection()">取消选择</el-button>
  </div>
    
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
      return {
        tableData: [],
        multipleSelection: [],
        formInline: {
          user: '',
          time: ''
        }
      }
    },

    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      showTime(){
        alert(this.formInline.time);
      }
    }
}
</script>

<style lang="scss" scoped>
  .dashboard-container{
    margin: 30px;
  }
</style>
