import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LandingLayout from './components/layout/LandingLayout';
import ErrorBoundary from './components/layout/ErrorBoundary';

// Lazy-loaded routes
const Landing = lazy(() => import('./features/core/pages/Landing'));
const Home = lazy(() => import('./features/core/pages/Home'));
const AnalysisDashboard = lazy(() => import('./features/analysis/pages/AnalysisDashboard'));
const DefenseChainPage = lazy(() => import('./features/core/pages/DefenseChainPage'));
const InvestigationWorkbench = lazy(() => import('./features/investigate/pages/InvestigationWorkbench'));
const PlaybooksPage = lazy(() => import('./features/playbooks/pages/PlaybooksPage'));
const MitreExplorer = lazy(() => import('./features/mitre/pages/MitreExplorer'));
const IncidentReports = lazy(() => import('./features/reports/pages/IncidentReports'));
const TacticsExplorer = lazy(() => import('./features/knowledge-base/pages/TacticsExplorer'));
const DocsHub = lazy(() => import('./features/docs/pages/DocsHub'));
const PlatformStatus = lazy(() => import('./features/status/pages/PlatformStatus'));

// A simple loading spinner fallback for Suspense
function RouteLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingLayout />}>
              <Route index element={<Landing />} />
            </Route>

            {/* Protected App Dashboard */}
            <Route path="/app" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="analysis" element={<AnalysisDashboard />} />
              <Route path="defense-chain" element={<DefenseChainPage />} />
              <Route path="investigation" element={<InvestigationWorkbench />} />
              <Route path="playbooks" element={<PlaybooksPage />} />
              <Route path="mitre" element={<MitreExplorer />} />
              <Route path="report" element={<IncidentReports />} />
              <Route path="tactics" element={<TacticsExplorer />} />
              <Route path="docs/*" element={<DocsHub />} />
              <Route path="status" element={<PlatformStatus />} />
            </Route>

            {/* Catch-all to redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
