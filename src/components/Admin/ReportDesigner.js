import { Designer } from '@mescius/activereportsjs-react';
import '@mescius/activereportsjs/styles/ar-js-ui.css';
import '@mescius/activereportsjs/styles/ar-js-designer.css';

export default function ReportDesigner() {
  const reportUri = '/orders.rdlx-json'; // saved in pages or public

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Designer report={{ id: reportUri }} />
    </div>
  );
}
