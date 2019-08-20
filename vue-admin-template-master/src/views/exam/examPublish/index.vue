<template>
  <div class="dashboard-container">
    <el-container style="height: 800px">
      <el-header style="height:20%; width: 100%">
        <el-form :model="form" :inline="true">
          <el-form-item label="试卷发布人">
            <el-input v-model="form.publisher" placeholder="试卷发布人" size="mini" />
          </el-form-item>
          <el-form-item label="发布时间段">
            <el-date-picker
              v-model="form.publishTimeRange"
              size="mini"
              type="datetimerange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-row>
            <el-form-item label="考试标题">
              <el-input v-model="form.title" placeholder="考试标题" size="mini" />
            </el-form-item>
            <el-form-item label="考试时间段">
              <el-date-picker
                v-model="form.examTimeRange"
                size="mini"
                type="datetimerange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-button
              style="margin-top: 5px"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="submit"
            >查询</el-button>
          </el-row>
        </el-form>
        <div>
          <el-row style="display: inline">
            <el-button type="primary" size="mini" @click="dialogFormVisible = true">
              <i class="el-icon-edit" />修改
            </el-button>
            <el-button type="primary" size="mini" @click="open">
              <i class="el-icon-delete" />删除
            </el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible = true">
              <i class="el-icon-circle-plus" />发布
            </el-button>
          </el-row>
        </div>
      </el-header>
      <el-main>
        <el-table :data="tableData" border style="width: 100%" height="90%">
          <el-table-column type="selection" width="35" />
          <el-table-column prop="publisher" label="试卷发布人" />
          <el-table-column prop="publishTimeRange" label="发布时间段" />
          <el-table-column prop="endTime" label="考试结束日期和时间" />
          <el-table-column prop="planPepoleNum" label="计划人数" />
          <el-table-column prop="limitTime" label="考试时长" />
          <el-table-column prop="examiner" label="评卷官" />
          <el-table-column prop="title" label="考试标题" />
          <el-table-column prop="descript" label="考试说明" />
          <el-table-column prop="status" label="状态列" />
          <el-table-column prop="publishTimes" label="发布次数" />
          <el-table-column label="操作" width="150px">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              circle
              @click="dialogFormVisible = true"
            />
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="open" />
            <el-button type="warning" icon="el-icon-share" size="mini" circle @click="toQRCode" />
          </el-table-column>
        </el-table>
        <div class="block">
          <span class="demonstration" />
          <el-pagination background layout="prev, pager, next" :total="50" />
        </div>
      </el-main>
    </el-container>

    <el-dialog title="发布信息" :visible.sync="dialogFormVisible" center>
      <el-form :model="publishForm" label-width="170px">
        <el-form-item label="试卷">
          <el-tag
            v-for="tag in publishForm.paper"
            :key="tag"
            closable
            @close="closeTag(tag)"
          >{{ tag }}</el-tag>
          <el-button
            type="primary"
            :disabled="publishForm.paper.length >= 1"
            @click="innerVisible = true"
          >选择试卷</el-button>
        </el-form-item>
        <el-form-item label="考试场次">
          <el-input v-model="publishForm.examSession" style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试标题">
          <el-input v-model="publishForm.title" style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试截止日期">
          <el-date-picker v-model="publishForm.endDate" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="考试截止时间">
          <el-time-picker v-model="publishForm.endTime" placeholder="选择时间" />
        </el-form-item>
        <el-form-item label="计划参与人数">
          <el-input v-model.number="publishForm.planPepoleNum" style="width: 50%" />
        </el-form-item>
        <el-form-item label="考试时长">
          <el-input v-model="publishForm.limitTime" style="width: 50%" />
        </el-form-item>
        <el-form-item label="评卷官">
          <el-select v-model="publishForm.value" multiple placeholder="请选择">
            <el-option
              v-for="item in publishForm.examiners"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="阅卷方式">
          <el-select v-model="publishForm.value" placeholder="请选择阅卷方式">
            <el-option
              v-for="item in publishForm.markingModes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择阅卷截止时间">
          <div class="block">
            <el-date-picker
              v-model="publishForm.publisher"
              type="datetime"
              placeholder="选择日期时间"
              default-time="12:00:00"
            />
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="publishForm.publisher" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPublishForm();dialogFormVisible = false">确 定</el-button>
      </div>
      <!-- 内层dialog -->
      <el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body>
        <el-form :model="dialogForm" :inline="true">
          <el-form-item label="试卷名称">
            <el-input v-model="dialogForm.paper" placeholder="试卷名称" />
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="submit">查询</el-button>
        </el-form>
        <el-table :data="dialogTableData" border style="width: 100%" height="90%">
          <el-table-column prop="paper" label="试卷名称" width="280px" />
          <el-table-column label="操作">
            <el-button type="primary" @click="choosePaper();innerVisible = false">选择</el-button>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Position',
  data() {
    return {
      tableData: [{ publisher: 'syt', publishTimeRange: new Date().toLocaleString(), endTime: new Date().toLocaleString(), planPepoleNum: 5, limitTime: 50, examiner: 'syt', title: 'java', descript: 'hhhh', status: '启用', publishTimes: 3 }],
      dialogTableData: [],
      dialogFormVisible: false,
      visible: false,
      innerVisible: false,
      form: {
        publisher: '',
        publishTimeRange: [],
        title: '',
        examTimeRange: []
      },
      dialogForm: {
        title: ''
      },
      publishForm: {
        paper: ['试卷1'],
        examSession: '',
        title: '',
        endDate: '',
        endTime: '',
        planPepoleNum: '',
        limitTime: '',
        markingModes: [{
          value: '选项1',
          label: '阅卷方式1'
        },
        {
          value: '选项2',
          label: '阅卷方式2'
        }],
        examiners: [{
          value: '选项1',
          label: '阅卷官1'
        },
        {
          value: '选项2',
          label: '阅卷官2'
        }]
      }
    }
  },
  methods: {
    submit() {

    },
    submitPublishForm() {

    },
    choosePaper() {

    },
    toQRCode() {
      this.$router.push({ name: 'DoPaper' })
    },
    closeTag(tag) {
      this.publishForm.paper.splice(this.publishForm.paper.indexOf(tag), 1)
    },
    open() {
      this.$confirm('此操作将永久删除选中内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;
}
</style>
