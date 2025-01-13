<template>
  <div class="role-container">
    <!-- 顶部操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd">添加管理员</el-button>
      <el-button
        type="danger"
        :disabled="!selectedIds.length"
        @click="handleBatchDelete"
      >
        批量删除
      </el-button>
    </div>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="adminList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="昵称" />
      <el-table-column prop="phone" label="手机号" />
      <el-table-column label="创建时间">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间">
        <template #default="{ row }">
          {{ formatTime(row.lastLoginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="primary" link @click="handleViewRole(row)"
            >查看角色</el-button
          >
          <el-button type="primary" link @click="handleSetRole(row)"
            >设置角色</el-button
          >
          <el-button type="danger" link @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item v-if="!formData.id" label="密码" prop="password">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getAdminList,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  setAdminRole,
  getAdminRole,
  AdminDto,
  AdminItem
} from "@/api/admin";
import dayjs from "dayjs";

// 数据相关
const loading = ref(false);
const adminList = ref<AdminItem[]>([]);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const formData = ref<AdminDto>({
  name: "",
  password: "",
  phone: ""
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
};

// 添加 submitLoading
const submitLoading = ref(false);

// 获取管理员列表
const fetchAdminList = async () => {
  loading.value = true;
  try {
    const res = await getAdminList();
    if (res.code === 200) {
      adminList.value = res.data;
    }
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (timestamp: number) => {
  return dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
};

// 表格选择回调
const handleSelectionChange = (selection: AdminItem[]) => {
  selectedIds.value = selection.map(item => item.id);
};

// 添加管理员
const handleAdd = () => {
  dialogTitle.value = "添加管理员";
  dialogVisible.value = true;
};

// 编辑管理员
const handleEdit = (row: AdminItem) => {
  dialogTitle.value = "编辑管理员";
  formData.value = { ...row };
  dialogVisible.value = true;
};

// 设置角色
const handleSetRole = async (row: AdminItem) => {
  try {
    const res = await setAdminRole(row.id);
    if (res.data.code === 200) {
      ElMessage.success("设置成功");
    }
  } catch (error) {
    console.error(error);
  }
};

// 删除管理员
const handleDelete = async (row: AdminItem) => {
  try {
    await ElMessageBox.confirm("确认删除该管理员?", "提示");
    const res = await deleteAdmin([row.id]);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      fetchAdminList();
    } else {
      ElMessage.error(res.msg || "操作失败");
    }
  } catch (error) {
    console.error(error);
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (!selectedIds.value.length) return;
  try {
    await ElMessageBox.confirm("确认删除选中的管理员?", "提示");
    const res = await deleteAdmin(selectedIds.value);
    if (res.data.code === 200) {
      ElMessage.success("删除成功");
      fetchAdminList();
    }
  } catch (error) {
    console.error(error);
  }
};

// 修改提交表单方法
const handleSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const api = formData.value.id ? updateAdmin : addAdmin;
    const res = await api(formData.value);
    if (res.code === 200) {
      ElMessage.success(formData.value.id ? "更新成功" : "添加成功");
      dialogVisible.value = false;
      fetchAdminList();
    } else {
      ElMessage.error(res.msg || "操作失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("操作失败，请重试");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
  formData.value = {
    name: "",
    password: "",
    phone: ""
  };
};

// 添加查看角色方法
const handleViewRole = async (row: AdminItem) => {
  try {
    const res = await getAdminRole(row.id);
    if (res.code === 200) {
      ElMessage.info(`当前角色：${res.data.join(", ") || "暂无角色"}`);
    } else {
      ElMessage.error(res.msg || "获取角色信息失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("获取角色信息失败");
  }
};

onMounted(() => {
  fetchAdminList();
});
</script>

<style scoped>
.role-container {
  padding: 20px;
}
.operation-bar {
  margin-bottom: 20px;
}
</style>
@/api/admin
