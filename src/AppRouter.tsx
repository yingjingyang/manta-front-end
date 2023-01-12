import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { SendPage, StakePage, BridgePage, SBTPage } from 'pages';
import { CalamariBasePage, DolphinBasePage } from 'pages/BasePage';

const DolphinRoutes = () => {
  return (
    <DolphinBasePage>
      <Routes>
        <Route path="dolphin">
          <Route index element={<Navigate to="bridge" />} />
          <Route path="bridge" element={<BridgePage />} />
          <Route path="transact" element={<SendPage />} />
          <Route path="sbt" element={<SBTPage />} />
        </Route>
      </Routes>
    </DolphinBasePage>
  );
};

const CalamariRoutes = () => {
  return (
    <CalamariBasePage>
      <Routes>
        <Route path="calamari">
          <Route index element={<Navigate to="stake" />} />
          <Route path="stake" element={<StakePage />} />
        </Route>
      </Routes>
    </CalamariBasePage>
  );
};

const RedirectRoutes = () => {
  return (
    <Routes>
      <Route index element={<Navigate to="/calamari/stake" replace />} />
      <Route
        path="/transact"
        element={<Navigate to="/dolphin/transact" replace />}
      />
      <Route
        path="/bridge"
        element={<Navigate to="/dolphin/bridge" replace />}
      />
      <Route
        path="/stake"
        element={<Navigate to="/calamari/stake" replace />}
      />
      <Route path="/sbt" element={<Navigate to="/dolphin/sbt" replace />} />
    </Routes>
  );
};

const AppRouter = () => {
  return (
    <Router>
      <RedirectRoutes />
      <CalamariRoutes />
      <DolphinRoutes />
    </Router>
  );
};

export default AppRouter;
