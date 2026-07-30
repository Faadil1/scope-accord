import { useState } from 'react';
import './App.css';

type SpikeState = 'different_understandings' | 'shared_understanding';
type ContentRatio = '1:1' | '1:3' | '3:1';

const AGREEMENT_ITEMS_BY_RATIO: Record<ContentRatio, string[]> = {
  '1:1': ['COST', 'DATE', 'SCOPE'],
  '1:3': ['COST'],
  '3:1': ['COST', 'DATE', 'SCOPE', 'VENUE'],
};

const PROPOSAL_ITEMS_BY_RATIO: Record<ContentRatio, number> = {
  '1:1': 1,
  '1:3': 4,
  '3:1': 1,
};

function App() {
  const [state, setState] = useState<SpikeState>('different_understandings');
  const [ratio, setRatio] = useState<ContentRatio>('1:1');

  const renderRow = (label: string, value: string, isMonospace: boolean = false) => (
    <div className="impact-row">
      <div className="impact-row-content">
        <label className="impact-label">{label}</label>
        <span className={isMonospace ? 'impact-value-mono' : 'impact-value'}>{value}</span>
      </div>
    </div>
  );

  const agreementContent = (
    <>
      <h3 className="region-heading">CURRENT AGREEMENT</h3>
      <div className="content-section">
        {AGREEMENT_ITEMS_BY_RATIO[ratio].includes('COST') && renderRow('COST', '$10,000', true)}
        {AGREEMENT_ITEMS_BY_RATIO[ratio].includes('DATE') && renderRow('DATE', '14 March', true)}
        {AGREEMENT_ITEMS_BY_RATIO[ratio].includes('SCOPE') && renderRow('SCOPE', 'Core photography, Stage and lighting, Four-hour guest programme', false)}
        {AGREEMENT_ITEMS_BY_RATIO[ratio].includes('VENUE') && renderRow('VENUE', 'Downtown Convention Center', false)}
      </div>
    </>
  );

  const proposalContent = (
    <>
      <h3 className="region-heading">PROPOSED CHANGE</h3>
      <h4 className="proposal-heading">Add photo booth</h4>
      <div style={{ marginBottom: '40px' }}>
        <div className="group-label">EXPECTED IMPACT</div>
        <div className="content-section">
          {renderRow('COST', '+$2,000', true)}
          {renderRow('VENUE ACCESS', '+90 minutes', true)}
          {renderRow('DOCUMENTS AFFECTED', 'Floor-plan revision required', false)}
          {PROPOSAL_ITEMS_BY_RATIO[ratio] >= 2 && renderRow('IMPACT ITEM', 'Additional technical team required', false)}
          {PROPOSAL_ITEMS_BY_RATIO[ratio] >= 3 && renderRow('CAPACITY', '500 per hour', true)}
          {PROPOSAL_ITEMS_BY_RATIO[ratio] >= 4 && renderRow('OVERFLOW 1', 'Extra long proposal content', false)}
        </div>
      </div>
      <div>
        <div className="group-label">UNCERTAINTY</div>
        <div className="content-section">
          {renderRow('VENUE ACCESS STATUS', 'Not yet confirmed', false)}
        </div>
      </div>
    </>
  );

  const showDifferenceTicks = state === 'different_understandings';

  const understandingPair = (
    <div className="understanding-pair" data-testid="understanding-pair">
      <div className="understanding-column" data-testid="provider-understanding">
        <h5 className="understanding-label">PROVIDER UNDERSTANDING</h5>
        {showDifferenceTicks && <div className="difference-tick" />}
        <p className="understanding-text">Additional service with a $2,000 cost and additional venue-access time.</p>
      </div>
      <div className="understanding-divider" />
      <div className="understanding-column" data-testid="client-understanding">
        <h5 className="understanding-label">CLIENT UNDERSTANDING</h5>
        {showDifferenceTicks && <div className="difference-tick" />}
        <p className="understanding-text">
          {state === 'different_understandings'
            ? 'Included in the current event-production package.'
            : 'Additional service with a $2,000 cost and additional venue-access time.'}
        </p>
      </div>
    </div>
  );

  const getStateText = () => {
    if (state === 'different_understandings') {
      return 'UNDERSTANDINGS DIFFER · PROPOSAL REMAINS OUTSIDE THE CURRENT AGREEMENT';
    }
    return 'PROPOSED 14 MAR · SAME UNDERSTANDING EXPRESSED 14 MAR · NOW SHOWN IN THE CURRENT AGREEMENT';
  };

  return (
    <div className="app-container">
      <div className="demo-control">
        <div className="control-label">DEMO CONTROL — NOT PRODUCT UI</div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }}>State:</label>
            <select value={state} onChange={(e) => setState(e.target.value as SpikeState)}>
              <option value="different_understandings">Different Understandings</option>
              <option value="shared_understanding">Shared Understanding</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: '8px', fontWeight: 500 }}>Content Ratio:</label>
            <select value={ratio} onChange={(e) => setRatio(e.target.value as ContentRatio)}>
              <option value="1:1">1:1</option>
              <option value="1:3">1:3</option>
              <option value="3:1">3:1</option>
            </select>
          </div>
        </div>
      </div>

      <div className="state-line" aria-live="polite" role="status">
        <span className="state-tick" />
        {getStateText()}
      </div>

      {state === 'different_understandings' && (
        <div className="composition" data-testid="state-different_understandings">
          <section className="agreement-section" data-testid="agreement-section">
            {agreementContent}
          </section>
          <div className="agreement-boundary" data-testid="agreement-boundary" />
          <section className="proposal-band" data-testid="proposal-band">
            {proposalContent}
            {understandingPair}
          </section>
        </div>
      )}

      {state === 'shared_understanding' && (
        <div className="agreement-shell" data-testid="agreement-shell">
          <section className="existing-agreement" data-testid="existing-agreement">
            {agreementContent}
          </section>
          <section className="shared-proposal-block" data-testid="shared-proposal-block">
            <div className="provenance-line">PROPOSED 14 MAR · SAME UNDERSTANDING EXPRESSED 14 MAR · NOW SHOWN IN THE CURRENT AGREEMENT</div>
            {proposalContent}
            {understandingPair}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
