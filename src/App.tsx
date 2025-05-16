import Navbar from './components/navbar/Navbar'
import SectionHeaderController from './components/section-header/SectionHeaderController'
import StoryList from './components/story/StoryList'
import CommentList from './components/comments/CommentList'
import ThreadHeaderController from './components/thread/ThreadHeaderController'

export default function App() {
  return (
    <div>
      <div className="">
        <Navbar />
        {/* <SectionHeaderController pageType="New" /> */}
        <ThreadHeaderController />
        <CommentList />
      </div>
    </div>
  )
}
