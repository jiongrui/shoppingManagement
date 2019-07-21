<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.customerName')"
        v-model="listQuery.customerName"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >{{ $t('table.search') }}</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="$t('table._id')" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.customerName')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.integral')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.integral }}</span>
        </template>
      </el-table-column>

      <el-table-column
        :label="$t('table.updateDate')"
        align="center"
        sortable="custom"
        prop="updateDate"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updateDate| parseTime() }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :name="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-width="100px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.customerName')" prop="customerId">
          <el-select v-model="temp.customerId" clearable filterable class="filter-item">
            <el-option
              v-for="item in customerList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.integral')" prop="integral">
          <el-input v-model.number="temp.integral" type="number" />
        </el-form-item>
        <el-form-item :label="$t('table.remarks')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.remarks"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchIntegralList, createIntegral } from "@/api/integrals";
import { fetchCustomerKV } from "@/api/customers";
import waves from "@/directive/waves"; // Waves directive
import { parseTime, transformArrayToObject } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "Customer",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        customerName: undefined,
        sort: "-updateDate"
      },
      temp: {},
      customerObj: {},
      customerList: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "table.edit",
        create: "table.create"
      },
      rules: {
        customerId: [
          {
            required: true,
            message: "customer is required",
            trigger: "change"
          }
        ],
        integral: [
          {
            type: "number",
            required: true,
            message: "integral is required",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getCustomerList();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchIntegralList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getCustomerList() {
      fetchCustomerKV().then(res => {
        const data = res.data.data;
        this.customerList = data;
        this.customerObj = transformArrayToObject(data);
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sort = order === "ascending" ? `+${prop}` : `-${prop}`;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        remarks: "",
        customerName: "",
        customerId: "",
        integral: "",
        updateDate: new Date(),
        createDate: new Date()
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.customerName = this.customerObj[this.temp.customerId];
          createIntegral(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "创建成功"
            });
            this.getList();
          });
        }
      });
    }
  }
};
</script>
