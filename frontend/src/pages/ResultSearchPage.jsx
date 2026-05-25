import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FiSearch, FiAward, FiDownload } from 'react-icons/fi'
import api from '../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ResultSearchPage() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resultData, setResultData] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setIsLoading(true)
      const isEmail = query.includes('@')
      const payload = isEmail ? { email: query } : { rollNumber: query }
      
      const res = await api.get('/results/search', { params: payload })
      setResultData(res.data.data)
    } catch (error) {
      setResultData(null)
      toast.error(error.response?.data?.message || 'Result not found')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Check Results | Bharat AI Olympiad</title>
        <meta name="description" content="Check your Bharat AI Olympiad results using your roll number or email address." />
      </Helmet>

      <div className="min-h-screen pt-24 pb-20 bg-[#F5F5F5]">
        <div className="container-custom max-w-4xl mx-auto">
          
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-[#001F5E] font-display mb-4">Check Your Result</h1>
            <p className="text-gray-600 text-lg">Enter your Roll Number or Registered Email ID to view your olympiad results.</p>
          </div>

          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Roll Number or Email..."
                className="w-full pl-6 pr-32 py-5 rounded-full border-2 border-white shadow-xl text-lg outline-none focus:border-[#001F5E] transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-[#FF8C00] to-[#FFA333] text-white px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                {isLoading ? 'Searching...' : <><FiSearch /> Search</>}
              </button>
            </div>
          </form>

          {resultData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Student Info Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
                <div className="w-24 h-24 rounded-2xl gradient-navy flex items-center justify-center flex-shrink-0 text-white shadow-lg">
                  <FiAward size={40} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-[#001F5E] mb-2">{resultData.student.fullName}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div><span className="text-gray-400 block mb-1">Roll No</span><span className="font-bold text-gray-800">{resultData.student.rollNumber}</span></div>
                    <div><span className="text-gray-400 block mb-1">Class</span><span className="font-bold text-gray-800">{resultData.student.class}</span></div>
                    <div><span className="text-gray-400 block mb-1">School</span><span className="font-bold text-gray-800">{resultData.student.schoolName}</span></div>
                    <div><span className="text-gray-400 block mb-1">State</span><span className="font-bold text-gray-800">{resultData.student.state}</span></div>
                  </div>
                </div>
              </div>

              {/* Results List */}
              <h3 className="text-xl font-bold text-[#001F5E] px-2 pt-4">Published Results</h3>
              
              {resultData.results.map((result) => (
                <div key={result._id} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-6 mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-1">{result.olympiad.title}</h4>
                      <p className="text-sm text-gray-500">Exam Date: {new Date(result.olympiad.examDate).toLocaleDateString()}</p>
                    </div>
                    {result.certificate?.url && (
                      <a href={result.certificate.url} target="_blank" rel="noreferrer" className="btn-secondary !text-sm !text-[#FF8C00] !border-[#FF8C00] hover:!bg-[#FF8C00] hover:!text-white mt-4 md:mt-0">
                        <FiDownload /> Download Certificate
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block mb-2">Marks</span>
                      <span className="text-2xl font-black text-[#001F5E]">{result.obtainedMarks}<span className="text-lg text-gray-400 font-medium">/{result.totalMarks}</span></span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block mb-2">Percentage</span>
                      <span className="text-2xl font-black text-[#001F5E]">{result.percentage}%</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center">
                      <span className="text-gray-500 text-xs uppercase font-bold tracking-wider block mb-2">Grade</span>
                      <span className="text-2xl font-black text-[#FF8C00]">{result.grade || '-'}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[#0B7F3B]/10" />
                      <span className="relative z-10 text-[#0B7F3B] text-xs uppercase font-bold tracking-wider block mb-2">National Rank</span>
                      <span className="relative z-10 text-2xl font-black text-[#0B7F3B]">#{result.rank || '-'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </div>
    </>
  )
}
