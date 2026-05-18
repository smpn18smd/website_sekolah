// ==========================
// SUPABASE
// ==========================

const SUPABASE_URL =
  "https://etnrxxaijfrivbjlufju.supabase.co";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnJ4eGFpamZyaXZiamx1Zmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDU4OTUsImV4cCI6MjA5NDQyMTg5NX0.Hf9Ro831c4nl74UBQ1s8uJOdSBQYOUWesf6coYGX_6Q";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// ==========================
// DATA GURU DEFAULT
// ==========================

const teachers = [
  {
    name:'Drs. Hadi Susanto, M.Pd',
    role:'Kepala Sekolah',
    color:'from-gold to-gold-light',
    icon:'crown'
  },

  {
    name:'Siti Rahmawati, S.Pd',
    role:'Wakil Kurikulum',
    color:'from-sky to-blue-400',
    icon:'book-open'
  },

  {
    name:'Ahmad Fauzi, M.Pd',
    role:'Guru Matematika',
    color:'from-green-400 to-emerald-500',
    icon:'calculator'
  },

  {
    name:'Dewi Lestari, S.Pd',
    role:'Guru Bahasa Indonesia',
    color:'from-purple-400 to-purple-600',
    icon:'pen-tool'
  }
];

// ==========================
// GLOBAL VARIABLE
// ==========================

let news = [];

// ==========================
// LOAD BERITA
// ==========================

async function loadNews(){

  try{

    const { data, error } =
      await supabaseClient
        .from('berita')
        .select('*')
        .order('id', { ascending:false });

    if(error){
      console.error(error);
      return;
    }

    news = data || [];

    renderNews();

  }catch(err){

    console.error(err);

  }

}

// ==========================
// RENDER GURU
// ==========================

function renderTeachers(){

  const grid =
    document.getElementById('teachers-grid');

  if(!grid) return;

  grid.innerHTML =
    teachers.map((t,i)=>`

      <div
        class="teacher-card glass rounded-2xl p-6 text-center card-hover section-anim"
        style="animation-delay:${i * .1}s"
      >

        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center shadow-lg">

          <i
            data-lucide="${t.icon}"
            style="width:32px;height:32px;color:white"
          ></i>

        </div>

        <h4 class="font-bold text-sm mb-1">
          ${t.name}
        </h4>

        <p class="text-xs text-gold-light/70">
          ${t.role}
        </p>

      </div>

    `).join('');

}

// ==========================
// RENDER BERITA
// ==========================

function renderNews(){

  const grid =
    document.getElementById('news-grid');

  if(!grid) return;

  if(news.length === 0){

    grid.innerHTML = `
      <div class="col-span-full text-center py-20">

        <div class="text-white/40 text-sm">
          Belum ada berita
        </div>

      </div>
    `;

    return;
  }

  grid.innerHTML =
    news.map((n)=>`

      <div class="glass rounded-2xl overflow-hidden card-hover news-card">

        <img
          src="${n.image_url}"
          alt="${n.title}"
          class="w-full h-40 object-cover"
        >

        <div class="p-5">

          <div class="flex items-center gap-2 mb-3">

            <span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-gold/10 text-gold-light">

              ${n.category}

            </span>

            <span class="text-[10px] text-white/30">

              ${n.date}

            </span>

          </div>

          <h4 class="font-bold text-sm mb-2">

            ${n.title}

          </h4>

          <p class="text-xs text-white/50 leading-relaxed">

            ${n.description}

          </p>

        </div>

      </div>

    `).join('');

}

// ==========================
// COUNTER ANIMATION
// ==========================

function animateCounters(){

  document.querySelectorAll('.counter').forEach(el=>{

    const target =
      +el.dataset.target;

    let current = 0;

    const step = target / 60;

    const timer = setInterval(()=>{

      current += step;

      if(current >= target){

        el.textContent = target;

        clearInterval(timer);

      }else{

        el.textContent =
          Math.floor(current);

      }

    },25);

  });

}

// ==========================
// CHART ANIMATION
// ==========================

function animateCharts(){

  document.querySelectorAll('.chart-bar').forEach(el=>{

    el.style.width =
      el.dataset.width;

  });

  document.querySelectorAll('.chart-bar-v').forEach(el=>{

    el.style.height =
      el.dataset.height;

  });

}

// ==========================
// SCROLL ANIMATION
// ==========================

function initScrollAnim(){

  const observer =
    new IntersectionObserver((entries)=>{

      entries.forEach(entry=>{

        if(entry.isIntersecting){

          entry.target.classList.add(
            'section-visible'
          );

          entry.target.classList.remove(
            'section-hidden'
          );

        }

      });

    },{
      threshold:.15
    });

  document.querySelectorAll('.section-anim')
    .forEach(el=>{

      el.classList.add(
        'section-hidden'
      );

      observer.observe(el);

    });

}

// ==========================
// NAVBAR SCROLL
// ==========================

window.addEventListener('scroll',()=>{

  const navbar =
    document.getElementById('navbar');

  if(!navbar) return;

  if(window.scrollY > 50){

    navbar.classList.add(
      'bg-navy/95',
      'backdrop-blur-xl',
      'shadow-lg',
      'shadow-navy/50'
    );

  }else{

    navbar.classList.remove(
      'bg-navy/95',
      'backdrop-blur-xl',
      'shadow-lg',
      'shadow-navy/50'
    );

  }

});

// ==========================
// MOBILE MENU
// ==========================

function toggleMobile(){

  const menu =
    document.getElementById('mobile-menu');

  if(!menu) return;

  menu.classList.toggle('open');

}

// ==========================
// ADMIN
// ==========================

function showAdmin(){

  const login =
    document.getElementById('admin-login');

  if(login){

    login.style.display = 'flex';

  }

}

function hideLogin(){

  const login =
    document.getElementById('admin-login');

  if(login){

    login.style.display = 'none';

  }

}

// ==========================
// LOGIN ADMIN
// ==========================

async function loginAdmin(){

  const email = document.getElementById('admin-user').value;

  const password = document.getElementById('admin-pass').value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    alert(error.message);
    return;
  }

  hideLogin();

  document.getElementById('admin-panel').style.display='flex';

  setAdminTab('dashboard');

  lucide.createIcons();
}

// ==========================
// TAMBAH BERITA
// ==========================

async function tambahBerita(){

  const title =
    prompt("Judul berita:");

  if(!title) return;

  const category =
    prompt("Kategori berita:");

  if(!category) return;

  const description =
    prompt("Deskripsi berita:");

  if(!description) return;

  const image_url =
    prompt("URL gambar berita:");

  if(!image_url) return;

  const today =
    new Date().toLocaleDateString('id-ID');

  try{

    const { error } =
      await supabaseClient
        .from('berita')
        .insert([
          {
            title,
            category,
            description,
            image_url,
            date:today
          }
        ]);

    if(error){

      alert(error.message);

      return;
    }

    alert('Berita berhasil ditambahkan');

    loadNews();

  }catch(err){

    console.error(err);

  }

}

// ==========================
// UPDATE DATETIME
// ==========================

function updateDateTime(){

  const el =
    document.getElementById('live-datetime');

  if(!el) return;

  const now =
    new Date();

  const tanggal =
    now.toLocaleDateString('id-ID',{
      weekday:'long',
      day:'numeric',
      month:'long',
      year:'numeric'
    });

  const jam =
    now.toLocaleTimeString('id-ID',{
      hour:'2-digit',
      minute:'2-digit',
      second:'2-digit'
    }).replace(/\./g,':');

  el.textContent =
    `${tanggal} | ${jam}`;

}

// ==========================
// TOTAL SISWA
// ==========================

function updateTotalSiswaAktif(){

  const total =
    document.getElementById(
      'total-siswa-aktif'
    );

  if(total){

    total.textContent = '420';

  }

}

// ==========================
// APPLY CONFIG
// ==========================

function applyConfig(cfg){

  if(!cfg) return;

  const heroTitle =
    document.getElementById('hero-title');

  const heroSubtitle =
    document.getElementById('hero-subtitle');

  const visi =
    document.getElementById('visi-content');

  if(heroTitle && cfg.hero_title){

    heroTitle.textContent =
      cfg.hero_title;

  }

  if(heroSubtitle && cfg.hero_subtitle){

    heroSubtitle.textContent =
      cfg.hero_subtitle;

  }

  if(visi && cfg.visi_text){

    visi.textContent =
      cfg.visi_text;

  }

}

// ==========================
// INIT
// ==========================

document.addEventListener('DOMContentLoaded',()=>{

  renderTeachers();

  loadNews();

  animateCounters();

  animateCharts();

  initScrollAnim();

  updateDateTime();

  updateTotalSiswaAktif();

  setInterval(updateDateTime,1000);

  lucide.createIcons();

});
