<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
        style="width: 200px;"
        class="filter-item"
        v-model="listQuery.name"
        :fetch-suggestions="querySearch"
        :placeholder="$t('table.name')"
        :trigger-on-focus="false"
        @select="handleSelect"
      >
        <template slot-scope="{ item }">
          <span>{{ item.name }}</span>
        </template>
      </el-autocomplete>

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
        v-model="listQuery.typeId"
        :placeholder="$t('table.type')"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option v-for="item in typeList" :key="item._id" :label="item.name" :value="item._id" />
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
      <el-select
        v-model="listQuery.star"
        :placeholder="$t('table.star')"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option v-for="item in starList" :key="item" :label="item" :value="item" />
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
      <el-table-column :label="$t('table.name')">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.spec')">
        <template slot-scope="scope">
          <span>{{ specObj[scope.row.specId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.type')">
        <template slot-scope="scope">
          <span>{{ typeObj[scope.row.typeId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.brand')">
        <template slot-scope="scope">
          <span>{{ brandObj[scope.row.brandId] }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.star')">
        <template slot-scope="scope">
          <svg-icon
            v-for="n in +scope.row.star"
            :key="n"
            icon-class="star"
            class="meta-item__icon"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.volume')" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.volume || 0 }}</span>
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
        <el-form-item :label="$t('table.name')" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item :label="$t('table.type')">
          <el-select v-model="temp.typeId" class="filter-item" clearable>
            <el-option
              v-for="item in typeList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.spec')">
          <el-select v-model="temp.specId" clearable class="filter-item">
            <el-option
              v-for="item in specList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.brand')">
          <el-select v-model="temp.brandId" clearable class="filter-item">
            <el-option
              v-for="item in brandList"
              :key="item._id"
              :label="item.name"
              :value="item._id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.star')">
          <el-rate
            v-model="temp.star"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
            :max="3"
            style="margin-top:8px;"
          />
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
  fetchProductList,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProduct
} from "@/api/products";
import { fetchProductTypeKV } from "@/api/productTypes";
import { fetchProductSpecKV } from "@/api/productSpecs";
import { fetchProductBrandKV } from "@/api/productBrands";
import waves from "@/directive/waves"; // Waves directive
import { parseTime, transformArrayToObject } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ComplexTable",
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
        star: undefined,
        name: undefined,
        typeId: undefined,
        specId: undefined,
        sort: "-updateDate"
      },
      starList: [1, 2, 3],
      typeList: [],
      specList: [],
      brandList: [],
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
    this.getProductTypeList();
    this.getProductSpecList();
    this.getProductBrandList();
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchProductList(this.listQuery).then(response => {
        this.list = response.data.data;
        this.total = response.data.total;
        this.listLoading = false;
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
    querySearch(query, cb) {
      console.log("query", query);
      searchProduct({ name: query }).then(res => {
        cb(res.data.data);
      });
    },
    handleSelect(item) {
      this.listQuery.name = item.name;
      console.log("handleSelect", item);
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
          createProduct(this.temp).then(() => {
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
          updateProduct(this.temp).then(() => {
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
          deleteProduct({ _id: row._id }).then(res => {
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
