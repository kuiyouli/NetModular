import NetModularUI from 'netmodular-ui'
import './api'
import module from './module'
import routes from './routes'
import store from './store'
import components from './components'
import NetmodularSkinsClassics from 'netmodular-skins-classics'

const admin = {
  module,
  routes,
  store,
  components
}

// 模块列表
let modules = [admin]

/**
 * @description 获取系统信息
 */
const getSystem = async () => {
  // 获取系统配置信息
  const config = await $api.admin.system.getConfig()

  let system = { config }
  // 模块列表
  system.modules = modules
  system.actions = {
    /** 登录 */
    login: $api.admin.account.login,
    /** 获取验证码 */
    getVerifyCode: $api.admin.account.getVerifyCode,
    // 查询登陆信息方法
    getLoginInfo: $api.admin.account.getLoginInfo,
    // 修改密码方法
    updatePassword: $api.admin.account.updatePassword,
    // 皮肤修改方法
    saveSkin: $api.admin.account.skinUpdate
  }
  return system
}

export default {
  /**
   * @description 注册模块
   * @param {Object} moduleInfo 模块信息
   */
  registerModule(moduleInfo) {
    if (moduleInfo) {
      modules.push(moduleInfo)
    }
  },
  /**
   * @description 注册皮肤
   * @param {object} skin 皮肤
   */
  registerSkin(skin) {
    NetModularUI.useSkin(skin)
  },
  /**
   * @description 启动
   */
  async start(config) {
    // 设置接口信息
    NetModularUI.configApi(config)
    // 使用皮肤
    NetModularUI.registerSkin(NetmodularSkinsClassics)

    // 查询系统信息
    const system = await getSystem()

    // 设置账户类型
    if (config.accountTypes) {
      system.config.login.accountTypes = config.accountTypes
    }

    window.loaded = true
    const t = setInterval(() => {
      if (window.loadProgress > 98) {
        clearInterval(t)
        NetModularUI.use({ system })
      }
    }, 20)
  }
}
