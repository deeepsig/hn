import Navbar from './components/navbar/Navbar'
import OtherSectionHeader from './components/section-header/OtherSectionHeader'

export default function App() {
  return (
    <div>
      <div className="">
        <Navbar />
        <OtherSectionHeader pageType="New" />
      </div>
    </div>
  )
}
