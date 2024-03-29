<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学生姓名" prop="studentName">
        <el-input
          v-model="queryParams.studentName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小组" prop="groupId">
        <el-select v-model="queryParams.groupId" clearable placeholder="选择小组">
          <el-option
            v-for="dict in dict.type.student_group_name"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="职位" prop="studentType">
        <el-select v-model="queryParams.studentType" clearable placeholder="选择职位">
          <el-option
            v-for="dict in dict.type.student_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提交状态" prop="status">
        <el-select v-model="queryParams.status" clearable placeholder="提交状态">
          <el-option
            v-for="dict in dict.type.student_info_submit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['complex:rating:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['complex:rating:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['complex:rating:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['complex:rating:export']"
        >导出
        </el-button>
        <el-button
          v-hasPermi="['complex:rating:edit']"
          icon="el-icon-folder-checked"
          plain
          size="mini"
          type="success"
          @click="submitChange(1)"
        >全部提交
        </el-button>
        <el-button
          v-hasPermi="['complex:rating:edit']"
          icon="el-icon-folder-delete"
          plain
          size="mini"
          type="warning"
          @click="submitChange(0)"
        >全部未提交
        </el-button>
        <el-button
          v-hasPermi="['complex:rating:edit']"
          icon="el-icon-folder-delete"
          plain
          size="mini"
          type="danger"
          @click="resetScoreEvent"
        >重置所有分数
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ratingList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50"/>
      <el-table-column align="center" label="学号" prop="studentId"/>
      <el-table-column align="center" label="姓名" prop="studentName"/>
      <el-table-column align="center" label="所在小组" prop="groupId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.student_group_name" :value="scope.row.groupId"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="自我学习" prop="self"/>
      <el-table-column align="center" label="信息处理" prop="information"/>
      <el-table-column align="center" label="沟通交流" prop="communicate"/>
      <el-table-column align="center" label="团队合作" prop="team"/>
      <el-table-column align="center" label="解决问题" prop="solve"/>
      <el-table-column align="center" label="革新创新" prop="innovation"/>
      <el-table-column align="center" label="上次总分" prop="lastTimeResult"/>
      <el-table-column align="center" label="本次总分" prop="thisResult"/>
      <el-table-column :show-overflow-tooltip="true" align="center" label="数据">
        <template slot-scope="scope">
          <router-link :to="'/student/info-data/index/' + scope.row.studentId" class="link-type">
            <span>{{ '查看' + scope.row.studentName + '的数据 ' }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="差值" prop="difference"/>
      <el-table-column align="center" label="提交状态" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.student_info_submit" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column align="center" label="提交时间" prop="crateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime ? scope.row.createTime : '暂无数据' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['complex:rating:edit']"
          >评分
          </el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['complex:rating:remove']"-->
          <!--          >删除-->
          <!--          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <template slot-scope="scope">
      <dict-tag :options="dict.type.student_info_submit" :value="scope.row.status"/>
    </template>
    <el-table-column align="center" label="创建时间" prop="createTime" width="180">
      <template slot-scope="scope">
        <span>{{ parseTime(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" class-name="small-padding fixed-width" label="操作">
      <template slot-scope="scope">
        <el-button
          v-hasPermi="['complex:rating:edit']"
          icon="el-icon-edit"
          size="mini"
          type="text"
          @click="handleUpdate(scope.row)"
        >修改
        </el-button>
        <el-button
          v-hasPermi="['complex:rating:remove']"
          icon="el-icon-delete"
          size="mini"
          type="text"
          @click="handleDelete(scope.row)"
        >删除
        </el-button>
      </template>
    </el-table-column>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" :disabled="this.studentIsFlag" maxlength="30"
                        placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生学号" prop="studentId">
              <el-input-number v-model="form.studentId" :disabled="this.studentIsFlag"
                               controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自我学习" prop="self">
              <el-input-number v-model="form.self" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信息处理" prop="information">
              <el-input-number v-model="form.information" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="沟通交流" prop="communicate">
              <el-input-number v-model="form.communicate" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="团队合作" prop="team">
              <el-input-number v-model="form.team" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="解决问题" prop="solve">
              <el-input-number v-model="form.solve" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="革新创新" prop="innovation">
              <el-input-number v-model="form.innovation" :max="2" :min="0" controls-position="right"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本次总分" prop="innovation">
              <el-input-number v-model="form.thisResult" :disabled="true" :max:="10" :min="0"
                               controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="提交状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.student_info_submit"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addRating,
  delPost,
  getRating,
  listRating,
  resetScore,
  submitChange,
  updateRating
} from '@/api/complex/manage/rating'
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: 'Post',
  components: { Treeselect },
  dicts: ['student_info_submit', 'student_group_name', 'student_type'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //是否可以修改学生信息信息
      studentIsFlag: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 岗位表格数据
      ratingList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        studentName: undefined,
        groupName: undefined,
        status: undefined,
        groupId: undefined,
        studentType: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        studentName: [
          { required: true, message: '学生姓名不能为空!', trigger: 'blur' }
        ],
        studentId: [
          { required: true, message: '学号不能为空!', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true
      listRating(this.queryParams).then(response => {
        this.ratingList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        studentName: undefined,
        studentId: 0,
        ratingsId: undefined,
        self: 0,
        information: 0,
        communicate: 0,
        team: 0,
        solve: 0,
        lastTimeResult: 0,
        innovation: 0,
        thisResult: 0,
        status: '0',
        studentType: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.studentId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      console.log('表达已重置')
      this.reset()
      this.studentIsFlag = false
      this.open = true
      this.title = '新增学生成绩'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const studentId = row.studentId || this.ids
      getRating(studentId).then(response => {
        console.log('修改按钮已执行！')
        this.form = response.data
        this.open = true
        this.title = '成绩评分'
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.ratingsId !== undefined) {
            updateRating(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            console.log('执行了新增方法')
            addRating(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const studentId = row.studentId || this.ids
      this.$modal.confirm('是否删除学号为"' + studentId + '"的数据项？').then(function() {
        return delPost(studentId)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    //提交状态修改
    submitChange(status) {
      submitChange(status).then(res => {
        this.getList()
      })
    },
    //重置所有学生的分数
    resetScoreEvent() {
      this.$modal.confirm('是否重置所有学生的成绩？此操作执行后无法恢复,请确定你已备份！').then(function() {
        return resetScore()
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('重置成功！')
      }).catch(() => {
        this.$modal.msgError('重置失败！')
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('school/complex/student/ratings/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
