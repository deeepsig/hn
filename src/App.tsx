import Navbar from './components/navbar/Navbar'
import SectionHeaderController from './components/section-header/SectionHeaderController'

export default function App() {
  return (
    <div>
      <div className="">
        <Navbar />
        <SectionHeaderController pageType="Top" />
      </div>
    </div>
  )
}
