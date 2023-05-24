<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学生姓名" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="小组" prop="postName">
        <el-input
          v-model="queryParams.postName"
          placeholder="请输入小组名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:post:add']"
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
          v-hasPermi="['system:post:edit']"
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
          v-hasPermi="['system:post:remove']"
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
          v-hasPermi="['system:post:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="ratingList" @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection" width="55"/>
      <el-table-column align="center" label="学号" prop="studentId"/>
      <el-table-column align="center" label="姓名" prop="studentName"/>
      <el-table-column align="center" label="所在小组" prop="groupName" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.groupName ? scope.row.groupName : '未分配小组' }}</span>
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
            v-hasPermi="['system:post:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:post:remove']"
          >删除
          </el-button>
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
          v-hasPermi="['system:post:edit']"
          icon="el-icon-edit"
          size="mini"
          type="text"
          @click="handleUpdate(scope.row)"
        >修改
        </el-button>
        <el-button
          v-hasPermi="['system:post:remove']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="学生姓名" prop="studentName">
              <el-input v-model="form.studentName" :disabled="true" maxlength="30" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生学号" prop="studentId">
              <el-input v-model="form.studentId" :disabled="true" maxlength="11" placeholder="请输入学号"/>
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
          <el-col :span="12">
            <el-form-item label="上次总分" prop="lastTimeResult">
              <el-input-number v-model="form.lastTimeResult" :max="10" :min="0" controls-position="right"/>
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
import { addPost, delPost, getRating, listRating, updateRating } from '@/api/complex/manage/rating'
import Treeselect from '@riophae/vue-treeselect'

export default {
  name: 'Post',
  components: { Treeselect },
  dicts: ['student_info_submit'],
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
        studentName: undefined,
        groupName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        studentName: [
          { required: true, message: '岗位名称不能为空', trigger: 'blur' }
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
        studentId: undefined,
        status: '0'
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
          if (this.form.studentId !== undefined) {
            updateRating(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPost(this.form).then(response => {
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
