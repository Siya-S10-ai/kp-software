import { Link } from 'react-router-dom'
import { Button } from '../../components/ui'

export default function HomePage() {
  return (
    <div>
      <section className="bg-steel-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left">
            <p className="text-amber-brand font-semibold uppercase tracking-wider text-sm mb-3">
              Welding & Fabrication
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Precision steel work for homes, sites, and industry
            </h1>
            <p className="text-steel-200 text-lg mb-8">
              KP Enterprise delivers custom fabrication, structural steel, repairs, and
              installations with full project visibility from quote to completion.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact">
                <Button>Request a quote</Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" className="!text-white !border-steel-500 hover:!bg-steel-800">
                  View our work
                </Button>
              </Link>
            </div>
          </div>
          <div className="bg-steel-800 rounded-xl p-8 border border-steel-700 text-left">
            <h2 className="text-xl font-semibold mb-4">Why KP Enterprise?</h2>
            <ul className="space-y-3 text-steel-200">
              <li>✓ End-to-end project tracking for customers</li>
              <li>✓ Skilled welders and fabricators on every job</li>
              <li>✓ Transparent progress updates and milestones</li>
              <li>✓ Trusted by residential and commercial clients</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-left">
        <h2 className="text-2xl font-bold mb-6">How it works</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            ['1. Enquire', 'Submit your project details online'],
            ['2. Plan', 'We scope, quote, and schedule the work'],
            ['3. Build', 'Assigned welders execute with live updates'],
            ['4. Review', 'Track completion and share your feedback'],
          ].map(([title, desc]) => (
            <div key={title} className="bg-white border border-steel-200 rounded-lg p-5">
              <h3 className="font-semibold text-amber-brand mb-2">{title}</h3>
              <p className="text-steel-700 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* <section className="max-w-6xl mx-auto px-4 py-16 text-left">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d11137.25401506538!2d29.080900750000005!3d-26.524270749999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x1eeb1545bfb82663%3A0xc6df3183de3bc470!2sKalapeng%20Power%20Holdings%20Enterprises%2C%207898%20Dr%20Jl%20Dube%20Cres%2C%20Embalenhle%2C%20Secunda%2C%202285!3m2!1d-26.5282017!2d29.0789378!5e1!3m2!1sen!2sza!4v1780909792038!5m2!1sen!2sza"
          width="800"
          height="600"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </section> */}
      <section>
        <h2 align="center" className="text-2xl font-bold mb-6">Find Us</h2>
        <p align="center">
          <iframe 
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d11137.25401506538!2d29.080900750000005!3d-26.524270749999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x1eeb1545bfb82663%3A0xc6df3183de3bc470!2sKalapeng%20Power%20Holdings%20Enterprises%2C%207898%20Dr%20Jl%20Dube%20Cres%2C%20Embalenhle%2C%20Secunda%2C%202285!3m2!1d-26.5282017!2d29.0789378!5e1!3m2!1sen!2sza!4v1780909792038!5m2!1sen!2sza"
          width="800"
          height="600">
        </iframe>
        </p>
      </section>
    </div>
  )
}
