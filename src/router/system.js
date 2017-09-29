//系统工作张->系统设置->插件管理
const onCampus = resolve => {
  require.ensure(['../components/system/systems/onCampus.vue'], () => {
    resolve(require('../components/system/systems/onCampus.vue'))
  })
}

//系统工作张->系统设置->地区管理
const pluginManagement = resolve => {
  require.ensure(['../components/system/systems/pluginManagement.vue'], () => {
    resolve(require('../components/system/systems/pluginManagement.vue'))
  })
}

//系统工作张->系统设置->院区管理
const regionalManagement = resolve => {
  require.ensure(['../components/system/systems/regionalManagement.vue'], () => {
    resolve(require('../components/system/systems/regionalManagement.vue'))
  })
}



let system=[
{	path: '/',			component: onCampus, 	            name: '插件管理'},
{	path: '/pluginManagement',  component: pluginManagement,        name: '地区管理'},
{	path: '/regionalManagement',component: regionalManagement,      name: '院区管理'},
]

export default system;
