import Navbar from './components/navbar/Navbar'
import OtherSectionHeader from './components/section-header/OtherSectionHeader'
import TopSectionHeader from './components/section-header/TopSectionHeader'

export default function App() {
  return (
    <div>
      <div className="">
        <Navbar />
        {/* <OtherSectionHeader pageType="New" /> */}
        <TopSectionHeader />
      </div>
    </div>
  )
}
