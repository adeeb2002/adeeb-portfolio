// Language-independent data (images, links, numbers, categories). Text lives in i18n/content.js.
import me from './assets/me.jpeg'
import luxcar from './assets/luxcarimage.jpeg'
import weather from './assets/weatherapp.png'
import movie from './assets/movieimage.jpeg'
import chat from './assets/chatapp.jpeg'
import radioava from './assets/radioava.jpeg'
import kupa from './assets/kupa.jpeg'

import masarSplash from './assets/masar-splash.png'
import masarScreens from './assets/masar-screens.png'
import masarDashboard from './assets/masar-dashboard.png'
import masarMockup from './assets/masar-mockup.png'
import masarSocial from './assets/masar-social.png'

const base = import.meta.env.BASE_URL

export const profile = {
  photo: me,
  cv: `${base}Adeeb_Sultan_Cv_new.pdf`,
  email: 'adeebsaltan@gmail.com',
  phone: '+972 59 328 2184',
  whatsapp: 'https://wa.me/972593282184',
  github: 'https://github.com/adeeb2002',
  githubLabel: 'github.com/adeeb2002',
  linkedin: 'https://www.linkedin.com/in/adeeb-sultan-1253b3292/',
  linkedinLabel: 'linkedin.com/in/adeeb-sultan',
  portfolioUrl: 'https://adeeb2002.github.io/portfolio/',
}

export const navLinks = [
  { id: 'home', href: '#home' },
  { id: 'about', href: '#about' },
  { id: 'architecture', href: '#architecture' },
  { id: 'experience', href: '#experience' },
  { id: 'skills', href: '#skills' },
  { id: 'projects', href: '#projects' },
  { id: 'contact', href: '#contact' },
]

export const stats = [
  { to: 3.5, decimals: 1, suffix: '+' },
  { to: 7, decimals: 0, suffix: '+' },
  { to: 2, decimals: 0, suffix: '' },
  { to: 100, decimals: 0, suffix: '%' },
]

export const marquee = [
  'Flutter SDK',
  'Dart',
  'Native Android (Java)',
  'Kotlin',
  'Clean Architecture',
  'Riverpod & Bloc',
  'Offline-First (Hive & SQLite)',
  'Firebase & Supabase',
  'RESTful JSON APIs',
  'Retrofit & Room DB',
  'OneSignal Push',
  'Figma UI/UX',
  'Git & GitHub',
  'Linux',
]

export const techIcons = ['android', 'mobile', 'fire', 'database', 'github', 'linux']

export const projects = [
  {
    id: 'masar',
    featured: true,
    category: 'healthcare',
    cover: masarSplash,
    gallery: [masarDashboard, masarSplash, masarScreens, masarMockup, masarSocial],
  },
  {
    id: 'luxcar',
    category: 'cloud',
    image: luxcar,
    repo: 'https://github.com/adeeb2002/LuxCar.git',
  },
  {
    id: 'radioava',
    category: 'offline',
    image: radioava,
  },
  {
    id: 'movie',
    category: 'offline',
    image: movie,
    repo: 'https://github.com/adeeb2002/Movie-App.git',
  },
  {
    id: 'kupa',
    category: 'commerce',
    image: kupa,
  },
  {
    id: 'chat',
    category: 'cloud',
    image: chat,
    repo: 'https://github.com/adeeb2002/chat_app.git',
  },
  {
    id: 'weather',
    category: 'cloud',
    image: weather,
    repo: 'https://github.com/adeeb2002/Weather-App.git',
  },
]
