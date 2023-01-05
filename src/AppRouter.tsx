import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import { SendPage, StakePage, BridgePage, NamePage } from 'pages';
import { CalamariBasePage, DolphinBasePage } from 'pages/BasePage';

const DolphinRoutes = () => {
  return (
    <DolphinBasePage>
      <Routes>
        <Route path="dolphin">
          <Route index element={<Navigate to="bridge" />} />
          <Route path="bridge" element={<BridgePage />} />
          <Route path="transact" element={<SendPage />} />
          <Route path="mns">
            <Route index path="" element={<NamePage />} />
            <Route path=":name" element={<NamePage />} />
          </Route>
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
      <Route path="/mns" element={<Navigate to="/dolphin/mns" replace />} />
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
