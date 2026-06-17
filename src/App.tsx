import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { getAdsRoutePrefix } from './core/routing/adsRoute';
import { CreativeToysWeekConfirmation } from './site/pages/CreativeToysWeekConfirmation';
import { CreativeToysWeekLanding } from './site/pages/CreativeToysWeekLanding';

const siteId = 'PAME_FLORES_CREA';
const siteTitle = 'Pame Flores Crea - Sitio en preparacion';
const adsRoutePrefix = getAdsRoutePrefix();

function PreparationPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ec] text-[#1f252c]">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-[#2f6f73]">
            {siteId}
          </p>
          <h1 className="font-sans text-4xl font-black leading-tight text-[#1f252c] sm:text-6xl">
            Pame Flores Crea
          </h1>
          <p className="mt-5 text-xl font-semibold text-[#d66540] sm:text-2xl">
            Sitio en preparacion
          </p>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#56606a] sm:text-lg">
            Estamos preparando una experiencia clara, cuidada y propia para este dominio.
          </p>
        </div>
      </section>
    </main>
  );
}

function RoutedApp() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'theme-expert');
    document.title = siteTitle;
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<PreparationPage />} />
      <Route path={adsRoutePrefix} element={<PreparationPage />} />
      <Route path="/500-extra" element={<CreativeToysWeekLanding />} />
      <Route path={`${adsRoutePrefix}/500-extra`} element={<CreativeToysWeekLanding />} />
      <Route path="/confirmacion/500-extra" element={<CreativeToysWeekConfirmation />} />
      <Route
        path={`${adsRoutePrefix}/confirmacion/500-extra`}
        element={<CreativeToysWeekConfirmation />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return <RoutedApp />;
}

export default App;
