import ProtectedPage from '../../../components/ProtectedPage.jsx'
import TasksPage from '../../../views/TasksPage.jsx'

export default function Page() {
  return <ProtectedPage permission="tasks.view"><TasksPage /></ProtectedPage>
}
