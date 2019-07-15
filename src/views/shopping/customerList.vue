<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.customerName')"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
      />

      <el-input
        :placeholder="$t('table.phone')"
        v-model="listQuery.phone"
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
      <el-table-column :label="$t('table.customerName')" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.phone')">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.address')" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.integral')" width="80">
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
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >{{ $t('table.edit') }}</el-button>
          <el-button
            v-if="scope.row.status!='deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row)"
          >{{ $t('table.delete') }}</el-button>
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
        <el-form-item :label="$t('table.customerName')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.phone')" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item :label="$t('table.address')" prop="address">
          <el-input v-model="temp.address" />
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
import {
  fetchCustomerList,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from "@/api/customers";
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
        phone: undefined,
        name: undefined,
        sort: "-updateDate"
      },
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "table.edit",
        create: "table.create"
      },
      rules: {
        phone: [
          {
            required: true,
            message: "phone is required",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "name is required", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchCustomerList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
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
        name: "",
        phone: "",
        address: "",
        integral: 0,
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
          createCustomer(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "创建成功"
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          delete this.temp.integral;
          updateCustomer(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$message({
              type: "success",
              message: "更新成功"
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm("确定删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCustomer({ _id: row._id }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
