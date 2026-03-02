import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        title: 'Nara Chain Validator Explorer',
        subtitle: 'Monitor validators, commission, and stake health in real time.',
        searchPlaceholder: 'Search by name or vote address',
        statusFilter: 'Status filter',
        all: 'All',
        active: 'Active',
        delinquent: 'Delinquent',
        commission: 'Commission',
        epochCredits: 'Epoch credits',
        lastVote: 'Last vote',
        activatedStake: 'Activated stake',
        skipRate: 'Skip rate',
        totalActive: 'Total active',
        totalDelinquent: 'Delinquent',
        averageCommission: 'Avg. commission',
        refresh: 'Refresh',
        rpcEndpoint: 'RPC endpoint',
        apply: 'Apply',
        language: 'Language',
        loading: 'Loading validators…',
        empty: 'No validators match the filters.',
        connectionError: 'Unable to load validators. Please check the RPC endpoint.',
        delinquentLabel: 'Delinquent',
        votePubkey: 'Vote address',
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
        subtitle: '实时监控验证者、佣金与质押健康状况。',
        searchPlaceholder: '按名称或投票地址搜索',
        statusFilter: '状态筛选',
        all: '全部',
        active: '活跃',
        delinquent: '离线',
        commission: '佣金',
        epochCredits: '历元积分',
        lastVote: '最新投票',
        activatedStake: '有效质押',
        skipRate: '跳过率',
        totalActive: '活跃节点',
        totalDelinquent: '离线节点',
        averageCommission: '平均佣金',
        refresh: '刷新',
        rpcEndpoint: 'RPC 端点',
        apply: '应用',
        language: '语言',
        loading: '正在加载验证者…',
        empty: '没有符合筛选条件的验证者。',
        connectionError: '加载失败，请检查 RPC 端点。',
        delinquentLabel: '离线',
        votePubkey: '投票地址',
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
