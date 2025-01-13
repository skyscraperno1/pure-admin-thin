<script setup lang="ts">
import { ref, onMounted, defineOptions } from "vue";
import { getLogs } from "@/api/logs";
import type { LoginLogItem, LoginLogPageDto } from "@/api/logs";

defineOptions({
  name: "Welcome"
});

// 查询条件
const queryParams = ref<LoginLogPageDto>({
  ip: "",
  name: "",
  pageNum: 1,
  pageSize: 10,
  status: undefined,
  type: 1
});

// 表格数据
const tableData = ref<LoginLogItem[]>([]);
const total = ref(0);
const loading = ref(false);

// 获取表格数据
const getTableData = async () => {
  loading.value = true;
  try {
    const res = await getLogs(queryParams.value);
    if (res.data) {
      tableData.value = res.data.list;
      total.value = res.data.total;
    }
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.value.pageNum = 1;
  getTableData();
};

// 重置
const handleReset = () => {
  queryParams.value = {
    ip: "",
    name: "",
    pageNum: 1,
    pageSize: 10,
    status: undefined,
    type: 1
  };
  getTableData();
};

// 页码改变
const handleCurrentChange = (val: number) => {
  queryParams.value.pageNum = val;
  getTableData();
};

onMounted(() => {
  getTableData();
});
</script>

<template>
  <!-- 搜索区域 -->
  <el-card class="search-card">
    <el-form :model="queryParams" inline>
      <el-form-item label="IP地址">
        <el-input
          v-model="queryParams.ip"
          placeholder="请输入IP地址"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入用户名"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          style="width: 200px"
        >
          <el-option label="成功" :value="1" />
          <el-option label="失败" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          style="width: 200px"
        >
          <el-option label="前台" :value="0" />
          <el-option label="后台" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <!-- 表格区域 -->
  <el-card class="table-card">
    <el-table v-loading="loading" :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="用户名" />
      <el-table-column prop="ip" label="IP地址" />
      <el-table-column prop="msg" label="消息" show-overflow-tooltip />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? "成功" : "失败" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag :type="row.type === 0 ? 'info' : 'warning'">
            {{ row.type === 0 ? "前台" : "后台" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="时间">
        <template #default="{ row }">
          {{ new Date(row.time).toLocaleString() }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </el-card>
</template>

<style scoped>
.search-card {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
