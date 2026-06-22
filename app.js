// ===== untuk variabel statistikSiswa =====
let statistikSiswa = null;

// ===== buat fungsi load data siswa =====
async function loadStatistikSiswa(){
  const { data, error } =
    await supabaseClient
      .from('statistik_siswa')
      .select('*')
      .limit(1)
      .maybeSingle();
  if(error){
    console.error(error);
    return;
  }
  statistikSiswa = data;
  renderStatistikSiswaWebsite();
}

// ===== buat fungsi load total prestasi =====
async function loadTotalPrestasi(){

  const { count, error } =
    await supabaseClient
      .from('prestasi')
      .select('*',{
        count:'exact',
        head:true
      });

  if(error){
    console.error(
      error
    );
    return;
  }

  const el =
    document.getElementById(
      'total-prestasi'
    );

  if(el){
    el.textContent =
      count || 0;
  }

}

// ===== buat fungsi render tampilkan ke website =====
function renderStatistikSiswaWebsite(){

  if(!statistikSiswa) return;

    // TOTAL PER KELAS
  const total7 =
    statistikSiswa.kelas7_laki +
    statistikSiswa.kelas7_perempuan;

  const total8 =
    statistikSiswa.kelas8_laki +
    statistikSiswa.kelas8_perempuan;

  const total9 =
    statistikSiswa.kelas9_laki +
    statistikSiswa.kelas9_perempuan;

  const total =
    statistikSiswa.kelas7_laki +
    statistikSiswa.kelas7_perempuan +
    statistikSiswa.kelas8_laki +
    statistikSiswa.kelas8_perempuan +
    statistikSiswa.kelas9_laki +
    statistikSiswa.kelas9_perempuan;

  const hero =
    document.getElementById(
      'total-siswa-aktif'
    );

  if(hero){
    hero.textContent = total;
  }

   const sekolah =
    document.getElementById('total-siswa-sekolah');
  if(sekolah){
    sekolah.textContent = total;
  }

 // SISWA PER TINGKAT
  const k7 =
    document.getElementById(
      'kelas7-total'
    );

  const k8 =
    document.getElementById(
      'kelas8-total'
    );

  const k9 =
    document.getElementById(
      'kelas9-total'
    );

  if(k7) k7.textContent = total7;
  if(k8) k8.textContent = total8;
  if(k9) k9.textContent = total9;

// progress bar siswa per tingkat
const terbesar =
  Math.max(total7, total8, total9);

const bar7 =
  document.getElementById('kelas7-bar');

const bar8 =
  document.getElementById('kelas8-bar');

const bar9 =
  document.getElementById('kelas9-bar');

if(bar7){
  bar7.style.width =
    ((total7 / terbesar) * 100) + '%';
}

if(bar8){
  bar8.style.width =
    ((total8 / terbesar) * 100) + '%';
}

if(bar9){
  bar9.style.width =
    ((total9 / terbesar) * 100) + '%';
}
  
}

// ===== fungsi hasil total siswa =====
function getTotalSiswa(){
if(!statistikSiswa) return 0;
return (
  statistikSiswa.kelas7_laki +
  statistikSiswa.kelas7_perempuan +
  statistikSiswa.kelas8_laki +
  statistikSiswa.kelas8_perempuan +
  statistikSiswa.kelas9_laki +
  statistikSiswa.kelas9_perempuan
);
}

// ===== fungsi simpan statistik siswa =====
async function simpanStatistikSiswa(){

console.log(statistikSiswa);

const data = {
kelas7_laki:
parseInt(document.getElementById('k7l').value) || 0,
kelas7_perempuan:
parseInt(document.getElementById('k7p').value) || 0,
kelas8_laki:
parseInt(document.getElementById('k8l').value) || 0,
kelas8_perempuan:
parseInt(document.getElementById('k8p').value) || 0,
kelas9_laki:
parseInt(document.getElementById('k9l').value) || 0,
kelas9_perempuan:
parseInt(document.getElementById('k9p').value) || 0,
updated_at:
new Date()
};

const { error } =
await supabaseClient
.from('statistik_siswa')
.update(data)
.eq('id', statistikSiswa.id);
if(error){
alert(error.message);
return;
}
alert(
'Statistik siswa berhasil disimpan'
);
await loadStatistikSiswa();
setAdminTab('statistik');
  
}

// ===== Variabel Global Prestasi =====
let prestasi = [];

// ===== LOAD PRESTASI =====
async function loadPrestasi(){

const {
data,
error
}
=
await supabaseClient
.from('prestasi')
.select('*')
.order(
'created_at',
{
ascending:false
}
);

if(error){
console.error(error);
return;

}

prestasi = data || [];
renderPrestasi();
}



// ===== RENDER PRESTASI =====
function renderPrestasi(){
const container =
document.getElementById(
'prestasi-list'
);


if(!container) return;

container.innerHTML =
prestasi.map(p=>`

<div 
onclick="openPrestasiDetail(${p.id})"
class="glass rounded-2xl overflow-hidden card-hover cursor-pointer"
>

<img
src="${p.image_url}"
class="w-full h-56 object-cover"
>

<div class="p-5">

<div class="text-gold-light text-xs mb-2">
${p.category || ''}
</div>

<h3 class="font-bold text-lg mb-2">
${p.title}
</h3>

<p class="text-white/60 text-sm leading-relaxed line-clamp-3">
${p.description || ''}
</p>

<div class="mt-3 text-gold-light text-xs">
Klik untuk melihat detail →
</div>

</div>

</div>

`).join('');
}


// ===== DATA =====
let teachers = [];

function getTotalTenagaPendidik(){
  return teachers.filter(guru => {
    return (
      guru.jabatan === 'Kepala Sekolah' ||
      guru.jabatan === 'Waka Kurikulum' ||
      guru.jabatan === 'Waka Kesiswaan' ||
      guru.jabatan === 'Guru'
    );
  }).length;
}

// ===== URUTAN JABATAN =====
function getUrutanJabatan(jabatan){
  const urutan = {
    "Kepala Sekolah":1,
    "Waka Kurikulum":2,
    "Waka Kesiswaan":3,
    "Guru":4,
    "Staff TU":5,
    "Perpustakaan":6,
    "Tenaga Kependidikan":7
  };
  return urutan[jabatan] || 99;
}

// ===== LOAD GURU =====
async function loadTeachers(){
const { data, error } =
await supabaseClient
.from('guru')
.select('*')
.order('urutan', {
ascending:true
});
if(error){
console.error(error);
return;
}
teachers = data;
renderTeachers();
initTeacherCarousel();
}


// ===== RENDER FOTO FOTO GURU =====
function renderTeachers(){
  const g =
    document.getElementById(
      'teachers-grid'
    );
  if(!g) return;
  g.innerHTML =
    teachers.map(t=>`
<div class="teacher-slide">
<img
src="${t.photo_url}"
class="teacher-photo"
>
<h4>${t.name}</h4>
<div class="teacher-role">
${t.jabatan}
</div>
${
t.keterangan
?
`<p>${t.keterangan}</p>`
:
''
}
</div>
`).join('');

const totalPendidik =
  document.getElementById(
    'total-tenaga-pendidik'
  );

if(totalPendidik){
  totalPendidik.textContent =
    getTotalTenagaPendidik();
}
  
  // aktifkan carousel setelah render
  initTeacherCarousel();
  enableTeacherDrag();
  
}


// ===== CAROUSEL GURU =====
function initTeacherCarousel(){
  const carousel =
    document.getElementById(
      'teachers-grid'
    );
  const next =
    document.getElementById(
      'teacher-next'
    );
  const prev =
    document.getElementById(
      'teacher-prev'
    );
  if(!carousel) return;
  next?.addEventListener(
    'click',
    ()=>{
      carousel.scrollBy({
        left:300,
        behavior:'smooth'
      });
    }
  );
  prev?.addEventListener(
    'click',
    ()=>{
      carousel.scrollBy({
        left:-300,
        behavior:'smooth'
      });
    }
  );
}


// ===== DRAG CAROUSEL GURU =====
function enableTeacherDrag(){
  const slider =
    document.getElementById(
      'teachers-grid'
    );
  if(!slider) return;
  let isDown = false;
  let startX;
  let scrollLeft;
  slider.addEventListener(
    'mousedown',
    e=>{
      isDown = true;
      startX =
        e.pageX -
        slider.offsetLeft;
      scrollLeft =
        slider.scrollLeft;
    }
  );
  slider.addEventListener(
    'mouseleave',
    ()=> isDown = false
  );
  slider.addEventListener(
    'mouseup',
    ()=> isDown = false
  );
  slider.addEventListener(
    'mousemove',
    e=>{
      if(!isDown) return;
      e.preventDefault();
      const x =
        e.pageX -
        slider.offsetLeft;
      const walk =
        (x - startX) * 2;
      slider.scrollLeft =
        scrollLeft - walk;
    }
  );
}


let news = [];

async function loadNews(){
  const { data, error } = await supabaseClient
    .from('berita')
    .select('*')
    .order('id', { ascending:false });
  if(error){
    console.error(error);
    return;
  }
  news = data;
  renderNews();
};

function renderNews(){

  // ===== 3 BERITA TERBARU =====
  const latestContainer =
    document.getElementById('latest-news');

  // ===== BERITA LAMA =====
  const oldContainer =
    document.getElementById('old-news-carousel');

  if(!latestContainer || !oldContainer) return;

  // ambil 3 terbaru
  const latestNews = news.slice(0, 3);

  // sisanya untuk carousel
  const oldNews = news.slice(3);

  
  // ===== TEMPLATE CARD =====
  function createNewsCard(n){

  return `
  <div
    onclick="openNewsDetail(${n.id})"
    class="glass rounded-2xl overflow-hidden card-hover news-card cursor-pointer"
  >

    <img
      src="${n.image_url}"
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

      <h4 class="font-bold text-sm mb-2 hover:text-gold-light transition">
        ${n.title}
      </h4>

      <p class="text-xs text-white/50 line-clamp-3">
        ${n.description}
      </p>

      <div class="mt-4">

        <button
          class="text-gold-light text-xs font-semibold"
        >
          Baca Selengkapnya →
        </button>

      </div>

    </div>

  </div>
  `;
  }
  

  // ===== RENDER 3 TERBARU =====
  latestContainer.innerHTML =
    latestNews.map(createNewsCard).join('');

  // ===== RENDER CAROUSEL =====
  oldContainer.innerHTML =
    oldNews.map(createNewsCard).join('');

  // ===== BUTTON NAVIGATION =====
  const nextBtn =
    document.getElementById('next-news');

  const prevBtn =
    document.getElementById('prev-news');

  nextBtn.onclick = () => {
    oldContainer.scrollBy({
      left: 350,
      behavior: 'smooth'
    });
  };

  prevBtn.onclick = () => {
    oldContainer.scrollBy({
      left: -350,
      behavior: 'smooth'
    });
  };

}

// ===== COUNTER ANIMATION =====
function animateCounters(){
  document.querySelectorAll('.counter').forEach(el=>{
    const target=+el.dataset.target;let current=0;
    const step=target/60;
    const timer=setInterval(()=>{current+=step;if(current>=target){el.textContent=target;clearInterval(timer)}else{el.textContent=Math.floor(current)}},25);
  });
}

// ===== CHART BARS =====
function animateCharts(){
  document.querySelectorAll('.chart-bar')
    .forEach(el=>{
      el.style.transition = 'width 1.2s ease';
    });
  document.querySelectorAll('.chart-bar-v')
    .forEach(el=>{
      el.style.transition = 'height 1.2s ease';
      el.style.height = el.dataset.height;
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnim(){
  const obs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('section-visible');e.target.classList.remove('section-hidden')}})},{threshold:.15});
  document.querySelectorAll('.section-anim').forEach(el=>{el.classList.add('section-hidden');obs.observe(el)});
  // counters & charts
  const statObs=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){animateCounters();animateCharts();statObs.unobserve(e.target)}})},{threshold:.3});
  const statSec=document.getElementById('statistik');
  if(statSec)statObs.observe(statSec);
}

// ===== NAVBAR =====
let lastScroll=0;
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('navbar');
  if(window.scrollY>50){nav.classList.add('bg-navy/95','backdrop-blur-xl','shadow-lg','shadow-navy/50')}
  else{nav.classList.remove('bg-navy/95','backdrop-blur-xl','shadow-lg','shadow-navy/50')}
  lastScroll=window.scrollY;
});

// ===== MOBILE MENU =====
function toggleMobile(){document.getElementById('mobile-menu').classList.toggle('open')}

// ===== ADMIN =====
function showAdmin(){document.getElementById('admin-login').style.display='flex'}
function hideLogin(){document.getElementById('admin-login').style.display='none'}

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

  document.getElementById('admin-panel').style.display='block';

  setAdminTab('dashboard');

  lucide.createIcons();
}

function hideAdmin(){document.getElementById('admin-panel').style.display='none'}

function setAdminTab(tab){
  document.getElementById('admin-title').textContent={dashboard:'Dashboard',berita:'Kelola Berita',hero:'Hero Beranda',guru:'Kelola Guru',statistik:'Statistik'}[tab]||'Dashboard';
  document.querySelectorAll('.admin-nav-btn').forEach(b=>{b.classList.toggle('bg-white/10',b.dataset.tab===tab);b.classList.toggle('text-gold-light',b.dataset.tab===tab)});
  const c=document.getElementById('admin-content');
  if(tab==='dashboard'){
    c.innerHTML=`<div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="glass rounded-xl p-5"><div class="text-xs text-white/40 mb-1">Total Siswa</div><div class="text-2xl font-bold gradient-text">${getTotalSiswa()}</div></div>
      <div class="glass rounded-xl p-5"><div class="text-xs text-white/40 mb-1">Tenaga Pendidik</div><div class="text-2xl font-bold gradient-text">${getTotalTenagaPendidik()}</div></div>
      <div class="glass rounded-xl p-5"><div class="text-xs text-white/40 mb-1">Berita Aktif</div><div class="text-2xl font-bold gradient-text">${news.length}</div></div>
      <div class="glass rounded-xl p-5"><div class="text-xs text-white/40 mb-1">Prestasi</div><div class="text-2xl font-bold gradient-text"></div></div>
    </div>
    <div class="glass rounded-xl p-6"><h3 class="font-bold mb-4">Aktivitas Terkini</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3 text-sm"><div class="w-2 h-2 rounded-full bg-green-400"></div><span class="text-white/60">Berita baru dipublikasikan — OSN Tingkat Kota</span><span class="text-xs text-white/30 ml-auto">2 jam lalu</span></div>
      <div class="flex items-center gap-3 text-sm"><div class="w-2 h-2 rounded-full bg-blue-400"></div><span class="text-white/60">Data guru diperbarui</span><span class="text-xs text-white/30 ml-auto">5 jam lalu</span></div>
      <div class="flex items-center gap-3 text-sm"><div class="w-2 h-2 rounded-full bg-gold"></div><span class="text-white/60">Statistik semester diperbarui</span><span class="text-xs text-white/30 ml-auto">1 hari lalu</span></div>
    </div></div>`;
  } 
    
else if(tab==='prestasi'){
c.innerHTML=`
<div class="glass rounded-2xl p-6 mb-6">
<h3 class="font-bold text-lg mb-5">
Tambah Prestasi
</h3>
<div class="grid gap-4">
<input
id="prestasi-title"
placeholder="Nama Prestasi"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
>
<input
id="prestasi-category"
placeholder="Kategori (Akademik / Non Akademik)"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
>
<textarea
id="prestasi-description"
placeholder="Keterangan Prestasi"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
></textarea>
<input
id="prestasi-image"
type="file"
accept=".jpg,.jpeg,.png,.webp"
>
<img
id="prestasi-preview"
class="hidden w-48 rounded-xl"
>
<button
onclick="submitPrestasi()"
class="btn-primary px-5 py-3 rounded-xl text-navy font-bold"
>
Simpan Prestasi
</button>
</div>
</div>

<!-- EDIT PRESTASI MODAL -->

<div 
id="edit-prestasi-modal"
class="fixed inset-0 z-[90] hidden bg-black/60 flex items-center justify-center"
>


<div class="glass rounded-2xl p-6 w-full max-w-lg">


<h3 class="font-bold text-xl mb-5">
Edit Prestasi
</h3>


<input
id="edit-prestasi-id"
type="hidden"
>


<div class="grid gap-4">


<input
id="edit-prestasi-title"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
placeholder="Nama Prestasi"
>


<input
id="edit-prestasi-category"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
placeholder="Kategori"
>


<textarea
id="edit-prestasi-description"
class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
placeholder="Keterangan"
></textarea>



<input
id="edit-prestasi-image"
type="file"
accept=".jpg,.jpeg,.png,.webp"
>



<img
id="edit-prestasi-preview"
class="w-48 rounded-xl"
/>



<div class="flex gap-3">


<button
onclick="updatePrestasi()"
class="btn-primary px-5 py-3 rounded-xl text-navy font-bold"
>
Simpan
</button>


<button
onclick="closeEditPrestasi()"
class="px-5 py-3 rounded-xl bg-red-500/20 text-red-300"
>
Batal
</button>


</div>


</div>

</div>

</div>


<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
${prestasi.map(p=>`
<div class="glass rounded-xl p-4">
<img
src="${p.image_url}"
class="w-full h-52 object-cover rounded-xl mb-3"
>
<h4 class="font-bold">
${p.title}
</h4>
<div class="text-gold-light text-sm">
${p.category || ''}
</div>
<p class="text-xs text-white/60 mt-2">
${p.description || ''}
</p>
<div class="flex gap-2 mt-4">

<button
onclick="editPrestasi(${p.id})"
class="px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-300 text-xs"
>
Edit
</button>

<button
onclick="hapusPrestasi(${p.id},'${p.image_url}')"
class="px-3 py-2 rounded-lg bg-red-500/20 text-red-300 text-xs"
>
Hapus
</button>
</div>
</div>
`).join('')}
</div>
`;
const input=document.getElementById(
'prestasi-image'
);
const preview=document.getElementById(
'prestasi-preview'
);
input.onchange=function(){
const file=this.files[0];
if(!file)return;
preview.src=
URL.createObjectURL(file);
preview.classList.remove('hidden');
};
}

  
else if(tab==='berita'){

  c.innerHTML = `
  
  <div class="flex items-center justify-between mb-6">
    
    <div>
      <h3 class="font-bold text-lg">
        Daftar Berita
      </h3>

      <p class="text-xs text-white/40 mt-1">
        Upload PNG JPG JPEG WEBP • otomatis convert WEBP • max 350KB • max lebar 1200px
      </p>
    </div>

    <button
      onclick="toggleNewsModal(true)"
      class="btn-primary px-4 py-2 rounded-lg text-navy text-xs font-bold flex items-center gap-2"
    >
      <i data-lucide="plus" style="width:14px;height:14px"></i>
      Tambah
    </button>

  </div>

  <!-- FORM -->
  <div
    id="news-modal"
    class="hidden mb-6 glass rounded-2xl p-5"
  >

    <div class="grid gap-4">

      <input
        id="news-title"
        type="text"
        placeholder="Judul berita"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
      >

      <input
        id="news-category"
        type="text"
        placeholder="Kategori berita"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none"
      >

      <textarea
        id="news-description"
        placeholder="Deskripsi berita"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm outline-none min-h-[120px]"
      ></textarea>

      <div>

        <label class="block text-sm mb-2 text-white/70">
          Upload Gambar
        </label>

        <input
          id="news-image"
          type="file"
          accept=".png,.jpg,.jpeg,.webp"
          class="w-full text-sm"
        >

      </div>

      <img
        id="preview-image"
        class="hidden w-full max-h-[250px] object-cover rounded-xl border border-white/10"
      >

      <div class="flex gap-3">

        <button
          onclick="submitBerita()"
          class="btn-primary px-5 py-3 rounded-xl text-navy font-bold text-sm"
        >
          Simpan Berita
        </button>

        <button
          onclick="toggleNewsModal(false)"
          class="px-5 py-3 rounded-xl bg-white/10 text-sm"
        >
          Batal
        </button>

      </div>

    </div>

  </div>

  <!-- LIST BERITA -->
  <div class="space-y-3">

    ${news.map(n=>`

      <div class="glass rounded-xl p-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-4">
      <img
      src="${n.image_url}"
      class="w-20 h-20 rounded-xl object-cover border border-white/10"
    >
    <div>
      <div class="font-semibold text-sm">
        ${n.title}
      </div>
      <div class="text-xs text-white/40 mt-1">
        ${n.date} • ${n.category}
      </div>
    </div>
  </div>
  <!-- ACTION BUTTON -->
  <div class="flex gap-2">
    <button
      onclick="editBerita(${n.id})"
      class="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1 transition"
    >
      <i data-lucide="pencil" style="width:14px;height:14px"></i>
      Edit
    </button>
    <button
      onclick="hapusBerita(${n.id}, '${n.image_url}')"
      class="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1 transition"
    >
      <i data-lucide="trash-2" style="width:14px;height:14px"></i>
      Hapus
    </button>
  </div>
</div>

      
    `).join('')}
  </div>
  `;

  lucide.createIcons();

  // PREVIEW IMAGE
  const input = document.getElementById('news-image');

  if(input){

    input.addEventListener('change', function(){

      const file = this.files[0];

      if(!file) return;

      const preview = document.getElementById('preview-image');

      preview.src = URL.createObjectURL(file);

      preview.classList.remove('hidden');

    });

  }

}


  else if(tab==='hero'){
  c.innerHTML = `
  <div class="glass rounded-2xl p-6 max-w-2xl">
    <h3 class="font-bold text-lg mb-2">
      Update Foto Hero Guru
    </h3>
    <p class="text-xs text-white/40 mb-5">
      Upload PNG JPG WEBP transparan untuk tampilan beranda
    </p>
    <input
      id="hero-image-input"
      type="file"
      accept=".png,.jpg,.jpeg,.webp"
      class="mb-4 w-full"
    >
    <img
      id="hero-preview"
      class="w-full max-h-[400px] object-contain rounded-2xl border border-white/10 mb-5"
    >
    <button
      onclick="uploadHeroImage()"
      class="btn-primary px-5 py-3 rounded-xl text-navy font-bold text-sm"
    >
      Upload Foto Hero
    </button>
  </div>
  `;
  const input =
    document.getElementById('hero-image-input');
  const preview =
    document.getElementById('hero-preview');
  input.addEventListener('change', function(){
    const file = this.files[0];
    if(!file) return;
    preview.src = URL.createObjectURL(file);
  });
}

  
    
 else if(tab==='guru'){
  c.innerHTML = `
  <div class="glass rounded-2xl p-5 mb-6">
    <h3 class="font-bold text-lg mb-4">
      Tambah Guru
    </h3>
    <div class="grid gap-4">
      <input
        type="text"
        id="guru-name"
        placeholder="Nama Guru"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      >
      <select
        id="guru-jabatan"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      >
        <option>Kepala Sekolah</option>
        <option>Waka Kurikulum</option>
        <option>Waka Kesiswaan</option>
        <option>Guru</option>
        <option>Staff TU</option>
        <option>Perpustakaan</option>
        <option>Tenaga Kependidikan</option>
      </select>
      <textarea
        id="guru-keterangan"
        placeholder="Keterangan"
        class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
      ></textarea>
      <input
        type="file"
        id="guru-photo"
        accept=".jpg,.jpeg,.png,.webp"
        class="w-full"
      >
      <button
        onclick="simpanGuru()"
        class="btn-primary px-5 py-3 rounded-xl text-navy font-bold"
      >
        Simpan
      </button>
    </div>
  </div>


<!-- MODAL EDIT GURU -->
<div
  id="edit-guru-modal"
  class="hidden glass rounded-2xl p-5 mb-6"
>
  <h3 class="font-bold text-lg mb-4">
    Edit Guru
  </h3>
  <input type="hidden" id="edit-guru-id">

  <div class="grid gap-4">
    <input
      id="edit-guru-name"
      type="text"
      placeholder="Nama Guru"
      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
    >
    <select
      id="edit-guru-jabatan"
      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
    >
      <option>Kepala Sekolah</option>
      <option>Waka Kurikulum</option>
      <option>Waka Kesiswaan</option>
      <option>Guru</option>
      <option>Staff TU</option>
      <option>Perpustakaan</option>
      <option>Tenaga Kependidikan</option>
    </select>
    <textarea
      id="edit-guru-keterangan"
      placeholder="Keterangan"
      class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10"
    ></textarea>
    <input
      id="edit-guru-photo"
      type="file"
      accept=".jpg,.jpeg,.png,.webp"
    >
    <img
      id="edit-guru-preview"
      class="w-40 rounded-xl hidden"
    >
    <div class="flex gap-3">
      <button
        onclick="updateGuru()"
        class="btn-primary px-5 py-3 rounded-xl text-navy font-bold"
      >
        Simpan Perubahan
      </button>
      <button
        onclick="closeEditGuru()"
        class="px-5 py-3 rounded-xl bg-white/10"
      >
        Batal
      </button>
    </div>
  </div>
</div>

  
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

  
${teachers.map(t=>`
<div class="glass rounded-xl p-4">

  <img
    src="${t.photo_url}"
    class="w-full h-56 object-cover rounded-xl mb-3"
  >

  <h4 class="font-bold">
    ${t.name}
  </h4>

  <div class="text-gold-light text-sm mb-2">
    ${t.jabatan}
  </div>

  <p class="text-xs text-white/60 mb-4">
    ${t.keterangan || ''}
  </p>

  <div class="flex gap-2">

    <button
      onclick="editGuru(${t.id})"
      class="px-3 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold"
    >
      Edit
    </button>

    <button
      onclick="hapusGuru(${t.id}, '${t.photo_url}')"
      class="px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold"
    >
      Hapus
    </button>

  </div>

</div>
`).join('')}


    
  </div>
  `;
}


else if(tab==='statistik'){
c.innerHTML = `
<div class="glass rounded-2xl p-6">
<h3 class="font-bold text-lg mb-6">
Data Statistik Siswa
</h3>
<div class="grid md:grid-cols-3 gap-6">
<div class="glass rounded-xl p-4">
<h4 class="font-bold mb-4">
Kelas VII
</h4>
<input
id="k7l"
type="number"
placeholder="Laki-laki"
class="stat-input"
value="${statistikSiswa?.kelas7_laki || 0}"
>
<input
id="k7p"
type="number"
placeholder="Perempuan"
class="stat-input mt-3"
value="${statistikSiswa?.kelas7_perempuan || 0}"
>
</div>
<div class="glass rounded-xl p-4">
<h4 class="font-bold mb-4">
Kelas VIII
</h4>
<input
id="k8l"
type="number"
placeholder="Laki-laki"
class="stat-input"
value="${statistikSiswa?.kelas8_laki || 0}"
>
<input
id="k8p"
type="number"
placeholder="Perempuan"
class="stat-input mt-3"
value="${statistikSiswa?.kelas8_perempuan || 0}"
>
</div>
<div class="glass rounded-xl p-4">
<h4 class="font-bold mb-4">
Kelas IX
</h4>
<input
id="k9l"
type="number"
placeholder="Laki-laki"
class="stat-input"
value="${statistikSiswa?.kelas9_laki || 0}"
>
<input
id="k9p"
type="number"
placeholder="Perempuan"
class="stat-input mt-3"
value="${statistikSiswa?.kelas9_perempuan || 0}"
>
</div>
</div>
<button
onclick="simpanStatistikSiswa()"
class="btn-primary px-5 py-3 rounded-xl mt-6 text-navy font-bold"
>
Simpan Statistik
</button>
</div>
`;
}

  
  lucide.createIcons();
}

async function submitPrestasi(){

const title=
document.getElementById('prestasi-title').value;

const category=
document.getElementById('prestasi-category').value;

const description=
document.getElementById('prestasi-description').value;

const file=
document.getElementById('prestasi-image').files[0];

if(!title || !file){

alert("Nama prestasi dan foto wajib diisi");

return;

}

const compressed=
await compressImage(file);

const fileName=
Date.now()
+
"-prestasi.webp";

const {error:uploadError}
=
await supabaseClient.storage
.from('prestasi')
.upload(
fileName,
compressed,
{
contentType:'image/webp'
}
);

if(uploadError){

alert(uploadError.message);
return;

}

const {data:urlData}
=
supabaseClient.storage
.from('prestasi')
.getPublicUrl(fileName);


const today=
new Date()
.toLocaleDateString('id-ID');

const {error}
=
await supabaseClient
.from('prestasi')
.insert({

title,
category,
description,
image_url:urlData.publicUrl,
date:today

});



if(error){

alert(error.message);
return;

}

alert("Prestasi berhasil ditambahkan");

await loadPrestasi();
await loadTotalPrestasi();

setAdminTab('prestasi');

}

// ===== EDIT PRESTASI =====
async function editPrestasi(id){

  const p =
    prestasi.find(
      item => item.id === id
    );

  if(!p) return;


  document.getElementById(
    'edit-prestasi-id'
  ).value = p.id;


  document.getElementById(
    'edit-prestasi-title'
  ).value = p.title;


  document.getElementById(
    'edit-prestasi-category'
  ).value = p.category || '';


  document.getElementById(
    'edit-prestasi-description'
  ).value = p.description || '';


  const preview =
    document.getElementById(
      'edit-prestasi-preview'
    );


  preview.src =
    p.image_url;


  preview.classList.remove(
    'hidden'
  );


  document
  .getElementById(
    'edit-prestasi-modal'
  )
  .classList.remove(
    'hidden'
  );

}


// ===== CLOSE EDIT PRESTASI =====
function closeEditPrestasi(){
document
.getElementById(
'edit-prestasi-modal'
)
.classList.add(
'hidden'
);

}

// ===== UPDATE PRESTASI =====

async function updatePrestasi(){

const id =
document.getElementById(
'edit-prestasi-id'
).value;

const title =
document.getElementById(
'edit-prestasi-title'
).value;

const category =
document.getElementById(
'edit-prestasi-category'
).value;

const description =
document.getElementById(
'edit-prestasi-description'
).value;

const file =
document.getElementById(
'edit-prestasi-image'
).files[0];

const p =
prestasi.find(
item => item.id == id
);


let image_url =
p.image_url;


// ===== JIKA GANTI FOTO =====

if(file){

const compressed =
await compressImage(file);

const fileName =
Date.now()
+'.webp';

const {
error:uploadError
}
=
await supabaseClient
.storage
.from('prestasi')
.upload(
fileName,
compressed,
{
contentType:
'image/webp'
}
);

if(uploadError){

alert(
uploadError.message
);

return;

}

const {
data:urlData
}
=
supabaseClient
.storage
.from('prestasi')
.getPublicUrl(
fileName
);

image_url =
urlData.publicUrl;

// HAPUS FOTO LAMA

try{

const oldFile =
p.image_url
.split('/')
.pop();

await supabaseClient
.storage
.from('prestasi')
.remove([
oldFile
]);

}catch(err){

console.error(err);

}

}

const {
error
}
=
await supabaseClient
.from('prestasi')
.update({

title,
category,
description,
image_url

})
.eq(
'id',
id
);

if(error){

alert(
error.message
);

return;

}

alert(
"Prestasi berhasil diperbarui"
);

closeEditPrestasi();

await loadPrestasi();


setAdminTab(
'prestasi'
);

}


async function hapusPrestasi(id,imageUrl){

if(!confirm(
"Yakin hapus prestasi ini?"
))
return;

try{

const fileName=
imageUrl.split('/').pop();

await supabaseClient.storage
.from('prestasi')
.remove([
fileName
]);

}catch(e){

console.log(e);

}

const {error}
=
await supabaseClient
.from('prestasi')
.delete()
.eq('id',id);

if(error){

alert(error.message);
return;

}

alert(
"Prestasi berhasil dihapus"
);

await loadPrestasi();

setAdminTab('prestasi');

}

async function tambahBerita() {

  // ===== FORM INPUT =====
  const title = prompt("Judul berita:");
  if (!title) return;

  const category = prompt("Kategori berita:");
  if (!category) return;

  const description = prompt("Deskripsi berita:");
  if (!description) return;

  // ===== FILE PICKER =====
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".png,.jpg,.jpeg,.webp";

  input.onchange = async () => {

    const file = input.files[0];

    if (!file) return;

    // ===== VALIDASI FILE =====
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/webp"
    ];

    if (!allowed.includes(file.type)) {
      alert("Format harus PNG JPG JPEG WEBP");
      return;
    }

    // ===== LOADING =====
    alert("Sedang memproses gambar...");

    // ===== COMPRESS & CONVERT WEBP =====
    const compressedBlob = await compressImage(file);

    // ===== NAMA FILE =====
    const fileName =
      Date.now() + "-" +
      Math.random().toString(36).substring(2) +
      ".webp";

    // ===== UPLOAD STORAGE =====
    const { error: uploadError } =
      await supabaseClient.storage
        .from("berita")
        .upload(fileName, compressedBlob, {
          contentType: "image/webp",
          upsert: false
        });

    if (uploadError) {
      console.error(uploadError);
      alert(uploadError.message);
      return;
    }

    // ===== AMBIL URL PUBLIC =====
    const { data: publicData } =
      supabaseClient.storage
        .from("berita")
        .getPublicUrl(fileName);

    const image_url = publicData.publicUrl;

    // ===== TANGGAL =====
    const today = new Date().toLocaleDateString("id-ID");

    // ===== INSERT DATABASE =====
    const { error } = await supabaseClient
      .from("berita")
      .insert([
        {
          title,
          category,
          description,
          image_url,
          date: today
        }
      ]);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    alert("Berita berhasil ditambahkan");

    await loadNews();

    setAdminTab("berita");
  };

  input.click();
}

function toggleNewsModal(show){
  const modal = document.getElementById('news-modal');
  if(!modal) return;
  modal.classList.toggle('hidden', !show);
}

async function submitBerita(){

  const title =
    document.getElementById('news-title').value;

  const category =
    document.getElementById('news-category').value;

  const description =
    document.getElementById('news-description').value;

  const file =
    document.getElementById('news-image').files[0];

  if(!title || !category || !description || !file){

    alert("Lengkapi semua data");

    return;

  }

  // VALIDASI
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp"
  ];

  if(!allowed.includes(file.type)){

    alert("Format gambar tidak valid");

    return;

  }

  alert("Memproses gambar...");

  // COMPRESS
  const compressedBlob =
    await compressImage(file);

  // FILE NAME
  const fileName =
    Date.now() +
    "-" +
    Math.random().toString(36).substring(2) +
    ".webp";

  // UPLOAD
  const { error: uploadError } =
    await supabaseClient.storage
      .from("berita")
      .upload(fileName, compressedBlob, {
        contentType: "image/webp"
      });

  if(uploadError){

    console.error(uploadError);

    alert(uploadError.message);

    return;

  }

  // PUBLIC URL
  const { data: publicData } =
    supabaseClient.storage
      .from("berita")
      .getPublicUrl(fileName);

  const image_url =
    publicData.publicUrl;

  // DATE
  const today =
    new Date().toLocaleDateString('id-ID');

  // INSERT DATABASE
  const { error } =
    await supabaseClient
      .from('berita')
      .insert([
        {
          title,
          category,
          description,
          image_url,
          date: today
        }
      ]);

  if(error){

    console.error(error);

    alert(error.message);

    return;

  }

  alert("Berita berhasil ditambahkan");

  await loadNews();

  setAdminTab('berita');

}


async function simpanGuru(){
  const name =
    document.getElementById('guru-name').value;
  const jabatan =
    document.getElementById('guru-jabatan').value;
  const keterangan =
    document.getElementById('guru-keterangan').value;
  const file =
    document.getElementById('guru-photo').files[0];
  if(!name || !file){
    alert('Nama dan foto wajib diisi');
    return;
  }
  const compressedBlob =
    await compressTeacherImage(file);
  const fileName =
    Date.now() + '.webp';
  const { error: uploadError } =
    await supabaseClient.storage
      .from('guru')
      .upload(fileName, compressedBlob,{
        contentType:'image/webp'
      });
  if(uploadError){
    alert(uploadError.message);
    return;
  }
  const { data:urlData } =
    supabaseClient.storage
      .from('guru')
      .getPublicUrl(fileName);
  const urutan =
    getUrutanJabatan(jabatan);
  const { error } =
    await supabaseClient
      .from('guru')
      .insert([{
        name,
        jabatan,
        keterangan,
        photo_url:urlData.publicUrl,
        urutan
      }]);
  if(error){
    alert(error.message);
    return;
  }
  alert('Guru berhasil ditambahkan');
  await loadTeachers();
  setAdminTab('guru');
}


// ===== HAPUS GURU =====
async function hapusGuru(
  id,
  photoUrl
){
  const yakin =
    confirm(
      "Yakin ingin menghapus guru ini?"
    );
  if(!yakin) return;
  try{
    const fileName =
      photoUrl.split('/').pop();
    if(fileName){
      await supabaseClient
        .storage
        .from('guru')
        .remove([
          fileName
        ]);
    }
  }catch(err){
    console.error(err);
  }
  const { error } =
    await supabaseClient
      .from('guru')
      .delete()
      .eq('id', id);
  if(error){
    console.error(error);
    alert(error.message);
    return;
  }
  alert(
    "Guru berhasil dihapus"
  );
  await loadTeachers();
  setAdminTab('guru');
}


// ===== EDIT BERITA =====
async function editBerita(id){

  const berita = news.find(n => n.id === id);

  if(!berita) return;

  const title = prompt("Edit Judul", berita.title);
  if(title === null) return;

  const category = prompt("Edit Kategori", berita.category);
  if(category === null) return;

  const description = prompt("Edit Deskripsi", berita.description);
  if(description === null) return;

  const { error } = await supabaseClient
    .from('berita')
    .update({
      title,
      category,
      description
    })
    .eq('id', id);

  if(error){
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Berita berhasil diupdate");

  await loadNews();

  setAdminTab('berita');
}


// ===== HAPUS BERITA =====
async function hapusBerita(id, imageUrl){

  const yakin = confirm("Yakin ingin menghapus berita ini?");

  if(!yakin) return;

  // ===== HAPUS FILE STORAGE =====
  try{

    const fileName = imageUrl.split('/').pop();

    if(fileName){

      await supabaseClient.storage
        .from('berita')
        .remove([fileName]);

    }

  }catch(err){
    console.error(err);
  }

  // ===== HAPUS DATABASE =====
  const { error } = await supabaseClient
    .from('berita')
    .delete()
    .eq('id', id);

  if(error){
    console.error(error);
    alert(error.message);
    return;
  }

  alert("Berita berhasil dihapus");

  await loadNews();

  setAdminTab('berita');
}


// ===== EDIT GURU =====
async function editGuru(id){
  const guru =
    teachers.find(
      t => t.id === id
    );
  if(!guru) return;
  document.getElementById(
    'edit-guru-id'
  ).value = guru.id;
  document.getElementById(
    'edit-guru-name'
  ).value = guru.name;
  document.getElementById(
    'edit-guru-jabatan'
  ).value = guru.jabatan;
  document.getElementById(
    'edit-guru-keterangan'
  ).value =
    guru.keterangan || '';
  const preview =
    document.getElementById(
      'edit-guru-preview'
    );
  preview.src =
    guru.photo_url;
  preview.classList.remove(
    'hidden'
  );
  document
    .getElementById(
      'edit-guru-modal'
    )
    .classList.remove(
      'hidden'
    );
}


// ===== CLOSE EDIT GURU =====
function closeEditGuru(){
document
.getElementById(
'edit-guru-modal'
)
.classList.add(
'hidden'
);
}


// ===== Update GURU =====
async function updateGuru(){
  const id =
    document.getElementById(
      'edit-guru-id'
    ).value;
  const name =
    document.getElementById(
      'edit-guru-name'
    ).value;
  const jabatan =
    document.getElementById(
      'edit-guru-jabatan'
    ).value;
  const keterangan =
    document.getElementById(
      'edit-guru-keterangan'
    ).value;
  const file =
    document.getElementById(
      'edit-guru-photo'
    ).files[0];
  const guru =
    teachers.find(
      t => t.id == id
    );
  let photo_url =
    guru.photo_url;

  // ===== GANTI FOTO =====
  if(file){
    const compressed =
      await compressTeacherImage(
        file
      );
    const fileName =
      Date.now() +
      ".webp";
    const {
      error:uploadError
    } =
    await supabaseClient
      .storage
      .from('guru')
      .upload(
        fileName,
        compressed,
        {
          contentType:
            'image/webp'
        }
      );

    if(uploadError){
      alert(
        uploadError.message
      );

      return;
    }
    const {
      data:urlData
    } =
    supabaseClient.storage
      .from('guru')
      .getPublicUrl(
        fileName
      );
    photo_url =
      urlData.publicUrl;

    // HAPUS FOTO LAMA
    try{
      const oldFile =
        guru.photo_url
        .split('/')
        .pop();
      await supabaseClient
        .storage
        .from('guru')
        .remove([
          oldFile
        ]);
    }catch(err){
      console.error(err);
    }
  }
  const urutan =
    getUrutanJabatan(
      jabatan
    );
  const { error } =
    await supabaseClient
      .from('guru')
      .update({
        name,
        jabatan,
        keterangan,
        photo_url,
        urutan
      })
      .eq('id', id);
  if(error){
    alert(error.message);
    return;
  }
  alert(
    "Guru berhasil diperbarui"
  );
  closeEditGuru();
  await loadTeachers();
  setAdminTab('guru');
}


// ===== ELEMENT SDK =====
const defaultConfig={
  hero_title:'Mewujudkan Generasi Cerdas, Berkarakter, dan Berprestasi',
  hero_subtitle:'Membangun masa depan cerah melalui pendidikan berkualitas, karakter unggul, dan prestasi gemilang di SMP Negeri 18 Samarinda.',
  visi_text:'"Unggul Prestasi Akademik dan Non Akademik Serta Berkarakter Mulia."',
  footer_address:'Jl. Cipto Mangunkusumo Gang 2 RT.04 No.39 Kel. Harapan Baru, Kec. Loa Janan Ilir Samarinda, Kalimantan Timur',
  background_color:'#0a1628',
  surface_color:'#1a3a6b',
  text_color:'#ffffff',
  primary_action_color:'#d4a853',
  secondary_action_color:'#2d6bc4',
  font_family:'Poppins',
  font_size:16
};

function applyConfig(cfg){
  const h=document.getElementById('hero-title');
  if(h){
    const t=cfg.hero_title||defaultConfig.hero_title;
    const parts=t.split(',');
    if(parts.length>=2){h.innerHTML=parts[0]+', <span class="gradient-text">'+parts.slice(1).join(',')+'</span>'}
    else h.textContent=t;
  }
  const s=document.getElementById('hero-subtitle');if(s)s.textContent=cfg.hero_subtitle||defaultConfig.hero_subtitle;
  const v=document.getElementById('visi-content');if(v)v.textContent=cfg.visi_text||defaultConfig.visi_text;
  const f=document.getElementById('footer-address');if(f)f.textContent=cfg.footer_address||defaultConfig.footer_address;

  const bg=cfg.background_color||defaultConfig.background_color;
  const sf=cfg.surface_color||defaultConfig.surface_color;
  const tc=cfg.text_color||defaultConfig.text_color;
  const pa=cfg.primary_action_color||defaultConfig.primary_action_color;
  const sa=cfg.secondary_action_color||defaultConfig.secondary_action_color;
  document.body.style.backgroundColor=bg;
  document.body.style.color=tc;

  const font=cfg.font_family||defaultConfig.font_family;
  const size=cfg.font_size||defaultConfig.font_size;
  document.body.style.fontFamily=`${font}, Poppins, sans-serif`;
  document.body.style.fontSize=size+'px';
  document.querySelectorAll('h1').forEach(e=>e.style.fontFamily=`${font}, Poppins, sans-serif`);
  document.querySelectorAll('h2').forEach(e=>e.style.fontFamily=`${font}, Poppins, sans-serif`);
}

function updateDateTime(){
  const el = document.getElementById('live-datetime');

  if(!el) return;

  const now = new Date();

  const tanggal = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const jam = now.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).replace(/\./g, ':');

  el.textContent = `${tanggal} | ${jam}`;
}



updateDateTime();

setInterval(updateDateTime, 1000);
 



const SUPABASE_URL = "https://etnrxxaijfrivbjlufju.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bnJ4eGFpamZyaXZiamx1Zmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDU4OTUsImV4cCI6MjA5NDQyMTg5NX0.Hf9Ro831c4nl74UBQ1s8uJOdSBQYOUWesf6coYGX_6Q";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// fungsi kompres berita
async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      img.src = e.target.result;
    };
    img.onload = async () => {
      // ===== MAX WIDTH =====
      const MAX_WIDTH = 1200;
      let width = img.width;
      let height = img.height;
      if (width > MAX_WIDTH) {
        height = height * (MAX_WIDTH / width);
        width = MAX_WIDTH;
      }

      // ===== CANVAS =====
      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      // ===== COMPRESS LOOP =====
      let quality = 0.9;
      const targetSize = 350 * 1024;
      async function generateBlob(q) {
        return new Promise((res) => {
          canvas.toBlob(
            (blob) => res(blob),
            "image/webp",
            q
          );
        });
      }
      let blob = await generateBlob(quality);
      while (blob.size > targetSize && quality > 0.1) {
        quality -= 0.05;
        blob = await generateBlob(quality);
      }
      resolve(blob);
    };
  });
}


// ===== Fungsi COMPRESS FOTO GURU =====
async function compressTeacherImage(file){
  return new Promise((resolve)=>{
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e=>{
      img.src = e.target.result;
    };
    img.onload = async ()=>{
      const canvas =
        document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 600;
      const ctx =
        canvas.getContext("2d");
      ctx.drawImage(
        img,
        0,
        0,
        400,
        600
      );
      let quality = 0.8;
      const target =
        50 * 1024;
      function makeBlob(q){
        return new Promise(res=>{
          canvas.toBlob(
            b=>res(b),
            "image/webp",
            q
          );
        });
      }
      let blob =
        await makeBlob(quality);
      while(
        blob.size > target &&
        quality > 0.1
      ){
        quality -= 0.05;
        blob = await makeBlob(quality);
      }
      resolve(blob);
    };
  });
}


// ===== DETAIL PRESTASI =====
function openPrestasiDetail(id){

const p =
prestasi.find(
item=>item.id === id
);

if(!p) return;

document.getElementById(
'prestasi-detail-image'
).src =
p.image_url;

document.getElementById(
'prestasi-detail-category'
).textContent =
p.category || '';

document.getElementById(
'prestasi-detail-title'
).textContent =
p.title;

document.getElementById(
'prestasi-detail-description'
).textContent =
p.description || '';

const modal =
document.getElementById(
'prestasi-detail-modal'
);

modal.classList.remove(
'hidden'
);

modal.style.display =
'flex';

}

// ===== CLOSE DETAIL PRESTASI =====
function closePrestasiDetail(){

const modal =
document.getElementById(
'prestasi-detail-modal'
);

modal.style.display =
'none';

modal.classList.add(
'hidden'
);

}


// ===== DETAIL BERITA =====
function openNewsDetail(id){
  const berita = news.find(n => n.id === id);
  if(!berita) return;
  document.getElementById('detail-image').src =
    berita.image_url;
  document.getElementById('detail-category').textContent =
    berita.category;
  document.getElementById('detail-date').textContent =
    berita.date;
  document.getElementById('detail-title').textContent =
    berita.title;
  document.getElementById('detail-description').textContent =
    berita.description;
  const modal =
    document.getElementById('news-detail-modal');
  modal.style.display = 'flex';
}
// ===== CLOSE DETAIL =====
function closeNewsDetail(){
  document.getElementById('news-detail-modal')
    .style.display = 'none';
}
// ===== CLOSE SAAT KLIK BACKGROUND =====
document.addEventListener('click', function(e){

const newsModal =
document.getElementById(
'news-detail-modal'
);

if(e.target === newsModal){
closeNewsDetail();
}

const prestasiModal =
document.getElementById(
'prestasi-detail-modal'
);

if(e.target === prestasiModal){
closePrestasiDetail();
}

});


// ===== HERO IMAGE =====
async function uploadHeroImage(){
  const file =
    document.getElementById('hero-image-input')
    .files[0];
  if(!file){
    alert("Pilih gambar terlebih dahulu");
    return;
  }
  alert("Mengupload gambar...");


// compress
const compressedBlob =
  await compressImage(file);

// ambil nama file lama
const { data: oldHero } =
  await supabaseClient
    .from('website_settings')
    .select('value')
    .eq('key','hero_image')
    .single();

// nama file baru
const fileName =
  `guru-hero-${Date.now()}.webp`;

  

  // upload baru
  const { error } =
    await supabaseClient.storage
      .from('hero')
      .upload(fileName, compressedBlob, {
        contentType:'image/webp',
        upsert:true
      });
  if(error){
    console.error(error);
    alert(error.message);
    return;
  }


// simpan file terbaru ke database hero
const { error: settingError } =
await supabaseClient
.from('website_settings')
.upsert({
key:'hero_image',
value:fileName
});

if(settingError){
console.error(settingError);
alert(settingError.message);
return;
}


// hapus file lama
if(
  oldHero?.value &&
  oldHero.value !== fileName
){

  const { error: deleteError } =
    await supabaseClient.storage
      .from('hero')
      .remove([
        oldHero.value
      ]);

  if(deleteError){
    console.warn(
      'Gagal menghapus file lama:',
      deleteError.message
    );
  }

}

  

  // SIMPAN NAMA FILE HERO TERBARU
  await supabaseClient
  .from('website_settings')
  .upsert({
    key: 'hero_image',
    value: fileName
  });

  
  await loadHeroImage();  


  alert("Foto hero berhasil diupdate");
}



// ===== LOAD HERO IMAGE =====
async function loadHeroImage(){

  const { data, error } =
    await supabaseClient
      .from('website_settings')
      .select('value')
      .eq('key','hero_image')
      .single();

  if(error || !data?.value){
    return;
  }

  const fileName = data.value;

  const { data:urlData } =
    supabaseClient.storage
      .from('hero')
      .getPublicUrl(fileName);

  const img =
    document.getElementById(
      'hero-guru-image'
    );

  if(img){
    img.src =
      urlData.publicUrl +
      '?t=' +
      Date.now();
  }

}

loadHeroImage();


// ===== INIT =====
loadTeachers();
loadNews();
loadPrestasi();
loadTotalPrestasi();
loadHeroImage();
loadStatistikSiswa();

lucide.createIcons();
initScrollAnim();
