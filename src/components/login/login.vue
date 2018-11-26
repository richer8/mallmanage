<template>
    <div class="login-drap">
<el-form class="login-form" label-position="top" label-width="80px"
:model="formData">
  <el-form-item label="名称">
    <el-input v-model="formData.username"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-input v-model="formData.password"></el-input>
  </el-form-item>
  <el-button type="primary" class="login-btn" @click.prevent="handleLogin()">主要按钮</el-button>
</el-form>

    </div>
</template>

<script>
export default {
    data() {
        return {
            formData:{
                username:'',
                password:''
            }
        }
    },
    methods: {
        // 在异步操作的外面获取到异步操作里面的结果
       async handleLogin() {
           const res = await this.$http.post('login',this.formData)
                    
                        console.log(res);
                        const {
                            meta:{status,msg},
                            data
                        } = res.data
                        if(status===200){
                            // 0 保存用户token
                            // 将来在home中渲染检查
                            const token = localStorage.setItem('token',data.token)
                            // 1跳转到首页
                        this.$router.push({name:'home'})
                        // 2提示登陆成功
                        this.$message.success(msg)
                        
                        } else {
                            // 3登陆失败,提示用户
                            this.$message.warning(msg)
                        }
                        
                        
                    }
        }
    }

</script>

<style>
    .login-drap {
       height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;

    }
    .login-drap .login-form {
        width: 400px;
  background-color: #fff;
  border-radius: 5px;
  padding: 30px;
    }
    .login-drap .login-btn {
        width: 100%;
    }
</style>
