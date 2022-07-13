<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="策略名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入策略名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['system:strategy:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:strategy:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDeleteMore"
          v-hasPermi="['system:strategy:remove']"
          >删除</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:strategy:export']"
          >导出</el-button
        >
      </el-col> -->
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="strategyList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="策略名称" align="center" prop="name" />
      <el-table-column label="数据源编码" align="center" prop="sourceSlave" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.common_status"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="默认策略" align="center" prop="isDefault">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.common_default"
            :value="scope.row.isDefault"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:strategy:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:strategy:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改数据源策略对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="策略名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入内容" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <template>
            <el-radio v-model="form.status" label="0">正常</el-radio>
            <el-radio v-model="form.status" label="1">停用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="默认策略" prop="isDefault">
          <template>
            <el-radio v-model="form.isDefault" label="Y" @change="alertA()"
              >是</el-radio
            >
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%"
              append-to-body
            >
              <span>当前默认策略为:{{ defaultName }},是否切换策略？</span>
              <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <el-radio v-model="form.isDefault" label="N">否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <el-divider content-position="center">数据源信息</el-divider>
      <br />
      <el-row>
        <el-button type="primary" plain @click="valueAdd">添加数据源</el-button>
        <template>
          <el-table :data="form.values" style="width: 100%">
            <el-table-column label="数据源名称" width="130">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.id"
                  placeholder="请选择"
                  @change="valueChange($event, scope.$index)"
                >
                  <el-option
                    v-for="item in sourceList"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              label="主数据源"
              align="center"
              min-width="20%"
              prop="isDefault"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isMain"
                  :active-value="IS_MAIN.TRUE"
                  :inactive-value="IS_MAIN.FALSE"
                  @change="
                    valueMainChange(
                      scope.row.isMain,
                      scope.row.id,
                      scope.$index
                    )
                  "
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="数据源状态"
              align="center"
              min-width="20%"
              prop="status"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                  disabled
                ></el-switch>
              </template>
            </el-table-column>

            <el-table-column label="操作" min-width="20%" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="valueDelete(scope.row)"
                  v-hasPermi="['tenant:strategy:edit']"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>




<script>
import {
  listSource,
  getSource,
  delSource,
  addSource,
  updateSource,
} from "@/api/tenant/tenant";
import {
  listStrategy,
  getStrategy,
  delStrategy,
  addStrategy,
  updateStrategy,
  findDefault,
} from "@/api/strategy/strategy";
import {
  STATUS,
  STATUS_UPDATE_OPERATION,
  SYSTEM_DEFAULT,
} from "@/api/strategy/constants";
import { IS_MAIN } from "@/constant/tenantConstants";

export default {
  name: "Strategy",
  dicts: ["common_status", "common_default"],
  data() {
    return {
      defaultName: "",
      dialogVisible: false,
      sourceList: [],
      //常量区
      SYSTEM_DEFAULT: SYSTEM_DEFAULT,
      STATUS: STATUS,
      IS_MAIN: IS_MAIN,
      STATUS_UPDATE_OPERATION: STATUS_UPDATE_OPERATION,
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
      // 数据源策略表格数据
      strategyList: [],
      // 数据源策略表格原始数据
      oldStrategyList: [],
      containWriteList: [],

      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        sourceId: null,
        sourceSlave: null,
        sort: null,
        status: null,
        isDefault: null,
      },
      // 表单参数
      form: {
        values: [],
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "策略名称不能为空", trigger: "blur" },
        ],
        sourceId: [
          { required: true, message: "数据源Id不能为空", trigger: "blur" },
        ],
        sourceSlave: [
          { required: true, message: "数据源编码不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
        isDefault: [
          { required: true, message: "默认策略不能为空", trigger: "blur" },
        ],
        delFlag: [
          { required: true, message: "删除标志不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getList();
  },
  methods: {
    valueChange(e, index) {
      let num = 0;
      for (let i = 0; i < this.sourceList.length; i++) {
        if (e == this.sourceList[i].id) {
          num = i;
        }
      }
      this.form.values[index].status = this.sourceList[num].status;
    },

    /** 删除按钮操作 */
     /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除数据源策略为"' + row.name + '"的数据项？').then(function() {
        return delStrategy(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 多选删除按钮操作 */
    handleDeleteMore(row) {
     const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的数据项？').then(function() {
        return delStrategy(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    valueMainChange(isMain, id, index) {
      this.form.values.forEach((item) => {
        item.isMain = "N";
      });
      this.form.values[index].isMain = "Y";
      this.form.hasMain = isMain !== IS_MAIN.FALSE;
      this.form.sourceId = isMain == IS_MAIN.TRUE ? id : "";
    },
    valueDelete(row) {
      if (row !== undefined) {
        const index = this.form.values.indexOf(row);
        this.form.values.splice(index, 1);
      }
    },

    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.strategyId);
      this.idNames = selection.map((item) => item.name);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    getWriteSeparation() {
      writeSeparation().then((response) => {
        this.containWriteList = response.data;
      });
    },

    // valueMainChange(isMain) {
    //   this.form.hasMain = isMain !== IS_MAIN.FALSE
    // },

    valueDelete(row) {
      if (row !== undefined) {
        const index = this.form.values.indexOf(row);
        this.form.values.splice(index, 1);
      }
    },
    /** 查询数据源策略列表 */
    getList() {
      this.loading = true;
      listStrategy(this.queryParams).then((response) => {
        this.strategyList = response.rows;
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
        strategyId: null,
        name: null,
        sourceAmount: 0,
        sort: 0,
        status: STATUS.NORMAL,
        values: [],
        isChange: SYSTEM_DEFAULT.FALSE,
        hasMain: false,
        sourceId: null,
      };
      this.resetForm("form");
    },
    // 修改表单
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      // const that = this
      const sourceId = row.sourceId;
      this.getSourceList(sourceId);
      getStrategy(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改数据源策略";
        this.form.values = [];
        getSource(id).then((res) => {
          console.log(res.data);
          //遍历返回结果，添加到数据源列表
          res.data.forEach((item) => {
            this.form.values.push({
              name: item.sourceName,
              id: item.sourceId,
              sourceSlave: "",
              isMain: item.isMain,
              status: item.sourceStatus * 1,
            });
          });
        });
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 提交按钮 */
    submitForm() {
      this.submitLoading = true;
      this.$refs["form"].validate((valid) => {
        this.form.values.forEach((item) => {
          item.sourceId = item.id;
        });
        if (valid) {
          if (this.valueCheck()) {
            if (this.form.id != null) {
              if (this.form.isChange === SYSTEM_DEFAULT.SUCCESS) {
                updateStrategy(this.form)
                  .then((response) => {
                    this.$modal.msgSuccess("修改成功");
                    this.open = false;
                    this.getList();
                  })
                  .catch(() => {
                    this.submitLoading = false;
                  });
              } else {
                this.submitLoading = false;
                this.$message({
                  message: "默认数据源不允许进行修改操作",
                  type: "warning",
                });
              }
            } else {
              addStrategy(this.form)
                .then((response) => {
                  this.$modal.msgSuccess("新增成功");
                  this.open = false;
                  this.getList();
                })
                .catch(() => {
                  this.submitLoading = false;
                });
            }
          } else {
            this.submitLoading = false;
          }
        } else {
          this.submitLoading = false;
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "tenant/strategy/export",
        {
          ...this.queryParams,
        },
        `数据源策略数据.xlsx`
      );
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加数据源策略";
      this.getSourceList();
    },
    valueAdd() {
      // console.log(IS_MAIN.FALSE, STATUS.DISABLE)
      const newData = {
        sourceId: "",
        sourceSlave: "",
        isMain: IS_MAIN.FALSE,
        status: STATUS.ABLE,
      };
      // console.log(this.form.values)
      this.form.values.push(newData);
    },
    getSourceList() {
      listSource(this.queryParams).then((response) => {
        this.sourceList = response.rows;
        this.total = response.total;
      });
    },
    valueCheck() {
      let key = 0;
      for (let i = 0; i < this.form.values.length; i++) {
        let increase = 0;
        if (this.form.values[i].isMain === IS_MAIN.TRUE) {
          key++;
          increase = 1;
        }
      }

      this.form.amount = this.form.values.length;
      return true;
    },
    handleClose(done) {
      this.form.isDefault = "N";
      this.dialogVisible = false;
    },
    alertA() {
      findDefault().then((res) => {
        if (res.data) {
          this.defaultName = res.data.name;
          console.log(this.defaultName);
          this.dialogVisible = true;
        }
      });
    },
  },
};
</script>
