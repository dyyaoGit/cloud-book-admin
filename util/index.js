const passwordReg = /^.{5,}/  //6位数以上的密码

exports.testPwd = (password) => {
    return passwordReg.test(password)
}

