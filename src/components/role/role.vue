<template>
  <el-card>
    <my-bread level1="权限管理" level2="角色管理"></my-bread>
    <el-row class="addRole">
      <el-col>
        <el-button @click="showAddRoleDia()">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="80">
        <!-- 展开不是字符串,所以用template, 并且template需要用slot-scope传值 -->
        <template slot-scope="scope">
          <el-row v-for="(item1,index) in scope.row.children" :key="index">
            <el-col :span="4">
              <el-tag
                type="success"
                closable
                @close="deleRight(scope.row,item1.id)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <el-row v-for="(item2,index) in item1.children" :key="index">
                <el-col :span="4">
                  <el-tag
                    type="info"
                    closable
                    @close="deleRight(scope.row,item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    closable
                    @close="deleRight(scope.row,item3.id)"
                    v-for="(item3,index) in item2.children"
                    :key="index"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="100"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
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
            @click="delRolelist(scope.row.id)"
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
            @click="showSetRightDia(scope.row)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加弹框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px">
          <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 点击对勾弹框 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRight">
       <!-- 树形结构
          data->绑定的数据数组
        show-checkbox -> 选择方块
        node-key->每个节点的唯一标识
        default-expanded-keys->[要展开的节点的id值]
        default-checked-keys->[选中的节点id值]
        props="配置选项{label:绑定数据data中的数据key名,children:绑定数据data中的数据key名}" -->
      <!-- :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]" -->
      <el-tree
        :data="treelist"
        show-checkbox
        default-expand-all
        node-key="id"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisibleAdd: false,
      dialogFormVisibleRight: false,
      // 用户表单数据
      form: {},
      // 树形结构的权限数据
      treelist:[],
      defaultProps:{
        children:'children',
        label:'autoName'
      }
    };
  },
  created() {
    this.getRolelist();
  },
  methods: {
    
    // 分配权限  树形对话框  打开对话框之前要获取数据
    async showSetRightDia() {
      const res = await this.$http.get(``)
      this.dialogFormVisibleRight = true;
    },
    // 点X删除  角色id  权限id
    async deleRight(role, rightId) {
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      // 当前剩余的权限
      role.children = res.data.data;
      // console.log(res)
      // this.getRolelist()
    },
    // 添加跳出弹框
    showAddRoleDia() {
      this.dialogFormVisibleAdd = true;
    },
    // 添加
    async addRole() {
      const res = await this.$http.post(`roles`, this.form);
      const {
        meta: { msg, status },
        data
      } = res.data;
      // console.log(res);
      if (status === 201) {
        this.$message.success(msg);
        this.getRolelist();
        this.form = {};
        this.dialogFormVisibleAdd = false;
      }
    },
    // 删除
    async delRolelist(roleId) {
      const res = await this.$http.delete(`roles/${roleId}`);
      this.getRolelist();
      // this.$message.success(msg)
    },
    // 获取数据列表
    async getRolelist() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.rolelist = res.data.data;
    }
  }
};


</script>

<style>
.addRole {
  margin-top: 20px;
}
</style>
