import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'

const GRADIENT = 'linear-gradient(135deg, #00C4CC 0%, #0047FF 50%, #7D2AE8 100%)'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Enquire',
    desc: 'Submit your project details online in minutes.',
    color: '#00C4CC',
  },
  {
    step: '02',
    title: 'Plan',
    desc: 'We scope, quote, and schedule the work.',
    color: '#0047FF',
  },
  {
    step: '03',
    title: 'Build',
    desc: 'Assigned welders execute with live progress updates.',
    color: '#5A1BE0',
  },
  {
    step: '04',
    title: 'Review',
    desc: 'Track completion and share your feedback.',
    color: '#7D2AE8',
  },
]

const WHY_US = [
  'End-to-end project tracking for every customer',
  'Skilled welders and fabricators on every job',
  'Transparent progress updates with photos',
  'Trusted by residential and commercial clients',
]

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: GRADIENT }}
      >
        {/* Subtle mesh texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.07) 0%, transparent 60%),' +
              'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — headline */}
            <div className="text-left">
              <p
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#FFE066', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                Welding & Fabrication
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                Precision steel work for homes, sites, and industry
              </h1>
              <p className="text-white/75 text-lg mb-8 leading-relaxed max-w-lg">
                KP Enterprise delivers custom fabrication, structural steel, repairs, and
                installations — with full project visibility from quote to completion.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-95 hover:shadow-lg"
                    style={{ background: '#FFE066', color: '#1a2332', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
                  >
                    Request a quote
                  </button>
                </Link>
                <Link to="/portfolio">
                  <button
                    type="button"
                    className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:bg-white/25"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    View our work
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — Why KP card */}
            <div
              className="rounded-2xl p-7 text-left"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <h2 className="text-lg font-bold text-white mb-5">Why KP Enterprise?</h2>
              <ul className="space-y-3.5">
                {WHY_US.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                      style={{ background: '#FFE066', color: '#1a2332' }}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                    <span className="text-white/85 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 48L1440 48L1440 24C1440 24 1080 0 720 0C360 0 0 24 0 24L0 48Z" fill="#f0f2f5" />
          </svg>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-steel-900 tracking-tight mb-3">
            How it works
          </h2>
          <p className="text-steel-600 max-w-md mx-auto">
            From first enquiry to a finished project — tracked at every step.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map(({ step, title, desc, color }) => (
            <div
              key={step}
              className="bg-white rounded-2xl p-6 border border-steel-200 relative overflow-hidden hover:shadow-lg transition-shadow duration-200"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              {/* Background step number */}
              <span
                className="absolute -top-3 -right-2 text-7xl font-extrabold leading-none pointer-events-none select-none"
                style={{ color: color, opacity: 0.07 }}
                aria-hidden="true"
              >
                {step}
              </span>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold mb-4"
                style={{ background: color }}
              >
                {step}
              </div>
              <h3 className="font-bold text-steel-900 mb-1.5">{title}</h3>
              <p className="text-steel-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA band ─────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-center"
        style={{ background: GRADIENT }}
      >
        <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
          Ready to start your project?
        </h2>
        <p className="text-white/75 mb-8 max-w-md mx-auto">
          Tell us what you need and our team will be in touch within one business day.
        </p>
        <Link to="/contact">
          <button
            type="button"
            className="px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:shadow-xl"
            style={{ background: '#FFE066', color: '#1a2332', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            Get a free quote
          </button>
        </Link>
      </section>

      {/* ── Map section ──────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-steel-900 tracking-tight">Find us</h2>
            <p className="text-steel-600 mt-1.5 text-sm">Kalapeng Power Holdings Enterprises, Embalenhle, Secunda</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-steel-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d11137.25401506538!2d29.080900750000005!3d-26.524270749999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x1eeb1545bfb82663%3A0xc6df3183de3bc470!2sKalapeng%20Power%20Holdings%20Enterprises%2C%207898%20Dr%20Jl%20Dube%20Cres%2C%20Embalenhle%2C%20Secunda%2C%202285!3m2!1d-26.5282017!2d29.0789378!5e1!3m2!1sen!2sza!4v1780909792038!5m2!1sen!2sza"
              width="100%"
              height="420"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="KP Enterprise location map"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
