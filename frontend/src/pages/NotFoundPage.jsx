import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Bharat AI Olympiad</title>
      </Helmet>
      
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F5F5F5] text-center px-4">
        <div>
          <h1 className="text-8xl md:text-9xl font-black text-[#001F5E] opacity-20 font-display mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn-primary px-8">
            Go to Homepage
          </Link>
        </div>
      </div>
    </>
  )
}
