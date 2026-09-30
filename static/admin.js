(() => {
  const rooms = [
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

  const reservations = [
    {id:1,code:'OC-1048',guest:'Valentina Pérez',room:'202',arrival:0,departure:2,status:'checked_in',channel:'Directo',total:148000},
    {id:2,code:'OC-1049',guest:'Tomás Rojas',room:'203',arrival:0,departure:4,status:'confirmed',channel:'Booking.com',total:296000},
    {id:3,code:'OC-1050',guest:'Camila Soto',room:'302',arrival:2,departure:5,status:'confirmed',channel:'Directo',total:222000},
    {id:4,code:'OC-1051',guest:'Diego Morales',room:'304',arrival:1,departure:3,status:'confirmed',channel:'Expedia',total:184000},
    {id:5,code:'OC-1052',guest:'Martín Silva',room:'201',arrival:4,departure:7,status:'tentative',channel:'WhatsApp',total:198000},
    {id:6,code:'OC-1053',guest:'Paula Díaz',room:'305',arrival:6,departure:9,status:'cancelled',channel:'Directo',total:162000},
    {id:7,code:'OC-1054',guest:'Javier Araya',room:'301',arrival:8,departure:11,status:'confirmed',channel:'Booking.com',total:246000},
    {id:8,code:'OC-1055',guest:'Sofía Vidal',room:'303',arrival:10,departure:13,status:'confirmed',channel:'Directo',total:246000}
  ];

  const guests = [
    {name:'Valentina Pérez',username:'valeperez',room:'202',stay:'30 sep → 02 oct',status:'active'},
    {name:'Tomás Rojas',username:'tomas.rojas',room:'203',stay:'30 sep → 04 oct',status:'active'},
    {name:'Camila Soto',username:'camisoto',room:'302',stay:'02 oct → 05 oct',status:'confirmed'},
    {name:'Diego Morales',username:'dmorales',room:'304',stay:'01 oct → 03 oct',status:'confirmed'},
    {name:'Martín Silva',username:'martin.s',room:'201',stay:'04 oct → 07 oct',status:'tentative'}
  ];

  const housekeeping = [
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

  const operations = [
    {title:'Revisión ducha',room:'205',priority:'Urgente',status:'open'},
    {title:'Cambio de ampolleta',room:'301',priority:'Normal',status:'in_progress'},
    {title:'Pintura baño',room:'305',priority:'Normal',status:'open'}
  ];

  const orders = [
    {guest:'Valentina Pérez',room:'202',item:'Botella de agua',amount:3500,status:'delivered'},
    {guest:'Tomás Rojas',room:'203',item:'Tour Centro Histórico',amount:42000,status:'pending'},
    {guest:'Camila Soto',room:'302',item:'Desayuno adicional',amount:8000,status:'preparing'}
  ];

  const state = {
    tab:'dashboard',
    from:startOfToday(),
    search:'',
    menuOpen:false,
    moreOpen:false
  };

  const nav = [
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

  function addDays(date, count){
    const d = new Date(date);
    d.setDate(d.getDate() + count);
    return d;
  }

  function dateKey(date){
    return date.toISOString().slice(0,10);
  }

  function dateLabel(date){
    return date.toLocaleDateString('es-CL',{day:'2-digit',month:'short'});
  }

  function longDate(date){
    return date.toLocaleDateString('es-CL',{weekday:'long',day:'2-digit',month:'long',year:'numeric'});
  }

  function statusLabel(status){
    const map = {available:'Disponible',occupied:'Ocupada',maintenance:'Mantención',blocked:'Bloqueada',clean:'Limpia',dirty:'Sucia',cleaning:'En limpieza',inspected:'Inspeccionada',out_of_order:'Fuera de servicio',confirmed:'Confirmada',checked_in:'Check-in',tentative:'Tentativa',cancelled:'Cancelada',pending:'Pendiente',preparing:'En preparación',delivered:'Entregado',open:'Abierto',in_progress:'En curso'};
    return map[status] || status;
  }

  function badge(status){
    const cls = ['occupied','checked_in','confirmed','inspected','clean','delivered'].includes(status) ? 'green'
      : ['tentative','preparing','in_progress'].includes(status) ? 'gold'
      : ['cancelled','maintenance','blocked','out_of_order','urgent'].includes(status) ? 'red' : 'gray';
    return '<span class="badge '+cls+'">'+esc(statusLabel(status))+'</span>';
  }

  function renderShell(){
    app.innerHTML =
      '<div class="app-shell">'+
        '<aside class="sidebar" id="sidebar">'+
          '<div class="sidebar-brand">'+
            '<div class="brand-row"><div class="brand-mark">AI</div><div class="brand-copy"><strong>LinewareAI</strong><small>Hospitality Platform</small></div></div>'+
            '<div class="property"><span class="property-symbol">H</span><div><strong>Ocaranza</strong><small>Propiedad activa</small></div></div>'+
          '</div>'+
          '<nav class="side-nav">'+nav.map(item => '<button data-tab="'+item[0]+'">'+item[1]+' &nbsp; '+item[2]+'</button>').join('')+'</nav>'+
          '<div class="side-bottom"><button class="btn light" id="refresh">Actualizar</button><button class="btn" id="signout">Salir</button></div>'+
        '</aside>'+
        '<div class="drawer-backdrop" id="backdrop"></div>'+
        '<main class="content">'+
          '<header class="topbar">'+
            '<div class="platform-wrap"><button class="btn light mobile-menu" id="mobile-menu">☰</button><div class="platform"><span class="platform-mark">AI</span><div><strong>LinewareAI</strong><small>Centro PMS</small></div></div></div>'+
            '<div class="top-actions"><div class="property"><span class="property-symbol">H</span><div><strong>Ocaranza</strong><small>Propiedad activa</small></div></div><button class="btn light" id="top-refresh">Actualizar</button></div>'+
          '</header>'+
          '<section id="views"></section>'+
        '</main>'+
      '</div>'+
      '<nav class="mobile-nav">'+nav.slice(0,4).map(item => '<button data-mobile-tab="'+item[0]+'"><span>'+item[1]+'</span>'+item[2]+'</button>').join('')+'<button data-mobile-tab="more"><span>•••</span>Más</button></nav>'+
      '<div class="mobile-more" id="mobile-more">'+nav.slice(4).map(item => '<button data-more-tab="'+item[0]+'">'+item[1]+' &nbsp; '+item[2]+'</button>').join('')+'</div>';

    bindShell();
  }

  function bindShell(){
    document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click',() => selectTab(btn.dataset.tab)));
    document.querySelectorAll('[data-mobile-tab]').forEach(btn => btn.addEventListener('click',() => {
      if(btn.dataset.mobileTab === 'more'){
        state.moreOpen = !state.moreOpen;
        document.getElementById('mobile-more').classList.toggle('open',state.moreOpen);
        return;
      }
      selectTab(btn.dataset.mobileTab);
    }));
    document.querySelectorAll('[data-more-tab]').forEach(btn => btn.addEventListener('click',() => selectTab(btn.dataset.moreTab)));
    document.getElementById('mobile-menu').addEventListener('click',() => {
      state.menuOpen = !state.menuOpen;
      document.getElementById('sidebar').classList.toggle('open',state.menuOpen);
      document.getElementById('backdrop').classList.toggle('open',state.menuOpen);
    });
    document.getElementById('backdrop').addEventListener('click',() => {
      state.menuOpen = false;
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('backdrop').classList.remove('open');
    });
    document.getElementById('refresh').addEventListener('click',render);
    document.getElementById('top-refresh').addEventListener('click',render);
    document.getElementById('signout').addEventListener('click',() => {
      openModal('Sesión','LinewareAI PMS','<div class="card"><p style="margin:0;color:#777;line-height:1.6;font-size:10px">La autenticación se incorporará sobre esta nueva base. El panel actual funciona como entorno de diseño y producto.</p></div>');
    });
    document.addEventListener('keydown',event => { if(event.key === 'Escape') closeModal(); });
    document.getElementById('modal-close').addEventListener('click',closeModal);
    modal.addEventListener('click',event => { if(event.target === modal) closeModal(); });
  }

  function selectTab(tab){
    state.tab = tab;
    state.moreOpen = false;
    state.menuOpen = false;
    document.getElementById('mobile-more').classList.remove('open');
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('backdrop').classList.remove('open');
    render();
  }

  function render(){
    const views = {
      dashboard: dashboardView,
      calendar: calendarView,
      reservations: reservationsView,
      rooms: roomsView,
      guests: guestsView,
      operations: operationsView,
      orders: ordersView,
      finance: financeView,
      reports: reportsView,
      settings: settingsView
    };
    document.querySelectorAll('[data-tab]').forEach(btn => btn.classList.toggle('active',btn.dataset.tab === state.tab));
    document.querySelectorAll('[data-mobile-tab]').forEach(btn => btn.classList.toggle('active',btn.dataset.mobileTab === state.tab));
    document.getElementById('views').innerHTML = views[state.tab]();
    bindView();
  }

  function dashboardView(){
    const occupied = rooms.filter(r => r.status === 'occupied').length;
    const arrivals = reservations.filter(r => r.arrival === 0 && r.status !== 'cancelled').length;
    const departures = reservations.filter(r => r.departure === 0 && r.status !== 'cancelled').length;
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'preparing').length;
    return '<section class="hero"><div class="hero-main"><span class="eyebrow">Recepción · Hoy</span><h2>Buenos días, equipo.</h2><p>Esta es la nueva base del PMS de LinewareAI. La estructura visual del panel se conserva, pero la lógica y los módulos parten nuevamente desde cero.</p><div class="hero-date">Operando <strong>'+esc(longDate(new Date()))+'</strong></div></div><aside class="health"><div class="health-head"><div><span class="eyebrow">Sistema</span><h3>Estado de plataforma</h3></div><span class="health-dot"></span></div><div class="health-list"><div class="health-row"><span>LinewareAI PMS</span><strong class="connected">Activo</strong></div><div class="health-row"><span>Propiedad</span><strong>H Ocaranza</strong></div><div class="health-row"><span>Motor de reservas</span><strong class="prepared">Por definir</strong></div><div class="health-row"><span>Canales</span><strong class="prepared">Por conectar</strong></div></div></aside></section>'+
      '<div class="kpis"><div class="kpi dark"><small>Ocupación</small><strong>'+Math.round(occupied / rooms.length * 100)+'%</strong><span>'+occupied+' de '+rooms.length+' habitaciones</span></div><div class="kpi gold"><small>Huéspedes</small><strong>3</strong><span>En casa ahora</span></div><div class="kpi"><small>Check-in</small><strong>'+arrivals+'</strong><span>Para hoy</span></div><div class="kpi"><small>Check-out</small><strong>'+departures+'</strong><span>Para hoy</span></div><div class="kpi"><small>Housekeeping</small><strong>2</strong><span>Pendientes</span></div><div class="kpi"><small>Pendientes</small><strong>'+pending+'</strong><span>Pedidos activos</span></div></div>'+
      '<div class="card" style="margin-bottom:12px"><div class="section-head"><div><span class="eyebrow">Acciones rápidas</span><h3>Recepción</h3><p>Accesos directos al flujo operativo.</p></div></div><div class="quick-actions"><button class="quick" data-tab-go="calendar"><span class="quick-icon">▦</span><strong>Calendario</strong><small>Ver las próximas dos semanas.</small></button><button class="quick" data-tab-go="reservations"><span class="quick-icon">▤</span><strong>Nueva reserva</strong><small>Crear una estadía desde recepción.</small></button><button class="quick" data-tab-go="rooms"><span class="quick-icon">▥</span><strong>Habitaciones</strong><small>Disponibilidad y estado físico.</small></button><button class="quick" data-tab-go="operations"><span class="quick-icon">⚙</span><strong>Operación</strong><small>Housekeeping y mantenimiento.</small></button></div></div>'+
      '<div class="section-grid"><section class="card"><div class="section-head"><div><span class="eyebrow">Front desk</span><h3>Próximas llegadas</h3><p>Reservas que requieren preparación.</p></div><button class="btn light" data-tab-go="reservations">Ver todo</button></div><div class="list">'+reservations.filter(r => r.status !== 'cancelled').slice(0,4).map(r => '<div class="row"><div class="row-main"><strong>'+esc(r.guest)+'</strong><small>Hab. '+esc(r.room)+' · '+esc(r.code)+'</small></div>'+badge(r.status)+'</div>').join('')+'</div></section>'+
      '<section class="card"><div class="section-head"><div><span class="eyebrow">Actividad</span><h3>Pedidos recientes</h3><p>Servicios y consumos de huéspedes.</p></div><button class="btn light" data-tab-go="orders">Ver pedidos</button></div><div class="list">'+orders.map(o => '<div class="row"><div class="row-main"><strong>'+esc(o.item)+'</strong><small>Hab. '+esc(o.room)+' · '+esc(o.guest)+'</small></div><strong>'+money(o.amount)+'</strong></div>').join('')+'</div></section></div>'+
      '<section class="card" style="margin-top:12px"><div class="section-head"><div><span class="eyebrow">Mapa de habitaciones</span><h3>Estado actual</h3><p>La recepción debe poder leer el hotel de un vistazo.</p></div><button class="btn light" data-tab-go="rooms">Abrir módulo</button></div><div class="room-grid">'+rooms.map(roomCard).join('')+'</div></section>';
  }

  function roomCard(room){
    return '<button class="room '+esc(room.status)+'" data-room="'+esc(room.n)+'"><strong>'+esc(room.n)+'</strong><span class="room-cap">'+esc(room.cap)+' pax</span><small>Piso '+esc(room.floor)+'</small><span class="room-state">'+esc(statusLabel(room.status))+'</span><div style="margin-top:9px;color:#777;font-size:8px">'+(room.guest ? esc(room.guest) : 'Sin huésped')+'</div></button>';
  }

  function calendarView(){
    const days = Array.from({length:14},(_,i)=>addDays(state.from,i));
    let header = '<div class="calendar-header calendar-grid"><div class="cal-cell">Hab.</div>';
    header += days.map(d => '<div class="cal-cell '+(dateKey(d)===dateKey(new Date())?'today':'')+'">'+dateLabel(d)+'<br>'+d.toLocaleDateString('es-CL',{weekday:'short'})+'</div>').join('');
    header += '</div>';
    let body = '';
    rooms.forEach(room => {
      let row = '<div class="calendar-row calendar-grid"><div class="cal-cell room-label">'+esc(room.n)+'</div>';
      row += days.map(() => '<div class="cal-cell"></div>').join('');
      reservations.filter(r => r.room === room.n && r.status !== 'cancelled').forEach(r => {
        const start = Math.max(0,r.arrival);
        const end = Math.min(14,r.departure);
        if(end <= 0 || start >= 14 || end <= start) return;
        row += '<button class="booking '+esc(r.status)+'" data-reservation="'+r.id+'" style="grid-column:'+(2+start)+' / '+(2+end)+'"><strong>'+esc(r.guest)+'</strong><small>'+esc(r.code)+' · '+esc(r.channel)+'</small></button>';
      });
      row += '</div>';
      body += row;
    });
    return '<div class="page-head"><div><span class="eyebrow">Planificación</span><h1>Calendario</h1><p>Distribución de las próximas 14 noches por habitación.</p></div><div><button class="btn light" id="prev14">‹</button> <button class="btn light" id="today14">Hoy</button> <button class="btn light" id="next14">›</button></div></div><div class="legend"><span>Verde · confirmada</span><span>Negro · check-in</span><span>Ocre · tentativa</span></div><section class="card" style="padding:10px"><div class="calendar-shell">'+header+body+'</div></section>';
  }

  function reservationsView(){
    const filtered = reservations.filter(r => {
      const hay = (r.code+' '+r.guest+' '+r.room+' '+r.channel).toLowerCase();
      return hay.includes(state.search.toLowerCase());
    });
    return '<div class="page-head"><div><span class="eyebrow">Recepción</span><h1>Reservas</h1><p>Base operativa nueva. Aquí crecerán creación, modificación, pagos y canales.</p></div><button class="btn" id="new-reservation">+ Nueva reserva</button></div><div class="toolbar"><input class="search" id="res-search" value="'+esc(state.search)+'" placeholder="Buscar huésped, reserva, habitación o canal"><span style="color:#8a847a;font-size:8px">'+filtered.length+' resultados</span></div><section class="card table-wrap"><table class="table"><thead><tr><th>Reserva</th><th>Huésped</th><th>Habitación</th><th>Estadía</th><th>Canal</th><th>Estado</th><th>Total</th></tr></thead><tbody>'+filtered.map(r => '<tr><td><strong>'+esc(r.code)+'</strong></td><td><strong>'+esc(r.guest)+'</strong></td><td>'+esc(r.room)+'</td><td>Día '+(r.arrival+1)+' → día '+(r.departure+1)+'</td><td>'+esc(r.channel)+'</td><td>'+badge(r.status)+'</td><td>'+money(r.total)+'</td></tr>').join('')+'</tbody></table></section>';
  }

  function roomsView(){
    return '<div class="page-head"><div><span class="eyebrow">Inventario</span><h1>Habitaciones</h1><p>Capacidad, estado físico y huésped asociado.</p></div><button class="btn light" id="room-summary">Resumen</button></div><div class="room-grid">'+rooms.map(roomCard).join('')+'</div>';
  }

  function guestsView(){
    const filtered = guests.filter(g => (g.name+' '+g.username+' '+g.room).toLowerCase().includes(state.search.toLowerCase()));
    return '<div class="page-head"><div><span class="eyebrow">CRM</span><h1>Huéspedes</h1><p>La nueva base de huéspedes partirá con identidad, estadía y relación con la reserva.</p></div><button class="btn" id="new-guest">+ Nuevo huésped</button></div><div class="toolbar"><input class="search" id="guest-search" value="'+esc(state.search)+'" placeholder="Buscar nombre, usuario o habitación"><span style="color:#8a847a;font-size:8px">'+filtered.length+' perfiles</span></div><section class="card table-wrap"><table class="table"><thead><tr><th>Huésped</th><th>Usuario</th><th>Habitación</th><th>Estadía</th><th>Estado</th></tr></thead><tbody>'+filtered.map(g => '<tr><td><strong>'+esc(g.name)+'</strong></td><td>@'+esc(g.username)+'</td><td>'+esc(g.room)+'</td><td>'+esc(g.stay)+'</td><td>'+badge(g.status)+'</td></tr>').join('')+'</tbody></table></section>';
  }

  function operationsView(){
    return '<div class="page-head"><div><span class="eyebrow">Operación</span><h1>Housekeeping y mantenimiento</h1><p>Dos flujos separados para que la recepción pueda priorizar.</p></div><button class="btn" id="new-issue">+ Incidencia</button></div><div class="grid-2"><section class="card"><div class="section-head"><div><span class="eyebrow">Housekeeping</span><h3>Estado de habitaciones</h3><p>Actualización local para esta primera versión.</p></div></div><div class="list">'+housekeeping.map(h => '<div class="row"><div class="row-main"><strong>Hab. '+esc(h.room)+'</strong><small>'+esc(h.note)+'</small></div><select class="field-select" data-housekeeping="'+esc(h.room)+'" style="border:1px solid #d5cdbf;border-radius:8px;padding:7px;font-size:8px;background:#fffdfa"><option value="clean" '+(h.status==='clean'?'selected':'')+'>Limpia</option><option value="cleaning" '+(h.status==='cleaning'?'selected':'')+'>En limpieza</option><option value="inspected" '+(h.status==='inspected'?'selected':'')+'>Inspeccionada</option><option value="dirty" '+(h.status==='dirty'?'selected':'')+'>Sucia</option><option value="out_of_order" '+(h.status==='out_of_order'?'selected':'')+'>Fuera de servicio</option></select></div>').join('')+'</div></section>'+
      '<section class="card"><div class="section-head"><div><span class="eyebrow">Mantenimiento</span><h3>Incidencias</h3><p>Prioridad visible y estado editable.</p></div></div><div class="list">'+operations.map((o,i) => '<div class="row"><div class="row-main"><strong>'+esc(o.title)+'</strong><small>Hab. '+esc(o.room)+' · '+esc(o.priority)+'</small></div><select data-maint="'+i+'" style="border:1px solid #d5cdbf;border-radius:8px;padding:7px;font-size:8px;background:#fffdfa"><option value="open" '+(o.status==='open'?'selected':'')+'>Abierto</option><option value="in_progress" '+(o.status==='in_progress'?'selected':'')+'>En curso</option><option value="resolved" '+(o.status==='resolved'?'selected':'')+'>Resuelto</option></select></div>').join('')+'</div></section></div>';
  }

  function ordersView(){
    return '<div class="page-head"><div><span class="eyebrow">Guest services</span><h1>Pedidos</h1><p>Servicios, consumos y solicitudes asociados al huésped.</p></div></div><section class="card"><div class="list">'+orders.map((o,i) => '<div class="row"><div class="row-main"><strong>'+esc(o.item)+' · '+money(o.amount)+'</strong><small>Hab. '+esc(o.room)+' · '+esc(o.guest)+'</small></div><select data-order="'+i+'" style="border:1px solid #d5cdbf;border-radius:8px;padding:7px;font-size:8px;background:#fffdfa"><option value="pending" '+(o.status==='pending'?'selected':'')+'>Pendiente</option><option value="preparing" '+(o.status==='preparing'?'selected':'')+'>En preparación</option><option value="delivered" '+(o.status==='delivered'?'selected':'')+'>Entregado</option><option value="cancelled" '+(o.status==='cancelled'?'selected':'')+'>Cancelado</option></select></div>').join('')+'</div></section>';
  }

  function financeView(){
    const gross = reservations.reduce((sum,r) => sum + r.total,0);
    const paid = reservations.filter(r => r.status === 'checked_in' || r.status === 'confirmed').reduce((sum,r)=>sum+r.total,0);
    return '<div class="page-head"><div><span class="eyebrow">Caja</span><h1>Finanzas</h1><p>Resumen local de ingresos y movimientos para la nueva arquitectura.</p></div></div><div class="metric-row"><div class="mini"><small>Producción</small><strong>'+money(gross)+'</strong></div><div class="mini"><small>Confirmado</small><strong>'+money(paid)+'</strong></div><div class="mini"><small>Reservas</small><strong>'+reservations.length+'</strong></div><div class="mini"><small>Pedidos</small><strong>'+orders.length+'</strong></div><div class="mini"><small>Moneda</small><strong>CLP</strong></div></div><section class="card" style="margin-top:12px"><div class="section-head"><div><span class="eyebrow">Actividad</span><h3>Movimientos recientes</h3><p>La contabilidad completa se construirá sobre esta capa.</p></div></div><div class="table-wrap"><table class="table"><thead><tr><th>Concepto</th><th>Referencia</th><th>Estado</th><th>Monto</th></tr></thead><tbody>'+orders.map(o => '<tr><td>'+esc(o.item)+'</td><td>Hab. '+esc(o.room)+'</td><td>'+badge(o.status)+'</td><td>'+money(o.amount)+'</td></tr>').join('')+'</tbody></table></div></section>';
  }

  function reportsView(){
    return '<div class="page-head"><div><span class="eyebrow">Inteligencia</span><h1>Reportes</h1><p>Primeros indicadores. Aquí crecerán ADR, RevPAR, canal, estadía y rentabilidad.</p></div></div><div class="grid-3"><section class="card"><span class="eyebrow">Ocupación</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">70%</h2><p style="color:#8a847a;font-size:9px">Base actual de habitaciones ocupadas.</p></section><section class="card"><span class="eyebrow">Ticket promedio</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">'+money(202250)+'</h2><p style="color:#8a847a;font-size:9px">Promedio de producción por reserva.</p></section><section class="card"><span class="eyebrow">Mix de canal</span><h2 style="font:500 33px Georgia,serif;margin:8px 0">50%</h2><p style="color:#8a847a;font-size:9px">Participación directa en la muestra actual.</p></section></div><section class="card" style="margin-top:12px"><div class="section-head"><div><span class="eyebrow">Producción</span><h3>Reservas por canal</h3></div></div><div class="bar-list"><div class="bar"><span>Directo</span><div class="bar-track"><div class="bar-fill" style="width:50%"></div></div><strong>4</strong></div><div class="bar"><span>Booking.com</span><div class="bar-track"><div class="bar-fill" style="width:25%"></div></div><strong>2</strong></div><div class="bar"><span>Expedia</span><div class="bar-track"><div class="bar-fill" style="width:12%"></div></div><strong>1</strong></div><div class="bar"><span>WhatsApp</span><div class="bar-track"><div class="bar-fill" style="width:12%"></div></div><strong>1</strong></div></div></section>';
  }

  function settingsView(){
    return '<div class="page-head"><div><span class="eyebrow">Sistema</span><h1>Configuración</h1><p>La nueva arquitectura centralizará propiedad, usuarios, conexiones y reglas operativas.</p></div></div><div class="grid-2"><section class="card"><div class="section-head"><div><span class="eyebrow">Propiedad</span><h3>H Ocaranza</h3><p>Primera propiedad conectada a LinewareAI.</p></div></div><div class="form-grid"><div class="field"><label>Nombre</label><input value="H Ocaranza"></div><div class="field"><label>Habitaciones</label><input value="10" type="number"></div><div class="field"><label>Ciudad</label><input value="Santiago"></div><div class="field"><label>Moneda</label><select><option>CLP</option><option>USD</option></select></div></div></section><section class="card"><div class="section-head"><div><span class="eyebrow">Plataforma</span><h3>LinewareAI</h3><p>Capas futuras de PMS, conectividad, revenue y automatización.</p></div></div><div class="list"><div class="row"><div class="row-main"><strong>Usuarios y permisos</strong><small>Por construir</small></div><span class="badge gold">Pendiente</span></div><div class="row"><div class="row-main"><strong>Canales</strong><small>Booking · Expedia · otros</small></div><span class="badge gold">Pendiente</span></div><div class="row"><div class="row-main"><strong>Motor de tarifas</strong><small>Habitaciones y planes</small></div><span class="badge gold">Pendiente</span></div></div></section></div>';
  }

  function bindView(){
    document.querySelectorAll('[data-tab-go]').forEach(btn => btn.addEventListener('click',() => selectTab(btn.dataset.tabGo)));
    document.querySelectorAll('[data-room]').forEach(btn => btn.addEventListener('click',() => {
      const room = rooms.find(r => r.n === btn.dataset.room);
      openModal('Habitación '+room.n,'Inventario','<div class="grid-2"><div class="card"><span class="eyebrow">Estado</span><h3 style="margin:7px 0">'+esc(statusLabel(room.status))+'</h3><p style="font-size:9px;color:#777">Piso '+esc(room.floor)+' · Capacidad '+esc(room.cap)+'</p></div><div class="card"><span class="eyebrow">Huésped</span><h3 style="margin:7px 0">'+esc(room.guest || 'Sin huésped')+'</h3><p style="font-size:9px;color:#777">Detalle operativo de esta habitación.</p></div></div>');
    }));
    const resSearch = document.getElementById('res-search');
    if(resSearch) resSearch.addEventListener('input',e => {state.search=e.target.value;render()});
    const guestSearch = document.getElementById('guest-search');
    if(guestSearch) guestSearch.addEventListener('input',e => {state.search=e.target.value;render()});
    const prev = document.getElementById('prev14');
    if(prev) prev.addEventListener('click',()=>{state.from=addDays(state.from,-14);render()});
    const next = document.getElementById('next14');
    if(next) next.addEventListener('click',()=>{state.from=addDays(state.from,14);render()});
    const today = document.getElementById('today14');
    if(today) today.addEventListener('click',()=>{state.from=startOfToday();render()});
    document.querySelectorAll('[data-reservation]').forEach(btn => btn.addEventListener('click',()=>{
      const r = reservations.find(x => String(x.id) === String(btn.dataset.reservation));
      openModal('Reserva '+r.code,'Recepción','<div class="grid-2"><div class="card"><span class="eyebrow">Huésped</span><h3 style="margin:7px 0">'+esc(r.guest)+'</h3><p style="font-size:9px;color:#777">Canal '+esc(r.channel)+'</p></div><div class="card"><span class="eyebrow">Estadía</span><h3 style="margin:7px 0">Hab. '+esc(r.room)+'</h3><p style="font-size:9px;color:#777">Entrada día '+(r.arrival+1)+' · Salida día '+(r.departure+1)+'</p></div></div><div class="notice" style="margin-top:12px;padding:11px;border-left:2px solid #c6a15d;background:#f5efe4;border-radius:0 10px 10px 0;color:#6d665d;font-size:9px">Total reservado: <strong>'+money(r.total)+'</strong></div>');
    }));
    const nr=document.getElementById('new-reservation'); if(nr) nr.addEventListener('click',()=>reservationForm());
    const ng=document.getElementById('new-guest'); if(ng) ng.addEventListener('click',()=>guestForm());
    const ri=document.getElementById('new-issue'); if(ri) ri.addEventListener('click',()=>issueForm());
    const rs=document.getElementById('room-summary'); if(rs) rs.addEventListener('click',()=>openModal('Resumen de habitaciones','Inventario','<div class="metric-row"><div class="mini"><small>Ocupadas</small><strong>'+rooms.filter(r=>r.status==='occupied').length+'</strong></div><div class="mini"><small>Disponibles</small><strong>'+rooms.filter(r=>r.status==='available').length+'</strong></div><div class="mini"><small>Mantención</small><strong>'+rooms.filter(r=>r.status==='maintenance').length+'</strong></div><div class="mini"><small>Bloqueadas</small><strong>'+rooms.filter(r=>r.status==='blocked').length+'</strong></div><div class="mini"><small>Total</small><strong>'+rooms.length+'</strong></div></div>'));
    document.querySelectorAll('[data-housekeeping]').forEach(sel => sel.addEventListener('change',e => {
      const h=housekeeping.find(x=>x.room===e.target.dataset.housekeeping); if(h){h.status=e.target.value;h.note='Actualizado ahora';render()}
    }));
    document.querySelectorAll('[data-maint]').forEach(sel => sel.addEventListener('change',e => {operations[Number(e.target.dataset.maint)].status=e.target.value;render()}));
    document.querySelectorAll('[data-order]').forEach(sel => sel.addEventListener('change',e => {orders[Number(e.target.dataset.order)].status=e.target.value;render()}));
  }

  function reservationForm(){
    openModal('Nueva reserva','Recepción','<form id="reservation-form"><div class="form-grid"><div class="field"><label>Huésped</label><input name="guest" required></div><div class="field"><label>Habitación</label><select name="room">'+rooms.filter(r=>r.status==='available').map(r=>'<option>'+esc(r.n)+'</option>').join('')+'</select></div><div class="field"><label>Canal</label><select name="channel"><option>Directo</option><option>Booking.com</option><option>Expedia</option><option>WhatsApp</option></select></div><div class="field"><label>Total</label><input name="total" type="number" min="0" value="120000"></div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn">Crear reserva</button></div></form>');
    document.getElementById('reservation-form').addEventListener('submit',e=>{
      e.preventDefault();const f=e.target;
      reservations.push({id:Date.now(),code:'OC-'+(1055+reservations.length),guest:f.guest.value,room:f.room.value,arrival:3,departure:5,status:'confirmed',channel:f.channel.value,total:Number(f.total.value||0)});
      closeModal();render();
    });
  }

  function guestForm(){
    openModal('Nuevo huésped','CRM','<form id="guest-form"><div class="form-grid"><div class="field"><label>Nombre</label><input name="name" required></div><div class="field"><label>Usuario</label><input name="username" required></div><div class="field"><label>Habitación</label><select name="room">'+rooms.map(r=>'<option>'+esc(r.n)+'</option>').join('')+'</select></div><div class="field"><label>Estado</label><select name="status"><option value="confirmed">Confirmado</option><option value="active">Activo</option></select></div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn">Guardar huésped</button></div></form>');
    document.getElementById('guest-form').addEventListener('submit',e=>{
      e.preventDefault();const f=e.target;guests.unshift({name:f.name.value,username:f.username.value,room:f.room.value,stay:'Nueva estadía',status:f.status.value});closeModal();state.search='';render();
    });
  }

  function issueForm(){
    openModal('Nueva incidencia','Mantenimiento','<form id="issue-form"><div class="form-grid"><div class="field"><label>Título</label><input name="title" required placeholder="Ej. Fuga en ducha"></div><div class="field"><label>Habitación</label><select name="room">'+rooms.map(r=>'<option>'+esc(r.n)+'</option>').join('')+'</select></div><div class="field full"><label>Descripción</label><textarea name="description" placeholder="Describe el problema."></textarea></div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn">Crear incidencia</button></div></form>');
    document.getElementById('issue-form').addEventListener('submit',e=>{
      e.preventDefault();const f=e.target;operations.unshift({title:f.title.value,room:f.room.value,priority:'Normal',status:'open'});closeModal();selectTab('operations');
    });
  }

  function openModal(title,kicker,body){
    modalTitle.textContent=title;modalKicker.textContent=kicker;modalBody.innerHTML=body;modal.classList.add('open');modal.setAttribute('aria-hidden','false');
  }

  function closeModal(){
    modal.classList.remove('open');modal.setAttribute('aria-hidden','true');
  }

  renderShell();
  render();
})();