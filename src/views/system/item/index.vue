<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb-4">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:item:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="itemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="应用名称" align="center" prop="applicationName" />
      <el-table-column label="策略" align="center" prop="strategyName" />
      <el-table-column label="到期时间" align="center" prop="expiredTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提示" align="center" prop="expiredTime" width="180">
        <template slot-scope="scope">
        {{handleTime(scope.row.expiredTime)}}
        </template>
      </el-table-column>
      <el-table-column label="租户" align="center" prop="tenantName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:item:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:item:remove']"
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

    <!-- 添加或修改应用分配对话框 -->
    <el-dialog destroy-on-close :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="应用名称" prop="applicationId">
            <el-select v-model="form.applicationId" placeholder="请选择应用">
            <el-option
              v-for="item in applicationList"
              :key="item.applicationId"
              :label="item.name"
              :value="item.applicationId">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="策略" prop="strategyId">
          <el-select v-model="form.strategyId" placeholder="请选择策略">
            <el-option
              v-for="item in strategyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="服务时间" prop="expiredTime">
            <el-date-picker
              v-model="timebetween"
              type="datetimerange"
              @change="changeTime"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="租户" prop="tenantId">
               <el-select v-model="form.tenantId" placeholder="请选择租户">
            <el-option
              v-for="item in tenantList"
              :key="item.id"
              :label="item.enterpriseName"
              :value="item.id">
            </el-option>
        </el-select>
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
import { listApplication } from "@/api/system/application";
import { listStrategy } from "@/api/strategy/strategy";
import { listTenantManagement} from "@/api/tenantManagement/tenantManagement";
import { listItem, getItem, delItem, addItem, updateItem } from "@/api/system/item";
import dayjs from 'dayjs'
export default {
  name: "Item",
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
      // 应用分配表格数据
      itemList: [],
      timebetween:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      pickerOptions: {
        disabledDate(time) {
            //此条为设置禁止用户选择今天之前的日期，包含今天。
            // return time.getTime() <= (Date.now());
            //此条为设置禁止用户选择今天之前的日期，不包含今天。
            return time.getTime() < (Date.now()-(24 * 60 * 60 * 1000));
          },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            let  end = new Date();
            const start = new Date();
            end = dayjs(start).add(1, 'month').toDate()
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            let end = new Date();
            const start = new Date();
            end = dayjs(start).add(3, 'month').toDate()
            picker.$emit('pick', [start, end]);
          }
        }]
       },
      applicationList:[],
      strategyList:[],
      tenantList:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        strategyId: null,
        applicationId: null,
        startTime: null,
        expiredTime: null,
        tenantId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        strategyId: [
          { required: true, message: "请选择策略", trigger: "blur" }
        ],
        expiredTime: [
          { required: true, message: "请选择时间", trigger: "blur" }
        ],
        applicationId: [
          { required: true, message: "请选择应用", trigger: "blur" }
        ],
        tenantId: [
          { required: true, message: "请选择租户", trigger: "blur" }
        ],        
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询应用分配列表 */
    getList() {
      this.loading = true;
      listItem(this.queryParams).then(response => {
        this.itemList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleTime(time){
      const day = dayjs(time).diff(dayjs(),'day')
      if(day>=0){
       return '还有'+day+'天到期' 
      }else{
        return '过期'+day+'天'
      }
    },
    changeTime(v){ 
      if(v==null){
         this.form.startTime=''
         this.form.expiredTime=''
      }else{
        this.form.startTime=v[0]
        this.form.expiredTime=v[1]
      }
    },
    getStrategy() {
      listStrategy({
        pageNum: 1,
        pageSize: 20,
      }).then(response => {
        this.strategyList = response.rows;
      });
    },
    getTenant() {
      listTenantManagement({
        pageNum: 1,
        pageSize: 40,
      }).then(response => {
        this.tenantList = response.rows;
      });
    },
    getApplication() {
      listApplication({
        pageNum: 1,
        pageSize: 20,
      }).then(response => {
        this.applicationList = response.rows;
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
        id: null,
        applicationId: null,
        startTime: null,
        expiredTime: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        tenantId: null
      };
      this.timebetween = []
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
      this.getApplication();
      this.getStrategy();
      this.getTenant();
      this.reset();
      this.open = true;
      this.title = "添加应用分配";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.getApplication();
      this.getStrategy();
      this.getTenant();
      this.reset();
      const id = row.id || this.ids
      getItem(id).then(response => {
        this.form = response.data;
        //console.log([response.data.startTime,response.data.endTime])
        this.timebetween = [response.data.startTime,response.data.expiredTime]
        this.open = true;
        this.title = "修改应用分配";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateItem(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addItem(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除 "' + row.applicationName + '"的数据项？').then(function() {
        return delItem(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/item/export', {
        ...this.queryParams
      }, `item_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>