import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'Nara Chain Validator Explorer',
        pageLabel: 'Network',
        pageTitle: 'Validators.',
        subtitle: 'Every node running on Nara devnet — tracked in real time.',
        searchPlaceholder: 'Search by name or vote address',
        statusFilter: 'Status filter',
        all: 'All',
        active: 'Active',
        delinquent: 'Delinquent',
        commission: 'Commission',
        epochCredits: 'Epoch credits',
        lastVote: 'Last vote',
        activatedStake: 'Stake',
        skipRate: 'Skip rate',
        totalActive: 'Active',
        totalDelinquent: 'Delinquent',
        averageCommission: 'Avg Commission',
        refresh: 'Refresh',
        rpcEndpoint: 'RPC endpoint',
        apply: 'Apply',
        language: 'Language',
        loading: 'Loading validators…',
        empty: 'No validators found.',
        connectionError: 'Unable to connect. Check the RPC endpoint or try again.',
        delinquentLabel: 'Delinquent',
        votePubkey: 'Vote address',
        validatorList: 'Validators',
        cookiesTitle: 'Cookies & Data',
        cookiesDesc: 'We use cookies to improve your experience. By continuing, you agree to our use of cookies.',
        accept: 'Accept',
        reject: 'Reject',
        copyright: 'All rights reserved.'
      }
    },
    zh: {
      translation: {
        title: 'Nara Chain 验证者浏览器',
        pageLabel: '网络',
        pageTitle: '验证者。',
        subtitle: 'Nara 开发网上每一个节点，实时追踪。',
        searchPlaceholder: '按名称或投票地址搜索',
        statusFilter: '状态筛选',
        all: '全部',
        active: '活跃',
        delinquent: '离线',
        commission: '佣金',
        epochCredits: '历元积分',
        lastVote: '最新投票',
        activatedStake: '质押',
        skipRate: '跳过率',
        totalActive: '活跃',
        totalDelinquent: '离线',
        averageCommission: '平均佣金',
        refresh: '刷新',
        rpcEndpoint: 'RPC 端点',
        apply: '应用',
        language: '语言',
        loading: '正在加载验证者…',
        empty: '暂无验证者数据。',
        connectionError: '无法连接，请检查 RPC 端点或重试。',
        delinquentLabel: '离线',
        votePubkey: '投票地址',
        validatorList: '验证者列表',
        cookiesTitle: 'Cookies 及数据',
        cookiesDesc: '我们使用 Cookies 改善体验，继续使用即表示同意。',
        accept: '接受',
        reject: '拒绝',
        copyright: '版权所有。'
      }
    }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
