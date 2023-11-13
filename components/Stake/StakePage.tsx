import React, { useState } from 'react';
import LpStakeTabMenu from './LpStakeTabMenu';
import NewStakeComponent from './NewStakeComponent';

function StakePage() {
  const [_token, set_token] = useState<number>(0);

  return (
    <div>
      <LpStakeTabMenu _token={_token} setToken={set_token} />
      <NewStakeComponent _token={_token} />
    </div>
  );
}

export default StakePage;
