import { Routes, Route } from 'react-router'
import WikiLayout from '@/components/WikiLayout'
import MainPage from '@/pages/MainPage'
import ArticlePage from '@/pages/ArticlePage'
import IndexPage from '@/pages/IndexPage'
import AboutPage from '@/pages/AboutPage'
import EditorPage from '@/pages/EditorPage'
import { ContributionsListPage, ContributionDetailPage } from '@/pages/ContributionsPage'
import AdminPage from '@/pages/AdminPage'
import { CategoryListPage, CategoryPage, SearchPage } from '@/pages/CategoryPages'

export default function App() {
  return (
    <WikiLayout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/wiki/:slug" element={<ArticlePage />} />
        <Route path="/index" element={<IndexPage />} />
        <Route path="/categories" element={<CategoryListPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/edit" element={<EditorPage />} />
        <Route path="/contributions" element={<ContributionsListPage />} />
        <Route path="/contributions/:id" element={<ContributionDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<MainPage />} />
      </Routes>
    </WikiLayout>
  )
}
