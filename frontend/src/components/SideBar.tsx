import { House, ListChecks } from 'lucide-react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <nav id="nav-sidebar" className="w-72 bg-white border-r border-gray-200">
      <ul>
        <Link id="link-house" to="/">
          <li className="hover:bg-emerald-400 hover:text-white p-6 cursor-pointer flex items-center">
            <House />
            <span className="ml-4">Home</span>
          </li>
        </Link>
        <Link id="link-analyses" to="/analyses">
          <li className="hover:bg-emerald-400 hover:text-white p-6 cursor-pointer flex items-center">
            <ListChecks />
            <span className="ml-4">View Past Analyses</span>
          </li>
        </Link>
      </ul>
    </nav>
  )
}

export default Sidebar
