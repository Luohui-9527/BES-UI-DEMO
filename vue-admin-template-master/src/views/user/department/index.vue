<template>
  <div class="dashboard-container">
  <el-container>
    <el-aside width="180px">
      <el-row class="dashboard-text" icon="el-icon-folder">组织机构
        <i class="el-icon-plus"></i>
        <i class="el-icon-refresh-left"></i>
      </el-row>
          <el-tree
            :data="setTree"
            :props="defaultProps"
            node-key="id"
            ref="SlotMenuList"
            :filter-node-method="filterNode"
            @node-contextmenu='rihgtClick'
            accordion
            style="margin-top:20px"
            >
            <span class="slot-t-node" slot-scope="{ node, data }">
              <span v-show="!node.isEdit">
                <span v-show="data.children && data.children.length >= 1">
                  <i :class="{ 'fa fa-plus-square': !node.expanded, 'fa fa-minus-square':node.expanded}" />
                  <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']" title='{node.label}'>{{node.label}}</span>
                </span>
                <span v-show="!data.children || data.children.length == 0">
                  <i class='' style='margin-right:10px'></i>
                  <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']" title='{node.label}'>{{node.label}}</span>
                </span>
              </span>
            <!-- 编辑输入框 -->
              <span v-show="node.isEdit">
                <el-input class="slot-t-input" size="mini" autofocus
                  v-model="data.name"
                  :ref="'slotTreeInput'+data.id"
                  @blur.stop="NodeBlur(node, data)"
                  @keyup.enter.native="NodeBlur(node, data)"></el-input>
              </span>
            </span>
          </el-tree>
          <!--鼠标右键点击出现页面-->
          <div v-show="menuVisible">
            <el-menu
              id = "rightClickMenu"
              class="el-menu-vertical"
              @select="handleRightSelect"
              active-text-color="#000000"
              text-color="#000000">
              <el-menu-item index="1" class="menuItem">
                <span slot="title">添加分类</span>
              </el-menu-item>
              <el-menu-item index="2" class="menuItem">
                <span slot="title">修改分类</span>
              </el-menu-item>
              <el-menu-item index="3" class="menuItem">
                <span slot="title">删除分类</span>
              </el-menu-item>
              <hr style="color: #ffffff">
              <el-menu-item index="4" class="menuItem">
                <span slot="title">添加标签</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
      <el-header style="height:30%; width: 100%">
        <el-row style="height:50px">
          字典名称：<el-input size="mini" style="width: 140px" />&nbsp;
          字典类型：<el-input size="mini" style="width: 140px" />&nbsp;
          <el-button type="primary" icon="el-icon-search" size="mini" @click="getDictionary">查询</el-button>
        </el-row>
        <el-row style="display: inline">
          <el-button type="success" size="mini">增加</el-button>
          <el-button type="danger" size="mini">删除</el-button>
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
  </div>
</template>

<script>
import ElCol from "element-ui/packages/col/src/col";
import api from '@/resource/api'
api.treelist = api.treelist.splice(0,10)
let id = 1000;
export default {
  name: 'Position',
  components: { ElCol },
  data() {
    const item = {
      tagID: "ID001",
      name: "地区",
      description: "此处是改内容的详细描述...",
      creatorID: "Admin",
      regeneratorID: "Admin"
    };
    return {
      DATA: null,
      NODE: null,
      dialogNewFormVisible: false,
      dialogFormVisible: false,
      dialogClassifyVisible: false,
      tableData: Array(10).fill(item),
      maxexpandId: api.maxexpandId,//新增节点开始id
			non_maxexpandId: api.maxexpandId,//新增节点开始id(不更改)
			isLoadingTree: true,//是否加载节点树
			setTree: api.treelist,//节点树数据
			defaultProps: {
				children: 'children',
				label: 'name'
			},
      filterText: '',
      input: "",
      input2: "",
      currentPage4: 4,
      editObj: {},
      menuVisible: false,
      objectID: null,
      /*分类修改*/
      menuVisible2: false,
      objectID2: null,
      tableData: [],
      show: true
    }
  },
  mounted() {
    this.dragControllerDiv()
    this.getDictionary()
  },
  methods: {
    getDictionary() {
      this.$axios.get('http://localhost:8080/dictionary/findAll').then(res => {
        this.tableData = res.data
        console.log(this.getDictionaryData)
      })
    },
    handleRightSelect(key) {
      console.log(key);
      if (key == 1) {
        this.NodeAdd(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 2) {
        this.NodeEdit(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if (key == 3) {
        this.NodeDel(this.NODE, this.DATA);
        this.menuVisible = false;
      } else if(key == 4){
        console.log('4')
        this.menuVisible = false;
      }
    },
    	NodeBlur(n, d){//输入框失焦
			console.log(n, d)
			if(n.isEdit){
				this.$set(n, 'isEdit', false)
			}
			this.$nextTick(() => {
				this.$refs['slotTreeInput'+d.id].$refs.input.focus()
			})
		},
		NodeEdit(n, d){//编辑节点
			console.log(n, d)
			if(!n.isEdit){//检测isEdit是否存在or是否为false
				this.$set(n, 'isEdit', true)
			}
		},
		NodeDel(n, d){//删除节点
			console.log(n, d)
			let that = this;
			if(d.children && d.children.length !== 0){
				this.$message.error("此节点有子级，不可删除！")
				return false;
			}else{
				//新增节点可直接删除，已存在的节点要二次确认
				//删除操作
				let DelFun = () => {
					let _list = n.parent.data.children || n.parent.data;//节点同级数据
					let _index = _list.map((c) => c.id).indexOf(d.id);
					console.log(_index)
					_list.splice(_index, 1);
					this.$message.success("删除成功！")
				}
				//二次确认
				let ConfirmFun = () => {
					this.$confirm("是否删除此节点？","提示",{
						confirmButtonText: "确认",
						cancelButtonText: "取消",
						type: "warning"
					}).then(() => {
						DelFun()
					}).catch(() => {})
				}
				//判断是否是新增节点
				d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
			}
		},
		NodeAdd(n, d){//新增节点
			console.log(n, d)
			//判断层级
			if(n.level >= 3){
				this.$message.error("最多只支持三级！")
				return false;
			}
			//新增数据
			d.children.push({
				id: ++this.maxexpandId,
				name: '新增节点',
				pid: d.id,
				children: []
			})
			//同时展开节点
			if(!n.expanded){
				n.expanded = true
			}
		},
    rihgtClick(event, object, value, element) {
      if (this.objectID !== object.id) {
        this.objectID = object.id;
        this.menuVisible = true;
        this.DATA = object;
        this.NODE = value;
      } else {
        this.menuVisible = !this.menuVisible;
      }
      document.addEventListener('click',(e)=>{
        this.menuVisible = false;
      })
      let menu = document.querySelector("#rightClickMenu");
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX - 180 + "px";
      menu.style.top = event.clientY - 100 + "px";
      menu.style.position = "absolute"; // 为新创建的DIV指定绝对定位
      menu.style.width = 120 + "px";
      /*console.log("右键被点击的左侧:",menu.style.left);
        console.log("右键被点击的顶部:",menu.style.top);*/
      //        console.log("右键被点击的event:",event);
      // console.log("右键被点击的object:", object);
      // console.log("右键被点击的value:", value);
      // console.log("右键被点击的element:", element);
    }
  }
};
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
  .resize{
  width:5px;
  height:100%;
  cursor: w-resize;
  float:left;
}

</style>
