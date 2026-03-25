/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EditalVertical from './components/EditalVertical';
import Performance from './components/Performance';
import StudyCycle from './components/StudyCycle';
import MockTests from './components/MockTests';
import Settings from './components/Settings';
import Support from './components/Support';
import { View } from './types';
import { StudyProvider } from './StudyContext';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'edital':
        return <EditalVertical />;
      case 'performance':
        return <Performance />;
      case 'cycle':
        return <StudyCycle />;
      case 'mock-tests':
        return <MockTests />;
      case 'settings':
        return <Settings />;
      case 'support':
        return <Support />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <StudyProvider>
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderView()}
      </Layout>
    </StudyProvider>
  );
}
