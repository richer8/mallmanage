<template>
    <el-container class="container">
        <el-header class="header">
            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <img src="../../assets/logo.png" alt="">
                </div></el-col>
            <el-col :span="19" class="middle">
                <div class="grid-content bg-purple-light">
                电商管理后台系统
                </div></el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <a class="loginout" href="#"
                    @click.prevent="handleloginout()"
                    >退出</a>
                </div>
            </el-col>        
        
        </el-header>
  <el-container>
    <el-aside class="aside" width="200px">Aside</el-aside>
    <el-main class="main">Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
    data() {
        return {
            data:{
                // 在组件渲染之前if token
                beforeCreate() {
                    // 获取token
                    const token = localStorage.getItem('token')
                    // 如果不存在
                    if(!token) {
                        this.$router.push({name:'login'})
                    }

                    // 如果存在
                }
            }
        }
    },
    methods:{
        handleloginout(){
            // 1提示
            this.$message.success('退出成功')
            // 2清除
            localStorage.clear()
            // 3回到login
            this.$router.push({name:'login'})
        }
    }
}
</script>

<style>
    .container{
        height: 100%;
    }
    .header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
    height: 100%;
}
/* 头部样式调整 */
.middle {
    text-align: center;
}

.loginout {
    line-height: 60px;
    text-decoration: none;
}
</style>
