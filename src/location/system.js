
import {title} from './title.js'



var sxy={
sysUserInfovalidate:title+'systemmanagement/systemsetting/sysUserInfo/validate',//获取端口号
sysUserInfologin:title+'systemmanagement/systemsetting/sysUserInfo/login.html',//登录
//插件管理
sysAreaManagerfindTree:title+'systemmanagement/systemsetting/sysAreaManager/findTree',//获取院区和下级科室
}

var ckq={
	sysMenuManagerfindTree: title + 'systemmanagement/systemsetting/sysMenuManager/findTree',//插件管理-左侧树形
	sysMenuManagerfindPage: title + 'systemmanagement/systemsetting/sysMenuManager/findPage',//插件管理-列表
	sysMenuManagerupdateState: title + 'systemmanagement/systemsetting/sysMenuManager/updateState',//插件管理-启用状态

	sysAreaManagerfindTree: title + 'systemmanagement/systemsetting/sysAreaManager/findTree',//地区管理-左侧树形
	sysAreaManagerfindPage: title + 'systemmanagement/systemsetting/sysAreaManager/findPage',//地区管理-列表
	sysAreaManagerinsert: title + 'systemmanagement/systemsetting/sysAreaManager/insert',//地区管理-新建保存
	sysAreaManagerupdate: title + 'systemmanagement/systemsetting/sysAreaManager/update',//地区管理-编辑保存
	sysAreaManagerdelete: title + 'systemmanagement/systemsetting/sysAreaManager/delete',//地区管理-删除

	sysHospitalManagerfindTree: title + 'systemmanagement/systemsetting/sysHospitalManager/findTree',//院区管理-左侧树形
	sysHospitalManagerfindPage: title + 'systemmanagement/systemsetting/sysHospitalManager/findPage',//院区管理-列表
	sysHospitalManagerinsertReady: title + 'systemmanagement/systemsetting/sysHospitalManager/insertReady',//院区管理-新建初始化
	sysAreaManagerloadArea: title + 'systemmanagement/systemsetting/sysAreaManager/loadArea',//院区管理-新建联动
	sysHospitalManagerinsert: title + 'systemmanagement/systemsetting/sysHospitalManager/insert',//院区管理-新建保存
	sysHospitalManagerupdateQuery: title + 'systemmanagement/systemsetting/sysHospitalManager/updateQuery',//院区管理-编辑初始化
	sysHospitalManagerupdate: title + 'systemmanagement/systemsetting/sysHospitalManager/update',//院区管理-编辑保存
	sysHospitalManagerdelete: title + 'systemmanagement/systemsetting/sysHospitalManager/delete',//院区管理-删除

	sysDepartmentManagerfindTree: title + 'systemmanagement/systemsetting/sysDepartmentManager/findTree',//科室管理-左侧树形
	sysDepartmentManagerfindPage: title + 'systemmanagement/systemsetting/sysDepartmentManager/findPage',//科室管理-列表
	sysDepartmentManagerinsertReady: title + 'systemmanagement/systemsetting/sysDepartmentManager/insertReady',//科室管理-新建初始化
	sysDepartmentManagerinsert: title + 'systemmanagement/systemsetting/sysDepartmentManager/insert',//科室管理-新建保存
	sysDepartmentManagerupdateQuery: title + 'systemmanagement/systemsetting/sysDepartmentManager/updateQuery',//科室管理-编辑初始化
	sysDepartmentManagerupdate: title + 'systemmanagement/systemsetting/sysDepartmentManager/update',//科室管理-编辑保存
	sysDepartmentManagerdelete: title + 'systemmanagement/systemsetting/sysDepartmentManager/delete',//科室管理-删除
	sysDepartmentManagerloadReady: title + 'systemmanagement/systemsetting/sysDepartmentManager/loadReady',//科室管理-数据初始化
	sysUserInfoloadDept: title + 'systemmanagement/systemsetting/sysUserInfo/loadDept',//科室管理-数据初始化-院区关联科室
	sysDepartmentManagerloadData: title + 'systemmanagement/systemsetting/sysDepartmentManager/loadData',//科室管理-数据初始化保存

	sysRoleManagerfindTree: title + 'systemmanagement/systemsetting/sysRoleManager/findTree',//角色管理-左侧树形
	sysRoleManagerfindPage: title + 'systemmanagement/systemsetting/sysRoleManager/findPage',//角色管理-列表
	sysRoleManagerinsertReady: title + 'systemmanagement/systemsetting/sysRoleManager/insertReady',//角色管理-新建初始化
	sysRoleManagerinsert: title + 'systemmanagement/systemsetting/sysRoleManager/insert',//角色管理-新建保存
	sysRoleManagerupdateQuery: title + 'systemmanagement/systemsetting/sysRoleManager/updateQuery',//角色管理-编辑初始化
	sysRoleManagerupdate: title + 'systemmanagement/systemsetting/sysRoleManager/update',//角色管理-编辑保存
	sysRoleManagerupdateState: title + 'systemmanagement/systemsetting/sysRoleManager/updateState',//角色管理-启用状态
	sysRoleManagerdelete: title + 'systemmanagement/systemsetting/sysRoleManager/delete',//角色管理-删除

	sysUserInfofindTree: title + 'systemmanagement/systemsetting/sysUserInfo/findTree',//用户管理-左侧树形
	sysUserInfofindPage: title + 'systemmanagement/systemsetting/sysUserInfo/findPage',//用户管理-列表
	sysUserInfoinsertReady: title + 'systemmanagement/systemsetting/sysUserInfo/insertReady',//用户管理-新建初始化
	sysUserInfoinsert: title + 'systemmanagement/systemsetting/sysUserInfo/insert',//用户管理-新建保存
	sysUserInfoupdateQuery: title + 'systemmanagement/systemsetting/sysUserInfo/updateQuery',//用户管理-编辑初始化
	sysUserInfoupdate: title + 'systemmanagement/systemsetting/sysUserInfo/update',//用户管理-编辑保存
	sysUserInfoupdateState: title + 'systemmanagement/systemsetting/sysUserInfo/updateState',//用户管理-启用状态
	sysUserInfodelete: title + 'systemmanagement/systemsetting/sysUserInfo/delete',//用户管理-删除
	sysUserInforesetPassword: title + 'systemmanagement/systemsetting/sysUserInfo/resetPassword',//用户管理-重置密码

	sysDataDicfindPage: title + 'systemmanagement/systemsetting/sysDataDic/findPage',//系统字典-列表
	sysDataDicfindMxPage: title + 'systemmanagement/systemsetting/sysDataDic/findMxPage',//系统字典-编辑
	sysDataDicinsert: title + 'systemmanagement/systemsetting/sysDataDic/insert',//系统字典-弹框-新建保存
	sysDataDicupdateQuery: title + 'systemmanagement/systemsetting/sysDataDic/updateQuery',//系统字典-弹框-编辑
	sysDataDicupdate: title + 'systemmanagement/systemsetting/sysDataDic/update',//系统字典-弹框-编辑保存
	sysDataDicupdateState: title + 'systemmanagement/systemsetting/sysDataDic/updateState',//系统字典-启用状态
	sysDataDicdelete: title + 'systemmanagement/systemsetting/sysDataDic/delete',//系统字典-弹框-删除

	sysDepDataDicfindTree: title + 'systemmanagement/systemsetting/sysDepDataDic/findTree',//科室字典-左侧树形
	sysDepDataDicfindPage: title + 'systemmanagement/systemsetting/sysDepDataDic/findPage',//科室字典-列表
	sysDepDataDicfindMxPage: title + 'systemmanagement/systemsetting/sysDepDataDic/findMxPage',//科室字典-编辑
	sysDepDataDicinsertReady: title + 'systemmanagement/systemsetting/sysDepDataDic/insertReady',//科室字典-弹框-新建初始化
	sysDepDataDicinsert: title + 'systemmanagement/systemsetting/sysDepDataDic/insert',//科室字典-弹框-新建保存
	sysDepDataDicupdateQuery: title + 'systemmanagement/systemsetting/sysDepDataDic/updateQuery',//科室字典-弹框-编辑初始化
	sysDepDataDicupdate: title + 'systemmanagement/systemsetting/sysDepDataDic/update',//科室字典-弹框-编辑保存
	sysDepDataDicupdateState: title + 'systemmanagement/systemsetting/sysDepDataDic/updateState',//科室字典-弹框-启用状态
	sysDepDataDicdelete: title + 'systemmanagement/systemsetting/sysDepDataDic/delete',//科室字典-弹框-删除

	sysParafindPage: title + 'systemmanagement/systemsetting/sysPara/findPage',//系统参数-列表
	sysParaupdateQuery: title + 'systemmanagement/systemsetting/sysPara/updateQuery',//系统参数-编辑
	sysParaupdate: title + 'systemmanagement/systemsetting/sysPara/update',//系统参数-编辑保存

	sysDepParafindTree: title + 'systemmanagement/systemsetting/sysDepPara/findTree',//科室参数-左侧树形
	sysDepParafindPage: title + 'systemmanagement/systemsetting/sysDepPara/findPage',//科室参数-列表
	sysDepParaupdateQuery: title + 'systemmanagement/systemsetting/sysDepPara/updateQuery',//科室参数-编辑
	sysDepParaupdate: title + 'systemmanagement/systemsetting/sysDepPara/update',//科室参数-编辑保存

	sysServerLogfindPage: title + 'systemmanagement/systemsetting/sysServerLog/findPage',//日志-列表
	sysUserInfoloadDept: title + 'systemmanagement/systemsetting/sysUserInfo/loadDept',//日志-加载科室
	sysUserInfoloadUser: title + 'systemmanagement/systemsetting/sysUserInfo/loadUser',//日志-加载用户
	sysServerLogdelete: title + 'systemmanagement/systemsetting/sysServerLog/delete',//日志-删除

}


var system={
	...sxy,
	...ckq,
}
export default system