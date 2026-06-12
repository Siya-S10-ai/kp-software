import { useEffect, useState } from 'react'
import { publicApi } from '../../api/client'
import { PageHeader, Alert } from '../../components/ui'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    publicApi
      .getServices()
      .then(setServices)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div className='max-w-6xl mx-auto px-4 py-12 text-left'>
      <PageHeader
        title='Our Services'
        subtitle='Professional welding and fabrication for every scale of project.'
      />
      {error && <Alert>{error}</Alert>}
      <div className='grid md:grid-cols-2 gap-6'>
        {services.map((service) => (
          <div
            key={service.id}
            className='group relative rounded-2xl overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl flex flex-col items-center justify-center text-center p-8 min-h-[300px]'
          >
            {/* Background Image */}
            <div 
              className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105'
              style={{ backgroundImage: `url(${service.imageSrc})` }}
            />
            {/* Dark Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-gray-900/40' />
            
            {/* Content (z-index above overlay) */}
            <div className='relative z-10 flex flex-col items-center justify-center space-y-4 px-2'>
              {/* Icon */}
              <div className='w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 mb-2'>
                <svg className='w-7 h-7 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-white tracking-wide'>{service.title}</h2>
              <p className='text-gray-200 leading-relaxed font-medium'>{service.description}</p>
            </div>
          </div>
        ))
}
      </div>
    </div>
  )
}