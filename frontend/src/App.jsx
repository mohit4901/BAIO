import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import MainLayout from './layouts/MainLayout'
import PageLoader from './components/ui/PageLoader'
import useAuthStore from './store/authStore'

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const OlympiadsPage = lazy(() => import('./pages/OlympiadsPage'))
const OlympiadDetailPage = lazy(() => import('./pages/OlympiadDetailPage'))
const StudentRegisterPage = lazy(() => import('./pages/StudentRegisterPage'))
const SchoolRegisterPage = lazy(() => import('./pages/SchoolRegisterPage'))
const StudentLoginPage = lazy(() => import('./pages/StudentLoginPage'))
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage'))
const ResultSearchPage = lazy(() => import('./pages/ResultSearchPage'))
const AnnouncementsPage = lazy(() => import('./pages/AnnouncementsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { student } = useAuthStore()
  if (!student) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="olympiads" element={<OlympiadsPage />} />
          <Route path="olympiads/:slug" element={<OlympiadDetailPage />} />
          <Route path="register" element={<StudentRegisterPage />} />
          <Route path="school-register" element={<SchoolRegisterPage />} />
          <Route path="login" element={<StudentLoginPage />} />
          <Route path="results" element={<ResultSearchPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={<ResetPasswordPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
