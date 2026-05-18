// ================= DATA =================
const teachers = [
  {name:'Drs. Hadi Susanto, M.Pd',role:'Kepala Sekolah',color:'from-gold to-gold-light',icon:'crown'},
  {name:'Siti Rahmawati, S.Pd',role:'Wakil Kurikulum',color:'from-sky to-blue-400',icon:'book-open'},
  {name:'Ahmad Fauzi, M.Pd',role:'Guru Matematika',color:'from-green-400 to-emerald-500',icon:'calculator'},
  {name:'Dewi Lestari, S.Pd',role:'Guru Bahasa Indonesia',color:'from-purple-400 to-purple-600',icon:'pen-tool'},
  {name:'Budi Prasetyo, S.Pd',role:'Guru IPA',color:'from-cyan-400 to-cyan-600',icon:'flask-conical'},
  {name:'Nur Hidayah, S.Pd',role:'Guru Bahasa Inggris',color:'from-orange-400 to-orange-600',icon:'globe'},
  {name:'Rina Marlina, S.Pd',role:'Guru IPS',color:'from-rose-400 to-rose-600',icon:'map'},
  {name:'Agus Setiawan, S.Pd',role:'Guru Olahraga',color:'from-yellow-400 to-yellow-600',icon:'dumbbell'}
];

let news = [];

// ================= SUPABASE =================
const SUPABASE_URL = "https://etnrxxaijfrivbjlufju.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_KEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function loadNews(){
  const { data } = await supabaseClient
    .from('berita')
    .select('*')
    .order('id', { ascending:false });

  news = data || [];
  renderNews();
}

// ================= RENDER =================
function renderTeachers(){
  const g=document.getElementById('teachers-grid');
  if(!g) return;

  g.innerHTML = teachers.map((t,i)=>`
    <div class="glass rounded-2xl p-6 text-center card-hover">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center">
        <i data-lucide="${t.icon}" style="width:32px;height:32px;color:white"></i>
      </div>
      <h4 class="font-bold text-sm mb-1">${t.name}</h4>
      <p class="text-xs text-gold-light/70">${t.role}</p>
    </div>
  `).join('');
}

function renderNews(){
  const g=document.getElementById('news-grid');
  if(!g) return;

  g.innerHTML = news.map(n=>`
    <div class="glass rounded-2xl overflow-hidden card-hover">
      <img src="${n.image_url}" class="w-full h-40 object-cover">
      <div class="p-5">
        <div class="flex gap-2 mb-2">
          <span class="text-[10px] px-2 py-1 bg-gold/10 text-gold-light rounded-full">
            ${n.category}
          </span>
          <span class="text-[10px] text-white/30">${n.date}</span>
        </div>
        <h4 class="font-bold text-sm">${n.title}</h4>
        <p class="text-xs text-white/50">${n.description}</p>
      </div>
    </div>
  `).join('');
}

// ================= UI =================
function toggleMobile(){
  document.getElementById('mobile-menu').classList.toggle('open');
}

function showAdmin(){
  document.getElementById('admin-login').style.display='flex';
}

function hideLogin(){
  document.getElementById('admin-login').style.display='none';
}

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
  renderTeachers();
  loadNews();
  lucide.createIcons();
});
