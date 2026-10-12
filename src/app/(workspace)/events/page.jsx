import ProtectedPage from '../../../components/ProtectedPage.jsx'
import EventsPage from '../../../views/EventsPage.jsx'

export default function Page() {
  return <ProtectedPage permission="events.view"><EventsPage /></ProtectedPage>
}
