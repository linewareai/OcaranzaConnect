(() => {
  const STORAGE = {
    passwordHash: 'oc_general_admin_password_hash_v1',
    session: 'oc_general_admin_session_v1'
  };

  const DEMO = {
    hotel: {
      name: 'Hotel Ocaranza',
      short: 'H Ocaranza',
      icon: 'H',
      description: 'PMS, recepción, reservas, habitaciones y operación hotelera.',
      active: true
    },
    minimarket: {
      name: 'Minimarket Ocaranza',
      short: 'Ocaranza Market',
      icon: 'M',
      description: 'Inventario, caja, ventas y operación del minimarket.',
      active: false
    },
    restaurant: {
      name: 'Restaurante Ocaranza',
      short: 'Ocaranza Restaurant',
      icon: 'R',
      description: 'Mesas, comandas, carta, caja y operación del restaurante.',
      active: false
    }
  };

  const HOTEL_ROOMS = [
    {n:'201',floor:2,status:'available',guest:'',cap:2},
    {n:'202',floor:2,status:'occupied',guest:'Valentina Pérez',cap:2},
    {n:'203',floor:2,status:'occupied',guest:'Tomás Rojas',cap:3},
    {n:'204',floor:2,status:'available',guest:'',cap:2},
    {n:'205',floor:2,status:'maintenance',guest:'',cap:2},
    {n:'301',floor:3,status:'available',guest:'',cap:2},
    {n:'302',floor:3,status:'occupied',guest:'Camila Soto',cap:2},
    {n:'303',floor:3,status:'available',guest:'',cap:3},
    {n:'304',floor:3,status:'occupied',guest:'Diego Morales',cap:2},
    {n:'305',floor:3,status:'blocked',guest:'',cap:2}
  ];

  const HOTEL_RESERVATIONS = [
    {id:1,code:'OC-1048',guest:'Valentina Pérez',room:'202',arrival:0,departure:2,status:'checked_in',channel:'Directo',total:148000},
    {id:2,code:'OC-1049',guest:'Tomás Rojas',room:'203',arrival:0,departure:4,status:'confirmed',channel:'Booking.com',total:296000},
    {id:3,code:'OC-1050',guest:'Camila Soto',room:'302',arrival:2,departure:5,status:'confirmed',channel:'Directo',total:222000},
    {id:4,code:'OC-1051',guest:'Diego Morales',room:'304',arrival:1,departure:3,status:'confirmed',channel:'Expedia',total:184000},
    {id:5,code:'OC-1052',guest:'Martín Silva',room:'201',arrival:4,departure:7,status:'tentative',channel:'WhatsApp',total:198000},
    {id:6,code:'OC-1053',guest:'Paula Díaz',room:'305',arrival:6,departure:9,status:'cancelled',channel:'Directo',total:162000}
  ];

  const HOTEL_GUESTS = [
    {name:'Valentina Pérez',username:'valeperez',room:'202',stay:'30 sep → 02 oct',status:'active'},
    {name:'Tomás Rojas',username:'tomas.rojas',room:'203',stay:'30 sep → 04 oct',status:'active'},
    {name:'Camila Soto',username:'camisoto',room:'302',stay:'02 oct → 05 oct',status:'confirmed'},
    {name:'Diego Morales',username:'dmorales',room:'304',stay:'01 oct → 03 oct',status:'confirmed'}
  ];

  const HOTEL_HOUSEKEEPING = [
    {room:'201',status:'clean',note:'Lista para llegada'},
    {room:'202',status:'inspected',note:'Huésped en casa'},
    {room:'203',status:'inspected',note:'Huésped en casa'},
    {room:'204',status:'clean',note:'Sin asignación'},
    {room:'205',status:'out_of_order',note:'Revisar ducha'},
    {room:'301',status:'clean',note:'Lista para llegada'},
    {room:'302',status:'inspected',note:'Huésped en casa'},
    {room:'303',status:'clean',note:'Próxima llegada'},
    {room:'304',status:'inspected',note:'Huésped en casa'},
    {room:'305',status:'out_of_order',note:'Bloqueada'}
  ];

  const HOTEL_OPERATIONS = [
    {title:'Revisión ducha',room:'205',priority:'Urgente',status:'open'},
    {title:'Cambio de ampolleta',room:'301',priority:'Normal',status:'in_progress'}
  ];

  const HOTEL_ORDERS = [
    {guest:'Valentina Pérez',room:'202',item:'Botella de agua',amount:3500,status:'delivered'},
    {guest:'Tomás Rojas',room:'203',item:'Tour Centro Histórico',amount:42000,status:'pending'},
    {guest:'Camila Soto',room:'302',item:'Desayuno adicional',amount:8000,status:'preparing'}
  ];

  const state = {
    screen:'auth',
    tab:'dashboard',
    from:startOfToday(),
    search:'',
    moreOpen:false,
    menuOpen:false
  };

  const NAV = [
    ['dashboard','⌂','Inicio'],
    ['calendar','▦','Calendario'],
    ['reservations','▤','Reservas'],
    ['rooms','▥','Habitaciones'],
    ['guests','♙','Huéspedes'],
    ['operations','⚙','Operación'],
    ['orders','✦','Pedidos'],
    ['finance','$','Caja'],
    ['reports','◫','Reportes'],
    ['settings','⚙','Configuración']
  ];

  const app = document.getElementById('app');
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalKicker = document.getElementById('modal-kicker');
  const modalBody = document.getElementById('modal-body');

  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function money(value){
    return '$' + Number(value || 0).toLocaleString('es-CL');
  }

  function startOfToday(){
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  }

  function addDays(date,count){
    const d = new Date(date);
    d.setDate(d.getDate()+count);
    return d;
  }

  function dateKey(date){ return date.toISOString().slice(0,10); }

  function dateLabel(date){
    return date.toLocaleDateString('es-CL',{day:'2-digit',month:'short'});
  }

  function longDate(date){
    return date.toLocaleDateString('es-CL',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  }

  function statusLabel(status){
    return ({
      available:'Disponible',occupied:'Ocupada',maintenance:'Mantención',blocked:'Bloqueada',
      clean:'Limpia',cleaning:'En limpieza',inspected:'Inspeccionada',dirty:'Sucia',
      out_of_order:'Fuera de servicio',confirmed:'Confirmada',checked_in:'Check-in',
      tentative:'Tentativa',cancelled:'Cancelada',pending:'Pendiente',preparing:'En preparación',
      delivered:'Entregado',open:'Abierto',in_progress:'En curso',active:'Activo'
    })[status] || status;
  }

  function badge(status){
    const cls = ['occupied','checked_in','confirmed','inspected','clean','delivered','active'].includes(status) ? 'green'
      : ['tentative','preparing','in_progress'].includes(status) ? 'gold'
      : ['cancelled','maintenance','blocked','out_of_order'].includes(status) ? 'red' : 'gray';
    return '<span class="badge '+cls+'">'+esc(statusLabel(status))+'</span>';
  }

  async function hashPassword(password){
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256',bytes);
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  function hasPassword(){
    try{return Boolean(localStorage.getItem(STORAGE.passwordHash))}catch{return false}
  }

  function hasSession(){
    try{return localStorage.getItem(STORAGE.session)==='active'}catch{return false}
  }

  function setSession(){
    try{localStorage.setItem(STORAGE.session,'active')}catch{}
  }

  function clearSession(){
    try{localStorage.removeItem(STORAGE.session)}catch{}
  }

  function passwordEye(id,toggleId){
    const input=document.getElementById(id),btn=document.getElementById(toggleId);
    if(!input||!btn)return;
    btn.addEventListener('click',()=>{
      const show=input.type==='password';
      input.type=show?'text':'password';
      btn.setAttribute('aria-label',show?'Ocultar contraseña':'Mostrar contraseña');
      btn.innerHTML=show
        ? '<svg viewBox="0 0 24 24"><path d="M3 3l18 18"></path><path d="M9.9 5.9A10.2 10.2 0 0 1 12 5.7c6.1 0 9.5 6.3 9.5 6.3a18 18 0 0 1-3.2 3.8"></path><path d="M6.6 6.6C3.8 8.2 2.5 12 2.5 12s3.4 6.3 9.5 6.3c1.2 0 2.3-.2 3.2-.5"></path></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M2.5 12s3.4-5.4 9.5-5.4 9.5 5.4 9.5 5.4-3.4 5.4-9.5 5.4S2.5 12 2.5 12Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg>';
    });
  }

  function splash(){
    state.screen='splash';
    const first='Ocaranza'.split('').map((c,i)=>'<span style="animation-delay:'+(0.12+i*0.075)+'s">'+esc(c)+'</span>').join('');
    const second='Connect'.split('').map((c,i)=>'<span style="animation-delay:'+(0.72+i*0.075)+'s">'+esc(c)+'</span>').join('');
    app.innerHTML=
      '<main class="oc-auth"><div class="oc-auth-stage"><div class="oc-splash-logo"><div class="oc-splash-word top">'+first+'</div><div class="oc-splash-word bottom">'+second+'</div></div><div class="oc-splash-sub">Administración · Hospitality · Commerce</div><div class="oc-splash-line"></div></div></main>';
    const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(()=>showLogin(),reduced?400:3100);
  }

  function showLogin(){
    state.screen='login';
    const first=hasPassword();
    app.innerHTML=
      '<main class="oc-auth"><div class="oc-auth-stage">'+
      '<div class="oc-login-brand"><div class="brand-word">Ocaranza<span>Connect</span></div><small>Administración general</small></div>'+
      '<section class="oc-auth-card">'+
      '<span class="eyebrow">'+(first?'Acceso privado':'Primer acceso')+'</span>'+
      '<h1>'+(first?'Bienvenido':'Configura tu acceso')+'</h1>'+
      '<p>'+(first?'Ingresa al centro general para acceder al Hotel, Minimarket y Restaurante.':'Esta es la primera vez que se abre el portal. El usuario está definido como <strong>adminoca</strong>. Ahora establece la contraseña privada que quedará guardada para próximos accesos.')+'</p>'+
      '<form id="auth-form">'+
      '<div class="oc-field"><label>Usuario</label><input name="username" value="adminoca" readonly autocomplete="username"></div>'+
      '<div class="oc-field"><label>Contraseña</label><div class="oc-pass-wrap"><input id="oc-password" name="password" type="password" required minlength="8" autocomplete="'+(first?'current-password':'new-password')+'"><button type="button" class="oc-eye" id="oc-eye" aria-label="Mostrar contraseña"><svg viewBox="0 0 24 24"><path d="M2.5 12s3.4-5.4 9.5-5.4 9.5 5.4 9.5 5.4-3.4 5.4-9.5 5.4-9.5-5.4-9.5-5.4Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg></button></div></div>'+
      (first?'':'<div class="oc-field"><label>Repetir contraseña</label><div class="oc-pass-wrap"><input id="oc-password-confirm" name="confirm" type="password" required minlength="8" autocomplete="new-password"><button type="button" class="oc-eye" id="oc-eye-confirm" aria-label="Mostrar contraseña"><svg viewBox="0 0 24 24"><path d="M2.5 12s3.4-5.4 9.5-5.4 9.5 5.4 9.5 5.4-3.4 5.4-9.5 5.4-9.5-5.4-9.5-5.4Z"></path><circle cx="12" cy="12" r="2.5"></circle></svg></button></div></div>')+
      '<button class="oc-submit" id="auth-submit">'+(first?'Ingresar al portal':'Guardar contraseña y continuar')+'</button>'+
      '<div id="auth-error"></div></form>'+
      '<div class="oc-note">'+(first?'Usuario fijo: <strong>adminoca</strong>. La contraseña no está incrustada en el código.':'La contraseña se fija únicamente después de que la establezcas en este primer acceso. No se escribe en el código fuente.')+'</div>'+
      '</section><div class="oc-footer">OcaranzaConnect · <strong>Administración general</strong></div>'+
      '</div></main>';
    passwordEye('oc-password','oc-eye');
    if(!first)passwordEye('oc-password-confirm','oc-eye-confirm');
    document.getElementById('auth-form').addEventListener('submit',submitLogin);
  }

  async function submitLogin(event){
    event.preventDefault();
    const form=event.target, btn=document.getElementById('auth-submit'), error=document.getElementById('auth-error');
    const password=form.password.value.trim();
    btn.disabled=true; error.className=''; error.textContent='';
    if(password.length<8){
      error.className='oc-error'; error.textContent='La contraseña debe tener al menos 8 caracteres.'; btn.disabled=false; return;
    }
    if(!hasPassword()){
      if(password!==form.confirm.value.trim()){
        error.className='oc-error'; error.textContent='Las contraseñas no coinciden.'; btn.disabled=false; return;
      }
      const hash=await hashPassword(password);
      try{
        localStorage.setItem(STORAGE.passwordHash,hash);
        setSession();
        showGeneralDashboard();
      }catch{
        error.className='oc-error'; error.textContent='No se pudo guardar el acceso en este navegador.';
        btn.disabled=false;
      }
      return;
    }
    const hash=await hashPassword(password);
    try{
      const saved=localStorage.getItem(STORAGE.passwordHash);
      if(hash!==saved){
        error.className='oc-error'; error.textContent='Contraseña incorrecta.';
        btn.disabled=false; return;
      }
      setSession();
      showGeneralDashboard();
    }catch{
      error.className='oc-error'; error.textContent='No se pudo comprobar el acceso.';
      btn.disabled=false;
    }
  }

  function showGeneralDashboard(){
    state.screen='general';
    state.tab='dashboard';
    document.title='OcaranzaConnect · Administración general';
    app.innerHTML=
      '<div class="app-shell">'+
        '<aside class="sidebar">'+
          '<div class="sidebar-brand"><div class="brand-row"><div class="brand-mark">OC</div><div class="brand-copy"><strong>OcaranzaConnect</strong><small>Administración general</small></div></div></div>'+
          '<nav class="side-nav">'+
            '<button class="active" id="general-home">⌂ &nbsp; Inicio</button>'+
            '<button id="hotel-nav">H &nbsp; Hotel Ocaranza</button>'+
            '<button> M &nbsp; Minimarket Ocaranza</button>'+
            '<button> R &nbsp; Restaurante Ocaranza</button>'+
          '</nav>'+
          '<div class="side-bottom"><button class="btn light" id="refresh-general">Actualizar</button><button class="btn" id="logout-general">Salir</button></div>'+
        '</aside>'+
        '<div class="drawer-backdrop" id="general-backdrop"></div>'+
        '<main class="content">'+
          '<header class="topbar"><div class="platform-wrap"><button class="btn light mobile-menu" id="general-menu">☰</button><div class="platform"><span class="platform-mark">OC</span><div><strong>OcaranzaConnect</strong><small>Administración general</small></div></div></div><div class="top-actions"><div class="context-switch"><span class="property-symbol">A</span><button>Admin General</button></div><button class="btn" id="logout-general-top">Salir</button></div></header>'+
          '<div id="general-view"></div>'+
        '</main>'+
      '</div>';
    bindGeneral();
    renderGeneral();
  }

  function bindGeneral(){
    document.getElementById('refresh-general').addEventListener('click',renderGeneral);
    document.getElementById('logout-general').addEventListener('click',logout);
    document.getElementById('logout-general-top').addEventListener('click',logout);
    document.getElementById('hotel-nav').addEventListener('click',showHotelDashboard);
    document.getElementById('general-home').addEventListener('click',renderGeneral);
    document.getElementById('general-menu').addEventListener('click',()=>{
      const s=document.querySelector('.sidebar'),b=document.getElementById('general-backdrop');
      s.classList.toggle('open');b.classList.toggle('open');
    });
    document.getElementById('general-backdrop').addEventListener('click',()=>{
      document.querySelector('.sidebar').classList.remove('open');document.getElementById('general-backdrop').classList.remove('open');
    });
  }

  function renderGeneral(){
    document.getElementById('general-view').innerHTML=
      '<section class="general-top"><div><span class="eyebrow">Centro de control</span><h1>Admin General</h1><p>Una sola cuenta para visualizar los tres negocios de Ocaranza.</p></div></section>'+
      '<div class="general-strip"><div class="general-stat"><small>Negocios</small><strong>3</strong><span>Dentro del ecosistema</span></div><div class="general-stat"><small>Activos</small><strong>1</strong><span>Hotel en construcción</span></div><div class="general-stat"><small>Usuario</small><strong>adminoca</strong><span>Administrador general</span></div><div class="general-stat"><small>Próxima capa</small><strong>PMS</strong><span>Hotel Ocaranza</span></div></div>'+
      '<section class="business-grid">'+
        businessCard('hotel')+businessCard('minimarket')+businessCard('restaurant')+
      '</section>';
    document.querySelectorAll('[data-business]').forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.dataset.business==='hotel')showHotelDashboard();
      else openModal('Módulo en preparación','OcaranzaConnect','<div class="oc-locked"><h2>'+esc(DEMO[btn.dataset.business].name)+'</h2><p>La arquitectura del Admin General ya contempla este negocio. La construcción funcional comenzará después del núcleo del Hotel.</p></div>');
    }));
  }

  function businessCard(key){
    const b=DEMO[key];
    return '<article class="business-card '+(b.active?'active':'inactive')+'"><div class="business-icon">'+esc(b.icon)+'</div><span class="eyebrow">'+(b.active?'Módulo prioritario':'Próximamente')+'</span><h2>'+esc(b.name)+'</h2><p>'+esc(b.description)+'</p><div class="business-meta"><span class="business-status '+(b.active?'':'pending')+'"><span class="business-dot"></span>'+(b.active?'En construcción':'Preparado en plataforma')+'</span>'+(b.active?'<button class="business-enter" data-business="'+key+'">Entrar al Hotel</button>':'<button class="business-enter" data-business="'+key+'">Ver estado</button>')+'</div></article>';
  }

  function showHotelDashboard(){
    state.screen='hotel';state.tab='dashboard';state.search='';state.moreOpen=false;state.menuOpen=false;
    document.title='OcaranzaConnect · Hotel Ocaranza';
    renderHotelShell();
    renderHotel();
  }

  function renderHotelShell(){
    app.innerHTML=
      '<div class="app-shell">'+
      '<aside class="sidebar" id="hotel-sidebar">'+
        '<div class="sidebar-brand"><div class="brand-row"><div class="brand-mark">OC</div><div class="brand-copy"><strong>OcaranzaConnect</strong><small>Hotel Ocaranza</small></div></div><div class="property"><span class="property-symbol">H</span><div><strong>Hotel Ocaranza</strong><small>Propiedad activa</small></div></div></div>'+
        '<nav class="side-nav">'+NAV.map(n=>'<button data-tab="'+n[0]">'+n[1]+' &nbsp; '+n[2]+'</button>').join('')+'</nav>'+
        '<div class="side-bottom"><button class="btn light" id="hotel-general">Admin General</button><button class="btn light" id="hotel-refresh">Actualizar</button><button class="btn" id="hotel-logout">Salir</button></div>'+
      '</aside>'+
      '<div class="drawer-backdrop" id="hotel-backdrop"></div>'+
      '<main class="content">'+
        '<header class="topbar"><div class="platform-wrap"><button class="btn light mobile-menu" id="hotel-menu">☰</button><div class="platform"><span class="platform-mark">OC</span><div><strong>OcaranzaConnect</strong><small>Hotel Ocaranza · PMS</small></div></div></div><div class="top-actions"><div class="property"><span class="property-symbol">H</span><div><strong>Hotel Ocaranza</strong><small>Propiedad activa</small></div></div><button class="btn light" id="hotel-refresh-top">Actualizar</button></div></header>'+
        '<section id="hotel-views"></section>'+
      '</main></div>'+
      '<nav class="mobile-nav">'+NAV.slice(0,4).map(n=>'<button data-mobile-tab="'+n[0]+'"><span>'+n[1]+'</span>'+n[2]+'</button>').join('')+'<button data-mobile-tab="more"><span>•••</span>Más</button></nav>'+
      '<div class="mobile-more" id="hotel-more">'+NAV.slice(4).map(n=>'<button data-more-tab="'+n[0]+'">'+n[1]+' &nbsp; '+n[2]+'</button>').join('')+'</div>';
    document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>selectHotelTab(b.dataset.tab)));
    document.querySelectorAll('[data-mobile-tab]').forEach(b=>b.addEventListener('click',()=>{
      if(b.dataset.mobileTab==='more'){state.moreOpen=!state.moreOpen;document.getElementById('hotel-more').classList.toggle('open',state.moreOpen);return}
      selectHotelTab(b.dataset.mobileTab);
    }));
    document.querySelectorAll('[data-more-tab]').forEach(b=>b.addEventListener('click',()=>selectHotelTab(b.dataset.moreTab)));
    document.getElementById('hotel-general').addEventListener('click',showGeneralDashboard);
    document.getElementById('hotel-refresh').addEventListener('click',renderHotel);
    document.getElementById('hotel-refresh-top').addEventListener('click',renderHotel);
    document.getElementById('hotel-logout').addEventListener('click',logout);
    document.getElementById('hotel-menu').addEventListener('click',()=>{
      state.menuOpen=!state.menuOpen;
      document.getElementById('hotel-sidebar').classList.toggle('open',state.menuOpen);
      document.getElementById('hotel-backdrop').classList.toggle('open',state.menuOpen);
    });
    document.getElementById('hotel-backdrop').addEventListener('click',()=>{
      state.menuOpen=false;document.getElementById('hotel-sidebar').classList.remove('open');document.getElementById('hotel-backdrop').classList.remove('open');
    });
  }

  function selectHotelTab(tab){
    state.tab=tab;state.moreOpen=false;state.menuOpen=false;
    document.getElementById('hotel-more').classList.remove('open');
    document.getElementById('hotel-sidebar').classList.remove('open');
    document.getElementById('hotel-backdrop').classList.remove('open');
    renderHotel();
  }

  function renderHotel(){
    const views={dashboard:hotelDashboardView,calendar:hotelCalendarView,reservations:hotelReservationsView,rooms:hotelRoomsView,guests:hotelGuestsView,operations:hotelOperationsView,orders:hotelOrdersView,finance:hotelFinanceView,reports:hotelReportsView,settings:hotelSettingsView};
    document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===state.tab));
    document.querySelectorAll('[data-mobile-tab]').forEach(b=>b.classList.toggle('active',b.dataset.mobileTab===state.tab));
    document.getElementById('hotel-views').innerHTML='<div class="page active">'+views[state.tab]()+'</div>';
    bindHotelView();
  }

  function hotelDashboardView(){
    const occupied=HOTEL_ROOMS.filter(r=>r.status==='occupied').length;
    const arrivals=HOTEL_RESERVATIONS.filter(r=>r.arrival===0&&r.status!=='cancelled').length;
    const departures=HOTEL_RESERVATIONS.filter(r=>r.departure===0&&r.status!=='cancelled').length;
    return '<section class="hero"><div class="hero-main"><span class="eyebrow">Hotel Ocaranza · Hoy</span><h2>Centro de operaciones.</h2><p>Esta es la primera área que construiremos a fondo: reservas, calendario, habitaciones, huéspedes, operación y caja.</p><div class="hero-date"><strong>'+esc(longDate(new Date()))+'</strong></div></div><aside class="health"><div class="health-head"><div><span class="eyebrow">Plataforma</span><h3>Estado del hotel</h3></div><span class="health-dot"></span></div><div class="health-list"><div class="health-row"><span>OcaranzaConnect</span><strong class="connected">Activo</strong></div><div class="health-row"><span>Hotel</span><strong>10 habitaciones</strong></div><div class="health-row"><span>Integración</span><strong class="prepared">Por conectar</strong></div><div class="health-row"><span>Admin General</span><strong>Visible</strong></div></div></aside></section>'+
    '<div class="kpis"><div class="kpi dark"><small>Ocupación</small><strong>'+Math.round(occupied/HOTEL_ROOMS.length*100)+'%</strong><span>'+occupied+' de 10 habitaciones</span></div><div class="kpi gold"><small>Huéspedes</small><strong>3</strong><span>En casa</span></div><div class="kpi"><small>Check-in</small><strong>'+arrivals+'</strong><span>Programados</span></div><div class="kpi"><small>Check-out</small><strong>'+departures+'</strong><span>Programados</span></div><div class="kpi"><small>Housekeeping</small><strong>2</strong><span>Por atender</span></div><div class="kpi"><small>Mantenimiento</small><strong>'+HOTEL_OPERATIONS.filter(o=>o.status!=='resolved').length+'</strong><span>Abiertos</span></div></div>'+
    '<section class="card" style="margin-bottom:12px"><div class="section-head"><div><span class="eyebrow">Acciones rápidas</span><h3>Recepción</h3><p>La operación diaria vive aquí.</p></div></div><div class="quick-actions"><button class="quick" data-tab-go="calendar"><span class="quick-icon">▦</span><strong>Calendario</strong><small>Próximas 14 noches.</small></button><button class="quick" data-tab-go="reservations"><span class="quick-icon">▤</span><strong>Reservas</strong><small>Crear y gestionar estadías.</small></button><button class="quick" data-tab-go="rooms"><span class="quick-icon">▥</span><strong>Habitaciones</strong><small>Disponibilidad y estado.</small></button><button class="quick" data-tab-go="operations"><span class="quick-icon">⚙</span><strong>Operación</strong><small>Housekeeping y mantención.</small></button></div></section>'+
    '<section class="card"><div class="section-head"><div><span class="eyebrow">Mapa de habitaciones</span><h3>Estado actual</h3><p>Primera lectura de recepción.</p></div><button class="btn light" data-tab-go="rooms">Abrir módulo</button></div><div class="room-grid">'+HOTEL_ROOMS.map(roomCard).join('')+'</div></section>';
  }

  function roomCard(room){
    return '<button class="room '+esc(room.status)+'" data-room="'+esc(room.n)+'"><strong>'+esc(room.n)+'</strong><span class="room-cap">'+esc(room.cap)+' pax</span><small>Piso '+esc(room.floor)+'</small><span class="room-state">'+esc(statusLabel(room.status))+'</span><div style="margin-top:9px;color:#777;font-size:8px">'+esc(room.guest||'Sin huésped')+'</div></button>';
  }

  function hotelCalendarView(){
    const days=Array.from({length:14},(_,i)=>addDays(state.from,i));
    let header='<div class="calendar-header calendar-grid"><div class="cal-cell">Hab.</div>';
    header+=days.map(d=>'<div class="cal-cell '+(dateKey(d)===dateKey(new Date())?'today':'')+'">'+dateLabel(d)+'<br>'+d.toLocaleDateString('es-CL',{weekday:'short'})+'</div>').join('');
    header+='</div>';
    let body='';
    HOTEL_ROOMS.forEach(room=>{
      let row='<div class="calendar-row calendar-grid"><div class="cal-cell room-label">'+esc(room.n)+'</div>';
      row+=days.map(()=>'<div class="cal-cell"></div>').join('');
      HOTEL_RESERVATIONS.filter(r=>r.room===room.n&&r.status!=='cancelled').forEach(r=>{
        const start=Math.max(0,r.arrival),end=Math.min(14,r.departure);
        if(end<=0||start>=14||end<=start)return;
        row+='<button class="booking '+esc(r.status)+'" data-reservation="'+r.id+'" style="grid-column:'+(2+start)+' / '+(2+end)+'"><strong>'+esc(r.guest)+'</strong><small>'+esc(r.code)+' · '+esc(r.channel)+'</small></button>';
      });
      row+='</div>';body+=row;
    });
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Planificación</span><h1>Calendario</h1><p>Vista de 14 noches por habitación.</p></div><div><button class="btn light" id="prev14">‹</button> <button class="btn light" id="today14">Hoy</button> <button class="btn light" id="next14">›</button></div></div><div class="legend"><span>Verde · confirmada</span><span>Negro · check-in</span><span>Ocre · tentativa</span></div><section class="card" style="padding:10px"><div class="calendar-shell">'+header+body+'</div></section>';
  }

  function hotelReservationsView(){
    const filtered=HOTEL_RESERVATIONS.filter(r=>(r.code+' '+r.guest+' '+r.room+' '+r.channel).toLowerCase().includes(state.search.toLowerCase()));
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Recepción</span><h1>Reservas</h1><p>Aquí construiremos el flujo completo de reservas.</p></div><button class="btn" id="new-reservation">+ Nueva reserva</button></div><div class="toolbar"><input class="search" id="res-search" value="'+esc(state.search)+'" placeholder="Buscar huésped, reserva, habitación o canal"><span style="color:#8a847a;font-size:8px">'+filtered.length+' resultados</span></div><section class="card table-wrap"><table class="table"><thead><tr><th>Reserva</th><th>Huésped</th><th>Habitación</th><th>Estadía</th><th>Canal</th><th>Estado</th><th>Total</th></tr></thead><tbody>'+filtered.map(r=>'<tr><td><strong>'+esc(r.code)+'</strong></td><td><strong>'+esc(r.guest)+'</strong></td><td>'+esc(r.room)+'</td><td>Día '+(r.arrival+1)+' → día '+(r.departure+1)+'</td><td>'+esc(r.channel)+'</td><td>'+badge(r.status)+'</td><td>'+money(r.total)+'</td></tr>').join('')+'</tbody></table></section>';
  }

  function hotelRoomsView(){
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Inventario</span><h1>Habitaciones</h1><p>Capacidad, estado físico y huésped asociado.</p></div><button class="btn light" id="room-summary">Resumen</button></div><div class="room-grid">'+HOTEL_ROOMS.map(roomCard).join('')+'</div>';
  }

  function hotelGuestsView(){
    const filtered=HOTEL_GUESTS.filter(g=>(g.name+' '+g.username+' '+g.room).toLowerCase().includes(state.search.toLowerCase()));
    return '<div class="page-head"><div><span class="eyebrow">Hotel · CRM</span><h1>Huéspedes</h1><p>Identidad, estadía y relación con reserva.</p></div><button class="btn" id="new-guest">+ Nuevo huésped</button></div><div class="toolbar"><input class="search" id="guest-search" value="'+esc(state.search)+'" placeholder="Buscar nombre, usuario o habitación"><span style="color:#8a847a;font-size:8px">'+filtered.length+' perfiles</span></div><section class="card table-wrap"><table class="table"><thead><tr><th>Huésped</th><th>Usuario</th><th>Habitación</th><th>Estadía</th><th>Estado</th></tr></thead><tbody>'+filtered.map(g=>'<tr><td><strong>'+esc(g.name)+'</strong></td><td>@'+esc(g.username)+'</td><td>'+esc(g.room)+'</td><td>'+esc(g.stay)+'</td><td>'+badge(g.status)+'</td></tr>').join('')+'</tbody></table></section>';
  }

  function hotelOperationsView(){
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Operación</span><h1>Housekeeping y mantenimiento</h1><p>Flujos separados para priorizar el trabajo diario.</p></div><button class="btn" id="new-issue">+ Incidencia</button></div><div class="grid-2"><section class="card"><div class="section-head"><div><span class="eyebrow">Housekeeping</span><h3>Estado</h3></div></div><div class="list">'+HOTEL_HOUSEKEEPING.map(h=>'<div class="row"><div class="row-main"><strong>Hab. '+esc(h.room)+'</strong><small>'+esc(h.note)+'</small></div>'+badge(h.status)+'</div>').join('')+'</div></section><section class="card"><div class="section-head"><div><span class="eyebrow">Mantenimiento</span><h3>Incidencias</h3></div></div><div class="list">'+HOTEL_OPERATIONS.map(o=>'<div class="row"><div class="row-main"><strong>'+esc(o.title)+'</strong><small>Hab. '+esc(o.room)+' · '+esc(o.priority)+'</small></div>'+badge(o.status)+'</div>').join('')+'</div></section></div>';
  }

  function hotelOrdersView(){
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Guest services</span><h1>Pedidos</h1><p>Servicios y consumos asociados al huésped.</p></div></div><section class="card"><div class="list">'+HOTEL_ORDERS.map(o=>'<div class="row"><div class="row-main"><strong>'+esc(o.item)+' · '+money(o.amount)+'</strong><small>Hab. '+esc(o.room)+' · '+esc(o.guest)+'</small></div>'+badge(o.status)+'</div>').join('')+'</div></section>';
  }

  function hotelFinanceView(){
    const gross=HOTEL_RESERVATIONS.reduce((sum,r)=>sum+r.total,0);
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Caja</span><h1>Finanzas</h1><p>Base financiera inicial del PMS.</p></div></div><div class="metric-row"><div class="mini"><small>Producción</small><strong>'+money(gross)+'</strong></div><div class="mini"><small>Reservas</small><strong>'+HOTEL_RESERVATIONS.length+'</strong></div><div class="mini"><small>Pedidos</small><strong>'+HOTEL_ORDERS.length+'</strong></div><div class="mini"><small>Habitaciones</small><strong>10</strong></div><div class="mini"><small>Moneda</small><strong>CLP</strong></div></div><section class="card" style="margin-top:12px"><div class="section-head"><div><span class="eyebrow">Próxima capa</span><h3>Folio y pagos</h3><p>Se construirá con el núcleo transaccional del PMS.</p></div></div></section>';
  }

  function hotelReportsView(){
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Inteligencia</span><h1>Reportes</h1><p>La capa de indicadores se añadirá después del núcleo operativo.</p></div></div><div class="grid-3"><section class="card"><span class="eyebrow">Ocupación</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">70%</h2><p class="muted">Lectura actual.</p></section><section class="card"><span class="eyebrow">Habitaciones</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">10</h2><p class="muted">Inventario físico.</p></section><section class="card"><span class="eyebrow">Canales</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">3</h2><p class="muted">Base preparada para conexiones.</p></section></div>';
  }

  function hotelSettingsView(){
    return '<div class="page-head"><div><span class="eyebrow">Hotel · Sistema</span><h1>Configuración</h1><p>Propiedad, usuarios, conexiones y reglas operativas.</p></div></div><div class="grid-2"><section class="card"><div class="section-head"><div><span class="eyebrow">Propiedad</span><h3>Hotel Ocaranza</h3><p>Primera unidad de negocio que desarrollaremos.</p></div></div><div class="form-grid"><div class="field"><label>Habitaciones</label><input value="10"></div><div class="field"><label>Moneda</label><input value="CLP"></div><div class="field"><label>Ciudad</label><input value="Santiago"></div><div class="field"><label>Estado</label><input value="Activo"></div></div></section><section class="card"><div class="section-head"><div><span class="eyebrow">Plataforma</span><h3>Lineware dentro de OcaranzaConnect</h3><p>La integración y multi-negocio se desarrollarán sobre esta base.</p></div></div><div class="list"><div class="row"><div class="row-main"><strong>Admin General</strong><small>Puede ver los tres negocios.</small></div><span class="badge green">Activo</span></div><div class="row"><div class="row-main"><strong>Minimarket</strong><small>Base reservada.</small></div><span class="badge gold">Próximo</span></div><div class="row"><div class="row-main"><strong>Restaurante</strong><small>Base reservada.</small></div><span class="badge gold">Próximo</span></div></div></section></div>';
  }

  function bindHotelView(){
    document.querySelectorAll('[data-tab-go]').forEach(b=>b.addEventListener('click',()=>selectHotelTab(b.dataset.tabGo)));
    document.querySelectorAll('[data-room]').forEach(b=>b.addEventListener('click',()=>{
      const room=HOTEL_ROOMS.find(r=>r.n===b.dataset.room);
      openModal('Habitación '+room.n,'Hotel · Inventario','<div class="grid-2"><div class="card"><span class="eyebrow">Estado</span><h3 style="margin:7px 0">'+esc(statusLabel(room.status))+'</h3><p class="muted">Piso '+esc(room.floor)+' · Capacidad '+esc(room.cap)+'</p></div><div class="card"><span class="eyebrow">Huésped</span><h3 style="margin:7px 0">'+esc(room.guest||'Sin huésped')+'</h3><p class="muted">Vista inicial de operación.</p></div></div>');
    }));
    const resSearch=document.getElementById('res-search');
    if(resSearch)resSearch.addEventListener('input',e=>{state.search=e.target.value;renderHotel()});
    const guestSearch=document.getElementById('guest-search');
    if(guestSearch)guestSearch.addEventListener('input',e=>{state.search=e.target.value;renderHotel()});
    const prev=document.getElementById('prev14');
    if(prev)prev.addEventListener('click',()=>{state.from=addDays(state.from,-14);renderHotel()});
    const next=document.getElementById('next14');
    if(next)next.addEventListener('click',()=>{state.from=addDays(state.from,14);renderHotel()});
    const today=document.getElementById('today14');
    if(today)today.addEventListener('click',()=>{state.from=startOfToday();renderHotel()});
    document.querySelectorAll('[data-reservation]').forEach(b=>b.addEventListener('click',()=>{
      const r=HOTEL_RESERVATIONS.find(x=>String(x.id)===String(b.dataset.reservation));
      openModal('Reserva '+r.code,'Hotel · Recepción','<div class="grid-2"><div class="card"><span class="eyebrow">Huésped</span><h3 style="margin:7px 0">'+esc(r.guest)+'</h3><p class="muted">Canal '+esc(r.channel)+'</p></div><div class="card"><span class="eyebrow">Estadía</span><h3 style="margin:7px 0">Hab. '+esc(r.room)+'</h3><p class="muted">Entrada día '+(r.arrival+1)+' · Salida día '+(r.departure+1)+'</p></div></div><div class="notice" style="margin-top:12px;padding:11px;border-left:2px solid #c6a15d;background:#f5efe4;border-radius:0 10px 10px 0;color:#6d665d;font-size:9px">Total: <strong>'+money(r.total)+'</strong></div>');
    }));
    const nr=document.getElementById('new-reservation');
    if(nr)nr.addEventListener('click',()=>openModal('Nueva reserva','Hotel · Recepción','<div class="oc-locked"><h2>Núcleo de reservas</h2><p>El formulario está reservado para la siguiente etapa del PMS. Primero estamos estableciendo correctamente el acceso y la arquitectura de negocio.</p></div>'));
    const ng=document.getElementById('new-guest');
    if(ng)ng.addEventListener('click',()=>openModal('Nuevo huésped','Hotel · CRM','<div class="oc-locked"><h2>CRM de huéspedes</h2><p>La estructura queda lista. La creación persistente se añadirá en la siguiente fase.</p></div>'));
    const ri=document.getElementById('new-issue');
    if(ri)ri.addEventListener('click',()=>openModal('Nueva incidencia','Hotel · Operación','<div class="oc-locked"><h2>Mantenimiento</h2><p>La gestión de incidencias se añadirá junto al flujo operativo real del hotel.</p></div>'));
    const rs=document.getElementById('room-summary');
    if(rs)rs.addEventListener('click',()=>openModal('Resumen de habitaciones','Hotel · Inventario','<div class="metric-row"><div class="mini"><small>Ocupadas</small><strong>'+HOTEL_ROOMS.filter(r=>r.status==='occupied').length+'</strong></div><div class="mini"><small>Disponibles</small><strong>'+HOTEL_ROOMS.filter(r=>r.status==='available').length+'</strong></div><div class="mini"><small>Mantención</small><strong>'+HOTEL_ROOMS.filter(r=>r.status==='maintenance').length+'</strong></div><div class="mini"><small>Bloqueadas</small><strong>'+HOTEL_ROOMS.filter(r=>r.status==='blocked').length+'</strong></div><div class="mini"><small>Total</small><strong>'+HOTEL_ROOMS.length+'</strong></div></div>'));
  }

  function openModal(title,kicker,body){
    modalTitle.textContent=title;
    modalKicker.textContent=kicker;
    modalBody.innerHTML=body;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }

  function logout(){
    clearSession();
    closeModal();
    showLogin();
  }

  document.getElementById('modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

  if(hasSession())showGeneralDashboard();
  else splash();
})();