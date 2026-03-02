import { useEffect, useMemo, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL, VoteAccountInfo } from '@solana/web3.js';
import { useTranslation } from 'react-i18next';

interface ValidatorEntry {
  votePubkey: string;
  nodePubkey: string;
  commission: number;
  epochCredits: number;
  lastVote: number;
  activatedStake: number;
  delinquent: boolean;
}

const formatNumber = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 0 });

const formatStake = (lamports: number) =>
  (lamports / LAMPORTS_PER_SOL).toLocaleString(undefined, {
    maximumFractionDigits: 0
  });

const defaultEndpoint =
  import.meta.env.VITE_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

function mapAccount(account: VoteAccountInfo, delinquent: boolean): ValidatorEntry {
  let latestCredits = 0;
  if (Array.isArray(account.epochCredits) && account.epochCredits.length) {
    const last = account.epochCredits[account.epochCredits.length - 1] as
      | number
      | number[];
    if (Array.isArray(last)) {
      latestCredits = last[1] ?? last[0] ?? 0;
    } else if (typeof last === 'number') {
      latestCredits = last;
    }
  }

  return {
    votePubkey: account.votePubkey,
    nodePubkey: account.nodePubkey,
    commission: account.commission,
    epochCredits: latestCredits,
    lastVote: account.lastVote,
    activatedStake: account.activatedStake,
    delinquent
  };
}

function App() {
  const { t, i18n } = useTranslation();
  const [rpcEndpoint] = useState(defaultEndpoint);
  const [validators, setValidators] = useState<ValidatorEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCookies, setShowCookies] = useState(false);

  const loadValidators = async (endpoint: string) => {
    setLoading(true);
    setError('');
    try {
      const connection = new Connection(endpoint, 'confirmed');
      const voteAccounts = await connection.getVoteAccounts();

      const mapped: ValidatorEntry[] = [
        ...voteAccounts.current.map((v) => mapAccount(v, false)),
        ...voteAccounts.delinquent.map((v) => mapAccount(v, true))
      ];

      setValidators(mapped);
    } catch (err) {
      console.error(err);
      setError(t('connectionError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadValidators(rpcEndpoint);
  }, [rpcEndpoint]);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent !== 'accepted') {
      setShowCookies(true);
    }
  }, []);

  const filteredValidators = useMemo(
    () => [...validators].sort((a, b) => b.activatedStake - a.activatedStake),
    [validators]
  );

  const stats = useMemo(() => {
    const activeCount = validators.filter((v) => !v.delinquent).length;
    const delinquentCount = validators.length - activeCount;
    const averageCommission = validators.length
      ? validators.reduce((sum, v) => sum + v.commission, 0) / validators.length
      : 0;

    const totalStake = validators.reduce((sum, v) => sum + v.activatedStake, 0);

    return {
      activeCount,
      delinquentCount,
      averageCommission,
      totalStake
    };
  }, [validators]);

  const handleLanguage = (next: 'en' | 'zh') => {
    i18n.changeLanguage(next);
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowCookies(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowCookies(false);
  };

  return (
    <div className="app-shell">
      <header className="header">
        <div className="branding">
          <div className="logo-mark">
            <img src="/favicon.png" className="logo-img" alt="logo" />
          </div>
          <div>
            <h1>{t('title')}</h1>
          </div>
        </div>
        <div className="controls">
          <div className="language-toggle">
            <span>{t('language')}:</span>
            <button
              className={`button ${i18n.language.startsWith('en') ? 'active' : ''}`}
              onClick={() => handleLanguage('en')}
            >
              EN
            </button>
            <button
              className={`button ${i18n.language.startsWith('zh') ? 'active' : ''}`}
              onClick={() => handleLanguage('zh')}
            >
              中文
            </button>
          </div>
          <button className="pill" onClick={() => loadValidators(rpcEndpoint)}>
            {loading ? t('loading') : t('refresh')}
          </button>
        </div>
      </header>

      <section className="panel">
        <div className="summary-grid">
          <div className="stat-card">
            <h3>{t('totalActive')}</h3>
            <div className="stat-value">{formatNumber(stats.activeCount)}</div>
          </div>
          <div className="stat-card">
            <h3>{t('totalDelinquent')}</h3>
            <div className="stat-value">{formatNumber(stats.delinquentCount)}</div>
          </div>
          <div className="stat-card">
            <h3>{t('averageCommission')}</h3>
            <div className="stat-value">{stats.averageCommission.toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <h3>{t('activatedStake')}</h3>
            <div className="stat-value">{formatStake(stats.totalStake)} NARA</div>
          </div>
        </div>
        <div className="status-bar" style={{ marginTop: 12 }}>
          {loading && <span className="spinner" aria-label="loading" />}
          {error && <span style={{ color: '#b91c1c' }}>{error}</span>}
        </div>
      </section>

      <section className="panel" style={{ marginTop: 16 }}>
        <h2>{t('title')}</h2>
        {loading && <p>{t('loading')}</p>}
        {!loading && filteredValidators.length === 0 && <p>{t('empty')}</p>}
        <div className="validator-list">
          {filteredValidators.map((v) => (
            <article className="validator-card" key={v.votePubkey}>
              <div className="validator-header">
                <div className="validator-info">
                  <p className="validator-name">{v.nodePubkey}</p>
                  <p className="validator-meta">
                    {t('votePubkey')}: {v.votePubkey}
                  </p>
                </div>
                <span
                  className={`status-dot ${v.delinquent ? 'delinquent' : 'active'}`}
                  title={v.delinquent ? t('delinquentLabel') : t('active')}
                  aria-label={v.delinquent ? t('delinquentLabel') : t('active')}
                />
              </div>
              <div className="metrics">
                <div className="metric">
                  <div className="metric-label">{t('commission')}</div>
                  <div className="metric-value">{v.commission}%</div>
                </div>
                <div className="metric">
                  <div className="metric-label">{t('epochCredits')}</div>
                  <div className="metric-value">{formatNumber(v.epochCredits)}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">{t('lastVote')}</div>
                  <div className="metric-value">{formatNumber(v.lastVote)}</div>
                </div>
                <div className="metric">
                  <div className="metric-label">{t('activatedStake')}</div>
                  <div className="metric-value">{formatStake(v.activatedStake)} NARA</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© {new Date().getFullYear()} validators.narachain.org · {t('copyright')}</span>
      </footer>

      {showCookies && (
        <div className="cookie-toast" role="region" aria-label={t('cookiesTitle')}>
          <div className="cookie-modal">
            <h3>{t('cookiesTitle')}</h3>
            <p>{t('cookiesDesc')}</p>
            <div className="cookie-actions">
              <button className="button ghost" onClick={handleRejectCookies}>
                {t('reject')}
              </button>
              <button className="pill" onClick={handleAcceptCookies}>
                {t('accept')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
