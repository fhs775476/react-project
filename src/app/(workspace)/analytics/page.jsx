import ProtectedPage from '../../../components/ProtectedPage.jsx'
import AnalyticsPage from '../../../views/AnalyticsPage.jsx'

export default function Page() {
  return <ProtectedPage permission="analytics.view"><AnalyticsPage /></ProtectedPage>
}
