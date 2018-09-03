module.exports = {
    code:{
        SUCCESS:200,
        FAILED:404,
        CONFLICT:409
    },
    state: {
        STATE_OUT:0,
        STATE_IN:1,
    },
    info:{
        ERROR_NONE:'注册成功！',
        ERROR_USER_NAME: '用户名错误！',
        ERROR_USER_CONFLICT: '用户名已存在！',
        ERROR_PASSWORD: '密码错误！',
        ERROR_SIGN_UP:'注册失败！',
        ERROR_USER_ONLINE:'用户已登录聊天群，请重新注册！',
    }
};