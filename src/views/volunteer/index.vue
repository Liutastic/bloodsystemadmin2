<template>
  <div class="content">
    <el-card>
      <div class="top-container">
        <span class="title">志愿者管理</span>
      </div>
      <div class="tool-bar">
        <el-input
          @keyup.enter.native="search"
          @clear="getVolunteerList"
          clearable
          @click.native="search"
          v-model="queryParams.searchKey"
          placeholder="输入名字或身份证搜索志愿者"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-tooltip
          :visible-arrow="false"
          class="item"
          effect="light"
          content="搜索"
          placement="top"
        >
          <el-button
            @click.native="search"
            icon="el-icon-search"
            circle
            style="margin-right: 16px"
          ></el-button>
        </el-tooltip>

        <!-- 刷新按钮 -->
        <el-tooltip
          :visible-arrow="false"
          class="item"
          effect="light"
          content="刷新"
          placement="top"
        >
          <el-button
            @click.native="getVolunteerList"
            icon="el-icon-refresh"
            type="success"
            circle
          ></el-button>
        </el-tooltip>
        <el-tooltip
          :visible-arrow="false"
          class="item"
          effect="light"
          content="添加志愿者"
          placement="top"
        >
          <el-button
            @click.native="handleFormVisible(true, true)"
            icon="el-icon-plus"
            type="primary"
            circle
          ></el-button>
        </el-tooltip>
      </div>
      <el-table
        v-loading="isLoading"
        :data="volunteerList"
        height="800"
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="IDNo" label="身份证号码" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="bloodType" label="血型"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-tooltip
              :visible-arrow="false"
              class="item"
              effect="light"
              content="编辑"
              placement="top"
            >
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              :visible-arrow="false"
              class="item"
              effect="light"
              content="删除"
              placement="top"
            >
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleVolSizeChange"
        @current-change="handlePageChange"
        :current-page="queryParams.page"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="queryParams.totalElement"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      close-on-press-escape
      append-to-body
      :modal="false"
      :title="isAdd ? '新增志愿者' : '编辑志愿者'"
      :visible.sync="formVisible"
    >
      <el-form
        v-loading="formLoading"
        :model="infoForm"
        :rules="formRules"
        label-position="left"
        ref="formRef"
      >
        <el-form-item label="姓名" label-width="100px" prop="name">
          <el-input v-model="infoForm.name" placeholder="志愿者姓名"></el-input>
        </el-form-item>
        <el-form-item
          :prop="isAdd ? 'IDNo' : ''"
          label="身份证号码"
          label-width="100px"
          label-position="left"
        >
          <el-input
            v-model="infoForm.IDNo"
            placeholder="志愿者身份证"
            :disabled="!isAdd"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="address"
          label="居住地址"
          label-width="100px"
          label-position="left"
        >
          <el-input
            v-model="infoForm.address"
            placeholder="志愿者居住地址"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="phone"
          label="电话号码"
          label-width="100px"
          label-position="left"
        >
          <el-input
            v-model="infoForm.phone"
            placeholder="志愿者电话"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px" label-position="left">
          <el-input
            v-model="infoForm.remark"
            placeholder="志愿者备注"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="bloodType"
          label="血型"
          label-width="100px"
          label-position="left"
        >
          <el-select v-model="infoForm.bloodType" placeholder="志愿者血型">
            <el-option
              v-for="item in bloodTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <!-- <el-option label="区域二" value="beijing"></el-option> -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCancel">取 消</el-button>
        <el-button type="primary" @click.native="handleConfirmBtn"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Decrypt } from '@/utils/cryption'
import { handleIDNo } from '@/utils/regex'
export default {
  data () {
    return {
      initialVolunteerList: [],
      volunteerList: [],
      volunteerIdList: [],
      queryParams: {
        totalElement: 0,
        page: 1,
        size: 20,
        searchKey: ''
      },
      //
      isAdd: false,
      isLoading: false,
      formLoading: false,
      formVisible: false,
      // 表单
      infoForm: {
        name: '',
        bloodType: '',
        address: '',
        phone: '',
        IDNo: '',
        remark: ''
      },
      // 编辑表单中的身份证号码
      editIDNo: '',
      bloodTypeList: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'AB', value: 'AB' },
        { label: 'O', value: 'O' }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入志愿者姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在1到10个字符之间', trigger: 'blur' }
        ],
        bloodType: [
          { required: true, message: '请选择志愿者血型', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入志愿者居住地址', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在1到50个字符之间', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
          // 正则表达
        ],
        IDNo: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern: /^(\d{18,18}|\d{15,15}|\d{17,17}X)$/, message: '请输入正确的身份证号码', trigger: 'blur' }
          // { validator: this.validateIDNo }
          // 正则表达
        ]
      }
    }
  },
  created () {
    this.getVolunteerList()
  },
  methods: {
    // 使用后台传输的数据初始化
    initialData (content, totalElement, size) {
      this.volunteerList = content
      this.queryParams.totalElement = totalElement
      this.queryParams.size = size
    },
    // 获得志愿者数据
    async getVolunteerList () {
      this.isLoading = true
      const { data: { content, totalElement, size } } = await this.$request({
        url: '/api/volunteer/page',
        method: 'get',
        params: this.queryParams
      })
      // 原始数据
      this.initialVolunteerList = content

      // 处理志愿者身份证信息
      const length = content.length
      for (let i = 0; i < length; i++) {
        this.volunteerIdList.push({ _id: content[i]._id, IDNo: content[i].IDNo })
        content[i].IDNo = handleIDNo(Decrypt(content[i].IDNo))
      }

      this.initialData(content, totalElement, size)

      this.isLoading = false
    },
    // 查找志愿者
    async search () {
      this.isLoading = true
      // this.queryParams.searchKey = searchKey
      const { data: { content, totalElement, size } } = await this.$request({
        url: '/api/volunteer/page',
        method: 'get',
        params: this.queryParams
      })
      // 处理志愿者身份证信息
      const length = content.length
      for (let i = 0; i < length; i++) {
        this.volunteerIdList.push({ _id: content[i]._id, IDNo: content[i].IDNo })
        content[i].IDNo = handleIDNo(Decrypt(content[i].IDNo))
      }
      this.initialData(content, totalElement, size)
      this.isLoading = false
    },
    // 添加志愿者
    async addVolunteer () {
      const data = await this.$request({
        url: '/api/volunteer/add',
        method: 'post',
        data: this.infoForm
      })
      if (data.code === 200) {
        this.$successMsg('添加志愿者成功!')
      } else {
        this.$errorMsg(`${data.message}`)
      }
      this.formVisible = false
      await this.getVolunteerList()
      this.$refs.formRef.resetFields()
    },
    // 编辑志愿者
    async editVolunteer () {
      // 身份证加密传输到后台
      const data = await this.$request({
        url: '/api/volunteer/edit',
        method: 'post',
        data: {
          address: this.infoForm.address,
          IDNo: this.editIDNo,
          name: this.infoForm.name,
          phone: this.infoForm.phone,
          bloodType: this.infoForm.bloodType,
          remark: this.infoForm.remark,
          _id: this.infoForm._id
        }
      })
      if (data.code === 200) {
        this.$successMsg('编辑成功!')
      } else {
        this.$errorMsg(data.message)
      }
      this.formVisible = false
      await this.getVolunteerList()
      this.$refs.formRef.resetFields()
    },
    // 删除某一个志愿者
    async deleteVolunteer (id) {
      const data = await this.$request({
        url: '/api/volunteer/delete',
        method: 'post',
        data: {
          id
        }
      })
      console.log('delete', data)
      if (data.code === 200) {
        this.$successMsg('删除成功!')
      } else {
        this.$errorMsg(data.message)
      }
      this.formVisible = false
      await this.getVolunteerList()
    },
    // 页容量改变
    handleVolSizeChange (val) {
      this.queryParams.size = val
    },
    // 页数改变
    handlePageChange (val) {
      this.queryParams.page = val
    },
    // 控制表单出现与隐藏
    handleFormVisible (visible, isAdd) {
      this.formVisible = visible
      this.isAdd = isAdd
    },
    // 处理身份证号码加密问题
    handleIDNoTrans () {
      this.volunteerIdList.forEach(ele => {
        if (ele._id === this.infoForm._id) {
          this.editIDNo = ele.IDNo
        }
      })
    },
    // 处理确定按钮的添加或编辑
    handleConfirmBtn () {
      if (this.isAdd) {
        this.confirmAdd()
      } else {
        // 处理身份证号码加密问题
        this.confirmEdit()
      }
    },
    // 处理对话框取消按钮操作
    handleDialogCancel () {
      this.$refs.formRef.resetFields()
      this.formVisible = false
    },
    // 添加志愿者
    confirmAdd () {
      this.formLoading = true
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.addVolunteer()
        } else {
          this.$warnMsg('请根据提示完善表单')
        }
      })
      this.formLoading = false
    },
    confirmEdit () {
      this.formLoading = true
      this.handleIDNoTrans()

      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.editVolunteer()
        } else {
          this.$warnMsg('请根据提示完善表单')
        }
      })
      this.formLoading = false
    },
    // 弹出编辑志愿者对话框
    handleEdit (row) {
      this.infoForm = row
      // this.handleIDNoTrans()
      this.handleFormVisible(true, false)
    },
    // 删除志愿者
    handleDelete (row) {
      this.$confirm('此操作将会删除该志愿者, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.deleteVolunteer(row._id)
      }).catch(() => {
        // 无效果
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.top-container {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
}

.title {
  font-size: 15px;
  padding-left: 10px;
  border-left: 5px solid #4674d0;
}

.tool-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.el-input {
  width: 250px;
  margin-right: 7px;
}

.el-select {
  width: 258px;
}
</style>
