import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';
import { JsonValidator } from './tools/JsonValidator';
import { CodeBeautifierMinifier } from './tools/CodeBeautifierMinifier';
import { CronJobGenerator } from './tools/CronJobGenerator';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { Base64Converter } from './tools/Base64Converter';
import { CapacityPlanning } from './tools/CapacityPlanning';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/json-validator" element={<JsonValidator />} />
          <Route path="/tools/code-beautifier-minifier" element={<CodeBeautifierMinifier />} />
          <Route path="/tools/cron-job-generator" element={<CronJobGenerator />} />
          <Route path="/tools/password-generator" element={<PasswordGenerator />} />
          <Route path="/tools/base64-converter" element={<Base64Converter />} />
          <Route path="/tools/capacity-planning" element={<CapacityPlanning />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App