<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 输入框 -->
    <el-row class="searchRow">
      <el-col :span="16">
        <el-input
          @clear="loadUserList()"
          clearable
          v-model="query"
          placeholder="请输入用户名"
          class="searchInput"
        >
          <el-button clearable @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDia()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- :data是绑定从网络请求的数据 数组-->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- 单元格不是字符串或者文本,而是图标等等 -->
      <el-table-column label="创建日期">
        <!-- 如果单元格的内容不是字符串/文本 需要给要展示的内容外层包裹一个tempalte -->
        <!-- slot-scope 传值 userlist是外层容器绑定的数据 -->
        <template slot-scope="scope">
          <!-- {{create_time | fmtdate}} fmtdate过滤器修改日期 -->
          <!-- userlist中的每个对象中的create_time -->
          {{scope.row.create_time |fmtdate}}
        </template>
      </el-table-column>
      <!-- 用户状态 -->
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeUserMgstate(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showMegBoxDele(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            @click="showSetRoleDia(scope.row)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页符 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加数据弹出框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="活动名称" label-width="100px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名称" label-width="100px">
          <el-input :disabled="true" v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" label-width="100px">{{currUsername}}</el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 如果 select 的v-model绑定的数据的值 -1和 option的value值 -->
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(item,i) in roles" :key="i" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>


<script>
export default {
  data() {
    return {
      query: "",
      // 提供渲染的table数据
      userlist: [
        {
          create_time: "",
          email: "",
          id: "",
          mg_state: "",
          mobile: "",
          role_name: "",
          username: ""
        }
      ],
      //   获取用户数据请求的参数
      pagenum: 1,
      pagesize: 2,
      total: -1,

      // 点击取消功能
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,

      // 用户表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      currUserId:-1,
      currUsername: "",
      roles: "",
      currRoleId:-1,
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 点击设置角色
    async setRole() {
      // id 用户的id
      // rid 角色id
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      })
      // console.log(res)
      // 关闭对话框
      this.dialogFormVisibleRole = false;
    },

    // 设置角色  跳出对话框
    async showSetRoleDia(user) {
      // 给当前的用户id赋值
      this.currUserId = user.id;
      // 获取当前用户名
      this.currUsername = user.username;
      // 获取当前用户角色的名称
      const res1 = await this.$http.get(`roles`);
      this.roles = res1.data.data;
      // 获取当前角色的id
      const res2 = await this.$http.get(`users/${user.id}`);
      this.currRoleId = res2.data.data.rid;
<<<<<<< HEAD
      this.gitdialogFormVisibleRole = true;
=======
      this.dialogFormVisibleRole = true;
>>>>>>> dev-user
    },
    // 修改用户状态
    async changeUserMgstate(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.my_state}`
      );
      console.log(res);
    },

    // 编辑的对话框操作
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisibleEdit = false;
        this.getUserList();
      } else {
        this.$message.warning(MessageEvent);
      }
    },
    // 编辑 跳出对话框
    showEditUserDia(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },

    // 删除
    showMegBoxDele(userId) {
      this.$confirm("是否删除用户", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除请求
          const res = await this.$http.delete(`users/${userId}`);
          // console.log(res);

          // 更新视图
          this.getUserList();

          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: res.data.meta.msg
          });
        });
    },
    // 添加功能
    // 跳出对话框
    showAddUserDia() {
      this.dialogFormVisibleAdd = true;
    },
    // 跳出对话框,点取得添加用户
    async addUser() {
      // 1发送请求
      // 2关闭对话框,3提示成功
      this.dialogFormVisibleAdd = false;
      const res = await this.$http.post("users", this.form);
      // console,log(res)

      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 201) {
        // 3提示成功
        this.$message.success(msg);
        // 更新视图
        this.getUserList();
        // 5清空对话框数据
        this.form = {};
      }
    },
    // 搜索
    searchUser() {
      // 1按照query发送请求
      this.pagenum = 1;
      this.getUserList();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      //   每页条数的变化随点击的val值变  刷新页面
      (this.pagesize = val),
        //   每次变换页数时候都要从页码是1开始
        (this.pagenum = 1),
        this.getUserList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`),
        //   页码的变化随点击的val值变  刷新页面
        (this.pagenum = val),
        this.getUserList();
    },
    //   获取列表数据
    async getUserList() {
      // 接口文档: 需要授权的API->设置请求头 Authorization=token -> axios文档
      // 设置请求头 进行授权
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      //   请求数据
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      // console.log(res);
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        (this.total = total),
          (this.userlist = users),
          this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}
.searchRow {
  margin-top: 20px;
}

.searchInput {
  width: 300px;
}
</style>
