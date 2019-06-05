// see http://vuejs-templates.github.io/webpack for documentation.
var server = "http://localhost:8080/jenkins/";
// var server = "http://172.23.102.65:8084/";
module.exports = {
  proxyTable: {
    "/working-hours": {
      target: server, // 接口的域名
      secure: false,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
    }
  },
};
