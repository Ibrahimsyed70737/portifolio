export const profile = {
  first: 'Syed Ibrahim',
  last: 'Khaliulla',
  role: 'Software Engineer',
  email: 'ibrahimibrahim70737@gmail.com',
  phone: '+91 84649 55637',
  phoneHref: 'tel:+918464955637',
  born: '04 Feb 2004',
  nationality: 'Indian',
  location: 'Vijayawada, Andhra Pradesh',
  linkedin: 'https://linkedin.com/in/syedibrahimdev',
  linkedinLabel: 'in/syedibrahimdev',
  github: 'https://github.com/Ibrahimsyed70737',
  githubLabel: 'Ibrahimsyed70737',
}

export const education = [
  { what: 'B.Tech, CSE (AI)', where: 'PSCMRCET', when: '2022 — 2026', score: 'CGPA 8.68' },
  { what: 'Intermediate, MPC', where: 'Narayana Jr. College', when: '2020 — 2022', score: '939 / 1000' },
  { what: 'SSC', where: 'Guntur Oxford E.M High School', when: '2016 — 2020', score: '600 / 600' },
]

export const projects = [
  {
    name: 'Cravings',
    kind: 'Multi-restaurant food ordering',
    text:
      'Users browse menus from several restaurants, build a cart and place orders. Admins manage restaurants and upload dish images. Plain Servlets and JDBC, organised in a layered DAO architecture.',
    tech: ['Java', 'JSP', 'Servlets', 'JDBC', 'MySQL', 'HTML/CSS/JS'],
    repo: 'https://github.com/Ibrahimsyed70737/Cravings',
  },
  {
    name: 'Spring CRUD API',
    kind: 'REST service on Spring Boot',
    text:
      'A Spring Boot service with full create, read, update and delete over MySQL through Spring Data JPA. Every endpoint exercised end to end in Postman.',
    tech: ['Spring Boot', 'Spring Web MVC', 'Spring Data JPA', 'MySQL', 'Postman'],
    repo: 'https://github.com/Ibrahimsyed70737/SpringBoot',
  },
  {
    name: 'AI Chatbot',
    kind: 'Text and image generation',
    text:
      'A Flask chat app that replies in text or draws an image, depending on what you ask. It calls OpenAI and Hugging Face models through their APIs.',
    tech: ['Python', 'Flask', 'OpenAI', 'Hugging Face', 'HTML/CSS'],
    repo: 'https://github.com/Ibrahimsyed70737/ai-chat-bot',
  },
]

export const experience = [
  {
    company: 'DataIQ Technologies',
    role: 'Software Engineer Intern',
    period: 'Oct 2026 — now',
    text: 'Web development, documentation and cross-functional support on client engagements.',
    note: ['web dev + docs', 'client projects'],
  },
  {
    company: 'TAP Academy',
    role: 'Java Full Stack with AI — Intern',
    period: 'Jan — Sep 2026',
    text: 'Built full-stack applications with a Java backend and a React frontend, with AI features wired in.',
    note: ['java + react', 'full stack w/ AI'],
  },
  {
    company: 'Black Bucks',
    role: 'AI / ML Intern',
    period: 'May — Jul 2025',
    text: 'Applied machine learning techniques to practical problems on AI/ML projects.',
    note: ['ML on real problems'],
  },
]

export const toolbox = [
  { group: 'Languages', items: ['Java', 'Python (basics)'] },
  { group: 'Backend', items: ['Spring Boot', 'Hibernate', 'JDBC', 'JSP', 'Servlets / JEE'] },
  { group: 'Frontend', items: ['React', 'JavaScript', 'HTML', 'CSS'] },
  { group: 'Database', items: ['MySQL'] },
  { group: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'Git / GitHub'] },
  { group: 'AI APIs', items: ['OpenAI', 'Hugging Face', 'Gemini'] },
]

export const certifications = [
  { title: 'Introduction to Generative AI', issuer: 'IBM' },
  { title: 'Introduction to Machine Learning', issuer: 'NPTEL' },
  { title: 'Multicloud Network Associate', issuer: 'Aviatrix' },
]
