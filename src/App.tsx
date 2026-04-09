import { useEffect, useMemo, useRef, useState } from 'react';
import { Connection, LAMPORTS_PER_SOL, VoteAccountInfo } from '@solana/web3.js';
import { useTranslation } from 'react-i18next';

/** Animated count-up number */
function AnimatedNumber({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const duration = 800;
    const t0 = performance.now();
    let raf: number;
    const step = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const cur = start + diff * ease;
      setDisplay(cur);
      if (p < 1) { raf = requestAnimationFrame(step); }
      else { ref.current = value; }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString();
  return <>{formatted}{suffix}</>;
}

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
  import.meta.env.VITE_RPC_ENDPOINT || 'https://mainnet-api.nara.build/';

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
    <>
      <nav className="nav">
        <a className="nav-logo" href="https://nara.build">
          <img src="/favicon.png" alt="NARA" style={{ width: 20, height: 20 }} />
          <span>NARA</span>
        </a>
        <div className="nav-right">
          <a href="https://x.com/NaraBuildAI" target="_blank" rel="noopener noreferrer" className="nav-social" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="https://discord.gg/aeNMBjkWsh" target="_blank" rel="noopener noreferrer" className="nav-social" aria-label="Discord">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
          </a>
          <a href="https://t.me/narabuild" target="_blank" rel="noopener noreferrer" className="nav-social" aria-label="Telegram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
          </a>
          <a href="https://github.com/nara-chain" target="_blank" rel="noopener noreferrer" className="nav-social" aria-label="GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://explorer.nara.build/" target="_blank" rel="noopener noreferrer" className="nav-mainnet">
            <span className="dot" />
            <span>Devnet</span>
          </a>
        </div>
      </nav>

      <div className="container">
        <div className="page-label">{t('pageLabel')}</div>
        <h1 className="page-title">{t('pageTitle')}</h1>
        <p className="page-sub">{t('subtitle')}</p>

      <div className="summary-grid">
        <div className="stat-card">
          <h3>{t('totalActive')}</h3>
          <div className="stat-value"><AnimatedNumber value={stats.activeCount} /></div>
        </div>
        <div className="stat-card">
          <h3>{t('totalDelinquent')}</h3>
          <div className="stat-value"><AnimatedNumber value={stats.delinquentCount} /></div>
        </div>
        <div className="stat-card">
          <h3>{t('averageCommission')}</h3>
          <div className="stat-value"><AnimatedNumber value={stats.averageCommission} decimals={1} suffix="%" /></div>
        </div>
        <div className="stat-card">
          <h3>{t('activatedStake')}</h3>
          <div className="stat-value"><AnimatedNumber value={stats.totalStake / LAMPORTS_PER_SOL} /> NARA</div>
        </div>
      </div>

      {loading && (
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="spinner" aria-label="loading" />
        </div>
      )}
      {error && (
        <div className="status-bar" style={{ marginTop: 12 }}>
          <span className="error-msg">{error}</span>
        </div>
      )}

      <section className="panel">
        <h2>{t('validatorList')}</h2>
        {loading && <p>{t('loading')}</p>}
        {!loading && filteredValidators.length === 0 && <p>{t('empty')}</p>}
        <div className="validator-list">
          {filteredValidators.map((v, i) => {
            const stakePercent = stats.totalStake > 0
              ? (v.activatedStake / stats.totalStake) * 100
              : 0;
            return (
              <article className={`validator-card${v.delinquent ? ' delinquent' : ''}`} key={v.votePubkey}>
                <div className="validator-header">
                  <span className="validator-rank">#{i + 1}</span>
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
                <div className="stake-bar">
                  <div className="stake-bar-fill" style={{ width: `${stakePercent}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          <a href="https://nara.build" target="_blank" rel="noopener noreferrer">Home</a>
          <a href="https://explorer.nara.build" target="_blank" rel="noopener noreferrer">Explorer</a>
          <a href="https://docs.nara.build" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://github.com/nara-chain" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} Nara Network Foundation</span>
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
    </>
  );
}

export default App;
