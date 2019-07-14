<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.name')"
        v-model="listQuery.name"
        style="width: 200px;"
        class="filter-item"
      />

      <el-select
        v-model="listQuery.brandId"
        :placeholder="$t('table.brand')"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option v-for="item in brandList" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>
      <el-select
        v-model="listQuery.specId"
        :placeholder="$t('table.spec')"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in specList" :key="item._id" :label="item.name" :value="item._id" />
      </el-select>

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
      <el-table-column :label="$t('table._id')" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row._id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('customer.name')">
        <template slot-scope="scope">
          <span>{{ specObj[scope.row.customerName] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.buyIn')">
        <template slot-scope="scope">
          <span>{{ scope.row.buyIn }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.sellOut')">
        <template slot-scope="scope">
          <span>{{ scope.row.sellOut }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.exchangeRate')">
        <template slot-scope="scope">
          <span>{{ scope.row.exchangeRate }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.quantity')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.quantity }}</span>
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
        <el-form-item :label="$t('product.name')" prop="productId">
          <el-select v-model="temp.productId" class="filter-item" clearable>
            <el-option
              v-for="item in productList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('customer.name')" prop="customerId">
          <el-select v-model="temp.customerId" clearable class="filter-item">
            <el-option
              v-for="item in customerList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('table.buyIn')" prop="buyIn">
          <el-input v-model="temp.buyIn" />
        </el-form-item>
        <el-form-item :label="$t('table.currency')" prop="buyInCurrency">
          <el-select v-model="temp.buyInCurrency" clearable class="filter-item">
            <el-option
              v-for="item in currencyList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sellOut')" prop="sellOut">
          <el-input v-model="temp.sellOut" />
        </el-form-item>
        <el-form-item :label="$t('table.currency')" prop="sellOutCurrency">
          <el-select v-model="temp.sellOutCurrency" clearable class="filter-item">
            <el-option
              v-for="item in currencyList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.exchangeRate')" prop="exchangeRate">
          <el-input v-model="temp.exchangeRate" />
        </el-form-item>
        <el-form-item :label="$t('table.quantity')" prop="quantity">
          <el-input v-model="temp.quantity" type="number" :min="1" />
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
  fetchOrderList,
  createOrder,
  updateOrder,
  deleteOrder
} from "@/api/orders";
import { fetchProductList } from "@/api/products";
import { fetchCustomerList } from "@/api/customers";
import { fetchProductTypeList } from "@/api/productTypes";
import { fetchProductSpecList } from "@/api/productSpecs";
import { fetchProductBrandList } from "@/api/productBrands";
import waves from "@/directive/waves"; // Waves directive
import { parseTime, transformArrayToObject, currencyList } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "OrderList",
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
        customerId: undefined,
        productId: undefined,
        createDate: undefined,
        sort: "-updateDate"
      },
      currencyList,
      productList: [],
      customerList: [],
      typeList: [],
      specList: [],
      brandList: [],
      productObj: {},
      customerObj: {},
      typeObj: {},
      specObj: {},
      brandObj: {},
      temp: {},
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "table.edit",
        create: "table.create"
      },
      rules: {
        typeId: [
          {
            type: "string",
            required: true,
            message: "type is required",
            trigger: "change"
          }
        ],
        specId: [
          {
            type: "string",
            required: true,
            message: "spec is required",
            trigger: "change"
          }
        ],
        brandId: [
          {
            type: "string",
            required: true,
            message: "brand is required",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "name is required", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getProductList();
    this.getCustomerList();
    this.getProductTypeList();
    this.getProductSpecList();
    this.getProductBrandList();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchOrderList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getProductList() {
      fetchProductList().then(res => {
        const data = res.data.data;
        this.productList = data;
        this.productObj = transformArrayToObject(data);
      });
    },
    getCustomerList() {
      fetchCustomerList().then(res => {
        const data = res.data.data;
        this.customerList = data;
        this.customerObj = transformArrayToObject(data);
      });
    },
    getProductTypeList() {
      fetchProductTypeList().then(res => {
        const data = res.data.data;
        this.typeList = data;
        this.typeObj = transformArrayToObject(data);
      });
    },
    getProductSpecList() {
      fetchProductSpecList().then(res => {
        const data = res.data.data;
        this.specList = data;
        this.specObj = transformArrayToObject(data);
      });
    },
    getProductBrandList() {
      fetchProductBrandList().then(res => {
        const data = res.data.data;
        this.brandList = data;
        this.brandObj = transformArrayToObject(data);
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sort = order === "ascending" ? `+${prop}` : `-${prop}`;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        star: 1,
        remarks: "",
        name: "",
        typeId: "",
        specId: "",
        brandId: "",
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
          createOrder(this.temp).then(() => {
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
      delete this.temp.createDate;
      delete this.temp.volume;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateOrder(this.temp).then(() => {
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
          deleteOrder({ _id: row._id }).then(res => {
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
