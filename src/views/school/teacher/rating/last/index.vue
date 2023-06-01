<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="ratingList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="50"/>
      <el-table-column align="center" label="学号" prop="studentId"/>
      <el-table-column align="center" label="姓名" prop="studentName"/>
      <el-table-column align="center" label="姓名" prop="groupName"/>
      <el-table-column align="center" label="自我学习" prop="self"/>
      <el-table-column align="center" label="信息处理" prop="information"/>
      <el-table-column align="center" label="沟通交流" prop="communicate"/>
      <el-table-column align="center" label="团队合作" prop="team"/>
      <el-table-column align="center" label="解决问题" prop="solve"/>
      <el-table-column align="center" label="革新创新" prop="innovation"/>
      <el-table-column align="center" label="上次总分" prop="thisResult"/>
      <el-table-column align="center" label="修改时间" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime ? scope.row.updateTime : '暂无数据' }}</span>
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
    </el-table>

    <pagination
      v-show="total>0"
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.pageNum"
      :total="total"
      @pagination="getList"
    />

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" :disabled=true maxlength="30"
                        placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生学号" prop="studentId">
              <el-input-number v-model="form.studentId" :disabled=true
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
            <el-form-item label="本次总分" prop="thisResult">
              <el-input-number v-model="form.thisResult" :disabled="true" :max:="10" :min="0"
                               controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRating, listRating, updateRating } from '@/api/complex/manage/lastRating'

export default {
  name: 'Post',
  dicts: ['sys_normal_disable'],
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
        postCode: undefined,
        postName: undefined,
        status: undefined
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
        innovation: 0,
        thisResult: 0
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
      this.ids = selection.map(item => item.postId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加岗位'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const studentId = row.studentId || this.ids
      getRating(studentId).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改成绩'
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
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const postIds = row.postId || this.ids
      this.$modal.confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？').then(function() {
        return delPost(postIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/post/export', {
        ...this.queryParams
      }, `post_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
