import { render, screen } from '@testing-library/react'
import StudyGroupsPage from './components/study/StudyGroupsPage.tsx'

test('renders learn react link', () => {
  render(<StudyGroupsPage />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
