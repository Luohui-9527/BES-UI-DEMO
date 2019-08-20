<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
       <!--el-aside为树的部分，不用可以删去-->
      <el-aside width="180px">
        <h3 class="el-icon-folder" style="margin: 0px">
          组织机构
          <i class="el-icon-plus" @click="saveDialogVisible = true" />
          <i class="el-icon-refresh-left" />
        </h3>
        <el-tree
          ref="SlotMenuList"
          :data="setTree"
          :props="defaultProps"
          node-key="id"
          :filter-node-method="filterNode"
          style="margin-top:20px"
          accordion
          @node-contextmenu="rihgtClick"
        >
          <span slot-scope="{ node, data }" class="span-ellipsis">
            <span v-show="!node.isEdit">
              <span v-show="data.children && data.children.length >= 1">
                <i
                  :class="{ 'fa fa-plus-square': !node.expanded, 'fa fa-minus-square':node.expanded}"
                />
                <span :title="node.label">{{ node.label }}</span>
              </span>
              <span v-show="!data.children || data.children.length == 0">
                <i class style="margin-right:10px" />
                <span :title="node.label">{{ node.label }}</span>
              </span>
            </span>
            <!-- 编辑输入框 -->
            <span v-show="node.isEdit">
              <el-input
                :ref="'slotTreeInput'+data.id"
                v-model="data.name"
                class="slot-t-input"
                size="mini"
                autofocus
                @blur.stop="NodeBlur(node, data)"
                @keyup.enter.native="NodeBlur(node, data)"
              />
            </span>
          </span>
        </el-tree>
        <!--鼠标右键点击出现页面-->
        <div v-show="menuVisible">
          <el-menu
            id="rightClickMenu"
            class="el-menu-vertical"
            text-color="#000000"
            active-text-color="#000000"
            @select="handleRightSelect"
          >
            <el-menu-item index="1" class="menuItem">
              <span slot="title">添加分类</span>
            </el-menu-item>
            <el-menu-item index="2" class="menuItem">
              <span slot="title">修改分类</span>
            </el-menu-item>
            <el-menu-item index="3" class="menuItem">
              <span slot="title">删除分类</span>
            </el-menu-item>
          </el-menu>
        </div>
      </el-aside>
      <el-main>
        <el-header style="height:10%; width: 100%">
        <!-- 表头 -->
        <el-row>
          <el-form :inline="true" style="float: left" :model="filters">
            <el-form-item label="组卷配置项标题：">
              <el-input v-model="filters.name" style="width: 130px" placeholder="请输入" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchDic(filters.name)">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <!-- 按钮 -->
        <el-row style="display: inline">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">增加</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="mutiDel">删除</el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit">修改</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="40%" />
          <el-table-column prop="name" label="题目类别" />
          <el-table-column prop="category" label="备注" />
          <el-table-column prop="value" label="更新时间" />
          <el-table-column prop="remark" label="状态" />
          <el-table-column label="操作" width="200%">
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
      </el-main>
    </el-container>
    <el-dialog title="新增" width="20%" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="addForm" :inline="true" :model="addForm" label-width="80px" :rules="addFormRules">
        <el-row>
          <el-form-item label="字典名" prop="dictionary_name">
            <el-input v-model="addForm.dictionaryName" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典类型" prop="dictionary_type">
            <el-input v-model="addForm.dictionaryType" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="字典值" prop="dictionary_value">
            <el-input v-model="addForm.dictionaryValue" auto-complete="off" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用" prop="status">
            <el-radio v-model="addForm.status" label="1">是</el-radio>
            <el-radio v-model="addForm.status" label="2">否</el-radio>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注信息" prop="comment">
            <el-input v-model="addForm.comment" auto-complete="off" />
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ remark: 444 }],
      show: true,
      addFormVisible: false,
      filters: { name: '' },
      //  新增界面数据
      addForm: {
        dictionaryName: '',
        dictionaryType: '',
        dictionaryValue: '',
        status: '',
        comment: ''
      },
      addFormRules: {
        dictionaryName: [{ required: true, message: '请输入字典名', trigger: 'blur' }],
        dictionaryType: [
          { required: true, message: '请输入字典类型', trigger: 'blur' }
        ],
        dictionaryValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }],
        comment: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]
      }
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
    },
    //  显示新增界面
    handleAdd: function() {
      this.addFormVisible = true
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
