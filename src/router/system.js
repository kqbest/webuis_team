//系统工作站->系统设置->插件管理
const onCampus = resolve => {
  require.ensure(['../components/system/systems/onCampus.vue'], () => {
    resolve(require('../components/system/systems/onCampus.vue'))
  })
}

//系统工作站->系统设置->地区管理
const pluginManagement = resolve => {
  require.ensure(['../components/system/systems/pluginManagement.vue'], () => {
    resolve(require('../components/system/systems/pluginManagement.vue'))
  })
}

//系统工作站->系统设置->院区管理
const regionalManagement = resolve => {
  require.ensure(['../components/system/systems/regionalManagement.vue'], () => {
    resolve(require('../components/system/systems/regionalManagement.vue'))
  })
}

//系统工作站->系统设置->科室管理
const managementDepartment = resolve => {
  require.ensure(['../components/system/systems/managementDepartment.vue'], () => {
    resolve(require('../components/system/systems/managementDepartment.vue'))
  })
}
//系统工作站->系统设置->角色管理
const roleManagement = resolve => {
  require.ensure(['../components/system/systems/roleManagement.vue'], () => {
    resolve(require('../components/system/systems/roleManagement.vue'))
  })
}
//系统工作站->系统设置->用户管理
const user = resolve => {
  require.ensure(['../components/system/systems/user.vue'], () => {
    resolve(require('../components/system/systems/user.vue'))
  })
}
//系统工作站->系统设置->系统字典
const informationSystem = resolve => {
  require.ensure(['../components/system/systems/informationSystem.vue'], () => {
    resolve(require('../components/system/systems/informationSystem.vue'))
  })
}
//系统工作站->系统设置->科室字典
const informationDepartment = resolve => {
  require.ensure(['../components/system/systems/informationDepartment.vue'], () => {
    resolve(require('../components/system/systems/informationDepartment.vue'))
  })
}
//系统工作站->系统设置->系统参数
const systemParameters = resolve => {
  require.ensure(['../components/system/systems/systemParameters.vue'], () => {
    resolve(require('../components/system/systems/systemParameters.vue'))
  })
}
//系统工作站->系统设置->科室参数
const departmentParams = resolve => {
  require.ensure(['../components/system/systems/departmentParams.vue'], () => {
    resolve(require('../components/system/systems/departmentParams.vue'))
  })
}
//系统工作站->系统设置->日志管理
const logs = resolve => {
  require.ensure(['../components/system/systems/logs.vue'], () => {
    resolve(require('../components/system/systems/logs.vue'))
  })
}

//系统工作站->模板设置->常用符号
const commonSymbol = resolve => {
  require.ensure(['../components/system/template/commonSymbol.vue'], () => {
    resolve(require('../components/system/template/commonSymbol.vue'))
  })
}
//系统工作站->模板设置->关键短语
const keyPhrase = resolve => {
  require.ensure(['../components/system/template/keyPhrase.vue'], () => {
    resolve(require('../components/system/template/keyPhrase.vue'))
  })
}
//系统工作站->模板设置->模板分类
const templateClassify = resolve => {
  require.ensure(['../components/system/template/templateClassify.vue'], () => {
    resolve(require('../components/system/template/templateClassify.vue'))
  })
}
//系统工作站->模板设置->书写模板
const whiteTemplate = resolve => {
  require.ensure(['../components/system/template/whiteTemplate.vue'], () => {
    resolve(require('../components/system/template/whiteTemplate.vue'))
  })
}
//系统工作站->模板设置->书写词汇
const whiteLexicon = resolve => {
  require.ensure(['../components/system/template/whiteLexicon.vue'], () => {
    resolve(require('../components/system/template/whiteLexicon.vue'))
  })
}

//系统工作站->其他设置->检查部位
const checkPart = resolve => {
  require.ensure(['../components/system/other/checkPart.vue'], () => {
    resolve(require('../components/system/other/checkPart.vue'));
  });
}
//系统工作站->其他设置->报告项设置
const reportSettings = resolve => {
  require.ensure(['../components/system/other/reportSettings.vue'], () => {
    resolve(require('../components/system/other/reportSettings.vue'));
  });
}
//系统工作站->其他设置->自定义项
const userDefined = resolve => {
  require.ensure(['../components/system/other/userDefined.vue'], () => {
    resolve(require('../components/system/other/userDefined.vue'));
  });
}
//系统工作站->其他设置->内镜信息
const endoscope = resolve => {
  require.ensure(['../components/system/other/endoscope.vue'], () => {
    resolve(require('../components/system/other/endoscope.vue'));
  });
}
//系统工作站->其他设置->清洗消毒
const cleanDisinfection = resolve => {
  require.ensure(['../components/system/other/cleanDisinfection.vue'], () => {
    resolve(require('../components/system/other/cleanDisinfection.vue'));
  });
}
//系统工作站->其他设置->测值管理
const measurement = resolve => {
  require.ensure(['../components/system/other/measurement.vue'], () => {
    resolve(require('../components/system/other/measurement.vue'));
  });
}
//系统工作站->其他设置->模板绑定
const templateBinding = resolve => {
  require.ensure(['../components/system/other/templateBinding.vue'], () => {
    resolve(require('../components/system/other/templateBinding.vue'));
  });
}

let system=[
  {	path: '/',						          component: onCampus, 	              name: '插件管理'},
  {	path: '/pluginManagement',  	  component: pluginManagement,        name: '地区管理'},
  {	path: '/regionalManagement',	  component: regionalManagement,      name: '院区管理'},
  {	path: '/managementDepartment',	component: managementDepartment,    name: '科室管理'},
  {	path: '/roleManagement',		    component: roleManagement,      	  name: '角色管理'},
  {	path: '/user',					        component: user,      				      name: '用户管理'},
  {	path: '/informationSystem',		  component: informationSystem,       name: '系统字典'},
  {	path: '/informationDepartment',	component: informationDepartment,   name: '科室字典'},
  {	path: '/systemParameters',		  component: systemParameters,      	name: '系统参数'},
  {	path: '/departmentParams',		  component: departmentParams,      	name: '科室参数'},
  { path: '/logs',                  component: logs,                    name: '日志管理'},
  { path: '/commonSymbol',          component: commonSymbol,            name: '常用符号'},
  { path: '/keyPhrase',             component: keyPhrase,               name: '关键短语'},
  { path: '/templateClassify',      component: templateClassify,        name: '模板分类'},
  { path: '/whiteTemplate',         component: whiteTemplate,           name: '书写模板'},
  {	path: '/whiteLexicon',					component: whiteLexicon,      		  name: '书写词汇'},
  {	path: '/checkPart',					    component: checkPart,      		      name: '检查部位'},
  {	path: '/reportSettings',				component: reportSettings,      		name: '报告项设置'},
  {	path: '/userDefined',					  component: userDefined,      		    name: '自定义项'},
  {	path: '/endoscope',					    component: endoscope,      		      name: '内镜信息'},
  {	path: '/cleanDisinfection',		  component: cleanDisinfection,       name: '清洗消毒'},
  {	path: '/measurement',		        component: measurement,             name: '测值管理'},
  {	path: '/templateBinding',		    component: templateBinding,         name: '模板绑定'},
]

export default system;
