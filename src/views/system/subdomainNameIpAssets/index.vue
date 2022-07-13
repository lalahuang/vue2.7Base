<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="序号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入序号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="域名" prop="domainName">
        <el-input
          v-model="queryParams.domainName"
          placeholder="请输入域名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子域名" prop="subdomainName">
        <el-input
          v-model="queryParams.subdomainName"
          placeholder="请输入子域名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IP" prop="ipAddress">
        <el-input
          v-model="queryParams.ipAddress"
          placeholder="请输入IP"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="IP归属地" prop="ipHome">
        <el-input
          v-model="queryParams.ipHome"
          placeholder="请输入IP归属地"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网站" prop="websiteAddress">
        <el-input
          v-model="queryParams.websiteAddress"
          placeholder="请输入网站"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="网站标题" prop="websiteTitle">
        <el-input
          v-model="queryParams.websiteTitle"
          placeholder="请输入网站标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:subdomainNameIpAssets:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:subdomainNameIpAssets:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:subdomainNameIpAssets:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:subdomainNameIpAssets:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="subdomainNameIpAssetsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标识id" align="center" prop="id" />
      <el-table-column label="序号" align="center" prop="serialNumber" />
      <el-table-column label="域名" align="center" prop="domainName" />
      <el-table-column label="子域名" align="center" prop="subdomainName" />
      <el-table-column label="IP" align="center" prop="ipAddress" />
      <el-table-column label="IP归属地" align="center" prop="ipHome" />
      <el-table-column label="网站" align="center" prop="websiteAddress" />
      <el-table-column label="网站标题" align="center" prop="websiteTitle" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:subdomainNameIpAssets:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:subdomainNameIpAssets:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改子域名与IP资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="序号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入序号" />
        </el-form-item>
        <el-form-item label="域名" prop="domainName">
          <el-input v-model="form.domainName" placeholder="请输入域名" />
        </el-form-item>
        <el-form-item label="子域名" prop="subdomainName">
          <el-input v-model="form.subdomainName" placeholder="请输入子域名" />
        </el-form-item>
        <el-form-item label="IP" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="IP归属地" prop="ipHome">
          <el-input v-model="form.ipHome" placeholder="请输入IP归属地" />
        </el-form-item>
        <el-form-item label="网站" prop="websiteAddress">
          <el-input v-model="form.websiteAddress" placeholder="请输入网站" />
        </el-form-item>
        <el-form-item label="网站标题" prop="websiteTitle">
          <el-input v-model="form.websiteTitle" placeholder="请输入网站标题" />
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
import { listSubdomainNameIpAssets, getSubdomainNameIpAssets, delSubdomainNameIpAssets, addSubdomainNameIpAssets, updateSubdomainNameIpAssets } from "@/api/system/subdomainNameIpAssets";

export default {
  name: "SubdomainNameIpAssets",
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
      // 子域名与IP资产表格数据
      subdomainNameIpAssetsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 网站标题时间范围
      daterangeCreateTime: [],
      // 网站标题时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        serialNumber: null,
        domainName: null,
        subdomainName: null,
        ipAddress: null,
        ipHome: null,
        websiteAddress: null,
        websiteTitle: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询子域名与IP资产列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listSubdomainNameIpAssets(this.queryParams).then(response => {
        this.subdomainNameIpAssetsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        serialNumber: null,
        domainName: null,
        subdomainName: null,
        ipAddress: null,
        ipHome: null,
        websiteAddress: null,
        websiteTitle: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.daterangeUpdateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加子域名与IP资产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getSubdomainNameIpAssets(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改子域名与IP资产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSubdomainNameIpAssets(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSubdomainNameIpAssets(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除子域名与IP资产编号为"' + ids + '"的数据项？').then(function() {
        return delSubdomainNameIpAssets(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/subdomainNameIpAssets/export', {
        ...this.queryParams
      }, `subdomainNameIpAssets_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
