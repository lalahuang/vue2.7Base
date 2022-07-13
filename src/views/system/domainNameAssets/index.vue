<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="公司名称" prop="unitName">
        <el-input
          v-model="queryParams.unitName"
          placeholder="请输入公司名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主要许可证" prop="mainLicence">
        <el-input
          v-model="queryParams.mainLicence"
          placeholder="请输入主要许可证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务器名称" prop="serviceName">
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入服务器名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主页url" prop="homeUrl">
        <el-input
          v-model="queryParams.homeUrl"
          placeholder="请输入主页url"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领导姓名" prop="leaderName">
        <el-input
          v-model="queryParams.leaderName"
          placeholder="请输入领导姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="领域" prop="realmName">
        <el-input
          v-model="queryParams.realmName"
          placeholder="请输入领域"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新记录时间">
        <el-date-picker
          v-model="daterangeUpdateRecordTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
          v-hasPermi="['system:domainNameAssets:add']"
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
          v-hasPermi="['system:domainNameAssets:edit']"
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
          v-hasPermi="['system:domainNameAssets:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:domainNameAssets:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="domainNameAssetsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id标识" align="center" prop="id" />
      <el-table-column label="公司名称" align="center" prop="unitName" />
      <el-table-column label="主要许可证" align="center" prop="mainLicence" />
      <el-table-column label="服务器名称" align="center" prop="serviceName" />
      <el-table-column label="主页url" align="center" prop="homeUrl" />
      <el-table-column label="领导姓名" align="center" prop="leaderName" />
      <el-table-column label="领域" align="center" prop="realmName" />
      <el-table-column label="更新记录时间" align="center" prop="updateRecordTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateRecordTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:domainNameAssets:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:domainNameAssets:remove']"
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

    <!-- 添加或修改域名资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公司名称" prop="unitName">
          <el-input v-model="form.unitName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="主要许可证" prop="mainLicence">
          <el-input v-model="form.mainLicence" placeholder="请输入主要许可证" />
        </el-form-item>
        <el-form-item label="服务器名称" prop="serviceName">
          <el-input v-model="form.serviceName" placeholder="请输入服务器名称" />
        </el-form-item>
        <el-form-item label="主页url" prop="homeUrl">
          <el-input v-model="form.homeUrl" placeholder="请输入主页url" />
        </el-form-item>
        <el-form-item label="领导姓名" prop="leaderName">
          <el-input v-model="form.leaderName" placeholder="请输入领导姓名" />
        </el-form-item>
        <el-form-item label="领域" prop="realmName">
          <el-input v-model="form.realmName" placeholder="请输入领域" />
        </el-form-item>
        <el-form-item label="更新记录时间" prop="updateRecordTime">
          <el-date-picker clearable size="small"
            v-model="form.updateRecordTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择更新记录时间">
          </el-date-picker>
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
import { listDomainNameAssets, getDomainNameAssets, delDomainNameAssets, addDomainNameAssets, updateDomainNameAssets } from "@/api/system/domainNameAssets";

export default {
  name: "DomainNameAssets",
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
      // 域名资产表格数据
      domainNameAssetsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 更新记录时间时间范围
      daterangeUpdateRecordTime: [],
      // 更新记录时间时间范围
      daterangeCreateTime: [],
      // 更新记录时间时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        unitName: null,
        mainLicence: null,
        serviceName: null,
        homeUrl: null,
        leaderName: null,
        realmName: null,
        updateRecordTime: null,
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
    /** 查询域名资产列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeUpdateRecordTime && '' != this.daterangeUpdateRecordTime) {
        this.queryParams.params["beginUpdateRecordTime"] = this.daterangeUpdateRecordTime[0];
        this.queryParams.params["endUpdateRecordTime"] = this.daterangeUpdateRecordTime[1];
      }
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listDomainNameAssets(this.queryParams).then(response => {
        this.domainNameAssetsList = response.rows;
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
        unitName: null,
        mainLicence: null,
        serviceName: null,
        homeUrl: null,
        leaderName: null,
        realmName: null,
        updateRecordTime: null,
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
      this.daterangeUpdateRecordTime = [];
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
      this.title = "添加域名资产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getDomainNameAssets(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改域名资产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDomainNameAssets(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDomainNameAssets(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除域名资产编号为"' + ids + '"的数据项？').then(function() {
        return delDomainNameAssets(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/domainNameAssets/export', {
        ...this.queryParams
      }, `domainNameAssets_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
