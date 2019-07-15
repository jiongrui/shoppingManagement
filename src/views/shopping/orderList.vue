<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
        :placeholder="$t('table.customerName')"
        v-model="listQuery.customerName"
        style="width: 200px;"
        class="filter-item"
        :fetch-suggestions="querySearchCustomer"
        :trigger-on-focus="false"
        @select="handleSelectCustomer"
      >
        <template slot-scope="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </el-autocomplete>
      <el-autocomplete
        :placeholder="$t('table.productName')"
        v-model="listQuery.productName"
        style="width: 200px;"
        class="filter-item"
        :fetch-suggestions="querySearchProduct"
        :trigger-on-focus="false"
        @select="handleSelectProduct"
      >
        <template slot-scope="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </el-autocomplete>

      <el-date-picker
        class="filter-item"
        v-model="listQuery.shoppingDate"
        type="date"
        value-format="yyyy-MM-dd"
        :placeholder="$t('table.shoppingDate')"
      ></el-date-picker>

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
      <el-table-column :label="$t('table.productName')">
        <template slot-scope="scope">
          <span>{{ scope.row.productName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.customerName')">
        <template slot-scope="scope">
          <span>{{ scope.row.customerName }}</span>
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
        :label="$t('table.shoppingDate')"
        align="center"
        sortable="custom"
        prop="shoppingDate"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.shoppingDate| parseTime() }}</span>
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
        <el-form-item :label="$t('table.shoppingDate')" prop="shoppingDate">
          <el-date-picker v-model="temp.shoppingDate" type="date"></el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('table.productName')" prop="productId">
          <el-select v-model="temp.productId" class="filter-item" clearable>
            <el-option
              v-for="item in productList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.customerName')" prop="customerId">
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
          <el-input v-model="temp.buyIn" type="number" />
        </el-form-item>
        <el-form-item :label="$t('table.buyInCurrency')" prop="buyInCurrency">
          <el-select v-model="temp.buyInCurrency" clearable class="filter-item">
            <el-option
              v-for="item in currencyList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sellOut')" prop="sellOut">
          <el-input v-model="temp.sellOut" type="number" />
        </el-form-item>
        <el-form-item :label="$t('table.sellOutCurrency')" prop="sellOutCurrency">
          <el-select v-model="temp.sellOutCurrency" clearable class="filter-item">
            <el-option
              v-for="item in currencyList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.exchangeRate')" prop="exchangeRate">
          <el-input v-model="temp.exchangeRate" type="number" />
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
import { fetchProductKV, searchProduct } from "@/api/products";
import { fetchCustomerKV, searchCustomer } from "@/api/customers";
import { fetchProductTypeKV } from "@/api/productTypes";
import { fetchProductSpecKV } from "@/api/productSpecs";
import { fetchProductBrandKV } from "@/api/productBrands";
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
        customerName: undefined,
        productName: undefined,
        shoppingDate: undefined,
        sort: "-shoppingDate"
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
        productId: [
          {
            required: true,
            message: "product is required",
            trigger: "change"
          }
        ],
        customerId: [
          {
            required: true,
            message: "customer is required",
            trigger: "change"
          }
        ],
        buyIn: [
          {
            required: true,
            message: "sellOut is required",
            trigger: "blur"
          }
        ],
        buyInCurrency: [
          {
            required: true,
            message: "buyInCurrency is required",
            trigger: "change"
          }
        ],
        sellOut: [
          {
            required: true,
            message: "sellOut is required",
            trigger: "blur"
          }
        ],
        sellOutCurrency: [
          {
            required: true,
            message: "sellOutCurrency is required",
            trigger: "change"
          }
        ],
        exchangeRate: [
          {
            required: true,
            message: "exchangeRate is required",
            trigger: "blur"
          }
        ],
        quantity: [
          {
            required: true,
            message: "quantity is required",
            trigger: "blur"
          }
        ],
        shoppingDate: [
          {
            type: "date",
            required: true,
            message: "shoppingDate is required",
            trigger: "change"
          }
        ]
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
      fetchProductKV().then(res => {
        const data = res.data.data;
        this.productList = data;
        this.productObj = transformArrayToObject(data);
      });
    },
    getCustomerList() {
      fetchCustomerKV().then(res => {
        const data = res.data.data;
        this.customerList = data;
        this.customerObj = transformArrayToObject(data);
      });
    },
    getProductTypeList() {
      fetchProductTypeKV().then(res => {
        const data = res.data.data;
        this.typeList = data;
        this.typeObj = transformArrayToObject(data);
      });
    },
    getProductSpecList() {
      fetchProductSpecKV().then(res => {
        const data = res.data.data;
        this.specList = data;
        this.specObj = transformArrayToObject(data);
      });
    },
    getProductBrandList() {
      fetchProductBrandKV().then(res => {
        const data = res.data.data;
        this.brandList = data;
        this.brandObj = transformArrayToObject(data);
      });
    },
    querySearchProduct(query, cb) {
      console.log("querySearchProduct query", query);
      searchProduct({ name: query }).then(res => {
        cb(res.data.data);
      });
    },
    querySearchCustomer(query, cb) {
      console.log("querySearchCustomer query", query);
      searchCustomer({ name: query }).then(res => {
        cb(res.data.data);
      });
    },
    handleSelectProduct(item) {
      this.listQuery.productName = item.name;
      console.log("handleSelectProduct", item);
    },
    handleSelectCustomer(item) {
      this.listQuery.customerName = item.name;
      console.log("handleSelectProduct", item);
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sort = order === "ascending" ? `+${prop}` : `-${prop}`;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        productId: "",
        productName: "",
        customerId: "",
        customerName: "",
        buyIn: "",
        buyInCurrency: "",
        sellOut: "",
        sellOutCurrency: "",
        exchangeRate: "",
        quantity: "",
        remarks: "",
        shoppingDate: "",
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
          this.temp.productName = this.productObj[this.temp.productId];
          this.temp.customerName = this.customerObj[this.temp.customerId];
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
      const temp = Object.assign({}, row); // copy obj
      temp.shoppingDate = new Date(temp.shoppingDate);
      this.temp = temp;
      delete this.temp.createDate;
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          this.temp.productName = this.productObj[this.temp.productId];
          this.temp.customerName = this.customerObj[this.temp.customerId];
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
      }).then(() => {
        deleteOrder({ _id: row._id }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.getList();
        });
      });
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消删除"
      //   });
      // });
    }
  }
};
</script>
