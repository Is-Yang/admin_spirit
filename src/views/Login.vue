<template>
  <div class="login-page">
    <div class="login-wrapper">
      <div class="title">预略科技AI能精灵管理后台</div>
      <el-form label-position="top" :rules="rules" :model="ruleForm" ref="loginForm" class="login-form">
        <el-form-item label="账号" prop="username">
          <el-input type="text" v-model.trim="ruleForm.username" placeholder="请输入帐号" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model.trim="ruleForm.password" placeholder="请输入密码" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="m-t-50">
          <el-button style="width: 100%" type="primary" :loading="loading" @click="submitForm">立即登录</el-button>
          <el-checkbox v-model="checked" @change="!checked">记住密码</el-checkbox>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { localSet, localGet } from '/@/utils'
import { accountSign } from '/@/api/login'

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const loginForm = ref(null)
    const state = reactive({
      ruleForm: {
        username: '',
        password: ''
      },
      checked: true,
      loading: false,
      rules: {
        username: [
          { required: 'true', message: '账户不能为空', trigger: 'blur' }
        ],
        password: [
          { required: 'true', message: '密码不能为空', trigger: 'blur' }
        ]
      }
    })

    onMounted(() => {
      state.ruleForm.username = localGet('username') || '';
      state.ruleForm.password = localGet('password') || '';
    })

    const submitForm = async () => {
      loginForm.value.validate((valid) => {
        if (valid) {
          let params = {
            account: state.ruleForm.username,
            password: state.ruleForm.password,
            type: 2
          }
          state.loading = true;
          accountSign(params).then(res => {
            state.loading = false;
            if (res.code == 0) {
              const { token } = res.data;
              localSet('token', token);
              if (state.checked) {
                localSet('checked', true);
                localSet('username', state.ruleForm.username);
                localSet('password', state.ruleForm.password);
              }
              ElMessage.success('登录成功');
              router.push({ path: '/device' });
            }
          })
        } else {
          console.log('error submit!!')
          return false;
        }
      })
    }
    return {
      ...toRefs(state),
      loginForm,
      submitForm
    }
  }
}
</script>

<style lang="less" scoped>
  .login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    background-color: #fff;
    /* background-image: linear-gradient(25deg, #077f7c, #3aa693, #5ecfaa, #7ffac2); */

    .login-wrapper {
      width: 500px;
      padding: 50px 60px;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);

      .title {
        margin-bottom: 20px;
        text-align: center;
        font-size: 28px;
        font-weight: bold;
        color: #409EFF;
      }
    }
  }
</style>