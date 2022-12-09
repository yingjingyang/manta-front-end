// @ts-nocheck
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { SendPage, StakePage, NftPage } from 'pages';

function MainApp() {
  return (
    <div className="main-app bg-primary">
      <div className="flex flex-col m-auto">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/calamari/stake" replace />}
            exact
          />
          <Route
            path="/transact"
            element={<Navigate to="/dolphin/transact" replace />}
            exact
          />
          <Route
            path="/stake"
            element={<Navigate to="/calamari/stake" replace />}
            exact
          />
          <Route
            path="/dolphin"
            element={<Navigate to="/dolphin/transact" replace />}
            exact
          />
          <Route
            path="/calamari"
            element={<Navigate to="/calamari/stake" replace />}
            exact
          />
          <Route
            path="/nft"
            element={<Navigate to="/dolphin/nft/" replace />}
            exact
          />
          <Route path="/dolphin/transact" element={<SendPage />} exact />
          <Route path="/calamari/stake" element={<StakePage />} exact />
          <Route path="/dolphin/nft" element={<NftPage />} exact />
        </Routes>
      </div>
    </div>
  );
}

export default MainApp;
