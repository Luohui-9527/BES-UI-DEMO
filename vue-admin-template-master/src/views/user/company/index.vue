<template>
  <el-container>
    <!-- 左侧边栏 -->
    <el-aside width="180px">
      <!-- 树上方的信息 -->
      <el-container>
        <el-header>
          <el-row>
            <el-col>
              <h1 style="font-size:20px;" class="el-icon-menu">题目类别</h1>
            </el-col>
          </el-row>
        </el-header>
        <!-- 树 -->
        <el-main>
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
        </el-main>
      </el-container>
    </el-aside>

    <!-- 主体部分 -->
    <el-main>
      <el-header style="height:30%; width: 100%">
        <el-row style="height:100%">
          字典名称：<el-input size="mini" style="width: 140px" />&nbsp;
          字典类型：<el-input size="mini" style="width: 140px" />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <el-row style="display: inline">
          <el-button type="primary" size="mini">增加</el-button>
          <el-button type="primary" size="mini">删除</el-button>
          <el-button type="primary" size="mini">修改</el-button>
          <el-button type="primary" size="mini">导入</el-button>
          <el-button type="primary" size="mini">导出</el-button>
        </el-row>
      </el-header>
      <el-main v-if="show">
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="name" label="字典名" />
          <el-table-column prop="category" label="字典类型" />
          <el-table-column prop="value" label="更新时间" />
          <el-table-column prop="category" label="备注" />
          <el-table-column prop="remark" label="状态" />
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
    </el-main>
  </el-container>
</template>

<script>
// import { log } from 'util'
export default {
  name: 'App',
  data() {
    return {
      /**
         * 树结构数据
         */
      treeData: [
        {
          label: '数学题',
          children: [
            {
              label: '几何'
            }
          ]
        },
        {
          label: '物理题',
          children: [
            {
              label: '力学'
            },
            {
              label: '电学'
            }
          ]
        }
      ],
      /**
         * 树结构的默认属性
         */
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      /**
         * 查询字段
         */
      formInline: {
        companyName: '',
        organizationNames: []
      },

      /**
         * 公司管理
         */
      companys: [
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '启用'
        },
        {
          name: '阿里',
          code: '002',
          mnemonicCode: '亏钱的濒危企业',
          master: '马云',
          organizationName: '中国',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: '不启用'
        },
        {
          name: '百度',
          code: '003',
          mnemonicCode: '不接广告的搜索引擎',
          master: '李红艳',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        },
        {
          name: '腾讯',
          code: '001',
          mnemonicCode: '公平的游戏公司',
          master: '马化腾',
          organizationName: 'China',
          tax: '123456789012',
          fax: '123456789012',
          tel: '13000000000',
          email: 'test@test.com',
          website: 'www.test.com',
          status: ' 启用'
        }
      ],

      /**
         * 待确认字段
         */
      multipleSelection: [],
      /**
         * 初始显示的页数
         */
      currentPage1: 1,
      currentPage2: 2,
      currentPage3: 3,
      currentPage4: 4,
      dynamicTags: ['标签一', '标签二', '标签三']
    }
  },

  methods: {
    /**
       * 树结构的点击事件
       */
    handleNodeClick(data) {
      console.log(data)
    },

    /**
       * 勾选事件触发的函数
       */
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    /**
       * 跳转到增加界面
       */
    goto() {
      this.$router.push({
        name: 'AddCompany'
      })
    },
    update1() {
      this.$router.push({
        name: 'update'
      })
    },

    /**
       * 删除信息
       */
    delete1() {
      this.$confirm('是否要删除选定信息', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
  .itemAction {
    margin-right: 10px;
  }
</style>
