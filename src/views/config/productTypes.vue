<template>
  <div class="app-container">
    <div class="filter-container">
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
      <el-table-column
        :label="$t('table._id')"
        prop="_id"
        sortable="custom"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.type')" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item :label="$t('table.type')" prop="type">
          <el-input v-model="temp.type" />
          <!-- <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>-->
        </el-form-item>
        <!-- <el-form-item :label="$t('table.date')" prop="date">
          <el-date-picker v-model="temp.date" type="datetime" placeholder="Please pick a date" />
        </el-form-item>-->
        <!-- <el-form-item :label="$t('table.remark')">
          <el-input
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="temp.remark"
            type="textarea"
            placeholder="Please input"
          />
        </el-form-item>-->
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
  fetchProductTypeList,
  createProductType,
  updateProductType,
  deleteProductType
} from "@/api/shopping";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sort: "+_id"
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+_id" },
        { label: "ID Descending", key: "-_id" }
      ],
      temp: {
        date: new Date(),
        type: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create"
      },
      rules: {
        type: [
          { required: true, message: "type is required", trigger: "change" }
        ],
        date: [
          {
            type: "date",
            required: true,
            message: "date is required",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchProductTypeList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作成功",
        type: "success"
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "_id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+_id";
      } else {
        this.listQuery.sort = "-_id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        date: new Date(),
        type: ""
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
          this.temp.date = parseTime(this.temp.date);
          console.log("this.temp", this.temp);
          // this.temp._id = parseInt(Math.random() * 100) + 1024; // mock a _id
          // this.temp.author = "vue-element-admin";
          createProductType(this.temp).then(() => {
            // this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      // this.temp.date = new Date(this.temp.date);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.date = parseTime(this.temp.date);
          updateProductType(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row) {
      deleteProductType({_id:row._id}).then(res => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
        this.getList();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "date") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>
