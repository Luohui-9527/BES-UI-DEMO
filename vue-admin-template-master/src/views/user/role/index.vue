<template>
  <div class="dashboard-container">
    <el-container>
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
      <!--el-main为表格主体的部分，下面都可以直接抄-->
      <el-main>
        <el-header style="height:30% width: 100%">
          <el-row>
            <el-form :inline="true" style="float: left">
              <el-form-item label="角色名称：">
                <el-input v-model="queryRoleData.name" size="mini" style="width: 130px" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="queryRole">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row style="display: inline">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="saveDialogVisible = true">增加</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteDialogVisible = true">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-edit" @click="updateDialogVisible = true">修改</el-button>
            <el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="manageDialogVisible = true">资源分配</el-button>
            <el-button type="success" size="mini" icon="el-icon-user" @click="userDialogVisible = true">用户分配</el-button>
          </el-row>
        </el-header>
        <el-main v-if="show">
          <el-table :data="roleData" border style="width: 100%" stripe="true" height="90%">
            <el-table-column type="selection" width="35px" />
            <el-table-column prop="name" label="角色名称" align="center" />
            <el-table-column prop="code" label="角色代号" align="center" />
            <el-table-column prop="remark" label="角色备注" align="center" />
            <el-table-column prop="orgName" label="所属机构" align="center" />
            <el-table-column prop="companyName" label="所属公司" align="center" />
            <el-table-column prop="status" label="是否启用" align="center" />>
            <el-table-column label="操作" width="210" align="center">
              <template>
                <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="saveDialogVisible = true" />
                <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteDialogVisible = true" />
                <el-button type="success" icon="el-icon-edit" size="mini" circle @click="updateDialogVisible = true" />
                <el-button type="success" size="mini" icon="el-icon-circle-plus-outline" @click="manageDialogVisible = true" />
                <el-button type="success" size="mini" icon="el-icon-user" @click="userDialogVisible = true" />
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
    <el-dialog :visible.sync="userDialogVisible" title="用户分配" center>
      <el-table :data="userData" border style="width: 100%" stripe="true" height="90%">
        <el-table-column type="selection" width="35" />
        <el-table-column prop="code" label="用户工号" align="center" />
        <el-table-column prop="password" label="初始密码" align="center" />
        <el-table-column prop="name" label="名字" align="center" />
        <el-table-column prop="roleName" label="角色" align="center" />
        <el-table-column prop="sex" label="性别" align="center" />
        <el-table-column prop="birthday" label="生日" align="center" />
        <el-table-column prop="positionName" label="职位" align="center" />
        <el-table-column prop="tel" label="电话" align="center" />
        <el-table-column prop="email" label="邮箱" align="center" />
        <el-table-column prop="other" label="其他/微信" align="center" />
        <el-table-column prop="remark" label="备注" align="center" />
        <el-table-column prop="status" label="是否启用" align="center" />
        <el-table-column label="操作" width="210" align="center">
          <template>
            <el-button type="primary" icon="el-icon-add" size="mini" circle @click="saveDialogVisible = true" />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteDialogVisible = true" />
            <el-button type="success" icon="el-icon-edit" size="mini" circle @click="updateDialogVisible = true" />
            <el-button type="success" size="mini" icon="el-icon-user" @click="roleDialogVisible = true" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="userDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="manageDialogVisible" title="资源分配" center width="400px">
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
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="manageDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="saveDialogVisible" title="新增角色" center width="600px">
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">角色基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="saveForm" :model="saveForm" label-width="20%" size="mini" :rules="FormRules">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="saveForm.name" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色代号：" prop="code">
          <el-input v-model="saveForm.code" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色备注：" prop="remark">
          <el-input v-model="saveForm.remark" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属机构：" prop="orgName">
          <el-select v-model="saveForm.orgName" size="mini" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司：" prop="companyName">
          <el-select v-model="saveForm.companyName" size="mini" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio v-model="saveForm.status" label="1">是</el-radio>
          <el-radio v-model="saveForm.status" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="saveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog style="margin-top: 30px" title="消 息" :visible.sync="deleteDialogVisible" width="40%" center>
      <span>确定要删除该角色吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delDictionaryData(deleteData.categoryId)">确 定</el-button>
        <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateDialogVisible" title="修改角色" center>
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">角色基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="updateForm" :model="updateForm" label-width="20%" size="mini" :rules="FormRules">
        <el-form-item label="角色名称：" prop="name">
          <el-input v-model="updateForm.name" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色代号：" prop="code">
          <el-input v-model="updateForm.code" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="角色备注：" prop="remark">
          <el-input v-model="updateForm.remark" style="width: 50%" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属机构：" prop="orgName">
          <el-select v-model="updateForm.orgName" size="mini" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属公司：" prop="companyName">
          <el-select v-model="updateForm.companyName" size="mini" placeholder="请选择" style="width: 50%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用：" prop="status">
          <el-radio v-model="updateForm.status" label="1">是</el-radio>
          <el-radio v-model="updateForm.status" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="updateDialogVisible = false">取 消</el-button>
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
      // options之上都为树要用的类，不用树可以删去
      DATA: null,
      NODE: null,
      dialogNewFormVisible: false,
      dialogFormVisible: false,
      dialogClassifyVisible: false,
      maxexpandId: api.maxexpandId, // 新增节点开始id
      non_maxexpandId: api.maxexpandId, // 新增节点开始id(不更改)
      isLoadingTree: true, // 是否加载节点树
      setTree: api.treelist, // 节点树数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: '',
      input: '',
      input2: '',
      currentPage4: 4,
      editObj: {},
      menuVisible: false,
      objectID: null,
      // 分类修改*/
      menuVisible2: false,
      objectID2: null,
      options: [{
        value: 1,
        label: '正常'
      }, {
        value: 0,
        label: '禁用'
      }],
      roleData: [],
      userData: [],
      show: true,
      queryRoleData: {
        name: ''
      },
      FormRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色代号', trigger: 'blur' }],
        orgName: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        companyName: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
        status: [{ required: true, message: '请选择是否启用', trigger: 'blur' }]
      },
      saveForm: {
        roleId: '',
        name: '',
        code: '',
        remark: '',
        orgName: '',
        companyName: '',
        status: ''
      },
      updateForm: {
        roleId: '',
        name: '',
        code: '',
        remark: '',
        orgName: '',
        companyName: '',
        status: ''
      },
      saveDialogVisible: false,
      deleteDialogVisible: false,
      updateDialogVisible: false,
      manageDialogVisible: false,
      userDialogVisible: false
    }
  },
  mounted() {
    this.dragControllerDiv()
    this.getrole()
  },
  methods: {
    getrole() {
      this.$axios.get('/role/getRole').then(res => {
        this.roleData = res.data
        for (let i = 0; i < this.roleData.length; i++) {
          this.options.add(this.roleData.orgName, i + 1)
        }
        console.log(this.roleData)
      })
    },
    queryrole() {
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
            name: this.queryroleData.name,
            orgName: this.queryroleData.orgName
          }
        }
      }
      this.$axios.get('/role/queryrole', commonRequest).then(res => {
        this.roleData = res.data
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
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
