import { Fragment, useEffect, useRef, useState } from 'react'
import { profile, education, projects, experience, toolbox, certifications } from '../data.js'
import { SIDES } from '../scene/CameraRig.jsx'

// Splits a heading into words that slide up one after another.
function Words({ text, from = 0 }) {
  const words = text.split(' ')
  return words.map((w, i) => (
    <Fragment key={i}>
      <span className="w">
        <span style={{ '--i': from + i }}>{w}</span>
      </span>
      {i < words.length - 1 && ' '}
    </Fragment>
  ))
}

function Section({ index, id, className = '', force, register, children }) {
  const ref = useRef()
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.3 })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  const on = force === undefined ? seen : force && seen
  return (
    <section
      id={id}
      ref={(el) => {
        ref.current = el
        register(index, el)
      }}
      className={`sec side-${SIDES[index]} ${className} ${on ? 'is-in' : ''}`}
    >
      {children}
    </section>
  )
}

function Eyebrow({ n, children }) {
  return (
    <p className="eyebrow fade" style={{ '--i': 0 }}>
      <span className="num">{n}</span>
      <span className="rule" />
      {children}
    </p>
  )
}

export default function Sections({ register, entered, project, setProject }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <>
      <Section index={0} id="top" className="hero" force={entered} register={register}>
        <div className="panel">
          <p className="eyebrow fade" style={{ '--i': 2 }}>
            <span className="num">{profile.role}</span>
            <span className="rule" />
            Java · Spring Boot · React
          </p>
          <h1>
            <Words text={profile.first} from={2} />
            <br />
            <span className="soft">
              <Words text={profile.last} from={4} />
            </span>
          </h1>
          <p className="lede fade" style={{ '--i': 6 }}>
            I build full-stack web apps, Java on the back and React on the front. This is my desk. Scroll to look
            around, or click anything on it.
          </p>
          <p className="hint fade" style={{ '--i': 8 }}>
            <span className="dot" /> Tip: click the desk lamp
          </p>
        </div>
      </Section>

      <Section index={1} id="about" register={register}>
        <div className="panel">
          <Eyebrow n="01">About</Eyebrow>
          <h2>
            <Words text="Learning by" from={1} /> <span className="soft"><Words text="building things." from={3} /></span>
          </h2>
          <p className="fade" style={{ '--i': 2 }}>
            I studied Computer Science with a focus on AI at PSCMRCET, Vijayawada. Most of what I know came from
            shipping projects: a multi-restaurant ordering platform on Servlets and JDBC, and an AI chatbot in
            Flask. I am now a software engineer intern at DataIQ Technologies, working with Spring Boot and Hibernate.
          </p>
          <dl className="facts fade" style={{ '--i': 3 }}>
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Born</dt><dd>{profile.born}</dd></div>
            <div><dt>Nationality</dt><dd>{profile.nationality}</dd></div>
            <div><dt>Now</dt><dd>Intern at DataIQ</dd></div>
          </dl>
          <ul className="rows edu">
            {education.map((e, i) => (
              <li key={e.what} className="fade" style={{ '--i': 4 + i }}>
                <span className="when">{e.when}</span>
                <span className="what">
                  {e.what}
                  <small>{e.where}</small>
                </span>
                <span className="score">{e.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section index={2} id="work" register={register}>
        <div className="panel">
          <Eyebrow n="02">Work</Eyebrow>
          <h2>
            <Words text="Things I've" from={1} /> <span className="soft"><Words text="built." from={3} /></span>
          </h2>
          <p className="aside fade" style={{ '--i': 2 }}>Hover or tap a project to open its source on the monitor.</p>
          <div className="cards">
            {projects.map((p, i) => (
              <div key={p.name} className="fade" style={{ '--i': 3 + i }}>
              <article
                className={`card ${project === i ? 'active' : ''}`}
                onMouseEnter={() => setProject(i)}
                onFocus={() => setProject(i)}
                onClick={() => setProject(i)}
              >
                <header>
                  <span className="n">0{i + 1}</span>
                  <h3>{p.name}</h3>
                  <p className="kind">{p.kind}</p>
                </header>
                <p className="text">{p.text}</p>
                <ul className="tags">
                  {p.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a className="repo" href={p.repo} target="_blank" rel="noreferrer">
                  View on GitHub <span aria-hidden>↗</span>
                </a>
              </article>
              </div>
            ))}
          </div>
          <a className="link fade" style={{ '--i': 5 }} href={profile.github} target="_blank" rel="noreferrer">
            More on GitHub <span aria-hidden>↗</span>
          </a>
        </div>
      </Section>

      <Section index={3} id="experience" register={register}>
        <div className="panel">
          <Eyebrow n="03">Experience</Eyebrow>
          <h2>
            <Words text="Where I've" from={1} /> <span className="soft"><Words text="worked." from={3} /></span>
          </h2>
          <ol className="jobs">
            {experience.map((j, i) => (
              <li key={j.company} className="fade" style={{ '--i': 2 + i }}>
                <span className="when">{j.period}</span>
                <h3>{j.company}</h3>
                <p className="role">{j.role}</p>
                <p>{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section index={4} id="toolbox" register={register}>
        <div className="panel">
          <Eyebrow n="04">Toolbox</Eyebrow>
          <h2>
            <Words text="What I" from={1} /> <span className="soft"><Words text="work with." from={3} /></span>
          </h2>
          <dl className="tools">
            {toolbox.map((t, i) => (
              <div key={t.group} className="fade" style={{ '--i': 2 + i }}>
                <dt>{t.group}</dt>
                <dd>{t.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
          <h3 className="sub fade" style={{ '--i': 8 }}>On the shelf</h3>
          <ul className="certs">
            {certifications.map((c, i) => (
              <li key={c.title} className="fade" style={{ '--i': 9 + i }}>
                {c.title} <span>{c.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section index={5} id="contact" className="contact" register={register}>
        <div className="panel">
          <Eyebrow n="05">Contact</Eyebrow>
          <h2>
            <Words text="Have a role or" from={1} /> <span className="soft"><Words text="a project?" from={4} /></span>
          </h2>
          <p className="fade" style={{ '--i': 2 }}>
            I'm open to software engineering roles. Mail is fastest, and I usually reply the same day.
          </p>
          <a className="mail fade" style={{ '--i': 3 }} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="actions fade" style={{ '--i': 4 }}>
            <button onClick={copy}>{copied ? 'Copied' : 'Copy email'}</button>
            <a href={profile.phoneHref}>{profile.phone}</a>
            <a href={`${import.meta.env.BASE_URL}resume.pdf`} target="_blank" rel="noreferrer">Résumé (PDF)</a>
          </div>
          <ul className="social fade" style={{ '--i': 5 }}>
            <li><a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>{profile.linkedinLabel}</span></a></li>
            <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub <span>{profile.githubLabel}</span></a></li>
          </ul>
          <p className="foot fade" style={{ '--i': 6 }}>
            © 2026 Syed Ibrahim Khaliulla. Built with React and three.js.
          </p>
        </div>
      </Section>
    </>
  )
}
