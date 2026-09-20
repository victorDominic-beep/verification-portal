import { useState } from 'react';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import VerifyCandidate from './pages/VerifyCandidate';
import VerificationLogs from './pages/VerificationLogs';
import PendingRequests from './pages/PendingRequests';
import ProcessRequest from './pages/ProcessRequest';
import WalletBalance from './pages/WalletBalance';
import ProfileSecurity from './pages/ProfileSecurity';
import BrandingAPI from './pages/BrandingAPI';
import StaffDirectory from './pages/StaffDirectory';
import ConfigureServices from './pages/ConfigureServices';
import ServiceConfigEditor from './pages/ServiceConfigEditor';
import type { ServiceConfigData } from './types/service';
import type { RequestRecord } from './types/request';

const pageTitles: Record<string, string> = {
  dashboard:            'Dashboard',
  'verify-candidate':   'O-Level Verifications',
  'verification-logs':  'Verification Logs',
  'pending-requests':   'Verification Requests',
  'my-jobs':            'Verification Requests',
  'completed-requests': 'Verification Requests',
  'process-request':    'Request Details',
  wallet:               'Wallet & Balance',
  'settings-admin':     'Settings Admin',
  branding:             'Branding & API',
  'staff-directory':    'Staff Directory',
  'configure-services':    'Configure Services',
  'service-config-editor': 'Configure Services',
  profile:                 'Profile & Security',
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(null);
  const [previousPage, setPreviousPage] = useState('pending-requests');
  const [selectedService, setSelectedService] = useState<ServiceConfigData | null>(null);

  const handleNavigate = (page: string) => {
    if (page === 'signout') return;
    setActivePage(page);
  };

  const handleProcess = (request: RequestRecord) => {
    setPreviousPage(activePage);
    setSelectedRequest(request);
    setActivePage('process-request');
  };

  const handleBackFromProcess = () => {
    setSelectedRequest(null);
    setActivePage(previousPage);
  };

  const handleEditConfig = (service: ServiceConfigData) => {
    setSelectedService(service);
    setActivePage('service-config-editor');
  };

  const handleBackFromConfig = () => {
    setSelectedService(null);
    setActivePage('configure-services');
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'verify-candidate':
        return <VerifyCandidate onNavigate={handleNavigate} />;
      case 'verification-logs':
        return <VerificationLogs onNavigate={handleNavigate} />;
      case 'pending-requests':
      case 'my-jobs':
      case 'completed-requests':
        return <PendingRequests onNavigate={handleNavigate} onProcess={handleProcess} />;
      case 'wallet':
        return <WalletBalance onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileSecurity onNavigate={handleNavigate} />;
      case 'branding':
        return <BrandingAPI onNavigate={handleNavigate} />;
      case 'staff-directory':
        return <StaffDirectory onNavigate={handleNavigate} />;
      case 'configure-services':
        return <ConfigureServices onNavigate={handleNavigate} onEditConfig={handleEditConfig} />;
      case 'service-config-editor':
        return selectedService
          ? <ServiceConfigEditor service={selectedService} onBack={handleBackFromConfig} />
          : null;
      case 'process-request':
        return selectedRequest
          ? <ProcessRequest request={selectedRequest} onBack={handleBackFromProcess} />
          : null;
      default:
        return (
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <div className="w-16 h-16 rounded-full bg-[#eeeef7] flex items-center justify-center">
              <span className="text-2xl text-[#62646a]">⚙</span>
            </div>
            <p className="text-[20px] font-bold font-['Urbanist',sans-serif] text-[#4d4f54]">
              {pageTitles[activePage] || activePage}
            </p>
            <p className="text-[15px] font-normal font-['Inter',sans-serif] text-[#62646a]">
              This section is coming soon.
            </p>
            <button
              onClick={() => setActivePage('dashboard')}
              className="mt-2 px-6 py-3 rounded-xl bg-[#ff5533] text-white text-[15px] font-semibold font-['Inter',sans-serif] hover:bg-[#e64d2e] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <Layout
      activePage={activePage}
      pageTitle={pageTitles[activePage] || 'Dashboard'}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </Layout>
  );
}
