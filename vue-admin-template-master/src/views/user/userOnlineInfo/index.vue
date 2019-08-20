<template>
  <div class="dashboard-container">
    <el-container>
      <el-main>
        <el-header style="height:30% width: 100%">
          <el-row>
            <el-form :inline="true" style="float: left">
              <el-form-item label="工号" style="margin-right: 30px">
                <el-input v-model="queryUserOnlineInfoData.code" size="mini" style="width: 160px" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="用户名" style="margin-right: 30px">
                <el-input v-model="queryUserOnlineInfoData.name" size="mini" style="width: 160px" placeholder="请输入" />
              </el-form-item>
              <el-form-item label="在线时段" style="margin-right: 30px">
                <el-date-picker
                  v-model="queryUserOnlineInfoData.onlineInterval"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  size="mini"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="queryCompany">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="display: inline">
            <el-button type="danger" size="mini" icon="el-icon-lock">强制下线</el-button>
            <el-button type="primary" size="mini" icon="el-icon-download">导出</el-button>
          </el-row>
        </el-header>
        <el-main v-if="show">
          <el-table :data="userOnlineInfoData" border style="width: 100%" height="90%">
            <el-table-column type="selection" width="35" />
            <el-table-column prop="code" label="工号" />
            <el-table-column prop="name" label="用户" />
            <el-table-column prop="ip" label="IP" />
            <el-table-column prop="onlineTime" label="上线时间" />
            <el-table-column prop="offlineTime" label="下线时间" />
            <el-table-column prop="status" label="状态" />
            <el-table-column label="操作" width="210">
              <template>
                <el-button type="danger" size="mini" icon="el-icon-lock" />
                <el-button type="primary" size="mini" icon="el-icon-download" />
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <span class="demonstration" />
            <el-pagination layout="prev, pager, next" :total="50" />
          </div>
        </el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import api from '@/resource/api'
api.treelist = api.treelist.splice(0, 10)
export default {
  name: 'Position',
  data() {
    return {
      options: [{
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '禁用'
      }],
      userOnlineInfoData: [],
      queryUserOnlineInfoData: {
        name: '',
        code: '',
        onlineInterval: ''
      },
      show: true,
      saveDialogVisible: false,
      deleteDialogVisible: false,
      updateDialogVisible: false
    }
  },
  mounted() {
    this.dragControllerDiv()
    this.getCompany()
  },
  methods: {
    getOrganization() {
      this.$axios.get('/organization/getOrganization').then(res => {
        this.organizationData = res.data
        console.log(this.companyData)
      })
    },
    queryCompany() {
      let commonRequest = {}
      commonRequest = {
        head: {
          'version': '1',
          'token': this.$store.state.user.token,
          'businessType': '1',
          'deviceId': '1',
          'deviceType': '0',
          'encrypt': 'false'
        },
        body: {
          data: {
            name: this.queryOrganizationData.name
          }
        }
      }
      this.$axios.get('/organization/queryOrganization', commonRequest).then(res => {
        this.companyData = res.data
      })
    },
    handleRightSelect(key) {
      console.log(key)
      if (key === '1') {
        this.NodeAdd(this.NODE, this.DATA)
        this.menuVisible = false
      } else if (key === '2') {
        this.NodeEdit(this.NODE, this.DATA)
        this.menuVisible = false
      } else if (key === '3') {
        this.NodeDel(this.NODE, this.DATA)
        this.menuVisible = false
      }
    },
    NodeBlur(n, d) {
      // 输入框失焦
      console.log(n, d)
      if (n.isEdit) {
        this.$set(n, 'isEdit', false)
      }
      this.$nextTick(() => {
        this.$refs['slotTreeInput' + d.id].$refs.input.focus()
      })
    },
    NodeEdit(n, d) {
      // 编辑节点
      console.log(n, d)
      if (!n.isEdit) {
        // 检测isEdit是否存在or是否为false
        this.$set(n, 'isEdit', true)
      }
    },
    NodeDel(n, d) {
      // 删除节点
      console.log(n, d)
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        // 新增节点可直接删除，已存在的节点要二次确认
        // 删除操作
        const DelFun = () => {
          const _list = n.parent.data.children || n.parent.data // 节点同级数据
          const _index = _list.map(c => c.id).indexOf(d.id)
          console.log(_index)
          _list.splice(_index, 1)
          this.$message.success('删除成功！')
        }
        // 二次确认
        const ConfirmFun = () => {
          this.$confirm('是否删除此节点？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              DelFun()
            })
            .catch(() => {})
        }
        // 判断是否是新增节点
        d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
      }
    },
    NodeAdd(n, d) {
      // 新增节点
      console.log(n, d)
      // 判断层级
      if (n.level >= 3) {
        this.$message.error('最多只支持三级！')
        return false
      }
      // 新增数据
      d.children.push({
        id: ++this.maxxpandId,
        name: '新增节点',
        pid: d.id,
        children: []
      })
      // 同时展开节点
      if (!n.expanded) {
        n.expanded = true
      }
    },
    rihgtClick(event, object, value, element) {
      if (this.objectID !== object.id) {
        this.objectID = object.id
        this.menuVisible = true
        this.DATA = object
        this.NODE = value
      } else {
        this.menuVisible = !this.menuVisible
      }
      document.addEventListener('click', e => {
        this.menuVisible = false
      })
      const menu = document.querySelector('#rightClickMenu')
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX - 180 + 'px'
      menu.style.top = event.clientY - 100 + 'px'
      menu.style.position = 'absolute' //  为新创建的DIV指定绝对定位
      menu.style.width = 120 + 'px'
      // console.log("右键被点击的左侧:",menu.style.left)
      //   console.log("右键被点击的顶部:",menu.style.top)
      //         console.log("右键被点击的event:",event)
      //  console.log("右键被点击的object:", object)
      //  console.log("右键被点击的value:", value)
      //  console.log("右键被点击的element:", element)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 20px;
    line-height: 10px;
  }
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
