<template>
  <div class="dashboard-container">
    <el-container>
      <el-main>
        <el-header style="height:30% width: 100%">
          <el-row>
            <el-form :inline="true" style="float: left">
              <el-form-item label="职位名称：" style="margin-right: 50px">
                <el-input v-model="queryPositionData.name" size="mini" style="width: 160px" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="queryDictionaryData">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="display: inline">
            <el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="saveDialogVisible = true">增加</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDialogVisible = true">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateDialogVisible = true">修改</el-button>
          </el-row>
        </el-header>
        <el-main v-if="show">
          <el-table :data="positionData" border style="width: 100%" height="90%">
            <el-table-column type="selection" width="35" />
            <el-table-column prop="companyName" label="公司" />
            <el-table-column prop="name" label="职位名称" />
            <el-table-column prop="remark" label="备注" />
            <el-table-column prop="status" label="是否启用" />
            <el-table-column label="操作" width="210">
              <template>
                <el-button type="primary" icon="el-icon-add" size="mini" circle @click="saveDialogVisible = true" />
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteDialogVisible = true" />
                <el-button type="success" icon="el-icon-edit" size="mini" circle @click="updateDialogVisible = true" />
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
    <el-dialog :visible.sync="saveDialogVisible" title="新增职位" center width="500px">
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">职位基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="saveForm" :model="saveForm" label-width="120px" size="mini" inline="true" :rules="FormRules">
        <el-row>
          <el-form-item label="公司：" prop="companyName">
            <el-select v-model="positionData.companyName" size="mini" placeholder="请选择" style="width: 200px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="职位名称：" prop="name">
            <el-input v-model="saveForm.name" style="width: 200px" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="saveForm.remark" style="width: 200px" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用：" prop="status">
            <el-radio v-model="saveForm.status" label="1">是</el-radio>
            <el-radio v-model="saveForm.status" label="0">否</el-radio>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="saveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog style="margin-top: 30px" title="消 息" :visible.sync="deleteDialogVisible" width="40%" center>
      <span>确定要删除该职位吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delDictionaryData(deleteData.categoryId)">确 定</el-button>
        <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateDialogVisible" title="修改职位" center width="500px">
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">职位基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="updateForm" :model="updateForm" label-width="120px" size="mini" inline="true" :rules="FormRules">
        <el-row>
          <el-form-item label="公司：" prop="companyName">
            <el-select v-model="positionData.companyName" size="mini" placeholder="请选择" style="width: 200px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="职位名称：" prop="name">
            <el-input v-model="updateForm.name" style="width: 200px" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="updateForm.remark" style="width: 200px" placeholder="请输入" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="是否启用：" prop="status">
            <el-radio v-model="updateForm.status" label="1">是</el-radio>
            <el-radio v-model="updateForm.status" label="0">否</el-radio>
          </el-form-item>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="saveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
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
        label: '博思软件'
      }, {
        value: 0,
        label: '博思赋能'
      }],
      positionData: [],
      queryPositionData: {
        name: ''
      },
      show: true,
      FormRules: {
        companyName: [{ required: true, message: '请选择公司', trigger: 'blur' }],
        name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      saveForm: {
        positionId: '',
        name: '',
        companyName: '',
        remark: '',
        status: ''
      },
      updateForm: {
        positionId: '',
        name: '',
        companyName: '',
        remark: '',
        status: ''
      },
      saveDialogVisible: false,
      deleteDialogVisible: false,
      updateDialogVisible: false
    }
  },
  mounted() {
    this.getPosition()
  },
  methods: {
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
