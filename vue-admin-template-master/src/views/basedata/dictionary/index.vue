<template>
  <div class="dashboard-container">
    <el-container style="height: 550px;">
      <el-header style="height:150px; width: 100%;">
        <div style="height: 50px; ">
          <i class="el-icon-user">字典管理</i>
          <div style="float:right; display: inline">
            <el-button type="primary" size="mini">隐藏</el-button>
            <el-button type="primary" size="mini">新增</el-button>
          </div>
        </div>
        <el-row style="height:20px">
          字典名：<el-input size="mini" style="width:140px" />&nbsp;
          字典类型：<el-input size="mini" style="width:140px" />&nbsp;
          启用标记：<el-input size="mini" style="width:140px" />&nbsp;&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="400">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="categoryId" label="字典ID" />
          <el-table-column prop="name" label="字典名" />
          <el-table-column prop="category" label="字典类型" />
          <el-table-column prop="value" label="字典值" />
          <el-table-column prop="remark" label="备注信息" />
          <el-table-column prop="updatedTime" label="更新时间" width="180" />
          <el-table-column prop="status" label="状态" width="50" />
          <el-table-column label="操作" width="210">
            <template>
              <el-button type="primary" icon="el-icon-edit" size="mini" circle />
              <el-button type="success" icon="el-icon-check" size="mini" circle />
              <el-button type="warning" icon="el-icon-star-off" size="mini" circle />
              <el-button type="danger" icon="el-icon-delete" size="mini" circle />
            </template>
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
