import ProtectedPage from '../../components/ProtectedPage.jsx'
import OverviewPage from '../../views/OverviewPage.jsx'

export default function Page() {
  return <ProtectedPage permission="overview.view"><OverviewPage /></ProtectedPage>
}
