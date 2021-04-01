<template>
  <div class="content">
    <el-card>
      <div class="top-container">
        <span class="title">血常规检验项管理</span>
      </div>
      <div class="tool-bar">
        <el-input
          v-model="queryParams.searchKey"
          placeholder="输入检验项名称搜索"
          clearable
          @input="getCbcList"
          @keyup.enter.native="search"
          @clear="getCbcList"
        ></el-input>
        <el-button
          @click.native="search"
          icon="el-icon-search"
          circle
        ></el-button>
        <el-button
          @click.native="getCbcList"
          icon="el-icon-refresh"
          type="success"
          circle
        ></el-button>
        <el-button
          @click.native="formVisible = true"
          icon="el-icon-plus"
          type="primary"
          circle
        ></el-button>
      </div>
      <el-table
        v-loading="isLoading"
        :data="cbcList"
        height="650"
        style="width: 100%"
        stripe
      >
        <el-table-column prop="itemId" label="项目代码"></el-table-column>
        <el-table-column prop="itemName" label="项目名称"></el-table-column>
        <el-table-column prop="limit" label="参考值下限"></el-table-column>
        <el-table-column prop="ceil" label="参考值上限"></el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="unitType" label="数据类型"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page="queryParams.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalElement"
      ></el-pagination>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      close-on-press-escape
      append-to-body
      :modal="false"
      title="新增志愿者"
      :visible.sync="formVisible"
    >
      <el-form
        v-loading="formLoading"
        label-position="left"
        ref="formRef"
        :model="infoForm"
        :rules="formRules"
      >
        <el-form-item label="检验项代码" label-width="100px" prop="itemId">
          <el-input
            v-model="infoForm.itemId"
            placeholder="请输入检验项代码"
          ></el-input>
        </el-form-item>
        <el-form-item label="检验项名称" label-width="100px" prop="itemName">
          <el-input
            v-model="infoForm.itemId"
            placeholder="请输入检验项名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="检验项单位" label-width="100px">
          <el-select v-model="selected" placeholder="请选择检验项单位类型">
            <el-option
              v-for="item in selectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下限值" label-width="100px" v-if="selected === 1">
          <el-input
            v-model="infoForm.itemId"
            placeholder="请输入下限值"
          ></el-input>
        </el-form-item>
        <el-form-item label="上限值" label-width="100px" v-if="selected === 1">
          <el-input
            v-model="infoForm.itemId"
            placeholder="请输入上限值"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位" label-width="100px" v-if="selected === 1">
          <el-input
            v-model="infoForm.itemId"
            placeholder="请选择数值单位"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isLoading: false,
      formLoading: false,
      formVisible: false,
      cbcList: [],
      totalElement: 0,
      queryParams: {
        page: 1,
        size: 10,
        searchKey: ''
      },
      infoForm: {
        itemId: '',
        itemName: '',
        limit: '',
        ceil: '',
        unit: '',
        unitType: ''
      },
      formRules: {
        itemId: [
          { required: true, message: '请输入项目代码', trigger: 'blur' }
        ],
        itemName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ]
      },
      selectList: [
        {
          label: '数值型',
          value: 1
        },
        {
          label: '阴阳性',
          value: 2
        }
      ],
      selected: ''
    }
  },
  async mounted () {
    this.getCbcList()
  },
  methods: {
    // 获得血常规检验项信息
    async getCbcList () {
      this.isLoading = true
      const { code, msg, data } = await this.$request({
        url: 'api/cbctest/page',
        method: 'get',
        params: this.queryParams
      })
      if (code !== 200) {
        this.$errorMsg(msg)
      }
      this.totalElement = data.totalElement
      this.cbcList = data.content
      this.isLoading = false
    },
    async search () {
      this.isLoading = true
      this.queryParams.searchKey = this.queryParams.searchKey.toUpperCase()
      const { code, msg, data } = await this.$request({
        url: 'api/cbctest/page',
        method: 'get',
        params: this.queryParams
      })
      if (code !== 200) {
        this.$errorMsg(msg)
      }
      this.cbcList = data.content
      this.totalElement = data.totalElement
      this.isLoading = false
    },
    handleSizeChange (val) {
      this.queryParams.size = val
    },
    async handlePageChange (val) {
      console.log(val)
      this.queryParams.page = val
      await this.getCbcList()
    },
    handleFormVisible () { }
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
