<template>
  <div class="dashboard-container">
    <el-container>
      <!--el-aside为树的部分，不用可以删去-->
      <el-aside width="180px">
        <h3 class="el-icon-folder" style="margin: 0px">
          资源管理
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
              <el-form-item label="节点名称：">
                <el-select v-model="queryResourceData.name" size="mini" placeholder="请选择" style="width: 130px">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="父亲节点：">
                <el-input v-model="queryResourceData.parentName" size="mini" style="width: 130px" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="queryCompany">查询</el-button>
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
          <el-table :data="resourceData" border style="width: 100%" stripe="true" height="90%">
            <el-table-column type="selection" width="35" />
            <el-table-column prop="name" label="节点名称" align="center" />
            <el-table-column prop="code" label="编号" align="center" />
            <el-table-column prop="parent_id" label="父亲节点" align="center" />
            <el-table-column prop="url" label="URL" align="center" />
            <el-table-column prop="resource_type" label="资源类型" align="center" />
            <el-table-column prop="fax" label="顺序号" align="center" />
            <el-table-column prop="address" label="图标" align="center" />
            <el-table-column prop="leaf" label="是否叶子节点" align="center" />
            <el-table-column label="操作" width="210" align="center">
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
    <el-dialog :visible.sync="saveDialogVisible" title="新增资源基本信息" center>
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">资源基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="saveForm" :model="saveForm" label-width="120px" size="mini" inline="true" :rules="FormRules">
        <el-form-item label="节点名称：" prop="name">
          <el-input v-model="saveForm.name" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="节点编号：" prop="code">
          <el-input v-model="saveForm.code" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="父亲节点：" prop="parentName">
          <el-input v-model="saveForm.parentName" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="URL：" prop="url">
          <el-input v-model="saveForm.url" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="资源类型：" prop="resourceType">
          <el-input v-model="saveForm.resourceType" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关闭图标：" prop="closeImg">
          <el-input v-model="saveForm.closeImg" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="打开图标：" prop="openImg">
          <el-input v-model="saveForm.openImg" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否叶子节点：" prop="leaf">
          <el-radio v-model="saveForm.leaf" label="1">是</el-radio>
          <el-radio v-model="saveForm.leaf" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="updateDictionaryData(updateForm)">确 定</el-button>
        <el-button size="mini" @click="saveDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog style="margin-top: 30px" title="消 息" :visible.sync="deleteDialogVisible" width="40%" center>
      <span>确定要删除该资源吗？</span>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="delDictionaryData(deleteData.categoryId)">确 定</el-button>
        <el-button size="mini" @click="deleteDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="updateDialogVisible" title="修改资源基本信息" center>
      <el-header style="height: 5px">
        <i class="el-icon-user" style="float: left">资源基本信息</i>
      </el-header>
      <el-divider style="margin: 10px 0px" />
      <el-form ref="updateForm" :model="updateForm" label-width="120px" size="mini" inline="true" :rules="FormRules">
        <el-form-item label="节点名称：" prop="name">
          <el-input v-model="updateForm.name" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="节点编号：" prop="code">
          <el-input v-model="updateForm.code" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="父亲节点：" prop="parentName">
          <el-input v-model="updateForm.parentName" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="URL：" prop="url">
          <el-input v-model="updateForm.url" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="资源类型：" prop="resourceType">
          <el-input v-model="updateForm.resourceType" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="关闭图标：" prop="closeImg">
          <el-input v-model="updateForm.closeImg" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="打开图标：" prop="openImg">
          <el-input v-model="updateForm.openImg" style="width: 200px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否叶子节点：" prop="leaf">
          <el-radio v-model="updateForm.leaf" label="1">是</el-radio>
          <el-radio v-model="updateForm.leaf" label="0">否</el-radio>
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
      resourceData: [],
      show: true,
      queryResourceData: {
        name: '',
        parentName: ''
      },
      FormRules: {
        name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
        parentName: [{ required: true, message: '请输入父亲节点', trigger: 'blur' }],
        url: [{ required: true, message: '请输入URL', trigger: 'blur' }],
        resourceType: [{ required: true, message: '请输入资源类型', trigger: 'blur' }],
        closeImg: [{ required: true, message: '请输入关闭图标', trigger: 'blur' }],
        openImg: [{ required: true, message: '请输入打开图标', trigger: 'blur' }],
        leaf: [{ required: true, message: '请选择是否为叶子节点', trigger: 'blur' }]
      },
      saveForm: {
        resourceId: '',
        name: '',
        code: '',
        parentName: '',
        url: '',
        resourceType: '',
        closeImg: '',
        openImg: '',
        leaf: ''
      },
      updateForm: {
        resourceId: '',
        name: '',
        code: '',
        parentName: '',
        url: '',
        resourceType: '',
        closeImg: '',
        openImg: '',
        leaf: ''
      },
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
    getCompany() {
      this.$axios.get('/company/getCompany').then(res => {
        this.companyData = res.data
        for (let i = 0; i < this.companyData.length; i++) {
          this.options.add(this.company.orgName, i + 1)
        }
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
            name: this.queryCompanyData.name,
            orgName: this.queryCompanyData.orgName
          }
        }
      }
      this.$axios.get('/company/queryCompany', commonRequest).then(res => {
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
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
