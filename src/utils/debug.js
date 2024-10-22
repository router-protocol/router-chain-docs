import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const logPageInfo = () => {
    console.log('Version: v1')
    console.log('Current pathname:', window.location.pathname);
    console.log('Full URL:', window.location.href);
    console.log('Canonical URL:', document.querySelector('link[rel="canonical"]')?.href);
  };

  // Log on initial page load
  logPageInfo();

  // Log on route changes
  window.addEventListener('popstate', logPageInfo);

  // For single-page navigation
  const pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(history, arguments);
    logPageInfo();
  };
}