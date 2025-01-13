<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <el-form :model="queryParams" inline>
      <el-form-item label="姓名">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮区域 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-table v-loading="loading" :data="policeList">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="警官证" align="center">
        <template #default="scope">
          <el-image
            v-if="scope.row.policeCard"
            :src="scope.row.policeCard"
            :preview-src-list="[scope.row.policeCard]"
            fit="contain"
            style="width: 100px; height: 60px"
          />
          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" align="center" prop="position" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" link @click="handleUpdate(scope.row)">
            修改
          </el-button>
          <el-button type="danger" link @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="queryParams.pageNum"
      v-model:page-size="queryParams.pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 添加/修改对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="500px"
      append-to-body
    >
      <el-form
        ref="policeFormRef"
        :model="policeForm"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="policeForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="policeForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="警官证" prop="policeCard">
          <el-upload
            class="police-card-uploader"
            :show-file-list="false"
            :before-upload="beforePoliceCardUpload"
            :on-success="handlePoliceCardSuccess"
          >
            <img
              v-if="policeForm.policeCard"
              :src="policeForm.policeCard"
              class="police-card-image"
            />
            <el-icon v-else class="police-card-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="警局" prop="policeStationId">
          <el-input
            v-model="policeForm.policeStationId"
            placeholder="请输入警局ID"
          />
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-input v-model="policeForm.position" placeholder="请输入职务" />
        </el-form-item>
        <el-form-item label="区域" prop="regionId">
          <el-input v-model="policeForm.regionId" placeholder="请输入区域ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  getPoliceList,
  addPolice,
  updatePolice,
  deletePolice,
  type PoliceDto,
  type PolicePageDto
} from "@/api/police";
import { Plus } from "@element-plus/icons-vue";

// 查询参数
const queryParams = reactive<PolicePageDto>({
  pageNum: 1,
  pageSize: 10,
  name: "",
  phone: ""
});

// 表格数据
const loading = ref(false);
const policeList = ref<PoliceDto[]>([]);
const total = ref(0);

// 对话框属性
const dialog = reactive({
  title: "",
  visible: false
});

// 表单对象
const policeFormRef = ref<FormInstance>();
const policeForm = ref<PoliceDto>({
  name: "",
  phone: "",
  policeCard: "",
  policeStationId: 0,
  position: "",
  regionId: ""
});

// 表单校验规则
const rules = {
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }],
  policeCard: [{ required: true, message: "警官证不能为空", trigger: "blur" }],
  policeStationId: [
    { required: true, message: "警局不能为空", trigger: "blur" }
  ],
  position: [{ required: true, message: "职务不能为空", trigger: "blur" }],
  regionId: [{ required: true, message: "区域不能为空", trigger: "blur" }]
};

/** 查询警员列表 */
const getList = async () => {
  loading.value = true;
  try {
    const res = await getPoliceList(queryParams);
    policeList.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.name = "";
  queryParams.phone = "";
  handleQuery();
};

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.title = "添加警员";
  dialog.visible = true;
  policeForm.value = {
    name: "",
    phone: "",
    policeCard: "",
    policeStationId: 0,
    position: "",
    regionId: ""
  };
};

/** 修改按钮操作 */
const handleUpdate = (row: PoliceDto) => {
  dialog.title = "修改警员";
  dialog.visible = true;
  policeForm.value = { ...row };
};

/** 删除按钮操作 */
const handleDelete = (row: PoliceDto) => {
  ElMessageBox.confirm("是否确认删除该警员?", "警告", {
    type: "warning"
  }).then(async () => {
    await deletePolice([row.id as number]);
    ElMessage.success("删除成功");
    getList();
  });
};

/** 表单提交 */
const submitForm = async () => {
  const form = policeFormRef.value;
  if (!form) return;
  await form.validate(async valid => {
    if (valid) {
      try {
        if (policeForm.value.id) {
          await updatePolice(policeForm.value);
          ElMessage.success("修改成功");
        } else {
          await addPolice(policeForm.value);
          ElMessage.success("新增成功");
        }
        dialog.visible = false;
        getList();
      } catch (error) {
        console.error(error);
      }
    }
  });
};

/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  policeFormRef.value?.resetFields();
};

/** 分页大小改变 */
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

/** 分页页码改变 */
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 上传图片前的校验
const beforePoliceCardUpload = (file: File) => {
  // 转换图片为base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      policeForm.value.policeCard = reader.result as string;
      resolve(false); // 阻止默认上传行为
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};

// 图片上传成功的回调（如果需要的话）
const handlePoliceCardSuccess = (response: any) => {
  policeForm.value.policeCard = response.data;
};

onMounted(() => {
  getList();
});
</script>

<style scoped>
.mb8 {
  margin-bottom: 8px;
}
.dialog-footer {
  text-align: right;
}
.police-card-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.police-card-uploader:hover {
  border-color: var(--el-color-primary);
}

.police-card-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 60px;
  text-align: center;
  line-height: 60px;
}

.police-card-image {
  width: 100px;
  height: 60px;
  display: block;
  object-fit: contain;
}
</style>
